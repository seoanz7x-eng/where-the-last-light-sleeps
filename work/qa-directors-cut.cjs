const fs=require('fs'),vm=require('vm');

class Classes{
  constructor(owner,names=[]){this.owner=owner;this.s=new Set(names)}
  add(...x){x.forEach(v=>this.s.add(v))} remove(...x){x.forEach(v=>this.s.delete(v))}
  contains(x){return this.s.has(x)} toggle(x,on){if(on===undefined)on=!this.s.has(x);on?this.s.add(x):this.s.delete(x);return on}
}
class El{
  constructor(id='',tag='DIV'){this.id=id;this.tagName=tag;this.children=[];this.dataset={};this.style={setProperty:(k,v)=>this.style[k]=v};this.classList=new Classes(this);this.open=false;this.disabled=false;this.checked=false;this.value=id==='textSpeed'?'0':id==='volume'?'55':'0';this.textContent='';this._html='';this.listeners={}}
  set className(v){this.classList=new Classes(this,String(v).split(/\s+/).filter(Boolean))} get className(){return [...this.classList.s].join(' ')}
  set innerHTML(v){this._html=String(v);this.children=[]} get innerHTML(){return this._html}
  appendChild(x){this.children.push(x);return x} setAttribute(k,v){this[k]=v}
  addEventListener(k,fn){(this.listeners[k]??=[]).push(fn)}
  click(){if(!this.disabled&&this.onclick)this.onclick({preventDefault(){}})}
  showModal(){this.open=true} close(){this.open=false}
}
const ids=['app','title','game','newGame','continueGame','openSettings','dayLabel','objective','dayProgress','soundBtn','journalBtn','clueCount','menuBtn','island','weather','sceneVeil','locations','traveler','locationLabel','moodLine','playTime','storyDialog','speaker','storyTitle','storyText','choices','nextStory','puzzleDialog','puzzleHint','puzzleBody','tunerFeedback','checkTune','puzzleAssist','journalDialog','journalContent','menuDialog','resume','save','settings','toTitle','settingsDialog','largeText','reduceMotion','highContrast','textSpeed','volume','muteSound','instantTravel','deductionDialog','deductionTitle','deductionQuestion','evidenceBoard','deductionChoices','deductionFeedback','deductionAssist','memoryDiveDialog','diveTitle','diveIntro','diveObjects','diveDetail','diveTimeline','diveFeedback','checkDive','resetDive','diveAssist','toast'];
const els=Object.fromEntries(ids.map(id=>[id,new El(id,id.endsWith('Dialog')?'DIALOG':id==='game'||id==='title'?'SECTION':'DIV')]));
els.title.classList.add('screen','active');els.game.classList.add('screen');els.textSpeed.value='0';
const tabs=['notes','memories','deductions','people','achievements'].map(x=>{const e=new El('', 'BUTTON');e.dataset.tab=x;return e});
const closeButtons=[new El('', 'BUTTON'),new El('', 'BUTTON')];
const dialogs=ids.filter(x=>x.endsWith('Dialog')).map(x=>els[x]);
const document={body:new El('body','BODY'),activeElement:null,
  querySelector(sel){if(sel.startsWith('#'))return els[sel.slice(1)]||(els[sel.slice(1)]=new El(sel.slice(1)));if(sel==='dialog[open]')return dialogs.find(d=>d.open)||null;return new El('', 'DIV')},
  querySelectorAll(sel){if(sel==='.screen')return[els.title,els.game];if(sel==='.tabs button')return tabs;if(sel==='dialog .close')return closeButtons;if(sel==='dialog')return dialogs;if(sel==='#deductionChoices button')return els.deductionChoices.children;if(sel==='#diveObjects button')return els.diveObjects.children;if(sel==='#puzzleBody .selected')return[];return[]},
  createElement(tag){return new El('',tag.toUpperCase())},addEventListener(){}
};
closeButtons[0].closest=()=>els.journalDialog;closeButtons[1].closest=()=>els.settingsDialog;
const store=new Map();const localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
const sandbox={console,document,localStorage,navigator:{getGamepads:()=>[]},window:{},requestAnimationFrame:()=>1,setInterval:(fn,ms)=>ms===1000?1:1,clearInterval(){},setTimeout:fn=>{fn();return 1},clearTimeout(){},Date,Math,JSON};sandbox.window=sandbox;
vm.createContext(sandbox);vm.runInContext(fs.readFileSync('outputs/TheLastLight/game.js','utf8'),sandbox,{filename:'game.js'});

function exhaustStory(choiceIndex=0){let guard=0;while(els.storyDialog.open&&guard++<30){if(els.choices.children.length){const choice=els.choices.children[Math.min(choiceIndex,els.choices.children.length-1)];choice.click()}else els.nextStory.click()}if(guard>=30)throw Error('story loop')}
function currentSave(){return JSON.parse(store.get('last-light-save-v2'))}

