import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/shared/Header';
import IndividualForms from './IndividualForms';
import CompanyForms from './CompanyForms';
import {
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { user } = useAuth();
  const role = user?.role;

  const sidebar = role === 'company'
    ? [
        {
          group: 'Company Settings',
          children: [
            { key: 'company-info', label: 'Company Info' },
            { key: 'company-address', label: 'Address' },
            { key: 'trade-license', label: 'Trade License' },
          ],
        },
        {
          group: 'Website & Contact',
          children: [{ key: 'website-contact', label: 'Website & Contact' }],
        },
      ]
    : [
        {
          group: 'Profile Settings',
          children: [
            { key: 'basic-info', label: 'Basic Info' },
            { key: 'my-address', label: 'My Address' },
          ],
        },
        {
          group: 'Phone Numbers',
          children: [{ key: 'phone-numbers', label: 'Phone Numbers' }],
        },
      ];

  const [active, setActive] = useState(
    role === 'company' ? 'company-info' : 'basic-info'
  );

  const initialOpenGroups = sidebar.reduce((acc, section) => {
    acc[section.group] = true;
    return acc;
  }, {});
  const [openGroups, setOpenGroups] = useState(initialOpenGroups);

  const toggleGroup = (group) => {
    setOpenGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Header />
      <div className="flex p-4 space-x-4">
        <aside className="w-72 bg-white rounded-lg shadow-md p-4">
          <ul className="menu w-full">
            {sidebar.map((section) => (
              <li key={section.group} className="mb-2">
                <div
                  className="flex items-center justify-between cursor-pointer px-2 py-2 rounded-lg hover:bg-base-200"
                  onClick={() => toggleGroup(section.group)}
                >
                  <span className="font-semibold">{section.group}</span>
                  {openGroups[section.group] ? (
                    <ChevronDownIcon className="w-4 h-4" />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4" />
                  )}
                </div>

                {openGroups[section.group] && (
                  <ul className="mt-1 ml-4 space-y-1">
                    {section.children.map((item) => (
                      <li key={item.key}>
                        <button
                          onClick={() => setActive(item.key)}
                          className={`w-full text-left px-3 py-2 rounded-lg ${
                            active === item.key
                              ? 'bg-primary text-primary-content'
                              : 'hover:bg-base-200'
                          }`}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 bg-white rounded-lg shadow-md p-6">
          {active ? (
            role === 'company' ? (
              <CompanyForms activeSection={active} />
            ) : (
              <IndividualForms activeSection={active} />
            )
          ) : (
            <p className="text-center text-gray-500">
              Select a section from the sidebar
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
