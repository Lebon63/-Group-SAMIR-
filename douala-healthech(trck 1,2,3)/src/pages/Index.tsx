import { useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import LandingPage from "@/components/LandingPage";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner onComplete={handleLoadingComplete} />
      ) : (
        <LandingPage />
      )}
    </>
  );
};

export default Index;
