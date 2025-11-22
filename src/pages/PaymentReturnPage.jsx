import React, { useEffect, useMemo, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { handlePaymentReturn } from '../api';

const formatCurrency = (value) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return '—';
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(Number(value));
};

const PaymentReturnPage = ({ onNavigate }) => {
  const [status, setStatus] = useState('processing');
  const [paymentResult, setPaymentResult] = useState(null);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(5);

  const queryParams = useMemo(() => {
    if (typeof window === 'undefined') {
      return {};
    }
    const params = new URLSearchParams(window.location.search);
    const result = {};
    params.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }, []);

  useEffect(() => {
    const processPaymentReturn = async () => {
      try {
        setStatus('processing');
        console.log('🔍 DEBUG: queryParams =', queryParams);
        console.log('🔍 DEBUG: Calling handlePaymentReturn...');
        const result = await handlePaymentReturn(queryParams);
        console.log('🔍 DEBUG: handlePaymentReturn response =', result);
        setPaymentResult(result);

        const isSuccess =
          result.success === true ||
          result.status === 'success' ||
          result.vnp_TransactionStatus === '00' ||
          result.resultCode === '0';

        if (isSuccess) {
          setStatus('success');
          setCountdown(5);
        } else {
          setStatus('failed');
          setError(
            result.message ||
              result.vnp_Message ||
              'Thanh toán không thành công. Vui lòng thử lại hoặc liên hệ hỗ trợ.'
          );
        }
      } catch (err) {
        console.error('❌ Lỗi xử lý payment return:', err);
        setStatus('failed');
        setError(
          err.response?.data?.message ||
            err.message ||
            'Không thể xử lý kết quả thanh toán. Vui lòng thử lại sau.'
        );
      }
    };

    if (Object.keys(queryParams).length > 0) {
      processPaymentReturn();
    } else {
      setStatus('failed');
      setError('Không tìm thấy tham số kết quả thanh toán trong URL.');
    }
  }, [onNavigate, queryParams]);

  useEffect(() => {
    if (status !== 'success') return;
    if (countdown <= 0) {
      onNavigate && onNavigate('home', { toast: { type: 'success', message: 'Đặt lịch và thanh toán thành công!' } });
      return;
    }
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, onNavigate, status]);

  if (status === 'processing') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <FaSpinner style={{ ...styles.icon, animation: 'spin 1s linear infinite' }} />
          <h2>Đang xác thực thanh toán...</h2>
          <p>Vui lòng đợi trong giây lát.</p>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.card, ...styles.failed }}>
          <FaTimesCircle style={{ ...styles.icon, color: '#dc2626' }} />
          <h2>Thanh toán thất bại</h2>
          <p style={styles.message}>{error}</p>
          <button style={styles.primaryBtn} onClick={() => onNavigate && onNavigate('booking')}>
            Quay lại đặt lịch
          </button>
          <button style={styles.secondaryBtn} onClick={() => onNavigate && onNavigate('home')}>
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={{ ...styles.card, ...styles.success }}>
        <FaCheckCircle style={{ ...styles.icon, color: '#16a34a' }} />
        <h2>Thanh toán thành công</h2>
        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>

        <div style={styles.details}>
          {paymentResult?.appointmentId && (
            <DetailRow label="Mã lịch hẹn" value={`#${paymentResult.appointmentId}`} />
          )}
          {paymentResult?.invoiceId && (
            <DetailRow label="Mã hóa đơn" value={`#${paymentResult.invoiceId}`} />
          )}
          {paymentResult?.orderId && (
            <DetailRow label="Mã giao dịch" value={paymentResult.orderId} />
          )}
          {paymentResult?.paymentId && (
            <DetailRow label="Mã thanh toán" value={paymentResult.paymentId} />
          )}
          <DetailRow
            label="Số tiền thanh toán"
            value={formatCurrency(
              paymentResult?.amount ||
                paymentResult?.totalAmount ||
                paymentResult?.vnp_Amount / 100 ||
                paymentResult?.payAmount
            )}
          />
          {paymentResult?.method && (
            <DetailRow label="Phương thức" value={paymentResult.method} />
          )}
          {paymentResult?.bankCode && (
            <DetailRow label="Ngân hàng" value={paymentResult.bankCode} />
          )}
        </div>

        <p style={{ marginTop: '1rem', color: '#4b5563' }}>
          Bạn sẽ được chuyển về trang chủ sau {countdown} giây...
        </p>
        <button
          style={styles.primaryBtn}
          onClick={() =>
            onNavigate &&
            onNavigate('home', {
              toast: { type: 'success', message: 'Đặt lịch và thanh toán thành công!' }
            })
          }
        >
          Về trang chủ ngay
        </button>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div style={styles.detailRow}>
    <span style={styles.detailLabel}>{label}</span>
    <span style={styles.detailValue}>{value}</span>
  </div>
);

const styles = {
  container: {
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8fafc',
    padding: '2rem'
  },
  card: {
    width: '100%',
    maxWidth: '520px',
    background: '#ffffff',
    borderRadius: '16px',
    padding: '2.5rem',
    boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
    textAlign: 'center',
    border: '1px solid #e2e8f0'
  },
  success: {
    borderColor: '#bbf7d0',
    background: '#f0fdf4'
  },
  failed: {
    borderColor: '#fecaca',
    background: '#fef2f2'
  },
  icon: {
    fontSize: '48px',
    marginBottom: '1rem'
  },
  details: {
    textAlign: 'left',
    marginTop: '1.5rem',
    background: '#ffffff',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: 'inset 0 0 0 1px #e0e7ff'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
    fontSize: '15px'
  },
  detailLabel: {
    color: '#475569',
    fontWeight: 500
  },
  detailValue: {
    fontWeight: 600,
    color: '#0f172a'
  },
  message: {
    margin: '1rem 0',
    color: '#dc2626'
  },
  primaryBtn: {
    marginTop: '1.5rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '9999px',
    border: 'none',
    background: '#2563eb',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer'
  },
  secondaryBtn: {
    marginTop: '0.75rem',
    padding: '0.6rem 1.5rem',
    borderRadius: '9999px',
    border: '1px solid #94a3b8',
    background: '#fff',
    color: '#1e293b',
    fontWeight: 500,
    cursor: 'pointer'
  }
};

export default PaymentReturnPage;

