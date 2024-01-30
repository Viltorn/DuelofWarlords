import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useOrientation } from '@uidotdev/usehooks';
import { actions as battleActions } from '@slices/battleSlice.js';
import { actions as gameActions } from '@slices/gameSlice.js';
import { actions as deckbuilderActions } from '@slices/deckbuilderSlice.js';
import RotateScreen from '@components/RotateScreen/RotateScreen.jsx';
import WarnWindow from '@components/WarnWindow/WarnWindow.jsx';
import DeckCards from '@components/DeckBuilderComponents/DeckCards/DeckCards.jsx';
import ActiveCard from '@components/CardComponents/ActiveCard/ActiveCard.jsx';
import PrimaryButton from '@components/Buttons/PrimaryButton/PrimaryButton.jsx';
import Cards from '@assets/deckBuilderIcons/CardsIcon.svg';
import Lightning from '@assets/deckBuilderIcons/LightningIcon.svg';
import Sword from '@assets/deckBuilderIcons/SwordIcon.svg';
import ActiveCardInfo from '@components/CardComponents/ActiveCard/ActiveCardInfo.jsx';
import AvailableCardsList from '@components/DeckBuilderComponents/AvailableCards/AvailableCardsList.jsx';
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner.jsx';
import { deckNameValidation } from '../../utils/validation.js';
import countDeckCards from '../../utils/countDeckCards.js';
import makeDeckForDB from '../../utils/makeDeckForDB.js';
import gameCardsData from '../../gameCardsData/index';
import functionContext from '../../contexts/functionsContext.js';
import styles from './DeckBuilder.module.css';
import socket from '../../socket.js';

const DeckBuilder = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orientation = useOrientation();
  const { isOpenInfo } = useContext(functionContext);
  const [error, setError] = useState(false);
  const { playersDecks, name } = useSelector((state) => state.gameReducer);
  const { activeCardPlayer1 } = useSelector((state) => state.battleReducer);
  const {
    chosenDeckName, selectedCards, selectedHero, warnWindow, isChangesMade,
  } = useSelector((state) => state.deckbuilderReducer);
  const chosenDeck = playersDecks.find((deck) => deck.deckName === chosenDeckName);
  const { cardsNmb, spellsNmb, warriorsNmb } = countDeckCards(selectedCards);

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
        console.log(1);
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
        socket.emit('saveDeck', { deck, username }, (res) => {
          if (res.error) {
            handleError(res.error);
            return;
          }
          const { decks } = res;
          dispatch(gameActions.setDecks({ decks }));
          dispatch(deckbuilderActions.setChanges({ changesMade: false }));
          dispatch(deckbuilderActions.setChosenDeck({ chosenDeckName: deckName }));
          dispatch(deckbuilderActions.setWarnWindow({ windowType: 'deckSaved' }));
        });
      } catch (err) {
        setError(err.message);
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
                        <img src={Cards} className={styles.icon} alt="cards" />
                        <p className={styles.quantity}>{cardsNmb}</p>
                      </div>
                      <div className={styles.featBlock}>
                        <img src={Lightning} className={styles.icon} alt="cards" />
                        <p className={styles.quantity}>{spellsNmb}</p>
                      </div>
                      <div className={styles.featBlock}>
                        <img src={Sword} className={styles.icon} alt="cards" />
                        <p className={styles.quantity}>{warriorsNmb}</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.btnBlock}>
                    <PrimaryButton
                      showIcon={false}
                      state="default"
                      text={t('SAVEDECK')}
                      variant="primary"
                      type="submit"
                    />
                    <PrimaryButton
                      onClick={handleBackClick}
                      showIcon={false}
                      state="default"
                      text={t('BACK')}
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
            <div className={styles.activeBlock}>
              {activeCardPlayer1 && (
              <ActiveCard
                activeCard={activeCardPlayer1}
                selectedHero={selectedHero}
                playerType="player1"
              />
              )}
              {isOpenInfo && activeCardPlayer1 && (
              <ActiveCardInfo info={activeCardPlayer1.featInfo} type="build" />
              )}
            </div>
            <div className={styles.deckContainer}>
              {selectedHero && (<DeckCards hero={selectedHero} cards={selectedCards} />)}
            </div>
          </div>
          {warnWindow && (<WarnWindow type={warnWindow} />)}
        </main>
      )}
    </div>
  );
};

export default DeckBuilder;
