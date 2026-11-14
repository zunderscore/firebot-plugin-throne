import type { ReplaceVariable } from "@crowbartools/firebot-types";
import type { ThroneGiftPurchasedEventData } from "../throne-types";
import {
    VARIABLE_PREFIX,
    EVENT_SOURCE_ID,
    CONTRIBUTION_PURCHASED_EVENT_ID,
    GIFT_PURCHASED_EVENT_ID
} from "../constants";

export const ThroneGifterVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}Gifter`,
        description: "The username of the viewer who contributed to/purchased the Throne item.",
        possibleDataOutput: ["text"],
        categories: ["trigger based", "text"],
        triggers: {
            event: [
                `${EVENT_SOURCE_ID}:${CONTRIBUTION_PURCHASED_EVENT_ID}`,
                `${EVENT_SOURCE_ID}:${GIFT_PURCHASED_EVENT_ID}`
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return (trigger.metadata?.eventData as ThroneGiftPurchasedEventData)?.gifterUsername ?? "";
    }
};