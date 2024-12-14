import { useTranslation } from 'react-i18next';
import logoMini from '@assets/LogoMini.png';
import styles from './ErrorPage.module.css';

const ErrorPage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container} id="error-page">
      <img
        alt="page not found"
        style={{ height: '200px', width: '200px' }}
        src={logoMini}
      />
      <h1>{t('PageNotFound')}</h1>
      <p>
        {t('YouCanChangeover')}
        {' '}
        <a href="/">{t('GoToMain')}</a>
      </p>
    </div>
  );
};

export default ErrorPage;
