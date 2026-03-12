const projectsContainer = document.getElementById('projects');

async function loadProjects(){
  if(!projectsContainer) return;
  try{
    const res = await fetch('projects.json');
    if(!res.ok) throw new Error('projects.json not found');
    const list = await res.json();
    renderProjects(list);
  }catch(e){
    projectsContainer.innerHTML = '<p class="muted">Error 69: Project loading script is taking a nap.</p>';
    console.warn(e);
  }
}

function renderProjects(list){
  if(!Array.isArray(list) || list.length===0){
    projectsContainer.innerHTML = '<p class="muted">Error 2: Rendering fail (if you see this something is seriously wrong)</p>';
    return;
  }
  projectsContainer.innerHTML = '';
  // iterate in reverse order so newest items (last in JSON) appear first
  const reversed = list.slice().reverse();
  reversed.forEach(p=>{
    const thisCard = document.createElement('article');
    thisCard.className = 'card proj-card';
    thisCard.innerHTML = `
      <div class="cardTitle">${escapeHtml(p.title)}</div>
      <div class="meta">${escapeHtml(p.date || '')}</div>
      <p>${escapeHtml(p.description || 'n/a')}</p>
      <div class="tags">${(p.tags||[]).map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
      <div class="actions">${p.url?`<a href="${escapeAttr(p.url)}" target="_blank" rel="noopener">More</a>`:''}</div>
    `;
    projectsContainer.appendChild(thisCard);
  });
}

function escapeHtml(s){return String(s).replace(/[&<>\"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}
function escapeAttr(s){return String(s).replace(/\"/g,'&quot;')}

document.addEventListener('DOMContentLoaded',loadProjects);
