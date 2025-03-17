/* eslint-disable max-len */
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions as modalActions } from '../slices/modalsSlice.js';
import { actions as battleActions } from '../slices/battleSlice.js';
import NalaDeck from '../gameCardsData/tutorialsDeck/NalaDeck.js';
import ZigfridDeck from '../gameCardsData/tutorialsDeck/ZigfridDeck.js';
import ZigfridHero from '../gameCardsData/tutorialsDeck/ZigfridTutorial.js';
import gameCardsData from '../gameCardsData/index.js';
import makeDeckForPlayer, { addPlayerToCard } from '../utils/makeDeckForPlayer.js';
import { spellsCells } from '../gameData/heroes&spellsCellsData.js';
import makeInitialDeck from '../utils/makeInitialDeck.js';
import useBattleActions from './useBattleActions';
import useFunctionsContext from './useFunctionsContext';

const useTutorialActions = () => {
  const dispatch = useDispatch();
  const {
    deleteCardFromSource,
    sendCardFromField,
    makeFeatureCast,
  } = useBattleActions();

  const { makeGameAction } = useFunctionsContext();
  const {
    fieldCells, fieldCards, thisPlayer, currentTutorStep, playerPoints, gameTurn,
  } = useSelector((state) => state.battleReducer);

  const hero2Info = NalaDeck.hero;
  const player1HeroCard = addPlayerToCard({ ...ZigfridHero, disabled: true }, 'player1');
  const player2HeroCard = addPlayerToCard({ ...gameCardsData[hero2Info.faction][hero2Info.name], disabled: true }, 'player2');
  const madeCastleDeck = useMemo(() => makeDeckForPlayer(makeInitialDeck(ZigfridDeck.cards, 'player1'), 'player1'), []);
  const madeAcademiaDeck = useMemo(() => makeDeckForPlayer(makeInitialDeck(NalaDeck.cards, 'player2'), 'player2'), []);
  const drawCardFeat = {
    attach: false, type: 'all', aim: ['warrior'], name: 'drawCard', condition: 'insteadatk', cost: 1, description: 'drawCard', id: 'drawCard',
  };

  const cards = {
    shooter: madeCastleDeck.find((el) => el.name === 'Imperial Shooter'),
    knight: madeCastleDeck.find((el) => el.name === 'Warrior Of Light'),
    griffon: { ...madeCastleDeck.find((el) => el.name === 'Imperial Griffon'), currentC: 3 },
    gargoyle: { ...madeAcademiaDeck.find((el) => el.name === 'Gargoyle'), turn: 0 },
    earthGolem: { ...madeAcademiaDeck.find((el) => el.name === 'Earth golem'), id: 'one', turn: 0 },
    earthGolem2: { ...madeAcademiaDeck.find((el) => el.name === 'Earth golem'), id: 'two' },
    fireGolem: { ...madeAcademiaDeck.find((el) => el.name === 'Fire golem'), currentHP: 4 },
    mage: { ...madeAcademiaDeck.find((el) => el.name === 'Mage apprentice'), turn: 0 },
    iceElement: madeAcademiaDeck.find((el) => el.name === 'Ice element'),
    thunderBlast: madeCastleDeck.find((el) => el.name === 'Thunder Blast'),
    lightning: { ...madeCastleDeck.find((el) => el.name === 'Lightning Strike'), cost: 2, currentC: 2 },
    holyland: madeCastleDeck.find((el) => el.name === 'Holy Land'),
    protection: { ...madeCastleDeck.find((el) => el.name === 'Protection'), cost: 1, currentC: 1 },
    lastChance: madeCastleDeck.find((el) => el.name === 'Last Chance'),
  };

  const linesAndRows = useMemo(() => fieldCells.filter((cell) => cell.type === 'field' && (cell.row === '1' || cell.line === '2')), [fieldCells]);
  const enemyLine3 = useMemo(() => fieldCells.filter((cell) => cell.type === 'field' && cell.line === '3'), [fieldCells]);
  const enemyCells = useMemo(() => fieldCells.filter((cell) => cell.type === 'field' && cell.player === 'player2'), [fieldCells]);
  const playersCells = useMemo(() => fieldCells.filter((cell) => cell.type === 'field' && cell.player === 'player1'), [fieldCells]);
  const cellsForSpells = useMemo(() => fieldCells.filter((cell) => spellsCells.includes(cell.type)), [fieldCells]);

  const warriorsDeck = [cards.shooter, cards.knight, cards.griffon];
  const spellsDeck = [
    cards.lightning,
    cards.holyland,
    cards.protection,
    cards.thunderBlast,
    cards.lastChance,
  ];
  const fieldCellsIds = fieldCells
    .filter((cell) => cell.type === 'field')
    .map((cell) => cell.id);

  const stepFunctions = {
    disableEnemyCells: () => {
      const ids = enemyCells.map((cell) => cell.id);
      dispatch(battleActions.disableCells({ ids: [...ids, 'hero2'] }));
    },

    activeFighterCell: () => {
      const { cellId } = fieldCards.find((card) => card.name === 'Imperial Shooter' && card.status === 'field');
      const row = cellId.split('.')[0];
      const { id } = fieldCells.find((cell) => cell.row === row && cell.line === '1');
      dispatch(battleActions.activateCells({ ids: [id] }));
    },

    activateEnemyLine3: () => {
      const ids = enemyLine3.map((cell) => cell.id);
      dispatch(battleActions.activateCells({ ids: [...ids] }));
    },

    disableCells: () => dispatch(battleActions.disableCells({ ids: [...fieldCellsIds] })),

    step1: () => {
      dispatch(battleActions.changePlayer({ newPlayer: 'player1' }));
      dispatch(battleActions.setHero({ hero: player1HeroCard, player: 'player1' }));
      dispatch(battleActions.setHero({ hero: player2HeroCard, player: 'player2' }));
      dispatch(battleActions.disableCells({ ids: ['hero1'] }));
      dispatch(battleActions.addAnimation({ cellId: 'hero2', type: 'red' }));
    },

    step3: () => fieldCells
      .filter((cell) => (cell.type === 'field' || cell.type === 'hero') && cell.player === 'player1')
      .forEach((cell) => dispatch(battleActions.addAnimation({ cellId: cell.id, type: 'green' }))),

    step4: () => fieldCells
      .filter((cell) => (cell.type === 'field' || cell.type === 'hero') && cell.player === 'player2')
      .forEach((cell) => dispatch(battleActions.addAnimation({ cellId: cell.id, type: 'red' }))),

    step5: () => linesAndRows.forEach((cell) => dispatch(battleActions.addAnimation({ cellId: cell.id, type: 'green' }))),

    step6: () => cellsForSpells.forEach((cell) => dispatch(battleActions.addAnimation({ cellId: cell.id, type: 'green' }))),

    step7: () => {
      dispatch(battleActions.addFieldContent({ card: cards.knight, id: '2.1' }));
      dispatch(battleActions.addFieldContent({ card: cards.earthGolem, id: '2.3' }));
      dispatch(battleActions.disableCells({ ids: [...fieldCellsIds, 'hero1', 'hero2'] }));
    },

    step8: () => dispatch(battleActions.turnCardRight({ cardId: cards.knight.id, qty: 1 })),

    step10: () => {
      dispatch(battleActions.addFieldContent({ card: cards.griffon, id: '4.1' }));
      dispatch(battleActions.addFieldContent({ card: cards.gargoyle, id: '3.3' }));
      dispatch(battleActions.activateCells({ ids: ['2.3'] }));
    },

    step12: () => {
      dispatch(battleActions.turnCardRight({ cardId: cards.griffon.id, qty: 1 }));
      dispatch(battleActions.activateCells({ ids: ['3.1'] }));
    },

    step14: async () => {
      const golem = fieldCards.find((c) => c.name === 'Earth golem' && c.status === 'field');
      const knight = fieldCards.find((c) => c.name === 'Warrior Of Light' && c.status === 'field');
      const gargoyle = fieldCards.find((c) => c.name === 'Gargoyle' && c.status === 'field');
      const griffon = fieldCards.find((c) => c.name === 'Imperial Griffon' && c.status === 'field');
      const data1 = {
        move: 'makeFight',
        room: null,
        card1: gargoyle,
        card2: griffon,
        gameTurn,
        playerPoints,
      };
      const data2 = {
        move: 'makeFight',
        room: null,
        card1: golem,
        card2: knight,
        gameTurn,
        playerPoints,
      };

      makeGameAction(data1, 'tutorial');
      await new Promise((resolve) => {
        setTimeout(() => resolve(), 2500);
      });
      makeGameAction(data2, 'tutorial');
    },

    step15: () => {
      fieldCards
        .filter((card) => card.type === 'warrior' && card.status === 'field')
        .forEach((card) => deleteCardFromSource(card));
      dispatch(battleActions.disableCells({ ids: [...fieldCellsIds] }));
    },

    step16: () => {
      dispatch(battleActions.setPlayersDeck({ deck: warriorsDeck, player: 'player1' }));
      dispatch(battleActions.addAnimation({ cellId: 'counter1', type: 'green' }));
    },

    step17: () => dispatch(battleActions.deleteAnimation()),

    step18: () => dispatch(battleActions.drawCard({ player: thisPlayer })),

    step19: () => dispatch(battleActions.activateCells({ ids: ['1.2', '2.2', '3.2', '4.2'] })),

    step21: () => dispatch(battleActions.disableCells({ ids: [...fieldCellsIds] })),

    step23: () => {
      const ids = enemyCells.map((cell) => cell.id);
      dispatch(battleActions.activateCells({ ids: [...ids, 'hero2'] }));
    },

    step24: () => dispatch(battleActions.activateCells({ ids: ['1.2', '2.2', '3.2', '4.2', '1.1', '2.1', '3.1', '4.1'] })),

    step25: () => {
      const { cellId } = fieldCards.find((card) => card.name === 'Imperial Shooter');
      const row = cellId.split('.')[0];
      const ids = playersCells.map((cell) => cell.id);
      dispatch(battleActions.disableCells({ ids: [...ids] }));
      dispatch(battleActions.addFieldContent({ card: cards.earthGolem2, id: `${row}.3` }));
      dispatch(battleActions.addFieldContent({ card: cards.iceElement, id: `${row}.4` }));
    },

    step26: () => dispatch(battleActions.turnCardRight({ cardId: cards.shooter.id, qty: 1 })),

    step28: () => dispatch(battleActions.turnCardRight({ cardId: cards.knight.id, qty: 1 })),

    step29: () => {
      dispatch(battleActions.turnCardRight({ cardId: cards.griffon.id, qty: 1 }));
      dispatch(battleActions.changeFieldCardDisability({ card: player2HeroCard, disabled: false }));
    },

    step30: () => dispatch(battleActions.setPlayersDeck({ deck: spellsDeck, player: 'player1' })),

    step35: () => {
      dispatch(battleActions.activateCells({ ids: ['hero1'] }));
      dispatch(battleActions.changeFieldCardDisability({ card: player1HeroCard, disabled: false }));
      dispatch(battleActions.addWarriorAttachment({ cellId: 'hero1', feature: drawCardFeat }));
    },

    step36: () => {
      const ids = cellsForSpells.map((cell) => cell.id);
      dispatch(battleActions.disableCells({ ids: [...ids] }));
      dispatch(battleActions.deleteAttachment({ spellId: 'drawCard' }));
    },

    step37: () => {
      const { cellId } = fieldCards.find((card) => card.name === 'Imperial Griffon');
      const row = cellId[0];
      const { id } = cellsForSpells.find((cell) => cell.row === row);
      dispatch(battleActions.activateCells({ ids: [id] }));
    },

    step39: () => {
      const { cellId } = fieldCards.find((card) => card.name === 'Imperial Griffon' && card.status === 'field');
      const row = cellId.split('.')[0];
      const { id } = fieldCards.find((card) => card.cellId === 'hero1');
      dispatch(battleActions.addFieldContent({ card: cards.fireGolem, id: `${row}.3` }));
      dispatch(battleActions.turnCardRight({ cardId: id, qty: 1 }));
    },

    step40: () => {
      const holyLand = fieldCards.find((card) => card.name === 'Holy Land');
      sendCardFromField({
        card: holyLand,
        castFunc: makeFeatureCast,
        destination: 'grave',
        cardCost: null,
        cellsOnField: fieldCells,
      });
    },

    step46: () => {
      const curFireGolem = fieldCards.find((card) => card.name === 'Fire golem' && card.status === 'field');
      deleteCardFromSource(curFireGolem);
    },

    step48: () => {
      const { cellId } = fieldCards.find((card) => card.name === 'Warrior Of Light' && card.status === 'field');
      const row1 = cellId.split('.')[0];
      dispatch(battleActions.addFieldContent({ card: cards.earthGolem2, id: `${row1}.3` }));
    },

    step51: () => {
      const curFireGolem = fieldCards.find((card) => card.name === 'Ice element' && card.status === 'field');
      deleteCardFromSource(curFireGolem);
    },

    step53: () => {
      const { cellId } = fieldCards.find((card) => card.name === 'Warrior Of Light' && card.status === 'field');
      const row1 = cellId.split('.')[0];
      dispatch(battleActions.addFieldContent({ card: cards.mage, id: `${row1}.4` }));
      dispatch(battleActions.activateCells({ ids: ['5'] }));
    },

    step55: () => {
      const curMage = fieldCards.find((card) => card.name === 'Mage apprentice' && card.status === 'field');
      const curShooter = fieldCards.find((card) => card.name === 'Imperial Shooter' && card.status === 'field');
      const data = {
        move: 'makeFight',
        room: null,
        card1: curMage,
        card2: curShooter,
        gameTurn,
        playerPoints,
      };
      makeGameAction(data, 'tutorial');
    },

    step57: () => dispatch(battleActions.massTurnCards({ player: 'player1' })),

    step58: () => dispatch(modalActions.openModal({ type: 'tutorialFinish' })),

  };

  const makeTutorStepChange = (direction) => {
    dispatch(battleActions.deleteAnimation());
    dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
    if (direction === 1) {
      console.log(currentTutorStep + 1);
      dispatch(battleActions.setTutorialStep(currentTutorStep + 1));
    } else if (currentTutorStep > 0) {
      dispatch(battleActions.setTutorialStep(currentTutorStep - 1));
    }
  };

  return { stepFunctions, makeTutorStepChange };
};

export default useTutorialActions;
