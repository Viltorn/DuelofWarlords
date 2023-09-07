"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _Bannerman = _interopRequireDefault(require("../assets/CastleDeck/Bannerman.png"));

var _Defender = _interopRequireDefault(require("../assets/CastleDeck/Defender.png"));

var _ImperialGriffon = _interopRequireDefault(require("../assets/CastleDeck/ImperialGriffon.png"));

var _ImperialShooter = _interopRequireDefault(require("../assets/CastleDeck/ImperialShooter.png"));

var _KnightGuardian = _interopRequireDefault(require("../assets/CastleDeck/KnightGuardian.png"));

var _MasterOfLight = _interopRequireDefault(require("../assets/CastleDeck/MasterOfLight.png"));

var _MasterShooter = _interopRequireDefault(require("../assets/CastleDeck/MasterShooter.png"));

var _TemplarChampion = _interopRequireDefault(require("../assets/CastleDeck/TemplarChampion.png"));

var _ValorKnight = _interopRequireDefault(require("../assets/CastleDeck/ValorKnight.png"));

var _WarriorOfLight = _interopRequireDefault(require("../assets/CastleDeck/WarriorOfLight.png"));

var _YoungPriestess = _interopRequireDefault(require("../assets/CastleDeck/YoungPriestess.png"));

var _RighteousFighter = _interopRequireDefault(require("../assets/CastleDeck/RighteousFighter.png"));

var _onciliation = _interopRequireDefault(require("../assets/CastleDeck/\u0421onciliation.png"));

var _Bless = _interopRequireDefault(require("../assets/CastleDeck/Bless.png"));

var _Enlightenment = _interopRequireDefault(require("../assets/CastleDeck/Enlightenment.png"));

var _HealingLight = _interopRequireDefault(require("../assets/CastleDeck/HealingLight.png"));

var _HeavenProtection = _interopRequireDefault(require("../assets/CastleDeck/HeavenProtection.png"));

var _HeavenShock = _interopRequireDefault(require("../assets/CastleDeck/HeavenShock.png"));

var _HolyLand = _interopRequireDefault(require("../assets/CastleDeck/HolyLand.png"));

var _HolyShield = _interopRequireDefault(require("../assets/CastleDeck/HolyShield.png"));

var _LastChance = _interopRequireDefault(require("../assets/CastleDeck/LastChance.png"));

var _LightShield = _interopRequireDefault(require("../assets/CastleDeck/LightShield.png"));

var _Resurrection = _interopRequireDefault(require("../assets/CastleDeck/Resurrection.png"));

var _RetaliationHammer = _interopRequireDefault(require("../assets/CastleDeck/RetaliationHammer.png"));

var _Retribution = _interopRequireDefault(require("../assets/CastleDeck/Retribution.png"));

var _RighteousHammer = _interopRequireDefault(require("../assets/CastleDeck/RighteousHammer.png"));

var _SaintWord = _interopRequireDefault(require("../assets/CastleDeck/SaintWord.png"));

var _Swift = _interopRequireDefault(require("../assets/CastleDeck/Swift.png"));

var _ThunderBlast = _interopRequireDefault(require("../assets/CastleDeck/ThunderBlast.png"));

