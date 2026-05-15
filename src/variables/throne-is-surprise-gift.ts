import type { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import type { ThroneGiftPurchasedEventData } from "../throne-types";
import {
    VARIABLE_PREFIX,
    EVENT_SOURCE_ID,
    GIFT_CROWDFUNDED_EVENT_ID,
    GIFT_PURCHASED_EVENT_ID
} from "../constants";

export const ThroneIsSurpriseGiftVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}IsSurpriseGift`,
        description: "Returns `true` if the Throne gift is a surprise gift, or `false` otherwise.",
        possibleDataOutput: [ "bool" ],
        categories: [ "trigger based" ],
        triggers: {
            event: [
                `${EVENT_SOURCE_ID}:${GIFT_CROWDFUNDED_EVENT_ID}`,
                `${EVENT_SOURCE_ID}:${GIFT_PURCHASED_EVENT_ID}`
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return (trigger.metadata?.eventData as ThroneGiftPurchasedEventData)?.isSurpriseGift ?? false;
    }
};