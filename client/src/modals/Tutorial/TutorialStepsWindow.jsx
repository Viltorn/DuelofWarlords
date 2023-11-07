import React, { useEffect, useContext, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { actions as battleActions } from '../../slices/battleSlice.js';
import { actions as modalActions } from '../../slices/modalsSlice.js';
import styles from './TutorialStepsWindow.module.css';
import castleDeck from '../../gameCardsData/castleDeck.js';
import academiaDeck from '../../gameCardsData/academiaDeck.js';
import { spellsCells } from '../../gameData/heroes&spellsCellsData.js';
import tutorialStepsData from '../../gameData/tutorialStepsData';
import makeDeckForPLayer from '../../utils/makeDeckForPlayer.js';
import abilityContext from '../../contexts/abilityActions.js';
import functionContext from '../../contexts/functionsContext.js';
import makeInitialDeck from '../../utils/makeInitialDeck.js';

const TutorialStepsWindow = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { fieldCells, thisPlayer } = useSelector((state) => state.battleReducer);

  const { makeFight, sendCardFromField } = useContext(abilityContext);
  const { deleteCardfromSource, tutorStep, changeTutorStep } = useContext(functionContext);

  const madeCastleDeck = useMemo(() => makeDeckForPLayer(makeInitialDeck(castleDeck), 'player1'), []);
  const madeAcademiaDeck = useMemo(() => makeDeckForPLayer(makeInitialDeck(academiaDeck), 'player2'), []);

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

  const stepIntent = tutorialStepsData[tutorStep].left ?? 0;

  useEffect(() => {
    const stepFunctions = {
      step1: () => fieldCells
        .filter((cell) => (cell.type === 'field' || cell.type === 'hero') && cell.player === 'player1')
        .forEach((cell) => dispatch(battleActions.addAnimation({ cell, type: 'green' }))),
      heroAnimation: () => heroCells.forEach((cell) => dispatch(battleActions.addAnimation({ cell, type: 'green' }))),
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
      turnWarrior: () => {
        dispatch(battleActions.turnCardRight({ cardId: cards.knight.id, cellId: '2.1', qty: 1 }));
      },
      turnGriffon: () => {
        dispatch(battleActions.turnCardRight({ cardId: cards.griffon.id, cellId: '4.1', qty: 1 }));
        dispatch(battleActions.activateCells({ ids: ['3.1'] }));
      },
      turnShooter: () => {
        const { id } = fieldCells.find((cell) => cell.content.find((item) => item.name === 'Imperial Shooter'));
        dispatch(battleActions.turnCardRight({ cardId: cards.shooter.id, cellId: id, qty: 1 }));
      },
      turnFighter: () => {
        const { id } = fieldCells.find((cell) => cell.content.find((item) => item.name === 'Warrior Of Light'));
        dispatch(battleActions.turnCardRight({ cardId: cards.knight.id, cellId: id, qty: 1 }));
      },
      turnFlyer: () => {
        const { id } = fieldCells.find((cell) => cell.content.find((item) => item.name === 'Imperial Griffon'));
        dispatch(battleActions.turnCardRight({ cardId: cards.griffon.id, cellId: id, qty: 1 }));
      },
      massTurn: () => dispatch(battleActions.massTurnCards({ player: 'player1' })),
      deleteWarriors: () => {
        fieldCells.forEach((cell) => {
          const warrior = cell.content.find((item) => item.type === 'warrior');
          if (warrior) {
            deleteCardfromSource(warrior);
          }
        });
        dispatch(battleActions.disableCells({ ids: [...fieldCellsIds] }));
      },
      addTwoGolems: () => {
        const { row } = fieldCells.find((cell) => cell.content.find((item) => item.name === 'Warrior Of Light'));
        dispatch(battleActions.addFieldContent({ card: cards.earthGolem, id: `${row}.3` }));
        dispatch(battleActions.addFieldContent({ card: cards.iceElement, id: `${row}.4` }));
      },
      removeFireGolem: () => {
        const curFireGolem = fieldCells
          .find((cell) => cell.content
            .find((item) => item.name === 'Fire golem'))
          .content.find((item) => item.name === 'Fire golem');
        deleteCardfromSource(curFireGolem);
      },
      addSecondEarthGolem: () => {
        const { row } = fieldCells.find((cell) => cell.content.find((item) => item.name === 'Warrior Of Light'));
        const row2 = fieldCells.find((cell) => cell.content.find((item) => item.name === 'Imperial Griffon')).row;
        dispatch(battleActions.addFieldContent({ card: cards.mage, id: `${row2}.4` }));
        dispatch(battleActions.addFieldContent({ card: cards.earthGolem2, id: `${row}.3` }));
      },
      addFireGolem: () => {
        const { row } = fieldCells.find((cell) => cell.content.find((item) => item.name === 'Imperial Griffon'));
        const { id } = heroCells.find((cell) => cell.id === 'hero1').content[0];
        dispatch(battleActions.addFieldContent({ card: cards.fireGolem, id: `${row}.3` }));
        dispatch(battleActions.turnCardRight({ cardId: id, cellId: 'hero1', qty: 1 }));
      },
      sendHolyLandToGrave: () => {
        const holyLand = fieldCells
          .find((cell) => cell.content
            .find((item) => item.name === 'Holy Land'))
          .content.find((item) => item.name === 'Holy Land');
        sendCardFromField(holyLand, 'grave');
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
        const { row } = fieldCells.find((cell) => cell.content.find((item) => item.name === 'Imperial Shooter'));
        const { id } = fieldCells.find((cell) => cell.row === row && cell.line === '1');
        dispatch(battleActions.activateCells({ ids: [id] }));
      },
      addGolemsForShoot: () => {
        const { row } = fieldCells.find((cell) => cell.content.find((item) => item.name === 'Imperial Shooter'));
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
      activatePlayersHero: () => dispatch(battleActions.activateCells({ ids: ['hero1'] })),
      addWarriorsToDeck: () => dispatch(battleActions.setPlayersDeck({ deck: warriorsDeck, player: 'player1' })),
      addSpellsToDeck: () => dispatch(battleActions.setPlayersDeck({ deck: spellsDeck, player: 'player1' })),
      attackGriffonAndWarrior: () => {
        makeFight({ card1: { ...cards.gargoyle, cellId: '3.3', status: 'field' }, card2: { ...cards.griffon, cellId: '3.1' } });
        makeFight({
          card1: {
            ...cards.earthGolem, cellId: '2.3', status: 'field', currentHP: 2,
          },
          card2: {
            ...cards.knight, cellId: '2.1', status: 'field', currentHP: 2,
          },
        });
      },
      attackShooter: () => {
        const curMage = fieldCells.reduce((acc, cell) => {
          const mageItem = cell.content.find((item) => item.name === 'Mage apprentice');
          acc = mageItem ?? acc;
          return acc;
        }, {});
        const curShooter = fieldCells.reduce((acc, cell) => {
          const shootItem = cell.content.find((item) => item.name === 'Imperial Shooter');
          acc = shootItem ?? acc;
          return acc;
        }, {});
        makeFight({ card1: curMage, card2: curShooter });
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
        const { row } = fieldCells.find((cell) => cell.content.find((item) => item.name === 'Imperial Griffon'));
        const { id } = cellsForSpells.find((cell) => cell.row === row);
        dispatch(battleActions.activateCells({ ids: [id] }));
      },
      linesRowsAnimation: () => linesAndRows.forEach((cell) => dispatch(battleActions.addAnimation({ cell, type: 'green' }))),
      spellCellsAnimation: () => cellsForSpells.forEach((cell) => dispatch(battleActions.addAnimation({ cell, type: 'green' }))),
      openLastStep: () => dispatch(modalActions.openModal({ type: 'tutorialFinish' })),
    };
    const func = stepFunctions[tutorialStepsData[tutorStep].func];
    if (func) {
      func();
    }
    // eslint-disable-next-line
  }, [tutorStep]);

  return (
    <div className={styles.window} style={{ left: `${2 + stepIntent}rem` }}>
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
