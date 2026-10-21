/* Sentinel portal community/account/staff chat UI.
   Static-host demo: localStorage is not secure authentication or shared realtime storage. */
(function(){
'use strict';
const STORE='sentinel_portal_demo_v1';
const read=()=>{try{return JSON.parse(localStorage.getItem(STORE))||{user:null,posts:[],messages:[]}}catch(e){return {user:null,posts:[],messages:[]}}};
const save=s=>localStorage.setItem(STORE,JSON.stringify(s));
let state=read(), activeTab='all', activeRoom='공지·업무', modal=null;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=(sel,root=document)=>root.querySelector(sel);
function ensureActions(){
 const header=$('header')||$('.header-top')||$('.header-search');
 if(!header||$('#sentinel-extra-actions'))return;
 const actions=document.createElement('div');actions.id='sentinel-extra-actions';actions.className='sentinel-extra-actions';
 actions.innerHTML='<button class="primary" data-feature="login">로그인</button>';actions.style.display='flex';actions.style.visibility='visible';actions.style.opacity='1';
 const util=$('.header-top .container',header)||$('.header-top',header)||header;util.appendChild(actions);
}
function open(title,subtitle,content){
 close();modal=document.createElement('div');modal.className='sentinel-feature-layer';modal.innerHTML='<section class="sentinel-feature-dialog" role="dialog" aria-modal="true" aria-label="'+esc(title)+'"><header class="sentinel-feature-head"><div><h2>'+esc(title)+'</h2><p>'+esc(subtitle)+'</p></div><button class="sentinel-feature-close" data-close>닫기 ✕</button></header><div class="sentinel-feature-body">'+content+'</div></section>';
 document.body.appendChild(modal);modal.addEventListener('click',e=>{if(e.target===modal||e.target.closest('[data-close]'))close();});modal.addEventListener('submit',handleSubmit);modal.addEventListener('click',handleClick);
}
function close(){if(modal){modal.remove();modal=null}}
function accountContent(){return '<div class="sentinel-feature-grid"><section class="sentinel-feature-panel"><h3>로그인</h3><div class="inner"><form class="sentinel-feature-form" data-form="login"><label>아이디<input name="id" autocomplete="username" required></label><label>비밀번호<input name="password" type="password" autocomplete="current-password" required></label><button class="sentinel-feature-btn">로그인</button></form><p class="sentinel-feature-muted">직원 시연 계정: <b>staff-demo</b> / <b>sentinel2026</b></p></div></section><section class="sentinel-feature-panel"><h3>계정 안내</h3><div class="inner"><p>커뮤니티 글 작성과 직원 전용 채팅은 로그인 후 이용할 수 있어요.</p><p class="sentinel-feature-muted">현재는 정적 사이트용 시연 기능이에요. 계정과 대화는 이 브라우저에만 저장되며, 실제 보안 인증이나 여러 사용자 간 실시간 채팅은 제공하지 않아요.</p><button class="sentinel-feature-btn secondary" data-feature="community">커뮤니티 둘러보기</button></div></section></div>'}
function communityContent(){
 const posts=state.posts.filter(p=>activeTab==='all'||(activeTab==='notice'?p.category==='공지':p.category==='자유'));
 return '<div class="sentinel-feature-tabs"><button data-tab="all" class="'+(activeTab==='all'?'active':'')+'">전체글</button><button data-tab="notice" class="'+(activeTab==='notice'?'active':'')+'">공지사항</button><button data-tab="free" class="'+(activeTab==='free'?'active':'')+'">자유게시판</button></div>'+
 (state.user?'<section class="sentinel-feature-panel" style="margin-bottom:18px"><h3>새 글 작성</h3><div class="inner"><form class="sentinel-feature-form" data-form="post"><label>게시판<select name="category"><option>자유</option><option>공지</option></select></label><label>제목<input name="title" maxlength="100" required></label><label>내용<textarea name="body" maxlength="5000" required></textarea></label><button class="sentinel-feature-btn">게시글 등록</button></form></div></section>':'<div class="sentinel-feature-alert">글을 작성하려면 먼저 로그인해 주세요. <button class="sentinel-feature-btn secondary" data-feature="login">로그인</button></div>')+
 (posts.length?posts.slice().reverse().map(p=>'<article class="sentinel-post"><div class="sentinel-post-top"><span>'+esc(p.category)+' 게시판 · '+esc(p.author)+'</span><time>'+esc(p.date)+'</time></div><h4>'+esc(p.title)+'</h4><p>'+esc(p.body)+'</p><div class="sentinel-post-actions"><button data-like="'+esc(p.id)+'">추천 '+p.likes+'</button></div></article>').join(''):'<div class="sentinel-feature-empty">등록된 게시글이 없어요.</div>');
}
function chatContent(){
 const rooms=['공지·업무','현장지원','직원 자유대화'];
 const msgs=state.messages.filter(m=>m.room===activeRoom);
 return '<div class="sentinel-feature-alert">직원 계정 전용 시연 채팅입니다. 메시지는 현재 브라우저에만 저장됩니다.</div><div class="sentinel-chat-layout"><aside class="sentinel-chat-rooms">'+rooms.map(r=>'<button data-room="'+esc(r)+'" class="'+(r===activeRoom?'active':'')+'">'+esc(r)+'</button>').join('')+'</aside><section class="sentinel-chat-main"><div class="sentinel-chat-messages">'+(msgs.length?msgs.map(m=>'<article class="sentinel-chat-message '+(state.user&&m.author===state.user.id?'mine':'')+'"><small>'+esc(m.author)+' · '+esc(m.time)+'</small>'+esc(m.text)+'</article>').join(''):'<div class="sentinel-feature-empty">아직 메시지가 없습니다.</div>')+'</div><form class="sentinel-chat-compose" data-form="chat"><input name="message" maxlength="1000" placeholder="직원 채팅 메시지 입력…" required><button class="sentinel-feature-btn">전송</button></form></section></div>';
}
function showLogin(){open('센티넬관리청 통합 로그인','통합 계정으로 커뮤니티 및 직원 서비스를 이용하세요.',accountContent())}
function showCommunity(){open('커뮤니티','공지사항과 자유게시판을 확인하고 의견을 나눌 수 있습니다.',communityContent())}
function showChat(){if(!state.user||state.user.role!=='staff'){showLogin();return}open('직원 전용 커뮤니티 채팅','직원 간 업무 공지와 현장 지원 내용을 공유합니다.',chatContent())}
function refresh(){if(!modal)return;const title=$('.sentinel-feature-head h2',modal)?.textContent;if(title==='커뮤니티')showCommunity();else if(title==='직원 전용 커뮤니티 채팅')showChat();else showLogin()}
function handleSubmit(e){
 const form=e.target.closest('form[data-form]');if(!form)return;e.preventDefault();const fd=new FormData(form);
 if(form.dataset.form==='login'){
  const id=String(fd.get('id')||'').trim(),pw=String(fd.get('password')||'');
  if(id==='staff-demo'&&pw==='sentinel2026'){state.user={id,role:'staff'};save(state);open('로그인 완료','직원 계정으로 로그인했습니다.','<div class="sentinel-feature-alert">직원 계정으로 로그인했어요. 이제 직원 전용 채팅을 이용할 수 있습니다.</div><button class="sentinel-feature-btn" data-feature="chat">직원 채팅 열기</button>');ensureActions();return}
  if(id&&pw){state.user={id,role:'member'};save(state);open('로그인 완료','커뮤니티 계정으로 로그인했습니다.','<div class="sentinel-feature-alert">'+esc(id)+' 계정으로 이 브라우저에서 로그인했어요.</div><button class="sentinel-feature-btn" data-feature="community">커뮤니티 열기</button>');return}
 }
 if(form.dataset.form==='post'){
  if(!state.user){showLogin();return}state.posts.push({id:String(Date.now()),category:String(fd.get('category')),title:String(fd.get('title')).trim(),body:String(fd.get('body')).trim(),author:state.user.id,date:new Date().toLocaleString('ko-KR'),likes:0});save(state);activeTab='all';showCommunity();return;
 }
 if(form.dataset.form==='chat'){
  if(!state.user||state.user.role!=='staff'){showLogin();return}const message=String(fd.get('message')||'').trim();if(!message)return;state.messages.push({room:activeRoom,author:state.user.id,text:message,time:new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})});save(state);showChat();
 }
}
function handleClick(e){
 const feature=e.target.closest('[data-feature]');if(feature){e.preventDefault();const f=feature.dataset.feature;if(f==='login')showLogin();if(f==='community')showCommunity();if(f==='chat')showChat();return}
 const tab=e.target.closest('[data-tab]');if(tab){activeTab=tab.dataset.tab;showCommunity();return}
 const room=e.target.closest('[data-room]');if(room){activeRoom=room.dataset.room;showChat();return}
 const like=e.target.closest('[data-like]');if(like){const p=state.posts.find(x=>x.id===like.dataset.like);if(p){p.likes++;save(state);showCommunity()}return}
}
document.addEventListener('click',e=>{const f=e.target.closest('[data-feature]');if(f&&!modal){const v=f.dataset.feature;if(v==='login')showLogin();else if(v==='community')showCommunity();else if(v==='chat')showChat()}});


})();

/* 메뉴 시작점=헤더 콘텐츠 왼쪽 끝, 끝점=검색창 오른쪽 끝 (데스크톱) */
(function(){
 function alignNav(){
  var nav=document.querySelector('.main-nav .nav-inner');
  var brand=document.querySelector('.header-top .emblem');
  var sf=document.querySelector('.header-top .search-form');
  if(!nav||!brand||!sf)return;
  if(window.innerWidth<1101){nav.style.marginLeft='';nav.style.width='';return;}
  var L=nav.parentElement.getBoundingClientRect().left;
  var R=sf.getBoundingClientRect().right;
  var P=nav.parentElement.getBoundingClientRect().left;
  nav.style.marginLeft=(L-P)+'px';
  nav.style.width=(R-L)+'px';
 }
 window.addEventListener('resize',alignNav);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',alignNav);else alignNav();
 window.addEventListener('load',alignNav);
})();
