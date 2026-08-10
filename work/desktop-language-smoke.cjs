'use strict';

const endpoint = process.argv[2] || 'http://127.0.0.1:9334';

async function pages() {
  const response = await fetch(`${endpoint}/json/list`);
  if (!response.ok) throw new Error(`CDP HTTP ${response.status}`);
  return response.json();
}

async function evaluate(webSocketDebuggerUrl, expression) {
  const socket = new WebSocket(webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  const result = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('CDP evaluation timeout')), 10000);
    socket.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (message.id !== 1) return;
      clearTimeout(timer);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    });
    socket.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression } }));
  });
  socket.close();
  return result;
}

async function waitForTitle(expected) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const page = (await pages()).find(item => item.type === 'page');
    if (page?.title === expected) return page;
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  throw new Error(`Desktop title did not become ${expected}`);
}

(async () => {
  let page = (await pages()).find(item => item.type === 'page');
  if (!page) throw new Error('No desktop renderer page found');
  if (page.title !== 'Where the Last Light Sleeps') throw new Error(`English is not the default: ${page.title}`);
  await evaluate(page.webSocketDebuggerUrl, "localStorage.setItem('lastLight.language','ko'); location.reload()");
  const korean = await waitForTitle('마지막 빛이 잠든 곳');
  await evaluate(korean.webSocketDebuggerUrl, "localStorage.setItem('lastLight.language','en'); location.reload()");
  const english = await waitForTitle('Where the Last Light Sleeps');
  console.log(JSON.stringify({ ok: true, default: page.title, korean: korean.title, restored: english.title }, null, 2));
})().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
