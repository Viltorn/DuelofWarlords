import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useOrientation } from '@uidotdev/usehooks';
import { actions as battleActions } from '@slices/battleSlice.js';
import { actions as gameActions } from '@slices/gameSlice.js';
import { actions as deckbuilderActions } from '@slices/deckbuilderSlice.js';
import axios from 'axios';
import RotateScreen from '@components/RotateScreen/RotateScreen.jsx';
import WarnWindow from '@components/WarnWindow/WarnWindow.jsx';
import PrimaryButton from '@components/Buttons/PrimaryButton/PrimaryButton.jsx';
import Cards from '@assets/deckBuilderIcons/CardsIcon.png';
import Lightning from '@assets/deckBuilderIcons/LightningIcon.png';
import Sword from '@assets/deckBuilderIcons/SwordIcon.png';
import DollarSign from '@assets/deckBuilderIcons/DollarSign.png';
import DeckCards from './DeckCards/DeckCards.jsx';
import AvailableCardsList from './AvailableCards/AvailableCardsList.jsx';
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner.jsx';
import { deckNameValidation } from '../../utils/validation.js';
import getModal from '../../modals/index.js';
import countDeckCards from '../../utils/countDeckCards.js';
import makeDeckForDB from '../../utils/makeDeckForDB.js';
import gameCardsData from '../../gameCardsData/index';
import styles from './DeckBuilder.module.css';
import routes from '../../api/routes.js';
import isDeckExist from '../../utils/isDeckExist.js';
import sortCards from '../../utils/sortCards.js';

