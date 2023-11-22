import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { actions as modalsActions } from '../slices/modalsSlice.js';
import abilityContext from '../contexts/abilityActions.js';
import PrimaryButton from '../components/PrimaryButton';
import styles from './endTurnWarning.module.css';

const EndTurnWarning = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    makeOnlineAction,
  } = useContext(abilityContext);
  const { data } = useSelector((state) => state.modalsReducer);

  const handleClick = () => {
    makeOnlineAction(data);
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
