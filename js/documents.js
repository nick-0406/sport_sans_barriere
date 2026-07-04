/*
 * ============================================================
 *  documents.js — SEUL FICHIER À MODIFIER pour ajouter
 *  ou retirer un document du site.
 *
 *  COMMENT AJOUTER UN DOCUMENT :
 *  1. Copiez le fichier (PDF, DOCX…) dans le dossier  docs/
 *  2. (Optionnel) Copiez une image de couverture dans  images/docs/
 *  3. Ajoutez une entrée dans le tableau DOCUMENTS ci-dessous.
 *  4. Sauvegardez. C'est tout.
 *
 *  CHAMPS DISPONIBLES :
 *  title       (requis)  Titre affiché sur la carte
 *  category    (requis)  "Rapports d'activités" | "Présentations"
 *                        | "Guides & Manuels"   | "Formulaires"
 *  date        (requis)  "AAAA-MM" — affiché comme "Juin 2025"
 *  file        (requis)  Chemin vers le fichier, ex: "docs/rapport.pdf"
 *  description (requis)  Courte phrase décrivant le document
 *  cover       (option)  Image miniature, ex: "images/docs/rapport.jpg"
 *                        → Si omis, une icône auto selon le type de fichier
 *  available   (option)  false → carte grisée "Bientôt disponible"
 *                        → Si omis, considéré comme true (disponible)
 *  lang        (option)  "FR" | "EN" | "FR / EN"  (défaut : "FR")
 *  pages       (option)  Nombre de pages, ex: 24
 * ============================================================
 */

const DOCUMENTS = [

  /* ── RAPPORTS D'ACTIVITÉS ─────────────────────────── */
  {
    title:       "Rapport d'activités 2025",
    category:    "Rapports d'activités",
    date:        "2025-06",
    file:        "docs/rapport-activites-2025.pdf",
    cover:       "images/docs/rapport-2025.jpg",
    description: "Bilan complet des activités menées dans les 4 pays partenaires au cours de l'année 2025.",
    lang:        "FR",
    pages:       32,
  },
  {
    title:       "Rapport de lancement du programme",
    category:    "Rapports d'activités",
    date:        "2024-09",
    file:        "docs/rapport-lancement-2024.pdf",
    description: "Compte-rendu de la cérémonie de lancement et des premières actions engagées.",
    lang:        "FR",
    pages:       18,
  },

  /* ── PRÉSENTATIONS ───────────────────────────────── */
  {
    title:       "Présentation du programme SSB",
    category:    "Présentations",
    date:        "2024-11",
    file:        "docs/presentation-ssb.pdf",
    cover:       "images/docs/presentation-ssb.jpg",
    description: "Diaporama de présentation officielle du programme Sport Sans Barrières.",
    lang:        "FR / EN",
    pages:       24,
  },
  {
    title:       "Présentation Forum Régional — Dakar 2026",
    category:    "Présentations",
    date:        "2025-10",
    file:        "docs/forum-dakar-2026.pdf",
    description: "Présentation du Forum Régional Sport, Handicap & Inclusion prévu lors des JOJ.",
    lang:        "FR",
    available:   false,   // ← fichier pas encore prêt, carte grisée automatiquement
  },

  /* ── GUIDES & MANUELS ────────────────────────────── */
  {
    title:       "Guide de l'inclusion sportive",
    category:    "Guides & Manuels",
    date:        "2025-01",
    file:        "docs/guide-inclusion-sportive.pdf",
    cover:       "images/docs/guide-inclusion.jpg",
    description: "Manuel pratique pour organiser des activités para sportives accessibles à tous.",
    lang:        "FR",
    pages:       56,
  },
  {
    title:       "Manuel du volontaire",
    category:    "Guides & Manuels",
    date:        "2025-03",
    file:        "docs/manuel-volontaire.pdf",
    description: "Tout ce qu'un volontaire doit savoir avant de rejoindre le programme.",
    lang:        "FR",
    pages:       20,
  },

  /* ── FORMULAIRES ─────────────────────────────────── */
  {
    title:       "Formulaire de candidature bénéficiaire",
    category:    "Formulaires",
    date:        "2025-01",
    file:        "docs/formulaire-candidature.pdf",
    description: "À remplir et renvoyer pour participer au programme en tant que jeune bénéficiaire.",
    lang:        "FR",
    pages:       2,
  },
  {
    title:       "Formulaire de partenariat",
    category:    "Formulaires",
    date:        "2025-01",
    file:        "docs/formulaire-partenariat.pdf",
    description: "Document officiel pour formaliser un partenariat avec Sport Sans Barrières.",
    lang:        "FR / EN",
    pages:       3,
  },

];
