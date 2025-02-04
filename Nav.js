// script.js
const output = document.getElementById('output');
function addOutput(message) {
  const p = document.createElement('p');
  p.textContent = message;
  output.appendChild(p);
  output.scrollTop = output.scrollHeight;
}

setTimeout(() => addOutput('Device detected...'), 1000);
setTimeout(() => addOutput('Establishing connection...'), 2000);
