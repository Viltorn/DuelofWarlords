import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { actions as deckbuilderActions } from '../../slices/deckbuilderSlice.js';
import { actions as gameActions } from '../../slices/gameSlice';
import PrimaryButton from '../PrimaryButton';
import styles from './WarnWindow.module.css';
import socket from '../../socket';

const WarnWindow = ({
  name, type, user,
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState(false);
  const [isPending, setPending] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    try {
      if (type === 'deleteDeck') {
        setPending(true);
        socket.emit('deleteDeck', { deckName: name, username: user }, (res) => {
          if (res.error) {
            setError(res.error);
            setPending(false);
          }
          const { decks } = res;
          dispatch(gameActions.setDecks({ decks }));
          dispatch(deckbuilderActions.setWarnWindow({ windowType: null }));
        });
      }
      if (type === 'changesMade') {
        dispatch(deckbuilderActions.setChosenDeck({ chosenDeck: null }));
        dispatch(deckbuilderActions.setWarnWindow({ windowType: null }));
        navigate('/choosedeck');
      }
    } catch (e) {
      setError(e);
    }
  };

  const handleClose = () => {
    dispatch(deckbuilderActions.setWarnWindow({ windowType: null }));
  };

  return (
    <dialog className={styles.window}>
      <div className={styles.content}>
        {error && (
          <h2 className={styles.title}>{error.message}</h2>
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
          text={t('CLOSE')}
          variant="secondary"
          type="submit"
        />
        {type !== 'deckSaved' && (
          <PrimaryButton
            onClick={handleClick}
            showIcon={false}
            disabled={isPending}
            state={isPending ? 'disabled' : 'default'}
            text={type === 'deleteDeck' ? t('DELETE') : t('EXIT')}
            variant="primary"
            type="submit"
          />
        )}
      </div>
    </dialog>
  );
};

export default WarnWindow;
