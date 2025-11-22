import React, { useState, useEffect, useMemo, useRef } from "react";
import "./BookingPage.css";
import {
  createAppointment,
  getVehicles,
  getVehicleByVin,
  getAllServiceTypes,
} from "../api";
import { serviceCenters, timeSlots } from "../constants/booking";
import BookingVehicleStep from "../components/booking/BookingVehicleStep";
import BookingBranchStep from "../components/booking/BookingBranchStep";
import BookingServicesStep from "../components/booking/BookingServicesStep";
import BookingScheduleStep from "../components/booking/BookingScheduleStep";
import BookingContactStep from "../components/booking/BookingContactStep";
import BookingSummarySidebar from "../components/booking/BookingSummarySidebar";
import { useToastContext } from "../contexts/ToastContext";

function BookingPage({ onNavigate, prefilledVehicle }) {
  const toast = useToastContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Vehicle Info (thông tin xe)
    licensePlate: prefilledVehicle?.licensePlate || prefilledVehicle?.vin || '',
    vehicleModel: prefilledVehicle?.model || '',
    mileage: '', // Số km đã chạy
    // Step 2: Service Center (Chi nhánh) (thông tin chi nhánh)
    serviceCenterId: null,  // ID chi nhánh được chọn    
    // Step 3: Services (thông tin dịch vụ)
    selectedServices: [],
    // Step 4: Schedule (thông tin lịch hẹn)
    selectedDate: null,
    selectedTime: '',   
    // Step 5: Personal Info (thông tin khách hàng)
    fullName: '',
    email: '',
    phone: '',
    agreeToTerms: false
  });

  // State cho danh sách xe và thông tin xe được chọn
  const [myVehicles, setMyVehicles] = useState([]);
  const [selectedVehicleInfo, setSelectedVehicleInfo] = useState(prefilledVehicle || null);
  const [vehicleLoading, setVehicleLoading] = useState(false);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [clientIp, setClientIp] = useState('127.0.0.1');
  const [expandedServices, setExpandedServices] = useState([]);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const hasCheckedAuth = useRef(false);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState(null);
  const [today] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const [calendarMonth, setCalendarMonth] = useState(() => ({
    month: today.getMonth(),
    year: today.getFullYear()
  }));
  // Pre-fetch client IP for payment gateway (fallback: 127.0.0.1)
  useEffect(() => {
    let isMounted = true;

    const fetchClientIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) {
          throw new Error(`Failed to fetch client IP: ${response.status}`);
        }
        const data = await response.json();
        if (data?.ip && isMounted) {
          setClientIp(data.ip);
        }
      } catch (error) {
        console.warn('⚠️ Không thể lấy địa chỉ IP client, sử dụng mặc định 127.0.0.1', error);
      }
    };

    fetchClientIp();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch service types from API
  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const fetchServiceTypes = async () => {
      try {
        setServicesLoading(true);
        setServicesError(null);
        console.log('📤 [BookingPage] Fetching service types from API...');
        
        // Set timeout for API call (8 seconds)
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Request timeout: API không phản hồi sau 8 giây. Vui lòng kiểm tra kết nối mạng hoặc thử lại.'));
          }, 8000);
        });

        const apiPromise = getAllServiceTypes();
        const data = await Promise.race([apiPromise, timeoutPromise]);
        
        clearTimeout(timeoutId);
        
        if (isMounted) {
          console.log('✅ [BookingPage] Service types loaded:', data);
          if (Array.isArray(data) && data.length > 0) {
            setServices(data);
            setServicesError(null);
          } else {
            console.warn('⚠️ [BookingPage] Service types array is empty or invalid');
            setServices([]);
            setServicesError('Không có gói dịch vụ nào');
          }
        }
      } catch (err) {
        clearTimeout(timeoutId);
        console.error('❌ [BookingPage] Lỗi khi tải danh sách gói dịch vụ:', err);
        console.error('❌ [BookingPage] Error details:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          url: err.config?.url
        });
        
        let errorMessage = 'Không thể tải danh sách gói dịch vụ';
        if (err.message) {
          errorMessage = err.message;
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response?.status) {
          if (err.response.status === 404) {
            errorMessage = 'API endpoint không tồn tại (/api/service-types). Vui lòng kiểm tra backend.';
          } else if (err.response.status === 401 || err.response.status === 403) {
            errorMessage = 'Cần đăng nhập để xem danh sách dịch vụ';
          } else {
            errorMessage = `Lỗi server (${err.response.status})`;
          }
        } else if (err.request) {
          errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc backend có đang chạy không.';
        }
        
        if (isMounted) {
          setServicesError(errorMessage);
          setServices([]);
        }
      } finally {
        if (isMounted) {
          setServicesLoading(false);
        }
      }
    };

    fetchServiceTypes();

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const maxBookingDate = useMemo(() => {
    const limit = new Date(today);
    limit.setMonth(limit.getMonth() + 2);
    limit.setHours(0, 0, 0, 0);
    return limit;
  }, [today]);

  const isSameDay = (dateA, dateB) => {
    if (!dateA || !dateB) return false;
    return (
      dateA.getFullYear() === dateB.getFullYear() &&
      dateA.getMonth() === dateB.getMonth() &&
      dateA.getDate() === dateB.getDate()
    );
  };

  const isDateBefore = (dateA, dateB) => dateA.getTime() < dateB.getTime();
  const isDateAfter = (dateA, dateB) => dateA.getTime() > dateB.getTime();

  const isTimeSlotInPast = (time, date) => {
    if (!date || !time) return false;
    const [hours, minutes] = time.split(':').map(Number);
    const slotDate = new Date(date);
    slotDate.setHours(hours, minutes, 0, 0);
    return slotDate.getTime() <= Date.now();
  };

  const handleDateSelection = (date) => {
    if (!date) return;
    setFormData(prev => {
      const shouldResetTime = prev.selectedTime && isTimeSlotInPast(prev.selectedTime, date);
      return {
        ...prev,
        selectedDate: date,
        selectedTime: shouldResetTime ? '' : prev.selectedTime
      };
    });
  };

  const handlePrevMonth = () => {
    setCalendarMonth(prev => {
      const prevMonthStart = new Date(prev.year, prev.month, 1);
      prevMonthStart.setMonth(prevMonthStart.getMonth() - 1);
      const prevMonthEnd = new Date(prevMonthStart.getFullYear(), prevMonthStart.getMonth() + 1, 0);
      prevMonthEnd.setHours(0, 0, 0, 0);
      if (isDateBefore(prevMonthEnd, today)) {
        return prev;
      }
      return {
        month: prevMonthStart.getMonth(),
        year: prevMonthStart.getFullYear()
      };
    });
  };

  const handleNextMonth = () => {
    setCalendarMonth(prev => {
      const nextMonthStart = new Date(prev.year, prev.month, 1);
      nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);
      if (isDateAfter(nextMonthStart, maxBookingDate)) {
        return prev;
      }
      return {
        month: nextMonthStart.getMonth(),
        year: nextMonthStart.getFullYear()
      };
    });
  };

  // Check đăng nhập và fetch data khi component mount
  useEffect(() => {
    // Chỉ check 1 lần để tránh popup hiển thị 2 lần
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    // Kiểm tra đăng nhập trước
    const token = localStorage.getItem('token');
    if (!token) {
      setShowLoginPopup(true);
      toast.showWarning('Bạn cần đăng nhập để đặt lịch hẹn');
      // Tự động redirect sau 2 giây
      setTimeout(() => {
        onNavigate('login');
      }, 2000);
      return;
    }

    const fetchMyVehicles = async () => {
      try {
        const data = await getVehicles();
        setMyVehicles(data || []);
      } catch (err) {
        console.error('Lỗi khi tải danh sách xe:', err);
      }
    };
    fetchMyVehicles();

    // Tự động điền thông tin user từ localStorage
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        // Lấy số điện thoại từ nhiều field có thể có
        const phoneNumber = user.phone || user.phoneNumber || user.mobile || '';
        // Loại bỏ country code nếu có (ví dụ: +84, 84) để chỉ giữ lại số
        const cleanPhone = phoneNumber ? phoneNumber.replace(/^(\+84|84)/, '').trim() : '';
        
        setFormData(prev => ({
          ...prev,
          fullName: user.fullName || user.name || '',
          email: user.email || '',
          phone: cleanPhone || phoneNumber || ''
        }));
        
        console.log('✅ Auto-filled user data:', {
          fullName: user.fullName || user.name || '',
          email: user.email || '',
          phone: cleanPhone || phoneNumber || ''
        });
      }
    } catch (err) {
      console.error('Lỗi khi tải thông tin user:', err);
    }
  }, [onNavigate]);

  // Cập nhật formData khi có thông tin xe được truyền vào
  useEffect(() => {
    if (prefilledVehicle) {
      setFormData(prev => ({
        ...prev,
        licensePlate: prefilledVehicle.licensePlate || prefilledVehicle.vin || '',
        vehicleModel: prefilledVehicle.model || ''
      }));
      setSelectedVehicleInfo(prefilledVehicle);
    }
  }, [prefilledVehicle]);

  // Tự động tìm xe khi nhập VIN
  useEffect(() => {
    const searchVehicleByVin = async () => {
      const vin = formData.licensePlate.trim();
      if (vin.length >= 3) {
        // Trước tiên tìm trong danh sách xe đã có
        const foundInList = myVehicles.find(v => 
          v.vin?.toLowerCase() === vin.toLowerCase() ||
          v.licensePlate?.toLowerCase() === vin.toLowerCase() ||
          v.vin === vin ||
          v.licensePlate === vin
        );

        if (foundInList) {
          setSelectedVehicleInfo(foundInList);
          setFormData(prev => ({
            ...prev,
            vehicleModel: foundInList.model || ''
          }));
          setVehicleLoading(false);
          return;
        }

        // Nếu không tìm thấy trong list, thử gọi API
        try {
          setVehicleLoading(true);
          const vehicle = await getVehicleByVin(vin);
          if (vehicle) {
            setSelectedVehicleInfo(vehicle);
            setFormData(prev => ({
              ...prev,
              vehicleModel: vehicle.model || ''
            }));
          } else {
            setSelectedVehicleInfo(null);
          }
        } catch (err) {
          // Xử lý lỗi không làm logout
          if (err.response?.status === 404) {
            // Không tìm thấy xe - đây là trường hợp bình thường
            setSelectedVehicleInfo(null);
            console.log('ℹ️ Không tìm thấy xe với VIN/biển số:', vin);
          } else if (err.response?.status === 401 || err.response?.status === 403) {
            // Lỗi authentication - không nên tự động logout ở đây
            console.warn('⚠️ Lỗi xác thực khi tìm xe:', err.response?.status);
            setSelectedVehicleInfo(null);
          } else {
            // Lỗi khác - chỉ log, không làm gì
            console.error('Lỗi khi tìm xe:', err);
            setSelectedVehicleInfo(null);
          }
        } finally {
          setVehicleLoading(false);
        }
      } else {
        setSelectedVehicleInfo(null);
      }
    };

    // Debounce để tránh gọi API quá nhiều
    const timeoutId = setTimeout(searchVehicleByVin, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.licensePlate, myVehicles]);

  // Handler để chọn xe từ dropdown
  const handleSelectVehicle = (vehicle) => {
    setFormData(prev => ({
      ...prev,
      licensePlate: vehicle.licensePlate || vehicle.vin,
      vehicleModel: vehicle.model || ''
    }));
    setSelectedVehicleInfo(vehicle);
    setShowVehicleDropdown(false);
  };

  const totalSteps = 5;

  const formatCurrency = (value) => {
    if (!value || Number.isNaN(value)) {
      return '0 ₫';
    }
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper function to identify service type
  const getServiceType = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return null;
    
    const name = (service.name || '').toLowerCase();
    if (name.includes('cao cấp') || name.includes('premium') || name.includes('full')) {
      return 'premium';
    } else if (name.includes('tiêu chuẩn') || name.includes('standard')) {
      return 'standard';
    } else if (name.includes('cơ bản') || name.includes('basic')) {
      return 'basic';
    }
    return null;
  };

  const handleServiceToggle = (serviceId) => {
    setFormData(prev => {
      const isCurrentlySelected = prev.selectedServices.includes(serviceId);
      const serviceType = getServiceType(serviceId);
      
      // If deselecting, just remove it
      if (isCurrentlySelected) {
        return {
          ...prev,
          selectedServices: prev.selectedServices.filter(id => id !== serviceId)
        };
      }
      
      // If selecting
      let newSelectedServices = [...prev.selectedServices];
      
      if (serviceType === 'premium') {
        // If selecting premium, remove basic and standard
        newSelectedServices = prev.selectedServices.filter(id => {
          const type = getServiceType(id);
          return type !== 'basic' && type !== 'standard';
        });
        newSelectedServices.push(serviceId);
      } else if (serviceType === 'basic' || serviceType === 'standard') {
        // If selecting basic or standard, remove premium if it's selected
        newSelectedServices = prev.selectedServices.filter(id => {
          const type = getServiceType(id);
          return type !== 'premium';
        });
        newSelectedServices.push(serviceId);
      } else {
        // For other service types, just add it
        newSelectedServices.push(serviceId);
      }
      
      return {
        ...prev,
        selectedServices: newSelectedServices
      };
    });
  };

  const toggleServiceDetails = (serviceId) => {
    setExpandedServices(prev => (
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    ));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    try {
      // Kiểm tra đăng nhập trước khi đặt lịch
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      console.log('🔐 Auth check:', {
        hasToken: !!token,
        token: token ? token.substring(0, 20) + '...' : null,
        user: user,
        userRole: user?.role
      });
      
   

      // Chuẩn bị dữ liệu theo format API backend
      // Kết hợp date và time thành ISO string
      const selectedDateObj = formData.selectedDate instanceof Date
        ? new Date(formData.selectedDate)
        : new Date();
      const timeString = formData.selectedTime || '09:00';
      const [hours, minutes] = timeString.split(':').map(Number);
      selectedDateObj.setHours(hours, minutes, 0, 0);

      if (selectedDateObj.getTime() <= Date.now()) {
        toast.showWarning('Thời gian đã chọn đã qua. Vui lòng chọn thời gian khác.');
        return;
      }

      const appointmentDateTime = selectedDateObj.toISOString();
      const createdAt = new Date().toISOString();

      const selectedServiceDetails = services.filter(service =>
        formData.selectedServices.includes(service.id)
      );
      const totalSelectedPrice = selectedServiceDetails.reduce((sum, service) => (
        sum + (service.price || service.priceValue || 0)
      ), 0);

      const appointmentData = {
        vehicleId: selectedVehicleInfo?.id || 0,  // ID xe từ database
        serviceCenterId: formData.serviceCenterId,  // ID trung tâm dịch vụ đã chọn
        appointmentDate: appointmentDateTime,  // ISO datetime string
        serviceTypeIds: formData.selectedServices,  // Array các ID dịch vụ (numbers)
        createdAt  // Thời điểm tạo lịch hẹn
      };

      // Validation
      if (!selectedVehicleInfo?.id) {
        toast.showWarning('Vui lòng chọn xe có sẵn trong hệ thống hoặc nhập VIN/biển số hợp lệ');
        return;
      }
      if (!formData.serviceCenterId) {
        toast.showWarning('Vui lòng chọn chi nhánh dịch vụ');
        return;
      }
      if (!formData.selectedServices || formData.selectedServices.length === 0) {
        toast.showWarning('Vui lòng chọn dịch vụ');
        return;
      }

      console.log('📤 Đang gửi yêu cầu đặt lịch...');
      console.log('📋 Appointment Data:', JSON.stringify(appointmentData, null, 2));
      console.log('🔍 Validation:', {
        vehicleIdValid: !!selectedVehicleInfo?.id,
        vehicleId: selectedVehicleInfo?.id,
        serviceCenterIdValid: !!formData.serviceCenterId,
        serviceCenterId: formData.serviceCenterId,
        serviceTypeIdsValid: formData.selectedServices?.length > 0,
        serviceTypeIds: formData.selectedServices,
        appointmentDateValid: !!appointmentDateTime,
        appointmentDate: appointmentDateTime
      });
      
      // Gọi API tạo lịch hẹn
      const response = await createAppointment(appointmentData);
      
      console.log('✅ Đặt lịch thành công:', response);
      console.log('📋 Response data:', {
        appointmentId: response.appointmentId || response.id,
        invoiceId: response.invoiceId,
        invoices: response.invoices
      });
      
      // ✅ Invoice đã được tạo tự động bởi backend khi đặt lịch
      const appointmentId = response.appointmentId || response.id;
      const invoiceId = response.invoiceId || (response.invoices && response.invoices[0]?.id);
      
      console.log('✅ Đặt lịch thành công:', response);
      
      // Kiểm tra xem có URL thanh toán từ backend không (VNPay, MoMo, etc.)
      const paymentUrl = response.url || response.paymentUrl || response.paymentLink;
      
      if (paymentUrl) {
        console.log('🔗 Redirecting to payment URL:', paymentUrl);
        toast.showSuccess('Đặt lịch thành công! Đang chuyển đến trang thanh toán...');
        // Redirect đến VNPay sandbox hoặc payment gateway khác
        setTimeout(() => {
          window.location.href = paymentUrl;
        }, 1500);
        return;
      }
      
      // Nếu không có payment URL, redirect đến payment-return với thông tin đặt lịch
      const returnUrl = `/payment-return?status=success&amount=${totalSelectedPrice}&orderId=${appointmentId || 'N/A'}&appointmentId=${appointmentId || ''}&message=Đặt lịch bảo dưỡng thành công`;
      
      toast.showSuccess('Đặt lịch thành công! Đang chuyển đến trang xác nhận...');
      setTimeout(() => {
        window.location.href = returnUrl;
      }, 1500);
      
    } catch (error) {
      console.error('Lỗi khi đặt lịch:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // Xử lý lỗi chi tiết hơn
      let errorMessage = 'Vui lòng thử lại sau';
      
      if (error.response?.status === 403) {
        // 403 Forbidden - Có thể do token hết hạn hoặc không có quyền
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const backendMessage = error.response?.data?.message || error.response?.data?.error || '';
        
        console.log('🚫 403 Forbidden - Debug info:', {
          hasToken: !!token,
          userRole: user?.role,
          backendMessage: backendMessage,
          responseData: error.response?.data
        });
        
        if (!token) {
          errorMessage = 'Bạn cần đăng nhập để đặt lịch hẹn';
          const confirmLogin = window.confirm(
            '⚠️ Bạn chưa đăng nhập.\n\nBạn có muốn đăng nhập ngay bây giờ không?'
          );
          if (confirmLogin) {
            onNavigate('login');
          }
        } else {
          // Hiển thị chi tiết error message từ backend
          const detailedMessage = backendMessage || 'Phiên đăng nhập đã hết hạn hoặc bạn không có quyền thực hiện thao tác này.';
          
          errorMessage = `🚫 Không thể đặt lịch hẹn\n\n❌ Lỗi: ${detailedMessage}\n\n💡 Có thể do:\n• Token hết hạn\n• Không có quyền (Role: ${user?.role || 'unknown'})\n• Dữ liệu không hợp lệ\n\nVui lòng đăng nhập lại.`;
          
          const confirmLogin = window.confirm(
            '⚠️ ' + errorMessage + '\n\nBạn có muốn đăng nhập lại không?'
          );
          if (confirmLogin) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            onNavigate('login');
          }
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        const confirmLogin = window.confirm(
          '⚠️ Phiên đăng nhập đã hết hạn.\n\nBạn có muốn đăng nhập lại không?'
        );
        if (confirmLogin) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          onNavigate('login');
        }
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.showError(`Không thể đặt lịch: ${errorMessage}`);
    }
  };

  const getProgressPercentage = () => {
    return (currentStep / totalSteps) * 100;
  };

  const getStepTitle = () => {
    switch(currentStep) {
      case 1: return 'Thông tin xe của bạn';
      case 2: return 'Chọn chi nhánh';
      case 3: return 'Chọn dịch vụ';
      case 4: return 'Lịch hẹn';
      case 5: return 'Chi tiết cá nhân';
      default: return '';
    }
  };

  const getStepSubtitle = () => {
    switch(currentStep) {
      case 1: return 'Đối với một đề nghị dịch vụ rõng bước, chúng tôi cần một số thông tin về xe của bạn.';
      case 2: return 'Vui lòng chọn chi nhánh gần bạn nhất để được phục vụ tốt nhất.';
      case 3: return 'Chọn dịch vụ phù hợp cho xe của bạn.';
      case 4: return 'Kiểm tra các cuộc hẹn có sẵn và chọn một cuộc hẹn phù hợp với lịch trình của bạn';
      case 5: return 'Chúng tôi chỉ cần một số thông tin về bạn.';
      default: return '';
    }
  };

  // Generate calendar days
  const calendarLabel = useMemo(() => {
    return `tháng ${calendarMonth.month + 1} năm ${calendarMonth.year}`;
  }, [calendarMonth]);

  const canGoPrevMonth = useMemo(() => {
    const prevMonthStart = new Date(calendarMonth.year, calendarMonth.month, 1);
    prevMonthStart.setMonth(prevMonthStart.getMonth() - 1);
    const prevMonthEnd = new Date(prevMonthStart.getFullYear(), prevMonthStart.getMonth() + 1, 0);
    prevMonthEnd.setHours(0, 0, 0, 0);
    return !isDateBefore(prevMonthEnd, today);
  }, [calendarMonth, today]);

  const canGoNextMonth = useMemo(() => {
    const nextDate = new Date(calendarMonth.year, calendarMonth.month, 1);
    nextDate.setMonth(nextDate.getMonth() + 1);
    return !isDateAfter(nextDate, maxBookingDate);
  }, [calendarMonth, maxBookingDate]);

  const generateCalendarDays = () => {
    const days = [];
    const { month, year } = calendarMonth;
    
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = (firstDayOfMonth.getDay() + 6) % 7; // Monday-first
    
    for (let i = 0; i < offset; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      days.push({ day, date });
    }
    
    while (days.length % 7 !== 0) {
      days.push(null);
    }
    
    return days;
  };

  const dateFormatter = useMemo(() => (
    new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  ), []);

  const formatDateLabel = (date) => {
    if (!date) return '';
    const value = dateFormatter.format(date);
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  // Hàm để lấy khuyến nghị gói dịch vụ dựa trên số km
  return (
    <div className="tesla-booking-container">
      {/* Login Required Popup */}
      {showLoginPopup && (
        <div className="login-popup-overlay">
          <div className="login-popup">
            <div className="login-popup-icon">🔒</div>
            <h3>Yêu cầu đăng nhập</h3>
            <p>Bạn cần đăng nhập để đặt lịch hẹn</p>
            <p className="login-popup-subtitle">Đang chuyển đến trang đăng nhập...</p>
            <div className="login-popup-spinner">
              <div className="spinner"></div>
            </div>
          </div>
        </div>
      )}

      {/* Back to Home Button */}
      <button 
        className="back-to-home-btn"
        onClick={() => onNavigate('home')}
        title="Quay về trang chủ"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
        </svg>
        <span>Đặt lịch bảo dưỡng</span>
      </button>

      {/* Top Header */}
      <div className="booking-top-header">
        <div className="booking-top-content">
          <div className="booking-breadcrumb">
            Đặt lịch bảo dưỡng › <span>{getStepTitle()}</span>
          </div>
          <button 
            className="booking-next-btn"
            onClick={currentStep === totalSteps ? handleSubmit : nextStep}
            disabled={
              (currentStep === 1 && !formData.licensePlate) ||
              (currentStep === 2 && !formData.serviceCenterId) ||
              (currentStep === 3 && formData.selectedServices.length === 0) ||
              (currentStep === 4 && (!formData.selectedDate || !formData.selectedTime)) ||
              (currentStep === 5 && (!formData.fullName || !formData.email || !formData.phone || !formData.agreeToTerms))
            }
          >
            {currentStep === totalSteps ? 'Hoàn thành' : 'Tiếp tục'}
            <span>›</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="tesla-booking-content">
        {/* Left Content */}
        <div className="booking-left-content">
          <div className="booking-step-header">
            <h1>{getStepTitle()}</h1>
            <p>{getStepSubtitle()}</p>
        </div>

          {currentStep === 1 && (
            <BookingVehicleStep
              formData={formData}
              vehicleLoading={vehicleLoading}
              showVehicleDropdown={showVehicleDropdown}
              setShowVehicleDropdown={setShowVehicleDropdown}
              myVehicles={myVehicles}
              handleSelectVehicle={handleSelectVehicle}
              handleInputChange={handleInputChange}
              selectedVehicleInfo={selectedVehicleInfo}
            />
          )}
          {currentStep === 2 && (
            <BookingBranchStep
              formData={formData}
              handleInputChange={handleInputChange}
              serviceCenters={serviceCenters}
            />
          )}
          {currentStep === 3 && (
            <BookingServicesStep
              formData={formData}
              services={services}
              servicesLoading={servicesLoading}
              servicesError={servicesError}
              expandedServices={expandedServices}
              toggleServiceDetails={toggleServiceDetails}
              handleServiceToggle={handleServiceToggle}
              formatCurrency={formatCurrency}
              selectedVehicleInfo={selectedVehicleInfo}
            />
          )}
          {currentStep === 4 && (
            <BookingScheduleStep
              calendarLabel={calendarLabel}
              handlePrevMonth={handlePrevMonth}
              handleNextMonth={handleNextMonth}
              canGoPrevMonth={canGoPrevMonth}
              canGoNextMonth={canGoNextMonth}
              calendarDays={generateCalendarDays()}
              today={today}
              maxBookingDate={maxBookingDate}
              formData={formData}
              handleDateSelection={handleDateSelection}
              isDateBefore={isDateBefore}
              isDateAfter={isDateAfter}
              isSameDay={isSameDay}
              timeSlots={timeSlots}
              isTimeSlotInPast={isTimeSlotInPast}
              handleInputChange={handleInputChange}
            />
          )}
          {currentStep === 5 && (
            <BookingContactStep
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

        {/* Navigation Buttons */}
          <div className="step-navigation">
          {currentStep > 1 && (
            <button 
                className="nav-btn nav-btn-back"
              onClick={prevStep}
            >
                ‹ Quay lại
            </button>
          )}
          </div>
        </div>

        {/* Right Sidebar */}
        <BookingSummarySidebar
          getProgressPercentage={getProgressPercentage}
          formData={formData}
          selectedVehicleInfo={selectedVehicleInfo}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          services={services}
          serviceCenters={serviceCenters}
          formatCurrency={formatCurrency}
          formatDateLabel={formatDateLabel}
        />
      </div>
    </div>
  );
}

export default BookingPage;