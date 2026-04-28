import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminApi } from '../../services/adminApi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminApi.listUsers();
      setUsers(response.data.users || []);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId, isBlocked) => {
    try {
      setActionLoading(userId);
      const response = await adminApi.toggleBlockUser(userId);
      const updated = response.data.user;
      setUsers((prev) => prev.map((u) => (u._id === userId ? updated : u)));
      toast.success(isBlocked ? 'User unblocked' : 'User blocked');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Users Management</h1>
      {loading ? (
        <div className="shimmer h-64 rounded-xl" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">City</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.city}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      type="button"
                      disabled={actionLoading === user._id}
                      onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                      className={`px-4 py-2 text-white rounded-lg ${
                        user.isBlocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                      } disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                      {actionLoading === user._id ? 'Saving...' : user.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;


