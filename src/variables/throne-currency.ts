import type { ReplaceVariable } from "@crowbartools/firebot-types";
import type { ThroneEventData } from "../throne-types";
import {
    VARIABLE_PREFIX,
    EVENT_SOURCE_ID,
    CONTRIBUTION_PURCHASED_EVENT_ID,
    GIFT_CROWDFUNDED_EVENT_ID,
    GIFT_PURCHASED_EVENT_ID
} from "../constants";

export const ThroneCurrencyVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}Currency`,
        description: "The currency of the Throne transaction (e.g. USD).",
        possibleDataOutput: ["text"],
        categories: ["trigger based", "text"],
        triggers: {
            event: [
                `${EVENT_SOURCE_ID}:${CONTRIBUTION_PURCHASED_EVENT_ID}`,
                `${EVENT_SOURCE_ID}:${GIFT_CROWDFUNDED_EVENT_ID}`,
                `${EVENT_SOURCE_ID}:${GIFT_PURCHASED_EVENT_ID}`
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return (trigger.metadata?.eventData as ThroneEventData)?.currency ?? "";
    }
};