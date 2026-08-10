const fs = require('fs');
const path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'navigation-levels.json'), 'utf8'));
const DIR = { U:[0,-1], R:[1,0], D:[0,1], L:[-1,0] };
const key = p => p.join(',');

function solve(level) {
  const reefs = new Set(level.reefs.map(key));
  const signals = new Map(level.signals.map((x,i)=>[key(x.pos),i]));
  const survivors = new Map(level.survivors.map((x,i)=>[key(x.pos),i]));
  const switches = new Map(level.switches.map((x,i)=>[key(x.pos),i]));
  const currents = new Map(level.currents.map(x=>[key(x.pos),x.dir]));
  const gates = new Map(level.gates.map(x=>[key(x.pos),x.id]));
  const gateSwitch = new Map();
  level.switches.forEach((s,i)=>s.opens.forEach(g=>gateSwitch.set(g,i)));
  const allSignals = (1<<level.signals.length)-1;
  const allSurvivors = (1<<level.survivors.length)-1;
  const allSwitches = (1<<level.switches.length)-1;
  const inBounds = ([x,y]) => x>=0 && y>=0 && x<data.grid.width && y<data.grid.height;
  const blocked = (p, sw) => {
    const k=key(p); if(reefs.has(k)) return true;
    const gid=gates.get(k); return gid!==undefined && !(sw & (1<<gateSwitch.get(gid)));
  };
  function collect(p, s) {
    const k=key(p);
    if(signals.has(k)) s.sig |= 1<<signals.get(k);
    if(survivors.has(k)) s.sur |= 1<<survivors.get(k);
    if(switches.has(k)) s.sw |= 1<<switches.get(k);
  }
  function step(state, dir, events) {
    const d=DIR[dir], out={...state, pos:[state.pos[0]+d[0],state.pos[1]+d[1]]};
    if(!inBounds(out.pos)||blocked(out.pos,out.sw)) return null;
    if(events && gates.has(key(out.pos))) events.gates.add(key(out.pos));
    collect(out.pos,out);
    const seen=new Set();
    while(currents.has(key(out.pos))) {
      const ck=key(out.pos); if(seen.has(ck)) return null; seen.add(ck);
      if(events) events.currents.add(ck);
      const cd=DIR[currents.get(ck)], dest=[out.pos[0]+cd[0],out.pos[1]+cd[1]];
      if(!inBounds(dest)||blocked(dest,out.sw)) return null;
      out.pos=dest; collect(out.pos,out);
      if(events && gates.has(key(out.pos))) events.gates.add(key(out.pos));
    }
    return out;
  }
  const start={pos:level.start,sig:0,sur:0,sw:0}; collect(start.pos,start);
  const stateKey=s=>`${key(s.pos)}|${s.sig}|${s.sur}|${s.sw}`;
  const startKey=stateKey(start);
  const q=[{s:start,path:[]}], dist=new Map([[startKey,0]]), ways=new Map([[startKey,1]]);
  while(q.length) {
    const {s,path}=q.shift();
    if(key(s.pos)===key(level.goal)&&s.sig===allSignals&&s.sur===allSurvivors&&s.sw===allSwitches) {
      let replay={...start,pos:[...start.pos]}, events={currents:new Set(),gates:new Set()};
      for(const dir of path) replay=step(replay,dir,events);
      return {path,state:s,ways:ways.get(stateKey(s)),events};
    }
    for(const dir of Object.keys(DIR)) {
      const n=step(s,dir); if(!n) continue; const k=stateKey(n), nd=path.length+1, old=dist.get(k);
      if(old===undefined) {
        dist.set(k,nd); ways.set(k,ways.get(stateKey(s))); q.push({s:n,path:[...path,dir]});
      } else if(old===nd) {
        ways.set(k,Math.min(1e9,ways.get(k)+ways.get(stateKey(s))));
      }
    }
  }
  return null;
}

function staticErrors(level) {
  const errors=[];
  const inBounds=([x,y])=>Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&y>=0&&x<data.grid.width&&y<data.grid.height;
  const entities=[
    ['start',[{pos:level.start}]],['goal',[{pos:level.goal}]],['reef',level.reefs.map(pos=>({pos}))],
    ['signal',level.signals],['current',level.currents],['switch',level.switches],['gate',level.gates],['survivor',level.survivors]
  ];
  for(const [kind,items] of entities) for(const item of items) if(!inBounds(item.pos)) errors.push(`${kind} out of bounds: ${JSON.stringify(item.pos)}`);
  const reefSet=new Set(level.reefs.map(key));
  for(const [kind,items] of entities.filter(([kind])=>!['reef'].includes(kind))) for(const item of items) if(reefSet.has(key(item.pos))) errors.push(`${kind} overlaps reef: ${key(item.pos)}`);
  for(const [kind,items] of [['signal',level.signals],['switch',level.switches],['gate',level.gates],['survivor',level.survivors]]) {
    const ids=items.map(x=>x.id); if(new Set(ids).size!==ids.length) errors.push(`duplicate ${kind} id`);
  }
  const opened=level.switches.flatMap(s=>s.opens);
  for(const gate of level.gates) if(opened.filter(id=>id===gate.id).length!==1) errors.push(`gate ${gate.id} must be linked exactly once`);
  if(!['soft','hard'].includes(level.limitMode)) errors.push('invalid limitMode');
  if(!Number.isInteger(level.moveLimit)||level.moveLimit<1) errors.push('invalid moveLimit');
  return errors;
}

let failed=false;
let priorOptimal=0;
for(const level of data.levels) {
  const schemaErrors=staticErrors(level);
  if(schemaErrors.length) { console.log(level.id,'SCHEMA',schemaErrors.join('; ')); failed=true; continue; }
  const r=solve(level);
  if(!r) { console.log(level.id, 'UNSOLVABLE'); failed=true; continue; }
  console.log(level.id, `optimal=${r.path.length}`, `limit=${level.moveLimit}`, `ways=${r.ways}`, `currents=${r.events.currents.size}/${level.currents.length}`, `gates=${r.events.gates.size}/${level.gates.length}`, r.path.join(''));
  if(r.path.length>level.moveLimit) failed=true;
  if(r.path.length!==level.verifiedOptimalMoves) { console.log('  optimal mismatch'); failed=true; }
  if(r.path.join('')!==level.minimalSolution) { console.log('  solution mismatch'); failed=true; }
  if(r.events.currents.size!==level.currents.length) { console.log('  optimal path skips a current'); failed=true; }
  if(r.events.gates.size!==level.gates.length) { console.log('  optimal path skips a gate'); failed=true; }
  if(r.path.length<=priorOptimal) { console.log('  non-increasing difficulty'); failed=true; }
  priorOptimal=r.path.length;
}
process.exitCode=failed?1:0;
