import { useSelector, useDispatch } from 'react-redux';
import CloseBtn from '@assets/CloseBtn.svg';
import CardsCounter from '@assets/deckBuilderIcons/CardsCounter.png';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import ActiveCardInfo from '../../components/CardComponents/ActiveCard/ActiveCardInfo';
import ActionButton from '../../components/Buttons/ActionButton/ActionButton.jsx';
import Card from '../../components/CardComponents/Card/Card.jsx';
import styles from './ActiveCardWindow.module.css';

const ActiveCardWindow = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.modalsReducer);
  const { qty, type } = data;

  const { selectedHero } = useSelector((state) => state.deckbuilderReducer);

  const handleClose = (e) => {
    e.stopPropagation();
    dispatch(modalsActions.closeModal());
  };

  return (
    <dialog className={styles.window}>
      <div className={styles.content}>
        <button className={styles.closeBlock} type="button" onClick={handleClose}>
          <img className={styles.image} src={CloseBtn} alt="close button" />
        </button>
        <div className={styles.cardBlock}>
          <div className={styles.buttonsContainer}>
            <div className={styles.counterBlock}>
              <img src={CardsCounter} alt="card counter" className={styles.counterImage} />
              <h3 className={styles.cardQty}>{qty}</h3>
            </div>

            {((!selectedHero && type === 'hero') || (type !== 'hero')) && (
            <ActionButton card={data} type="addToDeck" name="addToDeck" />
            )}
            {qty !== 0 && selectedHero && (
            <ActionButton card={data} type="deleteFromDeck" name="deleteFromDeck" />
            )}
          </div>
          <button className={styles.cardContainer} type="button" onClickCapture={handleClose}>
            <Card
              builder
              card={data}
              active
              isOpenInfo
            />
            <ActiveCardInfo info={data.featInfo} type="window" />
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ActiveCardWindow;