import firebot, { Plugin } from "@crowbartools/firebot-types";
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
import { ScriptWebhookEventHandler } from "@crowbartools/firebot-types/types/script-api";

const packageInfo = require("../package.json");

const processWebhook: ScriptWebhookEventHandler = ({ webhook, payload }) => {
    const thronePayload = payload as ThronePayload;

    firebot.logger.debug(`Got webhook for ${webhook.name}`);
    if (webhook.name !== PLUGIN_NAME) {
        firebot.logger.debug(`Received unknown webhook event for ${webhook.name}. Ignoring.`);
        return;
    }

    let eventName: string, eventData: ThroneEventData;
    let baseEventData = {
        contractVersion: thronePayload.contract_version,
        eventId: thronePayload.event_id
    };

    firebot.logger.debug(`Webhook type: ${thronePayload.event_type}`);

    switch (thronePayload.event_type) {
        case "contribution_purchased":
            eventName = CONTRIBUTION_PURCHASED_EVENT_ID;
            eventData = {
                eventType: thronePayload.event_type,
                ...baseEventData,
                creatorId: thronePayload.data.creator_id,
                creatorUsername: thronePayload.data.creator_username,
                gifterUsername: thronePayload.data.gifter_username,
                message: thronePayload.data.message,
                itemName: thronePayload.data.item_name,
                itemThumbnailUrl: thronePayload.data.item_thumbnail_url,
                amount: thronePayload.data.amount,
                currency: thronePayload.data.currency
            };
            break;

        case "gift_crowdfunded":
            eventName = GIFT_CROWDFUNDED_EVENT_ID;
            eventData = {
                eventType: thronePayload.event_type,
                ...baseEventData,
                creatorId: thronePayload.data.creator_id,
                creatorUsername: thronePayload.data.creator_username,
                itemName: thronePayload.data.item_name,
                itemThumbnailUrl: thronePayload.data.item_thumbnail_url,
                price: thronePayload.data.price,
                currency: thronePayload.data.currency,
                isSurpriseGift: thronePayload.data.is_surprise_gift
            };
            break;

        case "gift_purchased":
            eventName = GIFT_PURCHASED_EVENT_ID;
            eventData = {
                eventType: thronePayload.event_type,
                ...baseEventData,
                creatorId: thronePayload.data.creator_id,
                creatorUsername: thronePayload.data.creator_username,
                gifterUsername: thronePayload.data.gifter_username,
                message: thronePayload.data.message,
                itemName: thronePayload.data.item_name,
                itemThumbnailUrl: thronePayload.data.item_thumbnail_url,
                price: thronePayload.data.price,
                currency: thronePayload.data.currency,
                isSurpriseGift: thronePayload.data.is_surprise_gift
            };
            break;

        default:
            firebot.logger.debug(`Unknown event type ${(payload as any).event_type}`);
            return;
    }

    firebot.logger.debug(`Triggering event ${eventName}`);
    firebot.events.trigger(EVENT_SOURCE_ID, eventName, eventData);
};

const plugin: Plugin<{
    copyWebhookUrl: void;
}> = {
    manifest: {
        type: "plugin",
        icon: "fa-crown",
        name: PLUGIN_NAME,
        description: packageInfo.description,
        author: packageInfo.author,
        version: packageInfo.version,
        repo: "https://github.com/zunderscore/firebot-plugin-throne",
        minimumFirebotVersion: { major: 5, minor: 67 },
        initBeforeShowingParams: true,
    },
    parametersSchema: [
        {
            name: "copyWebhookUrl",
            type: "button",
            title: "Webhook URL",
            description: "Copy this URL and add it to the **Subscriber URLs** list in your Throne account under Integrations > Webhooks.",
            backendEventName: `${PLUGIN_ID}:copy-webhook-url`,
            buttonText: "Copy Webhook URL"
        }
    ],
    registers: {
        eventSources: [ThroneEventSource],
        variables: ThroneVariables,
        webhooks: {
            handler: processWebhook,
            webhookNames: [
                PLUGIN_NAME
            ]
        }
    },
    onLoad: () => {
        firebot.frontendCommunicator.on(`${PLUGIN_ID}:copy-webhook-url`, () => {
            firebot.frontendCommunicator.send("copy-to-clipboard", {
                text: firebot.webhooks.getUrl(PLUGIN_NAME),
            });
        });
    }
}

export default plugin;