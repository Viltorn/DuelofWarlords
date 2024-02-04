import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import functionsContext from '../../contexts/functionsContext.js';
import PrimaryButton from '../../components/Buttons/PrimaryButton/PrimaryButton.jsx';
import styles from './EndTurnWarning.module.css';

const EndTurnWarning = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    makeGameAction,
  } = useContext(functionsContext);
  const { data } = useSelector((state) => state.modalsReducer);
  const { gameMode } = useSelector((state) => state.gameReducer);

  const handleClick = () => {
    makeGameAction(data, gameMode);
    dispatch(modalsActions.closeModal());
  };

  const handleClose = () => {
    dispatch(modalsActions.closeModal());
  };

  return (
    <dialog className={styles.window}>
      <div className={styles.content}>
        <h2 className={styles.title}>{t('EndTurnWarning')}</h2>
        <PrimaryButton
          onClick={handleClick}
          showIcon={false}
          state="default"
          text={t('CONTINUE')}
          variant="primary"
          type="submit"
        />
        <PrimaryButton
          onClick={handleClose}
          showIcon={false}
          state="default"
          text={t('CLOSE')}
          variant="secondary"
          type="submit"
        />
      </div>
    </dialog>
  );
};

export default EndTurnWarning;
