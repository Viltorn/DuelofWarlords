/* eslint-disable import/prefer-default-export */
import _ from 'lodash';
import ZigfridHero from '../assets/CastleDeck/ZigfridHero.png';

export const Zigfrid = {
  name: 'Zigfrid-Hero', type: 'hero', subtype: 'castle', health: 20, currentHP: 20, description: 'Удар молотом: атаковать силой 1 не закрытого воина на поле боя и передвинуть его на соседнюю клетку в линии - 3д. Прилив сил: взять карту из колоды за 1д.', id: _.uniqueId(), cellId: 'hero1', feature: '', img: ZigfridHero, status: 'field', turn: 1,
};
