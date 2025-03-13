import { useTranslation } from 'react-i18next';
import ArrowRight from '@assets/ArrowRight.png';
// import Cover from '@assets/battlefield/CoverForLog.png';
import gameCardsData from '../../gameCardsData/index';
import Card from '../../components/CardComponents/Card/Card.jsx';
import styles from './LogItem.module.css';

const getCardInfo = (card) => {
  if (!card || !card?.warCard) return null;
  const { cardName, cardsFeature } = card;
  return { ...gameCardsData[cardsFeature][cardName], status: 'void' };
};

const LogItem = ({ item }) => {
  const { t } = useTranslation();
  const {
    playedCard, aim, round, player,
  } = item;
  const card = getCardInfo(playedCard);
  const warCard = getCardInfo(aim);
  const ability = aim?.ability ?? null;
  const playerType = player === 'player1' ? 'Player1' : 'Player2';

  return (
    <div className={styles.container}>
      {round && (
        <>
          <h2 className={styles.roundItem}>
            {t('Round')}
            {' '}
            {item.round}
            {', '}
            {t(playerType)}
          </h2>
          <hr />
        </>
      )}
      {!round && (
        <div className={styles.cardsItem}>
          <Card
            log
            card={card}
          />
          {/* {card.subtype === 'reaction' && (
            <img className={styles.coverImage} src={Cover} alt="card cover" />
          )} */}
          <img src={ArrowRight} className={styles.arrowImage} alt="arrow right" />
          {aim && warCard && (
            <Card
              log
              card={{ ...warCard, status: 'void' }}
            />
          )}
          {aim && ability && (
            <div className={styles.ability}>
              <h3 className={styles.defaultTitle}>{t(`abilities.${aim.name}`)}</h3>
            </div>
          )}
          {aim && !warCard && !ability && (
            <div className={styles.cellImg}>
              <h3 className={styles.defaultTitle}>{t(`cells.${aim.type}`)}</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LogItem;
