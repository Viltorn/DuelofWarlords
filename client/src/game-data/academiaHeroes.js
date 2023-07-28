/* eslint-disable import/prefer-default-export */
import _ from 'lodash';
import NalaHero from '../assets/AcademiaDeck/NalaHero.png';

export const Nala = {
  name: 'Nala-Hero', type: 'hero', subtype: 'castle', health: 20, currentHP: 20, description: 'Стрела магии: отнять 1 здоровье у воина на поле боя за 2д. Прилив сил: взять карту из колоды за 1д.', id: _.uniqueId(), cellId: 'hero2', feature: '', img: NalaHero, status: 'field', turn: 1,
};
