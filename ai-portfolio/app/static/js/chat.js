document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const toggleChatBtn = document.getElementById('toggle-chat');
    const chatContainer = document.getElementById('chat-container');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('messages-container');
    
    // State
    let sessionId = localStorage.getItem('chatSessionId');
    let isLoading = false;
    
    // Toggle chat display
    toggleChatBtn.addEventListener('click', function() {
        const isHidden = chatContainer.style.display === 'none';
        chatContainer.style.display = isHidden ? 'flex' : 'none';
        toggleChatBtn.textContent = isHidden ? 'Hide Chat' : 'Chat with my AI Assistant';
        
        if (isHidden) {
            chatInput.focus();
        }
    });
    
    // Handle chat form submission
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const message = chatInput.value.trim();
        if (!message || isLoading) return;
        
        // Add user message to the chat
        addMessageToChat('user', message);
        
        // Clear input
        chatInput.value = '';
        
        // Send to server
        sendMessage(message);
    });
    
    // Send message to server
    function sendMessage(message) {
        isLoading = true;
        
        // Show typing indicator
        addTypingIndicator();
        
        fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                session_id: sessionId
            }),
        })
        .then(response => response.json())
        .then(data => {
            // Remove typing indicator
            removeTypingIndicator();
            
            // Add AI response to chat
            addMessageToChat('ai', data.response);
            
            // Save session ID
            sessionId = data.session_id;
            localStorage.setItem('chatSessionId', sessionId);
            
            // Speak response if voice is enabled
            if (window.voiceEnabled) {
                speakText(data.response);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            removeTypingIndicator();
            addMessageToChat('ai', 'Sorry, I encountered an error. Please try again.');
        })
        .finally(() => {
            isLoading = false;
        });
    }
    
    // Add message to chat
    function addMessageToChat(role, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = message ;
        
        const messagePara = document.createElement('p');
        messagePara.textContent = text;
        
        messageDiv.appendChild(messagePara);
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Add typing indicator
    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-indicator';
        typingDiv.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
        typingDiv.id = 'typing-indicator';
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Initialize chat if we have a previous session
    if (sessionId) {
        // We don't need to load previous messages as they're stored server-side
        // Just make sure the chat interface is visible if we have a session
        chatContainer.style.display = 'flex';
        toggleChatBtn.textContent = 'Hide Chat';
    }
});

// Function to speak text (defined globally for access from voice.js)
function speakText(text) {
    if (!window.speechSynthesis) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply voice settings if available
    if (window.selectedVoice) {
        utterance.voice = window.selectedVoice;
    }
    
    if (window.speechRate) {
        utterance.rate = window.speechRate;
    }
    
    if (window.speechPitch) {
        utterance.pitch = window.speechPitch;
    }
    
    window.speechSynthesis.speak(utterance);
}
