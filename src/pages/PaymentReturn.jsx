import React, { useEffect, useState } from 'react';
import './PaymentReturn.css';

function PaymentReturn({ onNavigate }) {
  const [status, setStatus] = useState('processing');
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Parse query params từ URL
    const urlParams = new URLSearchParams(window.location.search);
    
    const info = {
      // Custom backend params (simple format)
      status: urlParams.get('status'),
      amount: urlParams.get('amount'),
      orderId: urlParams.get('orderId'),
      appointmentId: urlParams.get('appointmentId'),
      message: urlParams.get('message'),
      
      // VNPay params (fallback)
      transactionStatus: urlParams.get('vnp_TransactionStatus'),
      responseCode: urlParams.get('vnp_ResponseCode'),
      txnRef: urlParams.get('vnp_TxnRef'),
      vnpAmount: urlParams.get('vnp_Amount'),
      bankCode: urlParams.get('vnp_BankCode'),
      bankTranNo: urlParams.get('vnp_BankTranNo'),
      cardType: urlParams.get('vnp_CardType'),
      payDate: urlParams.get('vnp_PayDate'),
      orderInfo: urlParams.get('vnp_OrderInfo'),
      
      // MoMo params (fallback)
      resultCode: urlParams.get('resultCode'),
    };

    console.log('💳 Payment return params:', info);
    setPaymentInfo(info);

    // Xác định trạng thái thanh toán
    // Priority 1: Custom backend format
    // Priority 2: VNPay format
    // Priority 3: MoMo format
    const isSuccess = 
      info.status === 'success' ||                    // Custom backend
      info.transactionStatus === '00' ||              // VNPay
      info.responseCode === '00' ||                   // VNPay
      info.resultCode === '0';                        // MoMo

    setStatus(isSuccess ? 'success' : 'failed');
  }, []);

  // Countdown và auto redirect
  useEffect(() => {
    if (status !== 'success') return;
    
    if (countdown <= 0) {
      onNavigate('home');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, status, onNavigate]);

  const formatAmount = (amount, isVNPayFormat = false) => {
    if (!amount) return 'N/A';
    // VNPay amount is in cents (x100), custom backend is real amount
    const actualAmount = isVNPayFormat ? parseInt(amount) / 100 : parseInt(amount);
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(actualAmount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    // Format: YYYYMMDDHHmmss
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const hour = dateStr.substring(8, 10);
    const minute = dateStr.substring(10, 12);
    return `${day}/${month}/${year} ${hour}:${minute}`;
  };

  const getResponseMessage = (code) => {
    const messages = {
      '00': 'Giao dịch thành công',
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
      '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
      '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
      '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
      '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).',
      '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
      '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
      '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
      '75': 'Ngân hàng thanh toán đang bảo trì.',
      '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.',
      '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)'
    };
    return messages[code] || 'Lỗi không xác định';
  };

  if (status === 'processing') {
    return (
      <div className="payment-return-container">
        <div className="payment-return-card">
          <div className="spinner-large"></div>
          <h2>Đang xử lý kết quả thanh toán...</h2>
          <p>Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="payment-return-container">
        <div className="payment-return-card success">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h1>Thanh toán thành công!</h1>
          <p className="success-message">
            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. 
            Đơn hàng của bạn đã được xác nhận.
          </p>

          <div className="payment-details">
            <h3>Thông tin giao dịch</h3>
            <div className="detail-grid">
              {/* Order ID - Priority: orderId > appointmentId > txnRef */}
              {(paymentInfo?.orderId || paymentInfo?.appointmentId || paymentInfo?.txnRef) && (
                <div className="detail-item">
                  <span className="detail-label">Mã đơn hàng:</span>
                  <span className="detail-value">
                    {paymentInfo.orderId || paymentInfo.appointmentId || paymentInfo.txnRef}
                  </span>
                </div>
              )}
              
              {/* Amount - Priority: amount > vnpAmount */}
              {(paymentInfo?.amount || paymentInfo?.vnpAmount) && (
                <div className="detail-item">
                  <span className="detail-label">Số tiền:</span>
                  <span className="detail-value highlight">
                    {paymentInfo.amount 
                      ? formatAmount(paymentInfo.amount, false)  // Custom backend format
                      : formatAmount(paymentInfo.vnpAmount, true) // VNPay format (x100)
                    }
                  </span>
                </div>
              )}
              
              {/* Bank info (VNPay only) */}
              {paymentInfo?.bankCode && (
                <div className="detail-item">
                  <span className="detail-label">Ngân hàng:</span>
                  <span className="detail-value">{paymentInfo.bankCode}</span>
                </div>
              )}
              
              {paymentInfo?.cardType && (
                <div className="detail-item">
                  <span className="detail-label">Loại thẻ:</span>
                  <span className="detail-value">{paymentInfo.cardType}</span>
                </div>
              )}
              
              {/* Payment time (VNPay format) */}
              {paymentInfo?.payDate && (
                <div className="detail-item">
                  <span className="detail-label">Thời gian:</span>
                  <span className="detail-value">{formatDate(paymentInfo.payDate)}</span>
                </div>
              )}
              
              {/* Message/Order info */}
              {(paymentInfo?.message || paymentInfo?.orderInfo) && (
                <div className="detail-item full-width">
                  <span className="detail-label">Nội dung:</span>
                  <span className="detail-value">{paymentInfo.message || paymentInfo.orderInfo}</span>
                </div>
              )}
            </div>
          </div>

          <p className="countdown-text">
            Tự động chuyển về trang chủ sau {countdown} giây...
          </p>

          <div className="action-buttons">
            <button className="btn-primary" onClick={() => onNavigate('home')}>
              Về trang chủ ngay
            </button>
            <button className="btn-secondary" onClick={() => onNavigate('profile')}>
              Xem lịch sử đặt lịch
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Failed status
  return (
    <div className="payment-return-container">
      <div className="payment-return-card failed">
        <div className="failed-icon">
          <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <h1>Thanh toán không thành công</h1>
        <p className="failed-message">
          {paymentInfo?.message || 
           getResponseMessage(paymentInfo?.responseCode || paymentInfo?.transactionStatus)}
        </p>

        <div className="payment-details">
          <h3>Thông tin giao dịch</h3>
          <div className="detail-grid">
            {/* Order ID */}
            {(paymentInfo?.orderId || paymentInfo?.appointmentId || paymentInfo?.txnRef) && (
              <div className="detail-item">
                <span className="detail-label">Mã đơn hàng:</span>
                <span className="detail-value">
                  {paymentInfo.orderId || paymentInfo.appointmentId || paymentInfo.txnRef}
                </span>
              </div>
            )}
            
            {/* Error code */}
            {paymentInfo?.responseCode && (
              <div className="detail-item">
                <span className="detail-label">Mã lỗi:</span>
                <span className="detail-value">{paymentInfo.responseCode}</span>
              </div>
            )}
            
            {/* Amount */}
            {(paymentInfo?.amount || paymentInfo?.vnpAmount) && (
              <div className="detail-item">
                <span className="detail-label">Số tiền:</span>
                <span className="detail-value">
                  {paymentInfo.amount 
                    ? formatAmount(paymentInfo.amount, false)
                    : formatAmount(paymentInfo.vnpAmount, true)
                  }
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="action-buttons">
          <button className="btn-primary" onClick={() => onNavigate('booking')}>
            Thử lại
          </button>
          <button className="btn-secondary" onClick={() => onNavigate('home')}>
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentReturn;

