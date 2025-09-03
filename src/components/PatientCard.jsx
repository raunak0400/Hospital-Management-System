import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UserIcon, 
  PhoneIcon, 
  MailIcon, 
  CalendarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/outline';

const PatientCard = ({ patient, onDelete,onEdit,onView }) => {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        {/* Header with name and status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {patient.firstName && patient.lastName ? `${patient.firstName} ${patient.lastName}` : (patient.name || 'Unknown')}
              </h3>
              <p className="text-sm text-gray-500">ID: {patient._id || 'N/A'}</p>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(patient.status)}`}>
            {patient.status || 'Active'}
          </span>
        </div>

        {/* Patient details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>Age: {patient.dateOfBirth ? getAge(patient.dateOfBirth) + ' years' : 'N/A'}</span>
          </div>
          
          {patient.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <PhoneIcon className="h-4 w-4 mr-2" />
              <span>{patient.phone}</span>
            </div>
          )}
          
          {patient.email && (
            <div className="flex items-center text-sm text-gray-600">
              <MailIcon className="h-4 w-4 mr-2" />
              <span>{patient.email}</span>
            </div>
          )}
          
          {patient.address && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Address:</span> {patient.address}
            </div>
          )}
        </div>

        {/* Medical info */}
        {patient.medicalHistory && patient.medicalHistory.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Medical History</h4>
            <div className="flex flex-wrap gap-1">
              {patient.medicalHistory.slice(0, 3).map((condition, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full"
                >
                  {condition}
                </span>
              ))}
              {patient.medicalHistory.length > 3 && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  +{patient.medicalHistory.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        // Replace the Actions section at the bottom with this:

{/* Actions */}
<div className="flex items-center justify-between pt-4 border-t border-gray-200">
  <div className="flex space-x-2">
    <button
      onClick={() => onView(patient._id)}
      className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
    >
      <EyeIcon className="h-4 w-4 mr-1" />
      View
    </button>

    <button
      onClick={() => onEdit(patient._id)}
      className="flex items-center px-3 py-1 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
    >
      <PencilIcon className="h-4 w-4 mr-1" />
      Edit
    </button>
  </div>

  <button
    onClick={() => onDelete(patient._id)}
    className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
  >
    <TrashIcon className="h-4 w-4 mr-1" />
    Delete
  </button>
</div>

      </div>
    </div>
  );
};

export default PatientCard;
