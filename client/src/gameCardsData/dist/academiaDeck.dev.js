"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.types = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _EarthGolem = _interopRequireDefault(require("../assets/AcademiaDeck/EarthGolem.png"));

var _LivingWall = _interopRequireDefault(require("../assets/AcademiaDeck/LivingWall.png"));

var _Gargoyle = _interopRequireDefault(require("../assets/AcademiaDeck/Gargoyle.png"));

var _MageApprentice = _interopRequireDefault(require("../assets/AcademiaDeck/MageApprentice.png"));

var _Rakshasa = _interopRequireDefault(require("../assets/AcademiaDeck/Rakshasa.png"));

var _EnergyElemental = _interopRequireDefault(require("../assets/AcademiaDeck/EnergyElemental.png"));

var _FireGolem = _interopRequireDefault(require("../assets/AcademiaDeck/FireGolem.png"));

var _GremlinShooter = _interopRequireDefault(require("../assets/AcademiaDeck/GremlinShooter.png"));

var _IceElemental = _interopRequireDefault(require("../assets/AcademiaDeck/IceElemental.png"));

var _IceGiant = _interopRequireDefault(require("../assets/AcademiaDeck/IceGiant.png"));

var _YoungGenie = _interopRequireDefault(require("../assets/AcademiaDeck/YoungGenie.png"));

var _ArcaneArmor = _interopRequireDefault(require("../assets/AcademiaDeck/ArcaneArmor.png"));

var _Blizzard = _interopRequireDefault(require("../assets/AcademiaDeck/Blizzard.png"));

var _CursedShackle = _interopRequireDefault(require("../assets/AcademiaDeck/CursedShackle.png"));

var _Frostbite = _interopRequireDefault(require("../assets/AcademiaDeck/Frostbite.png"));

var _FrostTrap = _interopRequireDefault(require("../assets/AcademiaDeck/FrostTrap.png"));

var _IceBlock = _interopRequireDefault(require("../assets/AcademiaDeck/IceBlock.png"));

var _IceSpikes = _interopRequireDefault(require("../assets/AcademiaDeck/IceSpikes.png"));

var _IceWall = _interopRequireDefault(require("../assets/AcademiaDeck/IceWall.png"));

var _IceWeapon = _interopRequireDefault(require("../assets/AcademiaDeck/IceWeapon.png"));

var _Icing = _interopRequireDefault(require("../assets/AcademiaDeck/Icing.png"));

var _InvisibilityCloak = _interopRequireDefault(require("../assets/AcademiaDeck/InvisibilityCloak.png"));

var _SoulDrain = _interopRequireDefault(require("../assets/AcademiaDeck/SoulDrain.png"));

var _Teleport = _interopRequireDefault(require("../assets/AcademiaDeck/Teleport.png"));

var _TownPortal = _interopRequireDefault(require("../assets/AcademiaDeck/TownPortal.png"));

var _Transformation = _interopRequireDefault(require("../assets/AcademiaDeck/Transformation.png"));

var _Tsunami = _interopRequireDefault(require("../assets/AcademiaDeck/Tsunami.png"));

var _Waterfall = _interopRequireDefault(require("../assets/AcademiaDeck/Waterfall.png"));

var _IceArrow = _interopRequireDefault(require("../assets/AcademiaDeck/IceArrow.png"));

