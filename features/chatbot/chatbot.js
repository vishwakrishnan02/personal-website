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
    
    if (window.innerWidth < 640) document.body.style.overflow = isChatOpen ? 'hidden' : '';
    
    if (isChatOpen) {
        chatWindow.classList.remove('opacity-0', 'scale-95', 'pointer-events-none', 'translate-y-10');
        chatWindow.classList.add('opacity-100', 'scale-100', 'pointer-events-auto', 'translate-y-0');
        
        iconOpen.classList.replace('scale-100', 'scale-50');
        iconOpen.classList.replace('opacity-100', 'opacity-0');
        iconOpen.classList.replace('rotate-0', 'rotate-90');
        
        iconClose.classList.replace('scale-50', 'scale-100');
        iconClose.classList.replace('opacity-0', 'opacity-100');
        iconClose.classList.replace('rotate-[-90deg]', 'rotate-0');

        if (window.innerWidth >= 640) setTimeout(() => chatInput.focus(), 300);
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
        const response = await fetch('https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/ask-ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: message })
        });
        
        const data = await response.json();
        
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
    const id = 'msg-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
    msgDiv.id = id;
    
    if (sender === 'user') {
        msgDiv.className = 'bg-blue-600 dark:bg-orange-600 text-white p-3 rounded-xl rounded-tr-none shadow-sm ml-auto max-w-[85%]';
    } else {
        msgDiv.className = `glass p-3 rounded-xl rounded-tl-none shadow-sm text-slate-800 dark:text-zinc-200 max-w-[85%] ${isLoading ? 'animate-pulse' : ''}`;
    }
    
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return id;
}