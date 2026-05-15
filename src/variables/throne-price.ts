import type { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import type { ThroneGiftPurchasedEventData } from "../throne-types";
import {
    VARIABLE_PREFIX,
    EVENT_SOURCE_ID,
    GIFT_CROWDFUNDED_EVENT_ID,
    GIFT_PURCHASED_EVENT_ID
} from "../constants";

export const ThronePriceVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}Price`,
        description: "The raw price of the Throne gift.",
        possibleDataOutput: [ "number" ],
        categories: [ "trigger based", "numbers" ],
        triggers: {
            event: [
                `${EVENT_SOURCE_ID}:${GIFT_CROWDFUNDED_EVENT_ID}`,
                `${EVENT_SOURCE_ID}:${GIFT_PURCHASED_EVENT_ID}`
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return ((trigger.metadata?.eventData as ThroneGiftPurchasedEventData)?.price ?? 0) / 100;
    }
};