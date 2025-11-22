import { useCallback, useEffect, useState } from "react";
import { getAppointments } from "../api";

// Map status từ API sang tiếng Việt
const mapStatusToVietnamese = (status) => {
  const statusMap = {
    // Uppercase
    COMPLETED: "Hoàn thành",
    DONE: "Hoàn thành",
    IN_PROGRESS: "Đang thực hiện",
    INPROGRESS: "Đang thực hiện",
    PENDING: "Chờ xác nhận",
    ACCEPTED: "Đã xác nhận",
    CANCELLED: "Đã hủy",
    CANCELED: "Đã hủy",
    // Lowercase
    completed: "Hoàn thành",
    done: "Hoàn thành",
    in_progress: "Đang thực hiện",
    inprogress: "Đang thực hiện",
    pending: "Chờ xác nhận",
    accepted: "Đã xác nhận",
    cancelled: "Đã hủy",
    canceled: "Đã hủy",
  };

  if (!status) return "Chưa xác định";
  
  // Normalize: trim và convert to string
  const normalizedStatus = String(status).trim();
  
  // Thử tìm trực tiếp trước (giữ nguyên case)
  if (statusMap[normalizedStatus]) {
    return statusMap[normalizedStatus];
  }
  
  // Thử uppercase
  const upperStatus = normalizedStatus.toUpperCase();
  if (statusMap[upperStatus]) {
    return statusMap[upperStatus];
  }
  
  // Thử lowercase
  const lowerStatus = normalizedStatus.toLowerCase();
  if (statusMap[lowerStatus]) {
    return statusMap[lowerStatus];
  }
  
  // Log để debug
  console.warn('⚠️ Status không được map:', status, '(normalized:', normalizedStatus + ')');
  return normalizedStatus;
};

// Format cost thành VNĐ
const formatCost = (cost) => {
  if (!cost || cost === 0) return "Chưa xác định";
  return `${cost.toLocaleString("vi-VN")} VNĐ`;
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "Chưa xác định";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Chưa xác định";
    
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Chưa xác định";
  }
};

const useBookingHistory = () => {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBookingHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getAppointments();
      
      // Debug: Log raw data để kiểm tra
      console.log('📋 Raw appointments data:', data);
      if (data && data.length > 0) {
        console.log('📋 First appointment status:', data[0].status, 'Type:', typeof data[0].status);
      }
      
      // Transform API data to match component format
      const transformedData = (data || []).map((appointment) => {
        const mappedStatus = mapStatusToVietnamese(appointment.status);
        console.log(`📋 Mapping status: "${appointment.status}" → "${mappedStatus}"`);
        
        return {
          id: appointment.appointmentId,
          date: formatDate(appointment.appointmentDate),
          service: appointment.serviceTypeName || "Dịch vụ bảo trì",
          status: mappedStatus,
          price: formatCost(appointment.cost),
          // Additional fields for details view
          rawStatus: appointment.status,
          rawDate: appointment.appointmentDate,
          rawCost: appointment.cost,
          serviceCenterName: appointment.serviceCenterName || "Chưa xác định",
          vehicleModel: appointment.vehicleModel || "Chưa xác định",
        };
      });
      
      // Sort by date descending (newest first)
      transformedData.sort((a, b) => {
        const dateA = new Date(a.rawDate);
        const dateB = new Date(b.rawDate);
        return dateB - dateA;
      });
      
      setBookingHistory(transformedData);
    } catch (err) {
      console.error("❌ Lỗi khi tải lịch sử đặt lịch:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Không thể tải lịch sử đặt lịch"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookingHistory();
  }, [loadBookingHistory]);

  const retry = () => {
    loadBookingHistory();
  };

  return {
    bookingHistory,
    loading,
    error,
    retry,
  };
};

export default useBookingHistory;

