import api from './api';

// Game API calls
const gameAPI = {
  // Get user's game profile
  getGameProfile: () => {
    return api.get('/game/profiles/me');
  },
  
  // Create a new game profile
  createGameProfile: (profileData) => {
    return api.post('/game/profiles', profileData);
  },
  
  // Get full game state including profile, achievements, etc.
  getGameState: () => {
    return api.get('/game/state');
  },
  
  // Process donation complete (usually called automatically)
  processDonationComplete: () => {
    return api.post('/game/donation-complete');
  },
  
  // Get leaderboard
  getLeaderboard: (limit = 10) => {
    return api.get(`/game/leaderboard?limit=${limit}`);
  },
  
  // Get all available achievements
  getAllAchievements: () => {
    return api.get('/game/achievements');
  },
  
  // Get user's earned achievements
  getMyAchievements: () => {
    return api.get('/game/achievements/me');
  },
};

export default gameAPI;