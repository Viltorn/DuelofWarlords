import ChangeCardStats from './changeCardStats.jsx';
import CheckGraveyard from './checkGraveyard.jsx';
import ChangePoints from './changePoints.jsx';

const modals = {
  changeStats: ChangeCardStats,
  openGraveyard: CheckGraveyard,
  openPointsCounter: ChangePoints,
};

export default (modalName) => modals[modalName];
