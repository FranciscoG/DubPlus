function makeEl(el, attr, text){
  var elem = document.createElement(el);
  for (var key in attr) {
    elem.setAttribute(key, attr[key]);
  }
  if (text) {
    elem.textContent = text;
  }
  return elem;
}
export default makeEl;