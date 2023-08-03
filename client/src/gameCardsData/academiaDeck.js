/* eslint-disable max-len */
import _ from 'lodash';
import EarthGolem from '../assets/AcademiaDeck/EarthGolem.png';
import LivingWall from '../assets/AcademiaDeck/LivingWall.png';
import Gargoyle from '../assets/AcademiaDeck/Gargoyle.png';
import MageApprentice from '../assets/AcademiaDeck/MageApprentice.png';
import Rakshasa from '../assets/AcademiaDeck/Rakshasa.png';
import IceArrow from '../assets/AcademiaDeck/IceArrow.png';
import IceArmor from '../assets/AcademiaDeck/IceArmor.png';

export const types = ['beforeturn', 'afterplay', 'protection', 'afterdeath'];

const academiaDeck = [
  {
    name: 'Earth golem', type: 'warrior', subtype: 'figther', power: 2, health: 4, currentHP: 4, description: 'При входе в игру, вылечить 1 здоровье у прилегающих воинов.', id: _.uniqueId(), feature: '', img: EarthGolem, status: 'hand', turn: 1,
  },
  {
    name: 'Earth golem', type: 'warrior', subtype: 'figther', power: 2, health: 4, currentHP: 4, description: 'При входе в игру, вылечить 1 здоровье у прилегающих воинов.', id: _.uniqueId(), feature: '', img: EarthGolem, status: 'hand', turn: 1,
  },
  {
    name: 'Living wall', type: 'warrior', subtype: 'figther', power: 2, health: 5, currentHP: 5, description: 'Не может передвигаться и атаковать в свой ход', id: _.uniqueId(), feature: '', img: LivingWall, status: 'hand', turn: 1,
  },
  {
    name: 'Gargoyle', type: 'warrior', subtype: 'flying', power: 2, health: 4, currentHP: 4, description: 'Когда Бойцы в свой ход атакуют Гаргулью силой более 1, урон от этих атак снижается на 1 единицу', id: _.uniqueId(), feature: '', img: Gargoyle, status: 'hand', turn: 1,
  },
  {
    name: 'Gargoyle', type: 'warrior', subtype: 'flying', power: 2, health: 4, currentHP: 4, description: 'Когда Бойцы в свой ход атакуют Гаргулью силой более 1, урон от этих атак снижается на 1 единицу', id: _.uniqueId(), feature: '', img: Gargoyle, status: 'hand', turn: 1,
  },
  {
    name: 'Mage apprentice', type: 'warrior', subtype: 'shooter', power: 2, health: 4, currentHP: 4, description: 'Может атаковать любого воина на поле', id: _.uniqueId(), feature: '', img: MageApprentice, status: 'hand', turn: 1,
  },
  {
    name: 'Mage apprentice', type: 'warrior', subtype: 'shooter', power: 2, health: 4, currentHP: 4, description: 'Может атаковать любого воина на поле', id: _.uniqueId(), feature: '', img: MageApprentice, status: 'hand', turn: 1,
  },
  {
    name: 'Rakshasa', type: 'warrior', subtype: 'figther', power: 2, health: 6, currentHP: 6, description: 'Имеет УВОРОТ.', id: _.uniqueId(), feature: '', img: Rakshasa, status: 'hand', turn: 1,
  },
  {
    name: 'Rakshasa', type: 'warrior', subtype: 'figther', power: 2, health: 6, currentHP: 6, description: 'Имеет УВОРОТ.', id: _.uniqueId(), feature: '', img: Rakshasa, status: 'hand', turn: 1,
  },
  {
    name: 'Ice arrow', type: 'spell', subtype: 'instant', description: 'Отнять 2 здоровья у воина, этот воин получает ОГЛУШЕНИЕ', id: _.uniqueId(), feature: '', img: IceArrow, status: 'hand',
  },
  {
    name: 'Ice armor', type: 'spell', subtype: 'temporary', description: 'Накладывается на союзного воина или героя. При получении урона во время хода врага, отнимается здоровье у Ледяной брони, пока оно не станет равным 0.', id: _.uniqueId(), feature: '', img: IceArmor, status: 'hand',
  },
];

export default academiaDeck;
