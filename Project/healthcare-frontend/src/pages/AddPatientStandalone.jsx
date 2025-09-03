import React, { useState } from 'react';
import {
  UserIcon,
  PhoneIcon,
  MailIcon,
  CalendarIcon,
  LocationMarkerIcon,
  PlusIcon,
  XIcon
} from '@heroicons/react/outline';

// Helper for nested state updates
const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const deep = keys.reduce((acc, key) => {
    if (!acc[key]) acc[key] = {};
    return acc[key];
  }, obj);
  deep[lastKey] = value;
};

const initialState = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
  bloodType: '',
  emergencyContact: {
    name: '',
    relationship: '',
    phone: ''
  },
  medicalHistory: [],
  allergies: [],
  medications: [],
  insurance: {
    provider: '',
    policyNumber: '',
    groupNumber: ''
  },
  status: 'active'
};

const AddPatientStandalone = () => {
  const [form, setForm] = useState(initialState);
  const [newMedical, setNewMedical] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev };
      if (name.includes('.')) {
        setNestedValue(updated, name, value);
      } else {
        updated[name] = value;
      }
      return updated;
    });
  };

  const addTag = (field, value, setter) => {
    if (value.trim()) {
      setForm(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
      setter('');
    }
  };
  const removeTag = (field, idx) => {
    setForm(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== idx) }));
  };

  const InputField = ({ label, name, type = 'text', required = false, icon: Icon, ...props }) => {
    let value = name.includes('.')
      ? name.split('.').reduce((acc, key) => acc?.[key], form) ?? ''
      : form[name] ?? '';
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          )}
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleInputChange}
            required={required}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${Icon ? 'pl-10' : ''}`}
            {...props}
          />
        </div>
      </div>
    );
  };

  const TagList = ({ items, onRemove, label, onAdd, newItem, setNewItem, placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {items.map((item, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {item}
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              <XIcon className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), onAdd())}
        />
        <button
          type="button"
          onClick={onAdd}
          className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Patient (Standalone)</h1>
      <form className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="First Name" name="firstName" required icon={UserIcon} placeholder="Enter first name" />
            <InputField label="Last Name" name="lastName" required icon={UserIcon} placeholder="Enter last name" />
            <InputField label="Date of Birth" name="dateOfBirth" type="date" required icon={CalendarIcon} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <InputField label="Phone Number" name="phone" type="tel" required icon={PhoneIcon} placeholder="Enter phone number" />
            <InputField label="Email" name="email" type="email" icon={MailIcon} placeholder="Enter email address" />
            <InputField label="Blood Type" name="bloodType" placeholder="e.g., A+, B-, O+, AB+" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <InputField label="Address" name="address" icon={LocationMarkerIcon} placeholder="Enter full address" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField label="Contact Name" name="emergencyContact.name" placeholder="Enter contact name" />
            <InputField label="Relationship" name="emergencyContact.relationship" placeholder="e.g., Spouse, Parent" />
            <InputField label="Contact Phone" name="emergencyContact.phone" type="tel" placeholder="Enter contact phone" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h2>
          <div className="space-y-6">
            <TagList
              label="Medical History"
              items={form.medicalHistory}
              onRemove={idx => removeTag('medicalHistory', idx)}
              onAdd={() => addTag('medicalHistory', newMedical, setNewMedical)}
              newItem={newMedical}
              setNewItem={setNewMedical}
              placeholder="Add medical condition"
            />
            <TagList
              label="Allergies"
              items={form.allergies}
              onRemove={idx => removeTag('allergies', idx)}
              onAdd={() => addTag('allergies', newAllergy, setNewAllergy)}
              newItem={newAllergy}
              setNewItem={setNewAllergy}
              placeholder="Add allergy"
            />
            <TagList
              label="Current Medications"
              items={form.medications}
              onRemove={idx => removeTag('medications', idx)}
              onAdd={() => addTag('medications', newMedication, setNewMedication)}
              newItem={newMedication}
              setNewItem={setNewMedication}
              placeholder="Add medication"
            />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Insurance Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField label="Insurance Provider" name="insurance.provider" placeholder="Enter insurance provider" />
            <InputField label="Policy Number" name="insurance.policyNumber" placeholder="Enter policy number" />
            <InputField label="Group Number" name="insurance.groupNumber" placeholder="Enter group number" />
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            onClick={() => window.location.reload()}
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={e => e.preventDefault()}
          >
            Add Patient
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPatientStandalone; 