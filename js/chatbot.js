// "Ask about Abdul" assistant.
// It runs entirely in the browser: a small knowledge base + keyword scoring, so it is free, instant,
// private and works on GitHub Pages. (To upgrade to a real LLM later, send `question` to a serverless
// function that holds your API key — never put an API key in front-end code.)
import { $ } from './env.js';

const KB = [
  { id: 'hi', keys: ['hi', 'hello', 'hey', 'salam', 'assalam', 'yo'], a: "Hi! 👋 I'm Abdul's portfolio assistant. Ask me about his skills, projects, experience, hackathons or how to contact him." },
  { id: 'who', keys: ['who', 'about', 'introduce', 'yourself', 'abdul', 'background', 'student', 'study', 'university', 'education', 'degree', 'graduate'], a: "Abdul Razaque is a 7th-semester BS Artificial Intelligence student at Aror University of Art, Architecture, Design and Heritage in Sukkur, Pakistan. He's graduating in May 2027 and builds practical ML, computer-vision and generative-AI applications." },
  { id: 'skills', keys: ['skill', 'skills', 'stack', 'tech', 'language', 'languages', 'framework', 'tools', 'know', 'python', 'pytorch', 'tensorflow', 'react'], a: 'Core stack:\n• Languages: Python, Java, C/C++, SQL, JavaScript\n• ML/Data: PyTorch, TensorFlow, Keras, Scikit-Learn, OpenCV, Pandas, NumPy\n• GenAI: LLMs, RAG, LangChain, prompt engineering, agentic AI\n• Web/Cloud: FastAPI, Flask, Streamlit, React, Node.js, Docker, AWS, Git', link: ['#skills', 'See the skills section'] },
  { id: 'projects', keys: ['project', 'projects', 'built', 'build', 'work', 'portfolio', 'best', 'github', 'repo'], a: 'Highlights:\n• ASTROCARE AI — crew-health prototype for NASA Space Apps (React + FastAPI)\n• Smart Career Counseling — explainable expert system across 10 career domains\n• AutoML for Small Businesses — automated preprocessing + model comparison (~60% faster experiments)\n• Face Detection Attendance — real-time OpenCV at 30+ FPS (~80% less logging time)', link: ['#projects', 'Open the projects'] },
  { id: 'astro', keys: ['astrocare', 'nasa', 'space'], a: 'ASTROCARE AI is a crew-health research prototype built for the NASA Space Apps Challenge 2026 — simulated telemetry, explainable trends, space-weather context and a mission simulator. Abdul was recognised as a "Galactic Problem Solver".', link: ['https://astrocare-ai.pages.dev/', 'Try the live demo'] },
  { id: 'exp', keys: ['experience', 'intern', 'internship', 'internships', 'job', 'worked', 'company', 'alkaram', 'elevvo'], a: 'Experience:\n• Business Technology Intern — Alkaram Textile Mills (Jun–Jul 2026)\n• Machine Learning Intern — Elevvo Pathways (2025): CNN + MFCC music-genre classifier, 87% accuracy on 10 genres\n• Blockchain Development Intern — Micro IT Industry (2025)', link: ['#experience', 'View the timeline'] },
  { id: 'hack', keys: ['hackathon', 'hackathons', 'achievement', 'achievements', 'award', 'awards', 'win', 'competition'], a: 'Hackathons & recognition: NASA Space Apps 2026 (Galactic Problem Solver), Open Hack ’26 (24-hour, Team Bug Hunters), NYLP × AI Hackathon, plus IMUN 2026 Ambassador, AUMUN ’26 and Lead Forward Sindh.', link: ['#achievements', 'See all achievements'] },
  { id: 'certs', keys: ['certificate', 'certificates', 'certification', 'certifications', 'course', 'courses', 'google', 'coursera'], a: 'Certificates include Google Data Analytics, Google Cybersecurity, Generative AI Application Developer (NCEAC–HEC), Google UX Design and more — 15 credentials in total.', link: ['#certifications', 'Browse certificates'] },
  { id: 'hire', keys: ['hire', 'available', 'availability', 'open', 'opportunity', 'opportunities', 'freelance', 'remote', 'looking'], a: "Yes — Abdul is open to AI/ML, computer-vision and full-stack AI internships (remote or on-site) and freelance prototypes. The quickest way is email or WhatsApp.", link: ['#contact', 'Go to contact'] },
  { id: 'contact', keys: ['contact', 'email', 'mail', 'reach', 'phone', 'whatsapp', 'linkedin', 'call', 'message'], a: 'Email: f23ari02@aror.edu.pk\nWhatsApp: +92 306 3044889\nLinkedIn: linkedin.com/in/abdul-razaque-744a782a1', link: ['mailto:f23ari02@aror.edu.pk', 'Send an email'] },
  { id: 'cv', keys: ['cv', 'resume', 'pdf', 'download'], a: 'You can download his resume right here.', link: ['Abdul_Razaque.pdf', 'Download resume (PDF)'] },
  { id: 'where', keys: ['where', 'location', 'based', 'country', 'city', 'pakistan', 'sukkur', 'time', 'timezone'], a: 'Abdul is based in Sukkur, Sindh, Pakistan (PKT, UTC+5). The live clock in the About section shows his local time.' },
  { id: 'learn', keys: ['learning', 'currently', 'now', 'studying', 'next'], a: 'Right now he is going deeper into agentic AI & RAG with LangChain, MLOps (Docker, FastAPI, CI/CD) and fine-tuning transformer models.' },
  { id: 'thanks', keys: ['thanks', 'thank', 'great', 'cool', 'nice', 'awesome'], a: "You're welcome! 😊 Anything else you'd like to know?" },
];
const CHIPS = ['Skills', 'Best projects', 'Experience', 'Hackathons', 'Is he available?', 'Contact'];

