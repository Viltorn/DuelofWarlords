// /* eslint-disable max-len */
// import {
//   useContext, createContext, useState,
// } from 'react';

// import { useDispatch, useSelector, useStore } from 'react-redux';
// import drumAudio from '../assets/DrumBeat.mp3';

// import { actions as modalsActions } from '../slices/modalsSlice.js';
// import { actions as battleActions } from '../slices/battleSlice.js';
// import countSpellDependVal from '../utils/supportFunc/countSpellDependVal.js';
// import getEnemyPlayer from '../utils/supportFunc/getEnemyPlayer';
// import findCellsForSpellApply from '../utils/supportFunc/findCellsForSpellApply.js';
// import findNextRowCells from '../utils/supportFunc/findNextRowCells.js';
// import getProtectionVal from '../utils/supportFunc/getProtectionVal.js';
// import findTriggerSpells from '../utils/supportFunc/findTriggerSpells.js';
// import functionContext from './functionsContext.js';
// import socket from '../socket';

// const AbilitiesContext = createContext({});

// export const AbilityProvider = ({ children }) => {
//   const {
//     isKilled,
//     deleteCardfromSource,
//     moveAttachedSpells,
//     changeCardHP,
//     getWarriorPower,
//     handleAnimation,
//     checkMeetCondition,
//     changeTutorStep,
//     deleteOtherActiveCard,
//   } = useContext(functionContext);
//   const store = useStore();
//   const [play] = useSound(drumAudio, { volume: 0.3 });
//   const dispatch = useDispatch();
//   // const [cellData, setCellData] = useState({});

//   const {
//     fieldCells, playerPoints, activeCardPlayer1, activeCardPlayer2,
//   } = useSelector((state) => state.battleReducer);

//   return (
//     <AbilitiesContext.Provider value={{

//     }}
//     >
//       {children}
//     </AbilitiesContext.Provider>
//   );
// };

// export default AbilitiesContext;
