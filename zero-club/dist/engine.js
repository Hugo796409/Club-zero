export const clone = value => JSON.parse(JSON.stringify(value));
export function createGame(players, target, challenge) {
  if (![150,321,501].includes(target) || !players.length || new Set(players.map(p=>p.id)).size!==players.length) throw Error('Configuration invalide');
  return {id:crypto.randomUUID(),startedAt:new Date().toISOString(),target,challenge:clone(challenge),players:players.map(p=>({...p,score:0,hits:0,kills:0,throws:0})),current:0,round:1,darts:[],turnPoints:0,log:[],winner:null,pendingChallenge:null};
}
export function throwDart(previous, {base=0,multiplier=1,kind='hit'}) {
  if(previous.winner || previous.darts.length>=3 || previous.pendingChallenge) throw Error('Cette volée est terminée ou un défi attend validation.');
  if(!['hit','miss','rim','ground'].includes(kind)) throw Error('Type de lancer invalide');
  if(kind==='hit' && (!Number.isInteger(base) || ![1,2,3].includes(multiplier) || !(base>=1&&base<=20 || base===25&&multiplier<=2))) throw Error('Score de fléchette invalide');
  const g=clone(previous),p=g.players[g.current],points=kind==='hit'?base*multiplier:0;
  const before=p.score,overflow=before+points>g.target;
  p.score=overflow?before-points:before+points;
  p.throws++;p.hits+=points;g.turnPoints+=points;
  const victims=points>0?g.players.filter(q=>q.id!==p.id&&q.score===p.score&&q.score>0):[];
  for(const q of victims){q.score=0;p.kills++;}
  const repetitions=g.challenge.enabled&&['rim','ground'].includes(kind)?Math.ceil(g.turnPoints*g.challenge.multiplier)*(kind==='ground'?2:1):0;
  if(['rim','ground'].includes(kind)&&g.challenge.enabled) g.pendingChallenge={player:p.name,exercise:g.challenge.exercise,kind,repetitions:g.challenge.cap?Math.min(repetitions,g.challenge.cap):repetitions};
  const dart={kind,base,multiplier,points,before,after:p.score,overflow,victims:victims.map(q=>q.name),player:p.name,playerId:p.id,round:g.round,slot:g.darts.length+1,challenge:g.pendingChallenge};
  g.darts.push(dart);g.log.push(dart);
  if(p.score===g.target){g.winner=p.id;g.finishedAt=new Date().toISOString();}
  return {game:g,event:dart};
}
export function nextTurn(previous){
  if(previous.darts.length!==3||previous.winner||previous.pendingChallenge) throw Error('La volée doit être terminée.');
  const g=clone(previous);g.current=(g.current+1)%g.players.length;if(g.current===0)g.round++;g.darts=[];g.turnPoints=0;return g;
}
export function leaderboard(players,history){return players.map(p=>{const games=history.filter(g=>g.players.some(q=>q.id===p.id));return {...p,games:games.length,wins:games.filter(g=>g.winner===p.id).length,kills:games.reduce((n,g)=>n+g.players.find(q=>q.id===p.id).kills,0)};}).sort((a,b)=>b.wins-a.wins||b.kills-a.kills||a.name.localeCompare(b.name));}
