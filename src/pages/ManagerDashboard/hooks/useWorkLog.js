import { useState, useEffect } from 'react';
import * as API from '../../../api';
import { getCurrentCenterId } from '../../../utils/centerFilter';

/**
 * Custom hook for WorkLog Management
 * Fetches and manages work logs for current center
 */
export const useWorkLog = () => {
  const [workLogs, setWorkLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all work logs for current center
   * Response format: [{ staffId: [number], appointmentId: number, hoursSpent: number, tasksDone: string }]
   */
  const fetchWorkLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 [useWorkLog] Fetching work logs...');
      
      const centerId = getCurrentCenterId();
      if (!centerId) {
        console.warn('⚠️ [useWorkLog] No centerId found for current manager');
        setWorkLogs([]);
        setLoading(false);
        return [];
      }

      console.log('🏢 [useWorkLog] Fetching work logs for centerId:', centerId);
      const workLogsData = await API.getAllWorkLogsByCenterId(centerId);
      console.log(`✅ [useWorkLog] Work logs loaded: ${workLogsData?.length || 0}`);
      
      // Fetch staff information to enrich work logs
      let staffMap = new Map();
      try {
        const staffAndTechnicians = await API.getStaffAndTechnician();
        if (Array.isArray(staffAndTechnicians)) {
          staffAndTechnicians.forEach(staff => {
            staffMap.set(staff.id, staff);
          });
          console.log('✅ [useWorkLog] Staff info loaded:', staffMap.size);
        }
      } catch (staffErr) {
        console.warn('⚠️ [useWorkLog] Could not fetch staff info:', staffErr);
      }
      
      // Enrich work logs with staff information
      const enrichedWorkLogs = Array.isArray(workLogsData) ? workLogsData.map((log, index) => {
        // Get first staffId from array (or handle multiple staff)
        const staffIds = Array.isArray(log.staffId) ? log.staffId : [log.staffId];
        const firstStaffId = staffIds[0];
        const staff = firstStaffId ? staffMap.get(firstStaffId) : null;
        
        // Generate unique ID: use existing id, or combine appointmentId, staffId, index, and tasksDone hash
        // This ensures uniqueness even if multiple worklogs have same appointmentId and staffId
        const tasksHash = log.tasksDone ? log.tasksDone.substring(0, 10).replace(/\s/g, '') : '';
        const uniqueId = log.id || `worklog-${log.appointmentId || 'na'}-${firstStaffId || 'na'}-${index}-${tasksHash}`;
        
        return {
          ...log,
          id: uniqueId,
          staff: staff || null,
          staffIds: staffIds,
          createdAt: log.createdAt || log.create_at || null
        };
      }) : [];
      
      console.log('✅ [useWorkLog] Enriched work logs:', enrichedWorkLogs.length);
      setWorkLogs(enrichedWorkLogs);
      return enrichedWorkLogs;
    } catch (err) {
      console.error('❌ [useWorkLog] Error loading work logs:', err);
      setError(err.message || 'Failed to load work logs');
      setWorkLogs([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchWorkLogs();
  }, []);

  return {
    workLogs,
    loading,
    error,
    fetchWorkLogs
  };
};

