document.addEventListener('DOMContentLoaded', function() {
    // Initialize the enhanced avatar controller
    const avatarController = new EnhancedAvatarController();
    
    // DOM Elements
    const avatarContainer = document.getElementById('avatar-container');
    const speechBubble = document.getElementById('speech-bubble');
    const speechButton = document.getElementById('speech-button');
    const textInput = document.getElementById('text-input');
    const sendButton = document.getElementById('send-button');
    const statusDiv = document.getElementById('avatar-status');
    
    // Debug - Check if elements are found
    console.log('Avatar container found:', !!avatarContainer);
    console.log('Speech bubble found:', !!speechBubble);
    console.log('Text input found:', !!textInput);
    console.log('Send button found:', !!sendButton);
    
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
    
    // Function to speak text using ResponsiveVoice or fallback to Web Speech API
    function speakText(text) {
        // Start avatar speaking animation
        avatarController.startSpeaking(text);
        
        // Update the speech bubble
        if (speechBubble) {
            speechBubble.textContent = text;
            speechBubble.style.display = 'block';
        }
        
        // Log status
        if (statusDiv) {
            statusDiv.innerHTML += '<p>Speaking: ' + text + '</p>';
        }
        
        // Get voice settings from local storage
        const voiceType = localStorage.getItem('selectedVoice') || "Czech Female";
        const rate = parseFloat(localStorage.getItem('speechRate') || "1.0");
        const pitch = parseFloat(localStorage.getItem('speechPitch') || "1.0");
        
        console.log('Voice settings:', { voiceType, rate, pitch });
        
        // Use ResponsiveVoice if available
        if (hasResponsiveVoice) {
            // Cancel any ongoing speech
            if (responsiveVoice.isPlaying()) {
                responsiveVoice.cancel();
            }
            
            // Speak using selected voice
            responsiveVoice.speak(text, voiceType, {
                pitch: pitch,
                rate: rate,
                volume: 1,
                onstart: function() {
                    console.log('ResponsiveVoice started speaking');
                },
                onend: function() {
                    console.log('ResponsiveVoice finished speaking');
                    // Stop avatar animation when speech ends
                    avatarController.stopSpeaking();
                    
                    // Hide speech bubble after a short delay
                    setTimeout(() => {
                        if (speechBubble) {
                            speechBubble.style.display = 'none';
                        }
                    }, 1000);
                },
                onerror: function(error) {
                    console.error('ResponsiveVoice error:', error);
                    // Fallback to Web Speech API if ResponsiveVoice fails
                    fallbackSpeech(text);
                }
            });
        } else {
            // Fallback to Web Speech API
            fallbackSpeech(text);
        }
    }
    
    // Fallback speech function using Web Speech API
    function fallbackSpeech(text) {
        if (synth) {
            // Cancel any ongoing speech
            synth.cancel();
            
            // Create a new utterance
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Set utterance properties
            utterance.volume = 1;
            utterance.rate = parseFloat(localStorage.getItem('speechRate') || "1.0");
            utterance.pitch = parseFloat(localStorage.getItem('speechPitch') || "1.0");
            utterance.lang = 'cs-CZ'; // Set language to Czech
            
            // Events
            utterance.onend = function() {
                // Stop avatar animation when speech ends
                avatarController.stopSpeaking();
                
                // Hide speech bubble after a short delay
                setTimeout(() => {
                    if (speechBubble) {
                        speechBubble.style.display = 'none';
                    }
                }, 1000);
            };
            
            // Load voices
            let voices = synth.getVoices();
            if (voices.length > 0) {
                // Try to find a Czech voice
                const czechVoice = voices.find(voice => 
                    voice.lang.startsWith('cs') || voice.name.includes('Czech')
                );
                
                if (czechVoice) {
                    utterance.voice = czechVoice;
                    console.log('Using Czech voice:', czechVoice.name);
                } else {
                    // Use any available voice
                    utterance.voice = voices[0];
                    console.log('Czech voice not found, using:', voices[0].name);
                }
            }
            
            // Speak!
            synth.speak(utterance);
            console.log('Speaking using Web Speech API:', text);
        } else {
            console.warn('Speech synthesis not supported');
            
            // Even without speech, run the avatar animation
            setTimeout(() => {
                avatarController.stopSpeaking();
                
                // Hide speech bubble
                if (speechBubble) {
                    speechBubble.style.display = 'none';
                }
            }, text.length * 50); // Rough estimate of speech duration
            
            if (statusDiv) {
                statusDiv.innerHTML += '<p>ERROR: Speech synthesis not supported in this browser</p>';
            }
        }
    }
    
    // Send message to the backend
    function sendMessage(message) {
        // Update status
        if (statusDiv) {
            statusDiv.innerHTML += '<p>Sending message: ' + message + '</p>';
        }
        
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
        .then(response => {
            if (!response.ok) {
                throw new Error('API response was not ok: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('Response received:', data);
            
            // Save session ID
            sessionId = data.session_id;
            localStorage.setItem('chatSessionId', sessionId);
            
            // Update status
            if (statusDiv) {
                statusDiv.innerHTML += '<p>Response received: ' + data.response + '</p>';
            }
            
            // Respond to sentiment with animation
            avatarController.respondToSentiment(data.sentiment);
            
            // Speak the response
            speakText(data.response);
        })
        .catch(error => {
            console.error('Error:', error);
            if (statusDiv) {
                statusDiv.innerHTML += '<p>ERROR: ' + error.message + '</p>';
            }
            
            // Show concerned expression
            avatarController.setExpression('confused');
            
            // Say error message
            speakText('Omlouvám se, ale narazil jsem na problém. Prosím, zkuste to znovu.');
        });
    }
    
    // Handle form submission
    if (textInput && sendButton) {
        // Form submit event
        sendButton.addEventListener('click', function(e) {
            e.preventDefault();
            const message = textInput.value.trim();
            if (message) {
                sendMessage(message);
                textInput.value = '';
            }
        });
        
        // Enter key submission
        textInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const message = textInput.value.trim();
                if (message) {
                    sendMessage(message);
                    textInput.value = '';
                }
            }
        });
    }
    
    // Voice input
    if (speechButton && recognition) {
        speechButton.addEventListener('click', function() {
            // Start speech recognition
            try {
                recognition.start();
                if (statusDiv) {
                    statusDiv.innerHTML += '<p>Listening for speech input...</p>';
                }
                speechButton.classList.add('listening');
                
                // Tell avatar to pay attention
                avatarController.respondToUserSpeaking(true);
            } catch (e) {
                console.error('Error starting speech recognition:', e);
                if (statusDiv) {
                    statusDiv.innerHTML += '<p>ERROR starting speech recognition: ' + e.message + '</p>';
                }
            }
        });
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            if (textInput) {
                textInput.value = transcript;
            }
            if (statusDiv) {
                statusDiv.innerHTML += '<p>Speech recognized: ' + transcript + '</p>';
            }
            
            // Auto send after short delay
            setTimeout(() => {
                sendMessage(transcript);
            }, 500);
            
            speechButton.classList.remove('listening');
            
            // Tell avatar user stopped speaking
            avatarController.respondToUserSpeaking(false);
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            if (statusDiv) {
                statusDiv.innerHTML += '<p>Speech recognition error: ' + event.error + '</p>';
            }
            speechButton.classList.remove('listening');
            
            // Tell avatar user stopped speaking
            avatarController.respondToUserSpeaking(false);
        };
        
        recognition.onend = function() {
            speechButton.classList.remove('listening');
            
            // Tell avatar user stopped speaking
            avatarController.respondToUserSpeaking(false);
        };
    }
    
    // If there's no session, send an empty message to get a welcome response
    if (!sessionId) {
        // Send a special greeting request with slight delay to ensure page is loaded
        setTimeout(() => {
            // Make avatar wave to welcome
            avatarController.performGesture('wave');
            
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
                // Fallback welcome message
                speakText("Ahoj! Jsem Jan Novák. Rád tě poznávám! Co bys chtěl vědět o mých projektech?");
            });
        }, 1000);
    }
});
