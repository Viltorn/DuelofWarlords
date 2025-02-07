const data = [
  {
    step: 'step0', func: '', next: true, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step1', func: '', next: true, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step2', func: '', next: true, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step3', func: 'step3', next: true, back: true, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step4', func: 'step4', next: true, back: true, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step5', func: 'step5', next: true, back: true, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step6', func: 'step6', next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step7', func: 'step7', next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step8', func: 'step8', left: 22, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step9', func: '', left: 22, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step10', func: 'step10', left: 22, next: false, back: false, disEndTurn: true,
  },
  {
    step: 'step11', func: '', left: 22, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step12', func: 'step12', left: 22, next: false, back: false, disEndTurn: true,
  },
  {
    step: 'step13', func: '', left: 22, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step14', func: 'step14', left: 22, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step15', func: 'step15', left: 22, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step16', func: 'step16', left: 0, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step17', func: 'step17', left: 22, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step18', func: 'step18', left: 15, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step19', func: 'step19', left: 15, next: false, back: false, disEndTurn: true,
  },
  {
    step: 'step20', func: '', left: 0, next: false, back: false, disEndTurn: false,
  },
  {
    step: 'step21', func: 'step21', left: 0, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step22', func: 'activeFighterCell', left: 15, next: false, back: false, disEndTurn: true,
  },
  {
    step: 'step23', func: 'step23', left: 15, next: false, back: false, disEndTurn: false,
  },
  {
    step: 'step24', func: 'step24', left: 22, next: false, back: false, disEndTurn: true,
  },
  {
    step: 'step25', func: 'step25', left: 15, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step26', func: 'step26', left: 15, next: false, back: false, disEndTurn: true,
  },
  {
    step: 'step27', func: '', left: 15, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step28', func: 'step28', left: 15, next: false, back: false, disEndTurn: true,
  },
  {
    step: 'step29', func: 'step29', left: 15, next: false, back: false, disEndTurn: true,
  },
  {
    step: 'step30', func: 'step30', left: 15, next: false, back: false, disEndTurn: false,
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
    step: 'step34', func: '', left: 38, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step35', func: 'step35', left: 38, next: false, back: false, disEndTurn: true,
  },
  {
    step: 'step36', func: 'step36', left: 15, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step37', func: 'step37', left: 15, next: false, back: false, disEndTurn: true,
  },
  {
    step: 'step38', func: 'disableEnemyCells', left: 15, next: false, back: false, disEndTurn: false,
  },
  {
    step: 'step39', func: 'step39', left: 15, next: true, back: false, disEndTurn: true,
  },
  {
    step: 'step40', func: 'step40', left: 15, next: true, back: false, disEndTurn: true,
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
    step: 'step44', func: '', left: 22, next: false, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step45',
    func: 'disableCells',
    left: 38,
    next: false,
    back: false,
    disEndTurn: false,
    disAbility: true,
  },
  {
    step: 'step46', func: 'step46', left: 22, next: true, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step47', func: 'activateEnemyLine3', left: 22, next: true, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step48', func: 'step48', left: 22, next: false, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step49', func: '', left: 0, next: true, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step50', func: '', left: 38, next: false, back: false, disEndTurn: false, disAbility: true,
  },
  {
    step: 'step51', func: 'step51', left: 15, next: true, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step52', func: '', left: 5, next: true, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step53', func: 'step53', left: 15, next: false, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step54', func: '', left: 15, next: false, back: false, disEndTurn: false, disAbility: true,
  },
  {
    step: 'step55', func: 'step55', left: 15, next: true, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step56', func: '', left: 0, next: true, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step57', func: 'step57', left: 15, next: true, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step58', func: 'step58', left: 38, next: true, back: false, disEndTurn: true, disAbility: true,
  },
  {
    step: 'step59', func: 'disableEnemyCells', left: 0, next: false, back: false, disEndTurn: false, disAbility: true,
  },
];

export default data;
