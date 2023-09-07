import _ from 'lodash';
import CastleLogo from '../assets/MainPage/Castle_logo.png';
import AcademiaLogo from '../assets/MainPage/Academia_logo.png';
import academiaDeck from './academiaDeck.js';
import castleDeck from './castleDeck.js';
import ZigfridHero from '../assets/CastleDeck/ZigfridHero.png';
import NalaHero from '../assets/AcademiaDeck/NalaHero.png';

export const factionsData = [
  { id: 'Castle', img: CastleLogo, description: 'Рыцари и ангелы полагающиеся на магию света' },
  { id: 'Academia', img: AcademiaLogo, description: 'Могучие маги повелевающие элементалями' },
];

export const heroes = [
  {
    name: 'Zigfrid-Hero', type: 'hero', factionId: 'Castle', health: 20, currentHP: 20, description: 'Удар молотом: атаковать силой 1 не закрытого воина на поле боя и передвинуть его на соседнюю клетку в линии - 3д. Прилив сил: взять карту из колоды за 1д.', id: _.uniqueId(), cellId: '', attachments: [], features: [], img: ZigfridHero, status: 'field', turn: 0,
  },
  {
    name: 'Nala-Hero', type: 'hero', factionId: 'Academia', health: 20, currentHP: 20, description: 'Стрела магии: отнять 1 здоровье у воина на поле боя за 2д. Прилив сил: взять карту из колоды за 1д.', id: _.uniqueId(), cellId: '', attachments: [], features: [], img: NalaHero, status: 'field', turn: 0,
  },
];

export const decks = {
  Castle: castleDeck,
  Academia: academiaDeck,
};
