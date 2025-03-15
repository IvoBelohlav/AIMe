document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatForm = document.getElementById('chat-form');
    const textInput = document.getElementById('text-input');
    const sendButton = document.getElementById('send-button');
    const speechButton = document.getElementById('speech-button');
    const speechBubble = document.getElementById('speech-bubble');
    const statusDisplay = document.getElementById('avatar-status');
    
    // Flag for voice availability
    const synth = window.speechSynthesis;
    const hasResponsiveVoice = typeof responsiveVoice !== 'undefined';
    const hasElevenLabs = typeof window.elevenlabs !== 'undefined';
    
    // Set up speech recognition if available
    let recognition = null;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'cs-CZ'; // Set to Czech
        console.log('Speech recognition available');
    } else {
        console.warn('Speech recognition not supported');
    }
    
    // Session management
    let sessionId = localStorage.getItem('chatSessionId');
    
    // Show speech bubble with text
    function showSpeechBubble(text) {
        if (speechBubble) {
            speechBubble.textContent = text;
            speechBubble.style.display = 'block';
            
            // Hide speech bubble after speech ends
            // We'll let the speakText function handle this via callbacks
        }
    }
    
    // Hide speech bubble
    function hideSpeechBubble() {
        if (speechBubble) {
            speechBubble.style.display = 'none';
        }
    }
    
    // Send message to API
    async function sendMessage(message) {
        if (!message) return;
        
        updateStatus(`Odesílám zprávu: "${message}"`);
        
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    session_id: sessionId
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Save session ID if provided
            if (data.session_id) {
                sessionId = data.session_id;
                localStorage.setItem('chatSessionId', sessionId);
            }
            
            // Process response
            updateStatus(`Přijata odpověď od AI`);
            
            // Speak the response if available
            if (data.response) {
                // Display speech bubble
                showSpeechBubble(data.response);
                
                // Use the global speakText function
                if (window.speakText) {
                    window.speakText(data.response);
                }
                
                // Set emotion if available
                if (data.emotion && window.avatarController) {
                    window.avatarController.respondToSentiment(data.emotion);
                }
            }
            
        } catch (error) {
            console.error('Error sending message:', error);
            updateStatus(`Chyba: ${error.message}`);
            
            // Hide speech bubble on error
            hideSpeechBubble();
            
            // Reset speaking state if there was an error
            if (window.avatarController) {
                window.avatarController.stopSpeaking();
            }
        }
    }
    
    // Update status display
    function updateStatus(message) {
        if (statusDisplay) {
            const timestamp = new Date().toLocaleTimeString();
            statusDisplay.innerHTML = `<p>[${timestamp}] ${message}</p>` + statusDisplay.innerHTML;
            
            // Keep only the last 5 messages
            const messages = statusDisplay.getElementsByTagName('p');
            if (messages.length > 5) {
                for (let i = 5; i < messages.length; i++) {
                    statusDisplay.removeChild(messages[i]);
                }
            }
        }
    }
    
    // Event Listeners
    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = textInput.value.trim();
            if (message) {
                sendMessage(message);
                textInput.value = '';
            }
        });
    }
    
    if (sendButton && textInput) {
        sendButton.addEventListener('click', () => {
            const message = textInput.value.trim();
            if (message) {
                sendMessage(message);
                textInput.value = '';
            }
        });
    }
    
    if (speechButton && recognition) {
        speechButton.addEventListener('click', () => {
            updateStatus('Poslouchám...');
            speechButton.classList.add('listening');
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                textInput.value = transcript;
                updateStatus(`Rozpoznáno: "${transcript}"`);
                
                // Auto-submit
                setTimeout(() => {
                    sendMessage(transcript);
                    textInput.value = '';
                }, 500);
            };
            
            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                updateStatus(`Chyba rozpoznávání: ${event.error}`);
                speechButton.classList.remove('listening');
            };
            
            recognition.onend = () => {
                speechButton.classList.remove('listening');
            };
            
            recognition.start();
        });
    }
    
    // Create enhanced voice test panel
    function createTestVoicePanel() {
        // Create container
        const testPanel = document.createElement('div');
        testPanel.className = 'voice-test-panel';
        testPanel.style.cssText = 'margin-top: 20px; background-color: #f0f8ff; padding: 15px; border-radius: 8px; border-left: 4px solid #4a90e2;';
        
        // Title
        const title = document.createElement('h4');
        title.textContent = 'Test hlasů';
        title.style.cssText = 'margin-top: 0; margin-bottom: 10px; color: #444;';
        testPanel.appendChild(title);
        
        // Explanation
        const explanation = document.createElement('p');
        explanation.innerHTML = `
            <strong>Tipy pro lepší výsledky:</strong>
            <ul style="margin-top: 5px; padding-left: 25px;">
                <li>Pro anime/stylizované hlasy nastavte <strong>Výraznost stylizace</strong> na 0.5-0.8</li>
                <li>Nezapomeňte nastavit <strong>ElevenLabs API klíč</strong> pro nejlepší hlasy</li>
                <li>Pro některé hlasy může být lepší nižší <strong>Stabilita</strong> (0.3)</li>
                <li>Vyzkoušejte různé kombinace nastavení</li>
            </ul>
        `;
        explanation.style.cssText = 'font-size: 13px; margin: 10px 0;';
        testPanel.appendChild(explanation);
        
        // Create test buttons container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 10px; flex-wrap: wrap;';
        
        // Test phrases for different voice types
        const testPhrases = {
            'Standard': "Ahoj, jsem virtuální asistent. Jak ti mohu dnes pomoci?",
            'Emoce': "Wow! To je úžasné! Jsem tak nadšený!",
            'Anime': "Eeeh?! Sugoi desu! To je neuvěřitelné!",
            'Vícejazyčné': "Hello! Ahoj! こんにちは! Hola! Guten Tag!"
        };
        
        // Add test buttons
        Object.keys(testPhrases).forEach(type => {
            const button = document.createElement('button');
            button.textContent = `Test: ${type}`;
            button.className = 'test-voice-btn';
            button.style.cssText = 'padding: 8px 15px; background-color: #4a90e2; color: white; border: none; border-radius: 4px; cursor: pointer; flex-grow: 1; min-width: 100px; font-size: 14px;';
            
            button.addEventListener('click', () => {
                showSpeechBubble(testPhrases[type]);
                
                // Use the global speakText function
                if (window.speakText) {
                    window.speakText(testPhrases[type]);
                }
                
                // Set a random expression
                if (window.avatarController) {
                    const expressions = ['happy', 'thinking', 'surprised'];
                    const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
                    window.avatarController.respondToSentiment(randomExpression);
                }
            });
            
            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = '#3a7bc8';
            });
            
            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = '#4a90e2';
            });
            
            buttonContainer.appendChild(button);
        });
        
        // Custom test button
        const customInputContainer = document.createElement('div');
        customInputContainer.style.cssText = 'margin-top: 10px; display: flex; gap: 10px;';
        
        const customInput = document.createElement('input');
        customInput.type = 'text';
        customInput.placeholder = 'Vlastní testovací text...';
        customInput.style.cssText = 'flex-grow: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;';
        customInputContainer.appendChild(customInput);
        
        const customButton = document.createElement('button');
        customButton.textContent = 'Test';
        customButton.style.cssText = 'padding: 8px 15px; background-color: #4a90e2; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;';
        
        customButton.addEventListener('click', () => {
            const text = customInput.value.trim();
            if (text) {
                showSpeechBubble(text);
                
                // Use the global speakText function
                if (window.speakText) {
                    window.speakText(text);
                }
                
                // Set a random expression
                if (window.avatarController) {
                    const expressions = ['happy', 'thinking', 'surprised'];
                    const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
                    window.avatarController.respondToSentiment(randomExpression);
                }
            }
        });
        
        customInputContainer.appendChild(customButton);
        
        // Add elements to panel
        testPanel.appendChild(buttonContainer);
        testPanel.appendChild(customInputContainer);
        
        return testPanel;
    }
    
    // Add the voice test panel after the voice controls
    const voiceControls = document.querySelector('.voice-control-panel');
    if (voiceControls && chatForm) {
        const testPanel = createTestVoicePanel();
        voiceControls.after(testPanel);
    }
    
    // Initialization status
    updateStatus('Avatar chat initialized');
    
    if (hasElevenLabs) {
        updateStatus('ElevenLabs voice engine dostupný');
    } else if (hasResponsiveVoice) {
        updateStatus('ResponsiveVoice engine dostupný');
    } else if (synth) {
        updateStatus('Web Speech API dostupný');
    } else {
        updateStatus('Žádný hlasový engine není dostupný');
    }
});
