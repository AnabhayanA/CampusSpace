// API Client for CampusSpace Backend
const API_BASE_URL = 'http://localhost:3000/api';

class CampusSpaceAPI {
  // Get all courses
  static async getCourses() {
    try {
      const response = await fetch(`${API_BASE_URL}/courses`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching courses:', error);
      return { success: false, error: error.message };
    }
  }

  // Get room availability
  static async getRoomAvailability() {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/availability`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching room availability:', error);
      return { success: false, error: error.message };
    }
  }

  // Get specific room status
  static async getRoomStatus(roomName) {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${encodeURIComponent(roomName)}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching room status:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all buildings
  static async getBuildings() {
    try {
      const response = await fetch(`${API_BASE_URL}/buildings`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching buildings:', error);
      return { success: false, error: error.message };
    }
  }

  // Force refresh data from NJIT
  static async refreshData() {
    try {
      const response = await fetch(`${API_BASE_URL}/refresh`, {
        method: 'POST'
      });
      return await response.json();
    } catch (error) {
      console.error('Error refreshing data:', error);
      return { success: false, error: error.message };
    }
  }

  // Health check
  static async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Error checking health:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CampusSpaceAPI;
}
