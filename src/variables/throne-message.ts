import type { ReplaceVariable } from "@crowbartools/firebot-types";
import type { ThroneGiftPurchasedEventData } from "../throne-types";
import {
    VARIABLE_PREFIX,
    EVENT_SOURCE_ID,
    CONTRIBUTION_PURCHASED_EVENT_ID,
    GIFT_PURCHASED_EVENT_ID
} from "../constants";

export const ThroneMessageVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}Message`,
        description: "The message sent with the Throne purchase, if any.",
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
        return (trigger.metadata?.eventData as ThroneGiftPurchasedEventData)?.message ?? "";
    }
};