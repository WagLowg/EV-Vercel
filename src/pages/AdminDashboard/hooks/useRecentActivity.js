import { useState, useCallback } from 'react';
import * as API from '../../../api';

export const useRecentActivity = () => {
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecentActivity = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 [Recent Activity] Fetching data...');

      // Fetch appointments and users
      const [appointmentsResult, usersResult] = await Promise.allSettled([
        API.getAllAppointments().catch(() => []),
        Promise.all([
          API.getAllUsersByRole('customer').catch(() => []),
          API.getAllUsersByRole('manager').catch(() => []),
          API.getAllUsersByRole('staff').catch(() => []),
          API.getAllUsersByRole('technician').catch(() => [])
        ]).then(results => results.flat())
      ]);

      const appointments = appointmentsResult.status === 'fulfilled' ? appointmentsResult.value : [];
      const allUsers = usersResult.status === 'fulfilled' ? usersResult.value : [];

      // Sort appointments by date (most recent first) and take top 5
      const sortedAppointments = [...appointments]
        .sort((a, b) => new Date(b.appointmentDate || b.createdAt) - new Date(a.appointmentDate || a.createdAt))
        .slice(0, 5);

      // Sort users by creation date (most recent first) and take top 5
      const sortedUsers = [...allUsers]
        .filter(u => u.id) // Filter out invalid entries
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);

      setRecentAppointments(sortedAppointments);
      setRecentUsers(sortedUsers);
      setLoading(false);

      console.log('✅ [Recent Activity] Data loaded:', {
        appointments: sortedAppointments.length,
        users: sortedUsers.length
      });
    } catch (err) {
      console.error('❌ [Recent Activity] Error:', err);
      setError(err.message || 'Failed to load recent activity');
      setLoading(false);
    }
  }, []);

  return {
    recentAppointments,
    recentUsers,
    loading,
    error,
    fetchRecentActivity
  };
};

