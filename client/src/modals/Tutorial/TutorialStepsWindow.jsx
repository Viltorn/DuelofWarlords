import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions as battleActions } from '../../slices/battleSlice.js';
import styles from './TutorialStepsWindow.module.css';
import castleDeck from '../../gameCardsData/castleDeck.js';
import academiaDeck from '../../gameCardsData/academiaDeck.js';
import { spellsCells } from '../../gameData/heroes&spellsCellsData.js';
import tutorialStepsData from '../../gameData/tutorialStepsData';
import abilityContext from '../../contexts/abilityActions.js';
import functionContext from '../../contexts/functionsContext.js';

const TutorialStepsWindow = () => {
  const dispatch = useDispatch();
  const { fieldCells, thisPlayer } = useSelector((state) => state.battleReducer);

  const { makeFight } = useContext(abilityContext);
  const { deleteCardfromSource, tutorStep, changeTutorStep } = useContext(functionContext);

  const heroCells = fieldCells.filter((cell) => cell.type === 'hero');
  const linesAndRows = fieldCells.filter((cell) => cell.type === 'field' && (cell.row === '1' || cell.line === '2'));
  const enemyLine3 = fieldCells.filter((cell) => cell.type === 'field' && cell.line === '3');
  const enemyCells = fieldCells.filter((cell) => cell.type === 'field' && cell.player === 'player2');
  const cellsForSpells = fieldCells.filter((cell) => spellsCells.includes(cell.type));
  const shooter = { ...castleDeck.find((el) => el.name === 'Imperial Shooter'), player: 'player1' };
  const knight = { ...castleDeck.find((el) => el.name === 'Warrior Of Light'), player: 'player1' };
  const griffon = { ...castleDeck.find((el) => el.name === 'Imperial Griffon'), player: 'player1', currentC: 3 };
  const gargoyle = { ...academiaDeck.find((el) => el.name === 'Gargoyle'), player: 'player2', currentHP: 2 };
  const earthGolem = { ...academiaDeck.find((el) => el.name === 'Earth golem'), player: 'player2' };
  const iceElement = { ...academiaDeck.find((el) => el.name === 'Ice element'), player: 'player2' };
  const thunderBlast = { ...castleDeck.find((el) => el.name === 'Thunder Blast'), player: 'player1' };
  const hammer = { ...castleDeck.find((el) => el.name === 'Righteous Hammer'), player: 'player1' };
  const retribution = { ...castleDeck.find((el) => el.name === 'Retribution'), player: 'player1' };
  const bless = { ...castleDeck.find((el) => el.name === 'Bless'), player: 'player1' };
  const warriorsDeck = [shooter, knight, griffon];
  const spellsDeck = [hammer, thunderBlast, retribution, bless];
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
      disableCells: () => dispatch(battleActions.disableCells({ ids: [...fieldCellsIds] })),
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
        dispatch(battleActions.addFieldContent({ activeCard: earthGolem, id: `${row}.3` }));
        dispatch(battleActions.addFieldContent({ activeCard: iceElement, id: `${row}.4` }));
      },
      activeFlyerCells: () => dispatch(battleActions.activateCells({ ids: ['1.2', '2.2', '3.2', '4.2', '1.1', '2.1', '3.1', '4.1'] })),
      activateEnemyLine3: () => {
        const ids = enemyLine3.map((cell) => cell.id);
        dispatch(battleActions.activateCells({ ids: [...ids] }));
      },
      addWarriorsToDeck: () => dispatch(battleActions.setPlayersDeck({ deck: warriorsDeck, player: 'player1' })),
      addSpellsToDeck: () => dispatch(battleActions.setPlayersDeck({ deck: spellsDeck, player: 'player1' })),
      attackGriffon: () => makeFight({ ...gargoyle, cellId: '3.3', status: 'field' }, { ...griffon, cellId: '3.1' }),
      activateEnemyCells: () => {
        const ids = enemyCells.map((cell) => cell.id);
        console.log(ids);
        dispatch(battleActions.activateCells({ ids: [...ids, 'hero2'] }));
      },
      linesRowsAnimation: () => linesAndRows.forEach((cell) => dispatch(battleActions.addAnimation({ cell, type: 'green' }))),
      spellCellsAnimation: () => cellsForSpells.forEach((cell) => dispatch(battleActions.addAnimation({ cell, type: 'green' }))),
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
          {tutorialStepsData[tutorStep].back && (<button className={styles.btn} type="button" onClick={() => handleClick(-1)}>НАЗАД</button>)}
          {tutorialStepsData[tutorStep].next && (<button className={styles.btn} type="button" onClick={() => handleClick(1)}>ДАЛЬШЕ</button>)}
        </div>
      </div>
    </div>
  );
};

export default TutorialStepsWindow;
