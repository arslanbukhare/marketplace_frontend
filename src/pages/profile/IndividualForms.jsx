import React from 'react';
import IndividualBasicInfoForm from './IndividualBasicInfoForm';
import IndividualAddressForm from './IndividualAddressForm';
import IndividualPhoneNumbersForm from './IndividualPhoneNumbersForm';

export default function IndividualForms({ activeSection }) {
  switch (activeSection) {
    case 'basic-info':
      return <IndividualBasicInfoForm />;
    case 'my-address':
      return <IndividualAddressForm />;
    case 'phone-numbers':
      return <IndividualPhoneNumbersForm />;
    default:
      return <p className="text-gray-500">Select a section to display.</p>;
  }
}
