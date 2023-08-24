/* eslint-disable max-len */
import _ from 'lodash';
// Warriors
import EarthGolem from '../assets/AcademiaDeck/EarthGolem.png';
import LivingWall from '../assets/AcademiaDeck/LivingWall.png';
import Gargoyle from '../assets/AcademiaDeck/Gargoyle.png';
import MageApprentice from '../assets/AcademiaDeck/MageApprentice.png';
import Rakshasa from '../assets/AcademiaDeck/Rakshasa.png';
import EnergyElemental from '../assets/AcademiaDeck/EnergyElemental.png';
import FireGolem from '../assets/AcademiaDeck/FireGolem.png';
import GremlinShooter from '../assets/AcademiaDeck/GremlinShooter.png';
import IceElemental from '../assets/AcademiaDeck/IceElemental.png';
import IceGiant from '../assets/AcademiaDeck/IceGiant.png';
import YoungGenie from '../assets/AcademiaDeck/YoungGenie.png';
// Spells
import ArcaneArmor from '../assets/AcademiaDeck/ArcaneArmor.png';
import Blizzard from '../assets/AcademiaDeck/Blizzard.png';
import CursedShackle from '../assets/AcademiaDeck/CursedShackle.png';
import Frostbite from '../assets/AcademiaDeck/Frostbite.png';
import FrostTrap from '../assets/AcademiaDeck/FrostTrap.png';
import IceBlock from '../assets/AcademiaDeck/IceBlock.png';
import IceSpikes from '../assets/AcademiaDeck/IceSpikes.png';
import IceWall from '../assets/AcademiaDeck/IceWall.png';
import IceWeapon from '../assets/AcademiaDeck/IceWeapon.png';
import Icing from '../assets/AcademiaDeck/Icing.png';
import InvisibilityCloak from '../assets/AcademiaDeck/InvisibilityCloak.png';
import SoulDrain from '../assets/AcademiaDeck/SoulDrain.png';
import Teleport from '../assets/AcademiaDeck/Teleport.png';
import TownPortal from '../assets/AcademiaDeck/TownPortal.png';
import Transformation from '../assets/AcademiaDeck/Transformation.png';
import Tsunami from '../assets/AcademiaDeck/Tsunami.png';
import Waterfall from '../assets/AcademiaDeck/Waterfall.png';
import IceArrow from '../assets/AcademiaDeck/IceArrow.png';
import IceArmor from '../assets/AcademiaDeck/IceArmor.png';

export const types = ['beforeturn', 'afterplay', 'protection', 'afterdeath'];

