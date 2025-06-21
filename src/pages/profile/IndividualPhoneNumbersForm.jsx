import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function IndividualPhoneNumbersForm() {
  const { user } = useAuth();

  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input type="text" defaultValue={user?.phone || ''} className="w-full border p-2 rounded" />
      </div>
    </form>
  );
}
