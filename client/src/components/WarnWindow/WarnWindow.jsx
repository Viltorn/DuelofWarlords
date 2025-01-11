import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { actions as deckbuilderActions } from '../../slices/deckbuilderSlice.js';
import { actions as battleActions } from '../../slices/battleSlice.js';
import { actions as gameActions } from '../../slices/gameSlice.js';
import routes from '../../api/routes.js';
import PrimaryButton from '../Buttons/PrimaryButton/PrimaryButton.jsx';
import styles from './WarnWindow.module.css';

const WarnWindow = ({
  name, type, user,
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState(false);
  const [isPending, setPending] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { playersDecks } = useSelector((state) => state.gameReducer);

  const handleClick = async () => {
    try {
      if (type === 'deleteDeck') {
        setPending(true);
        const newDecks = playersDecks.filter((deck) => deck.deckName !== name);
        if (newDecks.length < 2) {
          setError({ message: 'YouNeedTwoDecks' });
          return;
        }
        const res = await axios.patch(routes.getURL('accounts'), { username: user, decks: newDecks });
        if (res.status === 200) {
          dispatch(gameActions.setDecks({ decks: res.data.decks }));
          dispatch(deckbuilderActions.setWarnWindow({ windowType: null }));
        }
      }
      if (type === 'changesMade') {
        dispatch(deckbuilderActions.setChosenDeck({ chosenDeck: null }));
        dispatch(deckbuilderActions.setWarnWindow({ windowType: null }));
        dispatch(battleActions.deleteActiveCard({ player: 'player1' }));
        navigate('/choosedeck');
      }
    } catch (e) {
      setPending(false);
      setError(e);
    }
  };

  const handleClose = () => {
    dispatch(deckbuilderActions.setWarnWindow({ windowType: null }));
    setError(false);
  };

  return (
    <dialog className={styles.window}>
      <div className={styles.content}>
        {error && (
          <h2 className={styles.error}>{t(`errors.${error.message}`)}</h2>
        )}
        <h2 className={styles.title}>
          {type === 'deleteDeck' && (t('DeleteDeckWarn'))}
          {type === 'changesMade' && (t('SaveChangesWarn'))}
          {type === 'deckSaved' && (t('DeckSaved'))}
        </h2>
        <PrimaryButton
          onClick={handleClose}
          showIcon={false}
          state={isPending ? 'disabled' : 'default'}
          disabled={isPending}
          text={t('buttons.CLOSE')}
          variant="secondary"
          type="submit"
        />
        {type !== 'deckSaved' && (
          <PrimaryButton
            onClick={handleClick}
            showIcon={false}
            disabled={isPending}
            state={isPending ? 'disabled' : 'default'}
            text={type === 'deleteDeck' ? t('buttons.DELETE') : t('buttons.EXIT')}
            variant="primary"
            type="submit"
          />
        )}
      </div>
    </dialog>
  );
};

export default WarnWindow;
