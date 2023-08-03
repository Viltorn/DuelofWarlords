import { useTranslation } from 'react-i18next';
import logoMini from '../assets/Logo_Mini.png';
import './ErrorPage.css';

const ErrorPage = () => {
  const { t } = useTranslation();

  return (
    <div className="error-page" id="error-page">
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
