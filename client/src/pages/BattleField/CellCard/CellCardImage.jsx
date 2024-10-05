import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import Healed from '@assets/battlefield/HealingIcon.webp';
import styles from './CellCard.module.css';

const CellCardImage = ({ cardInfo, currentCell }) => {
  const {
    cardsFeature, power, description, currentHP, currentC, cellType, type, img, name,
  } = cardInfo;

  const { t } = useTranslation();

  const titleClasses = cn({
    [styles.cardName]: cellType !== 'hero',
    [styles.heroName]: cellType === 'hero',
  });

  return (
    <>
      <h2 className={titleClasses}>{t(`titles.${cardsFeature}.${description}`)}</h2>
      {type === 'warrior' && (
      <>
        <h3 className={styles.warriorPower}>{power}</h3>
        <h3 className={styles.warriorHealth}>{currentHP}</h3>
      </>
      )}
      {type !== 'hero' && (
      <h3 className={styles.cost}>{currentC}</h3>
      )}
      {type === 'hero' && (
      <h3 className={styles.heroHealth}>{currentHP}</h3>
      )}
      <img
        className={styles.image}
        src={img}
        alt={name}
      />
      {/* {currentCell.animation === 'attacked' && (type === 'warrior' || type === 'hero') && (
      <img
        className={styles.attackIcon}
        src={AttackIcon}
        alt="attack icon"
      />
      )} */}
      {currentCell.animation === 'healed' && (type === 'warrior' || type === 'hero') && (
      <img
        className={styles.healIcon}
        src={Healed}
        alt="heal icon"
      />
      )}
    </>
  );
};

export default CellCardImage;
