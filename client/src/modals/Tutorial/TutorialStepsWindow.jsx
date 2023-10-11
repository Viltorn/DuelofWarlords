import React, { useEffect, useContext } from 'react';
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

const TutorialStepsWindow = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { fieldCells, thisPlayer } = useSelector((state) => state.battleReducer);

  const { makeFight, sendCardFromField } = useContext(abilityContext);
  const { deleteCardfromSource, tutorStep, changeTutorStep } = useContext(functionContext);

  const madeCastleDeck = makeDeckForPLayer(castleDeck, 'player1');
  const madeAcademiaDeck = makeDeckForPLayer(academiaDeck, 'player2');

  const heroCells = fieldCells.filter((cell) => cell.type === 'hero');
  const linesAndRows = fieldCells.filter((cell) => cell.type === 'field' && (cell.row === '1' || cell.line === '2'));
  const enemyLine3 = fieldCells.filter((cell) => cell.type === 'field' && cell.line === '3');
  const enemyCells = fieldCells.filter((cell) => cell.type === 'field' && cell.player === 'player2');
  const playersCells = fieldCells.filter((cell) => cell.type === 'field' && cell.player === 'player1');
  const cellsForSpells = fieldCells.filter((cell) => spellsCells.includes(cell.type));

  const shooter = madeCastleDeck.find((el) => el.name === 'Imperial Shooter');
  const knight = madeCastleDeck.find((el) => el.name === 'Warrior Of Light');
  const griffon = { ...madeCastleDeck.find((el) => el.name === 'Imperial Griffon'), currentC: 3 };
  const gargoyle = { ...madeAcademiaDeck.find((el) => el.name === 'Gargoyle'), currentHP: 2 };
  const earthGolem = { ...madeAcademiaDeck.find((el) => el.name === 'Earth golem'), id: 'one' };
  const earthGolem2 = { ...madeAcademiaDeck.find((el) => el.name === 'Earth golem'), id: 'two' };
  const fireGolem = { ...madeAcademiaDeck.find((el) => el.name === 'Fire golem'), currentHP: 4 };
  const mage = { ...madeAcademiaDeck.find((el) => el.name === 'Mage apprentice'), turn: 0 };
  const iceElement = madeAcademiaDeck.find((el) => el.name === 'Ice element');
  const thunderBlast = madeCastleDeck.find((el) => el.name === 'Thunder Blast');
  const hammer = madeCastleDeck.find((el) => el.name === 'Righteous Hammer');
  const holyland = madeCastleDeck.find((el) => el.name === 'Holy Land');
  const lightShield = madeCastleDeck.find((el) => el.name === 'LightShield');
  const lastChance = madeCastleDeck.find((el) => el.name === 'Last Chance');
  const warriorsDeck = [shooter, knight, griffon];
  const spellsDeck = [hammer, holyland, lightShield, thunderBlast, lastChance];
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
        dispatch(battleActions.addFieldContent({ activeCard: knight, id: '2.1' }));
        dispatch(battleActions.addFieldContent({ activeCard: earthGolem, id: '2.3' }));
        dispatch(battleActions.disableCells({ ids: [...fieldCellsIds, 'hero1', 'hero2'] }));
      },
      addGrifAndGarg: () => {
        dispatch(battleActions.addFieldContent({ activeCard: griffon, id: '4.1' }));
        dispatch(battleActions.addFieldContent({ activeCard: gargoyle, id: '3.3' }));
        dispatch(battleActions.activateCells({ ids: ['2.3'] }));
      },
      turnWarrior: () => {
        dispatch(battleActions.turnCardRight({ cardId: knight.id, cellId: '2.1', qty: 1 }));
      },
      turnGriffon: () => {
        dispatch(battleActions.turnCardRight({ cardId: griffon.id, cellId: '4.1', qty: 1 }));
        dispatch(battleActions.activateCells({ ids: ['3.1'] }));
      },
      turnShooter: () => {
        const { id } = fieldCells.find((cell) => cell.content.find((item) => item.name === 'Imperial Shooter'));
        dispatch(battleActions.turnCardRight({ cardId: shooter.id, cellId: id, qty: 1 }));
      },
      turnFighter: () => {
        const { id } = fieldCells.find((cell) => cell.content.find((item) => item.name === 'Warrior Of Light'));
        dispatch(battleActions.turnCardRight({ cardId: knight.id, cellId: id, qty: 1 }));
      },
      turnFlyer: () => {
        const { id } = fieldCells.find((cell) => cell.content.find((item) => item.name === 'Imperial Griffon'));
        dispatch(battleActions.turnCardRight({ cardId: griffon.id, cellId: id, qty: 1 }));
      },
      massTurn: () => dispatch(battleActions.massTurnCards({ player: 'player1' })),
      returnGriffonAndKnight: () => {
        const curKnight = fieldCells
          .find((cell) => cell.content
            .find((item) => item.name === 'Warrior Of Light'))
          .content.find((item) => item.name === 'Warrior Of Light');
        const curGriffon = fieldCells
          .find((cell) => cell.content
            .find((item) => item.name === 'Imperial Griffon'))
          .content.find((item) => item.name === 'Imperial Griffon');
        const curGolem = fieldCells
          .find((cell) => cell.id === '2.3')
          .content.find((item) => item.name === 'Earth golem');
        deleteCardfromSource(curKnight);
        deleteCardfromSource(curGriffon);
        deleteCardfromSource(curGolem);
        dispatch(battleActions.disableCells({ ids: [...fieldCellsIds] }));
      },
      addTwoGolems: () => {
        const { row } = fieldCells.find((cell) => cell.content.find((item) => item.name === 'Warrior Of Light'));
        dispatch(battleActions.addFieldContent({ activeCard: earthGolem, id: `${row}.3` }));
        dispatch(battleActions.addFieldContent({ activeCard: iceElement, id: `${row}.4` }));
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
        dispatch(battleActions.addFieldContent({ activeCard: mage, id: `${row2}.4` }));
        dispatch(battleActions.addFieldContent({ activeCard: earthGolem2, id: `${row}.3` }));
      },
      addFireGolem: () => {
        const { row } = fieldCells.find((cell) => cell.content.find((item) => item.name === 'Imperial Griffon'));
        const { id } = heroCells.find((cell) => cell.id === 'hero1').content[0];
        dispatch(battleActions.addFieldContent({ activeCard: fireGolem, id: `${row}.3` }));
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
        dispatch(battleActions.addFieldContent({ activeCard: earthGolem, id: `${row}.3` }));
        dispatch(battleActions.addFieldContent({ activeCard: iceElement, id: `${row}.4` }));
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
      attackGriffon: () => makeFight({ ...gargoyle, cellId: '3.3', status: 'field' }, { ...griffon, cellId: '3.1' }),
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
        makeFight(curMage, curShooter);
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
        <h2 className={styles.title}>{tutorialStepsData[tutorStep].text}</h2>
        <div className={styles.btnBlock}>
          {tutorialStepsData[tutorStep].back && (<button className={styles.btn} type="button" onClick={() => handleClick(-1)}>{t('BACK')}</button>)}
          {tutorialStepsData[tutorStep].next && (<button className={styles.btn} type="button" onClick={() => handleClick(1)}>{t('CONTINUE')}</button>)}
        </div>
      </div>
    </div>
  );
};

export default TutorialStepsWindow;
