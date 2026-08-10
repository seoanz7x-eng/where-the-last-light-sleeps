const fs = require('fs');
const source = fs.readFileSync('work/night-conversations-veteran.js', 'utf8');
const output = source
  .replace('const nightConversationsVeteran =', 'window.NIGHT_CONVERSATIONS =')
  .replace(/\nif \(typeof module !== 'undefined' && module\.exports\) \{\n  module\.exports = nightConversationsVeteran;\n\}\s*$/, '\n');
if (output === source) throw new Error('Conversation export marker was not found');
fs.writeFileSync('outputs/TheLastLight/night-conversations.js', output, 'utf8');
console.log('wrote night-conversations.js');
