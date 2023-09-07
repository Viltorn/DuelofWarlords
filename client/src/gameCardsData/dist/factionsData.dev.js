"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decks = exports.heroes = exports.factionsData = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _Castle_logo = _interopRequireDefault(require("../assets/MainPage/Castle_logo.png"));

var _Academia_logo = _interopRequireDefault(require("../assets/MainPage/Academia_logo.png"));

var _academiaDeck = _interopRequireDefault(require("./academiaDeck.js"));

var _castleDeck = _interopRequireDefault(require("./castleDeck.js"));

var _ZigfridHero = _interopRequireDefault(require("../assets/CastleDeck/ZigfridHero.png"));

var _NalaHero = _interopRequireDefault(require("../assets/AcademiaDeck/NalaHero.png"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var factionsData = [{
  id: 'Castle',
  img: _Castle_logo["default"],
  description: 'Рыцари и ангелы полагающиеся на магию света'
}, {
  id: 'Academia',
  img: _Academia_logo["default"],
  description: 'Могучие маги повелевающие элементалями'
}];
exports.factionsData = factionsData;
var heroes = [{
  name: 'Zigfrid-Hero',
  type: 'hero',
  factionId: 'Castle',
  health: 20,
  currentHP: 20,
  description: 'Удар молотом: атаковать силой 1 не закрытого воина на поле боя и передвинуть его на соседнюю клетку в линии - 3д. Прилив сил: взять карту из колоды за 1д.',
  id: _lodash["default"].uniqueId(),
  cellId: '',
  attachments: [],
  features: [],
  img: _ZigfridHero["default"],
  status: 'field',
  turn: 0
}, {
  name: 'Nala-Hero',
  type: 'hero',
  factionId: 'Academia',
  health: 20,
  currentHP: 20,
  description: 'Стрела магии: отнять 1 здоровье у воина на поле боя за 2д. Прилив сил: взять карту из колоды за 1д.',
  id: _lodash["default"].uniqueId(),
  cellId: '',
  attachments: [],
  features: [],
  img: _NalaHero["default"],
  status: 'field',
  turn: 0
}];
exports.heroes = heroes;
var decks = {
  Castle: _castleDeck["default"],
  Academia: _academiaDeck["default"]
};
exports.decks = decks;