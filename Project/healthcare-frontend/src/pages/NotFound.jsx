import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/outline';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-gray-200">404</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Page not found</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Try these pages instead:
              </h3>
              <div className="space-y-3">
                <Link
                  to="/dashboard"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <HomeIcon className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Dashboard</div>
                    <div className="text-sm text-gray-500">View system overview and statistics</div>
                  </div>
                </Link>
                
                <Link
                  to="/patients"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <UserGroupIcon className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Patients</div>
                    <div className="text-sm text-gray-500">Manage patient records</div>
                  </div>
                </Link>
                
                <Link
                  to="/analytics"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ChartBarIcon className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Analytics</div>
                    <div className="text-sm text-gray-500">View charts and reports</div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
