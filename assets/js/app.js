/* Shared JS for Nyota Fund multi-page demo */

/* Navigation: highlight active link */
(function navActive(){
  const links = document.querySelectorAll('.links a');
  const loc = location.pathname.split('/').pop() || 'index.html';
  links.forEach(a=>{
    const href = a.getAttribute('href');
    if(href === loc || (href === 'index.html' && loc === '')) a.classList.add('active');
  });
})();

/* Mobile menu toggle */
const menuBtn = document.getElementById('menuBtn');
if(menuBtn){
  menuBtn.addEventListener('click', ()=>{
    const links = document.querySelector('.links');
    links.style.display = (links.style.display === 'flex') ? 'none' : 'flex';
  });
}

/* Apply form: validation + localStorage saving + file preview */
if(document.getElementById('applyForm')){
  const form = document.getElementById('applyForm');
  const feedback = document.getElementById('applyFeedback');
  const fileInput = document.getElementById('idUpload');
  const preview = document.getElementById('idPreview');

  // preview image
  fileInput.addEventListener('change', (e)=>{
    const file = e.target.files[0];
    if(!file) { preview.src=''; preview.style.display='none'; return; }
    if(!file.type.startsWith('image/')) { preview.src=''; preview.style.display='none'; return; }
    const reader = new FileReader();
    reader.onload = function(ev){ preview.src = ev.target.result; preview.style.display='block'; }
    reader.readAsDataURL(file);
  });

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    feedback.style.color='crimson';
    const data = {
      fullname: form.fullname.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      dob: form.dob.value,
      gender: form.gender.value,
      county: form.county.value.trim(),
      education: form.education.value,
      program: form.program.value,
      statement: form.statement.value.trim(),
      guardianName: form.guardianName.value.trim(),
      guardianPhone: form.guardianPhone.value.trim(),
      createdAt: new Date().toISOString()
    };

    // validate required
    if(!data.fullname) { feedback.textContent='Please enter full name'; return; }
    if(!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)){ feedback.textContent='Please enter a valid email'; return; }
    if(!data.phone || data.phone.length < 7){ feedback.textContent='Please enter a valid phone number'; return; }
    if(!data.program){ feedback.textContent='Please choose a program'; return; }
    if(!data.statement || data.statement.length < 50){ feedback.textContent='Personal statement must be at least 50 characters'; return; }

    // handle file (image) - convert to base64 if present (demo)
    if(fileInput.files[0]){
      const f = fileInput.files[0];
      if(f.size > 5 * 1024 * 1024){ feedback.textContent='ID file too large (max 5MB)'; return; }
      const reader = new FileReader();
      reader.onload = function(ev){
        data.idFile = {name: f.name, type: f.type, data: ev.target.result};
        saveApplication(data);
      }
      reader.readAsDataURL(f);
    } else {
      data.idFile = null;
      saveApplication(data);
    }
  });

  function saveApplication(data){
    const apps = JSON.parse(localStorage.getItem('nyota_applications') || '[]');
    apps.unshift(data);
    localStorage.setItem('nyota_applications', JSON.stringify(apps));
    feedback.style.color='green';
    feedback.textContent = 'Application submitted (demo). Thank you!';
    form.reset();
    preview.src=''; preview.style.display='none';
    // demonstrate where to find stored applications for now:
    console.log('Saved application (demo):', data);
    setTimeout(()=> feedback.textContent='', 3000);
  }
}

/* Contact & Subscribe forms (demo) */
if(document.getElementById('contactForm')){
  document.getElementById('contactForm').addEventListener('submit', function(e){
    e.preventDefault();
    const name = this.name.value.trim(), email = this.email.value.trim(), message = this.message.value.trim();
    if(!name||!email||!message){ alert('Complete all fields'); return; }
    const msgs = JSON.parse(localStorage.getItem('nyota_messages')||'[]');
    msgs.unshift({name,email,message, createdAt: new Date().toISOString()});
    localStorage.setItem('nyota_messages', JSON.stringify(msgs));
    alert('Message sent (demo).');
    this.reset();
  });
}
if(document.getElementById('subscribeForm')){
  document.getElementById('subscribeForm').addEventListener('submit', function(e){
    e.preventDefault();
    const email = this.subEmail.value.trim();
    if(!email){ alert('Email required'); return; }
    const subs = JSON.parse(localStorage.getItem('nyota_subs')||'[]');
    if(subs.includes(email)){ alert('Already subscribed (demo)'); return; }
    subs.push(email); localStorage.setItem('nyota_subs', JSON.stringify(subs));
    alert('Subscribed (demo). Thank you!');
    this.reset();
  });
}

/* Simple animated counters on pages with .num[data-target] */
function animateCountersOnce(){
  const els = document.querySelectorAll('.num[data-target]');
  els.forEach(el=>{
    const target = Number(el.dataset.target || 0);
    let cur = 0;
    const step = Math.max(1, Math.floor(target / 80));
    const intv = setInterval(()=>{
      cur += step;
      if(cur >= target){ el.textContent = target.toLocaleString(); clearInterval(intv); }
      else el.textContent = cur.toLocaleString();
    }, 12);
  });
}
document.addEventListener('DOMContentLoaded', ()=> {
  if(document.querySelectorAll('.num[data-target]').length) animateCountersOnce();
});
