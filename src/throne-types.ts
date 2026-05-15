type ThroneEventType = 
    | "contribution_purchased"
    | "gift_crowdfunded"
    | "gift_purchased"

type ThronePayloadBase = {
    "contract_version": string;
    "event_id": string;
    "event_type": ThroneEventType;
}

type ThroneContributionPurchasedPayload = ThronePayloadBase & {
    "event_type": "contribution_purchased";
    "data": {
        "creator_id": string;
        "creator_username": string;
        "gifter_username": string;
        "message"?: string;
        "item_name": string;
        "item_thumbnail_url": string;
        "amount": number;
        "currency": string;
    }
}

type ThroneGiftCrowdfundedPayload = ThronePayloadBase & {
    "event_type": "gift_crowdfunded";
    "data": {  
        "creator_id": string;
        "creator_username": string;
        "item_name": string;
        "item_thumbnail_url": string;
        "price": number;
        "currency": string;
        "is_surprise_gift": boolean;
    }
}

type ThroneGiftPurchasedPayload = ThronePayloadBase & {
    "event_type": "gift_purchased";
    "data": { 
        "creator_id": string;
        "creator_username": string;
        "gifter_username": string;
        "message"?: string;
        "item_name": string;
        "item_thumbnail_url": string;
        "price": number;
        "currency": string;
        "is_surprise_gift": boolean;
    }
}

export type ThronePayload = 
    | ThroneContributionPurchasedPayload
    | ThroneGiftCrowdfundedPayload
    | ThroneGiftPurchasedPayload


export type ThroneBaseEventData = {
    contractVersion: string;
    eventId: string;
    eventType?: ThroneEventType;
}

export type ThroneContributionPurchasedEventData = ThroneBaseEventData & {
    eventType: "contribution_purchased";
    creatorId: string;
    creatorUsername: string;
    gifterUsername: string;
    message?: string;
    itemName: string;
    itemThumbnailUrl: string;
    amount: number;
    currency: string;
}

export type ThroneGiftCrowdfundedEventData = ThroneBaseEventData & {
    eventType: "gift_crowdfunded";
    creatorId: string;
    creatorUsername: string;
    itemName: string;
    itemThumbnailUrl: string;
    price: number;
    currency: string;
    isSurpriseGift: boolean;
}

export type ThroneGiftPurchasedEventData = ThroneBaseEventData & {
    eventType: "gift_purchased";
    creatorId: string;
    creatorUsername: string;
    gifterUsername: string;
    message?: string;
    itemName: string;
    itemThumbnailUrl: string;
    price: number;
    currency: string;
    isSurpriseGift: boolean;
}

export type ThroneEventData = 
    | ThroneContributionPurchasedEventData
    | ThroneGiftCrowdfundedEventData
    | ThroneGiftPurchasedEventData