const DeckBuilder = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orientation = useOrientation();
  const [error, setError] = useState(false);
  const { playersDecks, name } = useSelector((state) => state.gameReducer);
  const { activeCardPlayer1 } = useSelector((state) => state.battleReducer);
  const {
    chosenDeckName, selectedCards, selectedHero, warnWindow, isChangesMade,
  } = useSelector((state) => state.deckbuilderReducer);
  const { isOpened, type } = useSelector((state) => state.modalsReducer);
  const sortedCards = sortCards(selectedCards);
  const chosenDeck = playersDecks.find((deck) => deck.deckName === chosenDeckName);
  const {
    cardsNmb, spellsNmb, warriorsNmb, avarageCardCost,
  } = countDeckCards(selectedCards);

  const renderModal = (status, option) => {
    if (!status) {
      return null;
    }
    const Modal = getModal(option);
    return <Modal />;
  };

  const handleBackClick = () => {
    if (isChangesMade) {
      dispatch(deckbuilderActions.setWarnWindow({ windowType: 'changesMade' }));
    } else {
      dispatch(deckbuilderActions.selectHero({ selectedHero: null }));
      dispatch(deckbuilderActions.selectCards({ selectedCards: [] }));
      dispatch(deckbuilderActions.setChosenDeck({ chosenDeck: null }));
      dispatch(battleActions.deleteActiveCard({ player: 'player1' }));
      navigate('/choosedeck');
    }
  };

  useEffect(() => {
    if (chosenDeck) {
      const { hero, cards } = chosenDeck;
      const { faction } = hero;
      const heroData = { ...gameCardsData[faction][hero.name], player: 'player1', qty: 1 };
      const cardsData = cards.map((card) => {
        const cardsFeature = card.faction ?? card.school;
        return { ...gameCardsData[cardsFeature][card.name], player: 'player1', qty: card.qty };
      });
      dispatch(deckbuilderActions.selectHero({ selectedHero: heroData }));
      dispatch(deckbuilderActions.selectCards({ selectedCards: cardsData }));
    }
  }, [chosenDeck, dispatch]);

  const handleError = (err) => {
    setError(err.message);
    setTimeout(() => setError(false), 2000);
  };

  const formik = useFormik({
    initialValues: {
      deckName: chosenDeckName,
    },
    validationSchema: deckNameValidation,
    onSubmit: async ({ deckName }) => {
      try {
        setError(false);
        if (!selectedHero) {
          handleError({ message: 'meetDeckRequirments' });
          return;
        }
        const hero = {
          name: selectedHero.description, type: 'hero', qty: 1, faction: selectedHero.faction,
        };
        const cards = makeDeckForDB(selectedCards);
        const deck = { deckName, hero, cards };
        const username = name;
        let newDecks;
        if (isDeckExist(deck, playersDecks)) {
          newDecks = [...playersDecks];
          const idx = newDecks.findIndex((item) => item.deckName === deck.deckName);
          newDecks[idx] = deck;
        }
        if (!isDeckExist(deck, playersDecks)) {
          newDecks = [deck, ...playersDecks];
        }
        const res = await axios.patch(routes.getURL('accounts'), { username, decks: newDecks });
        if (res.status === 200) {
          dispatch(gameActions.setDecks({ decks: res.data.decks }));
          dispatch(deckbuilderActions.setChanges({ changesMade: false }));
          dispatch(deckbuilderActions.setChosenDeck({ chosenDeckName: deckName }));
          dispatch(deckbuilderActions.setWarnWindow({ windowType: 'deckSaved' }));
        }
      } catch (err) {
        handleError(err);
        console.log(err);
        formik.setSubmitting(false);
      }
    },
    validateOnChange: true,
  });

  const makeInputChange = (e) => {
    formik.handleChange(e);
    dispatch(deckbuilderActions.setChanges({ changesMade: true }));
  };

  return (
    <div className={styles.container}>
      {orientation.type === 'portrait-primary' && (
        <RotateScreen />
      )}
      {formik.isSubmitting ? (
        <LoadSpinner />
      ) : (
        <main className={styles.main}>
          <div className={styles.leftBlock}>
            <div className={styles.headerBlock}>
              <h2 className={styles.title}>{t('DeckBuilder')}</h2>
              <form className={styles.form} onSubmit={formik.handleSubmit}>
                <fieldset className={styles.fieldset} disabled={formik.isSubmitting}>
                  <div className={styles.deckInfoBlock}>
                    <div className={styles.inputBlock}>
                      <input
                        className={styles.input}
                        id="deckName"
                        type="text"
                        required
                        onChange={(e) => makeInputChange(e)}
                        onBlur={formik.handleBlur}
                        value={formik.values.deckName}
                        placeholder={t('DeckName')}
                        data-testid="input-body"
                        name="deckName"
                      />
                      {formik.errors.deckName && formik.touched ? (
                        <div className={styles.invalidFeedback}>{t(`errors.${formik.errors.deckName}`)}</div>
                      ) : null}
                      {error && (<div className={styles.invalidFeedback}>{t(`errors.${error}`)}</div>)}
                      <label htmlFor="deckName" className="visually-hidden">{t('DeckName')}</label>
                    </div>
                    <div className={styles.deckInfoBlock}>
                      <div className={styles.featBlock}>
                        <img src={Cards} className={styles.icon} alt="all cards" />
                        <p className={styles.quantity}>{cardsNmb}</p>
                      </div>
                      <div className={styles.featBlock}>
                        <img src={Lightning} className={styles.icon} alt="spell cards" />
                        <p className={styles.quantity}>{spellsNmb}</p>
                      </div>
                      <div className={styles.featBlock}>
                        <img src={Sword} className={styles.icon} alt="warrior cards" />
                        <p className={styles.quantity}>{warriorsNmb}</p>
                      </div>
                      <div className={styles.featBlock}>
                        <img src={DollarSign} className={styles.icon} alt="avarage card cost" />
                        <p className={styles.quantity}>{avarageCardCost}</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.btnBlock}>
                    <PrimaryButton
                      showIcon={false}
                      state="default"
                      text={t('buttons.SAVEDECK')}
                      variant="primary"
                      type="submit"
                    />
                    <PrimaryButton
                      onClick={handleBackClick}
                      showIcon={false}
                      state="default"
                      text={t('buttons.BACK')}
                      variant="secondary"
                    />
                  </div>
                </fieldset>
              </form>
            </div>
            <AvailableCardsList
              hero={selectedHero}
              cards={selectedCards}
              activeCard={activeCardPlayer1}
            />
          </div>
          <div className={styles.rightBlock}>
            <div className={styles.deckContainer}>
              {selectedHero && (<DeckCards hero={selectedHero} cards={sortedCards} />)}
            </div>
          </div>
          {warnWindow && (<WarnWindow type={warnWindow} />)}
          {renderModal(isOpened, type)}
        </main>
      )}
    </div>
  );
};

export default DeckBuilder;
