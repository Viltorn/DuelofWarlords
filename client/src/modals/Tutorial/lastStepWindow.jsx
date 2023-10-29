import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { actions as battleActions } from '../../slices/battleSlice.js';
import PrimaryButton from '../../components/PrimaryButton';
import functionContext from '../../contexts/functionsContext.js';
import styles from './lastStepWindow.module.css';

const GreetingWindow = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { changeTutorStep } = useContext(functionContext);

  const handleExit = () => {
    dispatch(battleActions.resetState());
    changeTutorStep(0);
    navigate('/choose');
  };

  return (
    <dialog className={styles.window}>
      <div className={styles.content}>
        <h2 className={styles.title}>{t('TutorialFinish')}</h2>
        <p className={styles.description}>
          {t('TutorialTips')}
        </p>
        <ul className={styles.tipsBlock}>
          <li className={styles.tip}>
            {t('Tip1')}
          </li>
          <li className={styles.tip}>
            {t('Tip2')}
          </li>
          <li className={styles.tip}>
            {t('Tip3')}
          </li>
          <li className={styles.tip}>
            {t('Tip4')}
          </li>
        </ul>
        <PrimaryButton
          showIcon={false}
          state="default"
          text={t('Exit')}
          variant="primary"
          type="submit"
          onClick={handleExit}
        />
      </div>
    </dialog>
  );
};

export default GreetingWindow;
