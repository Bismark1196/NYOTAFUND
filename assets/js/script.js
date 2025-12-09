// Mobile menu toggle and active link highlight
document.addEventListener('DOMContentLoaded', () => {
  // Active link
  const links = document.querySelectorAll('.links a');
  const current = location.pathname.split('/').pop() || 'index.html';
  links.forEach(a=>{
    const href = a.getAttribute('href');
    if(href === current || (href === 'index.html' && current === '')) a.classList.add('active');
  });

  // Mobile menu
  const menuBtn = document.querySelector('.menu-btn');
  const mobilePanel = document.querySelector('.mobile-panel');
  if(menuBtn){
    menuBtn.addEventListener('click', ()=>{
      mobilePanel.classList.toggle('active');
    });
  }

  // Close mobile panel when clicking a link
  document.querySelectorAll('.mobile-panel a').forEach(a=>{
    a.addEventListener('click', ()=> mobilePanel.classList.remove('active'));
  });
});
