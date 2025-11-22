import { useEffect, useMemo, useState, useCallback } from "react";
import { getCustomersByRole } from "../api";

const useStaffCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCustomersByRole();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách khách hàng:", err);
      const message =
        err.response?.data?.message || "Không thể tải danh sách khách hàng";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) {
      return customers;
    }

    const query = searchQuery.toLowerCase();
    return customers.filter((customer) => {
      const name = (customer.fullName || customer.name || "").toLowerCase();
      const email = (customer.email || "").toLowerCase();
      const phone = customer.phone || "";

      return (
        name.includes(query) || email.includes(query) || phone.includes(searchQuery)
      );
    });
  }, [customers, searchQuery]);

  return {
    customers,
    filteredCustomers,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    refetchCustomers: fetchCustomers,
  };
};

export default useStaffCustomers;

