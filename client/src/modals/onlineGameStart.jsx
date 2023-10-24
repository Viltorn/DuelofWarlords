import React, { useRef, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { factionsData, heroes, decks } from '../gameCardsData/factionsData.js';
import { startCardsNumber1, startCardsNumber2 } from '../gameData/gameLimits.js';
import { actions as modalsActions } from '../slices/modalsSlice.js';
import { actions as battleActions } from '../slices/battleSlice.js';
import { actions as gameActions } from '../slices/gameSlice';
import PrimaryButton from '../components/PrimaryButton.jsx';
import socket from '../socket';
import styles from './onlineGameStart.module.css';
import MenuSlider from './MenuSlider.jsx';
import makeShaffledDeck from '../utils/makeShaffledDeck.js';
import createDeckForPLayer from '../utils/makeDeckForPlayer.js';
import dummyCard from '../gameCardsData/dummyCard.js';
import functionContext from '../contexts/functionsContext.js';
import RotateScreen from '../components/RotateScreen.jsx';

const OnlineGameStart = () => {
  const [factionNumber, setFactionSlide] = useState(0);
  const [heroNumber, setHero] = useState(0);
  const [error, setError] = useState(false);
  const { t } = useTranslation();
  const inputEl = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { windowWidth } = useContext(functionContext);

  const { roomId, name } = useSelector((state) => state.modalsReducer);

  const playerFaction = factionsData[factionNumber];
  const playerHeroes = heroes.filter((hero) => hero.factionId === playerFaction.id);

  const changeFaction = (number) => {
    const maxNumber = factionsData.length - 1;
    const newNumber = factionNumber + number;
    if (newNumber < 0) {
      setFactionSlide(maxNumber);
    } else if (newNumber > maxNumber) {
      setFactionSlide(0);
    } else {
      setFactionSlide(newNumber);
    }
  };

  const changeHero = (number) => {
    const maxNumber = playerHeroes.length - 1;
    const newNumber = heroNumber + number;
    if (newNumber < 0) {
      setHero(maxNumber);
    } else if (newNumber > maxNumber) {
      setHero(0);
    } else {
      setHero(newNumber);
    }
  };

  const handleClose = () => {
    dispatch(modalsActions.closeModal());
  };

  const formik = useFormik({
    initialValues: {
      playerFaction,
      playerHero: playerHeroes[heroNumber],
      playerDeck: decks[playerFaction.id],
    },
    onSubmit: (values) => {
      try {
        const player = !roomId ? 'player1' : 'player2';
        const startCardsNum = player === 'player1' ? startCardsNumber1 : startCardsNumber2;
        const playerFullDeck = createDeckForPLayer(makeShaffledDeck(values.playerDeck), player);
        const playerHand = player === 'player1' ? playerFullDeck.slice(0, startCardsNum) : [...playerFullDeck.slice(0, startCardsNum), dummyCard];
        const playerDeck = playerFullDeck.slice(startCardsNum);
        if (player === 'player1') {
          socket.emit('createRoom', { deck: playerDeck, hand: playerHand, hero: values.playerHero }, (res) => {
            console.log(res);
            handleClose();
            dispatch(gameActions.setCurrentRoom({ room: res }));
            dispatch(battleActions.addCommonPoint());
            navigate('/battle');
          });
        } else {
          socket.emit('joinRoom', {
            room: roomId, deck: playerDeck, hand: playerHand, hero: values.playerHero,
          }, (res) => {
            console.log('response:', res);
            if (res.error) {
              setError(res);
              formik.setSubmitting(false);
              return;
            }
            const player1 = res.players[0];
            const player2 = res.players[1];
            dispatch(battleActions.setHero({ hero: player1.hero, player: 'player1' }));
            dispatch(battleActions.setHero({ hero: player2.hero, player: 'player2' }));
            dispatch(battleActions.setPlayersDeck({ deck: player1.deck, player: 'player1' }));
            dispatch(battleActions.setPlayersDeck({ deck: player2.deck, player: 'player2' }));
            dispatch(battleActions.setPlayersHand({ hand: player1.hand, player: 'player1' }));
            dispatch(battleActions.setPlayersHand({ hand: player2.hand, player: 'player2' }));
            dispatch(battleActions.setPlayerName({ name: player1.username, player: 'player1' }));
            dispatch(battleActions.setPlayerName({ name: player2.username, player: 'player2' }));
            dispatch(battleActions.setThisPlayer({ player: 'player2' }));
            dispatch(gameActions.setCurrentRoom({ room: roomId }));
            dispatch(battleActions.addCommonPoint());
            handleClose();
            navigate('/battle');
          });
        }
      } catch (err) {
        console.log(err.message);
        formik.setSubmitting(false);
      }
    },
    validateOnChange: true,
    enableReinitialize: true,
  });

  return (
    <dialog className={styles.container}>
      {windowWidth < 700 ? (
        <RotateScreen />
      ) : (
        <div className={styles.contentDark}>
          <form className={styles.hotseatForm} onSubmit={formik.handleSubmit}>
            <fieldset className={styles.fieldset} disabled={formik.isSubmitting}>
              <h2 className={styles.headerLight}>{t('ChooseFactions')}</h2>
              <div className={styles.playerSlides}>
                <div className={styles.slideBlock}>
                  <MenuSlider item={playerFaction} player="player1" changeSlide={changeFaction} />
                  <input
                    className={styles.slideInput}
                    id="player1Faction"
                    type="text"
                    ref={inputEl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={playerFaction.id}
                    data-testid="input-body"
                    name="player1Faction"
                  />
                  <label htmlFor="player1Faction" className={styles.label}>{playerFaction.id}</label>
                </div>
                <div className={styles.slideBlock}>
                  <MenuSlider item={playerHeroes[heroNumber]} player="player1" changeSlide={changeHero} />
                  <input
                    className={styles.slideInput}
                    id="player1Hero"
                    type="text"
                    ref={inputEl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={playerHeroes[heroNumber].name}
                    data-testid="input-body"
                    name="player1Hero"
                  />
                  <label htmlFor="player1Hero" className={styles.label}>{playerHeroes[heroNumber].name}</label>
                </div>
              </div>
              {error && (<div className={styles.invalidFeedback}>{t(`errors.${error.message}`)}</div>)}
              {name && (
                <p className={styles.roomsOwner}>
                  {t('RoomsOwner')}
                  {name}
                </p>
              )}
              <div className={styles.btnBlock}>
                {!roomId ? (
                  <PrimaryButton
                    showIcon={false}
                    state="default"
                    text={t('CREATE')}
                    variant="primary"
                    type="submit"
                  />
                ) : (
                  <PrimaryButton
                    showIcon={false}
                    state="default"
                    text={t('JOIN')}
                    variant="primary"
                    type="submit"
                  />
                )}
                <PrimaryButton
                  onClick={handleClose}
                  showIcon={false}
                  state="default"
                  text={t('CLOSE')}
                  variant="secondary"
                />
              </div>
            </fieldset>
          </form>
        </div>
      )}
    </dialog>
  );
};

export default OnlineGameStart;
