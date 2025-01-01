import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { NavLink } from 'react-router-dom';
import { actions as battleActions } from '../../slices/battleSlice.js';
import PrimaryButton from '../../components/Buttons/PrimaryButton/PrimaryButton.jsx';
// import { factionsData, heroes, decks } from '../../gameCardsData/factionsData.js';
import cardsData from '../../gameCardsData/index.js';
import { startCardsNumber1, startCardsNumber2, minDeckCards } from '../../gameData/gameLimits.js';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import { actions as gameActions } from '../../slices/gameSlice.js';
import getSetUpData from '../../utils/aiFunctions/getSetUpData.js';
import countDeckCards from '../../utils/countDeckCards.js';
import styles from './HotSeatStartMenu.module.css';
import MenuSlider from '../../components/MenuSlider/MenuSlider.jsx';
import makeInitialDeck from '../../utils/makeInitialDeck.js';
import makeShaffledDeck from '../../utils/makeShaffledDeck.js';
import createDeckForPLayer from '../../utils/makeDeckForPlayer.js';
import dummyCard from '../../gameCardsData/dummyCard.js';

const HotSeatMenu = () => {
  const [deckNumber, setDeckNumber] = useState({ player1: 0, player2: 1 });
  const { t } = useTranslation();
  const inputEl = useRef();
  const dispatch = useDispatch();

  const { playersDecks } = useSelector((state) => state.gameReducer);
  const playableDecks = playersDecks.filter((deck) => {
    const cardsNumb = countDeckCards(deck.cards).cardsNmb;
    return cardsNumb >= minDeckCards;
  });

  const getDeckData = (decks, number) => {
    const playerDeck = decks[number];
    const heroFaction = playerDeck.hero.faction;
    const heroName = playerDeck.hero.name;
    const playerHeroData = cardsData[heroFaction][heroName];
    return { playerDeck, playerHeroData, heroName };
  };

  const player1HeroData = getDeckData(playableDecks, deckNumber.player1).playerHeroData;
  const hero1Name = getDeckData(playableDecks, deckNumber.player1).heroName;
  const player1Deck = getDeckData(playableDecks, deckNumber.player1).playerDeck;
  const player2HeroData = getDeckData(playableDecks, deckNumber.player2).playerHeroData;
  const hero2Name = getDeckData(playableDecks, deckNumber.player2).heroName;
  const player2Deck = getDeckData(playableDecks, deckNumber.player2).playerDeck;

  const handleClose = () => {
    dispatch(modalsActions.closeModal());
  };

  const formik = useFormik({
    initialValues: {
      player1Hero: player1HeroData,
      player1Deck: player1Deck.cards,
      player2Hero: player2HeroData,
      player2Deck: player2Deck.cards,
      player1Type: 'human',
      player2Type: 'human',
      gameMode: 'hotseat',
      gameDifficulty: 1,
    },
    onSubmit: (values) => {
      try {
        const { startPoints, startHeroHP } = getSetUpData(Number(values.gameDifficulty));
        console.log(startPoints, startHeroHP);
        const player1DeckData = makeInitialDeck(values.player1Deck);
        const player1FullDeck = createDeckForPLayer(makeShaffledDeck(player1DeckData), 'player1');
        const player1Hand = player1FullDeck.slice(0, startCardsNumber1);
        const player1FinalDeck = player1FullDeck.slice(startCardsNumber1);
        const player2DeckData = makeInitialDeck(values.player2Deck);
        const player2FullDeck = createDeckForPLayer(makeShaffledDeck(player2DeckData), 'player2');
        const player2Hand = [...player2FullDeck.slice(0, startCardsNumber2), dummyCard];
        const player2FinalDeck = player2FullDeck.slice(startCardsNumber2);
        dispatch(battleActions.setHero({ hero: values.player1Hero, player: 'player1' }));
        dispatch(battleActions.setHero({ hero: values.player2Hero, player: 'player2' }));
        dispatch(battleActions.setPlayerName({ name: 'Тест 1', player: 'player1' }));
        dispatch(battleActions.setPlayerType({ type: 'human', player: 'player1' }));
        dispatch(battleActions.setPlayerName({ name: 'Тест 2', player: 'player2' }));
        dispatch(battleActions.setPlayerType({ type: values.player2Type, player: 'player2' }));
        dispatch(battleActions.setPlayersDeck({ deck: player1FinalDeck, player: 'player1' }));
        dispatch(battleActions.setPlayersDeck({ deck: player2FinalDeck, player: 'player2' }));
        dispatch(battleActions.setPlayersHand({ hand: player1Hand, player: 'player1' }));
        dispatch(battleActions.setPlayersHand({ hand: player2Hand, player: 'player2' }));
        dispatch(battleActions.setPlayerMaxPoints({ maxPoints: 1, player: 'player1' }));
        dispatch(battleActions.setPlayerPoints({ points: 1, player: 'player1' }));
        dispatch(battleActions.setPlayerMaxPoints({ maxPoints: startPoints, player: 'player2' }));
        dispatch(battleActions.setPlayerPoints({ points: startPoints, player: 'player2' }));
        dispatch(battleActions.changeHP({ health: startHeroHP, cardId: values.player2Hero.id }));
        dispatch(gameActions.setGameMode({ gameMode: values.gameMode }));
        dispatch(modalsActions.openModal({ type: 'startFirstRound', player: 'player1' }));
      } catch (err) {
        console.log(err);
        formik.setSubmitting(false);
      }
    },
    validateOnChange: true,
    enableReinitialize: false,
  });

  const changeDeck = (number, player) => {
    const maxNumber = playableDecks.length - 1;
    const newNumber = deckNumber[player] + number;
    if (newNumber < 0) {
      setDeckNumber({ ...deckNumber, [player]: maxNumber });
      formik.values[`${player}Hero`] = getDeckData(playableDecks, maxNumber).playerHeroData;
      formik.values[`${player}Deck`] = getDeckData(playableDecks, maxNumber).playerDeck.cards;
    } else if (newNumber > maxNumber) {
      setDeckNumber({ ...deckNumber, [player]: 0 });
      formik.values[`${player}Hero`] = getDeckData(playableDecks, 0).playerHeroData;
      formik.values[`${player}Deck`] = getDeckData(playableDecks, 0).playerDeck.cards;
    } else {
      setDeckNumber({ ...deckNumber, [player]: newNumber });
      formik.values[`${player}Hero`] = getDeckData(playableDecks, newNumber).playerHeroData;
      formik.values[`${player}Deck`] = getDeckData(playableDecks, newNumber).playerDeck.cards;
    }
  };

  return (
    <dialog className={styles.container}>
      <div className={styles.contentDark}>
        <form className={styles.hotseatForm} onSubmit={formik.handleSubmit}>
          <fieldset className={styles.fieldset} disabled={formik.isSubmitting}>
            <h2 className={styles.headerLight}>{t('modals.ChooseFactions')}</h2>
            <div className={styles.playerTypeBlock}>
              <h2 className={styles.playerTypeHeader}>
                {t('modals.GameType')}
                :
              </h2>
              <div className={styles.selectBlock}>
                <select name="gameMode" aria-label={t('modals.GameType')} className={styles.playerTypeSelect} onChange={formik.handleChange}>
                  <option value="hotseat">{t('modals.HotSeat')}</option>
                  <option value="test">{t('modals.GameTest')}</option>
                </select>
              </div>
            </div>
            <div className={styles.slidesContainer}>
              <div className={styles.playerSlides}>
                <h3 className={styles.player}>
                  {t('Player1')}
                </h3>
                <div className={styles.slideBlock}>
                  <MenuSlider item={player1HeroData} player="player1" changeSlide={changeDeck} />
                  <input
                    className={styles.slideInput}
                    id="player1Hero"
                    type="text"
                    ref={inputEl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={hero1Name}
                    data-testid="input-body"
                    name="player1Hero"
                  />
                  <label htmlFor="player1Hero" className={styles.label}>{player1Deck.deckName}</label>
                </div>

                <div className={styles.playerTypeBlock}>
                  <h2 className={styles.playerTypeHeader}>
                    {t('modals.PlayerType')}
                    :
                  </h2>
                  <p className={styles.playerTypeHuman}>{t('modals.HumanPlayer')}</p>
                </div>

              </div>
              <div className={styles.playerSlides}>
                <h3 className={styles.player}>
                  {t('Player2')}
                </h3>
                <div className={styles.slideBlock}>
                  <MenuSlider item={player2HeroData} player="player2" changeSlide={changeDeck} />
                  <input
                    className={styles.slideInput}
                    id="player2Hero"
                    type="text"
                    ref={inputEl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={hero2Name}
                    data-testid="input-body"
                    name="player2Hero"
                  />
                  <label htmlFor="player2Hero" className={styles.label}>{player2Deck.deckName}</label>
                </div>

                <div className={styles.playerTypeBlock}>
                  <h2 className={styles.playerTypeHeader}>
                    {t('modals.PlayerType')}
                    :
                  </h2>
                  <div className={styles.selectBlock}>
                    <select name="player2Type" aria-label={t('Player2Type')} className={styles.playerTypeSelect} onChange={formik.handleChange}>
                      <option value="human">{t('modals.HumanPlayer')}</option>
                      <option value="computer">{t('modals.ComputerPlayer')}</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>

            {formik.values.player2Type === 'computer' && (
              <div className={styles.difficultyBlock}>
                <h2 className={styles.difficultyHeader}>
                  {t('modals.GameDifficulty')}
                  :
                </h2>
                <div className={styles.selectBlock}>
                  <select name="gameDifficulty" aria-label={t('modals.GameDifficulty')} className={styles.playerTypeSelect} onChange={formik.handleChange}>
                    <option value={1}>{t('difficulty.Easy')}</option>
                    <option value={2}>{t('difficulty.Normal')}</option>
                    <option value={3}>{t('difficulty.Hard')}</option>
                    <option value={4}>{t('difficulty.Impossible')}</option>
                  </select>
                </div>
              </div>
            )}

            <footer className={styles.btnBlock}>
              <PrimaryButton
                showIcon={false}
                state="default"
                text={t('buttons.START')}
                variant="primary"
                type="submit"
              />
              <PrimaryButton
                onClick={handleClose}
                showIcon={false}
                state="default"
                text={t('buttons.CONTINUE')}
                variant="primary"
                type="button"
              />
              <NavLink to="/choose" className={styles.link}>
                <PrimaryButton
                  showIcon={false}
                  onClick={handleClose}
                  state="default"
                  text={t('buttons.BACK')}
                  variant="secondary"
                />
              </NavLink>
            </footer>

          </fieldset>
        </form>
      </div>
    </dialog>
  );
};

export default HotSeatMenu;
