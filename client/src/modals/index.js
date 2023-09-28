import ChangeCardStats from './changeCardStats.jsx';
import CheckGraveyard from './checkGraveyard.jsx';
import ChangePoints from './changePoints.jsx';
import HotSeatMenu from './HotSeatStartMenu/HotSeatStartMenu.jsx';
import ChangeStartCards from './changeStartCards.jsx';
import GreetingWindow from './Tutorial/greetingWindow.jsx';
import TutorialStepsWindow from './Tutorial/TutorialStepsWindow.jsx';
import TutorialFinish from './Tutorial/lastStepWindow.jsx';

const modals = {
  tutorialSteps: TutorialStepsWindow,
  tutorial: GreetingWindow,
  tutorialFinish: TutorialFinish,
  drawCards: ChangeStartCards,
  changeStats: ChangeCardStats,
  openGraveyard: CheckGraveyard,
  openPointsCounter: ChangePoints,
  openHotSeatMenu: HotSeatMenu,
};

export default (modalName) => modals[modalName];
