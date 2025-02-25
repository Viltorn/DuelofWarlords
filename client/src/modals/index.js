import CheckCardsWindow from './CheckCardsWindow/CheckCardsWindow.jsx';
import ChangePoints from './ChangePlayerPoints/ChangePoints.jsx';
import HotSeatMenu from './HotSeatStartMenu/HotSeatStartMenu.jsx';
import GreetingWindow from './TutorialModals/GreetingWindow.jsx';
import TutorialStepsWindow from './TutorialModals/TutorialStepsWindow.jsx';
import TutorialFinish from './TutorialModals/LastStepWindow.jsx';
import OnlineGameStart from './OnlineGameStart/OnlineGameStart.jsx';
import WaitForPlayer from './WaitForPlayer/WaitForPLayer.jsx';
import PlayerDisconnected from './PlayerDisconnected/PlayerDisconnected.jsx';
import PlayerVictory from './PlayerVictory/PlayerVictory.jsx';
import WarningResetWindow from './WarningResetWindow/WarningResetWindow.jsx';
import ConnectProblem from './ConnectProblem/ConnectProblem.jsx';
import StartFirstRound from './StartFirstRound/StartFirstRound.jsx';
import LoginSignUp from './Login/LoginSignUp.jsx';
import PlayerTurn from './PlayerTurn/PlayerTurn.jsx';
import ActiveCardWindow from './ActiveCardWindow/ActiveCardWindow.jsx';
import CombatLog from './CombatLog/CombatLog.jsx';

const modals = {
  loginWindow: LoginSignUp,
  connectProblem: ConnectProblem,
  warningWindow: WarningResetWindow,
  victory: PlayerVictory,
  playerDisconnected: PlayerDisconnected,
  waitForPlayer: WaitForPlayer,
  onlineGameStart: OnlineGameStart,
  tutorialSteps: TutorialStepsWindow,
  tutorial: GreetingWindow,
  tutorialFinish: TutorialFinish,
  openCheckCard: CheckCardsWindow,
  openPointsCounter: ChangePoints,
  openHotSeatMenu: HotSeatMenu,
  startFirstRound: StartFirstRound,
  playerTurn: PlayerTurn,
  activeCardWindow: ActiveCardWindow,
  combatLog: CombatLog,
};

export default (modalName) => modals[modalName];
