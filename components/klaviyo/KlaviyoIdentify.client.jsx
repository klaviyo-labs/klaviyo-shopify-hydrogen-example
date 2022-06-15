import {useEffect} from 'react';
let init = false;

export default function KlaviyoIdentify(customer) {
  useEffect(() => {
    if (!init) {
      init = true;
      var _learnq = window._learnq || [];
      _learnq.push([
        'identify',
        {
          $email: customer.customer.email,
          $first_name: customer.customer.firstName,
          $last_name: customer.customer.lastName,
        },
      ]);
    }
  });
  return null;
}
