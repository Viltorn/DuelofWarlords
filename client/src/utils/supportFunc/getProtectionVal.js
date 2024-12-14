const getProtectSpellVal = (attackingPower, protection, health) => {
  const { type, val } = protection.value;
  if (type === 'number') {
    return val;
  }
  if (type === 'percent') {
    const calculatedVal = Math.ceil(attackingPower * val);
    return calculatedVal === attackingPower ? attackingPower - 1 : calculatedVal;
  }
  if (type === 'immortal') {
    return 1 + attackingPower - health;
  }
  return 0;
};

export default (protSpells, attackingPower, targetHealth) => protSpells.reduce((value, spell) => {
  value += getProtectSpellVal(attackingPower, spell, targetHealth);
  return value;
}, 0);
