import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useStore } from 'react-redux';
import { actions as modalsActions } from '../slices/modalsSlice.js';
import { actions as battleActions } from '../slices/battleSlice.js';
import functionContext from '../contexts/functionsContext.js';

const ActionButton = ({ type, card }) => {
  const { deleteCardfromSource } = useContext(functionContext);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const store = useStore();

  const {
    id, cellId,
  } = card;

  const makeTurn = (direction) => {
    const { fieldCells } = store.getState().battleReducer;
    const cell = fieldCells.find((item) => item.id === cellId);
    const currentCard = cell.content.find((item) => item.id === id);
    const currentTurn = currentCard.turn;
    if (direction === 'turnLeft') {
      if (currentTurn < 2) {
        dispatch(battleActions.turnCardLeft({ cardId: id, cellId }));
      }
    } else if (currentTurn > 0) {
      dispatch(battleActions.turnCardRight({ cardId: id, cellId }));
    }
  };

  const makeClick = (btnType) => {
    switch (btnType) {
      case 'healthBar':
        dispatch(modalsActions.openModal({ type: 'changeStats', id, cellId }));
        break;
      case 'turnLeft':
        makeTurn('turnLeft');
        break;
      case 'turnRight':
        makeTurn('turnRight');
        break;
      case 'return':
        dispatch(battleActions.returnCard({ card }));
        deleteCardfromSource(card);
        dispatch(battleActions.deleteActiveCard());
        break;
      default:
        break;
    }
  };

  const handleButtonClick = () => {
    makeClick(type);
  };

  function handleKeyDown(e) {
    const { key } = e;
    switch (key) {
      case '1':
        makeClick('turnLeft');
        break;
      case '2':
        makeClick('turnRight');
        break;
      case 'q':
        makeClick('healthBar');
        break;
      case 'r':
        makeClick('return');
        break;
      default:
        break;
    }
  }

  return (
    <button
      className="action-button"
      onClick={handleButtonClick}
      type="button"
      onKeyDown={(e) => handleKeyDown(e)}
    >
      <div className="action-button__label">{t(type)}</div>
      {type === 'turnLeft' && (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M16.875 10L3.125 10M3.125 10L8.75 15.625M3.125 10L8.75 4.375" stroke="#FBB270" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {type === 'turnRight' && (
      <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
        <path d="M3.28027 10.5H17.0303M17.0303 10.5L11.4053 4.875M17.0303 10.5L11.4053 16.125" stroke="#FBB270" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      )}
      {type === 'healthBar' && (
      <svg
        className="action-button__icon"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 100.354 100.352"
        xmlSpace="preserve"
      >
        <path
          d="M67.853,16.194c-8.024,0-14.924,4.909-17.852,11.882c-2.93-6.973-9.833-11.882-17.861-11.882
              c-10.673,0-19.357,8.681-19.357,19.352c0,4.118,1.33,8.088,3.88,11.525L48.83,87.243c0.285,0.355,0.715,0.562,1.171,0.562
              c0,0,0.001,0,0.001,0c0.456,0,0.887-0.208,1.171-0.564l32.863-41.184c0.031-0.04,0.062-0.082,0.09-0.125
              c2.023-3.152,3.093-6.744,3.093-10.386C87.22,24.875,78.531,16.194,67.853,16.194z M81.643,44.248L49.999,83.904L19.038,45.24
              c-2.13-2.873-3.256-6.225-3.256-9.694c0-9.017,7.338-16.352,16.357-16.352c9.022,0,16.362,7.335,16.362,16.352
              c0,0.829,0.671,1.5,1.5,1.5s1.5-0.671,1.5-1.5c0-9.017,7.335-16.352,16.352-16.352c9.024,0,16.367,7.335,16.367,16.352
              C84.22,38.589,83.329,41.596,81.643,44.248z"
          stroke="#FBB270"
          strokeWidth="4"
        />
      </svg>
      )}
    </button>
  );
};

export default ActionButton;
