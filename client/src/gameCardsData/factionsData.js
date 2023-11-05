import _ from 'lodash';
import CastleLogo from '../assets/MainPage/Castle_logo.png';
import AcademiaLogo from '../assets/MainPage/Academia_logo.png';
import academiaDeck from './academiaDeck.js';
import castleDeck from './castleDeck.js';
import ZigfridHero from '../assets/CastleDeck/ZigfridHero.png';
import NalaHero from '../assets/AcademiaDeck/NalaHero.png';
import makeInitialDeck from '../utils/makeInitialDeck';

export const factionsData = [
  { id: 'Castle', img: CastleLogo, description: 'Рыцари и ангелы полагающиеся на магию света' },
  { id: 'Academia', img: AcademiaLogo, description: 'Могучие маги повелевающие элементалями' },
];

export const heroes = [
  {
    name: 'Zigfrid-Hero',
    type: 'hero',
    subtype: 'hero',
    factionId: 'Castle',
    health: 17,
    currentHP: 17,
    description: 'Удар молотом: атаковать силой 1 воина на поле боя и передвинуть его на соседнюю клетку в линии - 4д. Прилив сил: взять карту из колоды за 1д.',
    id: _.uniqueId(),
    cellId: '',
    cost: 4,
    currentC: 4,
    place: '',
    attachments: [],
    features: [{
      attach: false, type: 'bad', aim: ['warrior'], name: 'attack', value: 1,
    }, {
      attach: false, type: 'bad', aim: ['warrior'], name: 'moverow',
    },
    {
      attach: false, type: 'all', aim: ['warrior'], name: 'drawcard', condition: 'insteadatk', cost: 1,
    },
    ],
    img: ZigfridHero,
    status: 'field',
    turn: 0,
  },
  {
    name: 'Nala-Hero',
    type: 'hero',
    subtype: 'hero',
    factionId: 'Academia',
    health: 17,
    currentHP: 17,
    description: 'Стрела магии: отнять 1 здоровье у воина на поле боя за 2д. Прилив сил: взять карту из колоды за 1д.',
    id: _.uniqueId(),
    cellId: '',
    cost: 2,
    currentC: 2,
    place: '',
    attachments: [],
    features: [{
      attach: false, type: 'bad', aim: ['warrior'], name: 'attack', value: 1,
    },
    {
      attach: false, type: 'all', aim: ['warrior'], name: 'drawcard', condition: 'insteadatk', cost: 1,
    }],
    img: NalaHero,
    status: 'field',
    turn: 0,
  },
];

export const decks = {
  Castle: makeInitialDeck(castleDeck),
  Academia: makeInitialDeck(academiaDeck),
};
