import React, { useEffect, useContext, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { actions as battleActions } from '../../slices/battleSlice.js';
import { actions as modalActions } from '../../slices/modalsSlice.js';
import styles from './TutorialStepsWindow.module.css';
// import castleDeck from '../../gameCardsData/castleFaction.js';
// import academiaDeck from '../../gameCardsData/academiaFaction.js';
import { spellsCells } from '../../gameData/heroes&spellsCellsData.js';
// import { heroes } from '../../gameCardsData/factionsData';
import NalaDeck from '../../gameCardsData/standardDecks/NalaDeck.js';
import ZigfridDeck from '../../gameCardsData/standardDecks/ZigfridDeck.js';
import gameCardsData from '../../gameCardsData/index.js';
import tutorialStepsData from '../../gameData/tutorialStepsData.js';
import makeDeckForPLayer from '../../utils/makeDeckForPlayer.js';
import abilityContext from '../../contexts/abilityActions.js';
import functionContext from '../../contexts/functionsContext.js';
import makeInitialDeck from '../../utils/makeInitialDeck.js';

const TutorialStepsWindow = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { fieldCells, fieldCards, thisPlayer } = useSelector((state) => state.battleReducer);

  const { sendCardFromField, makeGameAction, makeFeatureCast } = useContext(abilityContext);
  const {
    deleteCardfromSource, tutorStep, changeTutorStep,
  } = useContext(functionContext);

  const hero1 = ZigfridDeck.hero;
  const hero2 = NalaDeck.hero;
  const player1HeroData = gameCardsData[hero1.faction][hero1.name];
  const player2HeroData = gameCardsData[hero2.faction][hero2.name];

  const madeCastleDeck = useMemo(() => makeDeckForPLayer(makeInitialDeck(ZigfridDeck.cards), 'player1'), []);
  const madeAcademiaDeck = useMemo(() => makeDeckForPLayer(makeInitialDeck(NalaDeck.cards), 'player2'), []);

  const cards = {
    shooter: madeCastleDeck.find((el) => el.name === 'Imperial Shooter'),
    knight: madeCastleDeck.find((el) => el.name === 'Warrior Of Light'),
    griffon: { ...madeCastleDeck.find((el) => el.name === 'Imperial Griffon'), currentC: 3 },
    gargoyle: { ...madeAcademiaDeck.find((el) => el.name === 'Gargoyle'), currentHP: 2 },
    earthGolem: { ...madeAcademiaDeck.find((el) => el.name === 'Earth golem'), id: 'one', turn: 0 },
    earthGolem2: { ...madeAcademiaDeck.find((el) => el.name === 'Earth golem'), id: 'two' },
    fireGolem: { ...madeAcademiaDeck.find((el) => el.name === 'Fire golem'), currentHP: 4 },
    mage: { ...madeAcademiaDeck.find((el) => el.name === 'Mage apprentice'), turn: 0 },
    iceElement: madeAcademiaDeck.find((el) => el.name === 'Ice element'),
    thunderBlast: madeCastleDeck.find((el) => el.name === 'Thunder Blast'),
    hammer: madeCastleDeck.find((el) => el.name === 'Righteous Hammer'),
    holyland: madeCastleDeck.find((el) => el.name === 'Holy Land'),
    lightShield: madeCastleDeck.find((el) => el.name === 'LightShield'),
    lastChance: madeCastleDeck.find((el) => el.name === 'Last Chance'),
  };

  const heroCells = useMemo(() => fieldCells.filter((cell) => cell.type === 'hero'), [fieldCells]);
  const linesAndRows = useMemo(() => fieldCells.filter((cell) => cell.type === 'field' && (cell.row === '1' || cell.line === '2')), [fieldCells]);
  const enemyLine3 = useMemo(() => fieldCells.filter((cell) => cell.type === 'field' && cell.line === '3'), [fieldCells]);
  const enemyCells = useMemo(() => fieldCells.filter((cell) => cell.type === 'field' && cell.player === 'player2'), [fieldCells]);
  const playersCells = useMemo(() => fieldCells.filter((cell) => cell.type === 'field' && cell.player === 'player1'), [fieldCells]);
  const cellsForSpells = useMemo(() => fieldCells.filter((cell) => spellsCells
    .includes(cell.type)), [fieldCells]);

  const warriorsDeck = [cards.shooter, cards.knight, cards.griffon];
  const spellsDeck = [
    cards.hammer,
    cards.holyland,
    cards.lightShield,
    cards.thunderBlast,
    cards.lastChance,
  ];
  const fieldCellsIds = fieldCells
    .filter((cell) => cell.type === 'field')
    .map((cell) => cell.id);

  const handleClick = (direct) => {
    dispatch(battleActions.deleteAnimation());
    dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
    if (direct === 1) {
      changeTutorStep((prev) => prev + 1);
    } else if (tutorStep > 0) {
      changeTutorStep((prev) => prev - 1);
    }
  };

  const indent = tutorialStepsData[tutorStep].left ?? 0;

  const stepFunctions = {
    tutorialSetUp: () => {
      dispatch(battleActions.changePlayer({ newPlayer: 'player1' }));
      dispatch(battleActions.setHero({ hero: player1HeroData, player: 'player1' }));
      dispatch(battleActions.setHero({ hero: player2HeroData, player: 'player2' }));
    },
    step1: () => fieldCells
      .filter((cell) => (cell.type === 'field' || cell.type === 'hero') && cell.player === 'player1')
      .forEach((cell) => dispatch(battleActions.addAnimation({ cellId: cell.id, type: 'green' }))),
    heroAnimation: () => heroCells.forEach((cell) => dispatch(battleActions.addAnimation({ cellId: cell.id, type: 'green' }))),
    addTwoWarriors: () => {
      dispatch(battleActions.addFieldContent({ card: cards.knight, id: '2.1' }));
      dispatch(battleActions.addFieldContent({ card: cards.earthGolem, id: '2.3' }));
      dispatch(battleActions.disableCells({ ids: [...fieldCellsIds, 'hero1', 'hero2'] }));
    },
    addGrifAndGarg: () => {
      dispatch(battleActions.addFieldContent({ card: cards.griffon, id: '4.1' }));
      dispatch(battleActions.addFieldContent({ card: cards.gargoyle, id: '3.3' }));
      dispatch(battleActions.activateCells({ ids: ['2.3'] }));
    },
    disablePostponed: () => {
      dispatch(battleActions.disableCells({ ids: ['postponed1'] }));
    },
    activatePostponed: () => {
      dispatch(battleActions.activateCells({ ids: ['postponed1'] }));
    },
    turnWarrior: () => {
      dispatch(battleActions.turnCardRight({ cardId: cards.knight.id, qty: 1 }));
    },
    turnGriffon: () => {
      dispatch(battleActions.turnCardRight({ cardId: cards.griffon.id, qty: 1 }));
      dispatch(battleActions.activateCells({ ids: ['3.1'] }));
    },
    turnShooter: () => {
      dispatch(battleActions.turnCardRight({ cardId: cards.shooter.id, qty: 1 }));
    },
    turnFighter: () => {
      dispatch(battleActions.turnCardRight({ cardId: cards.knight.id, qty: 1 }));
    },
    turnFlyer: () => {
      dispatch(battleActions.turnCardRight({ cardId: cards.griffon.id, qty: 1 }));
    },
    massTurn: () => dispatch(battleActions.massTurnCards({ player: 'player1' })),
    deleteWarriors: () => {
      fieldCards
        .filter((card) => card.type === 'warrior' && card.status === 'field')
        .forEach((card) => deleteCardfromSource(card));
      dispatch(battleActions.disableCells({ ids: [...fieldCellsIds] }));
    },
    addTwoGolems: () => {
      const { cellId } = fieldCards.find((card) => card.name === 'Warrior Of Light' && card.status === 'field');
      const row = cellId.split('.')[0];
      dispatch(battleActions.addFieldContent({ card: cards.earthGolem, id: `${row}.3` }));
      dispatch(battleActions.addFieldContent({ card: cards.iceElement, id: `${row}.4` }));
    },
    removeFireGolem: () => {
      const curFireGolem = fieldCards.find((card) => card.name === 'Fire golem' && card.status === 'field');
      deleteCardfromSource(curFireGolem);
    },
    addSecondEarthGolem: () => {
      const { cellId } = fieldCards.find((card) => card.name === 'Warrior Of Light' && card.status === 'field');
      const row1 = cellId.split('.')[0];
      const cellId2 = fieldCards.find((card) => card.name === 'Imperial Griffon' && card.status === 'field').cellId;
      const row2 = cellId2.split('.')[0];
      dispatch(battleActions.addFieldContent({ card: cards.mage, id: `${row2}.4` }));
      dispatch(battleActions.addFieldContent({ card: cards.earthGolem2, id: `${row1}.3` }));
    },
    addFireGolem: () => {
      const { cellId } = fieldCards.find((card) => card.name === 'Imperial Griffon' && card.status === 'field');
      const row = cellId.split('.')[0];
      const { id } = fieldCards.find((card) => card.cellId === 'hero1');
      dispatch(battleActions.addFieldContent({ card: cards.fireGolem, id: `${row}.3` }));
      dispatch(battleActions.turnCardRight({ cardId: id, qty: 1 }));
    },
    sendHolyLandToGrave: () => {
      const holyLand = fieldCards.find((card) => card.name === 'Holy Land');
      sendCardFromField({
        card: holyLand,
        castFunc: makeFeatureCast,
        destination: 'grave',
        cardCost: null,
        cellsOnField: fieldCells,
      });
    },
    disableCells: () => dispatch(battleActions.disableCells({ ids: [...fieldCellsIds] })),
    disableSpellCells: () => {
      const ids = cellsForSpells.map((cell) => cell.id);
      dispatch(battleActions.disableCells({ ids: [...ids] }));
    },
    drawCard: () => dispatch(battleActions.drawCard({ player: thisPlayer })),
    addCommonPoint: () => dispatch(battleActions.addCommonPoint()),
    activeShooterCells: () => dispatch(battleActions.activateCells({ ids: ['1.2', '2.2', '3.2', '4.2'] })),
    activeFighterCell: () => {
      const { cellId } = fieldCards.find((card) => card.name === 'Imperial Shooter' && card.status === 'field');
      const row = cellId.split('.')[0];
      const { id } = fieldCells.find((cell) => cell.row === row && cell.line === '1');
      dispatch(battleActions.activateCells({ ids: [id] }));
    },
    addGolemsForShoot: () => {
      const { cellId } = fieldCards.find((card) => card.name === 'Imperial Shooter');
      const row = cellId.split('.')[0];
      const ids = playersCells.map((cell) => cell.id);
      dispatch(battleActions.disableCells({ ids: [...ids] }));
      dispatch(battleActions.addFieldContent({ card: cards.earthGolem, id: `${row}.3` }));
      dispatch(battleActions.addFieldContent({ card: cards.iceElement, id: `${row}.4` }));
    },
    activeFlyerCells: () => dispatch(battleActions.activateCells({ ids: ['1.2', '2.2', '3.2', '4.2', '1.1', '2.1', '3.1', '4.1'] })),
    activateEnemyLine3: () => {
      const ids = enemyLine3.map((cell) => cell.id);
      dispatch(battleActions.activateCells({ ids: [...ids] }));
    },
    activatePlayersCells: () => {
      const ids = playersCells.map((cell) => cell.id);
      dispatch(battleActions.activateCells({ ids: [...ids] }));
    },
    disablePlayerCells: () => {
      const ids = playersCells.map((cell) => cell.id);
      dispatch(battleActions.disableCells({ ids: [...ids] }));
    },
    activatePlayersHero: () => dispatch(battleActions.activateCells({ ids: ['hero1'] })),
    addWarriorsToDeck: () => dispatch(battleActions.setPlayersDeck({ deck: warriorsDeck, player: 'player1' })),
    addSpellsToDeck: () => dispatch(battleActions.setPlayersDeck({ deck: spellsDeck, player: 'player1' })),
    attackGriffonAndWarrior: () => {
      const data1 = {
        move: 'makeFight',
        room: null,
        card1: { ...cards.gargoyle, cellId: '3.3', status: 'field' },
        card2: { ...cards.griffon, cellId: '3.1' },
      };
      const data2 = {
        move: 'makeFight',
        room: null,
        card1: {
          ...cards.earthGolem, cellId: '2.3', status: 'field', currentHP: 2,
        },
        card2: {
          ...cards.knight, cellId: '2.1', status: 'field', currentHP: 2,
        },
      };

      makeGameAction(data1, 'tutorial');
      makeGameAction(data2, 'tutorial');
    },
    attackShooter: () => {
      const curMage = fieldCards.find((card) => card.name === 'Mage apprentice' && card.status === 'field');
      const curShooter = fieldCards.find((card) => card.name === 'Imperial Shooter' && card.status === 'field');
      const data = {
        move: 'makeFight',
        room: null,
        card1: curMage,
        card2: curShooter,
      };
      makeGameAction(data, 'tutorial');
    },
    activateEnemyCells: () => {
      const ids = enemyCells.map((cell) => cell.id);
      dispatch(battleActions.activateCells({ ids: [...ids, 'hero2'] }));
    },
    disableEnemyCells: () => {
      const ids = enemyCells.map((cell) => cell.id);
      dispatch(battleActions.disableCells({ ids: [...ids, 'hero2'] }));
    },
    activateSpellCellForGriffon: () => {
      const { cellId } = fieldCards.find((card) => card.name === 'Imperial Griffon');
      const row = cellId.split('.')[0];
      const { id } = cellsForSpells.find((cell) => cell.row === row);
      dispatch(battleActions.activateCells({ ids: [id] }));
    },
    linesRowsAnimation: () => linesAndRows.forEach((cell) => dispatch(battleActions.addAnimation({ cellId: cell.id, type: 'green' }))),
    spellCellsAnimation: () => cellsForSpells.forEach((cell) => dispatch(battleActions.addAnimation({ cellId: cell.id, type: 'green' }))),
    openLastStep: () => dispatch(modalActions.openModal({ type: 'tutorialFinish' })),
  };

  useEffect(() => {
    const func = stepFunctions[tutorialStepsData[tutorStep].func];
    if (func) {
      func();
    }
    // eslint-disable-next-line
  }, [tutorStep]);

  return (
    <div className={styles.window} style={{ left: `${indent}rem` }}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t(`tutorialSteps.${tutorialStepsData[tutorStep].step}`)}</h2>
        <div className={styles.btnBlock}>
          {tutorialStepsData[tutorStep].back && (<button className={styles.btn} type="button" onClick={() => handleClick(-1)}>{t('BACK')}</button>)}
          {tutorialStepsData[tutorStep].next && (<button className={styles.btn} type="button" onClick={() => handleClick(1)}>{t('CONTINUE')}</button>)}
        </div>
      </div>
    </div>
  );
};

export default TutorialStepsWindow;
