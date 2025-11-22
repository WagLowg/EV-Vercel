import { useCallback, useEffect, useState } from "react";
import { getVehicles } from "../api";

const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVehicles();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError("Không thể tải danh sách xe. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    loading,
    error,
    refresh: fetchVehicles,
  };
};

export default useVehicles;

