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
        icon: {
            type: "custom",
            url: "data:image/png;base64,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",
            backgroundColor: "#0b0b2b"
        },
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