import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import { actions as battleActions } from '../../slices/battleSlice.js';
import PrimaryButton from '../../components/PrimaryButton.jsx';
// import { factionsData, heroes, decks } from '../../gameCardsData/factionsData.js';
import cardsData from '../../gameCardsData/index.js';
import { startCardsNumber1, startCardsNumber2 } from '../../gameData/gameLimits.js';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import styles from './HotSeatStartMenu.module.css';
import MenuSlider from '../MenuSlider.jsx';
import makeInitialDeck from '../../utils/makeInitialDeck.js';
import makeShaffledDeck from '../../utils/makeShaffledDeck.js';
import createDeckForPLayer from '../../utils/makeDeckForPlayer.js';
import dummyCard from '../../gameCardsData/dummyCard.js';

const HotSeatMenu = () => {
  const [deckNumber, setDeckNumber] = useState({ player1: 0, player2: 1 });
  // const [heroNumber, setHero] = useState({ player1: 0, player2: 0 });
  const { t } = useTranslation();
  const inputEl = useRef();
  const dispatch = useDispatch();

  const { playersDecks } = useSelector((state) => state.gameReducer);
  const player1Deck = playersDecks[deckNumber.player1];
  const hero1Faction = player1Deck.hero.faction;
  const hero1Name = player1Deck.hero.name;
  const player2Deck = playersDecks[deckNumber.player2];
  const hero2Faction = player2Deck.hero.faction;
  const hero2Name = player2Deck.hero.name;
  const player1HeroData = cardsData[hero1Faction][hero1Name];
  const player2HeroData = cardsData[hero2Faction][hero2Name];

  const changeDeck = (number, player) => {
    const maxNumber = playersDecks.length - 1;
    const newNumber = deckNumber[player] + number;
    if (newNumber < 0) {
      setDeckNumber({ ...deckNumber, [player]: maxNumber });
    } else if (newNumber > maxNumber) {
      setDeckNumber({ ...deckNumber, [player]: 0 });
    } else {
      setDeckNumber({ ...deckNumber, [player]: newNumber });
    }
  };

  // const changeHero = (number, player) => {
  //   const maxNumber = player === 'player1' ? player1Heroes.length - 1 : player2Heroes.length - 1;
  //   const newNumber = heroNumber[player] + number;
  //   if (newNumber < 0) {
  //     setHero({ ...heroNumber, [player]: maxNumber });
  //   } else if (newNumber > maxNumber) {
  //     setHero({ ...heroNumber, [player]: 0 });
  //   } else {
  //     setHero({ ...heroNumber, [player]: newNumber });
  //   }
  // };

  const handleClose = () => {
    dispatch(modalsActions.closeModal());
  };

  const formik = useFormik({
    initialValues: {
      player1Hero: player1HeroData,
      player1Deck: player1Deck.cards,
      player2Hero: player2HeroData,
      player2Deck: player2Deck.cards,
    },
    onSubmit: (values) => {
      try {
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
        dispatch(battleActions.setPlayerName({ name: 'Тест 2', player: 'player2' }));
        dispatch(battleActions.setPlayersDeck({ deck: player1FinalDeck, player: 'player1' }));
        dispatch(battleActions.setPlayersDeck({ deck: player2FinalDeck, player: 'player2' }));
        dispatch(battleActions.setPlayersHand({ hand: player1Hand, player: 'player1' }));
        dispatch(battleActions.setPlayersHand({ hand: player2Hand, player: 'player2' }));
        dispatch(battleActions.addCommonPoint());
        handleClose();
      } catch (err) {
        console.log(err);
        formik.setSubmitting(false);
      }
    },
    validateOnChange: true,
    enableReinitialize: true,
  });

  return (
    <dialog className={styles.container}>
      <div className={styles.contentDark}>
        <form className={styles.hotseatForm} onSubmit={formik.handleSubmit}>
          <fieldset className={styles.fieldset} disabled={formik.isSubmitting}>
            <h2 className={styles.headerLight}>{t('ChooseFactions')}</h2>
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
              </div>
            </div>
            <footer className={styles.btnBlock}>
              <PrimaryButton
                showIcon={false}
                state="default"
                text={t('START')}
                variant="primary"
                type="submit"
              />
              <PrimaryButton
                onClick={handleClose}
                showIcon={false}
                state="default"
                text={t('CONTINUE')}
                variant="primary"
                type="button"
              />
              <Link to="/choose" className={styles.link}>
                <PrimaryButton
                  showIcon={false}
                  onClick={handleClose}
                  state="default"
                  text={t('BACK')}
                  variant="secondary"
                />
              </Link>
            </footer>
            {/* <hr className={styles.hr} /> */}
            {/* <div className={styles.playerSlides}>
              <h3 className={styles.player}>
                {t('Player2')}
              </h3>
              <div className={styles.slideBlock}>
                <MenuSlider item={player2Faction} player="player2" changeSlide={changeFaction} />
                <input
                  className={styles.slideInput}
                  id="player1Faction"
                  type="text"
                  ref={inputEl}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={player2Faction.id}
                  data-testid="input-body"
                  name="player1Faction"
                />
                <label htmlFor="player1Faction" className={styles.label}>{player2Faction.id}</label>
              </div> */}
            {/* <div className={styles.slideBlock}>
                <MenuSlider item={player2Heroes[heroNumber.player2]} player="player2"
                changeSlide={changeHero} />
                <input
                  className={styles.slideInput}
                  id="player1Hero"
                  type="text"
                  ref={inputEl}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={player2Heroes[heroNumber.player2].name}
                  data-testid="input-body"
                  name="player1Hero"
                />
                <label htmlFor="player1Hero"
                className={styles.label}>{player2Heroes[heroNumber.player2].name}</label>
              </div> */}
          </fieldset>
        </form>
      </div>
    </dialog>
  );
};

export default HotSeatMenu;
