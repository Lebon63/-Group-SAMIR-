import React, { useState, useEffect } from 'react';
import gameAPI from '../../services/gameAPI';

const AchievementsGallery = () => {
  const [allAchievements, setAllAchievements] = useState([]);
  const [myAchievements, setMyAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        try {
          // Fetch all achievements - continue even if this fails
          const allRes = await gameAPI.getAllAchievements();
          setAllAchievements(allRes.data);
        } catch (allErr) {
          console.error('Failed to load all achievements:', allErr);
          setAllAchievements([]);
        }
        
        try {
          // Fetch user achievements - continue even if this fails
          const myRes = await gameAPI.getMyAchievements();
          setMyAchievements(myRes.data);
        } catch (myErr) {
          console.error('Failed to load user achievements:', myErr);
          setMyAchievements([]);
        }
        
        setLoading(false);
        
        // Only set error if both requests failed
        if (allAchievements.length === 0 && myAchievements.length === 0) {
          setError('Unable to load achievement data. Please try again later.');
        }
      } catch (err) {
        console.error('Unexpected error loading achievements:', err);
        setError('Failed to load achievements data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to check if the user has earned an achievement
  const isAchievementEarned = (achievementId) => {
    return myAchievements.some(ua => ua.achievement_id === achievementId);
  };

  // Function to get the achievement icon based on name/type
  const getAchievementIcon = (iconName) => {
    switch (iconName) {
      case 'first_hero_badge':
        return '🩸';
      case 'regular_hero_badge':
        return '🏅';
      case 'super_hero_badge':
        return '🏆';
      case 'master_badge':
        return '👑';
      case 'streak_badge':
        return '🔥';
      default:
        return '🎖️';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64 p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Achievements Gallery</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allAchievements.map((achievement) => {
          const earned = isAchievementEarned(achievement.id);
          
          return (
            <div 
              key={achievement.id}
              className={`rounded-lg overflow-hidden transition-all duration-300 ${
                earned 
                  ? 'bg-gradient-to-br from-yellow-50 to-amber-100 border border-yellow-200 transform hover:scale-105' 
                  : 'bg-gray-100 border border-gray-200 opacity-70'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className={`h-14 w-14 rounded-full flex items-center justify-center text-2xl ${
                    earned ? 'bg-yellow-400 text-yellow-800' : 'bg-gray-300 text-gray-500'
                  }`}>
                    <span>{getAchievementIcon(achievement.icon)}</span>
                  </div>
                  
                  <div className="ml-4">
                    <h3 className={`font-bold text-lg ${earned ? 'text-amber-800' : 'text-gray-500'}`}>
                      {achievement.name}
                    </h3>
                    <p className={`text-sm ${earned ? 'text-amber-700' : 'text-gray-500'}`}>
                      {achievement.description}
                    </p>
                    <div className="mt-2 flex items-center">
                      <span className={`text-sm font-semibold ${earned ? 'text-amber-600' : 'text-gray-500'}`}>
                        +{achievement.points_reward} points
                      </span>
                      {earned && (
                        <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          Earned
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {allAchievements.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No achievements available yet.</p>
          <p className="mt-2">Check back soon!</p>
        </div>
      )}
    </div>
  );
};

export default AchievementsGallery;