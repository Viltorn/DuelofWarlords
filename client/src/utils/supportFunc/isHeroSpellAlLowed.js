const isHeroSpellAlLowed = (spellCard, heroCard) => {
  if (!heroCard) {
    return true;
  }
  const { turn } = heroCard;
  const { heroSpell } = spellCard;
  if (heroSpell && turn !== 0) return false;
  return true;
};

export default isHeroSpellAlLowed;
