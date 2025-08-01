import { useEffect, useState } from "react";
import { Heart, Activity } from "lucide-react";

interface LoadingSpinnerProps {
  onComplete: () => void;
}

const LoadingSpinner = ({ onComplete }: LoadingSpinnerProps) => {
  const [progress, setProgress] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const messageTimer = setTimeout(() => {
      setShowMessage(true);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(messageTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-healthcare-orange rounded-full animate-pulse-slow delay-500"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-healthcare-teal rounded-full animate-pulse-slow delay-1000"></div>
      </div>

      <div className="text-center z-10">
        {/* Main loading animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto relative">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-spin">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-2 h-2 bg-healthcare-orange rounded-full"></div>
            </div>
            
            {/* Inner pulsing heart */}
            <div className="absolute inset-4 flex items-center justify-center">
              <Heart className="w-8 h-8 text-white animate-pulse-slow" fill="currentColor" />
            </div>
          </div>
          
          {/* Activity indicator */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <Activity className="w-6 h-6 text-healthcare-orange animate-pulse" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-80 mx-auto mb-6">
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-healthcare-orange to-white rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-white/80 text-sm mt-2 font-medium">{progress}%</div>
        </div>

        {/* Loading messages */}
        <div className="text-white space-y-2">
          <h1 className="text-3xl font-bold mb-2 animate-bounce-in">
            Douala HealthTech Forge
          </h1>
          
          {showMessage && (
            <div className="animate-slide-up">
              <p className="text-lg text-white/90 mb-1">Initializing AI Solutions...</p>
              <p className="text-sm text-white/70">Co-creating Healthcare Innovation</p>
            </div>
          )}
        </div>

        {/* Partners logos hint */}
        {progress > 70 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-slide-up">
            <p className="text-white/60 text-xs">Powered by APHRC × Data Science Without Borders</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;