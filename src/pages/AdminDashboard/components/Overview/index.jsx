import React, { useEffect } from 'react';
import { useOverview } from '../../hooks/useOverview';
import { OverviewStats } from './OverviewStats';
import { OverviewCharts } from './OverviewCharts';
import { OverviewActivity } from './OverviewActivity';
import { OverviewComparison } from './OverviewComparison';
import './Overview.css';

export const OverviewTab = () => {
  const { overviewData, loading, error, fetchOverviewData } = useOverview();

  useEffect(() => {
    fetchOverviewData();
  }, [fetchOverviewData]);

  if (loading) {
    return (
      <div className="overview-loading">
        <div className="loading-spinner"></div>
        <p>⏳ Đang tải dữ liệu tổng quan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overview-error">
        <div className="error-icon">❌</div>
        <h3>Lỗi tải dữ liệu</h3>
        <p>{error}</p>
        <button onClick={fetchOverviewData} className="retry-btn">
          🔄 Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="overview-section">
      {/* Stats Cards */}
      <OverviewStats data={overviewData} />

      {/* Charts Section */}
      <OverviewCharts data={overviewData} />

      {/* Recent Activity */}
      <OverviewActivity />

      {/* Revenue Comparison */}
      <OverviewComparison revenue={overviewData.revenue} />
    </div>
  );
};
