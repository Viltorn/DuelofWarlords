import DeckCover from '@assets/battlefield/CardCover.png';
import styles from './CellCard.module.css';

const CellCardCover = () => (
  <img className={`${styles.coverImage} ${styles.noBorder}`} src={DeckCover} alt="deck cover" />
);

export default CellCardCover;
