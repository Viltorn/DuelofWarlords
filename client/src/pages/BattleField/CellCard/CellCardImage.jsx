import cn from 'classnames';
import { useTranslation } from 'react-i18next';
// import Shield from '@assets/battlefield/ShieldToken.png';
import WarShield from '@assets/WarShieldIcon.png';
import icons from '../../../gameData/animationIcons';
import styles from './CellCard.module.css';

const CellCardImage = ({
  cardInfo, warTokens, isInvisible,
}) => {
  const {
    cardsFeature,
    description,
    currentHP,
    currentC,
    currentP,
    currentDP,
    type,
    img,
    name,
    subtype,
    showQty,
    power,
    defPower,
  } = cardInfo;

  const { t } = useTranslation();

  const titleClasses = cn({
    [styles.cardName]: type !== 'hero',
    [styles.heroName]: type === 'hero',
  });

  const atkClasses = cn({
    [styles.warriorPower]: true,
    [styles.greenColor]: currentP > power,
    [styles.redColor]: currentP < power,
  });

  const atkDefClasses = cn({
    [styles.warriorDefPower]: true,
    [styles.greenColor]: currentDP > defPower,
    [styles.redColor]: currentDP < defPower,
  });

  const tokensBlock = cn({
    [styles.tokensBlock]: true,
    [styles.oneColumn]: warTokens?.length <= 3,
    [styles.twoColumns]: warTokens?.length > 3,
  });

  return (
    <>
      <h2 className={titleClasses}>{t(`titles.${cardsFeature}.${description}`)}</h2>
      {type === 'warrior' && (
      <>
        <img src={WarShield} className={styles.shieldIcon} alt="shield icon for health" />
        <h3 className={atkClasses}>{currentP}</h3>
        <h3 className={atkDefClasses}>{currentDP}</h3>
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
      {subtype === 'attachedSpells' && (
        <h3 className={styles.showQty}>{showQty}</h3>
      )}
      <ul className={tokensBlock}>
        {warTokens && (
          warTokens.map((token) => (
            <div key={token.name} className={styles.tokenInfo}>
              {token.qty > 1 && (
                <p className={styles.showQty}>{token.qty }</p>
              )}
              <img
                className={styles.tokenIcon}
                src={icons[token.name]}
                alt="shield icon"
              />
            </div>
          ))

        )}
      </ul>
    </>
  );
};

export default CellCardImage;
