const data = [
  {
    step: 'step1', func: 'step1', next: true, back: true, disEndTurn: true,
  },
  {
    step: 'step2', func: 'heroAnimation', next: true, back: true, disEndTurn: true,
  },
  {
    step: 'step3', func: 'linesRowsAnimation', next: true, back: true, disEndTurn: true,
  },
  {
    step: 'step4', func: 'spellCellsAnimation', next: true, back: true, disEndTurn: true,
  },
  {
    step: 'step5', func: 'addTwoWarriors', next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step6', func: 'turnWarrior', next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step7', func: 'disablePostponed', left: 23, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step8', func: 'addGrifAndGarg', left: 23, next: false, back: false, disEndTurn: true,
  },
  {
    step: 'step9', func: '', left: 23, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step10', func: 'turnGriffon', left: 23, next: false, back: false, disEndTurn: true,
  },
  {
    step: 'step11', func: '', left: 23, next: false, back: false, disEndTurn: false,
  },
  {
    step: 'step12', func: 'attackGriffonAndWarrior', left: 23, next: true, back: false, disEndTurn: false,
  },
  {
    step: 'step13', func: '', left: 23, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step14', func: 'deleteWarriors', left: 23, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step15', func: 'addWarriorsToDeck', left: 23, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step16', func: 'drawCard', left: 23, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step17', func: 'activeShooterCells', left: 15, next: false, back: false, disEndTurn: true,
  },
  {
    step: 'step18', func: '', left: 15, next: false, back: false, disEndTurn: false,
  },
  {
    step: 'step19', func: '', left: 15, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step20', func: '', left: 15, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step21', func: 'activeFighterCell', left: 15, next: false, back: false, disEndTurn: true,
  },
  {
    step: 'step22', func: 'activateEnemyCells', left: 22, next: false, back: false, disEndTurn: false,
  },
  {
    step: 'step23', func: 'disablePlayerCells', left: 22, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step24', func: 'activeFlyerCells', left: 15, next: false, back: false, disEndTurn: true,
  },
  {
    step: 'step25', func: 'addGolemsForShoot', left: 15, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step26', func: 'turnShooter', left: 15, next: false, back: false, disEndTurn: true,
  },
  {
    step: 'step27', func: '', left: 15, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step28', func: 'turnFighter', left: 15, next: false, back: false, disEndTurn: true,
  },
  {
    step: 'step29', func: 'turnFlyer', left: 15, next: false, back: false, disEndTurn: true,
  },
  {
    step: 'step30', func: 'addSpellsToDeck', left: 15, next: false, back: false, disEndTurn: false,
  },
  {
    step: 'step31', func: 'disableCells', left: 15, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step32', func: '', left: 15, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step33', func: 'activateEnemyLine3', left: 15, next: false, back: false, disEndTurn: true,
  },
  {
    step: 'step34', func: 'activatePlayersHero', left: 15, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step35', func: '', left: 38, next: false, back: false, disEndTurn: true,
  },
  {
    step: 'step36', func: 'disableSpellCells', left: 15, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step37', func: 'activateSpellCellForGriffon', left: 15, next: false, back: false, disEndTurn: true,
  },
  {
    step: 'step38', func: 'disableEnemyCells', left: 15, next: false, back: false, disEndTurn: false,
  },
  {
    step: 'step39', func: 'addFireGolem', left: 15, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step40', func: 'sendHolyLandToGrave', left: 15, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step41', func: '', left: 15, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step42', func: 'activeFighterCell', left: 15, next: false, back: false, disEndTurn: true,
  },
  {
    step: 'step43', func: 'activateEnemyLine3', left: 0, next: false, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step44', func: '', left: 38, next: false, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step45', func: '', left: 38, next: false, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step46', func: 'disableCells', left: 38, next: false, back: false, disEndTurn: false, disAbility: true,
  },
  {
    step: 'step47', func: '', left: 23, next: true, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step48', func: 'removeFireGolem', left: 23, next: true, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step49', func: 'activatePostponed', left: 38, next: false, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step50', func: 'disablePostponed', left: 38, next: false, back: false, disEndTurn: false, disAbility: true,
  },
  {
    step: 'step51', func: 'addSecondEarthGolem', left: 15, next: true, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step52', func: 'activateEnemyLine3', left: 5, next: false, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step53', func: '', left: 15, next: false, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step54', func: '', left: 15, next: false, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step55', func: '', left: 15, next: true, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step56', func: '', left: 15, next: true, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step57', func: '', left: 15, next: true, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step58', func: 'activatePostponed', left: 38, next: false, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step59', func: 'disableEnemyCells', left: 0, next: false, back: false, disEndTurn: false, disAbility: true,
  },
  {
    step: 'step60', func: 'attackShooter', left: 0, next: true, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step61', func: 'massTurn', left: 0, next: true, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step62', func: '', left: 0, next: true, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step63', func: '', left: 0, next: true, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step64', func: 'openLastStep', left: 0, next: true, back: false, disEndTurn: true, disAbility: true,
  },
];

export default data;
