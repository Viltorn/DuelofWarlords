/* eslint-disable max-len */

import _ from 'lodash';
import EarthGolem from '../assets/AcademiaDeck/EarthGolem.png';
import LivingWall from '../assets/AcademiaDeck/LivingWall.png';
import Gargoyle from '../assets/AcademiaDeck/Gargoyle.png';
import MageApprentice from '../assets/AcademiaDeck/MageApprentice.png';
import Rakshasa from '../assets/AcademiaDeck/Rakshasa.png';

export const types = ['beforeturn', 'afterplay', 'protection', 'afterdeath'];
// const cards = [
//   {
//     name: 'Earth golem', type: 'warrior', subtype: 'figther', power: 2, health: 4, currentHP: 4, description: 'При входе в игру, вылечить 1 здоровье у прилегающих воинов.', id: _.uniqueId(), feature: '', img: EarthGolem,
//   },
//   {
//     name: 'Living wall', type: 'warrior', subtype: 'figther', power: 2, health: 5, currentHP: 5, description: 'Не может передвигаться и атаковать в свой ход', id: _.uniqueId(), feature: '', img: LivingWall,
//   },
//   {
//     name: 'Gargoyle', type: 'warrior', subtype: 'flying', power: 2, health: 4, currentHP: 4, description: 'Когда Бойцы в свой ход атакуют Гаргулью силой более 1, урон от этих атак снижается на 1 единицу', id: _.uniqueId(), feature: '', img: Gargoyle,
//   },
//   {
//     name: 'Mage apprentice', type: 'warrior', subtype: 'shooter', power: 2, health: 4, currentHP: 4, description: 'Может атаковать любого воина на поле', id: _.uniqueId(), feature: '', img: MageApprentice,
//   },
//   {
//     name: 'Rakshasa', type: 'warrior', subtype: 'figther', power: 2, health: 6, currentHP: 6, description: 'Имеет УВОРОТ.', id: _.uniqueId(), feature: '', img: Rakshasa,
//   },
//   {
//     name: 'Earth golem', type: 'warrior', subtype: 'figther', power: 2, health: 4, currentHP: 4, description: 'При входе в игру, вылечить 1 здоровье у прилегающих воинов.', id: _.uniqueId(), feature: '', img: EarthGolem,
//   },
//   {
//     name: 'Living wall', type: 'warrior', subtype: 'figther', power: 2, health: 5, currentHP: 5, description: 'Не может передвигаться и атаковать в свой ход', id: _.uniqueId(), feature: '', img: LivingWall,
//   },
//   {
//     name: 'Gargoyle', type: 'warrior', subtype: 'flying', power: 2, health: 4, currentHP: 4, description: 'Когда Бойцы в свой ход атакуют Гаргулью силой более 1, урон от этих атак снижается на 1 единицу', id: _.uniqueId(), feature: '', img: Gargoyle,
//   },
//   {
//     name: 'Mage apprentice', type: 'warrior', subtype: 'shooter', power: 2, health: 4, description: 'Может атаковать любого воина на поле', id: _.uniqueId(), feature: '', img: MageApprentice,
//   },
//   {
//     name: 'Rakshasa', type: 'warrior', subtype: 'figther', power: 2, health: 6, currentHP: 5, description: 'Имеет УВОРОТ.', id: _.uniqueId(), feature: '', img: Rakshasa,
//   },
// ];

const cards = [
  {
    name: 'Earth golem', type: 'warrior', subtype: 'figther', power: 2, health: 4, currentHP: 4, description: 'При входе в игру, вылечить 1 здоровье у прилегающих воинов.', id: _.uniqueId(), feature: '', img: EarthGolem,
  },
  {
    name: 'Living wall', type: 'warrior', subtype: 'figther', power: 2, health: 5, currentHP: 5, description: 'Не может передвигаться и атаковать в свой ход', id: _.uniqueId(), feature: '', img: LivingWall,
  },
  {
    name: 'Gargoyle', type: 'warrior', subtype: 'flying', power: 2, health: 4, currentHP: 4, description: 'Когда Бойцы в свой ход атакуют Гаргулью силой более 1, урон от этих атак снижается на 1 единицу', id: _.uniqueId(), feature: '', img: Gargoyle,
  },
  {
    name: 'Mage apprentice', type: 'warrior', subtype: 'shooter', power: 2, health: 4, currentHP: 4, description: 'Может атаковать любого воина на поле', id: _.uniqueId(), feature: '', img: MageApprentice,
  },
  {
    name: 'Rakshasa', type: 'warrior', subtype: 'figther', power: 2, health: 6, currentHP: 6, description: 'Имеет УВОРОТ.', id: _.uniqueId(), feature: '', img: Rakshasa,
  },
  {
    name: 'Earth golem', type: 'warrior', subtype: 'figther', power: 2, health: 4, currentHP: 4, description: 'При входе в игру, вылечить 1 здоровье у прилегающих воинов.', id: _.uniqueId(), feature: '', img: EarthGolem,
  },
];

export default cards;
