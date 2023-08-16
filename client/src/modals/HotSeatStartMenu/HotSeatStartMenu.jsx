import React, { useRef, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import { actions as battleActions } from '../../slices/battleSlice.js';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import { factionsData, heroes, decks } from '../../gameCardsData/factionsData.js';
import { startCardsNumber1, startCardsNumber2 } from '../../gameData/gameLimits.js';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import './HotSeatStartMenu.css';
import MenuSlider from './MenuSlider.jsx';
import makeShaffledDeck from '../../utils/makeShaffledDeck.js';
import createDeckForPLayer from '../../utils/makeDeckForPlayer.js';
import dummyCard from '../../gameCardsData/dummyCard.js';
import functionContext from '../../contexts/functionsContext.js';
import RotateScreen from '../../components/RotateScreen.jsx';

const HotSeatMenu = () => {
  const [factionNumber, setFactionSlide] = useState({ player1: 0, player2: 1 });
  const [heroNumber, setHero] = useState({ player1: 0, player2: 0 });
  const { t } = useTranslation();
  const inputEl = useRef();
  const dispatch = useDispatch();
  const { windowWidth } = useContext(functionContext);

  const player1Faction = factionsData[factionNumber.player1];
  const player2Faction = factionsData[factionNumber.player2];
  const player1Heroes = heroes.filter((hero) => hero.factionId === player1Faction.id);
  const player2Heroes = heroes.filter((hero) => hero.factionId === player2Faction.id);

  const changeFaction = (number, player) => {
    const maxNumber = factionsData.length - 1;
    const newNumber = factionNumber[player] + number;
    if (newNumber < 0) {
      setFactionSlide({ ...factionNumber, [player]: maxNumber });
    } else if (newNumber > maxNumber) {
      setFactionSlide({ ...factionNumber, [player]: 0 });
    } else {
      setFactionSlide({ ...factionNumber, [player]: newNumber });
    }
  };

  const changeHero = (number, player) => {
    const maxNumber = player === 'player1' ? player1Heroes.length - 1 : player2Heroes.length - 1;
    const newNumber = heroNumber[player] + number;
    if (newNumber < 0) {
      setHero({ ...heroNumber, [player]: maxNumber });
    } else if (newNumber > maxNumber) {
      setHero({ ...heroNumber, [player]: 0 });
    } else {
      setHero({ ...heroNumber, [player]: newNumber });
    }
  };

  const handleClose = () => {
    dispatch(modalsActions.closeModal());
  };

  const formik = useFormik({
    initialValues: {
      player1Faction,
      player1Hero: player1Heroes[heroNumber.player1],
      player1Deck: decks[player1Faction.id],
      player2Faction,
      player2Hero: player2Heroes[heroNumber.player2],
      player2Deck: decks[player2Faction.id],
    },
    onSubmit: (values) => {
      try {
        const player1FullDeck = createDeckForPLayer(makeShaffledDeck(values.player1Deck), 'player1');
        const player1Hand = player1FullDeck.slice(0, startCardsNumber1);
        const player1Deck = player1FullDeck.slice(startCardsNumber1);
        const player2FullDeck = createDeckForPLayer(makeShaffledDeck(values.player2Deck), 'player2');
        const player2Hand = [...player2FullDeck.slice(0, startCardsNumber2), dummyCard];
        const player2Deck = player2FullDeck.slice(startCardsNumber2);
        dispatch(battleActions.setHeroes({
          player1Hero: values.player1Hero,
          player2Hero: values.player2Hero,
        }));
        dispatch(battleActions.setPlayersDecks({
          player1Deck,
          player2Deck,
        }));
        dispatch(battleActions.setPlayersHands({
          player1Hand,
          player2Hand,
        }));
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
    <dialog className="modal-slider">
      {windowWidth < 700 ? (
        <RotateScreen />
      ) : (
        <div className="modal-slider__content_dark">
          <form className="modal-slider__hotseat-form" onSubmit={formik.handleSubmit}>
            <fieldset className="modal-slider__fieldset" disabled={formik.isSubmitting}>
              <div className="modal-slider__header-block">
                <h2 className="modal-slider__header_light">{t('ChooseFactions')}</h2>
                <PrimaryButton
                  showIcon={false}
                  state="default"
                  text={t('Start')}
                  variant="primary"
                  type="submit"
                />
                <PrimaryButton
                  onClick={handleClose}
                  showIcon={false}
                  state="default"
                  text={t('Continue')}
                  variant="primary"
                  type="submit"
                />
                <Link to="/choose" className="link">
                  <PrimaryButton
                    showIcon={false}
                    state="default"
                    text={t('Back')}
                    variant="secondary"
                  />
                </Link>
              </div>
              <div className="modal-slider__player-slides">
                <h3 className="modal-slider__player">
                  {t('Player1')}
                </h3>
                <div className="modal-slider__slide-block">
                  <MenuSlider item={player1Faction} player="player1" changeSlide={changeFaction} />
                  <input
                    className="modal-slider__slide-input"
                    id="player1Faction"
                    type="text"
                    ref={inputEl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={player1Faction.id}
                    data-testid="input-body"
                    name="player1Faction"
                  />
                  <label htmlFor="player1Faction" className="visually-hidden">{t('ChangeHP')}</label>
                </div>
                <div className="modal-slider__slide-block">
                  <MenuSlider item={player1Heroes[heroNumber.player1]} player="player1" changeSlide={changeHero} />
                  <input
                    className="modal-slider__slide-input"
                    id="player1Hero"
                    type="text"
                    ref={inputEl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={player1Heroes[heroNumber.player1].name}
                    data-testid="input-body"
                    name="player1Hero"
                  />
                  <label htmlFor="player1Hero" className="visually-hidden">{t('ChangeHP')}</label>
                </div>
              </div>
              <hr className="modal-slider_hr" />
              <div className="modal-slider__player-slides">
                <h3 className="modal-slider__player">
                  {t('Player2')}
                </h3>
                <div className="modal-slider__slide-block">
                  <MenuSlider item={player2Faction} player="player2" changeSlide={changeFaction} />
                  <input
                    className="modal-slider__slide-input"
                    id="player1Faction"
                    type="text"
                    ref={inputEl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={player2Faction.id}
                    data-testid="input-body"
                    name="player1Faction"
                  />
                  <label htmlFor="player1Faction" className="visually-hidden">{t('ChangeHP')}</label>
                </div>
                <div className="modal-slider__slide-block">
                  <MenuSlider item={player2Heroes[heroNumber.player2]} player="player2" changeSlide={changeHero} />
                  <input
                    className="modal-slider__slide-input"
                    id="player1Hero"
                    type="text"
                    ref={inputEl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={player2Heroes[heroNumber.player2].name}
                    data-testid="input-body"
                    name="player1Hero"
                  />
                  <label htmlFor="player1Hero" className="visually-hidden">{t('ChangeHP')}</label>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      )}
    </dialog>
  );
};

export default HotSeatMenu;
