import { useState, useEffect, useCallback } from "react";

// ─── SUPABASE CONFIG ─────────────────────────────────────────────────────────

const SUPABASE_URL = "https://tbkzoyibxhmdurpazbc.supabase.co";
const SUPABASE_KEY = "sb_publishable_pmk8ojYYjv2gsP2s7IBVMQ_6biixa2f";

async function sb(method, table, opts = {}) {
  const { filter, body, upsert, select = "*" } = opts;
  let url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}`;
  if (filter) url += `&${filter}`;
  if (upsert) url += "&on_conflict=" + upsert;

  const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    "Prefer": method === "POST" ? (upsert ? "resolution=merge-duplicates,return=representation" : "return=representation") : "return=representation"
  };

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`Supabase ${method} ${table}:`, err);
    return null;
  }
  if (res.status === 204) return true;
  return res.json();
}

// CRUD helpers
const db = {
  select: (table, filter, select) => sb("GET", table, { filter, select }),
  insert: (table, body) => sb("POST", table, { body }),
  upsert:  (table, body, conflict) => sb("POST", table, { body, upsert: conflict }),
  update:  (table, filter, body) => sb("PATCH", table, { filter, body }),
  delete:  (table, filter) => sb("DELETE", table, { filter }),
};

// ─── DATA ────────────────────────────────────────────────────────────────────

const trainingen = [
  { id:"rekenen-mbo2-bundel", titel:"Complete training – slaag gegarandeerd", niveau:"mbo-2", type:"bundel", beschrijving:"Alles wat je nodig hebt om in één keer te slagen", korteUsp:"Training + materiaal + persoonlijke begeleiding", prijs:199, watJeKrijgt:["Wekelijkse training (8 weken)","Complete samenvatting (digitaal)","400+ oefenvragen","Alle videolessen on-demand","WhatsApp hulp","3 proefexamens","Bonus: Formulekaarten","Bonus: Snelrekenen tips"], startdatum:"15 april 2026", aantalPlekken:8, reviews:156, rating:4.9, label:"Meest gekozen", featured:true, hero:true },
  { id:"rekenen-mbo2-weekly", titel:"Slaag voor mbo 2 rekenen zonder herkansing", niveau:"mbo-2", type:"weekly", beschrijving:"Stap voor stap naar je voldoende", korteUsp:"Echte examenvragen + persoonlijke begeleiding", prijs:149, watJeKrijgt:["8 weken online lessen","Complete samenvatting van alle rekenstof","200+ oefenvragen uit echte examens","Examengerichte uitleg","Persoonlijke WhatsApp hulp","Toegang tot alle lesmaterialen","Proefexamen"], startdatum:"15 april 2026", aantalPlekken:12, reviews:89, rating:4.8 },
  { id:"rekenen-mbo3-stoom", titel:"Binnen 2 weken klaar voor je mbo 3 examen", niveau:"mbo-3", type:"stoomtraining", beschrijving:"Intensieve voorbereiding zonder gedoe", korteUsp:"Alle stof in 2 weken + dagelijkse begeleiding", prijs:129, watJeKrijgt:["2 weken intensieve training","Dagelijkse online sessies","Samenvatting kernstof mbo 3","150+ gerichte oefenvragen","Examentips en strategieën","WhatsApp support","Eindproefexamen"], startdatum:"8 april 2026", aantalPlekken:5, reviews:67, rating:4.7, label:"Snelste resultaat" },
  { id:"rekenen-mbo4-bundel", titel:"Slaag voor mbo 4 rekenen – premium training", niveau:"mbo-4", type:"bundel", beschrijving:"Complete begeleiding met persoonlijke coaching", korteUsp:"Training + alle materialen + 3 coaching sessies", prijs:249, watJeKrijgt:["Wekelijkse training (10 weken)","Alle digitale samenvattingen","500+ oefenvragen","Videolessen on-demand","Persoonlijke coaching (3 sessies)","WhatsApp support","3 volledige proefexamens","Bonus: Examenstrategie gids"], startdatum:"20 april 2026", aantalPlekken:6, reviews:203, rating:5.0, label:"Premium training" },
  { id:"rekenen-mbo3-weekly", titel:"Slaag voor mbo 3 rekenen zonder stress", niveau:"mbo-3", type:"weekly", beschrijving:"Complete voorbereiding in 9 weken", korteUsp:"Stap voor stap uitleg + echte examenvragen", prijs:159, watJeKrijgt:["9 weken online lessen","Volledige samenvatting mbo 3 stof","250+ oefenvragen","Wekelijkse huiswerkopdrachten","Examengerichte uitleg","WhatsApp begeleiding","Proefexamen met feedback"], startdatum:"22 april 2026", aantalPlekken:10, reviews:92, rating:4.7 },
  { id:"rekenen-mbo4-weekly", titel:"Slaag voor mbo 4 rekenen in één keer", niveau:"mbo-4", type:"weekly", beschrijving:"Complete voorbereiding voor het hoogste niveau", korteUsp:"Alle onderwerpen + videolessen + 2 proefexamens", prijs:169, watJeKrijgt:["10 weken online lessen","Volledige samenvatting alle onderwerpen","300+ oefenvragen","Videolessen met stap-voor-stap uitleg","Persoonlijke begeleiding via WhatsApp","Extra oefensessies","2 volledige proefexamens"], startdatum:"20 april 2026", aantalPlekken:15, reviews:124, rating:4.9 },
  { id:"rekenen-mbo1-weekly", titel:"Haal mbo 1 rekenen in één keer", niveau:"mbo-1", type:"weekly", beschrijving:"Basisstof duidelijk uitgelegd zonder stress", korteUsp:"Stap voor stap naar je voldoende in 8 weken", prijs:139, watJeKrijgt:["8 weken online lessen","Basisstof duidelijk uitgelegd","180+ oefenvragen","Persoonlijke begeleiding","Langzaam opbouwend tempo","WhatsApp hulp","Proefexamen"], startdatum:"18 april 2026", aantalPlekken:12, reviews:58, rating:4.8 },
  { id:"rekenen-mbo1-oefening", titel:"Haal mbo 1 rekenen zonder gedoe", niveau:"mbo-1", type:"oefening", beschrijving:"Oefen met 250+ échte examenvragen", korteUsp:"Alleen oefenen, geen lessen", prijs:49, watJeKrijgt:["250+ oefenvragen uit echte examens","Complete uitwerkingen met uitleg","Alle onderwerpen mbo 1","Direct online toegang","Oefenen in eigen tempo","Antwoordenboek met tips"], reviews:45, rating:4.6 }
];

const producten = [
  { id:"oefenbundel-mbo2", naam:"Oefenbundel Rekenen mbo 2", categorie:"oefenbundel", niveau:"mbo-2", beschrijving:"Complete oefenbundel met 300+ vragen uit échte examens.", prijs:29, inhoud:["300+ oefenvragen","Alle onderwerpen mbo 2","Volledige uitwerkingen","Tips per vraagtype","Gebaseerd op echte examens"], bestandstype:"PDF (125 pagina's)", reviews:87, rating:4.7 },
  { id:"samenvatting-mbo3", naam:"Samenvatting Rekenen mbo 3", categorie:"samenvatting", niveau:"mbo-3", beschrijving:"Alle rekenstof voor mbo 3 overzichtelijk samengevat.", prijs:19, inhoud:["Alle onderwerpen samengevat","Duidelijke voorbeelden","Formuleblad","Stappenplannen","Examentips"], bestandstype:"PDF (40 pagina's)", reviews:124, rating:4.8 },
  { id:"examenvragen-mbo4", naam:"Examenvragen Rekenen mbo 4", categorie:"examenvragen", niveau:"mbo-4", beschrijving:"5 volledige proefexamens uit eerdere jaren.", prijs:39, inhoud:["5 volledige proefexamens","Échte examens uit 2023-2025","Alle antwoorden + uitleg","Puntentelling schema","Normering per examen"], bestandstype:"PDF (200 pagina's)", reviews:156, rating:4.9 },
  { id:"oefenbundel-mbo1", naam:"Oefenbundel Rekenen mbo 1", categorie:"oefenbundel", niveau:"mbo-1", beschrijving:"200+ vragen speciaal voor mbo 1 niveau.", prijs:24, inhoud:["200+ oefenvragen","Basisstof mbo 1","Uitgebreide uitleg","Stappenplannen","Extra oefenopgaven"], bestandstype:"PDF (90 pagina's)", reviews:63, rating:4.6 },
  { id:"samenvatting-alle-niveaus", naam:"Samenvatting Rekenen - Alle Niveaus", categorie:"samenvatting", beschrijving:"Complete samenvatting voor mbo 1 t/m 4.", prijs:49, inhoud:["Samenvattingen mbo 1, 2, 3 én 4","Alle onderwerpen","Formulekaarten","Examenstrategie","Tijdmanagement tips"], bestandstype:"PDF (180 pagina's)", reviews:234, rating:4.9 },
  { id:"examenvragen-mbo2", naam:"Examenvragen Rekenen mbo 2", categorie:"examenvragen", niveau:"mbo-2", beschrijving:"4 volledige proefexamens speciaal voor mbo 2.", prijs:34, inhoud:["4 volledige proefexamens","Examens uit 2022-2025","Antwoorden met uitleg","Puntentelling","Normering"], bestandstype:"PDF (160 pagina's)", reviews:98, rating:4.8 },
  { id:"oefenbundel-mbo3", naam:"Oefenbundel Rekenen mbo 3", categorie:"oefenbundel", niveau:"mbo-3", beschrijving:"350+ oefenvragen voor mbo 3.", prijs:32, inhoud:["350+ oefenvragen","Alle onderwerpen mbo 3","Volledige uitwerkingen","Extra verdiepingsvragen","Examenvragen"], bestandstype:"PDF (140 pagina's)", reviews:112, rating:4.7 },
  { id:"formulekaarten-compleet", naam:"Formulekaarten - Complete Set", categorie:"samenvatting", beschrijving:"Alle belangrijke formules op handige kaarten.", prijs:14, inhoud:["50+ formulekaarten","Alle niveaus","Print-ready formaat","Georganiseerd per onderwerp","Inclusief voorbeelden"], bestandstype:"PDF (25 pagina's)", reviews:178, rating:4.8 }
];

const modules = [
  { id:"getallen", naam:"Getallen", beschrijving:"Optellen, aftrekken, vermenigvuldigen, delen en procenten", kleur:"blue", aantalVragen:25 },
  { id:"verhoudingen", naam:"Verhoudingen", beschrijving:"Verhoudingen, schaal, procenten en korting berekenen", kleur:"green", aantalVragen:20 },
  { id:"meten-meetkunde", naam:"Meten en meetkunde", beschrijving:"Oppervlakte, omtrek, volume en eenheden omrekenen", kleur:"purple", aantalVragen:20 },
  { id:"verbanden", naam:"Verbanden", beschrijving:"Grafieken, tabellen, gemiddelden en verbanden herkennen", kleur:"orange", aantalVragen:22 }
];

const moduleColors = {
  getallen: { bg:"bg-blue-100", text:"text-blue-700", btn:"bg-blue-600 hover:bg-blue-700" },
  verhoudingen: { bg:"bg-green-100", text:"text-green-700", btn:"bg-green-600 hover:bg-green-700" },
  "meten-meetkunde": { bg:"bg-purple-100", text:"text-purple-700", btn:"bg-purple-600 hover:bg-purple-700" },
  verbanden: { bg:"bg-orange-100", text:"text-orange-700", btn:"bg-orange-600 hover:bg-orange-700" }
};

// ─── QUESTION ENGINE ─────────────────────────────────────────────────────────

const questionTemplates = [
  { id:"get-01", moduleId:"getallen", moeilijkheid:"1F", vraagTemplate:"Je koopt boodschappen voor €{a} en €{b}. Hoeveel betaal je in totaal?", antwoordFormule:(v)=>v.a+v.b, uitleg:["Tel de bedragen op: €{a} + €{b}","Totaal = €{antwoord}"], variabelen:{ a:{min:5,max:25,stap:0.5}, b:{min:5,max:25,stap:0.5} }, eenheid:"€", decimalen:2 },
  { id:"get-02", moduleId:"getallen", moeilijkheid:"1F", vraagTemplate:"Je betaalt met €{a}. De boodschappen kosten €{b}. Hoeveel wisselgeld krijg je?", antwoordFormule:(v)=>v.a-v.b, uitleg:["Wisselgeld = betaald - kosten","€{a} - €{b} = €{antwoord}"], variabelen:{ a:{min:20,max:100,stap:10}, b:{min:5,max:50,stap:5} }, eenheid:"€", decimalen:2 },
  { id:"get-03", moduleId:"getallen", moeilijkheid:"1F", vraagTemplate:"Een broodje kost €{a}. Je koopt {b} broodjes. Wat is de totaalprijs?", antwoordFormule:(v)=>v.a*v.b, uitleg:["Prijs × aantal: {b} × €{a}","Totaal = €{antwoord}"], variabelen:{ a:{min:2,max:6,stap:0.5}, b:{min:2,max:8,stap:1} }, eenheid:"€", decimalen:2 },
  { id:"get-04", moduleId:"getallen", moeilijkheid:"1F", vraagTemplate:"Je verdeelt €{a} gelijk over {b} personen. Hoeveel krijgt elke persoon?", antwoordFormule:(v)=>v.a/v.b, uitleg:["Deel het bedrag door het aantal","€{a} ÷ {b} = €{antwoord}"], variabelen:{ a:{min:20,max:100,stap:20}, b:{min:2,max:5,stap:1} }, eenheid:"€", decimalen:2 },
  { id:"get-05", moduleId:"getallen", moeilijkheid:"2F", vraagTemplate:"Een artikel van €{a} heeft {p}% korting. Hoeveel euro korting is dat?", antwoordFormule:(v)=>(v.p/100)*v.a, uitleg:["Bereken {p}% van €{a}","({p} ÷ 100) × {a} = €{antwoord}"], variabelen:{ p:{min:10,max:50,stap:10}, a:{min:20,max:200,stap:20} }, eenheid:"€", decimalen:0 },
  { id:"get-06", moduleId:"getallen", moeilijkheid:"2F", vraagTemplate:"Een prijs excl. btw is €{a}. Btw is {p}%. Wat is de prijs incl. btw?", antwoordFormule:(v)=>v.a*(1+v.p/100), uitleg:["Btw = {p}% van €{a}","Totaal = €{a} + btw = €{antwoord}"], variabelen:{ a:{min:50,max:500,stap:50}, p:{min:9,max:21,stap:12} }, eenheid:"€", decimalen:2 },
  { id:"verh-01", moduleId:"verhoudingen", moeilijkheid:"2F", vraagTemplate:"Een recept voor {a} personen heeft {b}g bloem nodig. Hoeveel gram heb je voor {c} personen?", antwoordFormule:(v)=>(v.b/v.a)*v.c, uitleg:["Per persoon: {b}g ÷ {a}","Voor {c} personen: × {c} = {antwoord}g"], variabelen:{ a:{min:2,max:4,stap:1}, b:{min:100,max:400,stap:50}, c:{min:6,max:10,stap:2} }, eenheid:"gram", decimalen:0 },
  { id:"verh-02", moduleId:"verhoudingen", moeilijkheid:"2F", vraagTemplate:"Een product kost nu €{a}. De prijs stijgt met {p}%. Wat is de nieuwe prijs?", antwoordFormule:(v)=>v.a*(1+v.p/100), uitleg:["Stijging = {p}% van €{a}","Nieuwe prijs = €{a} + stijging = €{antwoord}"], variabelen:{ a:{min:50,max:300,stap:50}, p:{min:5,max:25,stap:5} }, eenheid:"€", decimalen:2 },
  { id:"meet-01", moduleId:"meten-meetkunde", moeilijkheid:"1F", vraagTemplate:"Een kamer is {a}m lang en {b}m breed. Hoe groot is de oppervlakte?", antwoordFormule:(v)=>v.a*v.b, uitleg:["Oppervlakte = lengte × breedte","{a} × {b} = {antwoord} m²"], variabelen:{ a:{min:3,max:8,stap:0.5}, b:{min:2,max:6,stap:0.5} }, eenheid:"m²", decimalen:1 },
  { id:"meet-02", moduleId:"meten-meetkunde", moeilijkheid:"1F", vraagTemplate:"Een rechthoek is {a}m lang en {b}m breed. Wat is de omtrek?", antwoordFormule:(v)=>2*(v.a+v.b), uitleg:["Omtrek = 2 × (lengte + breedte)","2 × ({a} + {b}) = {antwoord}m"], variabelen:{ a:{min:4,max:12,stap:1}, b:{min:2,max:8,stap:1} }, eenheid:"m", decimalen:0 },
  { id:"meet-03", moduleId:"meten-meetkunde", moeilijkheid:"2F", vraagTemplate:"Een doos is {a}cm lang, {b}cm breed en {c}cm hoog. Wat is het volume?", antwoordFormule:(v)=>v.a*v.b*v.c, uitleg:["Volume = l × b × h","{a} × {b} × {c} = {antwoord}cm³"], variabelen:{ a:{min:10,max:30,stap:5}, b:{min:5,max:20,stap:5}, c:{min:5,max:15,stap:5} }, eenheid:"cm³", decimalen:0 },
  { id:"verb-01", moduleId:"verbanden", moeilijkheid:"2F", vraagTemplate:"Een student scoort {a}, {b} en {c} op drie toetsen. Wat is het gemiddelde?", antwoordFormule:(v)=>(v.a+v.b+v.c)/3, uitleg:["Gemiddelde = som ÷ aantal","({a}+{b}+{c}) ÷ 3 = {antwoord}"], variabelen:{ a:{min:40,max:90,stap:5}, b:{min:40,max:90,stap:5}, c:{min:40,max:90,stap:5} }, eenheid:"punten", decimalen:1 },
  { id:"verb-02", moduleId:"verbanden", moeilijkheid:"1F", vraagTemplate:"Een werknemer verdient €{u} per uur. Hij werkt {h} uur. Hoeveel verdient hij?", antwoordFormule:(v)=>v.u*v.h, uitleg:["Loon = uurloon × uren","€{u} × {h} = €{antwoord}"], variabelen:{ u:{min:10,max:20,stap:1}, h:{min:8,max:40,stap:4} }, eenheid:"€", decimalen:0 }
];

function rnd(min, max, stap = 1) {
  const steps = Math.floor((max - min) / stap);
  return min + Math.floor(Math.random() * (steps + 1)) * stap;
}

function generateQuestion(template) {
  const vars = {};
  for (const [k, cfg] of Object.entries(template.variabelen)) {
    vars[k] = rnd(cfg.min, cfg.max, cfg.stap || 1);
  }
  if (template.id === "get-02" && vars.b >= vars.a) vars.a = vars.b + rnd(10, 50, 10);
  const antwoord = Math.round(template.antwoordFormule(vars) * 100) / 100;
  const replace = (s) => {
    let r = s;
    for (const [k, v] of Object.entries({ ...vars, antwoord })) {
      r = r.replace(new RegExp(`\\{${k}\\}`, "g"), String(Math.round(v * 100) / 100));
    }
    return r;
  };
  return {
    id: `${template.id}-${Date.now()}`,
    templateId: template.id,
    moduleId: template.moduleId,
    moeilijkheid: template.moeilijkheid,
    vraag: replace(template.vraagTemplate),
    correctAntwoord: antwoord,
    uitleg: template.uitleg.map(replace),
    eenheid: template.eenheid,
    decimalen: template.decimalen
  };
}

function generateSimilar(q) {
  const t = questionTemplates.find(t => q.id.startsWith(t.id));
  return t ? generateQuestion(t) : null;
}

// ─── SUPABASE STORAGE LAYER ───────────────────────────────────────────────────

// Fallback naar localStorage als Supabase faalt
function lsGet(k, def = null) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

const CURRENT_USER_KEY = "ir_current_user";

function getCurrentUser() { return lsGet(CURRENT_USER_KEY); }
function setCurrentUser(u) { u ? lsSet(CURRENT_USER_KEY, u) : localStorage.removeItem(CURRENT_USER_KEY); }

async function findByEmail(email) {
  try {
    const rows = await db.select("users", `email=eq.${encodeURIComponent(email.toLowerCase())}`);
    if (rows && rows.length > 0) return rows[0];
  } catch (e) { console.error(e); }
  return null;
}

async function createUser(user) {
  try {
    const rows = await db.upsert("users", {
      id: user.id,
      name: user.name,
      email: user.email.toLowerCase(),
      role: user.role,
      niveau: user.niveau || null
    }, "email");
    return rows ? rows[0] : null;
  } catch (e) { console.error(e); return null; }
}

async function getAllUsers() {
  try {
    const rows = await db.select("users");
    return rows || [];
  } catch { return []; }
}

async function updateUserNiveau(userId, niveau) {
  try {
    await db.update("users", `id=eq.${userId}`, { niveau });
    const cu = getCurrentUser();
    if (cu && cu.id === userId) setCurrentUser({ ...cu, niveau });
  } catch (e) { console.error(e); }
}

const MODULE_IDS = ["getallen", "verhoudingen", "meten-meetkunde", "verbanden"];

async function getStudentProgress(studentId) {
  try {
    const rows = await db.select("module_progress", `student_id=eq.${studentId}`);
    const map = {};
    if (rows) rows.forEach(r => { map[r.module_id] = r; });

    // Ensure all modules exist
    for (const moduleId of MODULE_IDS) {
      if (!map[moduleId]) {
        const created = await db.upsert("module_progress", {
          student_id: studentId,
          module_id: moduleId,
          aantal_correct: 0,
          aantal_fout: 0,
          aantal_herhalingen: 0,
          huidige_streak: 0,
          afgerond: false
        }, "student_id,module_id");
        if (created && created[0]) map[moduleId] = created[0];
      }
    }

    return buildProgressObject(studentId, map);
  } catch (e) {
    console.error(e);
    return buildEmptyProgress(studentId);
  }
}

function buildProgressObject(studentId, map) {
  const mods = {};
  for (const moduleId of MODULE_IDS) {
    const r = map[moduleId] || {};
    mods[moduleId] = {
      moduleId,
      aantalCorrect: r.aantal_correct || 0,
      aantalFout: r.aantal_fout || 0,
      aantalHerhalingen: r.aantal_herhalingen || 0,
      huidigeStreak: r.huidige_streak || 0,
      afgerond: r.afgerond || false
    };
  }
  const allMods = Object.values(mods);
  const tc = allMods.reduce((s, m) => s + m.aantalCorrect, 0);
  const tt = allMods.reduce((s, m) => s + m.aantalCorrect + m.aantalFout, 0);
  const totaalScore = tt > 0 ? Math.round((tc / tt) * 100) : 0;
  const zwakkeOnderwerpen = allMods.filter(m => {
    const t = m.aantalCorrect + m.aantalFout;
    return t > 5 && (m.aantalCorrect / t) < 0.6;
  }).map(m => m.moduleId);

  return { studentId, modules: mods, totaalScore, zwakkeOnderwerpen };
}

function buildEmptyProgress(studentId) {
  const mods = {};
  MODULE_IDS.forEach(id => {
    mods[id] = { moduleId: id, aantalCorrect: 0, aantalFout: 0, aantalHerhalingen: 0, huidigeStreak: 0, afgerond: false };
  });
  return { studentId, modules: mods, totaalScore: 0, zwakkeOnderwerpen: [] };
}

async function updateModuleProgress(studentId, moduleId, updates) {
  try {
    const dbUpdates = {};
    if ("aantalCorrect" in updates) dbUpdates.aantal_correct = updates.aantalCorrect;
    if ("aantalFout" in updates) dbUpdates.aantal_fout = updates.aantalFout;
    if ("aantalHerhalingen" in updates) dbUpdates.aantal_herhalingen = updates.aantalHerhalingen;
    if ("huidigeStreak" in updates) dbUpdates.huidige_streak = updates.huidigeStreak;
    if ("afgerond" in updates) dbUpdates.afgerond = updates.afgerond;
    dbUpdates.laatste_activiteit = new Date().toISOString();

    await db.update("module_progress", `student_id=eq.${studentId}&module_id=eq.${moduleId}`, dbUpdates);
  } catch (e) { console.error(e); }
}

async function getAllStudentsProgress() {
  try {
    const rows = await db.select("module_progress");
    if (!rows) return [];
    const byStudent = {};
    rows.forEach(r => {
      if (!byStudent[r.student_id]) byStudent[r.student_id] = {};
      byStudent[r.student_id][r.module_id] = r;
    });
    return Object.entries(byStudent).map(([sid, map]) => buildProgressObject(sid, map));
  } catch { return []; }
}

async function saveAnswer(answer) {
  try {
    await db.insert("answers", {
      question_id: answer.questionId,
      student_id: answer.studentId,
      antwoord: answer.antwoord,
      correct: answer.correct,
      poging_nummer: answer.pogingNummer
    });
  } catch (e) { console.error(e); }
}

async function getAllAnswers() {
  try {
    const rows = await db.select("answers");
    return rows || [];
  } catch { return []; }
}

async function updateLiveSession(session) {
  try {
    await db.upsert("live_sessions", {
      student_id: session.studentId,
      student_naam: session.studentNaam,
      module_id: session.moduleId,
      huidige_vraag_id: session.huidigeVraagId || null,
      vraag: session.vraag || null,
      laatste_antwoord: session.laatsteAntwoord ?? null,
      correct: session.correct ?? null,
      laatste_activiteit: new Date().toISOString(),
      aantal_fouten: session.aantalFouten || 0
    }, "student_id");
  } catch (e) { console.error(e); }
}

async function getLiveSessions() {
  try {
    const cutoff = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const rows = await db.select("live_sessions", `laatste_activiteit=gte.${cutoff}`);
    return rows || [];
  } catch { return []; }
}

async function deleteLiveSession(studentId) {
  try {
    await db.delete("live_sessions", `student_id=eq.${studentId}`);
  } catch (e) { console.error(e); }
}

// ─── UI COMPONENTS ────────────────────────────────────────────────────────────

function Stars({ rating }) {
  return (
    <span className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-300 fill-gray-300"}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm font-semibold text-gray-700 ml-1">{rating}</span>
    </span>
  );
}

function Badge({ children, color = "blue" }) {
  const colors = { blue: "bg-blue-100 text-blue-700", green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-800", purple: "bg-purple-100 text-purple-700", orange: "bg-orange-100 text-orange-800" };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[color] || colors.blue}`}>{children}</span>;
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}

