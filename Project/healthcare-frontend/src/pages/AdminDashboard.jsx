import React, { useState, useEffect } from 'react';
import { adminAPI, healthAPI } from '../services/api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [systemStats, setSystemStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const statsResponse = await adminAPI.getSystemStats();
      setSystemStats(statsResponse.data.system_stats);
      const usersResponse = await adminAPI.getUsers();
      setUsers(usersResponse.data.users);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader size="lg" />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">System Stats</h3>
          <p>Database Size: {systemStats?.database_size_mb || 0} MB</p>
          <p>Total Users: {users.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
          {users.slice(0, 5).map(user => (
            <div key={user.id} className="py-2 border-b">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-600">{user.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
