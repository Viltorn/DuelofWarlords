import _ from 'lodash';
import BannerMan from '../../assets/CastleDeck/Bannerman.png';
import Defender from '../../assets/CastleDeck/Defender.png';
import ImperialGriffon from '../../assets/CastleDeck/ImperialGriffon.png';
import ImperialShooter from '../../assets/CastleDeck/ImperialShooter.png';
import KnightGuardian from '../../assets/CastleDeck/KnightGuardian.png';
import MasterOfLight from '../../assets/CastleDeck/MasterOfLight.png';
import MasterShooter from '../../assets/CastleDeck/MasterShooter.png';
import TemplarChampion from '../../assets/CastleDeck/TemplarChampion.png';
import ValorKnight from '../../assets/CastleDeck/ValorKnight.png';
import WarriorOfLight from '../../assets/CastleDeck/WarriorOfLight.png';
import YoungPriestess from '../../assets/CastleDeck/YoungPriestess.png';
import RighteousFighter from '../../assets/CastleDeck/RighteousFighter.png';
import ZigfridHero from '../../assets/CastleDeck/ZigfridHero.png';

// SPELLS
import RetaliationHammer from '../../assets/CastleDeck/RetaliationHammer.png';
import RighteousHammer from '../../assets/CastleDeck/RighteousHammer.png';
import YouthFountain from '../../assets/CastleDeck/YouthFountain.png';

