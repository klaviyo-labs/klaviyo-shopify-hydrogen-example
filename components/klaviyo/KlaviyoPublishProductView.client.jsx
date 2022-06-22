import {useEffect} from 'react';
import {useProductOptions, ClientAnalytics} from '@shopify/hydrogen';

export default function KlaviyoPublishProductView(product) {
  const variant = useProductOptions();
  const payload = {...product, ...variant};
  useEffect(() => {
    ClientAnalytics.publish(
      ClientAnalytics.eventNames.VIEWED_PRODUCT,
      true,
      payload,
    );
  });
  return null;
}
