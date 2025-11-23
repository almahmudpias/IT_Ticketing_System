import api from './api';

export const analyticsService = {
  // Get ticket trends
  async getTicketTrends(timeRange = '30d') {
    try {
      return await api.get(`/analytics/trends?range=${timeRange}`);
    } catch (error) {
      throw error;
    }
  },

  // Get category distribution
  async getCategoryDistribution() {
    try {
      return await api.get('/analytics/categories');
    } catch (error) {
      throw error;
    }
  },

  // Get staff performance
  async getStaffPerformance() {
    try {
      return await api.get('/analytics/staff-performance');
    } catch (error) {
      throw error;
    }
  },

  // Get SLA compliance
  async getSLACompliance() {
    try {
      return await api.get('/analytics/sla-compliance');
    } catch (error) {
      throw error;
    }
  },

  // Get heatmap data
  async getHeatmapData() {
    try {
      return await api.get('/analytics/heatmap');
    } catch (error) {
      throw error;
    }
  },

  // Get asset health
  async getAssetHealth() {
    try {
      return await api.get('/analytics/asset-health');
    } catch (error) {
      throw error;
    }
  }
};