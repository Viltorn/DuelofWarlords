import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import LoadSpinner from '@components/LoadSpinner/LoadSpinner.jsx';
import { startCardsNumber1, startCardsNumber2, minDeckCards } from '../../gameData/gameLimits.js';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import { actions as battleActions } from '../../slices/battleSlice.js';
import { actions as gameActions } from '../../slices/gameSlice.js';
import { actions as uiActions } from '../../slices/uiSlice.js';
import countDeckCards from '../../utils/countDeckCards.js';
import cardsData from '../../gameCardsData/index.js';
import makeInitialDeck from '../../utils/makeInitialDeck.js';
import PrimaryButton from '../../components/Buttons/PrimaryButton/PrimaryButton.jsx';
import timerOptions from '../../gameData/timerOptions.js';
import socket from '../../socket.js';
import styles from './OnlineGameStart.module.css';
import MenuSlider from '../../components/MenuSlider/MenuSlider.jsx';
import makeShaffledDeck from '../../utils/makeShaffledDeck.js';
import createDeckForPLayer, { addPlayerToCard } from '../../utils/makeDeckForPlayer.js';
import dummyCard from '../../gameCardsData/dummyCard.js';
import { passwordYup } from '../../utils/validation.js';

const TimerOption = ({ value, min }) => (
  <option value={value}>
    {value}
    {' '}
    {min}
  </option>
);

