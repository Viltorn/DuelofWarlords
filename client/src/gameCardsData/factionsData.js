import _ from 'lodash';
import CastleLogo from '../assets/MainPage/Castle_logo.png';
import AcademiaLogo from '../assets/MainPage/Academia_logo.png';
import ZigfridHero from '../assets/CastleDeck/ZigfridHero.png';
import NalaHero from '../assets/AcademiaDeck/NalaHero.png';

export const factionsData = [
  { id: 'Castle', img: CastleLogo, description: 'Castle' },
  { id: 'Academia', img: AcademiaLogo, description: 'Academia' },
];

export const heroes = [
  {
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
      attach: false, type: 'bad', aim: ['warrior'], name: 'attack', value: 1,
    }, {
      attach: false, type: 'bad', aim: ['warrior'], name: 'moverow',
    },
    {
      attach: false, type: 'all', aim: ['warrior'], name: 'drawCard', condition: 'insteadatk', cost: 1,
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
