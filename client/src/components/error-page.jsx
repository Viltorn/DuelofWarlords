import { useTranslation } from 'react-i18next';
import logoMini from '../assets/Logo_Mini.png';

const ErrorPage = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center main-bg" id="error-page">
      <img
        alt="Страница не найдена"
        style={{ height: '200px', width: '200px' }}
        src={logoMini}
      />
      <h1 className="h4 text-muted">{t('PageNotFound')}</h1>
      <p className="text-muted">
        {t('YouCanChangeover')}
        <a href="/">{t('GoToMain')}</a>
      </p>
    </div>
  );
};

export default ErrorPage;
