import type { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import type { ThroneEventData } from "../throne-types";
import {
    VARIABLE_PREFIX,
    EVENT_SOURCE_ID,
    CONTRIBUTION_PURCHASED_EVENT_ID,
    GIFT_CROWDFUNDED_EVENT_ID,
    GIFT_PURCHASED_EVENT_ID
} from "../constants";

export const ThroneItemThumbnailUrlVariable: ReplaceVariable = {
    definition: {
        handle: `${VARIABLE_PREFIX}ItemThumbnailUrl`,
        description: "The URL of the thumbnail image for the Throne item purchased/contributed to.",
        possibleDataOutput: [ "text" ],
        categories: [ "trigger based", "text" ],
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
        return (trigger.metadata?.eventData as ThroneEventData)?.itemThumbnailUrl ?? "";
    }
};