import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  SearchIcon,
  ViewListIcon,
  ViewGridIcon,
  FilterIcon
} from '@heroicons/react/outline';
import { patientAPI } from '../../services/api';
import PatientCard from '../../components/PatientCard';
import PatientTable from '../../components/PatientTable';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const mockPatients = [
  { _id: '1', name: 'John Doe', email: 'john@example.com', phone: '9876543210', gender: 'Male', age: 30, createdAt: '2025-01-01' },
  { _id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '9876543211', gender: 'Female', age: 25, createdAt: '2025-02-01' },
  { _id: '3', name: 'Bob Johnson', email: 'bob@example.com', phone: '9876543212', gender: 'Male', age: 40, createdAt: '2025-03-01' },
  { _id: '4', name: 'Alice Brown', email: 'alice@example.com', phone: '9876543213', gender: 'Female', age: 35, createdAt: '2025-04-01' },
  { _id: '5', name: 'Charlie White', email: 'charlie@example.com', phone: '9876543214', gender: 'Male', age: 28, createdAt: '2025-05-01' },
  { _id: '6', name: 'Diana Green', email: 'diana@example.com', phone: '9876543215', gender: 'Female', age: 32, createdAt: '2025-06-01' },
  { _id: '7', name: 'Evan Black', email: 'evan@example.com', phone: '9876543216', gender: 'Male', age: 45, createdAt: '2025-07-01' },
  { _id: '8', name: 'Fiona Blue', email: 'fiona@example.com', phone: '9876543217', gender: 'Female', age: 29, createdAt: '2025-08-01' },
  { _id: '9', name: 'George Yellow', email: 'george@example.com', phone: '9876543218', gender: 'Male', age: 38, createdAt: '2025-09-01' },
  { _id: '10', name: 'Hannah Red', email: 'hannah@example.com', phone: '9876543219', gender: 'Female', age: 26, createdAt: '2025-10-01' },
  { _id: '11', name: 'Ian Purple', email: 'ian@example.com', phone: '9876543220', gender: 'Male', age: 31, createdAt: '2025-11-01' },
  // Add more mock patients here
];


const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchPatients();
  }, [currentPage, searchTerm, sortBy, sortOrder]);

  //fetchin backend data
  // const fetchPatients = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await patientAPI.getPatients({
  //       page: currentPage,
  //       limit: 10,
  //       search: searchTerm,
  //       sortBy,
  //       sortOrder
  //     });

  //     setPatients(response.data.patients);
  //     setTotalPages(Math.ceil(response.data.total / 10));
  //   } catch (error) {
  //     console.error('Error fetching patients:', error);
  //     toast.error('Failed to load patients');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //temprory using mock data for test
  const fetchPatients = async () => {
    try {
      setLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Filter/search mock data
      let filteredPatients = mockPatients.filter((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)
      );

      // Sort
      filteredPatients.sort((a, b) => {
        if (sortOrder === 'asc') return a[sortBy] > b[sortBy] ? 1 : -1;
        return a[sortBy] < b[sortBy] ? 1 : -1;
      });

      // Pagination
      const limit = 10;
      const startIndex = (currentPage - 1) * limit;
      const paginatedPatients = filteredPatients.slice(startIndex, startIndex + limit);

      setPatients(paginatedPatients);
      setTotalPages(Math.ceil(filteredPatients.length / limit));
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };


  //this for deletion of backend data
  // const handleDelete = async (patientId) => {
  //   if (window.confirm('Are you sure you want to delete this patient?')) {
  //     try {
  //       await patientAPI.deletePatient(patientId);
  //       toast.success('Patient deleted successfully');
  //       fetchPatients();
  //     } catch (error) {
  //       console.error('Error deleting patient:', error);
  //       toast.error('Failed to delete patient');
  //     }
  //   }
  // };

  //this for mock data temp
  const handleDelete = (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      setPatients(prev => prev.filter(p => p._id !== patientId));
      toast.success('Patient deleted successfully (mock)');
    }
  };
  const handleEdit = (patientId) => {
    const patient = mockPatients.find(p => p._id === patientId);
    if (patient) {
      toast(`Edit patient: ${patient.name} (mock)`);
      console.log('Edit patient data:', patient);
    }
  };

  const handleView = (patientId) => {
    const patient = mockPatients.find(p => p._id === patientId);
    if (patient) {
      toast(      `Patient Details:
Name: ${patient.firstName || patient.name} ${patient.lastName || ''}
ID: ${patient._id}
Email: ${patient.email || 'N/A'}
Phone: ${patient.phone || 'N/A'}
Gender: ${patient.gender || 'N/A'}
Age: ${patient.age}
Address: ${patient.address || 'N/A'}
Status: ${patient.status || 'Active'}
Medical History: ${patient.medicalHistory}`);
      console.log('View patient data:', patient);
    }
  };

  //addes end 

  const handleSort = (field, direction) => {
    setSortBy(field);
    setSortOrder(direction);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPatients();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const Pagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, patients.length + ((currentPage - 1) * 10))} of {patients.length + ((currentPage - 1) * 10)} results
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>

          {pages.map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 text-sm border rounded-md ${page === currentPage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'hover:bg-gray-50'
                }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <Loader size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600">Manage patient records and information</p>
        </div>
        <Link
          to="/add-patient"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Patient
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </form>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-100 rounded-md p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md ${viewMode === 'table'
                    ? 'bg-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <ViewListIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 rounded-md ${viewMode === 'card'
                    ? 'bg-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <ViewGridIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Patients List */}
      {patients.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-gray-500">
            <SearchIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first patient.'}
            </p>
            {!searchTerm && (
              <Link
                to="/add-patient"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add First Patient
              </Link>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* {viewMode === 'table' ? (
            <PatientTable
              patients={patients}
              onDelete={handleDelete}
              onSort={handleSort}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patients.map((patient) => (
                <PatientCard
                  key={patient._id}
                  patient={patient}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )} */}

          {viewMode === 'table' ? (
            <PatientTable
              patients={patients}
              onDelete={handleDelete}
              onEdit={handleEdit}   // ← ADD THIS
              onView={handleView}   // ← ADD THIS
              onSort={handleSort}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patients.map((patient) => (
                <PatientCard
                  key={patient._id}
                  patient={patient}
                  onDelete={handleDelete}
                  onEdit={handleEdit}  // ← ADD THIS
                  onView={handleView}  // ← ADD THIS
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Pagination />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Patients;
