/* eslint-disable max-len */
import _ from 'lodash';
// Warriors
import EarthGolem from '../../assets/AcademiaDeck/EarthGolem.png';
import LivingWall from '../../assets/AcademiaDeck/LivingWall.png';
import Gargoyle from '../../assets/AcademiaDeck/Gargoyle.png';
import MageApprentice from '../../assets/AcademiaDeck/MageApprentice.png';
import Rakshasa from '../../assets/AcademiaDeck/Rakshasa.png';
import EnergyElemental from '../../assets/AcademiaDeck/EnergyElemental.png';
import FireGolem from '../../assets/AcademiaDeck/FireGolem.png';
import GremlinShooter from '../../assets/AcademiaDeck/GremlinShooter.png';
import IceElemental from '../../assets/AcademiaDeck/IceElemental.png';
import IceGiant from '../../assets/AcademiaDeck/IceGiant.png';
import YoungGenie from '../../assets/AcademiaDeck/YoungGenie.png';
import NalaHero from '../../assets/AcademiaDeck/NalaHero.png';
// Spells

export const types = ['beforeturn', 'afterplay', 'protection', 'afterdeath'];

const academiaDeck = {
  NalaHero: {
    name: 'Nala-Hero',
    type: 'hero',
    subtype: 'hero',
    faction: 'Academia',
    health: 18,
    currentHP: 18,
    featInfo: [],
    description: 'NalaHero',
    id: _.uniqueId(),
    cellId: '',
    cost: 2,
    currentC: 2,
    place: '',
    spellSchools: ['Water', 'Shadow'],
    attachments: [],
    features: [{
      attach: false, type: 'bad', aim: ['warrior', 'flyer', 'shooter', 'fighter'], name: 'attack', value: 1, aimStatus: 'field',
    },
    {
      attach: false, type: 'all', aim: ['warrior'], name: 'drawCard', condition: 'insteadatk', cost: 1,
    }],
    img: NalaHero,
    status: 'field',
    turn: 0,
  },
  LivingWall: {
    name: 'Living wall', id: _.uniqueId(), type: 'warrior', subtype: 'fighter', power: 2, currentP: 2, health: 5, currentHP: 5, cost: 2, currentC: 2, featInfo: ['FIGHTER', 'IMMOBILIZED'], description: 'LivingWall', faction: 'Academia', features: [{ name: 'immobile' }, { name: 'unarmed' }], attachments: [], img: LivingWall, status: 'hand', turn: 1,
  },
  MageApprentice: {
    name: 'Mage apprentice', id: _.uniqueId(), type: 'warrior', subtype: 'shooter', power: 2, currentP: 2, health: 4, currentHP: 4, cost: 3, currentC: 3, featInfo: ['SHOOTER'], description: 'MageApprentice', faction: 'Academia', features: [{ name: 'massAttack' }], attachments: [], img: MageApprentice, status: 'hand', turn: 1,
  },
  GremlinShooter: {
    name: 'Gremlin shooter', id: _.uniqueId(), type: 'warrior', subtype: 'shooter', power: 2, currentP: 2, health: 3, currentHP: 3, cost: 2, currentC: 2, featInfo: ['SHOOTER'], description: 'GremlinShooter', faction: 'Academia', features: [{ name: 'retaliation', value: 1, aim: ['shooter'] }], attachments: [], img: GremlinShooter, status: 'hand', turn: 1,
  },
  IceElement: {
    name: 'Ice element',
    id: _.uniqueId(),
    type: 'warrior',
    subtype: 'shooter',
    power: 2,
    currentP: 2,
    health: 4,
    currentHP: 4,
    cost: 3,
    currentC: 3,
    featInfo: ['SHOOTER'],
    description: 'IceElement',
    faction: 'Academia',
    features: [{
      attach: false, type: 'bad', aim: ['closestEnemyInRow', 'warrior', 'flyer', 'shooter', 'fighter'], name: 'stun', condition: 'lastcall', aimStatus: 'field',
    }],
    attachments: [],
    img: IceElemental,
    status: 'hand',
    turn: 1,
  },
  EarthGolem: {
    name: 'Earth golem',
    id: _.uniqueId(),
    type: 'warrior',
    subtype: 'fighter',
    power: 2,
    currentP: 2,
    health: 4,
    currentHP: 4,
    cost: 2,
    currentC: 2,
    featInfo: ['FIGHTER'],
    description: 'EarthGolem',
    faction: 'Academia',
    features: [{
      attach: false, type: 'good', aim: ['adjacent', 'warrior', 'flyer', 'shooter', 'fighter'], name: 'heal', value: 1, condition: 'insteadatk', cost: 0, aimStatus: 'field',
    }],
    attachments: [],
    img: EarthGolem,
    status: 'hand',
    turn: 1,
  },
  Gargoyle: {
    name: 'Gargoyle',
    id: _.uniqueId(),
    type: 'warrior',
    subtype: 'flyer',
    power: 2,
    currentP: 2,
    health: 3,
    currentHP: 3,
    cost: 2,
    currentC: 2,
    featInfo: ['FLYER'],
    description: 'Gargoyle',
    faction: 'Academia',
    features: [{
      attach: false,
      aim: ['shooter', 'warrior'],
      type: 'good',
      name: 'protection',
      value: { type: 'number', val: 1 },
      condition: 'minPower',
      conditionValue: 2,
      aimStatus: 'field',
    }],
    attachments: [],
    img: Gargoyle,
    status: 'hand',
    turn: 1,
  },
  FireGolem: {
    name: 'Fire golem',
    id: _.uniqueId(),
    type: 'warrior',
    subtype: 'fighter',
    power: 3,
    currentP: 3,
    health: 6,
    currentHP: 6,
    cost: 4,
    currentC: 4,
    featInfo: ['FIGHTER', 'LASTCAST'],
    description: 'FireGolem',
    faction: 'Academia',
    features: [{
      attach: false, type: 'all', aim: ['row', 'warrior', 'flyer', 'shooter', 'fighter'], name: 'attack', condition: 'lastcall', value: 1, aimStatus: 'field',
    }],
    attachments: [],
    img: FireGolem,
    status: 'hand',
    turn: 1,
  },
  Rakshasa: {
    name: 'Rakshasa',
    id: _.uniqueId(),
    type: 'warrior',
    subtype: 'fighter',
    power: 2,
    currentP: 2,
    health: 6,
    currentHP: 6,
    cost: 3,
    currentC: 3,
    featInfo: ['FIGHTER', 'EVASION'],
    description: 'Rakshasa',
    faction: 'Academia',
    features: [{
      attach: false, type: 'good', aim: ['warrior'], name: 'evade', condition: 'nextRowCell', aimStatus: 'field',
    }],
    attachments: [],
    img: Rakshasa,
    status: 'hand',
    turn: 1,
  },
  YoungGenie: {
    name: 'Young genie',
    id: _.uniqueId(),
    type: 'warrior',
    subtype: 'flyer',
    power: 3,
    currentP: 3,
    health: 4,
    currentHP: 4,
    cost: 4,
    currentC: 4,
    featInfo: ['FLYER'],
    description: 'YoungGenie',
    faction: 'Academia',
    features: [{
      name: 'invoke',
      aim: ['warrior'],
      type: 'good',
      value: {
        img: YoungGenie,
        name: 'fake',
        type: 'spell',
        subtype: 'instant',
        currentC: 0,
        featInfo: [],
        description: 'YoungGenieCast',
        faction: 'Academia',
        place: '',
        features: [{
          attach: ['warrior'], type: 'all', aim: ['warrior', 'flyer', 'shooter', 'fighter'], name: 'moveNextRow', charges: 1, immediate: true, aimStatus: 'field',
        },
        { name: 'cantPostpone' }],
        status: 'hand',
      },
      condition: 'onplay',
    }],
    attachments: [],
    img: YoungGenie,
    status: 'hand',
    turn: 1,
  },
  EnergyElemental: {
    name: 'Energy elemental',
    id: _.uniqueId(),
    type: 'warrior',
    subtype: 'shooter',
    power: 2,
    currentP: 2,
    health: 5,
    currentHP: 5,
    cost: 4,
    currentC: 4,
    featInfo: ['SHOOTER', 'PIERCING'],
    description: 'EnergyElemental',
    faction: 'Academia',
    features: [{
      name: 'attack', condition: 'onattack', type: 'bad', aim: ['otherWarInRow', 'warrior', 'flyer', 'shooter', 'fighter'], value: 2, apply: 'attacked', aimStatus: 'field',
    }],
    attachments: [],
    img: EnergyElemental,
    status: 'hand',
    turn: 1,
  },
  IceGiant: {
    name: 'Ice giant',
    id: _.uniqueId(),
    type: 'warrior',
    subtype: 'fighter',
    power: 4,
    currentP: 4,
    health: 8,
    currentHP: 8,
    cost: 6,
    currentC: 6,
    featInfo: ['FIGHTER'],
    description: 'IceGiant',
    faction: 'Academia',
    features: [{
      attach: false, type: 'bad', aim: ['row', 'warrior', 'fighter', 'shooter', 'flyer'], name: 'stun', condition: 'onplay', aimStatus: 'field',
    },
    {
      attach: false, type: 'good', aim: ['otherAllyInRow', 'warrior', 'fighter', 'shooter', 'flyer'], name: 'stun', condition: 'onplay', aimStatus: 'field',
    }],
    attachments: [],
    img: IceGiant,
    status: 'hand',
    turn: 1,
  },
};

export default academiaDeck;