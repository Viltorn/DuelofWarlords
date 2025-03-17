import ZigfridHero from '@assets/castleCards/ZigfridHero.png';
import _ from 'lodash';

const ZigfridTutorial = {
  name: 'Zigfrid-Hero',
  type: 'hero',
  subtype: 'hero',
  faction: 'Castle',
  health: 20,
  currentHP: 20,
  featInfo: [],
  description: 'ZigfridHero',
  id: _.uniqueId(),
  cellId: '',
  cost: 4,
  currentC: 4,
  place: '',
  spellSchools: ['Air', 'Light', 'Skills'],
  attachments: [],
  features: [{
    attach: false, type: 'bad', aim: ['warrior', 'flyer', 'shooter', 'fighter'], name: 'attack', value: 1, aimStatus: 'field', school: 'light',
  }, {
    attach: ['warrior'], type: 'bad', aim: ['warrior', 'flyer', 'shooter', 'fighter'], name: 'moveNextRow', charges: 1, immediate: true, aimStatus: 'field',
  },
  ],
  img: ZigfridHero,
  status: 'field',
  turn: 0,
};

export default ZigfridTutorial;
