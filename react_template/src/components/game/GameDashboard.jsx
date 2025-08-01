import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gameAPI from '../../services/gameAPI';

const GameDashboard = () => {
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [newAchievements, setNewAchievements] = useState([]);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = async () => {
    try {
      setLoading(true);
      // Get user's game state
      const stateRes = await gameAPI.getGameState();
      setGameState(stateRes.data);
      
      try {
        // Get leaderboard - wrap in separate try/catch to continue if this fails
        const leaderboardRes = await gameAPI.getLeaderboard();
        setLeaderboard(leaderboardRes.data);
      } catch (leaderboardErr) {
        console.error('Failed to load leaderboard:', leaderboardErr);
        // Don't break the entire component if just the leaderboard fails
        setLeaderboard([]);
      }
      
      // Check for new achievements
      if (stateRes.data.achievements && stateRes.data.achievements.length > 0) {
        // In a real app, you'd want to track which achievements are new vs. old
        // For demo purposes, we'll show all achievements as if they're new
        setNewAchievements(stateRes.data.achievements);
        if (stateRes.data.achievements.length > 0) {
          setShowAchievementModal(true);
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to load game data:', err);
      setError('Failed to load game data. Please try again.');
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    if (!gameState || !gameState.profile) return 0;
    
    const currentPoints = gameState.profile.points;
    const nextLevelPoints = gameState.next_level_points;
    const previousLevelPoints = nextLevelPoints - 100; // Simplified calculation
    
    const pointsForCurrentLevel = currentPoints - previousLevelPoints;
    const pointsNeededForNextLevel = nextLevelPoints - previousLevelPoints;
    
    return Math.round((pointsForCurrentLevel / pointsNeededForNextLevel) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button 
          onClick={loadGameData} 
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!gameState || !gameState.profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">No game profile!</strong>
          <span className="block sm:inline"> You need to create a game profile to view your game dashboard.</span>
        </div>
        <button 
          onClick={() => gameAPI.createGameProfile({ points: 0, level: 1, donation_streak: 0 }).then(loadGameData)} 
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Game Profile
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-center text-red-600 mb-8">
        Blood Hero Game Dashboard
      </h1>
      
      {/* Profile Overview Card */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-red-600 flex items-center justify-center text-white text-2xl font-bold">
                Level {gameState.profile.level}
              </div>
              {/* Donation Streak Badge */}
              {gameState.profile.donation_streak > 0 && (
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-gray-900 rounded-full h-10 w-10 flex items-center justify-center font-bold text-sm border-2 border-white">
                  {gameState.profile.donation_streak}🔥
                </div>
              )}
            </div>
            <p className="mt-2 font-semibold">Blood Hero</p>
          </div>
          
          <div className="flex-grow">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Level Progress
              </h2>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                <div 
                  className="bg-red-600 h-4 rounded-full" 
                  style={{width: `${calculateProgress()}%`}}
                ></div>
              </div>
              <div className="flex justify-between text-sm mt-1 text-gray-600">
                <span>Level {gameState.profile.level}</span>
                <span>{gameState.profile.points} / {gameState.next_level_points} Points</span>
                <span>Level {gameState.profile.level + 1}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-blue-600">{gameState.profile.points}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Total Donations</p>
                <p className="text-2xl font-bold text-green-600">{gameState.total_donations}</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Donation Streak</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {gameState.profile.donation_streak} {gameState.profile.donation_streak > 0 && '🔥'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Achievements Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Achievements</h2>
        
        {gameState.achievements && gameState.achievements.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gameState.achievements.map((achievement) => (
              <div key={achievement.id} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <span className="text-xl">🏆</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{achievement.achievement.name}</h3>
                  <p className="text-sm text-gray-600">{achievement.achievement.description}</p>
                  <p className="text-xs text-purple-600 font-semibold">+{achievement.achievement.points_reward} points</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>You haven't earned any achievements yet.</p>
            <p className="mt-2">Donate blood to earn achievements and level up!</p>
          </div>
        )}
      </div>
      
      {/* Leaderboard Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Leaderboard</h2>
        
        {leaderboard.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hero
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((profile, index) => (
                  <tr 
                    key={profile.id} 
                    className={gameState.profile.id === profile.id ? "bg-blue-50" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{index + 1}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                          {profile.level}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            Blood Hero
                          </div>
                          {gameState.profile.id === profile.id && (
                            <div className="text-xs text-blue-600 font-semibold">
                              (You)
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{profile.level}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{profile.points}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No leaderboard data available.</p>
          </div>
        )}
      </div>
      
      {/* New Achievement Modal */}
      {showAchievementModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full transform transition-all animate-in fade-in duration-300">
            <div className="text-center">
              <div className="mb-4">
                <div className="h-24 w-24 mx-auto rounded-full bg-yellow-400 flex items-center justify-center">
                  <span className="text-4xl">🏆</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Achievement Unlocked!
              </h3>
              <div className="space-y-4 mt-6">
                {newAchievements.slice(0, 1).map(achievement => (
                  <div key={achievement.id} className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-800">{achievement.achievement.name}</h4>
                    <p className="text-sm text-gray-700">{achievement.achievement.description}</p>
                    <p className="text-xs font-semibold text-yellow-600">+{achievement.achievement.points_reward} points</p>
                  </div>
                ))}
                {newAchievements.length > 1 && (
                  <p className="text-sm text-gray-500 italic">
                    + {newAchievements.length - 1} more achievements unlocked!
                  </p>
                )}
              </div>
              <button 
                onClick={() => setShowAchievementModal(false)}
                className="mt-6 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-bold py-2 px-6 rounded-full"
              >
                Awesome!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameDashboard;