function _moneyToString(m) {
  return `${m.units}.${m.nanos.toString().padStart(9, '0')} ${m.currency_code}`;
}

module.exports = {
  _moneyToString
};
