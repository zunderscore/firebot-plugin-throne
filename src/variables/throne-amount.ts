import type { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import type { ThroneContributionPurchasedEventData } from "../throne-types";
import {
    VARIABLE_PREFIX,
    EVENT_SOURCE_ID,
    CONTRIBUTION_PURCHASED_EVENT_ID
} from "../constants";

export const ThroneAmountVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}Amount`,
        description: "The amount of the Throne contribution.",
        possibleDataOutput: [ "number" ],
        categories: [ "trigger based", "numbers" ],
        triggers: {
            event: [
                `${EVENT_SOURCE_ID}:${CONTRIBUTION_PURCHASED_EVENT_ID}`
            ],
            manual: true
        }
    },
    evaluator: async (trigger) => {
        return ((trigger.metadata?.eventData as ThroneContributionPurchasedEventData)?.amount ?? 0) / 100;
    }
};