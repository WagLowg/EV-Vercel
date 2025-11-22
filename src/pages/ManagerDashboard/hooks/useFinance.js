import { useState, useEffect } from 'react';
import * as API from '../../../api';
import { checkTokenValidity } from '../../../utils/tokenDebug';

/**
 * Custom hook for Finance & Reports
 * Fetches financial data for Manager Dashboard
 */
export const useFinance = () => {
  const [financeData, setFinanceData] = useState({
    revenue: { thisMonth: 0, lastMonth: 0, percentChange: 0, trend: 'up' },
    expenses: { thisMonth: 0 },
    profit: { thisMonth: 0 },
    revenueByService: {},
    paymentMethods: {},
    loading: true,
    error: null
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch all financial data
   */
  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 🔍 Debug: Check token before making API calls (but don't throw if expired - let axios handle it)
      console.log('🔍 [useFinance] Checking token validity...');
      const tokenCheck = checkTokenValidity();
      console.log('🔐 Token Status:', tokenCheck);
      
      // Only check role, not token validity (axiosClient will handle token expiration)
      if (tokenCheck.valid) {
        const roleUpperCase = tokenCheck.role?.toUpperCase();
        if (roleUpperCase !== 'MANAGER' && roleUpperCase !== 'ADMIN') {
          throw new Error(`Chỉ MANAGER hoặc ADMIN mới có quyền xem báo cáo tài chính. Role hiện tại: ${tokenCheck.role}`);
        }
        console.log('🔄 [useFinance] Fetching financial data...');
        console.log('  📍 User:', tokenCheck.user);
        console.log('  🎭 Role:', tokenCheck.role);
      } else {
        console.warn('⚠️ [useFinance] Token may be expired, but letting API call proceed (axiosClient will handle)');
      }

      // Fetch all financial data in parallel with individual error handling
      const results = await Promise.allSettled([
        API.getRevenueCurrentMonth().catch(err => {
          console.error('❌ getRevenueCurrentMonth failed:', err.response?.status, err.response?.data);
          return { thisMonth: 0, lastMonth: 0, percentChange: 0, trend: 'stable' };
        }),
        API.getCurrentMonthExpense().catch(err => {
          console.error('❌ getCurrentMonthExpense failed:', err.response?.status, err.response?.data);
          return 0;
        }),
        API.getRevenueByService().catch(err => {
          console.error('❌ getRevenueByService failed:', err.response?.status, err.response?.data);
          return {};
        }),
        API.getPaymentMethods().catch(err => {
          console.error('❌ getPaymentMethods failed:', err.response?.status, err.response?.data);
          return {};
        })
      ]);

      const [
        revenueResult,
        expenseResult,
        revenueByServiceResult,
        paymentMethodsResult
      ] = results;

      const revenueCurrentMonth = revenueResult.status === 'fulfilled' ? revenueResult.value : { thisMonth: 0, lastMonth: 0, percentChange: 0, trend: 'stable' };
      const expenseCurrentMonth = expenseResult.status === 'fulfilled' ? expenseResult.value : 0;
      const revenueByService = revenueByServiceResult.status === 'fulfilled' ? revenueByServiceResult.value : {};
      const paymentMethods = paymentMethodsResult.status === 'fulfilled' ? paymentMethodsResult.value : {};

      console.log('✅ [useFinance] Data loaded:', {
        revenueCurrentMonth,
        expenseCurrentMonth,
        revenueByService,
        paymentMethods
      });

      // Check if all APIs returned 403
      const allFailed = results.every(r => r.status === 'rejected');
      if (allFailed) {
        throw new Error('Backend trả về 403 Forbidden cho tất cả API tài chính. Vui lòng kiểm tra:\n1. SecurityConfig backend có cho phép MANAGER truy cập /api/management/reports/**\n2. Token có role MANAGER hoặc ADMIN');
      }

      // Calculate profit
      const profit = (revenueCurrentMonth.thisMonth || 0) - (expenseCurrentMonth || 0);

      setFinanceData({
        revenue: {
          thisMonth: revenueCurrentMonth.thisMonth || 0,
          lastMonth: revenueCurrentMonth.lastMonth || 0,
          percentChange: revenueCurrentMonth.percentChange || 0,
          trend: revenueCurrentMonth.trend || 'stable'
        },
        expenses: {
          thisMonth: expenseCurrentMonth || 0
        },
        profit: {
          thisMonth: profit
        },
        revenueByService: revenueByService || {},
        paymentMethods: paymentMethods || {},
        loading: false,
        error: null
      });

      setLoading(false);
      return financeData;
    } catch (err) {
      console.error('❌ [useFinance] Error loading financial data:', err);
      
      // Check if it's a token expiration error
      const isTokenError = 
        err.message?.toLowerCase().includes('token') ||
        err.message?.toLowerCase().includes('expired') ||
        err.response?.status === 401 ||
        err.response?.status === 403;
      
      let errorMsg;
      if (isTokenError && err.response?.status === 401) {
        errorMsg = 'Token đã hết hạn. Vui lòng đăng nhập lại.';
        // axiosClient interceptor will handle redirect, but we can also do it here
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else if (err.response?.status === 403) {
        errorMsg = '403 Forbidden: Bạn không có quyền truy cập báo cáo tài chính.';
      } else {
        errorMsg = err.message || 'Không thể tải dữ liệu tài chính. Vui lòng thử lại.';
      }
      
      setError(errorMsg);
      setLoading(false);
      return null;
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  return {
    financeData,
    loading,
    error,
    refetch: fetchFinanceData
  };
};
