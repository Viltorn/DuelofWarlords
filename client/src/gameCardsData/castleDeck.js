import _ from 'lodash';
import BannerMan from '../assets/CastleDeck/Bannerman.png';
import Defender from '../assets/CastleDeck/Defender.png';
import ImperialGriffon from '../assets/CastleDeck/ImperialGriffon.png';
import ImperialShooter from '../assets/CastleDeck/ImperialShooter.png';
import KnightGuardian from '../assets/CastleDeck/KnightGuardian.png';

const castleDeck = [
  {
    name: 'Bannerman', type: 'warrior', subtype: 'figther', power: 2, health: 6, currentHP: 6, cost: 3, description: 'БОЕЦ. Когда вошел в игру, союзные воины в прилегающих клетках получают + 1 к базовой атаке до конца вашего хода', id: _.uniqueId(), feature: '', img: BannerMan, status: 'hand', turn: 1,
  },
  {
    name: 'Bannerman', type: 'warrior', subtype: 'figther', power: 2, health: 6, currentHP: 6, cost: 3, description: 'БОЕЦ. Когда вошел в игру, союзные воины в прилегающих клетках получают + 1 к базовой атаке до конца вашего хода', id: _.uniqueId(), feature: '', img: BannerMan, status: 'hand', turn: 1,
  },
  {
    name: 'Defender', type: 'warrior', subtype: 'figther', power: 2, health: 6, currentHP: 6, cost: 3, description: 'БОЕЦ. Имеет ЩИТ МАГИИ', id: _.uniqueId(), feature: '', img: Defender, status: 'hand', turn: 1,
  },
  {
    name: 'Imperial Griffon', type: 'warrior', subtype: 'flyer', power: 2, health: 7, currentHP: 7, cost: 4, description: 'ЛЕТАЮЩИЙ. Когда атакует в свой ход, отнимает также 1 здоровье у второго вражеского воина в шеренге', id: _.uniqueId(), feature: '', img: ImperialGriffon, status: 'hand', turn: 1,
  },
  {
    name: 'Imperial Griffon', type: 'warrior', subtype: 'flyer', power: 2, health: 7, currentHP: 7, cost: 4, description: 'ЛЕТАЮЩИЙ. Когда атакует в свой ход, отнимает также 1 здоровье у второго вражеского воина в шеренге', id: _.uniqueId(), feature: '', img: ImperialGriffon, status: 'hand', turn: 1,
  },
  {
    name: 'Imperial Shooter', type: 'warrior', subtype: 'shooter', power: 1, health: 2, currentHP: 2, cost: 1, description: 'СТРЕЛОК. Если убивает воина во время своего хода, может атаковать еще раз  силой 1', id: _.uniqueId(), feature: '', img: ImperialShooter, status: 'hand', turn: 1,
  },
  {
    name: 'Imperial Shooter', type: 'warrior', subtype: 'shooter', power: 1, health: 2, currentHP: 2, cost: 1, description: 'СТРЕЛОК. Если убивает воина во время своего хода, может атаковать еще раз  силой 1', id: _.uniqueId(), feature: '', img: ImperialShooter, status: 'hand', turn: 1,
  },
  {
    name: 'Knight Guardian', type: 'warrior', subtype: 'fighter', power: 2, health: 8, currentHP: 8, cost: 4, description: 'БОЕЦ. Получает урон вместо союзных воинов в соседних клетках на линии', id: _.uniqueId(), feature: '', img: KnightGuardian, status: 'hand', turn: 1,
  },
  {
    name: 'Knight Guardian', type: 'warrior', subtype: 'fighter', power: 2, health: 8, currentHP: 8, cost: 4, description: 'БОЕЦ. Получает урон вместо союзных воинов в соседних клетках на линии', id: _.uniqueId(), feature: '', img: KnightGuardian, status: 'hand', turn: 1,
  },
];

export default castleDeck;
