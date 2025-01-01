import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import PrimaryButton from '../../components/Buttons/PrimaryButton/PrimaryButton.jsx';
import styles from './ConnectProblem.module.css';

const ConnectProblem = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(modalsActions.closeModal());
  };

  return (
    <dialog className={styles.window}>
      <div className={styles.content}>
        <h2 className={styles.title}>{t('ConnectProblem')}</h2>
        <PrimaryButton
          onClick={handleClick}
          showIcon={false}
          state="default"
          text={t('buttons.CONTINUE')}
          variant="primary"
          type="submit"
        />
      </div>
    </dialog>
  );
};

export default ConnectProblem;
