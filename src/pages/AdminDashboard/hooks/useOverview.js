import { useState, useCallback } from 'react';
import * as API from '../../../api';

export const useOverview = () => {
  const [overviewData, setOverviewData] = useState({
    totalUsers: 0,
    totalStaff: 0,
    totalManagers: 0,
    totalTechnicians: 0,
    totalCustomers: 0,
    totalCenters: 0,
    totalVehicles: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    revenue: { thisMonth: 0, lastMonth: 0, percentChange: 0 },
    profit: { thisMonth: 0 }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOverviewData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 [Admin Overview] Fetching overview data...');

      // Fetch all data in parallel
      const results = await Promise.allSettled([
        // Fetch users by role
        API.getAllUsersByRole('manager').catch(() => []),
        API.getAllUsersByRole('customer').catch(() => []),
        API.getAllUsersByRole('staff').catch(() => []),
        API.getAllUsersByRole('technician').catch(() => []),
        // Fetch vehicles, appointments, centers
        API.getAllVehicles().catch(() => []),
        API.getAllAppointments().catch(() => []),
        API.getAllCenters().catch(() => []),
        // Fetch financial data
        API.getRevenueCurrentMonth().catch(() => ({ thisMonth: 0, lastMonth: 0, percentChange: 0 })),
        API.getCurrentMonthExpense().catch(() => 0)
      ]);

      const [
        managersResult,
        customersResult,
        staffResult,
        techniciansResult,
        vehiclesResult,
        appointmentsResult,
        centersResult,
        revenueResult,
        expenseResult
      ] = results;

      // Extract data from results
      const managers = managersResult.status === 'fulfilled' ? managersResult.value : [];
      const customers = customersResult.status === 'fulfilled' ? customersResult.value : [];
      const staff = staffResult.status === 'fulfilled' ? staffResult.value : [];
      const technicians = techniciansResult.status === 'fulfilled' ? techniciansResult.value : [];
      const vehicles = vehiclesResult.status === 'fulfilled' ? vehiclesResult.value : [];
      const appointments = appointmentsResult.status === 'fulfilled' ? appointmentsResult.value : [];
      const centers = centersResult.status === 'fulfilled' ? centersResult.value : [];
      const revenue = revenueResult.status === 'fulfilled' ? revenueResult.value : { thisMonth: 0, lastMonth: 0, percentChange: 0 };
      const expense = expenseResult.status === 'fulfilled' ? expenseResult.value : 0;

      // Count appointments by status (case-insensitive)
      const pending = appointments.filter(a => 
        a.status?.toUpperCase() === 'PENDING'
      ).length;
      const completed = appointments.filter(a => 
        a.status?.toUpperCase() === 'COMPLETED' || 
        a.status?.toUpperCase() === 'DONE'
      ).length;

      // Calculate profit
      const profit = (revenue.thisMonth || 0) - (expense || 0);

      // Calculate total users
      const totalUsers = managers.length + customers.length + staff.length + technicians.length;

      setOverviewData({
        totalUsers: totalUsers,
        totalStaff: staff.length,
        totalManagers: managers.length,
        totalTechnicians: technicians.length,
        totalCustomers: customers.length,
        totalCenters: centers.length,
        totalVehicles: vehicles.length,
        totalAppointments: appointments.length,
        pendingAppointments: pending,
        completedAppointments: completed,
        revenue: revenue,
        profit: { thisMonth: profit }
      });

      setLoading(false);
      console.log('✅ [Admin Overview] Data loaded:', {
        totalUsers,
        managers: managers.length,
        customers: customers.length,
        staff: staff.length,
        technicians: technicians.length,
        vehicles: vehicles.length,
        appointments: appointments.length,
        centers: centers.length
      });
    } catch (err) {
      console.error('❌ [Admin Overview] Error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load overview data';
      setError(errorMsg);
      setLoading(false);
    }
  }, []);

  return {
    overviewData,
    loading,
    error,
    fetchOverviewData
  };
};