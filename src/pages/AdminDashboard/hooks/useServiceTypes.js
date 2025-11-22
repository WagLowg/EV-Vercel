import { useState, useEffect } from 'react';
import { getAllServiceTypes, createServiceType, updateServiceType, deleteServiceType } from '../../../api/index';

/**
 * Custom hook for Service Types Management (Admin)
 * Handles fetching, adding, updating, deleting service types
 * Admin can manage all service types (maintenance packages)
 */
export const useServiceTypes = () => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all service types (Admin sees all)
   */
  const fetchServiceTypes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 [useServiceTypes Admin] Fetching all service types from API...');
      const data = await getAllServiceTypes();
      console.log('✅ [useServiceTypes Admin] Service types loaded:', data?.length || 0);
      setServiceTypes(Array.isArray(data) ? data : []);
      setLoading(false);
      return data;
    } catch (err) {
      console.error('❌ [useServiceTypes Admin] Error loading service types:', err);
      setError(err.message || 'Failed to fetch service types');
      setLoading(false);
      setServiceTypes([]);
      return [];
    }
  };

  /**
   * Add new service type
   * @param {Object} serviceTypeData - Service type data { name, description, price, durationEst }
   */
  const addServiceType = async (serviceTypeData) => {
    try {
      console.log('➕ [useServiceTypes Admin] Adding new service type:', serviceTypeData);
      const result = await createServiceType(serviceTypeData);
      console.log('✅ [useServiceTypes Admin] Service type added successfully:', result);
      await fetchServiceTypes(); // Refresh list
      return { success: true, data: result };
    } catch (err) {
      console.error('❌ [useServiceTypes Admin] Error adding service type:', err);
      return { success: false, error: err.message || 'Failed to add service type' };
    }
  };

  /**
   * Update existing service type
   * @param {Number} id - Service type ID
   * @param {Object} data - Updated data
   */
  const handleUpdateServiceType = async (id, data) => {
    try {
      console.log('📝 [useServiceTypes Admin] Updating service type:', { id, data });
      const result = await updateServiceType(id, data);
      console.log('✅ [useServiceTypes Admin] Service type updated successfully:', result);
      await fetchServiceTypes(); // Refresh list
      return { success: true, data: result };
    } catch (err) {
      console.error('❌ [useServiceTypes Admin] Error updating service type:', err);
      return { success: false, error: err.message || 'Failed to update service type' };
    }
  };

  /**
   * Delete service type
   * @param {Number} id - Service type ID
   */
  const handleDeleteServiceType = async (id) => {
    try {
      console.log('🗑️ [useServiceTypes Admin] Deleting service type:', id);
      await deleteServiceType(id);
      console.log('✅ [useServiceTypes Admin] Service type deleted successfully');
      await fetchServiceTypes(); // Refresh list
      return { success: true };
    } catch (err) {
      console.error('❌ [useServiceTypes Admin] Error deleting service type:', err);
      return { success: false, error: err.message || 'Failed to delete service type' };
    }
  };

  useEffect(() => {
    fetchServiceTypes();
  }, []);

  return {
    serviceTypes,
    loading,
    error,
    fetchServiceTypes,
    addServiceType,
    handleUpdateServiceType,
    handleDeleteServiceType
  };
};

