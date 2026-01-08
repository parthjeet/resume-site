import { useState } from "react";
import { BootSequence } from "@/components/BootSequence";
import { WindowContainer } from "@/components/WindowContainer";
import { Taskbar } from "@/components/Taskbar";
import { AboutScreen } from "@/components/screens/AboutScreen";
import { ExperienceScreen } from "@/components/screens/ExperienceScreen";
import { SkillsScreen } from "@/components/screens/SkillsScreen";
import { ProjectsScreen } from "@/components/screens/ProjectsScreen";
import { EducationScreen } from "@/components/screens/EducationScreen";
import { useScreenNavigation, ScreenId } from "@/hooks/useScreenNavigation";
import { screens } from "@/data/content";

const Index = () => {
  const [bootComplete, setBootComplete] = useState(false);
  const { 
    currentScreen, 
    isTransitioning, 
    goToScreen, 
    getWindowTitle 
  } = useScreenNavigation();

  const currentScreenData = screens.find(s => s.id === currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case "about":
        return <AboutScreen onNavigate={goToScreen} />;
      case "experience":
        return <ExperienceScreen />;
      case "skills":
        return <SkillsScreen />;
      case "projects":
        return <ProjectsScreen />;
      case "education":
        return <EducationScreen />;
      default:
        return <AboutScreen onNavigate={goToScreen} />;
    }
  };

  if (!bootComplete) {
    return (
      <BootSequence onComplete={() => setBootComplete(true)}>
        <div className="min-h-screen bg-background" />
      </BootSequence>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 pb-16">
        <WindowContainer
          title={getWindowTitle()}
          icon={currentScreenData?.icon}
          isTransitioning={isTransitioning}
        >
          {renderScreen()}
        </WindowContainer>
      </main>

      {/* Taskbar */}
      <Taskbar
        currentScreen={currentScreen}
        onNavigate={goToScreen}
        isTransitioning={isTransitioning}
      />
    </div>
  );
};

export default Index;
