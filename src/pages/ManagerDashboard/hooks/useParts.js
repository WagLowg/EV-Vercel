import { useState, useEffect } from 'react';
import * as API from '../../../api';

/**
 * Custom hook for Parts Management
 * Handles fetching, adding, updating, deleting parts
 */
export const useParts = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all parts and inventory
   */
  const fetchParts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 [useParts] Fetching parts and inventory from API...');
      
      // Fetch parts and inventory in parallel
      const [partsData, inventoryData] = await Promise.all([
        API.getAllParts().catch(err => {
          console.error('❌ [useParts] Error fetching parts:', err);
          return [];
        }),
        API.getInventoryParts().catch(err => {
          console.error('❌ [useParts] Error fetching inventory:', err);
          return [];
        })
      ]);

      // Create a map of partId -> quantity from inventory
      const inventoryMap = {};
      if (Array.isArray(inventoryData)) {
        inventoryData.forEach(item => {
          // Handle different possible response structures
          const partId = item.partId || item.part?.id || item.id;
          const quantity = item.quantityUsed || item.quantity || item.quantityInStock || 0;
          
          if (partId) {
            inventoryMap[partId] = quantity;
          }
        });
      } else if (inventoryData && typeof inventoryData === 'object') {
        // Handle case where API returns object with partId as keys
        Object.keys(inventoryData).forEach(key => {
          const item = inventoryData[key];
          const partId = item.partId || item.part?.id || key;
          const quantity = item.quantityUsed || item.quantity || item.quantityInStock || 0;
          if (partId) {
            inventoryMap[partId] = quantity;
          }
        });
      }
      
      console.log('📦 [useParts] Inventory map:', inventoryMap);

      // Merge parts with inventory quantities
      const mergedParts = Array.isArray(partsData) ? partsData.map(part => ({
        ...part,
        inventoryQuantity: inventoryMap[part.id] || 0
      })) : [];

      console.log('✅ [useParts] Parts loaded:', mergedParts.length);
      setParts(mergedParts);
      setLoading(false);
      return mergedParts;
    } catch (err) {
      console.error('❌ [useParts] Error loading parts:', err);
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
      console.log('➕ [useParts] Adding new part:', partData);
      const result = await API.createPart(partData);
      console.log('✅ [useParts] Part added successfully:', result);
      await fetchParts(); // Refresh list
      return { success: true, data: result };
    } catch (err) {
      console.error('❌ [useParts] Error adding part:', err);
      return { success: false, error: err.message || 'Failed to add part' };
    }
  };

  /**
   * Update existing part
   * @param {Number} id - Part ID
   * @param {Object} data - Updated data
   */
  const updatePart = async (id, data) => {
    try {
      console.log('📝 [useParts] Updating part:', { id, data });
      const result = await API.updatePart(id, data);
      console.log('✅ [useParts] Part updated successfully:', result);
      await fetchParts(); // Refresh list
      return { success: true, data: result };
    } catch (err) {
      console.error('❌ [useParts] Error updating part:', err);
      return { success: false, error: err.message || 'Failed to update part' };
    }
  };

  /**
   * Delete part
   * @param {Number} id - Part ID
   */
  const deletePart = async (id) => {
    try {
      console.log('🗑️ [useParts] Deleting part:', id);
      await API.deletePart(id);
      console.log('✅ [useParts] Part deleted successfully');
      await fetchParts(); // Refresh list
      return { success: true };
    } catch (err) {
      console.error('❌ [useParts] Error deleting part:', err);
      return { success: false, error: err.message || 'Failed to delete part' };
    }
  };

  /**
   * Update inventory quantity
   * @param {Number} partId - Part ID
   * @param {Number} quantity - New quantity
   */
  const updateInventoryQuantity = async (partId, quantity) => {
    try {
      console.log('📦 [useParts] Updating inventory:', { partId, quantity });
      await API.updateInventoryQuantity(partId, quantity);
      console.log('✅ [useParts] Inventory updated successfully');
      await fetchParts(); // Refresh list to get updated quantity
      return { success: true };
    } catch (err) {
      console.error('❌ [useParts] Error updating inventory:', err);
      return { success: false, error: err.message || 'Failed to update inventory' };
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
    updatePart,
    deletePart,
    updateInventoryQuantity
  };
};
