const PASSWORD = "freefire123";
const lock = document.getElementById('lock');
document.getElementById('unlock').onclick = ()=>{
  if(document.getElementById('pw').value===PASSWORD) lock.style.display='none';
  else alert('Wrong password');
};

document.getElementById('deviceName').textContent = navigator.userAgent.split(')')[0] || 'Unknown';
if(navigator.deviceMemory) document.getElementById('ram').textContent = navigator.deviceMemory + ' GB';
else document.getElementById('ram').textContent = 'N/A';

if(navigator.storage && navigator.storage.estimate){
  navigator.storage.estimate().then(e=>{
    const used = (e.usage/1e9).toFixed(2), quota=(e.quota/1e9).toFixed(2);
    document.getElementById('storage').textContent = `${used}GB / ${quota}GB`;
  });
} else document.getElementById('storage').textContent='N/A';

let frames=0,last=performance.now(),fps=0;
function tick(t){
  frames++;
  if(t-last>=1000){fps=frames;frames=0;last=t;document.getElementById('fps').textContent=fps;}
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

document.querySelectorAll('.modes button').forEach(b=>{
  b.onclick=()=>{
    document.body.animate([{filter:'brightness(1)'},{filter:'brightness(1.2)'}],{duration:600,fill:'forwards'});
    b.animate([{transform:'scale(1)'},{transform:'scale(1.06)'}],{duration:300});
    alert('Applied '+b.dataset.mode+' mode (simulated)');
  };
});

document.getElementById('maxFps').onclick=()=>{
  if(confirm('Setting max FPS to 119 may not be supported by your device. Proceed?')){
    alert('Max FPS applied (simulated).');
  }
};

document.getElementById('applyAll').onclick=()=>{
  document.body.animate([{opacity:1},{opacity:0.2,transform:'scale(1.02)'}],{duration:900,fill:'forwards'});
  setTimeout(()=>{ // attempt to open Free Fire (Android intent example)
    window.location.href = 'intent://#Intent;package=com.dts.freefireth;end';
  },900);
};
