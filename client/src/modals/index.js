import ChangeCardStats from './changeCardStats.jsx';
import CheckGraveyard from './checkGraveyard.jsx';
import ChangePoints from './changePoints.jsx';
import HotSeatMenu from './HotSeatStartMenu/HotSeatStartMenu.jsx';

const modals = {
  changeStats: ChangeCardStats,
  openGraveyard: CheckGraveyard,
  openPointsCounter: ChangePoints,
  openHotSeatMenu: HotSeatMenu,
};

export default (modalName) => modals[modalName];