els.newGame.click();if(els.newGameDialog?.open)els.confirmNew.click();exhaustStory();
let sceneChoice=0;
const diveAnswers=[['soup','cards','knot'],['photo','ribbon','pen'],['boot','star','note'],['radio','towel','list'],['report','ticket','class'],['glass','wheel','jacket'],['alarm','bread','postcard']];
for(let day=0;day<7;day++){
  const route=['harbor','village','orchard','chapel','cliff','lighthouse'];
  // UI route differs by day, so always click the currently available, unfinished node.
  for(let n=0;n<6;n++){
    const button=els.locations.children.find(b=>b.classList.contains('available'));
    if(!button)throw Error(`day ${day} step ${n}: no available location`);
    const locationId=button.dataset.id;button.click();exhaustStory(sceneChoice++%2);
    if(locationId!=='lighthouse'){const doneButton=els.locations.children.find(b=>b.dataset.id===locationId);doneButton.click();exhaustStory()}
  }
  if(!els.puzzleDialog.open)throw Error(`day ${day}: puzzle did not open`);
  els.puzzleAssist.click();
  if(!els.storyDialog.open)throw Error(`day ${day}: lighthouse afterimage did not open`);
  exhaustStory();
  if(!els.deductionDialog.open)throw Error(`day ${day}: deduction did not open`);
  els.deductionAssist.click();
  if(!els.memoryDiveDialog.open)throw Error(`day ${day}: memory dive did not open`);
  for(const b of els.diveObjects.children)b.click();
  els.resetDive.click();
  for(const id of diveAnswers[day])els.diveObjects.children.find(b=>b.dataset.object===id).click();
  els.checkDive.click();
  if(day<6)exhaustStory(day%2);
}
if(!els.storyDialog.open)throw Error('final choice did not open');
exhaustStory(3); // balanced path unlocks hidden fourth ending
const final=currentSave();
if(final.day!==6||Object.keys(final.visited).length!==42||Object.keys(final.afterimages).length!==42||final.clues.length!==42)throw Error('completion counts invalid');
if(Object.keys(final.puzzleDone).length!==7||Object.keys(final.deductions).length!==7||Object.keys(final.dives).length!==7)throw Error('puzzle/deduction/dive counts invalid');
if(!final.endingsSeen.includes('dawn')||!final.achievements.fourth||!final.atFinalChoice)throw Error('hidden ending not reached');

// Final-choice checkpoint and persistent meta progression must allow all endings.
for(const idx of [0,1,2]){els.continueGame.click();if(!els.storyDialog.open)throw Error('final-choice checkpoint unavailable');exhaustStory(idx)}
const metaFinal=currentSave();if(new Set(metaFinal.endingsSeen).size!==4)throw Error('ending meta progression did not reach 4/4');

// Interrupted first scene must be saved as pending, not visited, then resume safely.
els.newGame.click();if(els.newGameDialog?.open)els.confirmNew.click();exhaustStory();const first=els.locations.children.find(b=>b.classList.contains('available'));first.click();
let pending=currentSave();if(!pending.pending||Object.keys(pending.visited).length)throw Error('pending scene safety failed');
els.storyDialog.close();els.title.classList.add('active');els.game.classList.remove('active');els.continueGame.click();
if(!els.storyDialog.open)throw Error('pending scene did not resume');exhaustStory(0);pending=currentSave();
if(pending.pending||Object.keys(pending.visited).length!==1)throw Error('resumed scene did not commit exactly once');

// Interrupt after choosing but before reading the consequence: choice must commit once.
els.newGame.click();if(els.newGameDialog?.open)els.confirmNew.click();exhaustStory();const first2=els.locations.children.find(b=>b.classList.contains('available'));first2.click();
let guard2=0;while(!els.choices.children.length&&guard2++<20)els.nextStory.click();
els.choices.children[0].click();let choicePending=currentSave();
if(choicePending.truth!==0||choicePending.choicesTrail.length!==0||!choicePending.pending.choice)throw Error('choice applied before atomic scene commit');
els.storyDialog.close();els.title.classList.add('active');els.game.classList.remove('active');els.continueGame.click();exhaustStory(0);
choicePending=currentSave();if(choicePending.truth!==1||choicePending.mercy!==0||choicePending.choicesTrail.length!==1||Object.keys(choicePending.visited).length!==1)throw Error('choice resume was not idempotent');

console.log(JSON.stringify({ok:true,completion:{day:final.day,visited:Object.keys(final.visited).length,afterimages:Object.keys(final.afterimages).length,clues:final.clues.length,memories:final.memories.length,puzzles:Object.keys(final.puzzleDone).length,deductions:Object.keys(final.deductions).length,dives:Object.keys(final.dives).length,ending:final.endingsSeen.at(-1),endingMeta:new Set(metaFinal.endingsSeen).size,truth:final.truth,mercy:final.mercy,achievements:Object.keys(final.achievements).length},resume:{visited:Object.keys(pending.visited).length,pending:pending.pending},atomicChoice:{truth:choicePending.truth,trail:choicePending.choicesTrail.length,visited:Object.keys(choicePending.visited).length}},null,2));
