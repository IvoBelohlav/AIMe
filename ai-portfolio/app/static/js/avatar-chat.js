document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded, initializing avatar controller');
    
    // Initialize controller with proper error handling
    try {
        // Make sure the EnhancedAvatarController class is loaded
        if (typeof EnhancedAvatarController === 'undefined') {
            console.error('EnhancedAvatarController class not found. Check script loading order.');
            return;
        }
        
        // Create controller instance
        const avatarController = new EnhancedAvatarController();
        
        // Explicitly assign to window object
        window.avatarController = avatarController;
        console.log('Avatar controller initialized and assigned to window.avatarController');
    } catch (error) {
        console.error('Error initializing avatar controller:', error);
    }
    
    // Rest of your avatar-chat.js code...
    const speechBubble = document.getElementById('speech-bubble');
    const speechButton = document.getElementById('speech-button');
    const textInput = document.getElementById('text-input');
    const sendButton = document.getElementById('send-button');
    
    // Check if ResponsiveVoice is available
    const hasResponsiveVoice = typeof responsiveVoice !== 'undefined';
    console.log('ResponsiveVoice available:', hasResponsiveVoice);
    
    // Initialize Web Speech API as fallback
    const synth = window.speechSynthesis;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'cs-CZ'; // Set to Czech
        console.log('Speech recognition available');
    } else {
        console.warn('Speech recognition not supported');
    }
    
    // Session management
    let sessionId = localStorage.getItem('chatSessionId');
    
    // Function to speak text
    function speakText(text) {
        if (!text) return;
        
        // Access avatarController safely
        const controller = window.avatarController;
        if (controller) {
            controller.startSpeaking(text);
        }
        
        // Show speech bubble
        if (speechBubble) {
            speechBubble.textContent = text;
            speechBubble.style.display = 'block';
        }
        
        // Use ResponsiveVoice if available
        if (hasResponsiveVoice) {
            // Get voice settings
            const voiceType = localStorage.getItem('selectedVoice') || "Czech Female";
            const rate = parseFloat(localStorage.getItem('speechRate') || "1.0");
            const pitch = parseFloat(localStorage.getItem('speechPitch') || "1.0");
            
            // Cancel any ongoing speech
            if (responsiveVoice.isPlaying()) {
                responsiveVoice.cancel();
            }
            
            // Speak using selected voice
            responsiveVoice.speak(text, voiceType, {
                pitch: pitch,
                rate: rate,
                volume: 1,
                onend: function() {
                    if (controller) {
                        controller.stopSpeaking();
                    }
                    
                    // Hide speech bubble after a short delay
                    setTimeout(() => {
                        if (speechBubble) {
                            speechBubble.style.display = 'none';
                        }
                    }, 1000);
                }
            });
        } else if (synth) {
            // Fallback to Web Speech API
            synth.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.volume = 1;
            utterance.rate = parseFloat(localStorage.getItem('speechRate') || "1.0");
            utterance.pitch = parseFloat(localStorage.getItem('speechPitch') || "1.0");
            utterance.lang = 'cs-CZ';
            
            utterance.onend = function() {
                if (controller) {
                    controller.stopSpeaking();
                }
                
                // Hide speech bubble
                setTimeout(() => {
                    if (speechBubble) {
                        speechBubble.style.display = 'none';
                    }
                }, 1000);
            };
            
            synth.speak(utterance);
        } else {
            console.warn('No speech synthesis available');
            
            // Still animate avatar
            setTimeout(() => {
                if (controller) {
                    controller.stopSpeaking();
                }
                
                if (speechBubble) {
                    speechBubble.style.display = 'none';
                }
            }, text.length * 50);
        }
    }
    
    // Test buttons event listeners
    const testButtons = document.querySelectorAll('.test-button');
    if (testButtons.length > 0) {
        console.log('Setting up test buttons:', testButtons.length);
        
        testButtons.forEach(button => {
            button.addEventListener('click', function() {
                const gesture = this.getAttribute('data-gesture');
                const expression = this.getAttribute('data-expression');
                
                const controller = window.avatarController;
                if (!controller) {
                    console.error('Avatar controller not found');
                    return;
                }
                
                console.log('Test button clicked:', { gesture, expression });
                
                if (gesture) {
                    controller.performGesture(gesture);
                }
                
                if (expression) {
                    controller.setExpression(expression);
                }
            });
        });
    }
    
    // Setup send button if available
    if (sendButton && textInput) {
        sendButton.addEventListener('click', function() {
            const message = textInput.value.trim();
            if (message) {
                // Send message to backend
                fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: message,
                        session_id: sessionId || null
                    })
                })
                .then(response => response.json())
                .then(data => {
                    // Save session ID
                    sessionId = data.session_id;
                    localStorage.setItem('chatSessionId', sessionId);
                    
                    // Speak the response
                    speakText(data.response);
                    
                    // Set sentiment response
                    const controller = window.avatarController;
                    if (controller) {
                        controller.respondToSentiment(data.sentiment || 'neutral');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    speakText('Omlouvám se, ale narazil jsem na problém. Prosím, zkuste to znovu.');
                });
                
                // Clear input
                textInput.value = '';
            }
        });
    }
    
    // If there's no session, send an empty message to get a welcome response
    if (!sessionId) {
        // Delay to ensure everything is loaded
        setTimeout(() => {
            const controller = window.avatarController;
            if (controller) {
                controller.performGesture('wave');
            }
            
            fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: "Ahoj",
                    session_id: null
                })
            })
            .then(response => response.json())
            .then(data => {
                // Save session ID
                sessionId = data.session_id;
                localStorage.setItem('chatSessionId', sessionId);
                
                // Speak the welcome message
                speakText(data.response);
            })
            .catch(error => {
                console.error('Error getting welcome message:', error);
                speakText("Ahoj! Jsem Jan Novák. Rád tě poznávám! Co bys chtěl vědět o mých projektech?");
            });
        }, 1000);
    }
});
