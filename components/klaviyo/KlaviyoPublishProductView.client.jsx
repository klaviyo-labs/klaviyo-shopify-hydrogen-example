import {useEffect} from 'react';
import {useProduct, ClientAnalytics} from '@shopify/hydrogen';

export default function KlaviyoPublishProductView() {
  const product = useProduct();
  useEffect(() => {
    ClientAnalytics.publish(
      ClientAnalytics.eventNames.VIEWED_PRODUCT,
      true,
      product,
    );
  });
  return null;
}
