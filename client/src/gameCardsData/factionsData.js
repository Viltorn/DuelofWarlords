import _ from 'lodash';
import CastleLogo from '@assets/mainPageIcons/CastleLogo.png';
import AcademiaLogo from '@assets/mainPageIcons/AcademiaLogo.png';
import ZigfridHero from '@assets/castleCards/ZigfridHero.png';
import NalaHero from '@assets/academiaCards/NalaHero.png';
import AstralHero from '@assets/academiaCards/AstralHero.png';
import RionHero from '@assets/castleCards/RionHero.png';

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
  {
    name: 'Astral-Hero',
    type: 'hero',
    subtype: 'hero',
    faction: 'Academia',
    health: 20,
    currentHP: 20,
    featInfo: [],
    description: 'AstralHero',
    id: _.uniqueId(),
    cellId: '',
    cost: 3,
    currentC: 3,
    place: '',
    spellSchools: ['Fire', 'Shadow', 'Skills'],
    attachments: [],
    features: [{
      spell: true, attach: ['warrior', 'flyer', 'shooter', 'fighter'], type: 'bad', aim: ['warrior', 'flyer', 'shooter', 'fighter'], charges: 1, name: 'moving', aimStatus: 'field', immediate: true,
    },
    {
      attach: false, type: 'all', aim: ['warrior'], name: 'drawCard', condition: 'insteadatk', cost: 1,
    }],
    img: AstralHero,
    status: 'field',
    turn: 0,
  },
  {
    name: 'Rion-Hero',
    type: 'hero',
    subtype: 'hero',
    faction: 'Castle',
    health: 20,
    currentHP: 20,
    featInfo: [],
    description: 'RionHero',
    id: _.uniqueId(),
    cellId: '',
    cost: 3,
    currentC: 3,
    place: '',
    spellSchools: ['Fire', 'Light', 'Skills'],
    attachments: [],
    features: [{
      attach: false, type: 'good', aim: ['warrior', 'flyer', 'shooter', 'fighter'], name: 'heal', value: 2, aimStatus: 'field',
    },
    {
      attach: false, type: 'all', aim: ['warrior'], name: 'drawCard', condition: 'insteadatk', cost: 1,
    },
    ],
    img: RionHero,
    status: 'field',
    turn: 0,
  },
];
