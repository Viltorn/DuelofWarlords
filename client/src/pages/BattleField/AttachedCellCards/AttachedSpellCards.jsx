import CardsCounter from '@assets/deckBuilderIcons/CardsCounter.png';
import useClickActions from '../../../hooks/useClickActions';
import CellCardCover from '../CellCard/CellCardCover';
import styles from './AttachedSpellCards.module.css';

const AttachedSpellCards = ({ cell, spellCards }) => {
  const { handleAttachedSpellsClick } = useClickActions();
  const goodSpells = spellCards.filter((card) => card.player === cell.player);
  const badSpells = spellCards.filter((card) => card.player !== cell.player);

  return (
    <button className={styles.fieldCellCard} type="button" onClick={() => handleAttachedSpellsClick(spellCards)}>
      <div className={styles.counterGoodBlock}>
        <img src={CardsCounter} alt="card counter" className={styles.counterImage} />
        <h3 className={styles.cardQtyGood}>{goodSpells.length}</h3>
      </div>

      <div className={styles.counterBadBlock}>
        <img src={CardsCounter} alt="card counter" className={styles.counterImage} />
        <h3 className={styles.cardQtyBad}>{badSpells.length}</h3>
      </div>
      <CellCardCover />
    </button>
  );
};

export default AttachedSpellCards;
