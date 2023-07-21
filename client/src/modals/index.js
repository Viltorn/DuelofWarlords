import ChangeCardStats from './changeCardStats.jsx';

const modals = {
  changeStats: ChangeCardStats,
};

export default (modalName) => modals[modalName];
