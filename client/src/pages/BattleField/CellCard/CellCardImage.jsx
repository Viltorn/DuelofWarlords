import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import Shield from '@assets/battlefield/ShieldIcon.png';
import WarShield from '@assets/WarShieldIcon.png';
import styles from './CellCard.module.css';

const CellCardImage = ({
  cardInfo, protection, isInvisible,
}) => {
  const {
    cardsFeature, atkPower, description, currentHP, currentC, type, img, name, defPower,
  } = cardInfo;

  const { t } = useTranslation();

  const titleClasses = cn({
    [styles.cardName]: type !== 'hero',
    [styles.heroName]: type === 'hero',
  });

  return (
    <>
      <h2 className={titleClasses}>{t(`titles.${cardsFeature}.${description}`)}</h2>
      {type === 'warrior' && (
      <>
        <img src={WarShield} className={styles.shieldIcon} alt="shield icon fow health" />
        <h3 className={styles.warriorPower}>{atkPower}</h3>
        <h3 className={styles.warriorDefPower}>{defPower || 0}</h3>
        <h3 className={styles.warriorHealth}>{currentHP}</h3>
      </>
      )}
      {type === 'spell' && (
      <h3 className={styles.cost}>{currentC}</h3>
      )}
      {type === 'hero' && (
      <h3 className={styles.heroHealth}>{currentHP}</h3>
      )}
      <img
        className={cn([styles.image], { [styles.invisible]: isInvisible })}
        src={img}
        alt={name}
      />
      {protection && (
      <img
        className={styles.protectIcon}
        src={Shield}
        alt="shield icon"
      />
      )}
    </>
  );
};

export default CellCardImage;
