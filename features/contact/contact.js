// Initialize Quill Rich Text Editor (Only Bold, Italic, Underline)
const quill = new Quill('#quill-editor', {
    theme: 'snow',
    placeholder: "What's on your mind?",
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline']
        ]
    }
});

// Contact Form Logic
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('form-status');
    
    // Check honeypot
    const botField = document.getElementById('bot-field').value;
    if (botField) {
        console.warn("Bot detected.");
        return; 
    }

    const firstName = document.getElementById('user-first-name').value.trim();
    const lastName = document.getElementById('user-last-name').value.trim();
    const email = document.getElementById('user-email').value.trim();
    
    // Extract HTML payload from Quill
    const messageHTML = quill.root.innerHTML;
    
    // Prevent empty rich text submissions
    if (quill.getText().trim().length === 0) {
        status.style.color = "#ef4444";
        status.innerText = "Please enter a message.";
        return;
    }

    status.style.color = "#94a3b8";
    status.innerText = "SENDING...";

    try {
        const awsApiUrl = 'https://x4wzgffrfd.execute-api.us-east-1.amazonaws.com/prod/send-email';
        
        const response = await fetch(awsApiUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName, email, message: messageHTML })
        });
        
        if (response.ok) {
            status.style.color = "#10b981";
            status.innerText = "Success! Will get back to you soon.";
            e.target.reset();
            quill.setContents([]); // Clear the editor
        } else { 
            throw new Error('Network response failed'); 
        }
    } catch (err) {
        status.style.color = "#ef4444";
        status.innerText = "Error sending message. Please try again later.";
        console.error("Fetch error:", err);
    }
});