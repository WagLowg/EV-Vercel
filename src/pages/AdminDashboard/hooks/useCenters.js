import { useState, useCallback } from 'react';
import * as API from '../../../api';

export const useCenters = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all centers
  const fetchCenters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 [Admin Centers] Fetching all centers...');

      const data = await API.getAllCenters();
      console.log('✅ [Admin Centers] Loaded centers:', data?.length || 0);
      
      setCenters(Array.isArray(data) ? data : []);
      setLoading(false);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('❌ [Admin Centers] Error fetching centers:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch centers';
      setError(errorMsg);
      setLoading(false);
      setCenters([]);
      return [];
    }
  }, []);

  // Add new center
  const addCenter = useCallback(async (centerData) => {
    try {
      setError(null);
      console.log('➕ [Admin Centers] Adding center:', centerData);

      // Map form data to API format (CenterDTO: name, address, phone, email)
      const apiData = {
        name: centerData.name?.trim(),
        address: centerData.address?.trim(),
        phone: centerData.phone?.trim(),
        email: centerData.email?.trim()
      };

      const result = await API.createCenter(apiData);
      
      // Refresh center list
      await fetchCenters();
      
      console.log('✅ [Admin Centers] Center added successfully');
      return { success: true, data: result };
    } catch (err) {
      console.error('❌ [Admin Centers] Error adding center:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to add center';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, [fetchCenters]);

  // Update center
  const updateCenter = useCallback(async (centerId, centerData) => {
    try {
      setError(null);
      console.log('📝 [Admin Centers] Updating center:', centerId, centerData);

      // Map form data to API format (CenterDTO: name, address, phone, email)
      const apiData = {
        name: centerData.name?.trim(),
        address: centerData.address?.trim(),
        phone: centerData.phone?.trim(),
        email: centerData.email?.trim()
      };

      const result = await API.updateCenter(centerId, apiData);
      
      // Refresh center list
      await fetchCenters();
      
      console.log('✅ [Admin Centers] Center updated successfully');
      return { success: true, data: result };
    } catch (err) {
      console.error('❌ [Admin Centers] Error updating center:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update center';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, [fetchCenters]);

  // Delete center
  const deleteCenter = useCallback(async (centerId) => {
    try {
      setError(null);
      console.log('🗑️ [Admin Centers] Deleting center:', centerId);

      await API.deleteCenter(centerId);
      
      // Refresh center list
      await fetchCenters();
      
      console.log('✅ [Admin Centers] Center deleted successfully');
      return { success: true };
    } catch (err) {
      console.error('❌ [Admin Centers] Error deleting center:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete center';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, [fetchCenters]);

  return {
    centers,
    loading,
    error,
    fetchCenters,
    addCenter,
    updateCenter,
    deleteCenter
  };
};
