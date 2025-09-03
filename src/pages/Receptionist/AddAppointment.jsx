import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  PencilIcon,
  PlusIcon,
  XIcon
} from '@heroicons/react/outline';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

// Mock data
const mockPatients = [
  { id: 1, firstName: 'John', lastName: 'Doe' },
  { id: 2, firstName: 'Jane', lastName: 'Smith' },
  { id: 3, firstName: 'Michael', lastName: 'Brown' },
  { id: 4, firstName: 'Emily', lastName: 'Davis' },
  { id: 5, firstName: 'Robert', lastName: 'Wilson' }
];

const mockDoctors = [
  { id: 1, firstName: 'Dr. Alice', lastName: 'Johnson', specialization: 'Cardiology' },
  { id: 2, firstName: 'Dr. Mark', lastName: 'Lee', specialization: 'Neurology' },
  { id: 3, firstName: 'Dr. Sarah', lastName: 'Taylor', specialization: 'Pediatrics' },
  { id: 4, firstName: 'Dr. David', lastName: 'Anderson', specialization: 'Orthopedics' },
  { id: 5, firstName: 'Dr. Lisa', lastName: 'Martinez', specialization: 'Dermatology' }
];

const AddAppointment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    reason: ''
  });

  // Simulate fetching data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPatients(mockPatients);
      setDoctors(mockDoctors);
      setLoading(false);
    }, 500); // simulate network delay
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const required = ['patientId', 'doctorId', 'date', 'time'];
    for (const field of required) {
      if (!form[field]) {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Mock submit
    toast.success('Appointment added successfully!');
    console.log('Submitted Appointment:', form);
    navigate('/appointments'); // go back to appointments list
  };

  if (loading) return <Loader size="lg" />;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">Add New Appointment</h1>
      <p className="text-gray-600 mb-6">Schedule an appointment for a patient with a doctor.</p>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        {/* Patient */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Patient <span className="text-red-500">*</span></label>
          <select
            name="patientId"
            value={form.patientId}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select patient</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
            ))}
          </select>
        </div>

        {/* Doctor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Doctor <span className="text-red-500">*</span></label>
          <select
            name="doctorId"
            value={form.doctorId}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select doctor</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.firstName} {d.lastName} - {d.specialization}</option>
            ))}
          </select>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date <span className="text-red-500">*</span></label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time <span className="text-red-500">*</span></label>
            <div className="relative">
              <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Reason / Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason / Notes</label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleInputChange}
            placeholder="Optional notes about the appointment"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => navigate('/appointments')} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Add Appointment
          </button>
        </div>

        {/* Preview */}
        {form.patientId && form.doctorId && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-2">Appointment Preview</h3>
            <p><span className="font-medium">Patient:</span> {patients.find(p => p.id === parseInt(form.patientId))?.firstName} {patients.find(p => p.id === parseInt(form.patientId))?.lastName}</p>
            <p><span className="font-medium">Doctor:</span> {doctors.find(d => d.id === parseInt(form.doctorId))?.firstName} {doctors.find(d => d.id === parseInt(form.doctorId))?.lastName}</p>
            <p><span className="font-medium">Date & Time:</span> {form.date} {form.time}</p>
            {form.reason && <p><span className="font-medium">Reason:</span> {form.reason}</p>}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddAppointment;

