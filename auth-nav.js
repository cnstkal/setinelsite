(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const J=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const S=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// 직원 계정 (사번:비밀번호) — 여기서 추가/수정
const STAFF={'SSA-0001':'staff1234','SSA-0002':'staff1234'};
const me=()=>J('ssa_auth',null),isStaff=()=>me()?.role==='staff';
const PAGES=['community','staff-community','staff-chat'];

// 스타일
document.head.insertAdjacentHTML('beforeend',`<style>
nav.util{display:flex;gap:6px;align-items:center;margin-left:auto}
nav.util button{border:1px solid #cfd8e3;background:#fff;border-radius:6px;padding:6px 12px;font-size:13px;cursor:pointer}
nav.util .au-name{font-size:13px;margin-right:4px}
.au-item:hover .mega,.au-item.au-open .mega{display:block}
.au-ov{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9999;display:flex;align-items:center;justify-content:center}
.au-ov form{background:#fff;padding:24px;border-radius:10px;width:min(340px,90vw);display:grid;gap:10px}
.au-ov h3{margin:0 0 4px}.au-ov input,.au-box input,.au-box textarea{padding:9px;border:1px solid #cfd8e3;border-radius:6px;font:inherit;width:100%;box-sizing:border-box}
.au-box form{display:grid;gap:8px;margin-bottom:16px}
.au-list article{border-bottom:1px solid #e3e8ef;padding:12px 4px}.au-list p{margin:4px 0}.au-list small{color:#68798b}
.au-chat{height:360px;overflow:auto;border:1px solid #e3e8ef;border-radius:8px;padding:12px;margin-bottom:10px}
.au-chat div{margin-bottom:8px}.au-chat small{color:#68798b;margin-left:6px}
#auChatForm{display:flex;gap:8px}
</style>`);

// 상단 로그인 영역
function util(){const u=$('nav.util');if(!u)return;const m=me();
u.innerHTML=m?`<span class="au-name">${esc(m.name)}님</span><button type="button" data-au="logout">로그아웃</button>`
:`<button type="button" data-au="login">로그인</button><button type="button" data-au="staff">직원 로그인</button><button type="button" data-au="join">회원가입</button>`}

// 커뮤니티 메뉴 (알림마당 옆)
function menu(){
$$('.au-item,.au-mob').forEach(e=>e.remove());
const L=[['community','자유게시판']];
if(isStaff())L.push(['staff-community','직원 전용 커뮤니티'],['staff-chat','직원 전용 채팅']);
const t=$$('.nav-trigger').find(b=>b.textContent.trim()==='알림마당');
t?.closest('.nav-item')?.insertAdjacentHTML('afterend',`<div class="nav-item au-item"><button class="nav-trigger" aria-expanded="false">커뮤니티</button><div class="mega"><div class="mega-inner"><div class="mega-title">커뮤니티<small>COMMUNITY</small></div><div class="mega-links">${L.map(x=>`<a href="#${x[0]}">${x[1]}</a>`).join('')}</div></div></div></div>`);
const d=$$('.mobile-panel-list summary').find(s=>s.textContent.trim()==='알림마당');
d?.parentElement.insertAdjacentHTML('afterend',`<details class="au-mob"><summary>커뮤니티</summary><div>${L.map(x=>`<a href="#${x[0]}">${x[1]}</a>`).join('')}</div></details>`)}

// 페이지 생성
function page(id,title,desc,body){if($('#'+id))return;const s=document.createElement('section');s.className='page';s.id=id;
s.innerHTML=`<div class="breadcrumb"><div class="container"><a href="#home">홈</a><span>›</span><strong>${title}</strong></div></div><div class="container pg-wrap"><div class="content-head"><h1>${title}</h1><p>${desc}</p></div>${body}</div>`;
$('#main').appendChild(s)}
const bd=k=>`<div class="au-box"><form data-bd="${k}"><input name="t" placeholder="제목" required><textarea name="c" rows="3" placeholder="내용" required></textarea><button class="rp-btn primary">등록</button></form><div class="au-list" data-list="${k}"></div></div>`;
function pages(){
page('community','자유게시판','누구나 이용할 수 있는 커뮤니티입니다. (글쓰기는 로그인 필요)',bd('ssa_cm'));
page('staff-community','직원 전용 커뮤니티','직원 로그인 회원만 열람·작성할 수 있습니다.',bd('ssa_scm'));
page('staff-chat','직원 전용 채팅','직원 간 내부 채팅입니다.','<div class="au-box"><div class="au-chat" id="auChat"></div><form id="auChatForm"><input name="m" placeholder="메시지 입력" autocomplete="off" required><button class="rp-btn primary">전송</button></form></div>')}
function draw(){
['ssa_cm','ssa_scm'].forEach(k=>{const l=$(`[data-list="${k}"]`);if(l)l.innerHTML=J(k,[]).map(p=>`<article><b>${esc(p.t)}</b><p>${esc(p.c)}</p><small>${esc(p.a)} · ${p.d}</small></article>`).join('')||'<p>게시글이 없습니다.</p>'});
const c=$('#auChat');if(c){c.innerHTML=J('ssa_chat',[]).map(m=>`<div><b>${esc(m.a)}</b><small>${m.d}</small><br>${esc(m.m)}</div>`).join('');c.scrollTop=c.scrollHeight}}

// 라우팅
function route(){const h=location.hash.slice(1).split('?')[0];if(!PAGES.includes(h))return;
if(h!=='community'&&!isStaff()){alert('직원 로그인 후 이용할 수 있습니다.');location.hash='#home';return}
$$('.page.active').forEach(p=>p.classList.remove('active'));$('#'+h).classList.add('active');scrollTo(0,0);draw()}

// 로그인/가입 모달
function modal(t){const T={login:'로그인',staff:'직원 로그인',join:'회원가입'}[t];
document.body.insertAdjacentHTML('beforeend',`<div class="au-ov"><form data-auf="${t}"><h3>${T}</h3>
<input name="id" placeholder="${t==='staff'?'직원 사번 (예: SSA-0001)':'아이디'}" required>
${t==='join'?'<input name="name" placeholder="이름(닉네임)" required>':''}
<input name="pw" type="password" placeholder="비밀번호" required>
<button class="rp-btn primary">${T}</button><button type="button" class="rp-btn" data-au="close">취소</button></form></div>`)}
const close=()=>$$('.au-ov').forEach(e=>e.remove());
function refresh(){util();menu();pages();if(PAGES.includes(location.hash.slice(1))||0)route();
if(!isStaff()&&/staff-/.test(location.hash))location.hash='#home'}

document.addEventListener('click',e=>{
const a=e.target.closest('[data-au]')?.dataset.au;
if(a==='logout'){localStorage.removeItem('ssa_auth');refresh()}
else if(a==='close')close();
else if(a)modal(a);
const tr=e.target.closest('.au-item .nav-trigger');
$$('.au-item').forEach(n=>n.classList.toggle('au-open',!!tr&&n===tr.parentElement&&!n.classList.contains('au-open')));
if(e.target.closest('.au-item .mega a'))$$('.au-item').forEach(n=>n.classList.remove('au-open'))});

document.addEventListener('submit',e=>{const f=e.target,t=f.dataset.auf;
if(t){e.preventDefault();const d=Object.fromEntries(new FormData(f)),u=J('ssa_users',{});
if(t==='join'){if(u[d.id])return alert('이미 사용 중인 아이디입니다.');u[d.id]={pw:d.pw,name:d.name};S('ssa_users',u);alert('가입이 완료되었습니다. 로그인해 주세요.');close();modal('login');return}
if(t==='login'){const x=u[d.id];if(!x||x.pw!==d.pw)return alert('아이디 또는 비밀번호가 올바르지 않습니다.');S('ssa_auth',{id:d.id,name:x.name,role:'user'})}
else{if(STAFF[d.id]!==d.pw)return alert('사번 또는 비밀번호가 올바르지 않습니다.');S('ssa_auth',{id:d.id,name:'직원 '+d.id,role:'staff'})}
close();refresh();return}
const k=f.dataset.bd;
if(k){e.preventDefault();const m=me();if(!m)return alert('로그인 후 작성할 수 있습니다.');
const d=Object.fromEntries(new FormData(f)),p=J(k,[]);p.unshift({t:d.t,c:d.c,a:m.name,d:new Date().toLocaleString('ko-KR')});S(k,p);f.reset();draw()}
if(f.id==='auChatForm'){e.preventDefault();const m=me();if(!isStaff())return;
const p=J('ssa_chat',[]);p.push({m:new FormData(f).get('m'),a:m.name,d:new Date().toLocaleTimeString('ko-KR')});S('ssa_chat',p.slice(-200));f.reset();draw()}});

addEventListener('hashchange',route);
addEventListener('storage',draw);
refresh();addEventListener('load',()=>{refresh();route()});
})();
