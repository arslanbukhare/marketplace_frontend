import React from 'react';
import CompanyBasicInfoForm from './CompanyBasicInfoForm';
import CompanyAddressForm from './CompanyAddressForm';
import CompanyTradeLicenseForm from './CompanyTradeLicenseForm';
import CompanyWebsiteContactForm from './CompanyWebsiteContactForm';

export default function CompanyForms({ activeSection }) {
   switch (activeSection) {
       case 'company-info':
         return <CompanyBasicInfoForm />;
       case 'company-address':
         return <CompanyAddressForm />;
        case 'trade-license':
          return <CompanyTradeLicenseForm />;
          case 'website-contact':
          return <CompanyWebsiteContactForm />;
       default:
         return <p className="text-gray-500">Select a section to display.</p>;
     }
}
