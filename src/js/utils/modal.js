'use strict';
const makeEl = require('./makeEl.js');

function makeButtons(cb){
  var dpModalButtons = makeEl('div', {class: 'dp-modal-buttons'});
  if (cb) {
    var cancel = makeEl('button', {id: "dp-modal-cancel"}, 'cancel');
    dpModalButtons.appendChild(cancel);
    var confirm = makeEl('button', {id: 'dp-modal-confirm'}, 'okay');
    dpModalButtons.appendChild(confirm);
    return dpModalButtons;
  }

  var close = makeEl('button', {id: "dp-modal-cancel"}, 'close');
  dpModalButtons.appendChild(close);
  return dpModalButtons;
}

/**
 * input is a modal used to display messages and also capture data
 * 
 * @param  {String} title       title that shows at the top of the modal
 * @param  {String} content     A descriptive message on what the modal is for
 * @param  {String} placeholder placeholder for the textarea
 * @param  {String} confirm     a way to customize the text of the confirm button
 * @param  {Number} maxlength   for the textarea maxlength attribute
 */
var create = function(options) {
  var defaults = {
      title: 'Dub+',
      content: '',
      value : '',
      placeholder: null,
      maxlength: 999,
      confirmCallback: null
  };
  var opts = Object.assign({}, defaults, options);
  
  /*****************************************************
   * Create modal html string
   */

  var dpModal = makeEl('div', {class: 'dp-modal'});
  
  var container = makeEl('aside', {class: 'container'});
  
  var title = makeEl('div', {class: 'title'});
  var h1 = makeEl('h1', {}, opts.title);
  title.appendChild(h1);

  var content = makeEl('div', {class: 'content'});
  var contentCopy = makeEl('p', {}, opts.content);
  content.appendChild(contentCopy);

  if (opts.placeholder) {
    let textarea = makeEl('textarea', {placeholder: opts.placeholder, maxlength : opts.maxlength }, opts.value);
    content.appendChild(textarea);
  }

  var dpModalButtons = makeButtons(opts.confirmCallback);

  container.appendChild(title);
  container.appendChild(content);
  container.appendChild(dpModalButtons);

  dpModal.appendChild(container);
  
  document.body.appendChild( dpModal );

  /*****************************************************
   * Attach events to your modal
   */

  // if a confirm cb function was defined then we add a click event to the 
  // confirm button as well
  if (typeof opts.confirmCallback === 'function'){
    $('#dp-modal-confirm').one("click", function(e){
      opts.confirmCallback();
      $('.dp-modal').remove();
    });
  }

  // add one time cancel click
  $('#dp-modal-cancel').one("click",function(){
    $('.dp-modal').remove();
  });

  // bind one time keyup ENTER and ESC events
  $(document).one('keyup', function(e) {
    // enter
    if (e.keyCode === 13 && typeof opts.confirmCallback === 'function') { 
      opts.confirmCallback();
      $('.dp-modal').remove();
    }
    // esc
    if (e.keyCode === 27) { 
      $('.dp-modal').remove();
    }
  });

};

var close = function() {
  $('.dp-modal').remove();
};

module.exports = {
  create: create,
  close : close
};