// js/decouvrir.js
// Reads the DOCUMENTS array from documents.js and renders everything.
// Never needs to be modified when adding documents.

(function(){

  /* ── HELPERS ──────────────────────────────────────────────── */

  // Format "2025-06" → "Juin 2025"
  function formatDate(str){
    if(!str) return '';
    const [y, m] = str.split('-');
    const months = [
      'Janvier','Février','Mars','Avril','Mai','Juin',
      'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
    ];
    const label = months[parseInt(m, 10) - 1] || '';
    return `${label} ${y}`;
  }

  // Detect file type from extension → returns CSS class + icon
  function fileType(path){
    if(!path) return { cls:'type-other', icon:'fa-file' };
    const ext = path.split('.').pop().toLowerCase();
    if(ext === 'pdf')
      return { cls:'type-pdf',   icon:'fa-file-pdf'       };
    if(['doc','docx'].includes(ext))
      return { cls:'type-word',  icon:'fa-file-word'      };
    if(['ppt','pptx'].includes(ext))
      return { cls:'type-ppt',   icon:'fa-file-powerpoint' };
    if(['jpg','jpeg','png','gif','webp'].includes(ext))
      return { cls:'type-image', icon:'fa-file-image'     };
    return { cls:'type-other', icon:'fa-file' };
  }

  // Build one document card element
  function buildCard(doc){
    const available = doc.available !== false;
    const { cls, icon } = fileType(doc.file);

    const card = document.createElement('div');
    card.className = 'doc-card' + (available ? '' : ' unavailable');
    card.dataset.category = doc.category;
    card.dataset.title    = (doc.title + ' ' + (doc.description || '')).toLowerCase();

    // ── cover
    let coverHTML;
    if(doc.cover){
      coverHTML = `
        <div class="doc-cover has-image">
          <img src="${doc.cover}" alt="${doc.title}" loading="lazy">
          <span class="doc-category-badge">${doc.category}</span>
        </div>`;
    } else {
      coverHTML = `
        <div class="doc-cover ${cls}">
          <i class="fa-regular ${icon}"></i>
          <span class="doc-category-badge">${doc.category}</span>
        </div>`;
    }

    // ── meta row
    const metaItems = [];
    metaItems.push(`<span><i class="fa-regular fa-calendar"></i> ${formatDate(doc.date)}</span>`);
    if(doc.pages)
      metaItems.push(`<span><i class="fa-regular fa-file-lines"></i> ${doc.pages} pages</span>`);
    if(doc.lang)
      metaItems.push(`<span><i class="fa-solid fa-language"></i> ${doc.lang}</span>`);

    // ── action buttons
    let footerHTML;
    if(!available){
      footerHTML = `
        <div class="doc-footer">
          <span class="doc-btn soon">
            <i class="fa-solid fa-clock"></i> Bientôt disponible
          </span>
        </div>`;
    } else {
      footerHTML = `
        <div class="doc-footer">
          <a href="${doc.file}" download class="doc-btn primary">
            <i class="fa-solid fa-download"></i> Télécharger
          </a>
          <a href="${doc.file}" target="_blank" rel="noopener" class="doc-btn secondary"
             title="Ouvrir dans un nouvel onglet">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>`;
    }

    card.innerHTML = `
      ${coverHTML}
      <div class="doc-body">
        <p class="doc-title">${doc.title}</p>
        <p class="doc-desc">${doc.description || ''}</p>
        <div class="doc-meta">${metaItems.join('')}</div>
      </div>
      ${footerHTML}
    `;

    return card;
  }


  /* ── RENDER ───────────────────────────────────────────────── */

  const grid      = document.getElementById('documentsGrid');
  const emptyMsg  = document.getElementById('docsEmpty');
  const filterBar = document.getElementById('filterButtons');
  const searchEl  = document.getElementById('docSearch');

  if(!grid || typeof DOCUMENTS === 'undefined') return;

  // Build all cards once
  const cards = DOCUMENTS.map(buildCard);
  cards.forEach(c => grid.appendChild(c));

  // Build category filter buttons from actual data
  const categories = ['Tous', ...new Set(DOCUMENTS.map(d => d.category))];
  filterBar.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (cat === 'Tous' ? ' active' : '');
    btn.dataset.cat = cat;
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
    filterBar.appendChild(btn);
  });


  /* ── FILTER + SEARCH ──────────────────────────────────────── */

  function applyFilters(){
    const activeCat  = (filterBar.querySelector('.filter-btn.active') || {}).dataset?.cat || 'Tous';
    const query      = (searchEl?.value || '').toLowerCase().trim();
    let visibleCount = 0;

    cards.forEach(card => {
      const matchCat    = activeCat === 'Tous' || card.dataset.category === activeCat;
      const matchSearch = !query || card.dataset.title.includes(query);
      const show        = matchCat && matchSearch;
      card.style.display = show ? '' : 'none';
      if(show) visibleCount++;
    });

    emptyMsg.classList.toggle('hidden', visibleCount > 0);
  }

  if(searchEl){
    searchEl.addEventListener('input', applyFilters);
  }


  /* ── ANNOUNCE COUNT TO SCREEN READERS ────────────────────── */

  const liveRegion = document.createElement('p');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.className = 'sr-only';
  liveRegion.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)';
  grid.parentNode.insertBefore(liveRegion, grid);

})();
