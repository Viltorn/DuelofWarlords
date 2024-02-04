import { useDispatch, useStore } from 'react-redux';
import { actions as battleActions } from '../slices/battleSlice.js';
import findTriggerSpells from '../utils/supportFunc/findTriggerSpells.js';

const useBattleActions = () => {
  const dispatch = useDispatch();
  const store = useStore();

  const deleteCardfromSource = (card) => {
    const { player, status, cellId } = card;
    const cardId = card.id;
    if (status === 'hand') {
      dispatch(battleActions.deleteHandCard({ cardId, player }));
    } else {
      dispatch(battleActions.deleteFieldCard({ cardId }));
    }

    if (cellId === 'postponed1' || cellId === 'postponed2') {
      dispatch(battleActions.turnPostponed({ player, status: 'cover' }));
    }
    if (card.type === 'warrior') {
      dispatch(battleActions.deleteAttachment({ spellId: card.id }));
    }
  };

  const changeCardHP = (power, health, card) => {
    dispatch(battleActions.changeHP({
      health: health - power,
      cardId: card.id,
    }));
  };

  const moveAttachedSpells = (cellId, endCellId, type) => {
    const currentFieldCards = store.getState().battleReducer.fieldCards;
    const spellsInCell = currentFieldCards.filter((card) => card.cellId === cellId && card.type === 'spell');
    spellsInCell.forEach((card) => {
      deleteCardfromSource(card);
      if (type === 'kill') {
        dispatch(battleActions.deleteAttachment({ spellId: card.id }));
        dispatch(battleActions.addToGraveyard({ card }));
      } else if (type === 'move') {
        dispatch(battleActions.addFieldContent({ card, id: endCellId }));
      } else if (type === 'return') {
        dispatch(battleActions.deleteAttachment({ spellId: card.id }));
        dispatch(battleActions.returnCard({ card, cost: card.cost }));
      }
    });
  };

  const addActiveCard = (card, player) => {
    dispatch(battleActions.addActiveCard({ card, player }));
  };

  const deleteOtherActiveCard = (card1, card2, thisplayer) => {
    const card1Id = card1 ? card1.id : null;
    const card2Id = card2 ? card2.id : null;
    if (card1Id === card2Id) {
      const anotherPlayer = thisplayer === 'player1' ? 'player2' : 'player1';
      dispatch(battleActions.deleteActiveCard({ player: anotherPlayer }));
    }
  };

  // DELETE IMMIDIATE SPELLS

  const deleteImmediateSpells = () => {
    const currentFieldCards = store.getState().battleReducer.fieldCards;
    currentFieldCards
      .filter((card) => card.type === 'warrior')
      .forEach((card) => {
        const immediate = card.attachments.find((spell) => spell.immediate);
        if (immediate) {
          dispatch(battleActions.deleteAttachment({ spellId: immediate.id }));
        }
      });
  };

  const sendCardFromField = (data) => {
    const {
      card, castFunc, destination, cardCost, cellsOnField,
    } = data;
    const { type, status } = card;
    const cardCell = cellsOnField.find((cell) => cell.id === card.cellId);
    const lastSpells = type === 'warrior' ? findTriggerSpells(card, cardCell, 'lastcall', 'warrior') : findTriggerSpells(card, cardCell, 'lastcall', 'spell');
    if (lastSpells && destination === 'grave' && status === 'field') {
      lastSpells.forEach((spell) => castFunc(spell, cardCell, card, card.player));
    }
    if (type === 'spell') {
      dispatch(battleActions.deleteAttachment({ spellId: card.id }));
    }
    deleteCardfromSource(card);
    if (destination === 'grave') {
      dispatch(battleActions.addToGraveyard({ card }));
    } else {
      const cost = cardCost ?? card.cost;
      dispatch(battleActions.returnCard({ card, cost }));
    }
  };

  const deleteChargedSpellCard = (spell, allFieldCards, allFieldCells, castFunc) => {
    const spellCardOnField = allFieldCards.find((card) => card.id === spell.id);
    if (spellCardOnField) {
      sendCardFromField({
        card: spellCardOnField,
        castFunc,
        destination: 'grave',
        cardCost: null,
        cellsOnField: allFieldCells,
      });
    } else {
      dispatch(battleActions.deleteAttachment({ spellId: spell.id }));
    }
  };

  const drawCards = (actionData) => {
    deleteImmediateSpells();
    const { player, number } = actionData;
    dispatch(battleActions.setCardDrawStatus({ player, status: true }));
    for (let i = 1; i <= number; i += 1) {
      dispatch(battleActions.drawCard({ player }));
    }
  };

  return {
    deleteCardfromSource,
    changeCardHP,
    moveAttachedSpells,
    deleteOtherActiveCard,
    addActiveCard,
    sendCardFromField,
    deleteImmediateSpells,
    deleteChargedSpellCard,
    drawCards,
  };
};

export default useBattleActions;