var _IceArmor = _interopRequireDefault(require("../assets/AcademiaDeck/IceArmor.png"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable max-len */
// Warriors
// Spells
var types = ['beforeturn', 'afterplay', 'protection', 'afterdeath'];
exports.types = types;
var academiaDeck = [{
  name: 'Living wall',
  type: 'warrior',
  subtype: 'fighter',
  power: 2,
  currentP: 2,
  health: 5,
  currentHP: 5,
  cost: 2,
  description: 'БОЕЦ. Не может передвигаться и атаковать в свой ход',
  id: _lodash["default"].uniqueId(),
  features: [{
    name: 'immobile'
  }, {
    name: 'unarmed'
  }],
  attachments: [],
  img: _LivingWall["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Mage apprentice',
  type: 'warrior',
  subtype: 'shooter',
  power: 2,
  currentP: 2,
  health: 4,
  currentHP: 4,
  cost: 3,
  description: 'СТРЕЛОК. Может атаковать любого воина на поле',
  id: _lodash["default"].uniqueId(),
  features: [{
    name: 'massAttack'
  }],
  attachments: [],
  img: _MageApprentice["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Mage apprentice',
  type: 'warrior',
  subtype: 'shooter',
  power: 2,
  currentP: 2,
  health: 4,
  currentHP: 4,
  cost: 3,
  description: 'СТРЕЛОК. Может атаковать любого воина на поле',
  id: _lodash["default"].uniqueId(),
  features: [{
    name: 'massAttack'
  }],
  attachments: [],
  img: _MageApprentice["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Gremlin shooter',
  type: 'warrior',
  subtype: 'shooter',
  power: 2,
  currentP: 2,
  health: 3,
  currentHP: 3,
  cost: 2,
  description: 'СТРЕЛОК. Имеет ответный удар стрелкам силой 1',
  id: _lodash["default"].uniqueId(),
  features: [],
  attachments: [],
  img: _GremlinShooter["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Ice element',
  type: 'warrior',
  subtype: 'shooter',
  power: 2,
  currentP: 2,
  health: 4,
  currentHP: 4,
  cost: 3,
  description: 'СТРЕЛОК. Воин убивающий Элемент льда базовой атакой, получает ОГЛУШЕНИЕ после этой атаки.',
  id: _lodash["default"].uniqueId(),
  features: [],
  attachments: [],
  img: _IceElemental["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Ice element',
  type: 'warrior',
  subtype: 'shooter',
  power: 2,
  currentP: 2,
  health: 4,
  currentHP: 4,
  cost: 3,
  description: 'СТРЕЛОК. Воин убивающий Элемент льда базовой атакой, получает ОГЛУШЕНИЕ после этой атаки.',
  id: _lodash["default"].uniqueId(),
  features: [],
  attachments: [],
  img: _IceElemental["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Earth golem',
  type: 'warrior',
  subtype: 'fighter',
  power: 2,
  currentP: 2,
  health: 4,
  currentHP: 4,
  cost: 2,
  description: 'БОЕЦ. При входе в игру, вылечить 1 здоровье у прилегающих воинов.',
  id: _lodash["default"].uniqueId(),
  features: [],
  attachments: [],
  img: _EarthGolem["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Earth golem',
  type: 'warrior',
  subtype: 'fighter',
  power: 2,
  currentP: 2,
  health: 4,
  currentHP: 4,
  cost: 2,
  description: 'БОЕЦ. При входе в игру, вылечить 1 здоровье у прилегающих воинов.',
  id: _lodash["default"].uniqueId(),
  features: [],
  attachments: [],
  img: _EarthGolem["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Gargoyle',
  type: 'warrior',
  subtype: 'flyer',
  power: 2,
  currentP: 2,
  health: 4,
  currentHP: 4,
  cost: 2,
  description: 'Когда Бойцы в свой ход атакуют Гаргулью силой атаки более 1, урон от этих атак снижается на 1 единицу',
  id: _lodash["default"].uniqueId(),
  features: [],
  attachments: [],
  img: _Gargoyle["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Gargoyle',
  type: 'warrior',
  subtype: 'flyer',
  power: 2,
  currentP: 2,
  health: 4,
  currentHP: 4,
  cost: 2,
  description: 'Когда Бойцы в свой ход атакуют Гаргулью силой атаки более 1, урон от этих атак снижается на 1 единицу',
  id: _lodash["default"].uniqueId(),
  features: [],
  attachments: [],
  img: _Gargoyle["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Fire golem',
  type: 'warrior',
  subtype: 'fighter',
  power: 3,
  currentP: 3,
  health: 6,
  currentHP: 6,
  cost: 4,
  description: 'БОЕЦ. Перед смертью отнимает 1 здоровье у всех воинов в шеренге в которой он находился',
  id: _lodash["default"].uniqueId(),
  features: [],
  attachments: [],
  img: _FireGolem["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Fire golem',
  type: 'warrior',
  subtype: 'fighter',
  power: 3,
  currentP: 3,
  health: 6,
  currentHP: 6,
  cost: 4,
  description: 'БОЕЦ. Перед смертью отнимает 1 здоровье у всех воинов в шеренге в которой он находился',
  id: _lodash["default"].uniqueId(),
  features: [],
  attachments: [],
  img: _FireGolem["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Rakshasa',
  type: 'warrior',
  subtype: 'fighter',
  power: 2,
  currentP: 2,
  health: 6,
  currentHP: 6,
  cost: 3,
  description: 'Имеет УВОРОТ.',
  id: _lodash["default"].uniqueId(),
  features: [],
  attachments: [],
  img: _Rakshasa["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Rakshasa',
  type: 'warrior',
  subtype: 'fighter',
  power: 2,
  currentP: 2,
  health: 6,
  currentHP: 6,
  cost: 3,
  description: 'Имеет УВОРОТ.',
  id: _lodash["default"].uniqueId(),
  features: [],
  attachments: [],
  img: _Rakshasa["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Young genie',
  type: 'warrior',
  subtype: 'flyer',
  power: 3,
  currentP: 3,
  health: 4,
  currentHP: 4,
  cost: 3,
  description: 'ЛЕТАЮЩИЙ. Когда входит в игру, может переместить вражеского воина на поле на прилегающую клетку',
  id: _lodash["default"].uniqueId(),
  features: [],
  attachments: [],
  img: _YoungGenie["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Young genie',
  type: 'warrior',
  subtype: 'flyer',
  power: 3,
  currentP: 3,
  health: 4,
  currentHP: 4,
  cost: 3,
  description: 'ЛЕТАЮЩИЙ. Когда входит в игру, может переместить вражеского воина на поле на прилегающую клетку',
  id: _lodash["default"].uniqueId(),
  features: [],
  attachments: [],
  img: _YoungGenie["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Young genie',
  type: 'warrior',
  subtype: 'flyer',
  power: 3,
  currentP: 3,
  health: 4,
  currentHP: 4,
  cost: 3,
  description: 'ЛЕТАЮЩИЙ. Когда входит в игру, может переместить вражеского воина на поле на прилегающую клетку',
  id: _lodash["default"].uniqueId(),
  features: [],
  attachments: [],
  img: _YoungGenie["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Energy elemental',
  type: 'warrior',
  subtype: 'shooter',
  power: 2,
  currentP: 2,
  health: 5,
  currentHP: 5,
  cost: 4,
  description: 'СТРЕЛОК. При атаке в свой ход по воину, отнимает 2 здоровья у другого вражеского воина в шеренге',
  id: _lodash["default"].uniqueId(),
  features: [],
  attachments: [],
  img: _EnergyElemental["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Energy elemental',
  type: 'warrior',
  subtype: 'shooter',
  power: 2,
  currentP: 2,
  health: 5,
  currentHP: 5,
  cost: 4,
  description: 'СТРЕЛОК. При атаке в свой ход по воину, отнимает 2 здоровья у другого вражеского воина в шеренге',
  id: _lodash["default"].uniqueId(),
  features: [],
  attachments: [],
  img: _EnergyElemental["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Ice giant',
  type: 'warrior',
  subtype: 'fighter',
  power: 4,
  currentP: 4,
  health: 8,
  currentHP: 8,
  cost: 6,
  description: 'БОЕЦ. При входе в игру оглушает всех вражеских воинов в шеренге',
  id: _lodash["default"].uniqueId(),
  features: [],
  attachments: [],
  img: _IceGiant["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Ice giant',
  type: 'warrior',
  subtype: 'fighter',
  power: 4,
  currentP: 4,
  health: 8,
  currentHP: 8,
  cost: 6,
  description: 'БОЕЦ. При входе в игру оглушает всех вражеских воинов в шеренге',
  id: _lodash["default"].uniqueId(),
  features: [],
  attachments: [],
  img: _IceGiant["default"],
  status: 'hand',
  turn: 1
}, {
  name: 'Arcane armor',
  type: 'spell',
  subtype: 'instant',
  cost: 1,
  description: 'РЕАКЦИЯ: Отменить первый урон от базовой атаки в ходу по вашему воину или герою (что будет первым) силой 3 и более',
  id: _lodash["default"].uniqueId(),
  place: 'postponed',
  features: [{
    attach: ['field', 'warrior', 'hero'],
    aim: ['warrior'],
    type: 'good',
    name: 'protection',
    value: {
      type: 'number',
      val: 100
    },
    charges: 1,
    condition: 'minPower',
    conditionValue: 3
  }],
  img: _ArcaneArmor["default"],
  status: 'hand'
}, {
  name: 'Blizzard',
  type: 'spell',
  subtype: 'temporary',
  cost: 2,
  description: 'Накладывается на центральную клетку. Отнимает 2 здоровье у всех воинов в этой шеренге. ПОДГОТОВКА: отнять 2 здоровья у всех воинов в шеренге',
  id: _lodash["default"].uniqueId(),
  place: 'midSpell',
  features: [{
    attach: false,
    type: 'all',
    aim: ['row'],
    value: 2,
    name: 'attack'
  }, {
    attach: false,
    type: 'all',
    aim: ['row'],
    value: 2,
    name: 'attack',
    condition: 'lastcall'
  }],
  img: _Blizzard["default"],
  status: 'hand'
}, {
  name: 'Cursed chackle',
  type: 'spell',
  subtype: 'permanent',
  cost: 3,
  description: 'Накладывается на вражеского воина. После того как этот воин нанес урон в свой ход, нанести такой же урон вражескому герою',
  id: _lodash["default"].uniqueId(),
  place: 'warrior',
  features: [{
    attach: ['warrior'],
    aim: ['warrior'],
    type: 'bad',
    condition: 'onattack',
    name: 'selfheroattack',
    value: 'power'
  }],
  img: _CursedShackle["default"],
  status: 'hand'
}, {
  name: 'Frostbite',
  type: 'spell',
  subtype: 'permanent',
  cost: 2,
  description: 'Накладывается на воина и отнимает у него -2 базовой атаки',
  id: _lodash["default"].uniqueId(),
  place: 'warrior',
  features: [{
    attach: ['warrior'],
    aim: ['warrior'],
    type: 'bad',
    name: 'power',
    value: -2
  }],
  img: _Frostbite["default"],
  status: 'hand'
}, {
  name: 'Frost trap',
  type: 'spell',
  subtype: 'instant',
  cost: 2,
  description: 'РЕАКЦИЯ: вражеский воин, который только сделал шаг или вошел в игру, отправляется в руку к владельцу и восстанавливает здоровье (если на на воине был эффект, то он возвращается в руку владельцу)',
  id: _lodash["default"].uniqueId(),
  place: 'postponed',
  features: [{
    attach: ['field', 'warrior'],
    aim: ['warrior'],
    name: 'return',
    condition: 'onplay',
    type: 'bad',
    charges: 1
  }, {
    attach: ['field', 'warrior'],
    aim: ['warrior'],
    name: 'return',
    condition: 'onmove',
    type: 'bad',
    charges: 1
  }],
  img: _FrostTrap["default"],
  status: 'hand'
}, {
  name: 'Ice block',
  type: 'spell',
  subtype: 'temporary',
  cost: 3,
  description: 'Кладется рядом с полем боя. Поглощает весь урон по герою в течение хода, если поглотился урон в прошлом ходу врага, то ледяной блок отправляется в сток в начале вашего хода',
  id: _lodash["default"].uniqueId(),
  place: 'warrior',
  features: [{
    attach: ['hero'],
    aim: ['hero'],
    type: 'good',
    spellAim: ['hero', 'warrior', 'spell'],
    name: 'protection',
    value: {
      type: 'number',
      val: 100
    }
  }],
  img: _IceBlock["default"],
  status: 'hand'
}, {
  name: 'Ice spikes',
  type: 'spell',
  subtype: 'instant',
  cost: 3,
  description: 'Отнять 2 здоровья у всех воинов на целевой линии',
  id: _lodash["default"].uniqueId(),
  place: '',
  features: [{
    attach: false,
    type: 'bad',
    name: 'attack',
    value: 2,
    aim: ['warrior', 'line']
  }],
  img: _IceSpikes["default"],
  status: 'hand'
}, {
  name: 'Ice wall',
  type: 'spell',
  subtype: 'temporary',
  cost: 1,
  description: 'Кладется центральную клетку. Стрелки и Бойцы в этой шеренге не могут атаковать в свой ход',
  id: _lodash["default"].uniqueId(),
  place: 'midSpell',
  features: [{
    attach: ['row', 'warrior'],
    type: 'all',
    aim: ['warrior', 'fighter', 'shooter'],
    name: 'unarmed'
  }],
  img: _IceWall["default"],
  status: 'hand'
}, {
  name: 'Ice weapon',
  type: 'spell',
  subtype: 'permanent',
  cost: 4,
  description: 'Накладывается на воина. Он получает +2 к базовой атаке',
  id: _lodash["default"].uniqueId(),
  place: 'warrior',
  features: [{
    attach: ['warrior'],
    aim: ['warrior'],
    type: 'good',
    name: 'power',
    value: 2
  }],
  img: _IceWeapon["default"],
  status: 'hand'
}, {
  name: 'Icing',
  type: 'spell',
  subtype: 'temporary',
  cost: 2,
  description: 'Кладется на центральную клетку. Воины в этой шеренге не могут передвигаться и атаковать в свой ход',
  id: _lodash["default"].uniqueId(),
  place: 'midSpell',
  features: [{
    attach: ['row', 'warrior'],
    aim: ['fighter', 'shooter', 'flyer'],
    type: 'all',
    name: 'immobile'
  }, {
    attach: ['row', 'warrior'],
    aim: ['fighter', 'shooter', 'flyer'],
    type: 'all',
    name: 'unarmed'
  }],
  img: _Icing["default"],
  status: 'hand'
}, {
  name: 'Invisibility cloak',
  type: 'spell',
  subtype: 'temporary',
  cost: 1,
  description: 'Накладывается на воина. Он получает НЕВИДИМОСТЬ',
  id: _lodash["default"].uniqueId(),
  place: 'warrior',
  features: [{
    attach: ['warrior'],
    aim: ['warrior'],
    type: 'good',
    name: 'invisible'
  }],
  img: _InvisibilityCloak["default"],
  status: 'hand'
}, {
  name: 'Soul drain',
  type: 'spell',
  subtype: 'instant',
  cost: 5,
  description: 'Уничтожить вражеского воина на поле боя',
  id: _lodash["default"].uniqueId(),
  place: '',
  features: [{
    attach: false,
    type: 'bad',
    name: 'attack',
    value: 200,
    aim: ['warrior']
  }],
  img: _SoulDrain["default"],
  status: 'hand'
}, {
  name: 'Teleport',
  type: 'spell',
  subtype: 'temporary',
  cost: 1,
  description: 'Переместить союзного воина на любую свободную клетку (подходящую ему)',
  id: _lodash["default"].uniqueId(),
  place: 'warrior',
  features: [{
    attach: ['warrior'],
    type: 'good',
    aim: ['warrior'],
    name: 'moving'
  }],
  img: _Teleport["default"],
  status: 'hand'
}, {
  name: 'Town portal',
  type: 'spell',
  subtype: 'instant',
  cost: 3,
  description: 'Вражеский воин отправляется в руку к владельцу и восстанавливает здоровье (если на воине был эффект, то он возвращается в руку владельцу)',
  id: _lodash["default"].uniqueId(),
  place: '',
  features: [{
    attach: false,
    type: 'bad',
    name: 'return',
    aim: ['warrior']
  }],
  img: _TownPortal["default"],
  status: 'hand'
}, {
  name: 'Transformation',
  type: 'spell',
  subtype: 'instant',
  cost: 1,
  description: 'Воин получает ОГЛУШЕНИЕ и вы можете передвинуть его на соседню клетку',
  id: _lodash["default"].uniqueId(),
  place: '',
  features: [{
    attach: false,
    type: 'bad',
    name: 'stun',
    aim: 'warrior'
  }, {
    attach: false,
    type: 'bad',
    name: 'moverow',
    aim: 'warrior'
  }],
  img: _Transformation["default"],
  status: 'hand'
}, {
  name: 'Tsunami',
  type: 'spell',
  subtype: 'instant',
  cost: 7,
  description: 'Отнять 7 здоровья у всех не летающих воинов на поле боя или 8, если это отложенная способность',
  id: _lodash["default"].uniqueId(),
  place: '',
  features: [{
    attach: false,
    type: 'all',
    aim: ['field', 'warrior', 'fighter', 'shooter'],
    name: 'attack',
    value: 7,
    depend: 'postponed',
    dependValue: 8
  }],
  img: _Tsunami["default"],
  status: 'hand'
}, {
  name: 'Waterfall',
  type: 'spell',
  subtype: 'temporary',
  cost: 2,
  description: 'Кладется рядом с полем боя. Все воины с текущей базовой атакой 2 или меньше не могут атаковать в свой ход',
  id: _lodash["default"].uniqueId(),
  place: 'bigSpell',
  features: [{
    attach: ['field', 'warrior'],
    aim: ['warrior', 'fighter', 'shooter', 'flyer'],
    type: 'all',
    name: 'unarmed',
    condition: 'maxPower',
    conditionValue: 2
  }],
  img: _Waterfall["default"],
  status: 'hand'
}, {
  name: 'Ice arrow',
  type: 'spell',
  subtype: 'instant',
  cost: 2,
  description: 'Отнять 2 здоровья у воина, этот воин получает ОГЛУШЕНИЕ',
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
    name: 'stun'
  }],
  img: _IceArrow["default"],
  status: 'hand'
}, {
  name: 'Ice armor',
  type: 'spell',
  subtype: 'temporary',
  cost: 1,
  description: 'Накладывается на союзного воина или героя. Во время хода врага, урон от всех атак по этому воину или герою снижается на 1',
  id: _lodash["default"].uniqueId(),
  place: 'warrior',
  features: [{
    attach: ['warrior', 'hero'],
    aim: ['warrior', 'hero', 'spell'],
    type: 'good',
    name: 'protection',
    value: {
      type: 'number',
      val: 1
    }
  }],
  img: _IceArmor["default"],
  status: 'hand'
}];
var _default = academiaDeck;
exports["default"] = _default;