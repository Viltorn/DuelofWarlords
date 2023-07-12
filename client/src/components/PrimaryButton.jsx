/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import React, { useReducer } from 'react';
import '../PrimaryButton.css';

function reducer(state, action) {
  switch (action) {
    case 'mouse_enter':
      return {
        ...state,
        state: 'hover',
      };
    case 'mouse_leave':
      return {
        ...state,
        state: 'default',
      };
    default:
      return {
        ...state,
        state: 'default',
      };
  }
}

const PrimaryButton = ({
  text = 'Get Started', stateProp, type, className,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    state: stateProp || 'default',
    type: type || 'primary',
  });

  return (
    <button
      className={`primary-button ${state.state} ${state.type} ${className}`}
      onMouseLeave={() => {
        dispatch('mouse_leave');
      }}
      onMouseEnter={() => {
        dispatch('mouse_enter');
      }}
      type="button"
    >
      <div className="label">{text}</div>
    </button>
  );
};

PrimaryButton.propTypes = {
  text: PropTypes.string,
  stateProp: PropTypes.oneOf(['disabled', 'hover', 'default']),
  type: PropTypes.oneOf(['primary', 'secondary']),
};

PrimaryButton.defaultProps = {
  text: 'let"s start',
  stateProp: 'default',
  type: 'primary',
};

export default PrimaryButton;
