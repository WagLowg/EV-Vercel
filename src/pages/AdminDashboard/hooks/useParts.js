import { useState, useEffect } from 'react';
import { getAllParts, createPart, updatePart, deletePart, usePart } from '../../../api/index';

/**
 * Custom hook for Parts Management (Admin)
 * Handles fetching, adding, updating, deleting parts
 * Admin can see ALL parts in the system (no center filtering)
 */
export const useParts = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all parts (Admin sees all parts)
   */
  const fetchParts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 [useParts Admin] Fetching all parts from API...');
      const data = await getAllParts();
      console.log('✅ [useParts Admin] Parts loaded:', data?.length || 0);
      setParts(Array.isArray(data) ? data : []);
      setLoading(false);
      return data;
    } catch (err) {
      console.error('❌ [useParts Admin] Error loading parts:', err);
      setError(err.message || 'Failed to fetch parts');
      setLoading(false);
      setParts([]);
      return [];
    }
  };

  /**
   * Add new part
   * @param {Object} partData - Part data { name, description, unitPrice, minStockLevel }
   */
  const addPart = async (partData) => {
    try {
      console.log('➕ [useParts Admin] Adding new part:', partData);
      const result = await createPart(partData);
      console.log('✅ [useParts Admin] Part added successfully:', result);
      await fetchParts(); // Refresh list
      return { success: true, data: result };
    } catch (err) {
      console.error('❌ [useParts Admin] Error adding part:', err);
      return { success: false, error: err.message || 'Failed to add part' };
    }
  };

  /**
   * Update existing part
   * @param {Number} id - Part ID
   * @param {Object} data - Updated data
   */
  const handleUpdatePart = async (id, data) => {
    try {
      console.log('📝 [useParts Admin] Updating part:', { id, data });
      const result = await updatePart(id, data);
      console.log('✅ [useParts Admin] Part updated successfully:', result);
      await fetchParts(); // Refresh list
      return { success: true, data: result };
    } catch (err) {
      console.error('❌ [useParts Admin] Error updating part:', err);
      return { success: false, error: err.message || 'Failed to update part' };
    }
  };

  /**
   * Delete part
   * @param {Number} id - Part ID
   */
  const handleDeletePart = async (id) => {
    try {
      console.log('🗑️ [useParts Admin] Deleting part:', id);
      await deletePart(id);
      console.log('✅ [useParts Admin] Part deleted successfully');
      await fetchParts(); // Refresh list
      return { success: true };
    } catch (err) {
      console.error('❌ [useParts Admin] Error deleting part:', err);
      return { success: false, error: err.message || 'Failed to delete part' };
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  return {
    parts,
    loading,
    error,
    fetchParts,
    addPart,
    handleUpdatePart,
    handleDeletePart
  };
};

