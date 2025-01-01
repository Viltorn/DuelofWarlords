const isEnemyKilled = (heroCard) => heroCard.currentHP <= 0 || !heroCard;

export default isEnemyKilled;
