import _ from 'lodash';
import BannerMan from '../assets/CastleDeck/Bannerman.png';
import Defender from '../assets/CastleDeck/Defender.png';
import ImperialGriffon from '../assets/CastleDeck/ImperialGriffon.png';
import ImperialShooter from '../assets/CastleDeck/ImperialShooter.png';
import KnightGuardian from '../assets/CastleDeck/KnightGuardian.png';
import MasterOfLight from '../assets/CastleDeck/MasterOfLight.png';
import MasterShooter from '../assets/CastleDeck/MasterShooter.png';
import TemplarChampion from '../assets/CastleDeck/TemplarChampion.png';
import ValorKnight from '../assets/CastleDeck/ValorKnight.png';
import WarriorOfLight from '../assets/CastleDeck/WarriorOfLight.png';
import YoungPriestess from '../assets/CastleDeck/YoungPriestess.png';
import RighteousFighter from '../assets/CastleDeck/RighteousFighter.png';

// SPELLS

import Сonciliation from '../assets/CastleDeck/Сonciliation.png';
import Bless from '../assets/CastleDeck/Bless.png';
import Enlightenment from '../assets/CastleDeck/Enlightenment.png';
import HealingLight from '../assets/CastleDeck/HealingLight.png';
import HeavenProtection from '../assets/CastleDeck/HeavenProtection.png';
import HeavenShock from '../assets/CastleDeck/HeavenShock.png';
import HolyLand from '../assets/CastleDeck/HolyLand.png';
import HolyShield from '../assets/CastleDeck/HolyShield.png';
import LastChance from '../assets/CastleDeck/LastChance.png';
import LightShield from '../assets/CastleDeck/LightShield.png';
import Resurrection from '../assets/CastleDeck/Resurrection.png';
import RetaliationHammer from '../assets/CastleDeck/RetaliationHammer.png';
import Retribution from '../assets/CastleDeck/Retribution.png';
import RighteousHammer from '../assets/CastleDeck/RighteousHammer.png';
import SaintWord from '../assets/CastleDeck/SaintWord.png';
import Swift from '../assets/CastleDeck/Swift.png';
import ThunderBlast from '../assets/CastleDeck/ThunderBlast.png';
import YouthFountain from '../assets/CastleDeck/YouthFountain.png';

