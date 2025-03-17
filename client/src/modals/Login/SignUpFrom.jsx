import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Turnstile from 'react-turnstile';
import PrimaryButton from '../../components/Buttons/PrimaryButton/PrimaryButton';
import styles from './LoginSignUp.module.css';

const LogInForm = ({
  formik, error, changeType, setCaptcha, captcha,
}) => {
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
          {captcha ? (
            <p className={styles.passedCaptcha}>{t('statuses.CaptchaPassed')}</p>)
            : (<p className={styles.processCaptcha}>{t('statuses.CaptchaInProcess')}</p>)}
          {error && (<div className={styles.invalidFeedback}>{t(`errors.${error}`)}</div>)}
          <div className={styles.captcha}>
            <Turnstile
              size="normal"
              sitekey="0x4AAAAAAA9cFaDFosEvIR6y" // Replace with your site key
              onSuccess={(token) => setCaptcha(token)} // Store captcha token on success
              onExpire={() => setCaptcha(null)} // Reset token if captcha expires
              onError={() => setCaptcha(null)}
            />
          </div>
        </div>
        <label htmlFor="username" className="visually-hidden">{t('YourName')}</label>
        <input type="hidden" className="visually-hidden" id="token" name="token" />
        <div className={styles.submitBlock}>
          <PrimaryButton
            showIcon={false}
            state="default"
            text={t('buttons.SIGNUP')}
            variant="primary"
            type="submit"
          />
          <div className={styles.formTypeBlock}>
            <p className={styles.questionText}>{t('modals.HaveAcc')}</p>
            <button className={styles.changeFormBtn} type="button" onClick={() => changeType((prev) => !prev)}>{t('modals.LogInLink')}</button>
          </div>
        </div>
      </fieldset>
    </form>
  );
};

export default LogInForm;
