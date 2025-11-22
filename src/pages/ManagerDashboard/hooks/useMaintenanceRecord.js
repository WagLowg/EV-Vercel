import { useState, useEffect } from 'react';
import * as API from '../../../api';
import { getCurrentCenterId } from '../../../utils/centerFilter';

/**
 * Custom hook for Maintenance Record Management
 * Fetches and manages maintenance records for current center
 */
export const useMaintenanceRecord = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all maintenance records for current center
   * API: GET /api/MaintainanceRecord/all/serviceCenter/{centerId}
   */
  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 [useMaintenanceRecord] Fetching maintenance records...');
      
      const centerId = getCurrentCenterId();
      if (!centerId) {
        console.warn('⚠️ [useMaintenanceRecord] No centerId found for current manager');
        setRecords([]);
        setLoading(false);
        return [];
      }

      console.log('🏢 [useMaintenanceRecord] Fetching records for centerId:', centerId);
      // API endpoint: GET /api/MaintainanceRecord/all/serviceCenter/{centerId}
      const data = await API.getMaintenanceRecordsByCenter(centerId);
      console.log(`✅ [useMaintenanceRecord] Records loaded: ${data?.length || 0}`);
      
      // Validate and set records
      const recordsArray = Array.isArray(data) ? data : [];
      setRecords(recordsArray);
      return recordsArray;
    } catch (err) {
      console.error('❌ [useMaintenanceRecord] Error loading records:', err);
      setError(err.message || 'Failed to load maintenance records');
      setRecords([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchRecords();
  }, []);

  return {
    records,
    loading,
    error,
    fetchRecords
  };
};

