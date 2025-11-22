import React from 'react';
import { useOverview } from '../../hooks/useOverview';
import { OverviewStats } from './OverviewStats';
import { OverviewCharts } from './OverviewCharts';
import { OverviewTrending } from './OverviewTrending';

export const OverviewTab = () => {
  const { stats, loading, error, refetch } = useOverview();

  if (loading) {
    return (
      <div className="overview-section">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu tổng quan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overview-section">
        <div className="error-state">
          <p>❌ {error}</p>
          <button onClick={refetch} className="btn-retry">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overview-section">
      <OverviewStats stats={stats} />
      <OverviewCharts stats={stats} onRefresh={refetch} />
      <OverviewTrending stats={stats} />
    </div>
  );
};
