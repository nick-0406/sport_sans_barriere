// js/accessibility.js
// Widget accessibilité : contraste, taille texte, dyslexie, liens soulignés.
// Les préférences sont sauvegardées dans localStorage et restaurées à chaque page.

(function(){

  /* ── INJECT HTML ──────────────────────────────────────────── */

  const html = `
    <button class="a11y-trigger" id="a11yTrigger"
            aria-label="Ouvrir le menu d'accessibilité"
            aria-expanded="false"
            aria-controls="a11yPanel">
      <i class="fa-solid fa-universal-access"></i>
    </button>

    <div class="a11y-panel" id="a11yPanel" role="dialog"
         aria-label="Options d'accessibilité" aria-modal="false">

      <h3><i class="fa-solid fa-universal-access"></i> Accessibilité</h3>

      <!-- Taille du texte -->
      <div class="a11y-section">
        <label>Taille du texte</label>
        <div class="a11y-font-btns">
          <button class="a11y-font-btn active" data-size="normal"
                  aria-label="Taille normale">A</button>
          <button class="a11y-font-btn" data-size="md"
                  aria-label="Taille moyenne" style="font-size:1.1rem">A</button>
          <button class="a11y-font-btn" data-size="lg"
                  aria-label="Grande taille" style="font-size:1.3rem">A</button>
          <button class="a11y-font-btn" data-size="xl"
                  aria-label="Très grande taille" style="font-size:1.6rem">A</button>
        </div>
      </div>

      <!-- Toggles -->
      <div class="a11y-section">
        <label>Options visuelles</label>

        <div class="a11y-toggle-row">
          <span>Contraste élevé</span>
          <label class="a11y-toggle">
            <input type="checkbox" id="a11yContrast">
            <span class="a11y-slider"></span>
          </label>
        </div>

        <div class="a11y-toggle-row">
          <span>Police dyslexie</span>
          <label class="a11y-toggle">
            <input type="checkbox" id="a11yDyslexia">
            <span class="a11y-slider"></span>
          </label>
        </div>

        <div class="a11y-toggle-row">
          <span>Liens soulignés</span>
          <label class="a11y-toggle">
            <input type="checkbox" id="a11yLinks">
            <span class="a11y-slider"></span>
          </label>
        </div>

      </div>

      <button class="a11y-reset" id="a11yReset">
        <i class="fa-solid fa-rotate-left"></i> Réinitialiser
      </button>

    </div>`;

  document.body.insertAdjacentHTML('beforeend', html);

  /* ── ELEMENTS ─────────────────────────────────────────────── */

  const trigger      = document.getElementById('a11yTrigger');
  const panel        = document.getElementById('a11yPanel');
  const contrastChk  = document.getElementById('a11yContrast');
  const dyslexiaChk  = document.getElementById('a11yDyslexia');
  const linksChk     = document.getElementById('a11yLinks');
  const fontBtns     = document.querySelectorAll('.a11y-font-btn');
  const resetBtn     = document.getElementById('a11yReset');
  const body         = document.body;

  /* ── OPEN / CLOSE ─────────────────────────────────────────── */

  trigger.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('open');
    trigger.setAttribute('aria-expanded', isOpen);
  });

  // Fermer en cliquant en dehors
  document.addEventListener('click', e => {
    if(!panel.contains(e.target) && e.target !== trigger){
      panel.classList.remove('open');
      trigger.setAttribute('aria-expanded', false);
    }
  });

  // Fermer avec Escape
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape') panel.classList.remove('open');
  });

  /* ── APPLY PREFERENCES ────────────────────────────────────── */

  function applyContrast(on){
    body.classList.toggle('a11y-contrast', on);
    contrastChk.checked = on;
  }

  function applyDyslexia(on){
    body.classList.toggle('a11y-dyslexia', on);
    dyslexiaChk.checked = on;
  }

  function applyLinks(on){
    body.classList.toggle('a11y-links', on);
    linksChk.checked = on;
  }

  function applyFontSize(size){
    ['normal','md','lg','xl'].forEach(s => body.classList.remove(`a11y-text-${s}`));
    if(size !== 'normal') body.classList.add(`a11y-text-${size}`);
    fontBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.size === size);
    });
  }

  /* ── SAVE / LOAD ──────────────────────────────────────────── */

  function save(){
    try {
      localStorage.setItem('a11y', JSON.stringify({
        contrast : contrastChk.checked,
        dyslexia : dyslexiaChk.checked,
        links    : linksChk.checked,
        fontSize : [...fontBtns].find(b => b.classList.contains('active'))?.dataset.size || 'normal',
      }));
    } catch(e){ /* localStorage indisponible — silencieux */ }
  }

  function load(){
    try {
      const stored = JSON.parse(localStorage.getItem('a11y') || '{}');
      if(stored.contrast ) applyContrast(true);
      if(stored.dyslexia ) applyDyslexia(true);
      if(stored.links    ) applyLinks(true);
      if(stored.fontSize ) applyFontSize(stored.fontSize);
    } catch(e){}
  }

  /* ── EVENTS ───────────────────────────────────────────────── */

  contrastChk.addEventListener('change', () => {
    applyContrast(contrastChk.checked);
    save();
  });

  dyslexiaChk.addEventListener('change', () => {
    applyDyslexia(dyslexiaChk.checked);
    save();
  });

  linksChk.addEventListener('change', () => {
    applyLinks(linksChk.checked);
    save();
  });

  fontBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      applyFontSize(btn.dataset.size);
      save();
    });
  });

  resetBtn.addEventListener('click', () => {
    applyContrast(false);
    applyDyslexia(false);
    applyLinks(false);
    applyFontSize('normal');
    try { localStorage.removeItem('a11y'); } catch(e){}
  });

  // Restaurer les préférences au chargement
  load();

})();
