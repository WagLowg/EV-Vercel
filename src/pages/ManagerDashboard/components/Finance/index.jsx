import React from 'react';
import { FaMoneyBillWave, FaReceipt, FaChartLine, FaCreditCard, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useFinance } from '../../hooks/useFinance';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(value || 0);
};

export const FinanceTab = () => {
  const { financeData, loading, error, refetch } = useFinance();

  if (loading) {
    return (
      <div className="finance-section">
        <div className="loading-message" style={{padding: '60px 20px', textAlign: 'center'}}>
          <div className="spinner" style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{fontSize: '16px', color: '#666'}}>⏳ Đang tải dữ liệu tài chính...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const isTokenError = error.toLowerCase().includes('token') || error.toLowerCase().includes('hết hạn');
    
    return (
      <div className="finance-section">
        <div className="error-message" style={{
          padding: '60px 40px',
          textAlign: 'center',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <FaMoneyBillWave 
            size={60} 
            style={{
              color: '#fca5a5',
              marginBottom: '20px',
              opacity: 0.6
            }} 
          />
          <h3 style={{
            margin: '0 0 12px',
            fontSize: '20px',
            fontWeight: '600',
            color: '#ef4444'
          }}>
            Lỗi tải dữ liệu tài chính
          </h3>
          <p style={{
            margin: '0 0 24px',
            fontSize: '14px',
            color: '#666',
            lineHeight: '1.6'
          }}>
            {error}
          </p>
          {!isTokenError && (
            <button
              onClick={refetch}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
              }}
            >
              🔄 Thử lại
            </button>
          )}
          {isTokenError && (
            <p style={{
              marginTop: '16px',
              fontSize: '12px',
              color: '#999',
              fontStyle: 'italic'
            }}>
              Đang chuyển hướng đến trang đăng nhập...
            </p>
          )}
        </div>
      </div>
    );
  }

  const { revenue, expenses, profit, revenueByService, paymentMethods } = financeData;

  return (
    <div className="finance-section">
      {/* Stats Cards */}
      <div className="finance-stats" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px'}}>
        <div className="stat-card revenue" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <FaMoneyBillWave size={40} />
            <div>
              <h3 style={{margin: 0, fontSize: '28px', fontWeight: 'bold'}}>{formatCurrency(revenue.thisMonth)}</h3>
              <p style={{margin: '4px 0 0', opacity: 0.9}}>Doanh thu tháng này</p>
              {revenue.percentChange !== 0 && (
                <div style={{display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', fontSize: '14px'}}>
                  {revenue.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                  <span>{Math.abs(revenue.percentChange)}% so với tháng trước</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="stat-card expense" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <FaReceipt size={40} />
            <div>
              <h3 style={{margin: 0, fontSize: '28px', fontWeight: 'bold'}}>{formatCurrency(expenses.thisMonth)}</h3>
              <p style={{margin: '4px 0 0', opacity: 0.9}}>Chi phí tháng này</p>
            </div>
          </div>
        </div>

        <div className="stat-card profit" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <FaChartLine size={40} />
            <div>
              <h3 style={{margin: 0, fontSize: '28px', fontWeight: 'bold'}}>{formatCurrency(profit.thisMonth)}</h3>
              <p style={{margin: '4px 0 0', opacity: 0.9}}>Lợi nhuận tháng này</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by Service & Payment Methods */}
      <div className="finance-content" style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px'}}>
        {/* Revenue by Service */}
        <div className="revenue-chart-card" style={{background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <h3 style={{marginTop: 0, marginBottom: '20px', fontSize: '18px', fontWeight: '600'}}>
            📊 Doanh thu theo dịch vụ
          </h3>
          {Object.keys(revenueByService).length > 0 ? (
            <div className="service-revenue-list">
              {Object.entries(revenueByService).map(([serviceName, amount], index) => (
                <div key={index} className="service-revenue-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #e5e7eb'}}>
                  <div className="service-info">
                    <strong>{serviceName}</strong>
                  </div>
                  <div className="revenue-amount" style={{fontSize: '16px', fontWeight: '600', color: '#667eea'}}>
                    {formatCurrency(amount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{color: '#999', textAlign: 'center', padding: '20px'}}>Chưa có dữ liệu</p>
          )}
        </div>

        {/* Payment Methods */}
        <div className="payment-methods-card" style={{background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <h3 style={{marginTop: 0, marginBottom: '20px', fontSize: '18px', fontWeight: '600'}}>
            💳 Phương thức thanh toán
          </h3>
          {Object.keys(paymentMethods).length > 0 ? (
            <div className="payment-stats" style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              {Object.entries(paymentMethods).map(([method, stats], index) => (
                <div key={index} className="payment-item" style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#f9fafb', borderRadius: '8px'}}>
                  <FaCreditCard size={24} color="#667eea" />
                  <div style={{flex: 1}}>
                    <strong style={{display: 'block', marginBottom: '4px'}}>{method}</strong>
                    <p style={{margin: 0, fontSize: '14px', color: '#666'}}>
                      {stats.count} giao dịch • {formatCurrency(stats.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{color: '#999', textAlign: 'center', padding: '20px'}}>Chưa có dữ liệu</p>
          )}
        </div>
      </div>
    </div>
  );
};
