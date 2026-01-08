import { useState, useCallback } from "react";
import { screens } from "@/data/content";

export type ScreenId = "about" | "experience" | "skills" | "projects" | "education";

interface UseScreenNavigationReturn {
  currentScreen: ScreenId;
  currentIndex: number;
  isTransitioning: boolean;
  transitionDirection: "forward" | "backward";
  goToScreen: (screenId: ScreenId) => void;
  goNext: () => void;
  goPrevious: () => void;
  getWindowTitle: () => string;
}

export function useScreenNavigation(
  initialScreen: ScreenId = "about",
  transitionDuration: number = 400
): UseScreenNavigationReturn {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(initialScreen);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<"forward" | "backward">("forward");

  const screenIds = screens.map(s => s.id) as ScreenId[];
  const currentIndex = screenIds.indexOf(currentScreen);

  const goToScreen = useCallback((screenId: ScreenId) => {
    if (isTransitioning || screenId === currentScreen) return;

    const newIndex = screenIds.indexOf(screenId);
    const direction = newIndex > currentIndex ? "forward" : "backward";

    setIsTransitioning(true);
    setTransitionDirection(direction);
    setCurrentScreen(screenId);

    setTimeout(() => {
      setIsTransitioning(false);
    }, transitionDuration);
  }, [isTransitioning, currentScreen, currentIndex, screenIds, transitionDuration]);

  const goNext = useCallback(() => {
    if (currentIndex < screenIds.length - 1) {
      goToScreen(screenIds[currentIndex + 1]);
    }
  }, [currentIndex, screenIds, goToScreen]);

  const goPrevious = useCallback(() => {
    if (currentIndex > 0) {
      goToScreen(screenIds[currentIndex - 1]);
    }
  }, [currentIndex, screenIds, goToScreen]);

  const getWindowTitle = useCallback(() => {
    const screen = screens.find(s => s.id === currentScreen);
    return screen?.windowTitle || "PORTFOLIO.EXE";
  }, [currentScreen]);

  return {
    currentScreen,
    currentIndex,
    isTransitioning,
    transitionDirection,
    goToScreen,
    goNext,
    goPrevious,
    getWindowTitle
  };
}