function answer(question) {
  const words = question.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  let best = null;
  let bestScore = 0;
  KB.forEach((entry) => {
    const score = words.reduce((s, w) => s + (entry.keys.includes(w) ? 2 : entry.keys.some((k) => k.length > 3 && w.startsWith(k.slice(0, 4))) ? 1 : 0), 0);
    if (score > bestScore) { bestScore = score; best = entry; }
  });
  return best || { a: "I'm not sure about that one — I'm a small on-page assistant. Try asking about skills, projects, experience, hackathons, certificates or contact. Or email Abdul directly: f23ari02@aror.edu.pk" };
}

export function initChatbot() {
  const fab = $('#chatFab');
  const panel = $('#chatPanel');
  const log = $('#chatLog');
  const form = $('#chatForm');
  const input = $('#chatInput');
  const chips = $('#chatChips');
  if (!fab || !panel) return;

  const add = (text, who, link) => {
    const m = document.createElement('div');
    m.className = `msg ${who}`;
    m.textContent = text;
    if (link) {
      const a = document.createElement('a');
      a.href = link[0];
      a.textContent = `\n→ ${link[1]}`;
      if (/^https?:/.test(link[0])) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      if (link[0].endsWith('.pdf')) a.download = 'Abdul_Razaque_CV.pdf';
      m.append(a);
    }
    log.append(m);
    log.scrollTop = log.scrollHeight;
    return m;
  };

  const ask = (q) => {
    if (!q.trim()) return;
    add(q, 'me');
    const typing = add('', 'bot typing');
    typing.innerHTML = '<span></span><span></span><span></span>';
    typing.setAttribute('aria-label', 'Assistant is typing');
    const res = answer(q);
    setTimeout(() => { typing.remove(); add(res.a, 'bot', res.link); }, 450 + Math.random() * 400);
  };

  const setOpen = (open) => {
    panel.hidden = !open;
    fab.setAttribute('aria-expanded', String(open));
    if (open) {
      if (!log.childElementCount) add(KB[0].a, 'bot');
      input.focus();
    } else fab.focus();
  };

  CHIPS.forEach((c) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = c;
    b.addEventListener('click', () => ask(c));
    chips.append(b);
  });
  fab.addEventListener('click', () => setOpen(panel.hidden));
  $('#chatClose')?.addEventListener('click', () => setOpen(false));
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  form.addEventListener('submit', (e) => { e.preventDefault(); ask(input.value); input.value = ''; });
}
