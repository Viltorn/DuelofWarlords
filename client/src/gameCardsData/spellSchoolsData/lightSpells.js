import _ from 'lodash';
import Сonciliation from '../../assets/CastleDeck/Сonciliation.png';
import Bless from '../../assets/CastleDeck/Bless.png';
import Enlightenment from '../../assets/CastleDeck/Enlightenment.png';
import HealingLight from '../../assets/CastleDeck/HealingLight.png';
import HeavenProtection from '../../assets/CastleDeck/HeavenProtection.png';
import HeavenShock from '../../assets/CastleDeck/HeavenShock.png';
import HolyLand from '../../assets/CastleDeck/HolyLand.png';
import AttackAura from '../../assets/CastleDeck/AttackAura.png';
import LastChance from '../../assets/CastleDeck/LastChance.png';
import LightShield from '../../assets/CastleDeck/LightShield.png';
import Resurrection from '../../assets/CastleDeck/Resurrection.png';
import Retribution from '../../assets/CastleDeck/Retribution.png';
import SaintWord from '../../assets/CastleDeck/SaintWord.png';

export default {
  Resurrection: {
    name: 'Resurrection',
    type: 'spell',
    subtype: 'instant',
    cost: 4,
    currentC: 4,
    featInfo: [],
    description: 'Resurrection',
    school: 'Light',
    id: _.uniqueId(),
    place: 'grave',
    turn: 0,
    features: [{
      attach: ['grave'], type: 'good', aim: ['warrior', 'flyer', 'shooter', 'fighter'], name: 'ressurect', condition: 'insteadatk', cost: 4, resCost: 0, aimStatus: 'graveyard',
    },
    { name: 'cantPostpone' }],
    img: Resurrection,
    status: 'hand',
    disabled: false,
  },
  AttackAura: {
    name: 'Attack Aura',
    type: 'spell',
    subtype: 'temporary',
    cost: 2,
    currentC: 2,
    featInfo: ['LASTCAST'],
    description: 'AttackAura',
    school: 'Light',
    id: _.uniqueId(),
    place: 'warrior',
    features: [
      {
        attach: ['warrior'], type: 'good', aim: ['closestEnemyInRow', 'warrior', 'spell', 'flyer', 'shooter', 'fighter'], name: 'attack', condition: 'lastcall', value: 2, aimStatus: 'field',
      },
      {
        attach: false, type: 'good', aim: ['closestEnemyInRow', 'warrior', 'flyer', 'shooter', 'fighter'], name: 'attack', value: 2, aimStatus: 'field',
      },
    ],
    img: AttackAura,
    status: 'hand',
    disabled: false,
  },
  Retribution: {
    name: 'Retribution',
    type: 'spell',
    subtype: 'temporary',
    cost: 1,
    currentC: 1,
    featInfo: [],
    description: 'Retribution',
    school: 'Light',
    id: _.uniqueId(),
    place: 'warrior',
    features: [{
      attach: ['warrior'],
      aim: ['warrior', 'fighter', 'shooter', 'flyer'],
      type: 'good',
      name: 'power',
      value: 1,
      depend: 'goodattachments',
      dependValue: 1,
      charges: 1,
      aimStatus: 'field',
    }],
    img: Retribution,
    status: 'hand',
    disabled: false,
  },
  HealingLight: {
    name: 'Healing Light',
    type: 'spell',
    subtype: 'instant',
    cost: 1,
    currentC: 1,
    featInfo: [],
    description: 'HealingLight',
    school: 'Light',
    id: _.uniqueId(),
    place: '',
    features: [{
      attach: false, aim: ['warrior', 'flyer', 'shooter', 'fighter'], type: 'good', name: 'heal', depend: 'postponed', value: 3, dependValue: 4, aimStatus: 'field',
    }],
    img: HealingLight,
    status: 'hand',
    disabled: false,
  },
  Enlightenment: {
    name: 'Enlightenment',
    type: 'spell',
    subtype: 'turn',
    cost: 3,
    currentC: 3,
    featInfo: [],
    description: 'Enlightenment',
    school: 'Light',
    id: _.uniqueId(),
    place: 'bigSpell',
    features: [{
      attach: ['field', 'warrior'], type: 'good', aim: ['warrior', 'fighter', 'shooter', 'flyer', 'hero'], name: 'power', value: 1, aimStatus: 'field',
    }],
    img: Enlightenment,
    status: 'hand',
    disabled: false,
  },
  HeavenProtection: {
    name: 'Heaven Protection',
    type: 'spell',
    subtype: 'temporary',
    cost: 1,
    currentC: 1,
    featInfo: [],
    description: 'HeavenProtection',
    school: 'Light',
    id: _.uniqueId(),
    place: 'warrior',
    features: [{
      attach: ['warrior'],
      aim: ['warrior', 'fighter', 'shooter', 'flyer'],
      type: 'good',
      name: 'protection',
      value: { type: 'number', val: 100 },
      charges: 1,
      aimStatus: 'field',
    }],
    img: HeavenProtection,
    status: 'hand',
    disabled: false,
  },
  Bless: {
    name: 'Bless',
    type: 'spell',
    subtype: 'permanent',
    cost: 2,
    currentC: 2,
    featInfo: [],
    description: 'Bless',
    school: 'Light',
    id: _.uniqueId(),
    place: 'warrior',
    features: [{
      attach: ['warrior'],
      aim: ['warrior', 'fighter', 'shooter', 'flyer', 'hero'],
      type: 'good',
      name: 'power',
      value: 1,
      aimStatus: 'field',
    }],
    img: Bless,
    status: 'hand',
    disabled: false,
  },
  HolyLand: {
    name: 'Holy Land',
    type: 'spell',
    subtype: 'temporary',
    cost: 1,
    currentC: 1,
    featInfo: [],
    description: 'HolyLand',
    school: 'Light',
    id: _.uniqueId(),
    place: 'midSpell',
    features: [{
      attach: ['row', 'warrior'], type: 'bad', aim: ['warrior', 'fighter', 'shooter', 'flyer'], name: 'attack', condition: 'onmove', value: 2, aimStatus: 'field',
    },
    {
      attach: ['row', 'warrior'], type: 'bad', aim: ['warrior', 'fighter', 'shooter', 'flyer'], name: 'attack', condition: 'onplay', value: 2, aimStatus: 'field',
    }],
    img: HolyLand,
    status: 'hand',
    disabled: false,
  },
  HeavenShock: {
    name: 'Heaven Shock',
    type: 'spell',
    subtype: 'instant',
    cost: 2,
    currentC: 2,
    featInfo: [],
    description: 'HeavenShock',
    school: 'Light',
    id: _.uniqueId(),
    place: '',
    features: [{
      attach: false, aim: ['warrior', 'flyer', 'shooter', 'fighter'], type: 'bad', name: 'attack', value: 2, aimStatus: 'field',
    },
    {
      attach: false, aim: ['hero'], type: 'good', name: 'heroheal', value: 2, aimStatus: 'field',
    },
    ],
    img: HeavenShock,
    status: 'hand',
    disabled: false,
  },
  SaintWord: {
    name: 'Saint Word',
    type: 'spell',
    subtype: 'instant',
    cost: 4,
    currentC: 4,
    featInfo: [],
    description: 'SaintWord',
    school: 'Light',
    id: _.uniqueId(),
    place: '',
    features: [{
      attach: false, type: 'bad', aim: ['row', 'warrior', 'fighter', 'shooter', 'flyer'], name: 'attack', value: 2, depend: 'postponed', dependValue: 3, aimStatus: 'field',
    },
    {
      attach: false, type: 'bad', aim: ['randomNextRow', 'warrior', 'fighter', 'shooter', 'flyer'], name: 'attack', value: 2, aimStatus: 'field',
    },
    ],
    img: SaintWord,
    status: 'hand',
    disabled: false,
  },
  LightShield: {
    name: 'LightShield',
    type: 'spell',
    subtype: 'permanent',
    cost: 1,
    currentC: 1,
    featInfo: [],
    description: 'LightShield',
    school: 'Light',
    id: _.uniqueId(),
    place: 'warrior',
    features: [{
      attach: ['warrior'],
      aim: ['warrior', 'flyer', 'shooter', 'fighter'],
      type: 'good',
      name: 'health',
      value: 2,
      aimStatus: 'field',
    },
    {
      attach: false,
      aim: ['warrior'],
      type: 'good',
      name: 'health',
      value: 2,
      aimStatus: 'field',
    }],
    img: LightShield,
    status: 'hand',
    disabled: false,
  },
  LastChance: {
    name: 'Last Chance',
    type: 'spell',
    subtype: 'instant',
    cost: 2,
    currentC: 2,
    featInfo: ['REACTION'],
    description: 'LastChance',
    school: 'Light',
    id: _.uniqueId(),
    place: 'postponed',
    features: [{
      attach: ['field', 'warrior'], type: 'good', aim: ['warrior', 'fighter', 'shooter', 'flyer'], name: 'protection', condition: 'canDie', value: { type: 'immortal', val: 0 }, charges: 1, aimStatus: 'field',
    }],
    img: LastChance,
    status: 'hand',
    disabled: false,
  },
  Conciliation: {
    name: 'Conciliation',
    type: 'spell',
    subtype: 'temporary',
    cost: 5,
    currentC: 5,
    featInfo: [],
    description: 'Conciliation',
    school: 'Light',
    id: _.uniqueId(),
    place: 'bigSpell',
    features: [{
      attach: ['field', 'warrior', 'hero'], type: 'good', name: 'protection', aim: ['warrior', 'spell', 'fighter', 'shooter', 'flyer'], value: { type: 'number', val: 100 }, aimStatus: 'field',
    }],
    img: Сonciliation,
    status: 'hand',
    disabled: false,
  },
};