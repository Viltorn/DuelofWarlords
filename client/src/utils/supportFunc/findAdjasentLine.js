export default (num, direct) => {
  if (num === '1') {
    return direct === 'right' ? '3' : '2';
  }
  if (num === '2') {
    return direct === 'right' ? '1' : null;
  }
  if (num === '3') {
    return direct === 'right' ? '4' : '1';
  }
  return direct === 'right' ? null : '3';
};
