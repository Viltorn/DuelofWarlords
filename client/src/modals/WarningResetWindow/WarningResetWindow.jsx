import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import PrimaryButton from '../../components/Buttons/PrimaryButton/PrimaryButton.jsx';
import styles from './WarningResetWindow.module.css';
import useClickActions from '../../hooks/useClickActions.js';

const WarningResetWindow = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { handleResetGameClick } = useClickActions();

  const { dest } = useSelector((state) => state.modalsReducer);

  const handleClose = () => {
    dispatch(modalsActions.closeModal());
  };

  return (
    <dialog className={styles.window}>
      <div className={styles.content}>
        <h2 className={styles.title}>{t('ResetWarning')}</h2>
        <PrimaryButton
          onClick={() => handleResetGameClick(dest)}
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

export default WarningResetWindow;
