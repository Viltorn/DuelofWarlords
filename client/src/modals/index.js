import CheckGraveyard from './CheckGraveyard/CheckGraveyard.jsx';
import ChangePoints from './ChangePlayerPoints/ChangePoints.jsx';
import HotSeatMenu from './HotSeatStartMenu/HotSeatStartMenu.jsx';
import ChangeStartCards from './ChangeStartCards/ChangeStartCards.jsx';
import GreetingWindow from './TutorialModals/GreetingWindow.jsx';
import TutorialStepsWindow from './TutorialModals/TutorialStepsWindow.jsx';
import TutorialFinish from './TutorialModals/LastStepWindow.jsx';
import EnterUsername from './EnterUsername/EnterUsername.jsx';
import OnlineGameStart from './OnlineGameStart/OnlineGameStart.jsx';
import WaitForPlayer from './WaitForPlayer/WaitForPLayer.jsx';
import PlayerDisconnected from './PlayerDisconnected/PlayerDisconnected.jsx';
import PlayerVictory from './PlayerVictory/PlayerVictory.jsx';
import WarningResetWindow from './WarningResetWindow/WarningResetWindow.jsx';
import ConnectProblem from './ConnectProblem/ConnectProblem.jsx';
import EndTurnWarning from './EndTurnWarning/EndTurnWarning.jsx';
import LoginSignUp from './Login/LoginSignUp.jsx';
import PlayerTurn from './PlayerTurn/PlayerTurn.jsx';

const modals = {
  loginWindow: LoginSignUp,
  endTurnWarning: EndTurnWarning,
  connectProblem: ConnectProblem,
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
  openGraveyard: CheckGraveyard,
  openPointsCounter: ChangePoints,
  openHotSeatMenu: HotSeatMenu,
  playerTurn: PlayerTurn,
};

export default (modalName) => modals[modalName];
