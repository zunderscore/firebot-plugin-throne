import type { Firebot, ScriptModules } from "@crowbartools/firebot-custom-scripts-types";
import type { WebhookConfig } from "@crowbartools/firebot-custom-scripts-types/types/modules/webhook-manager";
import type {
    ThronePayload,
    ThroneEventData
} from "./throne-types";

import {
    PLUGIN_ID,
    PLUGIN_NAME,
    EVENT_SOURCE_ID,
    CONTRIBUTION_PURCHASED_EVENT_ID,
    GIFT_CROWDFUNDED_EVENT_ID,
    GIFT_PURCHASED_EVENT_ID,
} from "./constants";

import { ThroneEventSource } from "./events";
import { ThroneVariables } from "./variables";

const packageInfo = require("../package.json");

let logger: ScriptModules["logger"];
let eventManager: ScriptModules["eventManager"];
let replaceVariableManager: ScriptModules["replaceVariableManager"];
let webhookManager: ScriptModules["webhookManager"];
let frontendCommunicator: ScriptModules["frontendCommunicator"];

let copyWebhookUrlEventId: string = undefined;

const logDebug = (msg: string, ...meta: any[]) => logger.debug(`[${PLUGIN_NAME}] ${msg}`, ...meta);
const logInfo = (msg: string, ...meta: any[]) => logger.info(`[${PLUGIN_NAME}] ${msg}`, ...meta);
const logWarn = (msg: string, ...meta: any[]) => logger.warn(`[${PLUGIN_NAME}] ${msg}`, ...meta);
const logError = (msg: string, ...meta: any[]) => logger.error(`[${PLUGIN_NAME}] ${msg}`, ...meta);

const processWebhook = ({ config, payload }: { config: WebhookConfig, payload: ThronePayload }) => {
    logDebug(`Got webhook for ${config.name}`);
    if (config.name !== PLUGIN_NAME) {
        logDebug(`Received unknown webhook event for ${config.name}. Ignoring.`);
        return;
    }

    let eventName: string, eventData: ThroneEventData;
    let baseEventData = {
        contractVersion: payload.contract_version,
        eventId: payload.event_id
    };

    logDebug(`Webhook type: ${payload.event_type}`);

    switch (payload.event_type) {
        case "contribution_purchased":
            eventName = CONTRIBUTION_PURCHASED_EVENT_ID;
            eventData = {
                eventType: payload.event_type,
                ...baseEventData,
                creatorId: payload.data.creator_id,
                creatorUsername: payload.data.creator_username,
                gifterUsername: payload.data.gifter_username,
                message: payload.data.message,
                itemName: payload.data.item_name,
                itemThumbnailUrl: payload.data.item_thumbnail_url,
                amount: payload.data.amount,
                currency: payload.data.currency
            };
            break;
            
        case "gift_crowdfunded":
            eventName = GIFT_CROWDFUNDED_EVENT_ID;
            eventData = {
                eventType: payload.event_type,
                ...baseEventData,
                creatorId: payload.data.creator_id,
                creatorUsername: payload.data.creator_username,
                itemName: payload.data.item_name,
                itemThumbnailUrl: payload.data.item_thumbnail_url,
                price: payload.data.price,
                currency: payload.data.currency,
                isSurpriseGift: payload.data.is_surprise_gift
            };
            break;
            
        case "gift_purchased":
            eventName = GIFT_PURCHASED_EVENT_ID;
            eventData = {
                eventType: payload.event_type,
                ...baseEventData,
                creatorId: payload.data.creator_id,
                creatorUsername: payload.data.creator_username,
                gifterUsername: payload.data.gifter_username,
                message: payload.data.message,
                itemName: payload.data.item_name,
                itemThumbnailUrl: payload.data.item_thumbnail_url,
                price: payload.data.price,
                currency: payload.data.currency,
                isSurpriseGift: payload.data.is_surprise_gift
            };
            break;

        default:
            logDebug(`Unknown event type ${(payload as any).event_type}`);
            return;
    }

    logDebug(`Triggering event ${eventName}`);
    eventManager.triggerEvent(EVENT_SOURCE_ID, eventName, eventData);
};

const script: Firebot.CustomScript<{
    copyWebhookUrl: void;
}> = {
    getScriptManifest: () => {
        return {
            name: PLUGIN_NAME,
            description: packageInfo.description,
            author: packageInfo.author,
            version: packageInfo.version,
            firebotVersion: "5",
            startupOnly: true,
            initBeforeShowingParams: true
        };
    },
    getDefaultParameters: () => ({
        copyWebhookUrl: {
            type: "button",
            title: "Webhook URL",
            description: "Copy this URL and add it to the **Subscriber URLs** list in your Throne account under Integrations > Webhooks.",
            backendEventName: `${PLUGIN_ID}:copy-webhook-url`,
            buttonText: "Copy URL",
            icon: "fa-copy",
            sync: true
        }
    }),
    run: ({ modules }) => {
        ({
            logger,
            eventManager,
            frontendCommunicator,
            replaceVariableManager,
            webhookManager
        } = modules);

        logInfo(`Starting ${PLUGIN_NAME} plugin...`);

        if (webhookManager == null) {
            logError(`Cannot start ${PLUGIN_NAME} plugin. You must be on Firebot 5.65 or higher.`);
            return;
        }

        logDebug("Registering events...");
        eventManager.registerEventSource(ThroneEventSource);

        logDebug("Registering variables...");
        for (const variable of ThroneVariables) {
            replaceVariableManager.registerReplaceVariable(variable);
        }

        logDebug("Registering frontend listener");
        copyWebhookUrlEventId = frontendCommunicator.on(`${PLUGIN_ID}:copy-webhook-url`, () => {
            frontendCommunicator.send("copy-to-clipboard", { 
                text: webhookManager.getWebhookUrl(PLUGIN_NAME),
            });
        });

        logDebug("Registering webhook listener...");
        webhookManager.on("webhook-received", processWebhook);

        logDebug("Checking for webhook...");
        let webhook = webhookManager.getWebhook(PLUGIN_NAME);

        if (webhook == null) {
            logDebug("Webhook not found. Registering...");

            webhook = webhookManager.saveWebhook(PLUGIN_NAME);
        }

        if (webhook == null) {
            logError("Something went wrong while registering webhook. Exiting.");
            return;
        }

        logDebug("Webhook registered");
        logInfo("Plugin ready. Listening for events.");
    },
    stop: (uninstalling: boolean) => {
        logDebug(`Stopping ${PLUGIN_NAME} plugin`);

        logDebug("Stopping webhook listener");
        webhookManager.removeListener("webhook-received", processWebhook);

        logDebug("Unregistering frontend listener");
        frontendCommunicator.off(`${PLUGIN_ID}:copy-webhook-url`, copyWebhookUrlEventId);
        
        logDebug("Unregistering variables...");
        for (const variable of ThroneVariables) {
            replaceVariableManager.unregisterReplaceVariable(variable.definition.handle);
        }
        
        logDebug("Unregistering events...");
        eventManager.unregisterEventSource(PLUGIN_ID);

        if (uninstalling === true) {
            logDebug("Removing webhook...");

            webhookManager.deleteWebhook(PLUGIN_NAME);

            logInfo("Plugin uninstalled");
        } else {
            logInfo("Plugin stopped");
        }
    }
};

export default script;