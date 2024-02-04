import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import store from './slices/index.js';
import App from './App.jsx';
import resources from './locales/index.js';
import { FunctionProvider } from './contexts/functionsContext.js';

const Init = async () => {
  const i18n = i18next.createInstance();

  await i18n
    .use(initReactI18next)
    .init({
      debug: false,
      interpolation: {
        escapeValue: false,
      },
      resources,
      fallbackLng: 'ru',
    });

  return (
    <I18nextProvider i18n={i18n}>
      <StoreProvider store={store}>
        <FunctionProvider>
          <App />
        </FunctionProvider>
      </StoreProvider>
    </I18nextProvider>
  );
};

export default Init;
