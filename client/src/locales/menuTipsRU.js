export const menuTipsHeaders = {
  STARTTURN: 'СТАРТ ХОДА',
  STUN: 'ОГЛУШЕНИЕ',
  INVISIBILITY: 'НЕВИДИМОСТЬ',
  REACTION: 'РЕАКЦИЯ',
  EVADE: 'УКЛОНЕНИЕ',
  MASSIVEBLOW: 'МАССОВЫЙ УДАР Х',
  SHOCKWAVE: 'УДАРНАЯ ВОЛНА Х',
  MAGICSHIELD: 'МАГИЧЕСКИЙ ЩИТ',
  POISONATTACK: 'ЯДОВИТАЯ АТАКА Х',
};

export const menuTipsText = {
  STARTTURN: 'Этот эффект применяется во время старта хода владельца карты. Временные заклинания отправлются в сток после применения этого эффекта',
  STUN: 'Поворачивает ВОИНА в состояние оглушения',
  INVISIBILITY: 'Вражеские воины не могут атаковать этого воина в свой ход базовой атакой, но могут атаковать героя или других воинов сквозь этого воина',
  REACTION: 'Эта способность применяется во время хода врага в ответ на какое-то событие, для этого карта со способностью должна быть отложенной',
  EVADE: 'Воин поглощает первый урон от базовой атаки по нему во время хода оппонента, но должен оглушиться и передвинуться на соседнюю клетку на линии не нанося ответный удар (не сработает, если оглушен или не может передвинуться)',
  MASSIVEBLOW: 'При атаке в свой ход по воину, дополнительно отнимает Х здоровья у воинов в соседних клетках на линии рядом с целью',
  SHOCKWAVE: 'Вместо базовой атаки, может атаковать пустую клетку до которой достает, при этом отнимает Х здоровья у прилегающих к этой клетке вражеских воинов (не атакует себя, безответная атака)',
  MAGICSHIELD: 'Снижает урон от атакующих заклинаний по воину с щитом на 50% (снизит 3 урона из 5-ти)',
  POISONATTACK: 'При базовой атаке в свой ход по воину, накладывает Х заклинаний Яд на атакуемого воина (можно взять его из стока или кладбища, если нет в руке)',
};