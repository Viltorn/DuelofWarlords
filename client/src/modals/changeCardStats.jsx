import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { actions as modalActions } from '../slices/modalsSlice.js';
import { actions as battleActions } from '../slices/battleSlice.js';
import PrimaryButton from '../components/PrimaryButton';
import './Modals.css';

const ChangeCardStats = () => {
  const { t } = useTranslation();
  const inputEl = useRef();
  const dispatch = useDispatch();
  const { id, cellId } = useSelector((state) => state.modalsReducer);
  const { fieldCells } = useSelector((state) => state.battleReducer);
  const currentCell = fieldCells.find((cell) => cell.id === cellId);
  const currentCard = currentCell.content.find((card) => card.id === id);

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
      health: currentCard.currentHP,
    },
    onSubmit: ({ health }) => {
      try {
        dispatch(battleActions.changeHP({
          health: parseInt(health, 10),
          cardId: currentCard.id,
          cellId: currentCard.cellId,
        }));
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
        <h2 className="modal-window__header">{t('ChangeHP')}</h2>
        <form className="modal-window__form" onSubmit={formik.handleSubmit}>
          <fieldset className="modal-window__fieldset" disabled={formik.isSubmitting}>
            <input
              onKeyDown={(e) => handleKeyDown(e)}
              className="modal-window__input"
              id="health"
              type="text"
              ref={inputEl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.health}
              data-testid="input-body"
              name="health"
            />
            {formik.errors.health ? (
              <div className="invalid-feedback">{t(`errors.${formik.errors.phone}`)}</div>
            ) : null}
            <label htmlFor="health" className="visually-hidden">{t('ChangeHP')}</label>
            <div className="modal-window__buttons">
              <PrimaryButton
                showIcon={false}
                state="default"
                text={t('Change')}
                variant="primary"
                type="submit"
              />
              <PrimaryButton
                showIcon={false}
                state="default"
                text={t('CLOSE')}
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

export default ChangeCardStats;
