/* FreeFire Performance Hub - script.js
   - Password create/unlock/change using SHA-256 (SubtleCrypto)
   - App UI hidden until unlocked
   - Device heuristics, FPS counter, simulated boosts
   - Attempt to open Free Fire via intent/URL (best-effort)
*/

const STORAGE_KEY = 'ff_booster_pw_hash_v1';
const lock = document.getElementById('lock');
const app = document.getElementById('app');
const pwInput = document.getElementById('pw');
const unlockBtn = document.getElementById('unlock');
const createBtn = document.getElementById('createBtn');
const lockTitle = document.getElementById('lockTitle');
const lockMsg = document.getElementById('lockMsg');
const changePasswordBtn = document.getElementById('changePassword');
const clearStorageBtn = document.getElementById('clearStorage');
const deviceNameEl = document.getElementById('deviceName');
const ramEl = document.getElementById('ram');
const storageEl = document.getElementById('storage');
const fpsEl = document.getElementById('fps');
const modeButtons = document.querySelectorAll('.modes .mode');
const netBoost = document.getElementById('netBoost');
const gfxBoost = document.getElementById('gfxBoost');
const maxFpsBtn = document.getElementById('maxFps');
const applyAllBtn = document.getElementById('applyAll');

// --- Crypto helper: SHA-256 hex ---
async function sha256Hex(str){
  const enc = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

// --- Initialize lock UI ---
async function initLock(){
  const stored = localStorage.getItem(STORAGE_KEY);
  if(!stored){
    lockTitle.textContent = 'Create a Password';
    createBtn.style.display = 'inline-block';
    unlockBtn.style.display = 'none';
    lockMsg.textContent = 'No password found. Create one to protect the booster.';
  } else {
    lockTitle.textContent = 'Enter Password';
    createBtn.style.display = 'none';
    unlockBtn.style.display = 'inline-block';
    lockMsg.textContent = '';
  }
}
initLock();

// --- Create password ---
createBtn.onclick = async ()=>{
  const val = pwInput.value.trim();
  if(val.length < 6){ alert('Choose at least 6 characters'); return; }
  const hash = await sha256Hex(val);
  localStorage.setItem(STORAGE_KEY, hash);
  pwInput.value = '';
  alert('Password created. Please unlock to continue.');
  initLock();
};

// --- Unlock ---
unlockBtn.onclick = async ()=>{
  const val = pwInput.value;
  if(!val) return;
  const hash = await sha256Hex(val);
  const stored = localStorage.getItem(STORAGE_KEY);
  if(stored && hash === stored){
    // success
    lock.style.display = 'none';
    app.style.display = 'block';
    lock.setAttribute('aria-hidden','true');
    app.setAttribute('aria-hidden','false');
    pwInput.value = '';
    startApp();
  } else {
    alert('Wrong password');
  }
};

// --- Change password (protected) ---
changePasswordBtn.onclick = async ()=>{
  const current = prompt('Enter current password to change it:');
  if(!current) return;
  const curHash = await sha256Hex(current);
  if(curHash !== localStorage.getItem(STORAGE_KEY)){ alert('Incorrect current password'); return; }
  const next = prompt('Enter new password (min 6 chars):');
  if(!next || next.length < 6){ alert('Invalid new password'); return; }
  const nextHash = await sha256Hex(next);
  localStorage.setItem(STORAGE_KEY, nextHash);
  alert('Password changed successfully');
};

// --- Reset local data (for testing) ---
clearStorageBtn.onclick = ()=>{
  if(confirm('This will clear local data including the saved password. Proceed?')){
    localStorage.removeItem(STORAGE_KEY);
    alert('Local data cleared. Reloading page.');
    location.reload();
  }
};

// --- Device heuristics ---
deviceNameEl.textContent = navigator.userAgent || 'Unknown';
if(navigator.deviceMemory) ramEl.textContent = navigator.deviceMemory + ' GB';
else ramEl.textContent = 'N/A';

if(navigator.storage && navigator.storage.estimate){
  navigator.storage.estimate().then(e=>{
    const used = (e.usage/1e9).toFixed(2), quota=(e.quota/1e9).toFixed(2);
    storageEl.textContent = `${used} GB / ${quota} GB`;
  }).catch(()=> storageEl.textContent = 'N/A');
} else storageEl.textContent = 'N/A';

// --- Live FPS counter ---
let frames = 0, last = performance.now();
function fpsTick(t){
  frames++;
  if(t - last >= 1000){
    fpsEl.textContent = frames;
    frames = 0;
    last = t;
  }
  requestAnimationFrame(fpsTick);
}
requestAnimationFrame(fpsTick);

// --- Mode buttons (simulated) ---
modeButtons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const mode = btn.dataset.mode;
    // visual feedback
    btn.animate([{transform:'scale(1)'},{transform:'scale(1.06)'}],{duration:220,fill:'forwards'});
    document.body.animate([{filter:'none'},{filter:'brightness(1.06)'}],{duration:420,fill:'forwards'});
    // simulate applying
    showToast(`Applied ${mode.toUpperCase()} mode (simulated)`);
  });
});

// --- Max FPS button ---
maxFpsBtn.onclick = ()=>{
  const proceed = confirm('Setting max FPS to 119 may not be supported by your device. Proceed?');
  if(!proceed) return;
  showToast('Max FPS applied (simulated). If your device supports higher refresh, native settings required.');
};

// --- Apply All & Launch Free Fire ---
applyAllBtn.onclick = ()=>{
  // dramatic animation
  document.body.animate([{opacity:1},{opacity:0.18,transform:'scale(1.02)'}],{duration:900,fill:'forwards'});
  showToast('Applying settings and launching Free Fire...');
  setTimeout(()=> {
    // Try Android intent first (best-effort). On desktop this will do nothing or show an error.
    // This is a best-effort attempt; browsers/OS may block or ignore it.
    const intent = 'intent://#Intent;package=com.dts.freefireth;end';
    // fallback URL scheme (may not exist)
    const scheme = 'freefire://';
    // attempt intent
    try {
      window.location.href = intent;
      // also try scheme after a short delay
      setTimeout(()=> { window.location.href = scheme; }, 800);
    } catch(e){
      // nothing to do; show message
      showToast('Could not open app automatically. Please open Free Fire manually.');
    }
  }, 900);
};

// --- Simple toast for feedback ---
function showToast(msg){
  let t = document.getElementById('ff-toast');
  if(!t){
    t = document.createElement('div');
    t.id = 'ff-toast';
    t.style.position = 'fixed';
    t.style.right = '18px';
    t.style.bottom = '18px';
    t.style.background = 'linear-gradient(90deg,var(--accent),var(--accent2))';
    t.style.color = '#fff';
    t.style.padding = '12px 16px';
    t.style.borderRadius = '12px';
    t.style.boxShadow = '0 8px 30px rgba(2,6,12,0.6)';
    t.style.fontWeight = '700';
    t.style.zIndex = 2000;
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.animate([{opacity:0, transform:'translateY(8px)'},{opacity:1, transform:'translateY(0)'}],{duration:260,fill:'forwards'});
  clearTimeout(t._hideTimeout);
  t._hideTimeout = setTimeout(()=> {
    t.animate([{opacity:1},{opacity:0, transform:'translateY(8px)'}],{duration:260,fill:'forwards'});
  }, 2200);
}

// --- Start app (called after unlock) ---
function startApp(){
  // any additional initialization can go here
  showToast('Welcome to FreeFire Performance Hub');
}
