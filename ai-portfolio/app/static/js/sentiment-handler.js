// Update sendMessage function to handle sentiment
function sendMessage(message) {
    // Show thinking expression while waiting for response
    avatarController.performGesture('think');
    
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
        // Save session ID
        sessionId = data.session_id;
        localStorage.setItem('chatSessionId', sessionId);
        
        // Respond with appropriate expression based on sentiment
        avatarController.respondToSentiment(data.sentiment || 'neutral');
        
        // Speak the response with avatar animation
        speakResponse(data.response);
    })
    .catch(error => {
        console.error('Error:', error);
        speakResponse('Sorry, I encountered an error while processing your request.');
    })
    .finally(() => {
        // Clear input field
        textInput.value = '';
    });
}