var _YouthFountain = _interopRequireDefault(require("../assets/CastleDeck/YouthFountain.png"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// SPELLS
var castleDeck = [{
  name: 'Imperial Shooter',
  type: 'warrior',
  subtype: 'shooter',
  power: 1,
  currentP: 1,
  health: 2,
  currentHP: 2,
  cost: 1,
  description: 'СТРЕЛОК. Если убивает воина во время своего хода, может атаковать еще раз  силой 1',
  id: _lodash["default"].uniqueId(),
  features: [],
  attachments: [],
  img: _ImperialShooter["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Imperial Shooter',
  type: 'warrior',
  subtype: 'shooter',
  power: 1,
  currentP: 1,
  health: 2,
  currentHP: 2,
  cost: 1,
  description: 'СТРЕЛОК. Если убивает воина во время своего хода, может атаковать еще раз  силой 1',
  id: _lodash["default"].uniqueId(),
  features: [],
  attachments: [],
  img: _ImperialShooter["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Master Shooter',
  type: 'warrior',
  subtype: 'shooter',
  power: 2,
  currentP: 2,
  health: 4,
  currentHP: 4,
  cost: 3,
  description: 'СТРЕЛОК. Имеет ответный удар силой 1',
  id: _lodash["default"].uniqueId(),
  features: [],
  attachments: [],
  img: _MasterShooter["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Master Shooter',
  type: 'warrior',
  subtype: 'shooter',
  power: 2,
  currentP: 2,
  health: 4,
  currentHP: 4,
  cost: 3,
  description: 'СТРЕЛОК. Имеет ответный удар силой 1',
  id: _lodash["default"].uniqueId(),
  features: [],
  attachments: [],
  img: _MasterShooter["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Master Shooter',
  type: 'warrior',
  subtype: 'shooter',
  power: 2,
  currentP: 2,
  health: 4,
  currentHP: 4,
  cost: 3,
  description: 'СТРЕЛОК. Имеет ответный удар силой 1',
  id: _lodash["default"].uniqueId(),
  features: [],
  attachments: [],
  img: _MasterShooter["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Young Priestess',
  type: 'warrior',
  subtype: 'shooter',
  power: 1,
  currentP: 1,
  health: 4,
  currentHP: 4,
  cost: 2,
  description: 'СТРЕЛОК. Вылечивает 1 здоровье у прилегающего союзного воина в начале своего хода',
  id: _lodash["default"].uniqueId(),
  features: [],
  attachments: [],
  img: _YoungPriestess["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Young Priestess',
  type: 'warrior',
  subtype: 'shooter',
  power: 1,
  currentP: 1,
  health: 4,
  currentHP: 4,
  cost: 2,
  description: 'СТРЕЛОК. Вылечивает 1 здоровье у прилегающего союзного воина в начале своего хода',
  id: _lodash["default"].uniqueId(),
  features: [],
  attachments: [],
  img: _YoungPriestess["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Young Priestess',
  type: 'warrior',
  subtype: 'shooter',
  power: 1,
  currentP: 1,
  health: 4,
  currentHP: 4,
  cost: 2,
  description: 'СТРЕЛОК. Вылечивает 1 здоровье у прилегающего союзного воина в начале своего хода',
  id: _lodash["default"].uniqueId(),
  features: [],
  attachments: [],
  img: _YoungPriestess["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Warrior Of Light',
  type: 'warrior',
  subtype: 'fighter',
  power: 2,
  currentP: 2,
  health: 4,
  currentHP: 4,
  cost: 2,
  description: 'БОЕЦ. Может сходить и атаковать в одном ходу',
  id: _lodash["default"].uniqueId(),
  features: [{
    name: 'swift'
  }],
  attachments: [],
  img: _WarriorOfLight["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Warrior Of Light',
  type: 'warrior',
  subtype: 'fighter',
  power: 2,
  currentP: 2,
  health: 4,
  currentHP: 4,
  cost: 2,
  description: 'БОЕЦ. Может сходить и атаковать в одном ходу',
  id: _lodash["default"].uniqueId(),
  features: [{
    name: 'swift'
  }],
  attachments: [],
  img: _WarriorOfLight["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Valor Knight',
  type: 'warrior',
  subtype: 'fighter',
  power: 2,
  currentP: 2,
  health: 6,
  currentHP: 6,
  cost: 3,
  description: 'БОЕЦ. Вылечивает 1 здоровье у союзных воинов в соседних клетках на линии при атаке в свой ход.',
  id: _lodash["default"].uniqueId(),
  features: [{}],
  attachments: [],
  img: _ValorKnight["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Valor Knight',
  type: 'warrior',
  subtype: 'fighter',
  power: 2,
  currentP: 2,
  health: 6,
  currentHP: 6,
  cost: 3,
  description: 'БОЕЦ. Вылечивает 1 здоровье у союзных воинов в соседних клетках на линии при атаке в свой ход.',
  id: _lodash["default"].uniqueId(),
  features: [{}],
  attachments: [],
  img: _ValorKnight["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Bannerman',
  type: 'warrior',
  subtype: 'fighter',
  power: 2,
  currentP: 2,
  health: 6,
  currentHP: 6,
  cost: 3,
  description: 'БОЕЦ. Когда вошел в игру, союзные воины в прилегающих клетках получают + 1 к базовой атаке до конца вашего хода',
  id: _lodash["default"].uniqueId(),
  attachments: [],
  features: [{}],
  img: _Bannerman["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Bannerman',
  type: 'warrior',
  subtype: 'fighter',
  power: 2,
  currentP: 2,
  health: 6,
  currentHP: 6,
  cost: 3,
  description: 'БОЕЦ. Когда вошел в игру, союзные воины в прилегающих клетках получают + 1 к базовой атаке до конца вашего хода',
  id: _lodash["default"].uniqueId(),
  attachments: [],
  features: [{}],
  img: _Bannerman["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Defender',
  type: 'warrior',
  subtype: 'fighter',
  power: 2,
  currentP: 2,
  health: 6,
  currentHP: 6,
  cost: 3,
  description: 'БОЕЦ. Имеет ЩИТ МАГИИ',
  id: _lodash["default"].uniqueId(),
  features: [{}],
  attachments: [],
  img: _Defender["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Righeous Fighter',
  type: 'warrior',
  subtype: 'fighter',
  power: 3,
  currentP: 3,
  health: 4,
  currentHP: 4,
  cost: 3,
  description: 'БОЕЦ. Получает +1 к атаке в свой ход, пока имеет полное здоровье',
  id: _lodash["default"].uniqueId(),
  features: [{}],
  attachments: [],
  img: _RighteousFighter["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Righeous Fighter',
  type: 'warrior',
  subtype: 'fighter',
  power: 3,
  currentP: 3,
  health: 4,
  currentHP: 4,
  cost: 3,
  description: 'БОЕЦ. Получает +1 к атаке в свой ход, пока имеет полное здоровье',
  id: _lodash["default"].uniqueId(),
  features: [{}],
  attachments: [],
  img: _RighteousFighter["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Knight Guardian',
  type: 'warrior',
  subtype: 'fighter',
  power: 2,
  currentP: 2,
  health: 8,
  currentHP: 8,
  cost: 4,
  description: 'БОЕЦ. Получает урон вместо союзных воинов в соседних клетках на линии',
  id: _lodash["default"].uniqueId(),
  features: [{}],
  attachments: [],
  img: _KnightGuardian["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Imperial Griffon',
  type: 'warrior',
  subtype: 'flyer',
  power: 2,
  currentP: 2,
  health: 7,
  currentHP: 7,
  cost: 4,
  description: 'ЛЕТАЮЩИЙ. Когда атакует в свой ход, отнимает также 1 здоровье у второго вражеского воина в шеренге',
  id: _lodash["default"].uniqueId(),
  features: [{}],
  attachments: [],
  img: _ImperialGriffon["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Imperial Griffon',
  type: 'warrior',
  subtype: 'flyer',
  power: 2,
  currentP: 2,
  health: 7,
  currentHP: 7,
  cost: 4,
  description: 'ЛЕТАЮЩИЙ. Когда атакует в свой ход, отнимает также 1 здоровье у второго вражеского воина в шеренге',
  id: _lodash["default"].uniqueId(),
  features: [{}],
  attachments: [],
  img: _ImperialGriffon["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Templar Champion',
  type: 'warrior',
  subtype: 'fighter',
  power: 3,
  currentP: 3,
  health: 7,
  currentHP: 7,
  cost: 5,
  description: 'БОЕЦ. Когда входит в игру, вылечить здоровье у союзного воина на поле. При атаке в свой ход, отнимает также 2 здоровья у второго воина в шеренге',
  id: _lodash["default"].uniqueId(),
  features: [{
    name: 'invoke',
    value: {
      img: _TemplarChampion["default"],
      name: 'fake',
      type: 'spell',
      subtype: 'instant',
      cost: 0,
      description: 'Выбрать воина для лечения',
      place: '',
      features: [{
        attach: false,
        aim: ['warrior'],
        type: 'good',
        name: 'heal',
        value: 3
      }],
      status: 'hand'
    }
  }],
  attachments: [],
  img: _TemplarChampion["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Templar Champion',
  type: 'warrior',
  subtype: 'fighter',
  power: 3,
  currentP: 3,
  health: 7,
  currentHP: 7,
  cost: 5,
  description: 'БОЕЦ. Когда входит в игру, вылечить здоровье у союзного воина на поле. При атаке в свой ход, отнимает также 2 здоровья у второго воина в шеренге',
  id: _lodash["default"].uniqueId(),
  features: [{
    name: 'invoke',
    value: {
      img: _TemplarChampion["default"],
      name: 'fake',
      type: 'spell',
      subtype: 'instant',
      cost: 0,
      description: 'Выбрать воина для лечения',
      place: '',
      features: [{
        attach: false,
        aim: ['warrior'],
        type: 'good',
        name: 'heal',
        value: 3
      }],
      status: 'hand'
    }
  }],
  attachments: [],
  img: _TemplarChampion["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Master Of Light',
  type: 'warrior',
  subtype: 'fighter',
  power: 4,
  currentP: 4,
  health: 9,
  currentHP: 9,
  cost: 7,
  description: 'БОЕЦ. В свой ход, вместо базовой атаки, может отнять 2 здоровья у 2-х воинов в шеренге не получая ответного удара',
  id: _lodash["default"].uniqueId(),
  features: [{}],
  attachments: [],
  img: _MasterOfLight["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Thunder Blast',
  type: 'spell',
  subtype: 'instant',
  cost: 4,
  description: 'Отнять у воина 3 здоровья или 4, если это отложенная карта, и оглушить всех прилегающих к цели других воинов.',
  id: _lodash["default"].uniqueId(),
  place: '',
  features: [{
    attach: false,
    type: 'bad',
    aim: ['warrior', 'fighter', 'shooter', 'flyer'],
    name: 'attack',
    value: 3,
    depend: 'postponed',
    dependValue: 4
  }, {
    attach: false,
    type: 'bad',
    aim: ['adjacent'],
    name: 'stun'
  }],
  img: _ThunderBlast["default"],
  status: 'hand'
}, {
  name: 'Swift',
  type: 'spell',
  subtype: 'permanent',
  cost: 2,
  description: 'Накладывается на воина. Он может атаковать и ходить в один ход',
  id: _lodash["default"].uniqueId(),
  place: 'warrior',
  features: [{
    attach: ['warrior'],
    aim: ['warrior'],
    type: 'good',
    name: 'swift'
  }],
  img: _Swift["default"],
  status: 'hand'
}, {
  name: 'Resurrection',
  type: 'spell',
  subtype: 'instant',
  cost: 4,
  description: 'Взять карту воина из вашего стока и разыграть ее бесплатно',
  id: _lodash["default"].uniqueId(),
  place: '',
  features: [{
    attach: ['graveyard'],
    aim: ['warrior'],
    type: 'good',
    name: 'ressurect'
  }],
  img: _Resurrection["default"],
  status: 'hand'
}, {
  name: 'Retribution',
  type: 'spell',
  subtype: 'temporary',
  cost: 1,
  description: 'Воин получает +1 к атаке в свой ход, и + 1 к атаке за каждый положительный эффект на ваших воинах или на поле боя',
  id: _lodash["default"].uniqueId(),
  place: 'warrior',
  features: [{
    attach: ['warrior'],
    aim: ['warrior'],
    type: 'good',
    name: 'power',
    value: 1,
    depend: 'goodattachments',
    dependValue: 1,
    charges: 1
  }],
  img: _Retribution["default"],
  status: 'hand'
}, {
  name: 'Holy Shield',
  type: 'spell',
  subtype: 'permanent',
  cost: 2,
  description: 'Кладется на воина. Противники теряют 2 здоровья за каждую атаку которую наносят по этому воину в свой ход.',
  id: _lodash["default"].uniqueId(),
  place: 'warrior',
  features: [{
    attach: ['warrior'],
    aim: ['warrior'],
    type: 'good',
    name: 'retaliation',
    value: 2
  }],
  img: _HolyShield["default"],
  status: 'hand'
}, {
  name: 'Healing Light',
  type: 'spell',
  subtype: 'instant',
  cost: 1,
  description: 'Вылечить 3 здоровья у воина, и 4 здоровья, если это отложенная карта',
  id: _lodash["default"].uniqueId(),
  place: '',
  features: [{
    attach: false,
    aim: ['warrior'],
    type: 'good',
    name: 'heal',
    depend: 'postponed',
    value: 3,
    dependValue: 4
  }],
  img: _HealingLight["default"],
  status: 'hand'
}, {
  name: 'Youth Fountain',
  type: 'spell',
  subtype: 'temporary',
  cost: 2,
  description: 'Положить рядом с полем. Когда игрок выкладывает любую карту на поле боя - вылечить 2 здоровья у вражеского героя',
  id: _lodash["default"].uniqueId(),
  place: 'bigSpell',
  features: [{
    attach: ['field', 'spells', 'hero', 'warrior'],
    type: 'all',
    name: 'enemyheroheal',
    aim: ['warrior', 'spell'],
    condition: 'onplay',
    value: 2
  }],
  img: _YouthFountain["default"],
  status: 'hand'
}, {
  name: 'Enlightenment',
  type: 'spell',
  subtype: 'turn',
  cost: 2,
  description: 'Кладется рядом с полем боя, Все ваши воины получают + 1 к атаке в свой ход.',
  id: _lodash["default"].uniqueId(),
  place: 'bigSpell',
  features: [{
    attach: ['field', 'warrior'],
    type: 'good',
    aim: ['warrior'],
    name: 'power',
    value: 1
  }],
  img: _Enlightenment["default"],
  status: 'hand'
}, {
  name: 'Heaven Protection',
  type: 'spell',
  subtype: 'temporary',
  cost: 1,
  description: 'Кладется на союзного воина. Поглощает первый урон по воину во время хода противника (кроме способности героя), после этого Божественная защита отправляется в сток',
  id: _lodash["default"].uniqueId(),
  place: 'warrior',
  features: [{
    attach: ['warrior'],
    aim: ['warrior', 'spell'],
    type: 'good',
    name: 'protection',
    value: {
      type: 'number',
      val: 100
    },
    charges: 1
  }],
  img: _HeavenProtection["default"],
  status: 'hand'
}, {
  name: 'Bless',
  type: 'spell',
  subtype: 'permanent',
  cost: 2,
  description: 'Кладется на вашего воина - он получает + 1 к базовой атаке',
  id: _lodash["default"].uniqueId(),
  place: 'warrior',
  features: [{
    attach: ['warrior'],
    aim: ['warrior'],
    type: 'good',
    name: 'power',
    value: 1
  }],
  img: _Bless["default"],
  status: 'hand'
}, {
  name: 'Holy Land',
  type: 'spell',
  subtype: 'temporary',
  cost: 1,
  description: 'Кладется на центральную клетку. Отнимает у каждого противника 2 здоровья, который перемещается или входит в игру в шеренге, где святая земля',
  id: _lodash["default"].uniqueId(),
  place: 'midSpell',
  features: [{
    attach: ['row', 'warrior'],
    type: 'bad',
    aim: ['warrior', 'fighter', 'shooter', 'flyer'],
    name: 'attack',
    condition: 'onmove',
    value: 2
  }, {
    attach: ['row', 'warrior'],
    type: 'bad',
    aim: ['warrior', 'fighter', 'shooter', 'flyer'],
    name: 'attack',
    condition: 'onplay',
    value: 2
  }],
  img: _HolyLand["default"],
  status: 'hand'
}, {
  name: 'Heaven Shock',
  type: 'spell',
  subtype: 'instant',
  cost: 2,
  description: 'Отнять 2 здоровья у воина на поле и вылечить 2 здоровья у вашего героя',
  id: _lodash["default"].uniqueId(),
  place: '',
  features: [{
    attach: false,
    aim: ['warrior'],
    type: 'bad',
    name: 'attack',
    value: 2
  }, {
    attach: false,
    aim: ['hero'],
    type: 'good',
    name: 'heroheal',
    value: 2
  }],
  img: _HeavenShock["default"],
  status: 'hand'
}, {
  name: 'Saint Word',
  type: 'spell',
  subtype: 'instant',
  cost: 4,
  description: 'Атаковать силой 2 или силой 3, если отложенная карта, всех вражеских воинов в шеренге, а также силой 2 вражеских воинов в cлучайной соседней шеренге',
  id: _lodash["default"].uniqueId(),
  place: '',
  features: [{
    attach: false,
    type: 'bad',
    aim: ['row', 'warrior', 'fighter', 'shooter', 'flyer'],
    name: 'attack',
    value: 2,
    depend: 'postponed',
    dependValue: 3
  }, {
    attach: false,
    type: 'bad',
    aim: ['nextrow', 'warrior', 'fighter', 'shooter', 'flyer'],
    name: 'attack',
    value: 2
  }],
  img: _SaintWord["default"],
  status: 'hand'
}, {
  name: 'Righteous Hammer',
  type: 'spell',
  subtype: 'instant',
  cost: 2,
  description: 'Отнять у воина 3 здоровья и + 1 здоровье за разницу в количестве воинов у вас и противника на поле',
  id: _lodash["default"].uniqueId(),
  place: '',
  features: [{
    attach: false,
    aim: ['warrior'],
    type: 'bad',
    name: 'attack',
    value: 3,
    depend: 'warriorsdiff',
    dependValue: 1
  }],
  img: _RighteousHammer["default"],
  status: 'hand'
}, {
  name: 'Retaliation Hammer',
  type: 'spell',
  subtype: 'instant',
  cost: 2,
  description: 'Отнять 2 здоровья у воина и переместить его на прилегающую клетку',
  id: _lodash["default"].uniqueId(),
  place: '',
  features: [{
    attach: false,
    type: 'bad',
    aim: ['warrior'],
    name: 'attack',
    value: 2
  }, {
    attach: false,
    type: 'bad',
    aim: ['warrior'],
    name: 'moverow'
  }],
  img: _RetaliationHammer["default"],
  status: 'hand'
}, {
  name: 'LightShield',
  type: 'spell',
  subtype: 'permanent',
  cost: 1,
  description: 'Кладется на вашего воина. Он получает +2 к здоровью.',
  id: _lodash["default"].uniqueId(),
  place: 'warrior',
  features: [{
    attach: false,
    aim: ['warrior'],
    type: 'good',
    name: 'health',
    value: 2
  }],
  img: _LightShield["default"],
  status: 'hand'
}, {
  name: 'Last Chance',
  type: 'spell',
  subtype: 'instant',
  cost: 1,
  description: 'РЕАКЦИЯ. Только что убитый союзный воин во время хода противника возрождается с 1 здоровьем',
  id: _lodash["default"].uniqueId(),
  place: 'postponed',
  features: [{
    attach: ['field', 'warrior'],
    type: 'good',
    aim: ['warrior', 'spell'],
    name: 'protection',
    condition: 'candie',
    value: {
      type: 'immortal',
      val: 0
    },
    charges: 1
  }],
  img: _LastChance["default"],
  status: 'hand'
}, {
  name: 'Conciliation',
  type: 'spell',
  subtype: 'temporary',
  cost: 5,
  description: 'Кладется рядом с полем боя. Предотвращает любой урон по вашим воинам и герою во время хода противника.',
  id: _lodash["default"].uniqueId(),
  place: 'bigSpell',
  features: [{
    attach: ['field', 'warrior', 'hero'],
    type: 'good',
    name: 'protection',
    aim: ['warrior', 'spell'],
    value: {
      type: 'number',
      val: 100
    }
  }],
  img: _onciliation["default"],
  status: 'hand'
}];
var _default = castleDeck;
exports["default"] = _default;