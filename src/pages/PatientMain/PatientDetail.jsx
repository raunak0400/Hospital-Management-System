import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  UserIcon, 
  PhoneIcon, 
  MailIcon, 
  CalendarIcon,
  LocationMarkerIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  ExclamationIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/outline';
import { patientAPI } from '../../services/api';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getPatient(id);
      setPatient(response.data);
    } catch (error) {
      console.error('Error fetching patient:', error);
      toast.error('Failed to load patient data');
      navigate('/patients');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
      try {
        await patientAPI.deletePatient(id);
        toast.success('Patient deleted successfully');
        navigate('/patients');
      } catch (error) {
        console.error('Error deleting patient:', error);
        toast.error('Failed to delete patient');
      }
    }
  };

  const getAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'critical':
        return <ExclamationIcon className="h-5 w-5 text-red-500" />;
      case 'inactive':
        return <XCircleIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const InfoSection = ({ title, children, className = '' }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-center py-2 border-b border-gray-100 last:border-b-0">
      {Icon && (
        <Icon className="h-5 w-5 text-gray-400 mr-3" />
      )}
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <div className="text-sm text-gray-900">{value || 'Not provided'}</div>
    </div>
  );

  const TagList = ({ items, title, emptyMessage }) => (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
      {items && items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      )}
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
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/patients')}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {patient.firstName && patient.lastName ? `${patient.firstName} ${patient.lastName}` : (patient.name || 'Unknown')}
              </h1>
              <p className="text-gray-600">Patient ID: {patient._id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patient.status)}`}>
              {getStatusIcon(patient.status)}
              <span className="ml-1 capitalize">{patient.status || 'Active'}</span>
            </span>
            <Link
              to={`/edit-patient/${id}`}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <InfoSection title="Basic Information">
            <div className="space-y-3">
              <InfoRow
                label="Full Name"
                value={`${patient.firstName} ${patient.lastName}`}
                icon={UserIcon}
              />
              <InfoRow
                label="Age"
                value={patient.dateOfBirth ? getAge(patient.dateOfBirth) + ' years' : 'N/A'}
                icon={CalendarIcon}
              />
              <InfoRow
                label="Gender"
                value={patient.gender?.charAt(0).toUpperCase() + patient.gender?.slice(1)}
                icon={UserIcon}
              />
              <InfoRow
                label="Phone"
                value={patient.phone}
                icon={PhoneIcon}
              />
              <InfoRow
                label="Email"
                value={patient.email}
                icon={MailIcon}
              />
              <InfoRow
                label="Address"
                value={patient.address}
                icon={LocationMarkerIcon}
              />
              {patient.bloodType && (
                <InfoRow
                  label="Blood Type"
                  value={patient.bloodType}
                  icon={UserIcon}
                />
              )}
            </div>
          </InfoSection>

          {/* Emergency Contact */}
          {patient.emergencyContact && (
            <InfoSection title="Emergency Contact">
              <div className="space-y-3">
                <InfoRow
                  label="Contact Name"
                  value={patient.emergencyContact.name}
                  icon={UserIcon}
                />
                <InfoRow
                  label="Relationship"
                  value={patient.emergencyContact.relationship}
                  icon={UserIcon}
                />
                <InfoRow
                  label="Contact Phone"
                  value={patient.emergencyContact.phone}
                  icon={PhoneIcon}
                />
              </div>
            </InfoSection>
          )}

          {/* Insurance Information */}
          {patient.insurance && (
            <InfoSection title="Insurance Information">
              <div className="space-y-3">
                <InfoRow
                  label="Provider"
                  value={patient.insurance.provider}
                  icon={UserIcon}
                />
                <InfoRow
                  label="Policy Number"
                  value={patient.insurance.policyNumber}
                  icon={UserIcon}
                />
                <InfoRow
                  label="Group Number"
                  value={patient.insurance.groupNumber}
                  icon={UserIcon}
                />
              </div>
            </InfoSection>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Medical Information */}
          <InfoSection title="Medical Information">
            <div className="space-y-4">
              <TagList
                items={patient.medicalHistory}
                title="Medical History"
                emptyMessage="No medical history recorded"
              />
              <TagList
                items={patient.allergies}
                title="Allergies"
                emptyMessage="No allergies recorded"
              />
              <TagList
                items={patient.medications}
                title="Current Medications"
                emptyMessage="No medications recorded"
              />
            </div>
          </InfoSection>

          {/* Patient Statistics */}
          <InfoSection title="Patient Statistics">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-gray-700">Age</span>
                <span className="text-sm text-gray-900">{patient.dateOfBirth ? getAge(patient.dateOfBirth) + ' years' : 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-gray-700">Gender</span>
                <span className="text-sm text-gray-900 capitalize">{patient.gender}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-gray-700">Status</span>
                <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(patient.status)}`}>
                  {patient.status || 'Active'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-gray-700">Registered</span>
                <span className="text-sm text-gray-900">
                  {patient.createdAt ? (new Date(patient.createdAt).toString() !== 'Invalid Date' ? new Date(patient.createdAt).toLocaleDateString() : 'N/A') : 'N/A'}
                </span>
              </div>
              {patient.updatedAt && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-700">Last Updated</span>
                  <span className="text-sm text-gray-900">
                    {patient.updatedAt ? (new Date(patient.updatedAt).toString() !== 'Invalid Date' ? new Date(patient.updatedAt).toLocaleDateString() : 'N/A') : 'N/A'}
                  </span>
                </div>
              )}
            </div>
          </InfoSection>

          {/* Quick Actions */}
          <InfoSection title="Quick Actions">
            <div className="space-y-2">
              <Link
                to={`/edit-patient/${id}`}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit Patient
              </Link>
              <button
                onClick={handleDelete}
                className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete Patient
              </button>
            </div>
          </InfoSection>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
