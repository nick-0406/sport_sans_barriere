// js/rejoindre.js
// Formulaire multi-étapes avec routage par profil + envoi EmailJS.
//
// CONFIGURATION EmailJS (même compte que contact.js) :
// Créez un 2e template pour les candidatures. Variables disponibles :
// {{profil}}, {{prenom}}, {{nom}}, {{email}}, {{pays}},
// {{complement}} (champ libre avec les infos spécifiques au profil)
//
// Remplacez les 3 constantes ci-dessous.

const RJ_SERVICE_ID  = 'VOTRE_SERVICE_ID';
const RJ_TEMPLATE_ID = 'VOTRE_TEMPLATE_CANDIDATURE_ID';
const RJ_PUBLIC_KEY  = 'VOTRE_PUBLIC_KEY';

(function(){

  let selectedProfile = null;

  /* ── ÉTAPE 1 : sélection du profil ──────────────────────── */

  document.querySelectorAll('.profile-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.profile-card')
        .forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedProfile = card.dataset.profile;

      // petit délai pour que l'animation "selected" soit visible
      setTimeout(() => goToStep(2), 280);
    });
  });

  /* ── NAVIGATION ENTRE ÉTAPES ─────────────────────────────── */

  window.goToStep = function(step){

    // Masquer toutes les étapes 2
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));

    if(step === 1){
      document.getElementById('step1').classList.add('active');
      updateIndicator(1);
      return;
    }

    if(step === 2){
      const target = document.getElementById(`step2-${selectedProfile}`);
      if(target){
        target.classList.add('active');
        target.scrollIntoView({ behavior:'smooth', block:'start' });
      }
      updateIndicator(2);
    }

  };

  /* ── INDICATEUR D'ÉTAPES ─────────────────────────────────── */

  function updateIndicator(active){
    for(let i = 1; i <= 3; i++){
      const dot  = document.getElementById(`dot-${i}`);
      const line = document.getElementById(`line-${i}`);
      if(!dot) continue;

      dot.classList.toggle('active', i === active);
      dot.classList.toggle('done',   i < active);
      if(line) line.classList.toggle('done', i < active);
    }
  }

  /* ── VALIDATION LÉGÈRE ───────────────────────────────────── */

  function getRequiredFields(profile){
    const map = {
      beneficiaire: ['b-prenom','b-nom','b-age','b-pays','b-email'],
      volontaire:   ['v-prenom','v-nom','v-email','v-pays','v-competences'],
      organisation: ['o-nom','o-contact','o-email','o-pays'],
      presse:       ['p-prenom','p-nom','p-media','p-email'],
    };
    return (map[profile] || []).map(id => document.getElementById(id)).filter(Boolean);
  }

  function validate(profile){
    let ok = true;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    getRequiredFields(profile).forEach(el => {
      el.style.borderColor = '';
      if(!el.value.trim()){
        el.style.borderColor = '#e74c3c';
        el.focus();
        ok = false;
      }
    });

    // email check
    const emailId = { beneficiaire:'b-email', volontaire:'v-email',
                      organisation:'o-email', presse:'p-email' }[profile];
    const emailEl = document.getElementById(emailId);
    if(emailEl && !emailRe.test(emailEl.value)){
      emailEl.style.borderColor = '#e74c3c';
      ok = false;
    }

    // rgpd check
    const rgpd = document.getElementById(`${profile[0]}-rgpd`) ||
                 document.querySelector(`#step2-${profile} [type=checkbox]`);
    if(rgpd && !rgpd.checked){
      rgpd.parentNode.style.outline = '2px solid #e74c3c';
      ok = false;
    } else if(rgpd){
      rgpd.parentNode.style.outline = '';
    }

    return ok;
  }

  /* ── BUILD EMAIL PAYLOAD ─────────────────────────────────── */

  function buildPayload(profile){

    const g = id => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };

    const base = { profil: profile };

    if(profile === 'beneficiaire'){
      const checked = document.querySelector('#step2-beneficiaire input[name=handicap]:checked');
      return { ...base,
        prenom:     g('b-prenom'), nom: g('b-nom'),
        email:      g('b-email'),  pays: g('b-pays'),
        complement: `Âge: ${g('b-age')} | Handicap: ${checked ? checked.value : 'non précisé'} | Sports: ${g('b-sport')} | Motivation: ${g('b-motivation')}`
      };
    }

    if(profile === 'volontaire'){
      return { ...base,
        prenom:     g('v-prenom'), nom: g('v-nom'),
        email:      g('v-email'),  pays: g('v-pays'),
        complement: `Compétences: ${g('v-competences')} | Dispo: ${g('v-dispo')} | Motivation: ${g('v-motivation')}`
      };
    }

    if(profile === 'organisation'){
      return { ...base,
        prenom:     g('o-contact'), nom: '',
        email:      g('o-email'),   pays: g('o-pays'),
        complement: `Organisation: ${g('o-nom')} | Poste: ${g('o-poste')} | Type partenariat: ${g('o-type')} | Message: ${g('o-message')}`
      };
    }

    if(profile === 'presse'){
      return { ...base,
        prenom:     g('p-prenom'), nom: g('p-nom'),
        email:      g('p-email'),  pays: 'N/A',
        complement: `Média: ${g('p-media')} | Type: ${g('p-type')} | Sujet: ${g('p-sujet')}`
      };
    }

    return base;
  }

  /* ── SUBMIT ──────────────────────────────────────────────── */

  window.submitForm = async function(profile){

    if(!validate(profile)) return;

    const btn = document.querySelector(`#step2-${profile} .btn-next`);
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi…';

    const payload = buildPayload(profile);

    // Pas encore configuré → simulation
    if(RJ_PUBLIC_KEY === 'VOTRE_PUBLIC_KEY'){
      await new Promise(r => setTimeout(r, 1200));
      showSuccess(profile);
      return;
    }

    try {
      await emailjs.send(RJ_SERVICE_ID, RJ_TEMPLATE_ID, payload, RJ_PUBLIC_KEY);
      showSuccess(profile);
    } catch(err){
      console.error('EmailJS error:', err);
      btn.disabled = false;
      btn.innerHTML = 'Envoyer <i class="fa-solid fa-paper-plane"></i>';
      alert("Une erreur est survenue. Merci de nous contacter directement à contact@sportssansbarrieres.org");
    }

  };

  /* ── ÉCRAN DE SUCCÈS ─────────────────────────────────────── */

  const messages = {
    beneficiaire: "Merci pour votre candidature ! Notre équipe l'examinera et vous contactera sous 5 jours ouvrés.",
    volontaire:   "Votre candidature de volontaire a bien été reçue. Nous reviendrons vers vous rapidement.",
    organisation: "Votre demande de partenariat a bien été transmise. Nous vous répondrons sous 5 jours ouvrés.",
    presse:       "Votre demande d'accréditation a été envoyée. Notre responsable presse vous contactera prochainement.",
  };

  function showSuccess(profile){
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.getElementById('stepIndicator').style.display = 'none';

    const screen = document.getElementById('successScreen');
    screen.classList.add('active');
    document.getElementById('successMessage').textContent =
      messages[profile] || messages.beneficiaire;

    screen.scrollIntoView({ behavior:'smooth', block:'center' });
    updateIndicator(3);
  }

})();