const academiaDeck = [
  {
    name: 'Living wall', type: 'warrior', subtype: 'fighter', power: 2, currentP: 2, health: 5, currentHP: 5, cost: 2, description: 'БОЕЦ. Не может передвигаться и атаковать в свой ход', id: _.uniqueId(), features: {}, img: LivingWall, status: 'hand', turn: 1,
  },
  {
    name: 'Mage apprentice', type: 'warrior', subtype: 'shooter', power: 2, currentP: 2, health: 4, currentHP: 4, cost: 3, description: 'СТРЕЛОК. Может атаковать любого воина на поле', id: _.uniqueId(), features: { massAttack: true }, img: MageApprentice, status: 'hand', turn: 1,
  },
  {
    name: 'Mage apprentice', type: 'warrior', subtype: 'shooter', power: 2, currentP: 2, health: 4, currentHP: 4, cost: 3, description: 'СТРЕЛОК. Может атаковать любого воина на поле', id: _.uniqueId(), features: { massAttack: true }, img: MageApprentice, status: 'hand', turn: 1,
  },
  {
    name: 'Gremlin shooter', type: 'warrior', subtype: 'shooter', power: 2, currentP: 2, health: 3, currentHP: 3, cost: 2, description: 'СТРЕЛОК. Имеет ответный удар стрелкам силой 1', id: _.uniqueId(), features: {}, img: GremlinShooter, status: 'hand', turn: 1,
  },
  {
    name: 'Ice element', type: 'warrior', subtype: 'shooter', power: 2, currentP: 2, health: 4, currentHP: 4, cost: 3, description: 'СТРЕЛОК. Воин убивающий Элемент льда базовой атакой, получает ОГЛУШЕНИЕ после этой атаки.', id: _.uniqueId(), features: {}, img: IceElemental, status: 'hand', turn: 1,
  },
  {
    name: 'Ice element', type: 'warrior', subtype: 'shooter', power: 2, currentP: 2, health: 4, currentHP: 4, cost: 3, description: 'СТРЕЛОК. Воин убивающий Элемент льда базовой атакой, получает ОГЛУШЕНИЕ после этой атаки.', id: _.uniqueId(), features: {}, img: IceElemental, status: 'hand', turn: 1,
  },
  {
    name: 'Earth golem', type: 'warrior', subtype: 'fighter', power: 2, currentP: 2, health: 4, currentHP: 4, cost: 2, description: 'БОЕЦ. При входе в игру, вылечить 1 здоровье у прилегающих воинов.', id: _.uniqueId(), features: {}, img: EarthGolem, status: 'hand', turn: 1,
  },
  {
    name: 'Earth golem', type: 'warrior', subtype: 'fighter', power: 2, currentP: 2, health: 4, currentHP: 4, cost: 2, description: 'БОЕЦ. При входе в игру, вылечить 1 здоровье у прилегающих воинов.', id: _.uniqueId(), features: {}, img: EarthGolem, status: 'hand', turn: 1,
  },
  {
    name: 'Gargoyle', type: 'warrior', subtype: 'flyer', power: 2, currentP: 2, health: 4, currentHP: 4, cost: 2, description: 'Когда Бойцы в свой ход атакуют Гаргулью силой атаки более 1, урон от этих атак снижается на 1 единицу', id: _.uniqueId(), features: {}, img: Gargoyle, status: 'hand', turn: 1,
  },
  {
    name: 'Gargoyle', type: 'warrior', subtype: 'flyer', power: 2, currentP: 2, health: 4, currentHP: 4, cost: 2, description: 'Когда Бойцы в свой ход атакуют Гаргулью силой атаки более 1, урон от этих атак снижается на 1 единицу', id: _.uniqueId(), features: {}, img: Gargoyle, status: 'hand', turn: 1,
  },
  {
    name: 'Fire golem', type: 'warrior', subtype: 'fighter', power: 3, currentP: 3, health: 6, currentHP: 6, cost: 4, description: 'БОЕЦ. Перед смертью отнимает 1 здоровье у всех воинов в шеренге в которой он находился', id: _.uniqueId(), features: {}, img: FireGolem, status: 'hand', turn: 1,
  },
  {
    name: 'Fire golem', type: 'warrior', subtype: 'fighter', power: 3, currentP: 3, health: 6, currentHP: 6, cost: 4, description: 'БОЕЦ. Перед смертью отнимает 1 здоровье у всех воинов в шеренге в которой он находился', id: _.uniqueId(), features: {}, img: FireGolem, status: 'hand', turn: 1,
  },
  {
    name: 'Rakshasa', type: 'warrior', subtype: 'fighter', power: 2, currentP: 3, health: 6, currentHP: 6, cost: 3, description: 'Имеет УВОРОТ.', id: _.uniqueId(), features: {}, img: Rakshasa, status: 'hand', turn: 1,
  },
  {
    name: 'Rakshasa', type: 'warrior', subtype: 'fighter', power: 2, currentP: 3, health: 6, currentHP: 6, cost: 3, description: 'Имеет УВОРОТ.', id: _.uniqueId(), features: {}, img: Rakshasa, status: 'hand', turn: 1,
  },
  {
    name: 'Young genie', type: 'warrior', subtype: 'flyer', power: 3, currentP: 3, health: 4, currentHP: 4, cost: 3, description: 'ЛЕТАЮЩИЙ. Когда входит в игру, может переместить вражеского воина на поле на прилегающую клетку', id: _.uniqueId(), features: {}, img: YoungGenie, status: 'hand', turn: 1,
  },
  {
    name: 'Young genie', type: 'warrior', subtype: 'flyer', power: 3, currentP: 3, health: 4, currentHP: 4, cost: 3, description: 'ЛЕТАЮЩИЙ. Когда входит в игру, может переместить вражеского воина на поле на прилегающую клетку', id: _.uniqueId(), features: {}, img: YoungGenie, status: 'hand', turn: 1,
  },
  {
    name: 'Young genie', type: 'warrior', subtype: 'flyer', power: 3, currentP: 3, health: 4, currentHP: 4, cost: 3, description: 'ЛЕТАЮЩИЙ. Когда входит в игру, может переместить вражеского воина на поле на прилегающую клетку', id: _.uniqueId(), features: {}, img: YoungGenie, status: 'hand', turn: 1,
  },
  {
    name: 'Energy elemental', type: 'warrior', subtype: 'shooter', power: 2, currentP: 2, health: 5, currentHP: 5, cost: 4, description: 'СТРЕЛОК. При атаке в свой ход по воину, отнимает 2 здоровья у другого вражеского воина в шеренге', id: _.uniqueId(), features: {}, img: EnergyElemental, status: 'hand', turn: 1,
  },
  {
    name: 'Energy elemental', type: 'warrior', subtype: 'shooter', power: 2, currentP: 2, health: 5, currentHP: 5, cost: 4, description: 'СТРЕЛОК. При атаке в свой ход по воину, отнимает 2 здоровья у другого вражеского воина в шеренге', id: _.uniqueId(), features: {}, img: EnergyElemental, status: 'hand', turn: 1,
  },
  {
    name: 'Ice giant', type: 'warrior', subtype: 'fighter', power: 4, currentP: 4, health: 8, currentHP: 8, cost: 6, description: 'БОЕЦ. При входе в игру оглушает всех вражеских воинов в шеренге', id: _.uniqueId(), features: {}, img: IceGiant, status: 'hand', turn: 1,
  },
  {
    name: 'Ice giant', type: 'warrior', subtype: 'fighter', power: 4, currentP: 4, health: 8, currentHP: 8, cost: 6, description: 'БОЕЦ. При входе в игру оглушает всех вражеских воинов в шеренге', id: _.uniqueId(), features: {}, img: IceGiant, status: 'hand', turn: 1,
  },
  {
    name: 'Arcane armor', type: 'spell', subtype: 'instant', cost: 1, description: 'РЕАКЦИЯ: Отменить первый урон от базовой атаки в ходу по вашему воину или герою (что будет первым) силой 3 и более', id: _.uniqueId(), features: { reaction: { currentPowMin: 3 } }, img: ArcaneArmor, status: 'hand',
  },
  {
    name: 'Blizzard', type: 'spell', subtype: 'temporary', cost: 2, description: 'Накладывается на центральную клетку. Отнимает 2 здоровье у всех воинов в этой шеренге. ПОДГОТОВКА: отнять 2 здоровья у всех воинов в шеренге', id: _.uniqueId(), features: { midSpell: { aim: ['row'], type: 'attack', value: 3 } }, img: Blizzard, status: 'hand',
  },
  {
    name: 'Cursed chackle', type: 'spell', subtype: 'permanent', cost: 3, description: 'Накладывается на вражеского воина. После того как этот воин нанес урон в свой ход, нанести такой же урон вражескому герою', id: _.uniqueId(), features: { attachBad: { aim: ['warrior'], type: 'attackEnemyHero', value: 'currentP' } }, img: CursedShackle, status: 'hand',
  },
  {
    name: 'Frostbite', type: 'spell', subtype: 'permanent', cost: 2, description: 'Накладывается на воина и отнимает у него -2 базовой атаки', id: _.uniqueId(), features: { attachBad: { aim: ['warrior'], type: 'decreasePow', value: 2 } }, img: Frostbite, status: 'hand',
  },
  {
    name: 'Frost trap', type: 'spell', subtype: 'instant', cost: 2, description: 'РЕАКЦИЯ: вражеский воин, который только сделал шаг или вошел в игру, отправляется в руку к владельцу и восстанавливает здоровье (если на на воине был эффект, то он возвращается в руку владельцу)', id: _.uniqueId(), features: { reaction: { playWarrior: true } }, img: FrostTrap, status: 'hand',
  },
  {
    name: 'Ice block', type: 'spell', subtype: 'permanent', cost: 3, description: 'Кладется рядом с полем боя. Поглощает весь урон по герою в течение хода, если поглотился урон в прошлом ходу врага, то ледяной блок отправляется в сток в начале вашего хода', id: _.uniqueId(), features: { attachGood: { aim: ['hero'], type: 'protectYourHero', value: 100 } }, img: IceBlock, status: 'hand',
  },
  {
    name: 'Ice spikes', type: 'spell', subtype: 'instant', cost: 3, description: 'Отнять 2 здоровья у всех воинов на целевой линии', id: _.uniqueId(), features: { bad: true }, img: IceSpikes, status: 'hand',
  },
  {
    name: 'Ice wall', type: 'spell', subtype: 'temporary', cost: 1, description: 'Кладется центральную клетку. Стрелки и Бойцы в этой шеренге не могут атаковать в свой ход', id: _.uniqueId(), features: { midSpell: { aim: ['row'], type: 'disarm', value: ['fighter', 'shooter'] } }, img: IceWall, status: 'hand',
  },
  {
    name: 'Ice weapon', type: 'spell', subtype: 'permanent', cost: 4, description: 'Накладывается на воина. Он получает +2 к базовой атаке', id: _.uniqueId(), features: { attachGood: { aim: ['warrior'], type: 'increasePow', value: 2 } }, img: IceWeapon, status: 'hand',
  },
  {
    name: 'Icing', type: 'spell', subtype: 'temporary', cost: 2, description: 'Кладется на центральную клетку. Воины в этой шеренге не могут передвигаться и атаковать в свой ход', id: _.uniqueId(), features: { midSpell: { aim: ['row'], type: ['disarm', 'immobilize'], value: ['fighter', 'shooter', 'flyer'] } }, img: Icing, status: 'hand',
  },
  {
    name: 'Invisibility cloak', type: 'spell', subtype: 'temporary', cost: 1, description: 'Накладывается на воина. Он получает НЕВИДИМОСТЬ', id: _.uniqueId(), features: { attachGood: { aim: ['warrior'], type: 'invisible', value: true } }, img: InvisibilityCloak, status: 'hand',
  },
  {
    name: 'Soul drain', type: 'spell', subtype: 'instant', cost: 5, description: 'Уничтожить вражеского воина на поле боя', id: _.uniqueId(), features: { bad: true }, img: SoulDrain, status: 'hand',
  },
  {
    name: 'Teleport', type: 'spell', subtype: 'instant', cost: 1, description: 'Переместить союзного воина на любую свободную клетку (подходящую ему)', id: _.uniqueId(), features: { good: true }, img: Teleport, status: 'hand',
  },
  {
    name: 'Town portal', type: 'spell', subtype: 'instant', cost: 3, description: 'Вражеский воин отправляется в руку к владельцу и восстанавливает здоровье (если на воине был эффект, то он возвращается в руку владельцу)', id: _.uniqueId(), features: { bad: true }, img: TownPortal, status: 'hand',
  },
  {
    name: 'Transformation', type: 'spell', subtype: 'instant', cost: 1, description: 'Воин получает ОГЛУШЕНИЕ и вы можете передвинуть его на соседню клетку', id: _.uniqueId(), features: { bad: true }, img: Transformation, status: 'hand',
  },
  {
    name: 'Tsunami', type: 'spell', subtype: 'instant', cost: 7, description: 'Отнять 7 здоровья у всех не летающих воинов на поле боя или 8, если это отложенная способность', id: _.uniqueId(), features: { bad: true, good: true }, img: Tsunami, status: 'hand',
  },
  {
    name: 'Waterfall', type: 'spell', subtype: 'temporary', cost: 2, description: 'Кладется рядом с полем боя. Все воины с текущей базовой атакой 2 или меньше не могут атаковать в свой ход', id: _.uniqueId(), features: { bigSpell: { aim: ['field'], value: 'currentPow === 2' } }, img: Waterfall, status: 'hand',
  },
  {
    name: 'Ice arrow', type: 'spell', subtype: 'instant', cost: 2, description: 'Отнять 2 здоровья у воина, этот воин получает ОГЛУШЕНИЕ', id: _.uniqueId(), features: { bad: true }, img: IceArrow, status: 'hand',
  },
  {
    name: 'Ice armor', type: 'spell', subtype: 'temporary', cost: 1, description: 'Накладывается на союзного воина или героя. При получении урона во время хода врага, отнимается здоровье у Ледяной брони, пока оно не станет равным 0.', id: _.uniqueId(), features: { attachGood: { aim: ['field', 'hero'], type: 'protection', value: 3 } }, img: IceArmor, status: 'hand',
  },
];

export default academiaDeck;
