function fixNumber(number) {
  let numberEx = number.slice(1);
  numberEx = `098${numberEx}`;
  return numberEx;
}
module.exports = { fixNumber };
