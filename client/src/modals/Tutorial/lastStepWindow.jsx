import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../../components/PrimaryButton';
import styles from './lastStepWindow.module.css';

const GreetingWindow = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleExit = () => {
    navigate('/choose');
  };

  return (
    <dialog className={styles.window}>
      <div className={styles.content}>
        <h2 className={styles.title}>{t('TutorialFinish')}</h2>
        <p className={styles.description}>
          Ниже дополнительная информация, которую необходимо знать в обычной игре
        </p>
        <ul className={styles.tipsBlock}>
          <li className={styles.tip}>
            Вы всегда можете нажать на сток карт, чтобы посмотреть карты,
            сыгранные вами или вашим оппонентом
          </li>
          <li className={styles.tip}>
            В первом раунде игры вы можете скинуть любое количество карт из руки в конец колоды
            и взять столько же взамен из вашей колоды сверху
          </li>
          <li className={styles.tip}>
            Смотрите на описание способностей ваших воинов
            - они помогут вам правильно применять их в бою
          </li>
          <li className={styles.tip}>
            В верхнем правом углу игрового поля отображается
            текущее количество карт в руке оппонента
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
