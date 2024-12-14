import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import PrimaryButton from '../../components/Buttons/PrimaryButton/PrimaryButton';
import styles from './LoginSignUp.module.css';

const LogInForm = ({ formik, error, changeType }) => {
  const { t } = useTranslation();
  const inputEl = useRef();

  useEffect(() => {
    inputEl.current.focus();
    inputEl.current.select();
  }, []);

  return (
    <form className={styles.form} onSubmit={formik.handleSubmit}>
      <fieldset className={styles.fieldset} disabled={formik.isSubmitting}>
        <div className={styles.inputContainer}>
          <div className={styles.inputBlock}>
            <input
              className={styles.input}
              id="username"
              type="text"
              ref={inputEl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              placeholder={t('modals.LoginName')}
              data-testid="input-body"
              autoComplete="username"
              name="username"
            />
            {formik.touched.username && formik.errors.username ? (
              <div className={styles.invalidFeedback}>{t(`errors.${formik.errors.username}`)}</div>
            ) : null}
            <label htmlFor="username" className="visually-hidden">{t('UserName')}</label>
          </div>
          <div className={styles.inputBlock}>
            <input
              className={styles.input}
              id="password"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              placeholder={t('Password')}
              data-testid="input-body"
              autoComplete="password"
              name="password"
            />
            {formik.touched.password && formik.errors.password ? (
              <div className={styles.invalidFeedback}>{t(`errors.${formik.errors.password}`)}</div>
            ) : null}
          </div>
          {error && (<div className={styles.invalidFeedback}>{t(`errors.${error}`)}</div>)}
          <label htmlFor="password" className="visually-hidden">{t('Password')}</label>
        </div>
        <label htmlFor="username" className="visually-hidden">{t('YourName')}</label>
        <input type="hidden" className="visually-hidden" id="token" name="token" />
        <div className={styles.submitBlock}>
          <PrimaryButton
            showIcon={false}
            state="default"
            text={t('buttons.ENTER')}
            variant="primary"
            type="submit"
          />
          <div className={styles.formTypeBlock}>
            <p className={styles.questionText}>{t('modals.DontHaveAcc')}</p>
            <button className={styles.changeFormBtn} type="button" onClick={() => changeType((prev) => !prev)}>{t('modals.SignUpLink')}</button>
          </div>
        </div>
      </fieldset>
    </form>
  );
};

export default LogInForm;
