/* eslint-disable no-nested-ternary */
// import PropTypes from 'prop-types';
import React, { useReducer } from 'react';
import './PrimaryButton.css';

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
  text = 'Get Started', stateProp, type, variant, onClick,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    state: stateProp || 'default',
    variant: variant || 'primary',
  });

  return (
    <button
      className={`primary-button ${state.state} ${state.variant}`}
      onMouseLeave={() => {
        dispatch('mouse_leave');
      }}
      onMouseEnter={() => {
        dispatch('mouse_enter');
      }}
      type={type ? 'submit' : 'button'}
      onClick={onClick}
    >
      <div className="label">{text}</div>
    </button>
  );
};

// PrimaryButton.propTypes = {
//   text: PropTypes.string,
//   stateProp: PropTypes.oneOf(['disabled', 'hover', 'default', 'absolute']),
//   variant: PropTypes.oneOf(['primary', 'secondary']),
// };

// PrimaryButton.defaultProps = {
//   text: 'let"s start',
//   stateProp: 'default',
//   variant: 'primary',
// };

export default PrimaryButton;
