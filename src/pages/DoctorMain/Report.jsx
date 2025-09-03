import React, { useState, useEffect } from "react";
import { EyeIcon } from "@heroicons/react/outline";

// ----------------- Mock Data -----------------
const mockReports = [
  { id: 1, patientName: "Alice Smith", type: "Lab", date: "2025-08-01", status: "Completed", summary: "Blood sugar level: 110 mg/dL" },
  { id: 2, patientName: "John Doe", type: "Prescription", date: "2025-08-03", status: "Pending", summary: "Albuterol inhaler for asthma" },
  { id: 3, patientName: "Michael Brown", type: "Imaging", date: "2025-08-04", status: "Completed", summary: "Chest X-ray shows mild inflammation" },
  { id: 4, patientName: "Emma Wilson", type: "Lab", date: "2025-08-05", status: "Pending", summary: "CBC test awaiting review" },
  { id: 5, patientName: "David Lee", type: "Follow-up", date: "2025-08-06", status: "Scheduled", summary: "Check blood pressure next week" },
  { id: 6, patientName: "Sophia Taylor", type: "Prescription", date: "2025-08-07", status: "Completed", summary: "Ibuprofen for migraine" },
  { id: 7, patientName: "James Anderson", type: "Lab", date: "2025-08-07", status: "Completed", summary: "Cholesterol: 220 mg/dL" },
  { id: 8, patientName: "Olivia Martinez", type: "Imaging", date: "2025-08-08", status: "Pending", summary: "MRI brain scan pending" },
  { id: 9, patientName: "William Clark", type: "Lab", date: "2025-08-08", status: "Completed", summary: "ECG normal" },
  { id: 10, patientName: "Isabella Lewis", type: "Follow-up", date: "2025-08-09", status: "Scheduled", summary: "Review thyroid medication in 2 weeks" }
];

// ----------------- Component -----------------
const Report = () => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(5);

  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setReports(mockReports);
  }, []);

  // ----------------- Filtered & Searched Reports -----------------
  const filteredReports = reports.filter((r) => {
    const matchesSearch = r.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || r.type === filterType;
    const matchesStatus = filterStatus === "All" || r.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // ----------------- Pagination -----------------
  const indexOfLast = currentPage * reportsPerPage;
  const indexOfFirst = indexOfLast - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  // ----------------- View Report -----------------
  const handleView = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  // ----------------- Badge Color -----------------
  const getBadgeColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
        <input
          type="text"
          placeholder="Search by patient name..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="border px-4 py-2 rounded-md w-full md:w-1/3 focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border px-4 py-2 rounded-md w-full md:w-1/6"
        >
          <option value="All">All Types</option>
          <option value="Lab">Lab</option>
          <option value="Prescription">Prescription</option>
          <option value="Imaging">Imaging</option>
          <option value="Follow-up">Follow-up</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border px-4 py-2 rounded-md w-full md:w-1/6"
        >
          <option value="All">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Scheduled">Scheduled</option>
        </select>
      </div>

      {/* Report List */}
      <div className="space-y-4">
        {currentReports.length > 0 ? currentReports.map((report) => (
          <div key={report.id} className="p-4 border rounded-lg flex justify-between items-center hover:shadow-md transition-shadow">
            <div>
              <h3 className="font-semibold">{report.patientName}</h3>
              <p className="text-sm text-gray-600">
                Type: {report.type} | Date: {report.date}
              </p>
              <span className={`px-2 py-1 mt-1 inline-block text-xs font-medium rounded-full ${getBadgeColor(report.status)}`}>
                {report.status}
              </span>
            </div>
            <button
              onClick={() => handleView(report)}
              className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <EyeIcon className="h-4 w-4 mr-1" />
              View
            </button>
          </div>
        )) : (
          <p className="text-gray-500 text-center">No reports found.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 border rounded ${page === currentPage ? "bg-blue-600 text-white border-blue-600" : "hover:bg-gray-100"}`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal for Viewing Report */}
      {isModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative">
            <h2 className="text-xl font-bold mb-4">Report Details</h2>

            <p><strong>Patient Name:</strong> {selectedReport.patientName}</p>
            <p><strong>Type:</strong> {selectedReport.type}</p>
            <p><strong>Date:</strong> {selectedReport.date}</p>
            <p><strong>Status:</strong> {selectedReport.status}</p>
            <p><strong>Summary:</strong> {selectedReport.summary}</p>

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
