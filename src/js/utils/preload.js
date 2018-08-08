const settings = require('../lib/settings.js');
import makeEl from './makeEl.js';

function preload() {

  var waitingStyles = [
    'font-family: \'Trebuchet MS\', Helvetica, sans-serif',
    'z-index: 2147483647',
    'color: white', 
    'position: fixed',
    'top: 69px',
    'right: 13px',
    'background: #222',
    'padding: 10px',
    'line-height: 1',
    '-webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75)', 
    '-moz-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75)',
    'box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75)',
    'border-radius: 5px',
    'overflow: hidden',
    'width: 230px'
  ].join(';');

  var dpIcon = [
    'float:left',
    'width: 26px',
    'margin-right:5px'
  ].join(";"); 

  var dpText = [
    'display: table-cell',
    'width: 10000px',
    'padding-top:5px'
  ].join(";"); 

  var img = new Image();
  img.src = `${settings.srcRoot}/images/dubplus.svg`;
  img.alt = "Dub+";

  var icon = makeEl('div', {style: dpIcon});
  icon.appendChild(img);

  // lets add a cool spinny animation if the browser supports the web animation api
  if ('animate' in icon) {
    var keyframes = [
      { transform: 'rotate(0deg)' },
      { transform: 'rotate(360deg)' },
    ];
    var options = {
      iterations: Infinity,
      iterationStart: 0,
      delay: 0,
      endDelay: 0,
      direction: 'alternate',
      duration: 1500,
      fill: 'forwards',
      easing: 'ease-in-out',
    }
    icon.animate(keyframes, options);
  }

  var span = makeEl('span', {style: dpText}, "Waiting for Dubtrack...");

  var container = makeEl('div', {style: dpText, class: 'dubplus-waiting', style: waitingStyles });

  container.appendChild(icon);
  container.appendChild(span);

  document.body.appendChild(container);
}

export default preload;