import type { EventSource } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-manager";
import {
    PLUGIN_NAME,
    EVENT_SOURCE_ID,
    CONTRIBUTION_PURCHASED_EVENT_ID,
    GIFT_CROWDFUNDED_EVENT_ID,
    GIFT_PURCHASED_EVENT_ID
} from "../constants";

export const ThroneEventSource: EventSource = {
    id: EVENT_SOURCE_ID,
    name: PLUGIN_NAME,
    events: [
        {
            id: CONTRIBUTION_PURCHASED_EVENT_ID,
            name: `${PLUGIN_NAME}: Contribution Purchased`,
            description: "When someone makes a contribution toward a Throne wishlist item",
            activityFeed: {
                icon: "fad fa-crown",
                getMessage: (eventData) => {
                    return `Throne: **${eventData.gifterUsername}** contributed **${eventData.amount} ${eventData.currency}** toward **${eventData.itemName}**!`
                }
            },
            manualMetadata: {
                gifterUsername: "Firebot",
                message: "Enjoy the stuff!",
                itemName: "Fancy Headphones",
                itemThumbnailUrl: "",
                amount: 50,
                currency: "USD"
            }
        },
        {
            id: GIFT_CROWDFUNDED_EVENT_ID,
            name: `${PLUGIN_NAME}: Gift Crowdfunded`,
            description: "When an item on your Throne wishlist has been fully crowdfunded",
            activityFeed: {
                icon: "fad fa-crown",
                getMessage: (eventData) => {
                    return `Throne: **${eventData.itemName}** has been fully crowdfunded!`
                }
            },
            manualMetadata: {
                itemName: "Fancy Headphones",
                itemThumbnailUrl: "",
                price: 200,
                currency: "USD",
                isSurpriseGift: false
            }
        },
        {
            id: GIFT_PURCHASED_EVENT_ID,
            name: `${PLUGIN_NAME}: Gift Purchased`,
            description: "When someone purchases you a gift from Throne",
            activityFeed: {
                icon: "fad fa-crown",
                getMessage: (eventData) => {
                    return `Throne: **${eventData.gifterUsername}** bought you **${eventData.itemName}**!`
                }
            },
            manualMetadata: {
                gifterUsername: "Firebot",
                message: "Enjoy the stuff!",
                itemName: "Fancy Headphones",
                itemThumbnailUrl: "",
                price: 200,
                currency: "USD",
                isSurpriseGift: false
            }
        }
    ]
}