const castleDeck = {
  ZigfridHero: {
    name: 'Zigfrid-Hero',
    type: 'hero',
    subtype: 'hero',
    faction: 'Castle',
    health: 18,
    currentHP: 18,
    featInfo: [],
    description: 'ZigfridHero',
    id: _.uniqueId(),
    cellId: '',
    cost: 4,
    currentC: 4,
    place: '',
    spellSchools: ['Air', 'Light'],
    attachments: [],
    features: [{
      attach: false, type: 'bad', aim: ['warrior', 'flyer', 'shooter', 'fighter'], name: 'attack', value: 1, aimStatus: 'field',
    }, {
      attach: ['warrior'], type: 'bad', aim: ['warrior', 'flyer', 'shooter', 'fighter'], name: 'moveNextRow', charges: 1, immediate: true, aimStatus: 'field',
    },
    {
      attach: false, type: 'all', aim: ['warrior'], name: 'drawCard', condition: 'insteadatk', cost: 1,
    },
    ],
    img: ZigfridHero,
    status: 'field',
    turn: 0,
  },
  ImperialShooter: {
    name: 'Imperial Shooter', type: 'warrior', subtype: 'shooter', power: 1, currentP: 1, health: 2, currentHP: 2, cost: 1, currentC: 1, featInfo: ['SHOOTER'], description: 'ImperialShooter', faction: 'Castle', id: _.uniqueId(), features: [{}], attachments: [], img: ImperialShooter, status: 'hand', turn: 1, disabled: false,
  },
  MasterShooter: {
    name: 'Master Shooter', type: 'warrior', subtype: 'shooter', power: 2, currentP: 2, health: 4, currentHP: 4, cost: 3, currentC: 3, featInfo: ['SHOOTER'], description: 'MasterShooter', faction: 'Castle', id: _.uniqueId(), features: [{ name: 'retaliation', value: 1, aim: ['warrior', 'fighter', 'shooter', 'flyer'] }], attachments: [], img: MasterShooter, status: 'hand', turn: 1, disabled: false,
  },
  YoungPriestess: {
    name: 'Young Priestess',
    type: 'warrior',
    subtype: 'shooter',
    power: 1,
    currentP: 1,
    health: 4,
    currentHP: 4,
    cost: 2,
    currentC: 2,
    featInfo: ['SHOOTER', 'STARTTURN'],
    description: 'YoungPriestess',
    faction: 'Castle',
    id: _.uniqueId(),
    features: [{
      name: 'heal', condition: 'onturnstart', aim: ['oneAdjacent', 'warrior'], value: 1, aimStatus: 'field', type: 'good',
    }],
    attachments: [],
    img: YoungPriestess,
    status: 'hand',
    turn: 1,
    disabled: false,
  },
  WarriorOfLight: {
    name: 'Warrior Of Light', type: 'warrior', subtype: 'fighter', power: 2, currentP: 2, health: 4, currentHP: 4, cost: 2, currentC: 2, featInfo: ['FIGHTER', 'SWIFT'], description: 'WarriorOfLight', faction: 'Castle', id: _.uniqueId(), features: [{ name: 'swift' }], attachments: [], img: WarriorOfLight, status: 'hand', turn: 1, disabled: false,
  },
  ValorKnight: {
    name: 'Valor Knight',
    type: 'warrior',
    subtype: 'fighter',
    power: 2,
    currentP: 2,
    health: 6,
    currentHP: 6,
    cost: 3,
    currentC: 3,
    featInfo: ['FIGHTER'],
    description: 'ValorKnight',
    faction: 'Castle',
    id: _.uniqueId(),
    features: [{
      name: 'heal', condition: 'onattack', type: 'good', aim: ['nextWarsInLine', 'warrior', 'fighter', 'shooter', 'flyer'], value: 1, aimStatus: 'field',
    }],
    attachments: [],
    img: ValorKnight,
    status: 'hand',
    turn: 1,
    disabled: false,
  },
  Bannerman: {
    name: 'Bannerman',
    type: 'warrior',
    subtype: 'fighter',
    power: 2,
    currentP: 2,
    health: 5,
    currentHP: 5,
    cost: 3,
    currentC: 3,
    featInfo: ['FIGHTER'],
    description: 'Bannerman',
    faction: 'Castle',
    id: _.uniqueId(),
    attachments: [],
    features: [{
      name: 'invoke',
      aim: ['warrior'],
      type: 'good',
      value: {
        img: BannerMan,
        name: 'fake',
        type: 'spell',
        subtype: 'instant',
        currentC: 0,
        description: 'BannermanCast',
        faction: 'Castle',
        place: '',
        features: [{
          attach: ['warrior'], aim: ['warrior', 'fighter', 'shooter', 'flyer', 'hero'], type: 'good', name: 'power', value: 2, charges: 1, id: _.uniqueId(), aimStatus: 'field',
        }],
        status: 'hand',
      },
      condition: 'onplay',
      aimStatus: 'field',
    }],
    img: BannerMan,
    status: 'hand',
    turn: 1,
    disabled: false,
  },
  Defender: {
    name: 'Defender',
    type: 'warrior',
    subtype: 'fighter',
    power: 2,
    currentP: 2,
    health: 5,
    currentHP: 5,
    cost: 3,
    currentC: 3,
    featInfo: ['FIGHTER', 'PROTECTOR'],
    description: 'Defender',
    faction: 'Castle',
    id: _.uniqueId(),
    features: [{ name: 'protection', value: { type: 'percent', val: 0.5 }, aim: ['spell'] },
      {
        attach: ['row'], type: 'good', name: 'redirectWarAttack', aim: ['warrior', 'fighter', 'shooter', 'flyer'], aimStatus: 'field',
      }],
    attachments: [],
    img: Defender,
    status: 'hand',
    turn: 1,
    disabled: false,
  },
  RighteousFighter: {
    name: 'Righteous Fighter', type: 'warrior', subtype: 'fighter', power: 3, currentP: 3, health: 4, currentHP: 4, cost: 3, currentC: 3, featInfo: ['FIGHTER'], description: 'RighteousFighter', faction: 'Castle', id: _.uniqueId(), features: [{ name: 'power', value: 1, aim: ['hero'] }], attachments: [], img: RighteousFighter, status: 'hand', turn: 1, disabled: false,
  },
  KnightGuardian: {
    name: 'Knight Guardian',
    type: 'warrior',
    subtype: 'fighter',
    power: 2,
    currentP: 2,
    health: 8,
    currentHP: 8,
    cost: 4,
    currentC: 4,
    featInfo: ['FIGHTER'],
    description: 'KnightGuardian',
    faction: 'Castle',
    id: _.uniqueId(),
    features: [{
      attach: ['nextcells'], type: 'good', name: 'redirectWarAttack', aim: ['warrior', 'fighter', 'shooter', 'flyer'], status: 'field',
    }],
    attachments: [],
    img: KnightGuardian,
    status: 'hand',
    turn: 1,
    disabled: false,
  },
  ImperialGriffon: {
    name: 'Imperial Griffon',
    type: 'warrior',
    subtype: 'flyer',
    power: 2,
    currentP: 2,
    health: 6,
    currentHP: 6,
    cost: 4,
    currentC: 4,
    featInfo: ['FLYER'],
    description: 'ImperialGriffon',
    faction: 'Castle',
    id: _.uniqueId(),
    features: [{
      name: 'retaliation', value: 1, aim: ['warrior', 'fighter'],
    }],
    attachments: [],
    img: ImperialGriffon,
    status: 'hand',
    turn: 1,
    disabled: false,
  },
  TemplarChampion: {
    name: 'Templar Champion',
    type: 'warrior',
    subtype: 'fighter',
    power: 3,
    currentP: 3,
    health: 7,
    currentHP: 7,
    cost: 5,
    currentC: 5,
    featInfo: ['FIGHTER', 'PIERCING'],
    description: 'TemplarChampion',
    faction: 'Castle',
    id: _.uniqueId(),
    features: [{
      name: 'invoke',
      aim: ['warrior'],
      type: 'good',
      value: {
        img: TemplarChampion,
        name: 'fake',
        type: 'spell',
        subtype: 'instant',
        currentC: 0,
        description: 'TemplarChampCast',
        faction: 'Castle',
        place: '',
        features: [{
          attach: false, aim: ['warrior', 'flyer', 'shooter', 'fighter'], type: 'good', name: 'heal', value: 3, aimStatus: 'field',
        },
        { name: 'cantPostpone' }],
        status: 'hand',
      },
      condition: 'onplay',
    },
    {
      name: 'attack', condition: 'onattack', type: 'bad', aim: ['otherWarInRow', 'warrior', 'flyer', 'shooter', 'fighter'], value: 2, apply: 'attacked', status: 'field',
    }],
    attachments: [],
    img: TemplarChampion,
    status: 'hand',
    turn: 1,
    disabled: false,
  },
  MasterOfLight: {
    name: 'Master Of Light',
    type: 'warrior',
    subtype: 'fighter',
    power: 4,
    currentP: 4,
    health: 9,
    currentHP: 9,
    cost: 7,
    currentC: 7,
    featInfo: ['FIGHTER'],
    description: 'MasterOfLight',
    faction: 'Castle',
    id: _.uniqueId(),
    features: [{
      attach: false, type: 'bad', aim: ['row', 'warrior', 'flyer', 'shooter', 'fighter'], value: 2, name: 'attack', condition: 'insteadatk', cost: 0, aimStatus: 'field',
    }],
    attachments: [],
    img: MasterOfLight,
    status: 'hand',
    turn: 1,
    disabled: false,
  },
  YouthFountain: {
    name: 'Youth Fountain',
    type: 'spell',
    subtype: 'temporary',
    cost: 2,
    currentC: 2,
    featInfo: [],
    description: 'YouthFountain',
    faction: 'Castle',
    id: _.uniqueId(),
    place: 'bigSpell',
    features: [{
      attach: ['field', 'warrior'], type: 'bad', name: 'enemyHeroHeal', aim: ['warrior', 'flyer', 'shooter', 'fighter'], condition: 'onplay', value: 2, aimStatus: 'field',
    },
    {
      attach: ['field', 'warrior'], type: 'bad', name: 'enemyHeroHeal', aim: ['warrior', 'flyer', 'shooter', 'fighter'], condition: 'onmove', value: 2, aimStatus: 'field',
    }],
    img: YouthFountain,
    status: 'hand',
    disabled: false,
  },
  RighteousHammer: {
    name: 'Righteous Hammer',
    type: 'spell',
    subtype: 'instant',
    cost: 2,
    currentC: 2,
    featInfo: [],
    description: 'RighteousHammer',
    faction: 'Castle',
    id: _.uniqueId(),
    place: '',
    features: [{
      attach: false, aim: ['warrior', 'flyer', 'shooter', 'fighter'], type: 'bad', name: 'attack', value: 3, depend: 'warriorsdiff', dependValue: 1, aimStatus: 'field',
    }],
    img: RighteousHammer,
    status: 'hand',
    disabled: false,
  },
  RetaliationHammer: {
    name: 'Retaliation Hammer',
    type: 'spell',
    subtype: 'instant',
    cost: 2,
    currentC: 2,
    featInfo: [],
    description: 'RetaliationHammer',
    faction: 'Castle',
    id: _.uniqueId(),
    place: '',
    features: [
      {
        attach: false, type: 'bad', aim: ['warrior', 'flyer', 'shooter', 'fighter'], name: 'attack', value: 2, aimStatus: 'field',
      },
      {
        attach: ['warrior'], type: 'bad', aim: ['warrior', 'flyer', 'shooter', 'fighter'], name: 'moveNextRow', charges: 1, immediate: true, aimStatus: 'field',
      },
    ],
    img: RetaliationHammer,
    status: 'hand',
    disabled: false,
  },
};

export default castleDeck;