import ChangeCardStats from './changeCardStats.jsx';
import CheckGraveyard from './checkGraveyard.jsx';
import ChangePoints from './changePoints.jsx';
import HotSeatMenu from './HotSeatStartMenu/HotSeatStartMenu.jsx';
import ChangeStartCards from './changeStartCards.jsx';
import GreetingWindow from './Tutorial/greetingWindow.jsx';
import TutorialStepsWindow from './Tutorial/TutorialStepsWindow.jsx';
import TutorialFinish from './Tutorial/lastStepWindow.jsx';
import EnterUsername from './enterUsername.jsx';
import OnlineGameStart from './onlineGameStart.jsx';
import WaitForPlayer from './waitForPLayer.jsx';
import PlayerDisconnected from './playerDisconnected.jsx';
import PlayerVictory from './playerVictory.jsx';
import WarningResetWindow from './warningResetWindow.jsx';

const modals = {
  warningWindow: WarningResetWindow,
  victory: PlayerVictory,
  playerDisconnected: PlayerDisconnected,
  waitForPlayer: WaitForPlayer,
  onlineGameStart: OnlineGameStart,
  enterUsername: EnterUsername,
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
