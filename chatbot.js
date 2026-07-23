// ============================================
// SIMPLE PORTFOLIO CHATBOT
// ============================================

(function () {
    const widget = document.querySelector('.chatbot-widget');
    const toggleBtn = document.getElementById('chatbotToggle');
    const closeBtn = document.getElementById('chatbotClose');
    const messagesEl = document.getElementById('chatbotMessages');
    const form = document.getElementById('chatbotForm');
    const input = document.getElementById('chatbotInput');

    if (!widget || !toggleBtn || !form || !input || !messagesEl) return;

    const WELCOME_MESSAGE = "Hi! I'm Abdul Razaque's virtual assistant. Ask me about his skills, projects, education, or how to get in touch.";

    const RULES = [
        { keywords: ['hello', 'hi', 'hey', 'salam'], response: "Hello! How can I help you learn more about Abdul Razaque today?" },
        { keywords: ['skill', 'tech', 'stack', 'know'], response: "Abdul Razaque works with AI, Machine Learning, Deep Learning and GenAI applications — check out the Skills section above for the full list." },
        { keywords: ['project', 'work', 'portfolio'], response: "You can see Abdul Razaque's featured projects, including AI-powered apps, in the Projects section of this page." },
        { keywords: ['education', 'university', 'study', 'degree', 'college'], response: "Abdul Razaque is currently pursuing a degree in Artificial Intelligence at Aror University Sukkur, focusing on Machine Learning, Deep Learning and GenAI." },
        { keywords: ['experience', 'job', 'career'], response: "Take a look at the Experience section for a timeline of Abdul Razaque's roles and education." },
        { keywords: ['contact', 'email', 'hire', 'reach', 'connect'], response: "You can reach Abdul Razaque using the contact form below, or through the social links in the Contact section." },
        { keywords: ['service', 'offer'], response: "Abdul Razaque offers AI/ML development services, including custom GenAI applications — see the Services section for details." },
        { keywords: ['thank', 'thanks'], response: "You're welcome! Let me know if there's anything else you'd like to know." },
        { keywords: ['bye', 'goodbye'], response: "Thanks for stopping by! Feel free to reach out anytime through the contact form." }
    ];

    const FALLBACK_RESPONSE = "I'm a simple assistant so I might not have that answer, but you can send Abdul Razaque a message directly using the contact form below.";

    function addMessage(text, sender) {
        const bubble = document.createElement('div');
        bubble.className = `chat-message ${sender}`;
        bubble.textContent = text;
        messagesEl.appendChild(bubble);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function getResponse(userText) {
        const normalized = userText.toLowerCase();
        for (const rule of RULES) {
            if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
                return rule.response;
            }
        }
        return FALLBACK_RESPONSE;
    }

    function openChat() {
        widget.classList.add('open');
        if (!messagesEl.dataset.greeted) {
            addMessage(WELCOME_MESSAGE, 'bot');
            messagesEl.dataset.greeted = 'true';
        }
        input.focus();
    }

    function closeChat() {
        widget.classList.remove('open');
    }

    toggleBtn.addEventListener('click', () => {
        widget.classList.contains('open') ? closeChat() : openChat();
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeChat);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        input.value = '';

        setTimeout(() => {
            addMessage(getResponse(text), 'bot');
        }, 400);
    });
})();
