import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { actions as modalActions } from '../../slices/modalsSlice.js';
import { actions as battleActions } from '../../slices/battleSlice.js';
import PrimaryButton from '../../components/Buttons/PrimaryButton/PrimaryButton.jsx';
import '../Modals.css';

const ChangePoints = () => {
  const { t } = useTranslation();
  const inputEl = useRef();
  const dispatch = useDispatch();
  const { player } = useSelector((state) => state.modalsReducer);
  const { playerPoints } = useSelector((state) => state.battleReducer);
  const currentPoints = playerPoints.find((item) => item.player === player).points;

  useEffect(() => {
    inputEl.current.focus();
    inputEl.current.select();
  }, []);

  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };

  function handleKeyDown(e) {
    const { key } = e;
    if (key === 'enter') {
      handleClose();
    }
  }

  const formik = useFormik({
    initialValues: {
      points: currentPoints,
    },
    onSubmit: ({ points }) => {
      try {
        dispatch(battleActions.setPlayerPoints({ points: parseInt(points, 10), player }));
        handleClose();
      } catch (err) {
        console.log(err);
        formik.setSubmitting(false);
      }
    },
    validateOnChange: true,
  });

  return (
    <dialog className="modal-window">
      <div className="modal-window__content">
        <h2 className="modal-window__header">{t('ChangePoints')}</h2>
        <form className="modal-window__form" onSubmit={formik.handleSubmit}>
          <fieldset className="modal-window__fieldset" disabled={formik.isSubmitting}>
            <input
              onKeyDown={(e) => handleKeyDown(e)}
              className="modal-window__input_black"
              id="points"
              type="text"
              ref={inputEl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.points}
              data-testid="input-body"
              name="points"
            />
            {formik.errors.health ? (
              <div className="invalid-feedback">{t(`errors.${formik.errors.points}`)}</div>
            ) : null}
            <label htmlFor="points" className="visually-hidden">{t('ChangePoints')}</label>
            <div className="modal-window__buttons">
              <PrimaryButton
                showIcon={false}
                state="default"
                text={t('buttons.CHANGE')}
                variant="primary"
                type="submit"
              />
              <PrimaryButton
                showIcon={false}
                state="default"
                text={t('buttons.CLOSE')}
                variant="secondary"
                onClick={handleClose}
              />
            </div>
          </fieldset>
        </form>
      </div>
    </dialog>
  );
};

export default ChangePoints;
