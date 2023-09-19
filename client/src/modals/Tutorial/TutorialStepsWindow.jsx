import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions as battleActions } from '../../slices/battleSlice.js';
import styles from './TutorialStepsWindow.module.css';
import castleDeck from '../../gameCardsData/castleDeck.js';
import academiaDeck from '../../gameCardsData/academiaDeck.js';
import { spellsCells } from '../../gameData/heroes&spellsCellsData.js';
import tutorialStepsData from '../../gameData/tutorialStepsData';

const TutorialStepsWindow = () => {
  const dispatch = useDispatch();
  const [step, changeStep] = useState(0);
  const { fieldCells } = useSelector((state) => state.battleReducer);

  const heroCells = fieldCells.filter((cell) => cell.type === 'hero');
  const linesAndRows = fieldCells.filter((cell) => cell.type === 'field' && (cell.row === '1' || cell.line === '2'));
  const cellsForSpells = fieldCells.filter((cell) => spellsCells.includes(cell.type));
  const knight = { ...castleDeck.find((el) => el.name === 'Valor Knight'), player: 'player1' };
  const griffon = { ...castleDeck.find((el) => el.name === 'Imperial Griffon'), player: 'player1' };
  const gargoyle = { ...academiaDeck.find((el) => el.name === 'Gargoyle'), player: 'player2' };
  const earthGolem = { ...academiaDeck.find((el) => el.name === 'Earth golem'), player: 'player2' };

  const handleClick = (direct) => {
    dispatch(battleActions.deleteAnimation());
    if (direct === 1) {
      changeStep((prev) => prev + 1);
    } else if (step > 0) {
      changeStep((prev) => prev - 1);
    }
  };

  const stepIntent = tutorialStepsData[step].left ?? 0;

  useEffect(() => {
    const stepFunctions = {
      step1: () => fieldCells
        .filter((cell) => (cell.type === 'field' || cell.type === 'hero') && cell.player === 'player1')
        .forEach((cell) => dispatch(battleActions.addAnimation({ cell, type: 'green' }))),
      heroAnimation: () => heroCells.forEach((cell) => dispatch(battleActions.addAnimation({ cell, type: 'green' }))),
      addTwoWarriors: () => {
        dispatch(battleActions.addFieldContent({ activeCard: knight, id: '2.1' }));
        dispatch(battleActions.addFieldContent({ activeCard: earthGolem, id: '2.3' }));
      },
      addGrifAndGarg: () => {
        dispatch(battleActions.addFieldContent({ activeCard: griffon, id: '4.1' }));
        dispatch(battleActions.addFieldContent({ activeCard: gargoyle, id: '3.3' }));
      },
      turnWarrior: () => {
        dispatch(battleActions.turnCardRight({ cardId: knight.id, cellId: '2.1', qty: 1 }));
      },
      turnGriffon: () => {
        dispatch(battleActions.turnCardRight({ cardId: griffon.id, cellId: '4.1', qty: 1 }));
      },
      linesRowsAnimation: () => linesAndRows.forEach((cell) => dispatch(battleActions.addAnimation({ cell, type: 'green' }))),
      spellCellsAnimation: () => cellsForSpells.forEach((cell) => dispatch(battleActions.addAnimation({ cell, type: 'green' }))),
    };
    const func = stepFunctions[tutorialStepsData[step].func];
    if (func) {
      func();
    }
    // eslint-disable-next-line
  }, [step]);

  return (
    <div className={styles.window} style={{ left: `${2 + stepIntent}rem` }}>
      <div className={styles.container}>
        <h2 className={styles.title}>{tutorialStepsData[step].text}</h2>
        <div className={styles.btnBlock}>
          <button className={styles.btn} type="button" onClick={() => handleClick(-1)}>НАЗАД</button>
          <button className={styles.btn} type="button" onClick={() => handleClick(1)}>ДАЛЬШЕ</button>
        </div>
      </div>
    </div>
  );
};

export default TutorialStepsWindow;
