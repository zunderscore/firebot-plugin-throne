# Throne Plugin for Firebot

This plugin adds support for Throne events and related variables to Firebot.

## Prerequisites

- Firebot 5.65 or higher

## Setup

1. Copy the `firebot-throne.js` file into your Firebot profile's `scripts` folder (e.g. `%appdata%\Firebot\v5\profiles\Main Profile\scripts`)
1. Go to Settings > Scripts in Firebot
1. Click on "Manage Startup Scripts"
1. Click "Add New Script"
1. Select the `firebot-throne.js` file from the dropdown list
1. Click "Add & Configure"
1. Click the "Copy URL" button under "Webhook URL", click "Save", then close the "Startup Scripts" modal
1. In your Throne account settings, under Integrations > Webhooks, enabled webhooks and add the copied URL to the **Subscriber URLs** list, then and click "Save Settings"

## Events

New events:
- **Throne: Contribution Purchased**
- **Throne: Gift Crowdfunded**
- **Throne: Gift Purchased**

## Variables

New variables:
- `$throneAmount`
- `$throneCurrency`
- `$throneGifter`
- `$throneIsSurpriseGift`
- `$throneItemName`
- `$throneItemThumbnailUrl`
- `$throneMessage`
- `$thronePrice`