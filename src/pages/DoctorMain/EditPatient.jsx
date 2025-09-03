import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  UserIcon, 
  PhoneIcon, 
  MailIcon, 
  CalendarIcon,
  LocationMarkerIcon,
  PlusIcon,
  XIcon,
  ArrowLeftIcon
} from '@heroicons/react/outline';
import { patientAPI } from '../../services/api';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const EditPatient = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [patient, setPatient] = useState(null);
  const [formData, setFormData] = useState({
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
  });

  const [newMedicalCondition, setNewMedicalCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getPatient(id);
      const patientData = response.data;
      setPatient(patientData);
      
      // Format date for input field
      const formattedDate = new Date(patientData.dateOfBirth).toISOString().split('T')[0];
      
      setFormData({
        firstName: patientData.firstName || '',
        lastName: patientData.lastName || '',
        dateOfBirth: formattedDate,
        gender: patientData.gender || '',
        phone: patientData.phone || '',
        email: patientData.email || '',
        address: patientData.address || '',
        bloodType: patientData.bloodType || '',
        emergencyContact: {
          name: patientData.emergencyContact?.name || '',
          relationship: patientData.emergencyContact?.relationship || '',
          phone: patientData.emergencyContact?.phone || ''
        },
        medicalHistory: patientData.medicalHistory || [],
        allergies: patientData.allergies || [],
        medications: patientData.medications || [],
        insurance: {
          provider: patientData.insurance?.provider || '',
          policyNumber: patientData.insurance?.policyNumber || '',
          groupNumber: patientData.insurance?.groupNumber || ''
        },
        status: patientData.status || 'active'
      });
    } catch (error) {
      console.error('Error fetching patient:', error);
      toast.error('Failed to load patient data');
      navigate('/patients');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addMedicalCondition = () => {
    if (newMedicalCondition.trim()) {
      setFormData(prev => ({
        ...prev,
        medicalHistory: [...prev.medicalHistory, newMedicalCondition.trim()]
      }));
      setNewMedicalCondition('');
    }
  };

  const removeMedicalCondition = (index) => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: prev.medicalHistory.filter((_, i) => i !== index)
    }));
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy('');
    }
  };

  const removeAllergy = (index) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }));
  };

  const addMedication = () => {
    if (newMedication.trim()) {
      setFormData(prev => ({
        ...prev,
        medications: [...prev.medications, newMedication.trim()]
      }));
      setNewMedication('');
    }
  };

  const removeMedication = (index) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'phone'];
    for (const field of required) {
      if (!formData[field]) {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSaving(true);
      await patientAPI.updatePatient(id, formData);
      toast.success('Patient updated successfully');
      navigate(`/patient/${id}`);
    } catch (error) {
      console.error('Error updating patient:', error);
      toast.error(error.response?.data?.message || 'Failed to update patient');
    } finally {
      setSaving(false);
    }
  };

  const InputField = ({ label, name, type = 'text', required = false, icon: Icon, ...props }) => (
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
          value={formData[name] || ''}
          onChange={handleInputChange}
          required={required}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            Icon ? 'pl-10' : ''
          }`}
          {...props}
        />
      </div>
    </div>
  );

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
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), onAdd())}
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

  if (loading) {
    return <Loader size="lg" />;
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Patient not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate(`/patient/${id}`)}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Patient</h1>
            <p className="text-gray-600">
              Update information for {patient.firstName} {patient.lastName}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="First Name"
              name="firstName"
              required
              icon={UserIcon}
              placeholder="Enter first name"
            />
            <InputField
              label="Last Name"
              name="lastName"
              required
              icon={UserIcon}
              placeholder="Enter last name"
            />
            <InputField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              required
              icon={CalendarIcon}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
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
            <InputField
              label="Phone Number"
              name="phone"
              type="tel"
              required
              icon={PhoneIcon}
              placeholder="Enter phone number"
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              icon={MailIcon}
              placeholder="Enter email address"
            />
            <InputField
              label="Blood Type"
              name="bloodType"
              placeholder="e.g., A+, B-, O+, AB+"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
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
            <InputField
              label="Address"
              name="address"
              icon={LocationMarkerIcon}
              placeholder="Enter full address"
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField
              label="Contact Name"
              name="emergencyContact.name"
              placeholder="Enter contact name"
            />
            <InputField
              label="Relationship"
              name="emergencyContact.relationship"
              placeholder="e.g., Spouse, Parent"
            />
            <InputField
              label="Contact Phone"
              name="emergencyContact.phone"
              type="tel"
              placeholder="Enter contact phone"
            />
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h2>
          <div className="space-y-6">
            <TagList
              label="Medical History"
              items={formData.medicalHistory}
              onRemove={removeMedicalCondition}
              onAdd={addMedicalCondition}
              newItem={newMedicalCondition}
              setNewItem={setNewMedicalCondition}
              placeholder="Add medical condition"
            />
            <TagList
              label="Allergies"
              items={formData.allergies}
              onRemove={removeAllergy}
              onAdd={addAllergy}
              newItem={newAllergy}
              setNewItem={setNewAllergy}
              placeholder="Add allergy"
            />
            <TagList
              label="Current Medications"
              items={formData.medications}
              onRemove={removeMedication}
              onAdd={addMedication}
              newItem={newMedication}
              setNewItem={setNewMedication}
              placeholder="Add medication"
            />
          </div>
        </div>

        {/* Insurance Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Insurance Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField
              label="Insurance Provider"
              name="insurance.provider"
              placeholder="Enter insurance provider"
            />
            <InputField
              label="Policy Number"
              name="insurance.policyNumber"
              placeholder="Enter policy number"
            />
            <InputField
              label="Group Number"
              name="insurance.groupNumber"
              placeholder="Enter group number"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/patient/${id}`)}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPatient;
