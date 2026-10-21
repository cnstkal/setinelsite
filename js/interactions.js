/* ===== ORIGINAL SCRIPT BLOCK 11 ===== */

(function(){
const go=e=>{
 const r=e.target.closest('[data-apostle-href],[data-sentinel-href],.apostle-row[data-href],.sentinel-row[data-href]');
 if(!r||e.target.closest('button,input,select,textarea,a,.adm-bar,.admin-edit-btn'))return;
 if(document.body.classList.contains('photo-admin')&&e.target.closest('.apostle-photo,.sentinel-photo'))return;
 if(e.type==='keydown'&&e.key!=='Enter'&&e.key!==' ')return;
 e.preventDefault();
 const h=r.dataset.apostleHref||r.dataset.sentinelHref||r.dataset.href;
 if(h&&location.hash!==h)location.hash=h;
};
document.addEventListener('click',go);document.addEventListener('keydown',go);
})();

/* ===== SITE EASTER EGGS ===== */
(function(){
 const seenKey='ssa_easter_eggs_v1';
 const seen=()=>{try{return JSON.parse(localStorage.getItem(seenKey)||'{}')}catch(e){return{}}};
 const mark=k=>{const x=seen();x[k]=1;try{localStorage.setItem(seenKey,JSON.stringify(x))}catch(e){}};

 function popup(title,body){
  if(document.getElementById('ssa-easter-popup'))return;
  const o=document.createElement('div');o.id='ssa-easter-popup';
  o.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(8,24,44,.48);display:flex;align-items:center;justify-content:center;padding:20px';
  o.innerHTML='<div style="width:min(440px,100%);background:#fff;border:1px solid #b9c7d8;border-radius:8px;box-shadow:0 18px 60px rgba(0,0,0,.22);overflow:hidden"><div style="padding:14px 18px;background:#103c70;color:#fff;font-weight:700">'+title+'</div><div style="padding:20px 18px;color:#26384d;line-height:1.75;font-size:13px">'+body+'</div><div style="padding:10px 18px;border-top:1px solid #e5eaf0;text-align:right"><button type="button" style="border:0;border-radius:4px;background:#1557a6;color:#fff;padding:7px 14px;cursor:pointer">확인</button></div></div>';
  o.querySelector('button').onclick=()=>o.remove();o.onclick=e=>{if(e.target===o)o.remove()};document.body.appendChild(o);
 }

 /* 1. 청 로고를 짧은 시간 안에 7회 클릭 */
 let clicks=0,timer=0;
 document.addEventListener('click',e=>{
  const logo=e.target.closest('.emblem,.brand');
  if(!logo)return;
  clicks++;clearTimeout(timer);timer=setTimeout(()=>clicks=0,1600);
  if(clicks>=7){
   clicks=0;mark('logo');
   popup('시스템 점검 기록','2007년 3월 14일, 중앙 관제 서버에서 11초간 미확인 신호가 감지되었습니다.<br><br><small>※ 현재까지 원인은 확인되지 않았습니다.</small>');
  }
 });

 /* 2. 검색창에 특정 문자열을 입력 */
 document.addEventListener('submit',e=>{
  const form=e.target.closest('#siteSearch');if(!form)return;
  const input=document.getElementById('searchInput'),v=(input?.value||'').trim().toLowerCase();
  if(v==='관제실' || v==='control room'){
   e.preventDefault();mark('control');
   popup('내부 문서 열람','문서번호 SSA-INT-041<br><br>해당 문서는 공개 대상이 아닙니다.<br><br><small>접근 기록이 남았습니다.</small>');
  }
 });

 /* 3. 키보드 비밀 입력 */
 let seq='';
 const secret='sentinel';
 document.addEventListener('keydown',e=>{
  if(e.key.length!==1)return;
  seq=(seq+e.key.toLowerCase()).slice(-secret.length);
  if(seq===secret){
   seq='';mark('keyboard');
   popup('인증 완료','<strong>환영합니다.</strong><br><br>이 화면을 발견했다면 당신은 이미 충분히 오래 이 사이트를 둘러보고 있습니다.<br><br><small>SSA / INTERNAL ARCHIVE</small>');
  }
 });

 /* 4. 특정 연혁 항목을 길게 누르기 */
 let pressTimer;
 document.addEventListener('pointerdown',e=>{
  const h=e.target.closest('.history-list article');if(!h)return;
  pressTimer=setTimeout(()=>{
   mark('history');
   popup('기록 열람','기록 보존 상태: 정상<br>원본 문서와 대조 완료<br><br><small>일부 기록은 의도적으로 공개되지 않았습니다.</small>');
  },1800);
 });
 document.addEventListener('pointerup',()=>clearTimeout(pressTimer));
 document.addEventListener('pointercancel',()=>clearTimeout(pressTimer));
})();

/* Admin mode removed: no fallback admin toggle. */
