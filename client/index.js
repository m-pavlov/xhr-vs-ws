const socket = io('/');
const input = document.querySelector('#counter');
const button = document.querySelector('#run');
let requests = {};

button.addEventListener('click', runTest);

socket.onAny((event, { id }) => {
  const req = requests[id];

  if (req) {
    req.received = Date.now();

    addLog(req.type, req.received - req.sent);
  }
});

async function runTest() {
  input.disabled = true;
  button.disabled = true;

  cleanup();

  const length = Number(input.value);

  for (let i = 0; i < length; i++) {
    await sendXhr();
  }

  for (let i = 0; i < length; i++) {
    await sendWs();
  }

  addResult();

  input.disabled = false;
  button.disabled = false;
}

async function sendXhr() {
  const url = '/api/test';
  const id = crypto?.randomUUID() ?? Math.random();
  requests[id] = {
    type: 'xhr',
    sent: Date.now(),
  };

  return new Promise((resolve) => {
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({ id }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setTimeout(() => {
      resolve();
    }, 500);
  });
}

async function sendWs() {
  const id = crypto?.randomUUID() ?? Math.random();
  requests[id] = {
    type: 'ws',
    sent: Date.now(),
  };

  return new Promise((resolve) => {
    socket.emit('messageToServer', { id });

    setTimeout(() => {
      resolve();
    }, 500);
  });
}

function addLog(type, value) {
  const container = document.getElementById(type);
  const el = document.createElement('p');

  el.innerHTML = value;
  container.appendChild(el);
}

function cleanup() {
  document.getElementById('ws').innerHTML = '';
  document.getElementById('xhr').innerHTML = '';
  document.getElementById('result').innerHTML = '';
}

function calcResult(type) {
  const arr = Object.values(requests).filter(
    (req) => req.type === type && req.sent && req.received,
  );

  const sum = arr.reduce((sum, req) => {
    sum += req.received - req.sent;

    return sum;
  }, 0);

  return sum / arr.length;
}

function addResult() {
  const result = `
    Average delays: <br />
    &uarr;XHR + &darr; WS: ${calcResult('xhr')}ms<br />
    &uarr;WS + &darr; WS: ${calcResult('ws')}ms<br />
  `;

  document.getElementById('result').innerHTML = result;

  requests = {};
}
