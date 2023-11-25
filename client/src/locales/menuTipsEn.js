export const menuTipsHeaders = {
  STARTTURN: 'TURN START',
  STUN: 'STUN',
  INVISIBILITY: 'INVISIBILITY',
  REACTION: 'REACTION',
  EVASION: 'EVASION',
  MASSIVEBLOW: 'MASSIVE BLOW X',
  SHOCKWAVE: 'SHOCK WAVE X',
  MAGICSHIELD: 'MAGIC SHIELD',
  POISONATTACK: 'POISON ATTACK X',
  LASTCAST: 'LAST CAST',
};

export const menuTipsText = {
  STARTTURN: 'This effect applies at the start of card\'s owner turn',
  LASTCAST: 'The effect applies when card with this effect is being sent to the grave',
  STUN: 'Turn warrior in a "stun" state',
  INVISIBILITY: 'Warriors can\'t attack invisible warrior in their turn but can attack other warriors or warlord through this warrior',
  REACTION: 'This effect can only be used as a response to some event in the game. In order to use this effect, this card must be postponed',
  EVASION: 'Warrior absorbs attack from enemy warrior but become stunned and has to move to the next free cell without retaliation (can\'t be used if there are no free cell or he is already stunned)',
  MASSIVEBLOW: 'When warrior attacks on his turn, he makes collateral damage to enemy warriors in the next cells with power of X',
  SHOCKWAVE: 'Instead of his turn, warrior attacks free cell which he can reach and does X damage to the warriors in adjacent cells (does no damage to himself, get no retaliation)',
  MAGICSHIELD: 'Reduces the damage from attacking spells on a warrior with a shield by 50% (reduces 3 damage out of 5)',
  POISONATTACK: 'When warrior attacks on his turn, he attaches X "Poison" spells to the target (spells can be taken from warrior\'s owner grave or deck)',
};
