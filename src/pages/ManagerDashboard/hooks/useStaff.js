import { useState, useEffect } from 'react';
import * as API from '../../../api';

/**
 * Custom hook for Staff View (Read-Only)
 * Fetches staff list for the current manager's center
 * No CRUD operations - view only
 */
export const useStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all staff (TECHNICIAN + STAFF roles)
   * Uses API: GET /api/users/center/staff_and_technician
   */
  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 [useStaff] Fetching staff from API...');
      
      // Fetch staff and technicians from single API endpoint
      const staffAndTechnicians = await API.getStaffAndTechnician();
      
      console.log('📦 [useStaff] Raw API response:');
      console.log('   - Total staff & technicians:', staffAndTechnicians?.length || 0);
      
      // Ensure it's an array
      const allStaff = Array.isArray(staffAndTechnicians) ? staffAndTechnicians : [];
      
      // Separate by role for logging
      const technicians = allStaff.filter(s => s.role?.toUpperCase() === 'TECHNICIAN');
      const staffMembers = allStaff.filter(s => s.role?.toUpperCase() === 'STAFF');
      
      console.log('   - Technicians:', technicians.length);
      console.log('   - Staff members:', staffMembers.length);
      console.log(`✅ [useStaff] Total staff loaded: ${allStaff.length}`);
      
      setStaffList(allStaff);
      return allStaff;
    } catch (err) {
      console.error('❌ [useStaff] Error loading staff:', err);
      setError(err.message || 'Failed to load staff');
      setStaffList([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get staff statistics
   */
  const getStats = () => {
    const techCount = staffList.filter(s => s.role?.toUpperCase() === 'TECHNICIAN').length;
    const staffCount = staffList.filter(s => s.role?.toUpperCase() === 'STAFF').length;
    
    return {
      totalStaff: staffList.length,
      technicians: techCount,
      staff: staffCount
    };
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchStaff();
  }, []);

  return {
    // Data
    staffList,
    loading,
    error,
    stats: getStats(),
    
    // Functions
    fetchStaff
  };
};