function Toast({ message, type = "success", onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg font-semibold text-white flex items-center gap-2 ${type === "success" ? "bg-green-600" : "bg-red-500"}`}>
      {type === "success" ? "✅" : "❌"} {message}
    </div>
  );
}

// ─── CART SIDEBAR ─────────────────────────────────────────────────────────────

function Cart({ items, onRemove, onClose }) {
  const total = items.reduce((s, i) => s + i.prijs, 0);
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-96 bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Winkelwagen</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">🛒</div>
              <p className="font-medium">Je winkelwagen is leeg</p>
            </div>
          ) : items.map(item => (
            <div key={item.id} className="flex items-start gap-3 p-4 border rounded-xl mb-3">
              <div className="flex-1">
                <p className="font-semibold text-sm">{item.naam}</p>
                <p className="text-blue-600 font-bold">€{item.prijs}</p>
              </div>
              <button onClick={() => onRemove(item.id)} className="text-red-400 hover:text-red-600 text-sm">✕</button>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="p-6 border-t">
            <div className="flex justify-between mb-4">
              <span className="font-bold text-lg">Totaal</span>
              <span className="font-bold text-2xl text-blue-600">€{total}</span>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors">
              Afrekenen via iDEAL
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────

function Header({ page, setPage, cartCount, onCartClick }) {
  const nav = [{ id: "home", label: "Home" }, { id: "trainingen", label: "Trainingen" }, { id: "webshop", label: "Webshop" }, { id: "portaal", label: "Leerportaal" }];
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={() => setPage("home")} className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm">IR</div>
          <span className="font-bold text-gray-900 text-lg hidden sm:block">Inclusief Rekenen</span>
        </button>
        <nav className="hidden md:flex items-center gap-1">
          {nav.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${page === n.id || page.startsWith(n.id) ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
              {n.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => window.open("https://wa.me/", "_blank")} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
          </button>
          <button onClick={onCartClick} className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
          </button>
          <button className="md:hidden p-2 text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-1">
          {nav.map(n => (
            <button key={n.id} onClick={() => { setPage(n.id); setMenuOpen(false); }}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${page === n.id ? "bg-blue-50 text-blue-700" : "text-gray-700"}`}>
              {n.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

function Footer({ setPage }) {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-black text-sm">IR</div>
              <span className="font-bold text-lg">Inclusief Rekenen</span>
            </div>
            <p className="text-gray-400 text-sm">Slaag in één keer voor je mbo rekenexamen.</p>
          </div>
          <div>
            <h3 className="font-bold mb-3 text-sm uppercase tracking-wider text-gray-300">Trainingen</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {["Wekelijkse training", "Stoomtraining", "Oefentraining", "Complete bundel"].map(t => (
                <li key={t}><button onClick={() => setPage("trainingen")} className="hover:text-white transition-colors">{t}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3 text-sm uppercase tracking-wider text-gray-300">Niveaus</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {["mbo 1", "mbo 2", "mbo 3", "mbo 4"].map(n => <li key={n}>{n}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3 text-sm uppercase tracking-wider text-gray-300">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>WhatsApp support</li>
              <li>info@inclusiefrekenen.nl</li>
              <li>Veelgestelde vragen</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          © 2026 Inclusief Rekenen. Alle rechten voorbehouden.
        </div>
      </div>
    </footer>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────

function HomePage({ setPage }) {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-blue-50 via-blue-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[["✅", "94% slaagt in één keer", "text-green-700 bg-green-50"], ["👥", "2.500+ studenten", "text-blue-700 bg-blue-50"], ["⭐", "4.8 beoordeling", "text-amber-700 bg-amber-50"]].map(([icon, text, cls]) => (
              <div key={text} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${cls}`}>
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Haal je rekenexamen<br /><span className="text-blue-600">in één keer</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Stap voor stap uitleg, echte examenvragen en persoonlijke begeleiding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setPage("trainingen")} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5">
              Start vandaag met je training →
            </button>
            <button onClick={() => setPage("trainingen")} className="border-2 border-gray-300 hover:border-blue-400 text-gray-700 font-bold text-lg px-10 py-4 rounded-xl transition-all">
              Bekijk trainingen
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 border-y bg-white px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">Waarom Inclusief Rekenen?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[["🎯", "Gericht op slagen", "Je leert alleen wat nodig is voor je examen"], ["📝", "Echte examens", "Je oefent met echte examenvragen"], ["💬", "Persoonlijke begeleiding", "Snelle hulp via WhatsApp"], ["🏆", "Bewezen resultaat", "94% slaagt in één keer"]].map(([icon, title, desc]) => (
              <div key={title} className="text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">{icon}</div>
                <h3 className="font-bold mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-3">Kies jouw training</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Direct beginnen met je voorbereiding</p>
          <div className="mb-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-8 shadow-2xl relative">
            <div className="absolute top-4 right-4"><span className="bg-amber-400 text-blue-900 font-black px-4 py-1.5 rounded-full text-sm shadow">Meest gekozen</span></div>
            <h3 className="text-3xl font-black mb-2">Complete training – slaag gegarandeerd</h3>
            <p className="text-blue-100 text-lg mb-6">Training + materiaal + persoonlijke begeleiding</p>
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-orange-500 px-3 py-1.5 rounded-full text-sm font-bold">🔥 Nog 8 plekken</span>
              <span className="text-blue-200 text-sm">Start: 15 april 2026</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-blue-200 text-sm mb-1">Complete training</div>
                <div className="text-5xl font-black">€199</div>
              </div>
              <button onClick={() => setPage("trainingen")} className="bg-white text-blue-700 hover:bg-blue-50 font-bold text-xl px-8 py-4 rounded-xl shadow-lg transition-all">Start nu →</button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[{ title: "Slaag zonder herkansing", sub: "Wekelijkse begeleiding", plekken: 12, prijs: "€139" }, { title: "Klaar in 2 weken", sub: "Intensieve voorbereiding", plekken: 5, prijs: "€129" }, { title: "Oefen met echte vragen", sub: "Gericht oefenmateriaal", direct: true, prijs: "€49" }].map(c => (
              <div key={c.title} className="bg-white rounded-xl border-2 hover:border-blue-500 hover:shadow-lg transition-all p-6">
                <h3 className="font-bold text-lg mb-2">{c.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{c.sub}</p>
                {c.direct ? <div className="text-green-600 text-sm font-semibold mb-4">✅ Direct beschikbaar</div> : <div className="text-orange-600 text-sm font-semibold mb-4">🔥 Nog {c.plekken} plekken</div>}
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-2xl font-black text-blue-600">{c.prijs}</span>
                  <button onClick={() => setPage("trainingen")} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg transition-colors text-sm">Start nu →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-12 shadow-xl">
          <h2 className="text-4xl font-black mb-4">Start vandaag</h2>
          <p className="text-xl text-blue-100 mb-8">Slaag in één keer voor je rekenexamen</p>
          <button onClick={() => setPage("trainingen")} className="bg-white text-blue-700 hover:bg-blue-50 font-bold text-lg px-10 py-4 rounded-xl shadow-lg transition-all">Kies je training →</button>
        </div>
      </section>

      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border-2 border-blue-200 p-8 flex items-start gap-6">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl flex-shrink-0">📚</div>
            <div>
              <h2 className="text-2xl font-black mb-2">Al een account? Ga naar het leerportaal</h2>
              <p className="text-gray-600 mb-5">Oefen met honderden rekenopgaven, krijg directe feedback en volg je voortgang.</p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setPage("portaal")} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors">Open leerportaal →</button>
                <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                  {["Directe feedback", "Verplichte herhaling", "Live monitoring"].map(t => <span key={t}>✅ {t}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── TRAININGEN ───────────────────────────────────────────────────────────────

function TrainingenPage({ setPage, onAddCart }) {
  const [niveauFilter, setNiveauFilter] = useState("alle");
  const [typeFilter, setTypeFilter] = useState("alle");
  const [detail, setDetail] = useState(null);

  const filtered = trainingen.filter(t => {
    if (niveauFilter !== "alle" && t.niveau !== niveauFilter) return false;
    if (typeFilter !== "alle" && t.type !== typeFilter) return false;
    return true;
  });
  const hero = filtered.find(t => t.hero);
  const rest = filtered.filter(t => !t.hero);

  if (detail) return <TrainingDetail training={detail} onBack={() => setDetail(null)} onAddCart={onAddCart} />;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4">Haal je rekenexamen in één keer</h1>
          <p className="text-xl text-gray-600 mb-4">Voor mbo 1 t/m 4 — gebaseerd op echte examens</p>
          <div className="flex justify-center gap-4 text-sm"><Stars rating={4.8} /><span className="text-blue-600 font-semibold">500+ studenten geslaagd</span></div>
        </div>

        {hero && (
          <div className="mb-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-8 shadow-2xl">
            <div className="flex gap-3 mb-4"><Badge color="amber">{hero.niveau.toUpperCase()}</Badge>{hero.label && <Badge color="amber">{hero.label}</Badge>}</div>
            <h2 className="text-4xl font-black mb-2">{hero.titel}</h2>
            <p className="text-blue-100 text-xl mb-6">{hero.beschrijving}</p>
            <div className="flex flex-wrap gap-4 mb-6 text-sm">
              <Stars rating={hero.rating} /><span className="text-blue-200">({hero.reviews} reviews)</span>
              {hero.aantalPlekken && <span className="bg-orange-500 px-3 py-1 rounded-full font-bold">🔥 Nog {hero.aantalPlekken} plekken</span>}
              {hero.startdatum && <span className="text-blue-200">📅 {hero.startdatum}</span>}
            </div>
            <div className="flex items-end justify-between border-t border-white/20 pt-6">
              <div><div className="text-blue-200 text-sm">Complete training</div><div className="text-5xl font-black">€{hero.prijs}</div></div>
              <button onClick={() => setDetail(hero)} className="bg-white text-blue-700 hover:bg-blue-50 font-bold text-xl px-8 py-4 rounded-xl shadow-lg transition-all">Start nu →</button>
            </div>
          </div>
        )}

        <div className="bg-white p-4 rounded-xl border mb-8 flex flex-wrap gap-3">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Niveau</label>
            <select value={niveauFilter} onChange={e => setNiveauFilter(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="alle">Alle niveaus</option>
              {["mbo-1", "mbo-2", "mbo-3", "mbo-4"].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Type</label>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="alle">Alle types</option>
              <option value="weekly">Wekelijkse training</option>
              <option value="stoomtraining">Stoomtraining</option>
              <option value="oefening">Oefentraining</option>
              <option value="bundel">Complete bundel</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {rest.map(t => (
            <div key={t.id} className="bg-white rounded-xl border-2 hover:border-blue-500 hover:shadow-lg transition-all p-6">
              <div className="flex gap-2 mb-4"><Badge>{t.niveau.toUpperCase()}</Badge>{t.label && <Badge color="green">{t.label}</Badge>}</div>
              <h3 className="text-xl font-bold mb-1">{t.titel}</h3>
              <p className="text-gray-500 text-sm mb-3">{t.korteUsp}</p>
              {t.rating && <div className="mb-3"><Stars rating={t.rating} /><span className="text-xs text-gray-400 ml-1">({t.reviews})</span></div>}
              <div className="space-y-1 mb-4">
                {t.aantalPlekken && <div className="text-orange-600 text-sm font-semibold">🔥 Nog {t.aantalPlekken} plekken</div>}
                {t.startdatum ? <div className="text-gray-400 text-xs">📅 {t.startdatum}</div> : <div className="text-green-600 text-sm font-semibold">✅ Direct beschikbaar</div>}
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div><div className="text-xs text-gray-400">Complete training</div><div className="text-3xl font-black text-blue-600">€{t.prijs}</div></div>
                <button onClick={() => setDetail(t)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-lg transition-colors">Start nu →</button>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">Geen trainingen gevonden.</div>}
      </div>
    </div>
  );
}

function TrainingDetail({ training: t, onBack, onAddCart }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 font-medium">← Terug naar trainingen</button>
        <div className="bg-white rounded-2xl border-2 overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <div className="flex gap-2 mb-3"><Badge color="amber">{t.niveau.toUpperCase()}</Badge>{t.label && <Badge color="amber">{t.label}</Badge>}</div>
            <h1 className="text-3xl font-black mb-2">{t.titel}</h1>
            <p className="text-blue-100 text-lg">{t.beschrijving}</p>
          </div>
          <div className="p-8">
            <h3 className="font-black text-lg mb-4">Wat je krijgt:</h3>
            <ul className="space-y-2 mb-8">
              {t.watJeKrijgt.map(item => <li key={item} className="flex items-start gap-3"><span className="text-green-500 flex-shrink-0">✅</span><span className="text-gray-700">{item}</span></li>)}
            </ul>
            <div className="flex flex-wrap gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
              {t.rating && <div><Stars rating={t.rating} /><div className="text-xs text-gray-400 mt-1">{t.reviews} reviews</div></div>}
              {t.aantalPlekken && <div className="text-orange-600 font-bold text-sm">🔥 Nog {t.aantalPlekken} plekken</div>}
              {t.startdatum && <div className="text-gray-500 text-sm">📅 {t.startdatum}</div>}
            </div>
            <div className="flex items-center justify-between pt-6 border-t">
              <div><div className="text-gray-400 text-sm">Complete training</div><div className="text-5xl font-black text-blue-600">€{t.prijs}</div></div>
              <button onClick={() => onAddCart({ id: t.id, naam: t.titel, prijs: t.prijs, type: "training" })} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl px-8 py-4 rounded-xl shadow-lg transition-all">In winkelwagen 🛒</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WEBSHOP ──────────────────────────────────────────────────────────────────

function WebshopPage({ cart, onAddCart }) {
  const [catFilter, setCatFilter] = useState("alle");
  const [niveauFilter, setNiveauFilter] = useState("alle");
  const filtered = producten.filter(p => {
    if (catFilter !== "alle" && p.categorie !== catFilter) return false;
    if (niveauFilter !== "alle" && p.niveau !== niveauFilter) return false;
    return true;
  });
  const catLabels = { oefenbundel: "Oefenbundel", samenvatting: "Samenvatting", examenvragen: "Examenvragen" };
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4">Digitaal rekenmateriaal</h1>
          <p className="text-xl text-gray-600">Direct downloaden na betaling.</p>
        </div>
        <div className="bg-white p-5 rounded-xl border mb-8 grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Categorie</label>
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="alle">Alle categorieën</option>
              <option value="oefenbundel">Oefenbundels</option>
              <option value="samenvatting">Samenvattingen</option>
              <option value="examenvragen">Examenvragen</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Niveau</label>
            <select value={niveauFilter} onChange={e => setNiveauFilter(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="alle">Alle niveaus</option>
              {["mbo-1", "mbo-2", "mbo-3", "mbo-4"].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
        <p className="text-gray-400 text-sm mb-6">{filtered.length} producten gevonden</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => {
            const inCart = cart.some(c => c.id === p.id);
            return (
              <div key={p.id} className="bg-white rounded-xl border-2 hover:border-blue-500 hover:shadow-lg transition-all flex flex-col">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <Badge color="purple">{catLabels[p.categorie]}</Badge>
                    {p.niveau && <span className="text-xs text-gray-400 font-semibold">{p.niveau.toUpperCase()}</span>}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{p.naam}</h3>
                  <p className="text-sm text-gray-500 mb-4">{p.beschrijving}</p>
                  <ul className="space-y-1.5 mb-4 flex-1">
                    {p.inhoud.slice(0, 3).map(item => <li key={item} className="flex items-start gap-2 text-sm text-gray-600"><span className="text-green-500 flex-shrink-0">✓</span>{item}</li>)}
                    {p.inhoud.length > 3 && <li className="text-xs text-gray-400">+ {p.inhoud.length - 3} meer...</li>}
                  </ul>
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">📥 {p.bestandstype}</div>
                    {p.rating && <div className="mb-3"><Stars rating={p.rating} /><span className="text-xs text-gray-400 ml-1">({p.reviews})</span></div>}
                    <div className="text-2xl font-black text-blue-600 mb-3">€{p.prijs}</div>
                    <button onClick={() => !inCart && onAddCart({ id: p.id, naam: p.naam, prijs: p.prijs, type: "product" })} disabled={inCart}
                      className={`w-full font-bold py-2.5 rounded-lg transition-colors text-sm ${inCart ? "bg-green-100 text-green-700 cursor-default" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
                      {inCart ? "✅ In winkelwagen" : "🛒 In winkelwagen"}
                    </button>
                    <p className="text-xs text-gray-400 text-center mt-2">Direct downloaden na betaling</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── PORTAAL LOGIN ────────────────────────────────────────────────────────────

function PortaalLogin({ setPage, setPortaalUser }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = (user) => {
    setCurrentUser(user);
    setPortaalUser(user);
    setPage(user.role === "student" ? "portaal-student" : "portaal-docent");
  };

  const login = async () => {
    if (!email.trim()) { setError("Vul je e-mailadres in"); return; }
    setLoading(true);
    const user = await findByEmail(email);
    setLoading(false);
    if (user) { navigate(user); }
    else { setIsNew(true); setError(""); }
  };

  const register = async () => {
    if (!email.trim() || !name.trim()) { setError("Vul alle velden in"); return; }
    setLoading(true);
    const newUser = { id: `${role}-${Date.now()}`, name: name.trim(), email: email.trim().toLowerCase(), role };
    const created = await createUser(newUser);
    setLoading(false);
    navigate(created || newUser);
  };

  const demoLogin = async (e) => {
    setLoading(true);
    const user = await findByEmail(e);
    setLoading(false);
    if (user) navigate(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-md mx-auto">
        <button onClick={() => setPage("home")} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium">← Terug naar homepage</button>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">📚</div>
          <h1 className="text-3xl font-black mb-1">Leerportaal</h1>
          <p className="text-gray-500">Verbonden met Supabase ☁️</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-4">
          {!isNew ? (
            <div>
              <h2 className="text-xl font-black mb-6">Inloggen</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">E-mailadres</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && login()}
                    className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500" placeholder="jouw@email.nl" />
                </div>
                {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
                <button onClick={login} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors">
                  {loading ? "Laden..." : "Doorgaan →"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-black mb-6">Account aanmaken</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Naam</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500" placeholder="Je naam" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">E-mail</label>
                  <input type="email" value={email} disabled className="w-full border-2 rounded-xl px-4 py-3 bg-gray-50 text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Ik ben een</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[["student", "👤", "Student"], ["docent", "📖", "Docent"]].map(([r, icon, label]) => (
                      <button key={r} onClick={() => setRole(r)} className={`p-4 border-2 rounded-xl font-semibold transition-all ${role === r ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-gray-300"}`}>
                        <div className="text-2xl mb-1">{icon}</div>{label}
                      </button>
                    ))}
                  </div>
                </div>
                {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
                <div className="flex gap-3">
                  <button onClick={() => setIsNew(false)} className="flex-1 border-2 border-gray-300 font-semibold py-3 rounded-xl hover:bg-gray-50">Terug</button>
                  <button onClick={register} disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors">{loading ? "Laden..." : "Account aanmaken"}</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-blue-50 rounded-xl p-5">
          <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Demo accounts</p>
          <div className="space-y-2">
            {[["lisa@student.nl", "Lisa de Vries", "Student", "👤"], ["mohammed@student.nl", "Mohammed Hassan", "Student", "👤"], ["docent@inclusiefrekenen.nl", "Docent Demo", "Docent", "📖"]].map(([e, n, r, icon]) => (
              <button key={e} onClick={() => demoLogin(e)} disabled={loading}
                className="w-full flex items-center gap-3 bg-white px-4 py-3 rounded-lg hover:shadow transition-shadow text-left disabled:opacity-60">
                <span className="text-lg">{icon}</span>
                <div><div className="font-semibold text-sm">{n}</div><div className="text-xs text-gray-400">{r}</div></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STUDENT PORTAAL ──────────────────────────────────────────────────────────

function StudentPortaal({ setPage, portaalUser, setPortaalUser }) {
  const [progress, setProgress] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProgress = useCallback(async () => {
    const user = getCurrentUser();
    if (!user || user.role !== "student") { setPage("portaal"); return; }
    const p = await getStudentProgress(user.id);
    setProgress(p);
    setLoading(false);
  }, [setPage]);

  useEffect(() => { loadProgress(); }, [loadProgress]);

  const logout = () => { deleteLiveSession(portaalUser?.id); setCurrentUser(null); setPortaalUser(null); setPage("portaal"); };

  if (activeModule) return <ModuleOefenen module={activeModule} user={portaalUser} onBack={() => { setActiveModule(null); loadProgress(); }} />;
  if (loading) return <Spinner />;
  if (!portaalUser || !progress) return null;

  const totalCorrect = Object.values(progress.modules).reduce((s, m) => s + m.aantalCorrect, 0);
  const totalFout = Object.values(progress.modules).reduce((s, m) => s + m.aantalFout, 0);
  const afgerond = Object.values(progress.modules).filter(m => m.afgerond).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">{portaalUser.name[0].toUpperCase()}</div>
            <div><div className="font-bold">{portaalUser.name}</div><div className="text-xs text-gray-400">Student · Supabase ☁️</div></div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setPage("home")} className="border-2 border-gray-200 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-gray-50">🏠 Homepage</button>
            <button onClick={logout} className="border-2 border-gray-200 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-gray-50">Uitloggen</button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[["🏆", `${progress.totaalScore}%`, "Totaalscore", "text-blue-600"], ["✅", totalCorrect, "Correct", "text-green-600"], ["❌", totalFout, "Fout", "text-red-500"], ["📚", `${afgerond}/${modules.length}`, "Afgerond", "text-purple-600"]].map(([icon, val, label, cls]) => (
            <div key={label} className="bg-white rounded-xl p-5 border-2">
              <div className="flex items-center gap-2 mb-1"><span>{icon}</span><span className="text-xs text-gray-400">{label}</span></div>
              <div className={`text-3xl font-black ${cls}`}>{val}</div>
            </div>
          ))}
        </div>

        {progress.zwakkeOnderwerpen.length > 0 && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-5 mb-8">
            <h3 className="font-bold text-orange-900 mb-2">⚠️ Zwakke onderwerpen</h3>
            <div className="flex flex-wrap gap-2">
              {progress.zwakkeOnderwerpen.map(id => { const m = modules.find(m => m.id === id); return m ? <span key={id} className="bg-orange-200 text-orange-900 px-3 py-1 rounded-full text-sm font-semibold">{m.naam}</span> : null; })}
            </div>
          </div>
        )}

        <h2 className="text-2xl font-black mb-6">Begin met oefenen</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {modules.map(mod => {
            const mp = progress.modules[mod.id];
            const colors = moduleColors[mod.id] || moduleColors.getallen;
            const totaal = mp.aantalCorrect + mp.aantalFout;
            const score = totaal > 0 ? Math.round((mp.aantalCorrect / totaal) * 100) : 0;
            return (
              <div key={mod.id} className={`bg-white rounded-xl border-2 overflow-hidden hover:shadow-lg transition-all ${mp.afgerond ? "border-green-300" : "hover:border-blue-400"}`}>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-sm font-bold`}>{mod.naam}</span>
                    {mp.afgerond && <span className="text-green-500">✅</span>}
                  </div>
                  <p className="text-gray-500 text-sm mb-4">{mod.beschrijving}</p>
                  <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg mb-4">
                    <div><div className="text-xs text-gray-400 mb-1">Score</div><div className={`text-xl font-black ${score >= 60 ? "text-green-600" : "text-orange-500"}`}>{score}%</div></div>
                    <div><div className="text-xs text-gray-400 mb-1">Correct op rij</div><div className="text-xl font-black text-blue-600">{mp.huidigeStreak}</div></div>
                    <div><div className="text-xs text-gray-400 mb-1">Herhalingen</div><div className="text-xl font-black text-gray-600">{mp.aantalHerhalingen}</div></div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Voortgang</span><span>{mp.aantalCorrect}/{mod.aantalVragen}</span></div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${mp.afgerond ? "bg-green-500" : "bg-blue-500"} transition-all`} style={{ width: `${Math.min((mp.aantalCorrect / mod.aantalVragen) * 100, 100)}%` }} />
                    </div>
                  </div>
                  <button onClick={() => setActiveModule(mod)} className={`w-full font-bold py-2.5 rounded-lg text-white transition-colors ${mp.afgerond ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}>
                    {mp.afgerond ? "Herhaal module" : totaal > 0 ? "Ga verder" : "Start module"} →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="bg-blue-50 rounded-xl p-6 mt-8">
          <h3 className="font-bold mb-3">💡 Tips voor effectief oefenen</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✅ Blijf oefenen tot je 3 vragen achter elkaar goed hebt</li>
            <li>✅ Lees de uitleg goed bij foute antwoorden</li>
            <li>✅ Focus eerst op zwakke onderwerpen voor maximaal resultaat</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── MODULE OEFENEN ───────────────────────────────────────────────────────────

const STREAK_REQUIRED = 3;

function ModuleOefenen({ module: mod, user, onBack }) {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [streak, setStreak] = useState(0);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const [needsRetry, setNeedsRetry] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [attempt, setAttempt] = useState(1);
  const [mpState, setMpState] = useState({ aantalCorrect: 0, aantalFout: 0, aantalHerhalingen: 0 });
  const colors = moduleColors[mod.id] || moduleColors.getallen;

  const genQuestion = useCallback(() => {
    const templates = questionTemplates.filter(t => t.moduleId === mod.id);
    if (!templates.length) return;
    const tmpl = templates[Math.floor(Math.random() * templates.length)];
    setQuestion(generateQuestion(tmpl));
    setAnswer(""); setFeedback(null); setNeedsRetry(false); setAttempt(1);
  }, [mod.id]);

  useEffect(() => {
    getStudentProgress(user.id).then(p => {
      const mp = p.modules[mod.id];
      setStreak(mp.huidigeStreak);
      setMpState({ aantalCorrect: mp.aantalCorrect, aantalFout: mp.aantalFout, aantalHerhalingen: mp.aantalHerhalingen });
    });
    genQuestion();
  }, []);

  useEffect(() => {
    if (question && user) {
      updateLiveSession({ studentId: user.id, studentNaam: user.name, moduleId: mod.id, huidigeVraagId: question.id, vraag: question.vraag, aantalFouten: stats.incorrect });
    }
  }, [question]);

  const submit = async () => {
    if (!question || !answer.trim()) return;
    const val = parseFloat(answer.replace(",", "."));
    const correct = Math.abs(val - question.correctAntwoord) < 0.01;
    setFeedback({ correct, antwoord: val });

    await saveAnswer({ questionId: question.id, studentId: user.id, antwoord: val, correct, pogingNummer: attempt });

    if (correct) {
      const ns = streak + 1;
      setStreak(ns);
      setStats(s => ({ ...s, correct: s.correct + 1 }));
      const newMp = { ...mpState, aantalCorrect: mpState.aantalCorrect + 1 };
      setMpState(newMp);
      await updateModuleProgress(user.id, mod.id, { aantalCorrect: newMp.aantalCorrect, huidigeStreak: ns, afgerond: ns >= STREAK_REQUIRED });
      if (ns >= STREAK_REQUIRED) setCompleted(true);
      await updateLiveSession({ studentId: user.id, studentNaam: user.name, moduleId: mod.id, huidigeVraagId: question.id, vraag: question.vraag, laatsteAntwoord: val, correct: true, aantalFouten: stats.incorrect });
    } else {
      setStreak(0); setNeedsRetry(true);
      setStats(s => ({ ...s, incorrect: s.incorrect + 1 }));
      const newMp = { ...mpState, aantalFout: mpState.aantalFout + 1, aantalHerhalingen: mpState.aantalHerhalingen + 1 };
      setMpState(newMp);
      await updateModuleProgress(user.id, mod.id, { aantalFout: newMp.aantalFout, aantalHerhalingen: newMp.aantalHerhalingen, huidigeStreak: 0 });
      await updateLiveSession({ studentId: user.id, studentNaam: user.name, moduleId: mod.id, huidigeVraagId: question.id, vraag: question.vraag, laatsteAntwoord: val, correct: false, aantalFouten: stats.incorrect + 1 });
    }
  };

  const next = () => {
    if (needsRetry && !feedback?.correct) {
      const sim = generateSimilar(question);
      if (sim) { setQuestion(sim); setAnswer(""); setFeedback(null); setAttempt(a => a + 1); }
      else genQuestion();
    } else { genQuestion(); }
  };

  if (!question) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="border-2 border-gray-200 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-50">← Terug</button>
            <span className={`px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-sm font-bold`}>{mod.naam}</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className={`flex items-center gap-1 font-bold ${streak >= STREAK_REQUIRED ? "text-green-600" : "text-orange-500"}`}>🔥 {streak}/{STREAK_REQUIRED}</span>
            <span className="text-green-600 font-semibold">✅ {stats.correct}</span>
            <span className="text-red-500 font-semibold">❌ {stats.incorrect}</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {completed && !needsRetry && (
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-8 mb-6 text-center">
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="text-2xl font-black mb-2">Module afgerond!</h2>
            <p className="text-green-100 mb-6">{STREAK_REQUIRED} vragen achter elkaar goed — opgeslagen in Supabase ☁️</p>
            <div className="flex gap-3 justify-center">
              <button onClick={onBack} className="bg-white text-green-700 font-bold px-6 py-3 rounded-xl">Terug naar overzicht</button>
              <button onClick={() => { setCompleted(false); genQuestion(); }} className="border-2 border-white text-white font-bold px-6 py-3 rounded-xl hover:bg-green-600">Blijf oefenen</button>
            </div>
          </div>
        )}

        {needsRetry && !feedback && (
          <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-5 mb-6">
            <h3 className="font-bold text-orange-900">🔄 Probeer het opnieuw</h3>
            <p className="text-sm text-orange-700 mt-1">Hier is een vergelijkbare vraag. Begrijp je fout eerst!</p>
          </div>
        )}

        <div className="bg-white rounded-2xl border-2 p-8 mb-6">
          <div className="flex justify-between mb-6 text-sm text-gray-400">
            <span>Niveau {question.moeilijkheid}</span>
            <span>Poging #{attempt}</span>
          </div>
          <h2 className="text-2xl font-bold mb-8 text-gray-900">{question.vraag}</h2>

          {!feedback ? (
            <div>
              <label className="block text-sm font-semibold mb-2">Jouw antwoord:</label>
              <div className="flex gap-3 mb-3">
                <input type="text" value={answer} onChange={e => setAnswer(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()}
                  className="flex-1 border-2 rounded-xl px-4 py-4 text-lg focus:outline-none focus:border-blue-500"
                  placeholder={`Antwoord in ${question.eenheid}...`} autoFocus />
                <button onClick={submit} disabled={!answer.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-8 rounded-xl transition-colors">Controleer</button>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Gebruik punt of komma voor decimalen</span>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-semibold">Antwoord in: {question.eenheid}</span>
              </div>
            </div>
          ) : (
            <div>
              <div className={`rounded-xl p-5 mb-5 ${feedback.correct ? "bg-green-50 border-2 border-green-300" : "bg-red-50 border-2 border-red-300"}`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{feedback.correct ? "✅" : "❌"}</span>
                  <div>
                    <h3 className={`font-black text-lg mb-2 ${feedback.correct ? "text-green-900" : "text-red-900"}`}>{feedback.correct ? "Goed gedaan!" : "Helaas, dat is niet correct"}</h3>
                    <p className={feedback.correct ? "text-green-700" : "text-red-700"}>Jouw antwoord: <strong>{answer}</strong></p>
                    {!feedback.correct && <p className="text-red-700">Correct: <strong>{question.correctAntwoord} {question.eenheid}</strong></p>}
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 mb-5">
                <h4 className="font-bold mb-3 text-blue-900">💡 Uitleg:</h4>
                <ol className="space-y-2">
                  {question.uitleg.map((stap, i) => (
                    <li key={i} className="flex gap-3 text-gray-700"><span className="font-black text-blue-600 flex-shrink-0">{i + 1}.</span><span>{stap}</span></li>
                  ))}
                </ol>
              </div>
              <button onClick={next} className={`w-full font-bold py-4 rounded-xl text-white text-lg transition-colors ${feedback.correct ? "bg-green-600 hover:bg-green-700" : "bg-orange-500 hover:bg-orange-600"}`}>
                {needsRetry && !feedback.correct ? "🔄 Probeer vergelijkbare vraag" : "Volgende vraag →"}
              </button>
            </div>
          )}
        </div>
        <div className="text-center text-sm text-gray-400">
          {streak < STREAK_REQUIRED ? `Nog ${STREAK_REQUIRED - streak} correct nodig om module af te ronden` : "Module voltooid!"}
        </div>
      </div>
    </div>
  );
}

// ─── DOCENT PORTAAL ───────────────────────────────────────────────────────────

function DocentPortaal({ portaalUser, setPortaalUser, setPage }) {
  const [allProgress, setAllProgress] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [activeTab, setActiveTab] = useState("live");
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const [prog, live, users] = await Promise.all([getAllStudentsProgress(), getLiveSessions(), getAllUsers()]);
    setAllProgress(prog);
    setLiveSessions(live);
    setAllStudents(users.filter(u => u.role === "student"));
    setLoading(false);
  }, []);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "docent") { setPage("portaal"); return; }
    loadData();
    const iv = setInterval(loadData, 5000);
    return () => clearInterval(iv);
  }, [loadData, setPage]);

  const logout = () => { setCurrentUser(null); setPortaalUser(null); setPage("portaal"); };

  const totalQ = allProgress.reduce((s, p) => s + Object.values(p.modules).reduce((ss, m) => ss + m.aantalCorrect + m.aantalFout, 0), 0);
  const totalC = allProgress.reduce((s, p) => s + Object.values(p.modules).reduce((ss, m) => ss + m.aantalCorrect, 0), 0);
  const avgScore = totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0;

  const tabs = [["live", "👁 Live"], ["progress", "📈 Voortgang"], ["stats", "📊 Statistieken"], ["niveaus", "⚙️ Niveaus"]];

  if (!portaalUser) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white font-black">{portaalUser.name[0]}</div>
            <div><div className="font-bold">{portaalUser.name}</div><div className="text-xs text-gray-400">Docent · Supabase ☁️</div></div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setPage("home")} className="border-2 border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50">🏠 Homepage</button>
            <button onClick={logout} className="border-2 border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50">Uitloggen</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? <Spinner /> : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[["👥", allStudents.length, "Studenten", "text-blue-600"], ["🟢", liveSessions.length, "Actief nu", "text-green-600"], ["📊", `${avgScore}%`, "Gem. score", "text-purple-600"], ["✍️", totalQ, "Vragen gemaakt", "text-gray-700"]].map(([i, v, l, c]) => (
                <div key={l} className="bg-white rounded-xl p-5 border-2">
                  <div className="flex items-center gap-2 mb-1"><span>{i}</span><span className="text-xs text-gray-400">{l}</span></div>
                  <div className={`text-3xl font-black ${c}`}>{v}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border-2 mb-8">
              <div className="flex border-b overflow-x-auto">
                {tabs.map(([id, label]) => (
                  <button key={id} onClick={() => setActiveTab(id)}
                    className={`flex-shrink-0 px-5 py-3 font-semibold text-sm transition-colors ${activeTab === id ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                    {label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* LIVE TAB */}
                {activeTab === "live" && (
                  <div>
                    <h2 className="text-xl font-black mb-4">Actieve studenten ({liveSessions.length})</h2>
                    {liveSessions.length === 0 ? (
                      <div className="text-center py-12 text-gray-400"><div className="text-4xl mb-3">📡</div><p>Geen actieve studenten op dit moment</p><p className="text-xs mt-2">Ververst automatisch elke 5 seconden</p></div>
                    ) : liveSessions.map(s => {
                      const mod = modules.find(m => m.id === s.module_id);
                      const colors = moduleColors[s.module_id] || moduleColors.getallen;
                      return (
                        <div key={s.student_id} className="border-2 rounded-xl p-5 mb-3 hover:border-blue-300 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">{s.student_naam[0]}</div>
                              <div><div className="font-bold">{s.student_naam}</div><span className={`text-xs px-2 py-0.5 ${colors.bg} ${colors.text} rounded-full`}>{mod?.naam}</span></div>
                            </div>
                            <span className="flex items-center gap-1.5 text-green-500 text-xs font-semibold"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />Live</span>
                          </div>
                          {s.vraag && <div className="bg-gray-50 rounded-lg p-3 mb-3 text-sm"><span className="text-xs text-gray-400">Huidige vraag: </span><p className="text-gray-700 mt-1">{s.vraag}</p></div>}
                          {s.laatste_antwoord != null && (
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold ${s.correct ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {s.correct ? "✅" : "❌"} Laatste: {s.laatste_antwoord} · {s.aantal_fouten} fouten
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* PROGRESS TAB */}
                {activeTab === "progress" && (
                  <div>
                    <h2 className="text-xl font-black mb-4">Voortgang per student</h2>
                    {allProgress.length === 0 && <div className="text-center py-8 text-gray-400">Nog geen studentdata</div>}
                    {allProgress.map(sp => {
                      const student = allStudents.find(s => s.id === sp.studentId);
                      if (!student) return null;
                      return (
                        <div key={student.id} className="border-2 rounded-xl p-6 mb-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-lg">{student.name[0]}</div>
                              <div><div className="font-bold text-lg">{student.name}</div><div className="text-sm text-gray-400">{student.email}</div></div>
                            </div>
                            <div className="text-right"><div className="text-2xl font-black text-blue-600">{sp.totaalScore}%</div><div className="text-xs text-gray-400">Totaalscore</div></div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-3">
                            {modules.map(mod => {
                              const mp = sp.modules[mod.id];
                              if (!mp) return null;
                              const colors = moduleColors[mod.id] || moduleColors.getallen;
                              const tot = mp.aantalCorrect + mp.aantalFout;
                              const score = tot > 0 ? Math.round((mp.aantalCorrect / tot) * 100) : 0;
                              return (
                                <div key={mod.id} className="bg-gray-50 rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className={`text-xs px-2 py-0.5 ${colors.bg} ${colors.text} rounded-full font-semibold`}>{mod.naam}</span>
                                    {mp.afgerond && <span className="text-green-500 text-xs">✅</span>}
                                  </div>
                                  <div className="flex justify-between">
                                    <div><div className="text-xs text-gray-400">Score</div><div className={`text-lg font-black ${score >= 60 ? "text-green-600" : "text-orange-500"}`}>{score}%</div></div>
                                    <div className="text-right"><div className="text-xs text-gray-400">Vragen</div><div className="text-lg font-semibold">{mp.aantalCorrect}/{tot}</div></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {sp.zwakkeOnderwerpen.length > 0 && (
                            <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-3">
                              <p className="text-sm font-semibold text-orange-900 mb-2">⚠️ Zwakke onderwerpen:</p>
                              <div className="flex flex-wrap gap-2">
                                {sp.zwakkeOnderwerpen.map(id => { const m = modules.find(m => m.id === id); return m ? <span key={id} className="bg-orange-200 text-orange-900 px-2 py-0.5 rounded-full text-xs">{m.naam}</span> : null; })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* STATS TAB */}
                {activeTab === "stats" && (
                  <div>
                    <h2 className="text-xl font-black mb-6">Groepsstatistieken per module</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      {modules.map(mod => {
                        const colors = moduleColors[mod.id] || moduleColors.getallen;
                        let correct = 0, total = 0;
                        allProgress.forEach(p => { const mp = p.modules[mod.id]; if (mp) { correct += mp.aantalCorrect; total += mp.aantalCorrect + mp.aantalFout; } });
                        const score = total > 0 ? Math.round((correct / total) * 100) : 0;
                        return (
                          <div key={mod.id} className="border-2 rounded-xl p-5">
                            <div className="flex justify-between items-center mb-3">
                              <span className={`px-3 py-1 ${colors.bg} ${colors.text} rounded-full font-bold text-sm`}>{mod.naam}</span>
                              <span className={`text-2xl font-black ${score < 50 ? "text-red-500" : score < 70 ? "text-orange-500" : "text-green-600"}`}>{score}%</span>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                              <div className={`h-full ${score < 50 ? "bg-red-400" : score < 70 ? "bg-orange-400" : "bg-green-500"} transition-all`} style={{ width: `${score}%` }} />
                            </div>
                            <p className="text-xs text-gray-400">{total} vragen gemaakt door alle studenten</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* NIVEAUS TAB */}
                {activeTab === "niveaus" && (
                  <div>
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 mb-6">
                      <h2 className="text-lg font-black mb-2">⚙️ Niveaus toewijzen</h2>
                      <p className="text-sm text-gray-600 mb-2">Wijs elk student een niveau toe. Wijzigingen worden direct opgeslagen in Supabase ☁️</p>
                      <div className="text-xs text-gray-500 space-y-1"><div><strong>1F:</strong> Basisvaardigheden</div><div><strong>2F:</strong> Middelbaar niveau</div><div><strong>3F:</strong> Gevorderd niveau</div></div>
                    </div>
                    <div className="space-y-4">
                      {allStudents.map(student => {
                        const sp = allProgress.find(p => p.studentId === student.id);
                        return (
                          <div key={student.id} className="border-2 rounded-xl p-5 hover:border-blue-200 transition-colors">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">{student.name[0]}</div>
                                <div>
                                  <div className="font-bold">{student.name}</div>
                                  <div className="text-sm text-gray-400">{student.email}</div>
                                  {sp && <div className="text-xs text-gray-400">Score: {sp.totaalScore}%</div>}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs font-semibold text-gray-500 mb-2">Niveau:</div>
                                <div className="flex gap-2">
                                  {["1F", "2F", "3F"].map(n => (
                                    <button key={n} onClick={async () => { await updateUserNiveau(student.id, n); loadData(); }}
                                      className={`px-5 py-2.5 rounded-lg font-bold transition-colors ${student.niveau === n ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                                      {n}
                                    </button>
                                  ))}
                                </div>
                                {!student.niveau && <p className="text-xs text-orange-500 mt-1.5">⚠️ Geen niveau toegewezen</p>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {allStudents.length === 0 && <div className="text-center py-8 text-gray-400">Nog geen studenten geregistreerd</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [portaalUser, setPortaalUser] = useState(() => getCurrentUser());
  const [toast, setToast] = useState(null);

  const addToCart = (item) => {
    setCart(prev => prev.some(i => i.id === item.id) ? prev : [...prev, item]);
    setCartOpen(true);
    setToast({ message: "Toegevoegd aan winkelwagen!", type: "success" });
  };
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const showFooter = !["portaal-student", "portaal-docent"].some(p => page.startsWith(p)) && page !== "portaal";

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Header page={page} setPage={setPage} cartCount={cart.length} onCartClick={() => setCartOpen(true)} />
      {cartOpen && <Cart items={cart} onRemove={removeFromCart} onClose={() => setCartOpen(false)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main className="flex-1">
        {page === "home" && <HomePage setPage={setPage} />}
        {page === "trainingen" && <TrainingenPage setPage={setPage} onAddCart={addToCart} />}
        {page === "webshop" && <WebshopPage cart={cart} onAddCart={addToCart} />}
        {page === "portaal" && <PortaalLogin setPage={setPage} setPortaalUser={setPortaalUser} />}
        {page === "portaal-student" && <StudentPortaal setPage={setPage} portaalUser={portaalUser} setPortaalUser={setPortaalUser} />}
        {page === "portaal-docent" && <DocentPortaal setPage={setPage} portaalUser={portaalUser} setPortaalUser={setPortaalUser} />}
      </main>

      {showFooter && <Footer setPage={setPage} />}
    </div>
  );
}