const castleDeck = [
  {
    name: 'Imperial Shooter', type: 'warrior', subtype: 'shooter', power: 1, currentP: 1, health: 2, currentHP: 2, cost: 1, description: 'СТРЕЛОК. Если убивает воина во время своего хода, может атаковать еще раз  силой 1', id: _.uniqueId(), features: [], attachments: [], img: ImperialShooter, status: 'hand', turn: 1,
  },
  {
    name: 'Imperial Shooter', type: 'warrior', subtype: 'shooter', power: 1, currentP: 1, health: 2, currentHP: 2, cost: 1, description: 'СТРЕЛОК. Если убивает воина во время своего хода, может атаковать еще раз  силой 1', id: _.uniqueId(), features: [], attachments: [], img: ImperialShooter, status: 'hand', turn: 1,
  },
  {
    name: 'Master Shooter', type: 'warrior', subtype: 'shooter', power: 2, currentP: 2, health: 4, currentHP: 4, cost: 3, description: 'СТРЕЛОК. Имеет ответный удар силой 1', id: _.uniqueId(), features: [], attachments: [], img: MasterShooter, status: 'hand', turn: 1,
  },
  {
    name: 'Master Shooter', type: 'warrior', subtype: 'shooter', power: 2, currentP: 2, health: 4, currentHP: 4, cost: 3, description: 'СТРЕЛОК. Имеет ответный удар силой 1', id: _.uniqueId(), features: [], attachments: [], img: MasterShooter, status: 'hand', turn: 1,
  },
  {
    name: 'Master Shooter', type: 'warrior', subtype: 'shooter', power: 2, currentP: 2, health: 4, currentHP: 4, cost: 3, description: 'СТРЕЛОК. Имеет ответный удар силой 1', id: _.uniqueId(), features: [], attachments: [], img: MasterShooter, status: 'hand', turn: 1,
  },
  {
    name: 'Young Priestess', type: 'warrior', subtype: 'shooter', power: 1, currentP: 1, health: 4, currentHP: 4, cost: 2, description: 'СТРЕЛОК. Вылечивает 1 здоровье у прилегающего союзного воина в начале своего хода', id: _.uniqueId(), features: [], attachments: [], img: YoungPriestess, status: 'hand', turn: 1,
  },
  {
    name: 'Young Priestess', type: 'warrior', subtype: 'shooter', power: 1, currentP: 1, health: 4, currentHP: 4, cost: 2, description: 'СТРЕЛОК. Вылечивает 1 здоровье у прилегающего союзного воина в начале своего хода', id: _.uniqueId(), features: [], attachments: [], img: YoungPriestess, status: 'hand', turn: 1,
  },
  {
    name: 'Young Priestess', type: 'warrior', subtype: 'shooter', power: 1, currentP: 1, health: 4, currentHP: 4, cost: 2, description: 'СТРЕЛОК. Вылечивает 1 здоровье у прилегающего союзного воина в начале своего хода', id: _.uniqueId(), features: [], attachments: [], img: YoungPriestess, status: 'hand', turn: 1,
  },
  {
    name: 'Warrior Of Light', type: 'warrior', subtype: 'fighter', power: 2, currentP: 2, health: 4, currentHP: 4, cost: 2, description: 'БОЕЦ. Может сходить и атаковать в одном ходу', id: _.uniqueId(), features: [{ name: 'swift' }], attachments: [], img: WarriorOfLight, status: 'hand', turn: 1,
  },
  {
    name: 'Warrior Of Light', type: 'warrior', subtype: 'fighter', power: 2, currentP: 2, health: 4, currentHP: 4, cost: 2, description: 'БОЕЦ. Может сходить и атаковать в одном ходу', id: _.uniqueId(), features: [{ name: 'swift' }], attachments: [], img: WarriorOfLight, status: 'hand', turn: 1,
  },
  {
    name: 'Valor Knight', type: 'warrior', subtype: 'fighter', power: 2, currentP: 2, health: 6, currentHP: 6, cost: 3, description: 'БОЕЦ. Вылечивает 1 здоровье у союзных воинов в соседних клетках на линии при атаке в свой ход.', id: _.uniqueId(), features: [{}], attachments: [], img: ValorKnight, status: 'hand', turn: 1,
  },
  {
    name: 'Valor Knight', type: 'warrior', subtype: 'fighter', power: 2, currentP: 2, health: 6, currentHP: 6, cost: 3, description: 'БОЕЦ. Вылечивает 1 здоровье у союзных воинов в соседних клетках на линии при атаке в свой ход.', id: _.uniqueId(), features: [{}], attachments: [], img: ValorKnight, status: 'hand', turn: 1,
  },
  {
    name: 'Bannerman', type: 'warrior', subtype: 'fighter', power: 2, currentP: 2, health: 6, currentHP: 6, cost: 3, description: 'БОЕЦ. Когда вошел в игру, союзные воины в прилегающих клетках получают + 1 к базовой атаке до конца вашего хода', id: _.uniqueId(), attachments: [], features: [{}], img: BannerMan, status: 'hand', turn: 1,
  },
  {
    name: 'Bannerman', type: 'warrior', subtype: 'fighter', power: 2, currentP: 2, health: 6, currentHP: 6, cost: 3, description: 'БОЕЦ. Когда вошел в игру, союзные воины в прилегающих клетках получают + 1 к базовой атаке до конца вашего хода', id: _.uniqueId(), attachments: [], features: [{}], img: BannerMan, status: 'hand', turn: 1,
  },
  {
    name: 'Defender', type: 'warrior', subtype: 'fighter', power: 2, currentP: 2, health: 6, currentHP: 6, cost: 3, description: 'БОЕЦ. Имеет ЩИТ МАГИИ', id: _.uniqueId(), features: [{}], attachments: [], img: Defender, status: 'hand', turn: 1,
  },
  {
    name: 'Righeous Fighter', type: 'warrior', subtype: 'fighter', power: 3, currentP: 3, health: 4, currentHP: 4, cost: 3, description: 'БОЕЦ. Получает +1 к атаке в свой ход, пока имеет полное здоровье', id: _.uniqueId(), features: [{}], attachments: [], img: RighteousFighter, status: 'hand', turn: 1,
  },
  {
    name: 'Righeous Fighter', type: 'warrior', subtype: 'fighter', power: 3, currentP: 3, health: 4, currentHP: 4, cost: 3, description: 'БОЕЦ. Получает +1 к атаке в свой ход, пока имеет полное здоровье', id: _.uniqueId(), features: [{}], attachments: [], img: RighteousFighter, status: 'hand', turn: 1,
  },
  {
    name: 'Knight Guardian', type: 'warrior', subtype: 'fighter', power: 2, currentP: 2, health: 8, currentHP: 8, cost: 4, description: 'БОЕЦ. Получает урон вместо союзных воинов в соседних клетках на линии', id: _.uniqueId(), features: [{}], attachments: [], img: KnightGuardian, status: 'hand', turn: 1,
  },
  {
    name: 'Imperial Griffon', type: 'warrior', subtype: 'flyer', power: 2, currentP: 2, health: 7, currentHP: 7, cost: 4, description: 'ЛЕТАЮЩИЙ. Когда атакует в свой ход, отнимает также 1 здоровье у второго вражеского воина в шеренге', id: _.uniqueId(), features: [{}], attachments: [], img: ImperialGriffon, status: 'hand', turn: 1,
  },
  {
    name: 'Imperial Griffon', type: 'warrior', subtype: 'flyer', power: 2, currentP: 2, health: 7, currentHP: 7, cost: 4, description: 'ЛЕТАЮЩИЙ. Когда атакует в свой ход, отнимает также 1 здоровье у второго вражеского воина в шеренге', id: _.uniqueId(), features: [{}], attachments: [], img: ImperialGriffon, status: 'hand', turn: 1,
  },
  {
    name: 'Templar Champion',
    type: 'warrior',
    subtype: 'fighter',
    power: 3,
    currentP: 3,
    health: 7,
    currentHP: 7,
    cost: 5,
    description: 'БОЕЦ. Когда входит в игру, вылечить здоровье у союзного воина на поле. При атаке в свой ход, отнимает также 2 здоровья у второго воина в шеренге',
    id: _.uniqueId(),
    features: [{
      name: 'invoke',
      value: {
        img: TemplarChampion,
        name: 'fake',
        type: 'spell',
        subtype: 'instant',
        cost: 0,
        description: 'Выбрать воина для лечения',
        place: '',
        features: [{
          attach: false, aim: ['warrior'], type: 'good', name: 'heal', value: 3,
        }],
        status: 'hand',
      },
    }],
    attachments: [],
    img: TemplarChampion,
    status: 'hand',
    turn: 1,
  },
  {
    name: 'Templar Champion',
    type: 'warrior',
    subtype: 'fighter',
    power: 3,
    currentP: 3,
    health: 7,
    currentHP: 7,
    cost: 5,
    description: 'БОЕЦ. Когда входит в игру, вылечить здоровье у союзного воина на поле. При атаке в свой ход, отнимает также 2 здоровья у второго воина в шеренге',
    id: _.uniqueId(),
    features: [{
      name: 'invoke',
      value: {
        img: TemplarChampion,
        name: 'fake',
        type: 'spell',
        subtype: 'instant',
        cost: 0,
        description: 'Выбрать воина для лечения',
        place: '',
        features: [{
          attach: false, aim: ['warrior'], type: 'good', name: 'heal', value: 3,
        }],
        status: 'hand',
      },
    }],
    attachments: [],
    img: TemplarChampion,
    status: 'hand',
    turn: 1,
  },
  {
    name: 'Master Of Light', type: 'warrior', subtype: 'fighter', power: 4, currentP: 4, health: 9, currentHP: 9, cost: 7, description: 'БОЕЦ. В свой ход, вместо базовой атаки, может отнять 2 здоровья у 2-х воинов в шеренге не получая ответного удара', id: _.uniqueId(), features: [{}], attachments: [], img: MasterOfLight, status: 'hand', turn: 1,
  },
  {
    name: 'Thunder Blast',
    type: 'spell',
    subtype: 'instant',
    cost: 4,
    description: 'Отнять у воина 3 здоровья или 4, если это отложенная карта, и оглушить всех прилегающих к цели других воинов.',
    id: _.uniqueId(),
    place: '',
    features: [{
      attach: false, type: 'bad', aim: ['warrior', 'fighter', 'shooter', 'flyer'], name: 'attack', value: 3, depend: 'postponed', dependValue: 4,
    },
    {
      attach: false, type: 'bad', aim: ['adjacent'], name: 'stun',
    }],
    img: ThunderBlast,
    status: 'hand',
  },
  {
    name: 'Swift',
    type: 'spell',
    subtype: 'permanent',
    cost: 2,
    description: 'Накладывается на воина. Он может атаковать и ходить в один ход',
    id: _.uniqueId(),
    place: 'warrior',
    features: [{
      attach: ['warrior'],
      aim: ['warrior'],
      type: 'good',
      name: 'swift',
    }],
    img: Swift,
    status: 'hand',
  },
  {
    name: 'Resurrection',
    type: 'spell',
    subtype: 'instant',
    cost: 4,
    description: 'Взять карту воина из вашего стока и разыграть ее бесплатно',
    id: _.uniqueId(),
    place: '',
    features: [{
      attach: ['graveyard'],
      aim: ['warrior'],
      type: 'good',
      name: 'ressurect',
    }],
    img: Resurrection,
    status: 'hand',
  },
  {
    name: 'Retribution',
    type: 'spell',
    subtype: 'temporary',
    cost: 1,
    description: 'Воин получает +1 к атаке в свой ход, и + 1 к атаке за каждый положительный эффект на ваших воинах или на поле боя',
    id: _.uniqueId(),
    place: 'warrior',
    features: [{
      attach: ['warrior'],
      aim: ['warrior'],
      type: 'good',
      name: 'power',
      value: 1,
      depend: 'goodattachments',
      dependValue: 1,
      charges: 1,
    }],
    img: Retribution,
    status: 'hand',
  },
  {
    name: 'Holy Shield',
    type: 'spell',
    subtype: 'permanent',
    cost: 2,
    description: 'Кладется на воина. Противники теряют 2 здоровья за каждую атаку которую наносят по этому воину в свой ход.',
    id: _.uniqueId(),
    place: 'warrior',
    features: [{
      attach: ['warrior'],
      aim: ['warrior'],
      type: 'good',
      name: 'retaliation',
      value: 2,
    }],
    img: HolyShield,
    status: 'hand',
  },
  {
    name: 'Healing Light',
    type: 'spell',
    subtype: 'instant',
    cost: 1,
    description: 'Вылечить 3 здоровья у воина, и 4 здоровья, если это отложенная карта',
    id: _.uniqueId(),
    place: '',
    features: [{
      attach: false, aim: ['warrior'], type: 'good', name: 'heal', depend: 'postponed', value: 3, dependValue: 4,
    }],
    img: HealingLight,
    status: 'hand',
  },
  {
    name: 'Youth Fountain',
    type: 'spell',
    subtype: 'temporary',
    cost: 2,
    description: 'Положить рядом с полем. Когда игрок выкладывает любую карту на поле боя - вылечить 2 здоровья у вражеского героя',
    id: _.uniqueId(),
    place: 'bigSpell',
    features: [{
      attach: ['field', 'spells', 'hero', 'warrior'], type: 'all', name: 'enemyheroheal', aim: ['warrior', 'spell'], condition: 'onplay', value: 2,
    }],
    img: YouthFountain,
    status: 'hand',
  },
  {
    name: 'Enlightenment',
    type: 'spell',
    subtype: 'turn',
    cost: 2,
    description: 'Кладется рядом с полем боя, Все ваши воины получают + 1 к атаке в свой ход.',
    id: _.uniqueId(),
    place: 'bigSpell',
    features: [{
      attach: ['field', 'warrior'], type: 'good', aim: ['warrior'], name: 'power', value: 1,
    }],
    img: Enlightenment,
    status: 'hand',
  },
  {
    name: 'Heaven Protection',
    type: 'spell',
    subtype: 'temporary',
    cost: 1,
    description: 'Кладется на союзного воина. Поглощает первый урон по воину во время хода противника (кроме способности героя), после этого Божественная защита отправляется в сток',
    id: _.uniqueId(),
    place: 'warrior',
    features: [{
      attach: ['warrior'],
      aim: ['warrior', 'spell'],
      type: 'good',
      name: 'protection',
      value: { type: 'number', val: 100 },
      charges: 1,
    }],
    img: HeavenProtection,
    status: 'hand',
  },
  {
    name: 'Bless',
    type: 'spell',
    subtype: 'permanent',
    cost: 2,
    description: 'Кладется на вашего воина - он получает + 1 к базовой атаке',
    id: _.uniqueId(),
    place: 'warrior',
    features: [{
      attach: ['warrior'],
      aim: ['warrior'],
      type: 'good',
      name: 'power',
      value: 1,
    }],
    img: Bless,
    status: 'hand',
  },
  {
    name: 'Holy Land',
    type: 'spell',
    subtype: 'temporary',
    cost: 1,
    description: 'Кладется на центральную клетку. Отнимает у каждого противника 2 здоровья, который перемещается или входит в игру в шеренге, где святая земля',
    id: _.uniqueId(),
    place: 'midSpell',
    features: [{
      attach: ['row', 'warrior'], type: 'bad', aim: ['warrior', 'fighter', 'shooter', 'flyer'], name: 'attack', condition: 'onmove', value: 2,
    },
    {
      attach: ['row', 'warrior'], type: 'bad', aim: ['warrior', 'fighter', 'shooter', 'flyer'], name: 'attack', condition: 'onplay', value: 2,
    }],
    img: HolyLand,
    status: 'hand',
  },
  {
    name: 'Heaven Shock',
    type: 'spell',
    subtype: 'instant',
    cost: 2,
    description: 'Отнять 2 здоровья у воина на поле и вылечить 2 здоровья у вашего героя',
    id: _.uniqueId(),
    place: '',
    features: [{
      attach: false, aim: ['warrior'], type: 'bad', name: 'attack', value: 2,
    },
    {
      attach: false, aim: ['hero'], type: 'good', name: 'heroheal', value: 2,
    },
    ],
    img: HeavenShock,
    status: 'hand',
  },
  {
    name: 'Saint Word',
    type: 'spell',
    subtype: 'instant',
    cost: 4,
    description: 'Атаковать силой 2 или силой 3, если отложенная карта, всех вражеских воинов в шеренге, а также силой 2 вражеских воинов в cлучайной соседней шеренге',
    id: _.uniqueId(),
    place: '',
    features: [{
      attach: false, type: 'bad', aim: ['row', 'warrior', 'fighter', 'shooter', 'flyer'], name: 'attack', value: 2, depend: 'postponed', dependValue: 3,
    },
    {
      attach: false, type: 'bad', aim: ['nextrow', 'warrior', 'fighter', 'shooter', 'flyer'], name: 'attack', value: 2,
    },
    ],
    img: SaintWord,
    status: 'hand',
  },
  {
    name: 'Righteous Hammer',
    type: 'spell',
    subtype: 'instant',
    cost: 2,
    description: 'Отнять у воина 3 здоровья и + 1 здоровье за разницу в количестве воинов у вас и противника на поле',
    id: _.uniqueId(),
    place: '',
    features: [{
      attach: false, aim: ['warrior'], type: 'bad', name: 'attack', value: 3, depend: 'warriorsdiff', dependValue: 1,
    }],
    img: RighteousHammer,
    status: 'hand',
  },
  {
    name: 'Retaliation Hammer',
    type: 'spell',
    subtype: 'instant',
    cost: 2,
    description: 'Отнять 2 здоровья у воина и переместить его на прилегающую клетку',
    id: _.uniqueId(),
    place: '',
    features: [
      {
        attach: false, type: 'bad', aim: ['warrior'], name: 'attack', value: 2,
      },
      {
        attach: false, type: 'bad', aim: ['warrior'], name: 'moverow',
      },
    ],
    img: RetaliationHammer,
    status: 'hand',
  },
  {
    name: 'LightShield',
    type: 'spell',
    subtype: 'permanent',
    cost: 1,
    description: 'Кладется на вашего воина. Он получает +2 к здоровью.',
    id: _.uniqueId(),
    place: 'warrior',
    features: [{
      attach: false,
      aim: ['warrior'],
      type: 'good',
      name: 'health',
      value: 2,
    }],
    img: LightShield,
    status: 'hand',
  },
  {
    name: 'Last Chance',
    type: 'spell',
    subtype: 'instant',
    cost: 1,
    description: 'РЕАКЦИЯ. Только что убитый союзный воин во время хода противника возрождается с 1 здоровьем',
    id: _.uniqueId(),
    place: 'postponed',
    features: [{
      attach: ['field', 'warrior'], type: 'good', aim: ['warrior', 'spell'], name: 'protection', condition: 'candie', value: { type: 'immortal', val: 0 }, charges: 1,
    }],
    img: LastChance,
    status: 'hand',
  },
  {
    name: 'Conciliation',
    type: 'spell',
    subtype: 'temporary',
    cost: 5,
    description: 'Кладется рядом с полем боя. Предотвращает любой урон по вашим воинам и герою во время хода противника.',
    id: _.uniqueId(),
    place: 'bigSpell',
    features: [{
      attach: ['field', 'warrior', 'hero'], type: 'good', name: 'protection', aim: ['warrior', 'spell'], value: { type: 'number', val: 100 },
    }],
    img: Сonciliation,
    status: 'hand',
  },
];

export default castleDeck;
