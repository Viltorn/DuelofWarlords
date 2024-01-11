import _ from 'lodash';
import ArcaneArmor from '../assets/AcademiaDeck/ArcaneArmor.png';
import CursedShackle from '../assets/AcademiaDeck/CursedShackle.png';
import InvisibilityCloak from '../assets/AcademiaDeck/InvisibilityCloak.png';
import SoulDrain from '../assets/AcademiaDeck/SoulDrain.png';
import Teleport from '../assets/AcademiaDeck/Teleport.png';
import TownPortal from '../assets/AcademiaDeck/TownPortal.png';
import Transformation from '../assets/AcademiaDeck/Transformation.png';

export default {
  ArcaneArmor: {
    name: 'Arcane armor',
    id: _.uniqueId(),
    type: 'spell',
    subtype: 'instant',
    cost: 1,
    currentC: 1,
    featInfo: ['REACTION'],
    description: 'ArcaneArmor',
    school: 'Shadow',
    place: 'postponed',
    features: [{
      attach: ['field', 'warrior', 'hero'], aim: ['warrior', 'fighter', 'shooter', 'flyer'], type: 'good', name: 'protection', value: { type: 'number', val: 100 }, charges: 1, condition: 'minPower', conditionValue: 3,
    }],
    img: ArcaneArmor,
    status: 'hand',
  },
  CursedChackle: {
    name: 'Cursed chackle',
    id: _.uniqueId(),
    type: 'spell',
    subtype: 'permanent',
    cost: 3,
    currentC: 3,
    featInfo: [],
    description: 'CursedChackle',
    school: 'Shadow',
    place: 'warrior',
    features: [
      {
        attach: ['warrior'],
        aim: ['warrior'],
        type: 'bad',
        condition: 'onattack',
        name: 'selfheroattack',
        value: 'power',
        apply: 'attacker',
      },
    ],
    img: CursedShackle,
    status: 'hand',
  },
  InvisibilityCloak: {
    name: 'Invisibility cloak',
    id: _.uniqueId(),
    type: 'spell',
    subtype: 'temporary',
    cost: 1,
    currentC: 1,
    featInfo: ['INVISIBILITY', 'MAGICSHIELD'],
    description: 'InvisibilityCloak',
    school: 'Shadow',
    place: 'warrior',
    features: [
      {
        attach: ['warrior'],
        aim: ['warrior'],
        type: 'good',
        name: 'invisible',
      },
      {
        attach: ['warrior'], type: 'good', name: 'protection', value: { type: 'percent', val: 0.5 }, aim: ['spell'],
      },
    ],
    img: InvisibilityCloak,
    status: 'hand',
  },
  SoulDrain: {
    name: 'Soul drain',
    id: _.uniqueId(),
    type: 'spell',
    subtype: 'instant',
    cost: 5,
    currentC: 5,
    featInfo: [],
    description: 'SoulDrain',
    school: 'Shadow',
    place: '',
    features: [{
      attach: false, type: 'bad', name: 'attack', value: 200, aim: ['warrior'],
    }],
    img: SoulDrain,
    status: 'hand',
  },
  Teleport: {
    name: 'Teleport',
    id: _.uniqueId(),
    type: 'spell',
    subtype: 'instant',
    cost: 1,
    currentC: 1,
    featInfo: [],
    description: 'Teleport',
    school: 'Shadow',
    place: '',
    features: [{
      attach: ['warrior'], type: 'good', aim: ['warrior'], charges: 1, name: 'moving',
    }],
    img: Teleport,
    status: 'hand',
  },
  TownPortal: {
    name: 'Town portal',
    id: _.uniqueId(),
    type: 'spell',
    subtype: 'instant',
    cost: 3,
    currentC: 3,
    featInfo: [],
    description: 'TownPortal',
    school: 'Shadow',
    place: '',
    features: [{
      attach: false, type: 'bad', name: 'return', aim: ['warrior'],
    }],
    img: TownPortal,
    status: 'hand',
  },
  Transformation: {
    name: 'Transformation',
    id: _.uniqueId(),
    type: 'spell',
    subtype: 'instant',
    cost: 1,
    currentC: 1,
    featInfo: [],
    description: 'Transformation',
    school: 'Shadow',
    place: '',
    features: [{
      attach: false, type: 'bad', name: 'stun', aim: 'warrior',
    }, {
      attach: false, type: 'bad', name: 'moverow', aim: 'warrior',
    }],
    img: Transformation,
    status: 'hand',
  },
};
