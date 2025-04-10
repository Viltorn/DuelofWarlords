import _ from 'lodash';
import GoodMorale from '../assets/GoodMorale.png';

const goodMorale = {
  name: 'Dummy',
  type: 'spell',
  subtype: 'instant',
  featInfo: ['INSTANT'],
  description: 'Morale',
  cost: 0,
  currentC: 0,
  faction: 'Castle',
  id: _.uniqueId('spell_'),
  attachments: [],
  features: [{
    attach: false, type: 'good', aim: ['warrior'], name: 'increasePoints', value: 1, condition: 'insteadatk', cost: 0, description: 'increasePoints',
  },
  {
    attach: false, type: 'all', aim: ['warrior'], name: 'drawCard', condition: 'insteadatk', cost: 0, description: 'drawCard',
  }],
  img: GoodMorale,
  status: 'hand',
  player: 'player2',
  turn: 0,
};

export default goodMorale;
