import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
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
              placeholder={t('LoginName')}
              data-testid="input-body"
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
              name="password"
            />
            {formik.touched.password && formik.errors.password ? (
              <div className={styles.invalidFeedback}>{t(`errors.${formik.errors.password}`)}</div>
            ) : null}
            <label htmlFor="password" className="visually-hidden">{t('Password')}</label>
          </div>
          <div className={styles.inputBlock}>
            <input
              className={styles.input}
              id="repeatpass"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.repeatpass}
              placeholder={t('RepeatPassword')}
              data-testid="input-body"
              name="repeatpass"
            />
            {formik.errors.repeatpass && (
            <div className={styles.invalidFeedback}>{t(`errors.${formik.errors.repeatpass}`)}</div>
            )}
            <label htmlFor="repeatpass" className="visually-hidden">{t('Repeatpass')}</label>
          </div>
          {error && (<div className={styles.invalidFeedback}>{t(`errors.${error}`)}</div>)}
        </div>
        <label htmlFor="username" className="visually-hidden">{t('YourName')}</label>
        <div className={styles.submitBlock}>
          <PrimaryButton
            showIcon={false}
            state="default"
            text={t('SIGNUP')}
            variant="primary"
            type="submit"
          />
          <div className={styles.formTypeBlock}>
            <p className={styles.questionText}>{t('HaveAcc')}</p>
            <button className={styles.changeFormBtn} type="button" onClick={() => changeType((prev) => !prev)}>{t('LogInLink')}</button>
          </div>
        </div>
      </fieldset>
    </form>
  );
};

export default LogInForm;
