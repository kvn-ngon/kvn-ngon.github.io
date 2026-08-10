// ============================================================
//  COACHING FORM — CONFIGURATION FILE
//  Edit this file to change questions, branding, and settings.
// ============================================================

const CONFIG = {

  // ── BRANDING ──────────────────────────────────────────────
  title: "EAT TASTY LOOK TASTY",
  subtitle: "The #1 Fitness Program for Food",

  // Background image path (relative). Use "" for no background.
  // Drop your image into the /assets/ folder and reference it here.
  backgroundImage: "assets/Background.png",

  // Formspree endpoint
  formspreeEndpoint: "https://formspree.io/f/maqkewrb",

  // ── PAGES / QUESTIONS ─────────────────────────────────────
  // Each object = one page (one question per page).
  //
  // Supported types:
  //   "short"    — single-line text input
  //   "long"     — multi-line textarea
  //   "choice"   — multiple-choice (pick ONE), pass options: []
  //   "checklist"— checklist (pick MANY), pass options: []
  //
  // Fields:
  //   id       : unique key used in the emailed data (no spaces)
  //   type     : one of the types above
  //   question : the big heading text
  //   hint     : smaller helper text below the question (optional)
  //   required : true/false
  //   options  : array of strings — required for "choice" and "checklist"
  //   placeholder: hint text inside input — for "short" and "long"
  // ────────────────────────────────────────────────────────────

  pages: [

    // ── PAGE 1: Welcome / Intro (no input — type "intro") ───
    {
      id: "intro",
      type: "intro",
      question: "EAT TASTY LOOK TASTY",
      hint: "The goal is for you to outgrow us.",
    },

    // ── PAGE 2: Multi-short (grouped fields) ─────────────────
    {
      id: "contact_info",
      type: "multi-short",
      question: "Tell me about yourself.",
      hint: "Just the basics to get started.",
      fields: [
        { id: "first_name", label: "First Name",    placeholder: "Jane",              required: true  },
        { id: "last_name",  label: "Last Name",     placeholder: "Smith",             required: true  },
        { id: "phone",      label: "Phone Number",  placeholder: "+61 400 000 000",   required: true  },
        { id: "email",      label: "Email Address", placeholder: "jane@example.com",  required: true  },
      ],
    },

    // ── PAGE 3: Choice (pick one) ─────────────────────────
    {
      id: "coaching_goal",
      type: "choice",
      question: "How can I help you?",
      hint: "",
      required: true,
      options: [
        "Weight Loss",
        "Build Muscle",
        "Healthy Lifestyle",
        "Recomp (get toned)",
        "recomp (build muscle and lose fat)",
      ],
    },

    // ── PAGE 4: Short answer ──────────────────────
    {
      id: "age",
      type: "short",
      question: "What is your age?",
      hint: "",
      placeholder: "Type your answer here...",
      required: true,
    },

    // ── PAGE 5: Short answer ──────────────────────
    {
      id: "location",
      type: "short",
      question: "Where are you located?",
      hint: "e.g. city or country",
      placeholder: "Type your answer here...",
      required: true,
    },

    // ── PAGE 6: Short answer ──────────────────────
    {
      id: "instagram",
      type: "short",
      question: "What is your Instagram handle?",
      hint: "e.g. @kvn.ngon",
      placeholder: "Type your answer here...",
      required: true,
    },

    // ── PAGE 7: Short answer ──────────────────────
    {
      id: "occupation",
      type: "short",
      question: "What is your occupation?",
      hint: "e.g. Software Engineer, Accountant, Nurse, Student, Electrician etc.",
      placeholder: "Type your answer here...",
      required: true,
    },
    

    // ── PAGE 8: Long answer ───────────────────────────────
    {
      id: "motivation",
      type: "long",
      question: "What is your motivation to start now?",
      hint: "(e.g. Holiday trip in 3 months)",
      placeholder: "Write as much or as little as you'd like...",
      required: true,
    },

    // ── PAGE 9: Choice (pick one) ─────────────────────────
    {
      id: "commitment_level",
      type: "choice",
      question: "How committed are you to invest in your fitness goals",
      hint: "",
      required: true,
      options: [
        "I'm all in - I understand that growth requires investment and I'm ready to commit what's necessary",
        "I'm serious about this - but need to see how it fits in my budget",
        "I'm interested - but I don't really have much funds to invest at the moment",
        "I'm mostly just looking for some free advice",
      ],
    },

    // ── PAGE 8: Long answer ───────────────────────────────
    {
      id: "specifically",
      type: "long",
      question: "Why do you want to work with me specifically?",
      hint: "",
      placeholder: "Write as much or as little as you'd like...",
      required: true,
    },

  ],
};