const OnlineGameStart = () => {
  const [deckNumber, setDeckSlide] = useState(0);
  const [error, setError] = useState(false);
  const { t } = useTranslation();
  const inputEl = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    roomId, name, password, data,
  } = useSelector((state) => state.modalsReducer);

  const { playersDecks } = useSelector((state) => state.gameReducer);
  const playableDecks = playersDecks.filter((deck) => {
    const cardsNumb = countDeckCards(deck.cards).cardsNmb;
    return cardsNumb >= minDeckCards;
  });
  const playerDeck = playableDecks[deckNumber];
  const heroFaction = playerDeck.hero.faction;
  const heroName = playerDeck.hero.name;
  const playerHeroData = cardsData[heroFaction][heroName];

  const changeFaction = (number) => {
    const maxNumber = playableDecks.length - 1;
    const newNumber = deckNumber + number;
    if (newNumber < 0) {
      setDeckSlide(maxNumber);
    } else if (newNumber > maxNumber) {
      setDeckSlide(0);
    } else {
      setDeckSlide(newNumber);
    }
  };

  const handleClose = () => {
    dispatch(modalsActions.closeModal());
  };

  const formik = useFormik({
    initialValues: {
      playerHero: playerHeroData,
      playerDeck: playerDeck.cards,
      timer: 3,
      password: '',
    },
    validationSchema: passwordYup,
    enableReinitialize: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        setError(false);
        // await axios.get('https://duelsofwarlords.onrender.com');
        const player = !roomId ? 'player1' : 'player2';
        const startCardsNum = player === 'player1' ? startCardsNumber1 : startCardsNumber2;
        const playerDeckData = makeInitialDeck(values.playerDeck, player);
        const playerFullDeck = createDeckForPLayer(makeShaffledDeck(playerDeckData), player);
        const playerHand = player === 'player1' ? playerFullDeck.slice(0, startCardsNum).map((card) => ({ ...card, status: 'hand' }))
          : [...playerFullDeck.slice(0, startCardsNum), dummyCard].map((card) => ({ ...card, status: 'hand' }));
        const playerFinalDeck = playerFullDeck.slice(startCardsNum);
        if (player === 'player1' && socket.connected) {
          socket.emit('createRoom', {
            deck: playerFinalDeck,
            hand: playerHand,
            hero: values.playerHero,
            password: values.password,
            timer: values.timer,
          }, (res) => {
            console.log(res);
            handleClose();
            dispatch(gameActions.setCurrentRoom({ room: res }));
            dispatch(battleActions.addCommonPoint());
            dispatch(modalsActions.openModal({ type: 'waitForPlayer' }));
            navigate('/battle');
          });
        } else if (socket.connected) {
          socket.emit('joinRoom', {
            room: roomId,
            deck: playerFinalDeck,
            hand: playerHand,
            hero: values.playerHero,
            password: values.password,
          }, (res) => {
            console.log('response:', res);
            if (res.error) {
              setError(res);
              formik.setSubmitting(false);
              return;
            }
            const player1 = res.players[0];
            const player2 = res.players[1];
            const player1Hero = addPlayerToCard(player1.hero, 'player1');
            const player2Hero = addPlayerToCard(player2.hero, 'player2');
            dispatch(battleActions.setHero({ hero: player1Hero, player: 'player1' }));
            dispatch(battleActions.setHero({ hero: player2Hero, player: 'player2' }));
            dispatch(battleActions.setPlayersDeck({ deck: player1.deck, player: 'player1' }));
            dispatch(battleActions.setPlayersDeck({ deck: player2.deck, player: 'player2' }));
            dispatch(battleActions.setPlayersHand({ hand: player1.hand, player: 'player1' }));
            dispatch(battleActions.setPlayersHand({ hand: player2.hand, player: 'player2' }));
            dispatch(battleActions.setPlayerName({ name: player1.username, player: 'player1' }));
            dispatch(battleActions.setPlayerName({ name: player2.username, player: 'player2' }));
            dispatch(battleActions.setThisPlayer({ player: 'player2' }));
            dispatch(gameActions.setCurrentRoom({ room: roomId }));
            dispatch(battleActions.addCommonPoint());
            dispatch(uiActions.setTimer(Number(res.timer)));
            dispatch(uiActions.setCurTime([parseInt(res.timer, 10), parseInt(0, 10)]));
            dispatch(uiActions.setTimerIsPaused(true));
            dispatch(modalsActions.closeModal());
            navigate('/battle');
          });
        }
      } catch (err) {
        setError(err);
        console.log(err.message);
        formik.setSubmitting(false);
      }
    },
  });

  const onChangeInput = (e) => {
    formik.handleChange(e);
    setError(false);
  };

  return (
    <dialog className={styles.container}>
      {formik.isSubmitting ? (
        <LoadSpinner />
      ) : (
        <div className={styles.contentDark}>
          <form className={styles.formBlock} onSubmit={formik.handleSubmit}>
            <h2 className={styles.headerLight}>{t('modals.ChooseDeck')}</h2>
            <fieldset className={styles.fieldset} disabled={formik.isSubmitting}>
              <div className={styles.playerSlides}>
                <div className={styles.slideBlock}>
                  <MenuSlider item={playerHeroData} player="player1" changeSlide={changeFaction} />
                  <input
                    className={styles.slideInput}
                    id="playerHero"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={heroName}
                    name="playerHero"
                  />
                  <label htmlFor="player1Faction" className={styles.label}>{playerDeck.deckName}</label>
                  {/* <p className={styles.description}>
                {t(`description.${heroFaction}.factionInfo`)}</p> */}
                  <p className={styles.description}>{t(`description.${heroFaction}.${heroName}`)}</p>
                </div>
              </div>
              <div className={styles.inputBlock}>
                <div className={styles.timerBlock}>
                  <p className={styles.smallTitle}>
                    {t('Timer')}
                    :
                  </p>
                  {!roomId ? (
                    <select className={styles.timerSelect} name="timer" defaultValue={3} aria-label={t('modals.GameType')} onChange={formik.handleChange}>
                      {timerOptions.map((option) => (
                        <TimerOption value={option} key={option} min={t('misc.Min')} />
                      ))}
                    </select>
                  ) : (
                    <p className={styles.smallTitle}>
                      {data}
                      {t('misc.Min')}
                    </p>
                  )}
                </div>
                {roomId && password === '' ? (
                  null
                ) : (
                  <input
                    className={styles.input}
                    id="password"
                    type="text"
                    ref={inputEl}
                    onChange={onChangeInput}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    placeholder={t('Password')}
                    data-testid="input-body"
                    name="password"
                  />
                )}
                {formik.errors.password ? (
                  <div className={styles.invalidFeedback}>{t(`errors.${formik.errors.password}`)}</div>
                ) : null}
                {error && (<div className={styles.invalidFeedback}>{t(`errors.${error.message}`)}</div>)}
                <div className={styles.lowerBlock}>
                  {name && (
                  <p className={styles.smallTitle}>
                    {t('RoomsOwner')}
                    {name}
                  </p>
                  )}
                  <div className={styles.btnBlock}>
                    {!roomId ? (
                      <PrimaryButton
                        showIcon={false}
                        state="default"
                        text={t('buttons.CREATE')}
                        variant="primary"
                        type="submit"
                      />
                    ) : (
                      <PrimaryButton
                        showIcon={false}
                        state="default"
                        text={t('buttons.JOIN')}
                        variant="primary"
                        type="submit"
                      />
                    )}
                    <PrimaryButton
                      onClick={handleClose}
                      showIcon={false}
                      state="default"
                      text={t('buttons.CLOSE')}
                      variant="secondary"
                    />
                  </div>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      )}
    </dialog>
  );
};

export default OnlineGameStart;
