import { useState, useEffect } from "react";

interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}

const getResponsiveState = (): ResponsiveState => {
  if (typeof window === "undefined") {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: false,
      width: 0,
      height: 0,
    };
  }
  const width = window.innerWidth;
  const height = window.innerHeight;
  return {
    width,
    height,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
  };
};

export const useResponsive = (): ResponsiveState => {
  const [dimensions, setDimensions] = useState<ResponsiveState>(
    getResponsiveState()
  );

  useEffect(() => {
    const updateDimensions = () => setDimensions(getResponsiveState());
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return dimensions;
};
