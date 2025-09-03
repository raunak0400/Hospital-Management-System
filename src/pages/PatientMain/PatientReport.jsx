import React, { useState, useEffect } from "react";
import {
  DocumentTextIcon,
  DownloadIcon,
  EyeIcon,
  XIcon,
} from "@heroicons/react/outline";

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null); // For preview

  // Load mock reports (replace with API later)
  useEffect(() => {
    const mockReports = [
      {
        id: 1,
        title: "Blood Test Report",
        date: "2025-08-15",
        fileUrl: "/mock-reports/blood-test.pdf",
        type: "pdf",
      },
      {
        id: 2,
        title: "X-Ray Scan",
        date: "2025-08-20",
        fileUrl: "/mock-reports/xray.png",
        type: "image",
      },
      {
        id: 3,
        title: "Prescription",
        date: "2025-09-01",
        fileUrl: "/mock-reports/prescription.pdf",
        type: "pdf",
      },
    ];
    setReports(mockReports);
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-6 relative">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        My Medical Reports
      </h2>

      {reports.length === 0 ? (
        <p className="text-gray-500">No reports available yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {reports.map((report) => (
            <li
              key={report.id}
              className="flex items-center justify-between py-4"
            >
              {/* Report Info */}
              <div className="flex items-center">
                <DocumentTextIcon className="h-6 w-6 text-blue-500" />
                <div className="ml-3">
                  <p className="text-gray-800 font-medium">{report.title}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(report.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                {/* View */}
                <button
                  onClick={() => setSelectedReport(report)}
                  className="flex items-center text-green-600 hover:underline"
                >
                  <EyeIcon className="h-5 w-5 mr-1" />
                  View
                </button>

                {/* Download */}
                <a
                  href={report.fileUrl}
                  download
                  className="flex items-center text-blue-600 hover:underline"
                >
                  <DownloadIcon className="h-5 w-5 mr-1" />
                  Download
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Report Preview Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 p-4 relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <XIcon className="h-6 w-6" />
            </button>

            <h3 className="text-lg font-semibold mb-4">
              {selectedReport.title}
            </h3>

            {/* File Preview */}
            {selectedReport.type === "pdf" ? (
              <iframe
                src={selectedReport.fileUrl}
                title={selectedReport.title}
                className="w-full h-[500px] border rounded"
              />
            ) : (
              <img
                src={selectedReport.fileUrl}
                alt={selectedReport.title}
                className="w-full max-h-[500px] object-contain rounded"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
