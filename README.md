# klaviyo-shopify-hydrogen-example-code

This repository contains sample code components for enabling client side tracking functionality for the Klaviyo/Shopify integration, specifically onsite tracking for a Hydrogen storefront to supplement the prebuilt Klaviyo/Shopify integration that relies the Shopify backend. This guide assume you have read the [Integrate with a Shopify Hydrogen store](https://developers.klaviyo.com/en/docs/integrate-with-a-shopify-hydrogen-store) developer guide and have already connected Klaviyo’s native Shopify integration.

The example code is based on the [Hydrogen Demo Store](https://shopify.dev/custom-storefronts/hydrogen/templates#demo-store-template) as an easy-to-use baseline for any Hydrogen-powered storefront.

## Adding the Code

Copy the `klaviyo` folder into the `src/components` directory of your root project folder. This directory contains three client files.
   - `KlaviyoOnsite.client.jsx` - Enables loading the Klaviyo onsite script for track/identify requests and sign-up forms. Also enables subscriptions to various on site analytics. Make sure to change the `API_KEY` to your Klaviyo _public_ API key.
   - `KlaviyoPublishProductView.client.jsx` - Publishes a product view metric. To be added on project page.
   - `KlaviyoIdentify.client.jsx` - Enables Klaviyo to identify a user for onsite event tracking.

## Adding the Initial Script

In `src/components/Layout.server.jsx` import the KlaviyoOnsite component and add at the end of the `<LocalizationProvider />` tag:

```javascript
import KlaviyoOnsite from './klaviyo/KlaviyoOnsite.client';
// Omitted
export default function Layout({children, hero}) {
    // Omitted
    return (
        <LocalizationProvider preload="*">
            Omitted
            <KlaviyoOnsite />
        </LocalizationProvider>
    );
}
```

## Adding Product Publishing for `Viewed Product` and `Viewed Item` Tracking

The example code makes use of [Hydrogen Analytics](https://shopify.dev/custom-storefronts/hydrogen/framework/analytics). `VIEWED_PRODUCT` event to be triggered, which can be done with Hydrogen's built in `ClientAnalytics`. For example in `src/components/ProductDetails.client.jsx` add the following function and add to the end of `ProductProvider`:

```javascript
import KlaviyoPublishProductView from './klaviyo/KlaviyoPublishProductView.client';
// Omitted
export default function ProductDetails({product}) {
    // Omitted
    return (
    <>
        <ProductProvider data={product} initialVariantId={initialVariant.id}>
            // Omitted
            <KlaviyoPublishProductView />
        </ProductProvider>
    </>
    );
}
```

_Note_: The product context is assumed to be at the variant product level to have access to properties such as `selectedVariant`.

### Adding Collections to Product Query

Klaviyo also tracks product collection titles, which is not part of the example GraphQL query in the demo-store. If you're using the Shopify [demo-store](https://github.com/Shopify/hydrogen/blob/v1.x-2022-07/templates/demo-store/src/routes/products/%5Bhandle%5D.server.jsx), the addition would look like the following:

```javascript
const QUERY = gql`
    query product(
        $country: CountryCode
        $language: LanguageCode
        $handle: String!
    ) @inContext(country: $country, language: $language) {
        product: product(handle: $handle) {
            # Omitted
            # Adding first 10 collection titles for given product to query
            collections(first: 10) {
                edges {
                    node {
                        title
                    }
                }
            }
            # Omitted
        }
    }
    `;
```

## Identifying Users
Klaviyo has multiple ways to identify users for onsite tracking. One such way is when the account details pages is accessed/the user logs in or creates an account. In `src/components/account/AccountDetails.server.jsx` add the `KlaviyoIdentify` component:

```javascript
import KlaviyoIdentify from '../klaviyo/KlaviyoIdentify.client';
// Omitted

export default function AccountDetails({customerAccessToken}) {
    // Omitted
    return (
        <Layout>
            // Omitted
        <KlaviyoIdentify customer={customer} />
        </Layout>
    );
}