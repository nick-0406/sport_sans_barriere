// js/contact.js
// Gestion du formulaire de contact via EmailJS.
//
// CONFIGURATION :
// 1. Créez un compte gratuit sur https://www.emailjs.com
// 2. Créez un "Email Service" (Gmail, Outlook…) → notez SERVICE_ID
// 3. Créez un "Email Template" → notez TEMPLATE_ID
//    Variables à utiliser dans le template :
//    {{prenom}}, {{nom}}, {{email}}, {{objet}}, {{pays}}, {{message}}
// 4. Récupérez votre PUBLIC_KEY dans Account > API Keys
// 5. Remplacez les 3 constantes ci-dessous.

const EMAILJS_SERVICE_ID  = 'VOTRE_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'VOTRE_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY  = 'VOTRE_PUBLIC_KEY';

(function(){

  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('contactSubmit');
  const successEl = document.getElementById('contactSuccess');
  const errorEl   = document.getElementById('contactError');

  if(!form) return;

  /* ── VALIDATION ─────────────────────────────────────────── */

  function showFieldError(input, message){
    input.style.borderColor = '#e74c3c';
    let hint = input.parentNode.querySelector('.field-error');
    if(!hint){
      hint = document.createElement('span');
      hint.className = 'hint field-error';
      hint.style.color = '#e74c3c';
      input.parentNode.appendChild(hint);
    }
    hint.textContent = message;
  }

  function clearFieldError(input){
    input.style.borderColor = '';
    const hint = input.parentNode.querySelector('.field-error');
    if(hint) hint.remove();
  }

  function validateForm(){
    let valid = true;

    const prenom  = form.querySelector('#c-prenom');
    const nom     = form.querySelector('#c-nom');
    const email   = form.querySelector('#c-email');
    const objet   = form.querySelector('#c-objet');
    const message = form.querySelector('#c-message');
    const rgpd    = form.querySelector('#c-rgpd');

    [prenom, nom, email, objet, message].forEach(clearFieldError);

    if(!prenom.value.trim()){
      showFieldError(prenom, 'Veuillez saisir votre prénom.');
      valid = false;
    }

    if(!nom.value.trim()){
      showFieldError(nom, 'Veuillez saisir votre nom.');
      valid = false;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRe.test(email.value)){
      showFieldError(email, 'Adresse email invalide.');
      valid = false;
    }

    if(!objet.value){
      showFieldError(objet, 'Veuillez choisir un objet.');
      valid = false;
    }

    if(message.value.trim().length < 20){
      showFieldError(message, 'Le message doit contenir au moins 20 caractères.');
      valid = false;
    }

    if(!rgpd.checked){
      rgpd.parentNode.style.color = '#e74c3c';
      valid = false;
    } else {
      rgpd.parentNode.style.color = '';
    }

    return valid;
  }

  /* ── SUBMIT ──────────────────────────────────────────────── */

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    successEl.classList.remove('show');
    errorEl.classList.remove('show');

    if(!validateForm()) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours…';

    const params = {
      prenom:  form.querySelector('#c-prenom').value.trim(),
      nom:     form.querySelector('#c-nom').value.trim(),
      email:   form.querySelector('#c-email').value.trim(),
      objet:   form.querySelector('#c-objet').value,
      pays:    form.querySelector('#c-pays').value || 'Non renseigné',
      message: form.querySelector('#c-message').value.trim(),
    };

    // Si EmailJS n'est pas encore configuré, on simule un succès en dev
    if(EMAILJS_PUBLIC_KEY === 'VOTRE_PUBLIC_KEY'){
      await fakeDelay(1200);
      showSuccess();
      return;
    }

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        params,
        EMAILJS_PUBLIC_KEY
      );
      showSuccess();
    } catch(err) {
      console.error('EmailJS error:', err);
      showError();
    }

  });

  function showSuccess(){
    form.reset();
    successEl.classList.add('show');
    successEl.scrollIntoView({ behavior:'smooth', block:'center' });
    submitBtn.disabled = false;
    submitBtn.innerHTML =
      '<i class="fa-solid fa-paper-plane"></i> Envoyer le message';
  }

  function showError(){
    errorEl.classList.add('show');
    errorEl.scrollIntoView({ behavior:'smooth', block:'center' });
    submitBtn.disabled = false;
    submitBtn.innerHTML =
      '<i class="fa-solid fa-paper-plane"></i> Envoyer le message';
  }

  function fakeDelay(ms){
    return new Promise(res => setTimeout(res, ms));
  }

  /* ── LIVE BORDER RESET ON INPUT ─────────────────────────── */

  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => clearFieldError(el));
  });

})();
