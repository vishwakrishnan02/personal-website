// --- THEME TOGGLE LOGIC ---
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    htmlElement.classList.add('dark');
} else {
    htmlElement.classList.remove('dark');
}

themeToggleBtn.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');
    if (htmlElement.classList.contains('dark')) {
        localStorage.theme = 'dark';
    } else {
        localStorage.theme = 'light';
    }
});

// --- SCROLL REVEAL LOGIC ---
ScrollReveal().reveal('.reveal', { 
    distance: '20px',    
    origin: 'bottom', 
    duration: 600,       
    interval: 100,       
    viewFactor: 0.1,     
    delay: 0             
});

// --- CONTACT FORM LOGIC ---
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('form-status');
    
    // Check honeypot first
    const botField = document.getElementById('bot-field').value;
    if (botField) {
        console.warn("Bot detected.");
        return; 
    }

    const email = document.getElementById('user-email').value;
    const subject = document.getElementById('user-subject').value;
    const message = document.getElementById('user-message').value;

    status.style.color = "#94a3b8";
    status.innerText = "SENDING...";

    try {
        // REPLACE THIS URL WITH YOUR DEPLOYED AWS API GATEWAY ENDPOINT FOR SES
        const awsApiUrl = 'https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/send-email';
        
        const response = await fetch(awsApiUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email, subject, message })
        });
        
        if (response.ok) {
            status.style.color = "#10b981";
            status.innerText = "Success! Will get back to you soon.";
            e.target.reset();
        } else { 
            throw new Error('Network response was not ok'); 
        }
    } catch (err) {
        status.style.color = "#ef4444";
        status.innerText = "Error. Please use LinkedIn instead.";
        console.error("Fetch error:", err);
    }
});

// --- FALLBACK EMAIL LOGIC (Obfuscated) ---
const user = 'vishwakrishnan02';
const domain = 'gmail.com';
const emailLink = document.getElementById('direct-email-link');

emailLink.addEventListener('click', () => {
    window.location.href = `mailto:${user}@${domain}`;
});


// --- AI CHATBOT LOGIC ---
const chatToggle = document.getElementById('ai-chat-toggle');
const chatWindow = document.getElementById('ai-chat-window');
const closeChat = document.getElementById('close-chat');
const chatFormAI = document.getElementById('chat-form-ai');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

const iconOpen = document.getElementById('chat-icon-open');
const iconClose = document.getElementById('chat-icon-close');

let isChatOpen = false;

function toggleChat() {
    isChatOpen = !isChatOpen;
    
    // Prevent background scrolling on mobile when chat is open
    if (window.innerWidth < 640) {
        document.body.style.overflow = isChatOpen ? 'hidden' : '';
    }
    
    if (isChatOpen) {
        chatWindow.classList.remove('opacity-0', 'scale-95', 'pointer-events-none', 'translate-y-10');
        chatWindow.classList.add('opacity-100', 'scale-100', 'pointer-events-auto', 'translate-y-0');
        
        iconOpen.classList.replace('scale-100', 'scale-50');
        iconOpen.classList.replace('opacity-100', 'opacity-0');
        iconOpen.classList.replace('rotate-0', 'rotate-90');
        
        iconClose.classList.replace('scale-50', 'scale-100');
        iconClose.classList.replace('opacity-0', 'opacity-100');
        iconClose.classList.replace('rotate-[-90deg]', 'rotate-0');

        // On mobile, don't auto-focus, as it immediately pops the keyboard and can feel jarring
        if (window.innerWidth >= 640) {
            setTimeout(() => chatInput.focus(), 300);
        }
    } else {
        chatWindow.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto', 'translate-y-0');
        chatWindow.classList.add('opacity-0', 'scale-95', 'pointer-events-none', 'translate-y-10');

        iconOpen.classList.replace('scale-50', 'scale-100');
        iconOpen.classList.replace('opacity-0', 'opacity-100');
        iconOpen.classList.replace('rotate-90', 'rotate-0');
        
        iconClose.classList.replace('scale-100', 'scale-50');
        iconClose.classList.replace('opacity-100', 'opacity-0');
        iconClose.classList.replace('rotate-0', 'rotate-[-90deg]');
    }
}

chatToggle.addEventListener('click', toggleChat);
closeChat.addEventListener('click', toggleChat);

chatFormAI.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;

    appendMessage(message, 'user');
    chatInput.value = '';
    
    const loadingId = appendMessage('Thinking...', 'ai', true);

    try {
        // REPLACE WITH YOUR AWS API GATEWAY ENDPOINT
        const response = await fetch('https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/ask-ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: message })
        });
        
        const data = await response.json();
        
        // Remove the exact 'Thinking...' bubble
        const loadingBubble = document.getElementById(loadingId);
        if(loadingBubble) loadingBubble.remove();
        
        appendMessage(data.answer, 'ai');
        
    } catch (error) {
        const loadingBubble = document.getElementById(loadingId);
        if(loadingBubble) loadingBubble.remove();
        
        appendMessage("Sorry, the AI is currently resting. Please try again later.", 'ai');
    }
});

function appendMessage(text, sender, isLoading = false) {
    const msgDiv = document.createElement('div');
    // FIX: Generate a highly unique ID to prevent overlap
    const id = 'msg-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
    msgDiv.id = id;
    
    if (sender === 'user') {
        msgDiv.className = 'bg-blue-600 dark:bg-orange-600 text-white p-3 rounded-xl rounded-tr-none shadow-sm ml-auto max-w-[85%]';
    } else {
        // FIX: Replaced solid backgrounds with glass styling
        msgDiv.className = `glass p-3 rounded-xl rounded-tl-none shadow-sm text-slate-800 dark:text-zinc-200 max-w-[85%] ${isLoading ? 'animate-pulse' : ''}`;
    }
    
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return id;
}