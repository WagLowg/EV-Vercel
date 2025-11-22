import { useState, useEffect } from 'react';
import * as CenterAPI from '../../../services/centerAwareAPI';
import * as API from '../../../api';

export const useOverview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingAppointments: 0,
    inProgressAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    activeTechnicians: 0,
    activeStaff: 0,
    revenueData: {},
    profitData: {},
    trendingServices: [],
    trendingServicesLastMonth: [],
    trendingParts: []
  });

  const fetchOverviewData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 [Manager Overview] Fetching overview data...');
      
      // Fetch all data in parallel từ database
      const [
        appointments,
        revenue,
        trendingServices,
        trendingServicesLastMonth,
        parts,
        inventoryData,
        staffAndTechnicians
      ] = await Promise.all([
        CenterAPI.getAppointments().catch(err => {
          console.error('❌ [getAppointments] Error:', err);
          return [];
        }),
        CenterAPI.getRevenueReport().catch(err => {
          console.error('❌ [getRevenueReport] Error:', err);
          return {};
        }),
        CenterAPI.getTrendingServices().catch(err => {
          console.error('❌ [getTrendingServices] Error:', err);
          return [];
        }),
        CenterAPI.getTrendingServicesLastMonth().catch(err => {
          console.error('❌ [getTrendingServicesLastMonth] Error:', err);
          return [];
        }),
        API.getAllParts().catch(err => {
          console.error('❌ [getAllParts] Error:', err);
          return [];
        }),
        API.getInventoryParts().catch(err => {
          console.error('❌ [getInventoryParts] Error:', err);
          return [];
        }),
        API.getStaffAndTechnician().catch(err => {
          console.error('❌ [getStaffAndTechnician] Error:', err);
          return [];
        })
      ]);
      
      console.log('📦 [Manager Overview] Raw data loaded:');
      console.log('   - Appointments:', appointments?.length || 0);
      console.log('   - Revenue:', revenue);
      console.log('   - Trending Services:', trendingServices);
      console.log('   - Trending Services Last Month:', trendingServicesLastMonth);
      console.log('   - Parts:', parts?.length || 0);
      console.log('   - Inventory:', inventoryData?.length || 0);
      console.log('   - Staff & Technicians:', staffAndTechnicians?.length || 0);

      // Separate technicians and staff from API response
      const staffAndTechArray = Array.isArray(staffAndTechnicians) ? staffAndTechnicians : [];
      const technicians = staffAndTechArray.filter(user => 
        user.role?.toUpperCase() === 'TECHNICIAN'
      );
      const staffMembers = staffAndTechArray.filter(user => 
        user.role?.toUpperCase() === 'STAFF'
      );
      
      console.log('✅ [useOverview] Staff & Technicians loaded:');
      console.log('   - Technicians:', technicians.length);
      console.log('   - Staff:', staffMembers.length);

      // Calculate stats from fetched data
      const appointmentsArray = Array.isArray(appointments) ? appointments : [];
      
      // Format revenue data từ database (API: getRevenueReport)
      // Backend trả về format: { "JANUARY 2025": 5000000, "MARCH 2025": 8500000, ... }
      let revenueDataFormatted = {};
      let totalRevenue = 0;
      
      if (revenue && typeof revenue === 'object') {
        revenueDataFormatted = revenue;
        totalRevenue = Object.values(revenue).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
        console.log('✅ [useOverview] Revenue data from database:', revenueDataFormatted);
        console.log('💰 [useOverview] Total revenue:', totalRevenue);
      } else {
        console.warn('⚠️ [useOverview] No revenue data from database');
      }

      // Format trending services từ database (API: getTrendingServices)
      // API đã transform sang [{ key: string, value: number }]
      let trendingServicesFormatted = [];
      if (Array.isArray(trendingServices) && trendingServices.length > 0) {
        trendingServicesFormatted = trendingServices
          .filter(item => item && typeof item === 'object' && 'key' in item && 'value' in item)
          .map(item => ({
            key: String(item.key || ''),
            value: Number(item.value || 0)
          }));
        console.log('✅ [useOverview] Trending services (all time) from database:', trendingServicesFormatted);
      } else {
        console.warn('⚠️ [useOverview] No trending services data from database');
      }

      // Format trending services last month từ database (API: getTrendingServicesLastMonth)
      // API đã transform sang [{ key: string, value: number }]
      let trendingServicesLastMonthFormatted = [];
      if (Array.isArray(trendingServicesLastMonth) && trendingServicesLastMonth.length > 0) {
        trendingServicesLastMonthFormatted = trendingServicesLastMonth
          .filter(item => item && typeof item === 'object' && 'key' in item && 'value' in item)
          .map(item => ({
            key: String(item.key || ''),
            value: Number(item.value || 0)
          }));
        console.log('✅ [useOverview] Trending services (last month) from database:', trendingServicesLastMonthFormatted);
      } else {
        console.warn('⚠️ [useOverview] No trending services (last month) data from database');
      }

      // Create inventory map từ inventory API
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
      
      console.log('📦 [useOverview] Inventory map:', inventoryMap);

      // Format parts data từ database (API: getAllParts)
      // Sử dụng số lượng từ inventory API thay vì từ inventories trong part object
      let trendingPartsFormatted = [];
      if (Array.isArray(parts) && parts.length > 0) {
        trendingPartsFormatted = parts.map(part => ({
          id: part.id,
          name: part.name || 'N/A',
          description: part.description || '',
          unitPrice: part.unitPrice || 0,
          minStockLevel: part.minStockLevel || 0,
          // Sử dụng số lượng từ inventory API
          quantity: inventoryMap[part.id] || 0,
          quantityInStock: inventoryMap[part.id] || 0
        }));
        console.log('✅ [useOverview] Parts from database with inventory:', trendingPartsFormatted.length, 'parts');
      } else {
        console.warn('⚠️ [useOverview] No parts data from database');
      }
      
      // Profit data - sử dụng revenue data làm base
      // (Backend chưa có API profit riêng, tạm dùng revenue)
      const profitDataFormatted = revenueDataFormatted;
      
      setStats({
        totalRevenue,
        pendingAppointments: appointmentsArray.filter(a => a.status?.toUpperCase() === 'PENDING').length,
        inProgressAppointments: appointmentsArray.filter(a => a.status?.toUpperCase() === 'IN_PROGRESS').length,
        completedAppointments: appointmentsArray.filter(a => a.status?.toUpperCase() === 'COMPLETED').length,
        cancelledAppointments: appointmentsArray.filter(a => a.status?.toUpperCase() === 'CANCELLED').length,
        activeTechnicians: Array.isArray(technicians) ? technicians.length : 0,
        activeStaff: Array.isArray(staffMembers) ? staffMembers.length : 0,
        revenueData: revenueDataFormatted,
        profitData: profitDataFormatted,
        trendingServices: trendingServicesFormatted,
        trendingServicesLastMonth: trendingServicesLastMonthFormatted,
        trendingParts: trendingPartsFormatted
      });
      
      console.log('✅ [Manager Overview] All stats calculated from database');
      setLoading(false);
    } catch (err) {
      console.error('❌ [Manager Overview] Error:', err);
      setError(err.message || 'Failed to fetch overview data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchOverviewData
  };
};
