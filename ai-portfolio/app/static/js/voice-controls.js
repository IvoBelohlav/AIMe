// Voice control functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements for voice controls
    const voiceEngine = document.getElementById('voice-engine');
    const voiceSelect = document.getElementById('voice-select');
    const elevenLabsVoiceSelect = document.getElementById('elevenlabs-voice-select');
    const elevenLabsApiKey = document.getElementById('elevenlabs-api-key');
    const rateSlider = document.getElementById('rate-slider');
    const rateValue = document.getElementById('rate-value');
    const pitchSlider = document.getElementById('pitch-slider');
    const pitchValue = document.getElementById('pitch-value');
    const stabilitySlider = document.getElementById('stability-slider');
    const stabilityValue = document.getElementById('stability-value');
    const claritySlider = document.getElementById('clarity-slider');
    const clarityValue = document.getElementById('clarity-value');
    const styleSlider = document.getElementById('style-slider');
    const styleValue = document.getElementById('style-value');
    const testVoiceBtn = document.getElementById('test-voice-btn');
    const voiceStatus = document.getElementById('voice-status');
    const controlPanel = document.querySelector('.voice-control-panel');
    
    // Track current speech request
    let currentSpeechId = Date.now().toString();
    
    // Set ElevenLabs API key if not already set
    const elevenLabsApiKeyValue = 'sk_cd7e8351c4ee70da54659af81d31ee031c02d2c9534c11e1';
    if (elevenLabsApiKey && !localStorage.getItem('elevenLabsApiKey')) {
        elevenLabsApiKey.value = elevenLabsApiKeyValue;
        localStorage.setItem('elevenLabsApiKey', elevenLabsApiKeyValue);
        console.log('ElevenLabs API key set automatically');
    }
    
    // Initialize ElevenLabs if available
    let hasElevenLabs = typeof window.elevenlabs !== 'undefined';
    
    // Test phrases for different voice types
    const testPhrases = {
        normal: [
            "Ahoj, jsem tvůj virtuální asistent. Jak ti mohu dnes pomoci?",
            "Toto je test kvality hlasu. Zní přirozeně?",
            "Vítejte v aplikaci s pokročilou hlasovou syntézou."
        ],
        anime: [
            "Eeeh?! To je úžasné! Nemůžu tomu uvěřit!",
            "Ahoj! Jsem tvůj AI kamarád! Pojďme si spolu hrát!",
            "Wow! To je naprosto super! Jsi nejlepší!"
        ],
        multilingual: [
            "Hello! Ahoj! こんにちは! Hola! Guten Tag!",
            "I can speak multiple languages. Je umím mluvit více jazyky.",
            "Language is no barrier to communication anymore."
        ]
    };
    
    // ElevenLabs voices
    const elevenLabsVoices = [
        { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', description: 'Příjemný ženský hlas' },
        { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', description: 'Anime ženský hlas' },
        { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', description: 'Ženský hlas' },
        { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', description: 'Příjemný mužský hlas' },
        { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', description: 'Mladý ženský hlas' },
        { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', description: 'Energický mužský hlas' },
        { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', description: 'Silný mužský hlas' },
        { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', description: 'Hluboký mužský hlas' },
        { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam', description: 'Mužský hlas' },
        { id: 'jBpfuIE2acCO8z3wKNLl', name: 'Glinda', description: 'Anime ženský hlas s přízvukem' },
        { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Nova', description: 'Energický anime hlas' },
        { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Shimmer', description: 'Lehký anime hlas' },
        { id: 't0jbNlBVZ17f02VDIeMI', name: 'Mimi', description: 'Kawaii anime dívčí hlas' },
        { id: '8VdZQ0HeXlqm6JiMjIrj', name: 'Yumeko', description: 'Dramatický anime ženský hlas' },
        { id: 'U6qU46UpWhWPwD0qQXyO', name: 'Kazu', description: 'Mladý anime mužský hlas' },
        { id: 'h5ebIh8FwEEgVFSNmvJN', name: 'Haru', description: 'Veselý anime chlapecký hlas' }
    ];
    
    // ResponsiveVoice voices
    const responsiveVoices = [
        { name: 'Czech Female', lang: 'cs-CZ' },
        { name: 'Czech Male', lang: 'cs-CZ' },
        { name: 'UK English Female', lang: 'en-GB' },
        { name: 'UK English Male', lang: 'en-GB' },
        { name: 'US English Female', lang: 'en-US' },
        { name: 'US English Male', lang: 'en-US' },
        { name: 'Japanese Female', lang: 'ja-JP' },
        { name: 'Japanese Male', lang: 'ja-JP' }
    ];
    
    // Show status message
    function showStatus(message, type = 'info') {
        if (!voiceStatus) return;
        
        // Clear existing classes
        voiceStatus.className = 'voice-status';
        
        // Add type class
        if (type) {
            voiceStatus.classList.add(type);
        }
        
        // Set message
        voiceStatus.textContent = message;
        voiceStatus.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            voiceStatus.style.display = 'none';
        }, 5000);
    }
    
    // Load saved settings
    function loadSavedSettings() {
        // Load voice engine preference
        const savedEngine = localStorage.getItem('voiceEngine') || 'elevenlabs';
        if (voiceEngine) {
            voiceEngine.value = savedEngine;
            updateVisibleControls(savedEngine);
        }
        
        // Load saved voice ID
        const savedVoice = localStorage.getItem('selectedVoice');
        console.log("Loading saved voice:", savedVoice);
        
        // Handle ElevenLabs specific voice select
        if (savedEngine === 'elevenlabs' && elevenLabsVoiceSelect && savedVoice) {
            console.log("Setting ElevenLabs voice select to:", savedVoice);
            
            // Find the matching option in elevenLabsVoiceSelect
            let found = false;
            for (let i = 0; i < elevenLabsVoiceSelect.options.length; i++) {
                if (elevenLabsVoiceSelect.options[i].value === savedVoice) {
                    elevenLabsVoiceSelect.selectedIndex = i;
                    found = true;
                    console.log("Found matching ElevenLabs voice option at index:", i);
                    break;
                }
            }
            
            if (!found) {
                console.warn("Could not find matching ElevenLabs voice in select, defaulting to first option");
                if (elevenLabsVoiceSelect.options.length > 0) {
                    // Default to Rachel voice if available
                    const rachelOption = Array.from(elevenLabsVoiceSelect.options).find(opt => 
                        opt.value === '21m00Tcm4TlvDq8ikWAM');
                    
                    if (rachelOption) {
                        elevenLabsVoiceSelect.value = '21m00Tcm4TlvDq8ikWAM';
                        localStorage.setItem('selectedVoice', '21m00Tcm4TlvDq8ikWAM');
                        console.log("Defaulted to Rachel voice");
                    } else {
                        // Otherwise use first option
                        elevenLabsVoiceSelect.selectedIndex = 0;
                        localStorage.setItem('selectedVoice', elevenLabsVoiceSelect.options[0].value);
                        console.log("Defaulted to first voice option:", elevenLabsVoiceSelect.options[0].value);
                    }
                }
            }
        }
        
        // Handle regular voice select
        if (voiceSelect && savedVoice) {
            for (let i = 0; i < voiceSelect.options.length; i++) {
                if (voiceSelect.options[i].value === savedVoice) {
                    voiceSelect.selectedIndex = i;
                    break;
                }
            }
        }
        
        // Load ElevenLabs API key
        const savedApiKey = localStorage.getItem('elevenLabsApiKey');
        if (savedApiKey && elevenLabsApiKey) {
            elevenLabsApiKey.value = savedApiKey;
            
            // Initialize ElevenLabs with the API key if the library is available
            if (hasElevenLabs) {
                console.log('Initializing ElevenLabs with saved API key');
                // The library is already initialized, we just need to verify it works
                if (window.elevenlabs && window.elevenlabs.verifyApiKey) {
                    window.elevenlabs.verifyApiKey({
                        apiKey: savedApiKey,
                        onSuccess: (data) => {
                            console.log('ElevenLabs API key verified successfully');
                            showStatus('ElevenLabs API klíč je platný', 'success');
                        },
                        onError: (error) => {
                            console.error('Error verifying ElevenLabs API key:', error);
                            showStatus('Chyba ověření ElevenLabs API klíče: ' + error, 'error');
                        }
                    });
                }
            }
        }
        
        // Load rate and pitch
        const savedRate = localStorage.getItem('speechRate') || "1.0";
        if (rateSlider && rateValue) {
            rateSlider.value = savedRate;
            rateValue.textContent = savedRate;
            window.speechRate = parseFloat(savedRate);
        }
        
        const savedPitch = localStorage.getItem('speechPitch') || "1.0";
        if (pitchSlider && pitchValue) {
            pitchSlider.value = savedPitch;
            pitchValue.textContent = savedPitch;
            window.speechPitch = parseFloat(savedPitch);
        }
        
        // Load stability and clarity for ElevenLabs
        const savedStability = localStorage.getItem('elevenLabsStability') || "0.5";
        if (stabilitySlider && stabilityValue) {
            stabilitySlider.value = savedStability;
            stabilityValue.textContent = savedStability;
            window.stabilityValue = parseFloat(savedStability);
        }
        
        const savedClarity = localStorage.getItem('elevenLabsClarity') || "0.75";
        if (claritySlider && clarityValue) {
            claritySlider.value = savedClarity;
            clarityValue.textContent = savedClarity;
            window.clarityValue = parseFloat(savedClarity);
        }
        
        // Load style setting for ElevenLabs
        const savedStyle = localStorage.getItem('elevenLabsStyle') || "0.3";
        if (styleSlider && styleValue) {
            styleSlider.value = savedStyle;
            styleValue.textContent = savedStyle;
            window.styleValue = parseFloat(savedStyle);
        }
    }
    
    // Update visible controls based on selected engine
    function updateVisibleControls(engineType) {
        if (controlPanel) {
            // Remove all engine-specific classes
            controlPanel.classList.remove(
                'voice-engine-responsive', 
                'voice-engine-elevenlabs', 
                'voice-engine-browser'
            );
            
            // Add the appropriate class
            controlPanel.classList.add(`voice-engine-${engineType}`);
            
            // Add animation to highlight change
            controlPanel.classList.add('highlight-animation');
            setTimeout(() => {
                controlPanel.classList.remove('highlight-animation');
            }, 2000);
            
            // Update status
            if (engineType === 'elevenlabs') {
                showStatus('ElevenLabs aktivován - pro nejlepší hlas zadejte API klíč');
            } else if (engineType === 'responsive') {
                showStatus('ResponsiveVoice aktivován');
            } else {
                showStatus('Web Speech API aktivován');
            }
        }
    }
    
    // Get appropriate test phrase based on voice type
    function getTestPhrase() {
        // Default to normal phrases
        let phrases = testPhrases.normal;
        
        // Check for anime or multilingual voices if ElevenLabs is active
        if (voiceEngine && voiceEngine.value === 'elevenlabs' && elevenLabsVoiceSelect) {
            const voiceId = elevenLabsVoiceSelect.value;
            const voiceOption = elevenLabsVoiceSelect.options[elevenLabsVoiceSelect.selectedIndex];
            
            if (voiceOption) {
                const voiceText = voiceOption.text.toLowerCase();
                
                if (voiceText.includes('anime')) {
                    phrases = testPhrases.anime;
                } else if (voiceText.includes('multilingual')) {
                    phrases = testPhrases.multilingual;
                }
            }
        }
        
        // Return a random phrase from the selected category
        return phrases[Math.floor(Math.random() * phrases.length)];
    }
    
    // Event listeners
    if (voiceEngine) {
        voiceEngine.addEventListener('change', function() {
            const engine = voiceEngine.value;
            localStorage.setItem('voiceEngine', engine);
            updateVisibleControls(engine);
            
            // Repopulate voice options when engine changes
            if (engine === 'elevenlabs' && elevenLabsVoiceSelect) {
                // Use the ElevenLabs voice select value if engine is ElevenLabs
                console.log("Switching to ElevenLabs engine, getting voice from elevenLabsVoiceSelect");
                const elevenLabsVoiceId = elevenLabsVoiceSelect.value;
                if (elevenLabsVoiceId) {
                    localStorage.setItem('selectedVoice', elevenLabsVoiceId);
                    console.log("Set selectedVoice to:", elevenLabsVoiceId);
                }
            } else {
                // For other engines, populate the regular voice select
                populateVoiceOptions();
            }
            
            if (engine === 'elevenlabs') {
                // Show a message about API key if not set
                const apiKey = localStorage.getItem('elevenLabsApiKey');
                if (!apiKey) {
                    showStatus('Pro ElevenLabs nastavte API klíč', 'warning');
                } else {
                    showStatus('ElevenLabs aktivován', 'success');
                }
            }
        });
    }
    
    if (voiceSelect) {
        voiceSelect.addEventListener('change', function() {
            localStorage.setItem('selectedVoice', voiceSelect.value);
            showStatus(`Hlas změněn na: ${voiceSelect.options[voiceSelect.selectedIndex].text}`);
        });
    }
    
    if (elevenLabsVoiceSelect) {
        elevenLabsVoiceSelect.addEventListener('change', function() {
            const selectedVoice = elevenLabsVoiceSelect.value;
            localStorage.setItem('selectedVoice', selectedVoice);
            
            // Also update the regular voice-select if we're in elevenlabs mode
            if (voiceEngine && voiceEngine.value === 'elevenlabs' && voiceSelect) {
                // Find and select the matching option in voiceSelect
                for (let i = 0; i < voiceSelect.options.length; i++) {
                    if (voiceSelect.options[i].value === selectedVoice) {
                        voiceSelect.selectedIndex = i;
                        break;
                    }
                }
            }
            
            showStatus(`ElevenLabs hlas změněn na: ${elevenLabsVoiceSelect.options[elevenLabsVoiceSelect.selectedIndex].text}`);
            
            // Debug output
            console.log("ElevenLabs voice changed:", selectedVoice);
            console.log("Updated localStorage selectedVoice:", localStorage.getItem('selectedVoice'));
        });
    }
    
    if (elevenLabsApiKey) {
        elevenLabsApiKey.addEventListener('change', function() {
            const apiKey = elevenLabsApiKey.value.trim();
            localStorage.setItem('elevenLabsApiKey', apiKey);
            
            if (apiKey) {
                showStatus('API klíč ElevenLabs nastaven', 'success');
                
                // Verify the key works
                if (window.elevenlabs && window.elevenlabs.verifyApiKey) {
                    window.elevenlabs.verifyApiKey({
                        apiKey: apiKey,
                        onSuccess: (data) => {
                            console.log('ElevenLabs API key verified successfully');
                            showStatus('ElevenLabs API klíč je platný', 'success');
                        },
                        onError: (error) => {
                            console.error('Error verifying ElevenLabs API key:', error);
                            showStatus('Chyba ověření ElevenLabs API klíče: ' + error, 'error');
                        }
                    });
                }
            } else {
                showStatus('API klíč ElevenLabs byl vymazán', 'warning');
            }
        });
    }
    
    if (rateSlider && rateValue) {
        rateSlider.addEventListener('input', function() {
            const rate = rateSlider.value;
            rateValue.textContent = rate;
            window.speechRate = parseFloat(rate);
            localStorage.setItem('speechRate', rate);
        });
    }
    
    if (pitchSlider && pitchValue) {
        pitchSlider.addEventListener('input', function() {
            const pitch = pitchSlider.value;
            pitchValue.textContent = pitch;
            window.speechPitch = parseFloat(pitch);
            localStorage.setItem('speechPitch', pitch);
        });
    }
    
    if (stabilitySlider && stabilityValue) {
        stabilitySlider.addEventListener('input', function() {
            const stability = stabilitySlider.value;
            stabilityValue.textContent = stability;
            window.stabilityValue = parseFloat(stability);
            localStorage.setItem('elevenLabsStability', stability);
        });
    }
    
    if (claritySlider && clarityValue) {
        claritySlider.addEventListener('input', function() {
            const clarity = claritySlider.value;
            clarityValue.textContent = clarity;
            window.clarityValue = parseFloat(clarity);
            localStorage.setItem('elevenLabsClarity', clarity);
        });
    }
    
    if (styleSlider && styleValue) {
        styleSlider.addEventListener('input', function() {
            const style = styleSlider.value;
            styleValue.textContent = style;
            window.styleValue = parseFloat(style);
            localStorage.setItem('elevenLabsStyle', style);
        });
    }
    
    // Test voice function
    if (testVoiceBtn) {
        testVoiceBtn.addEventListener('click', function() {
            // Get current settings for debugging
            const currentEngine = localStorage.getItem('voiceEngine') || 'elevenlabs';
            const currentVoice = localStorage.getItem('selectedVoice') || '';
            
            console.log("TEST VOICE SETTINGS:");
            console.log("Engine:", currentEngine);
            console.log("Voice ID:", currentVoice);
            console.log("Style setting:", localStorage.getItem('elevenLabsStyle'));
            
            // Make sure we're using the right voice ID from the correct dropdown
            if (currentEngine === 'elevenlabs' && elevenLabsVoiceSelect) {
                const elevenLabsVoiceId = elevenLabsVoiceSelect.value;
                if (elevenLabsVoiceId && elevenLabsVoiceId !== currentVoice) {
                    localStorage.setItem('selectedVoice', elevenLabsVoiceId);
                    console.log("Updated voice ID from elevenLabsVoiceSelect:", elevenLabsVoiceId);
                }
            }
            
            const testText = getTestPhrase();
            console.log("Test phrase:", testText);
            
            // Now speak with the updated settings
            speakText(testText);
            showStatus(`Testování hlasu: "${testText}"`);
        });
    }
    
    // Global speak function to be used across the site
    window.speakText = function(text) {
        // Check for callbacks
        let callbacks = {};
        if (arguments.length > 1 && typeof arguments[1] === 'object') {
            callbacks = arguments[1];
        }
        
        // Get current voice settings
        const engine = localStorage.getItem('voiceEngine') || 'elevenlabs';
        const voice = localStorage.getItem('selectedVoice') || '';
        const rate = parseFloat(localStorage.getItem('speechRate') || 1);
        const pitch = parseFloat(localStorage.getItem('speechPitch') || 1);
        const volume = parseFloat(localStorage.getItem('voiceVolume') || 1);
        const stability = parseFloat(localStorage.getItem('elevenLabsStability') || 0.75);
        const similarity = parseFloat(localStorage.getItem('elevenLabsClarity') || 0.75);
        const style = parseFloat(localStorage.getItem('elevenLabsStyle') || 0);
        
        // Add visual indicator that speech is happening
        if (window.avatarController) {
            window.avatarController.startSpeaking();
        }
        
        // Track current speech request
        currentSpeechId = Date.now().toString();
        const thisRequestId = currentSpeechId;
        
        // Function to handle speech completion
        const onComplete = () => {
            // Only handle completion if this is still the current request
            if (thisRequestId === currentSpeechId) {
                if (window.avatarController) {
                    window.avatarController.stopSpeaking();
                }
                
                if (callbacks.onend) {
                    callbacks.onend();
                }
            }
        };
        
        // Function to handle speech error
        const onError = (error) => {
            console.error('Speech error:', error);
            
            // Don't show interruption errors to the user as they're usually just from speech being canceled
            if (!error.includes('interrupted')) {
                showStatus(`Chyba při hlasovém výstupu: ${error}`, 'error');
            }
            
            if (thisRequestId === currentSpeechId) {
                if (window.avatarController) {
                    window.avatarController.stopSpeaking();
                }
                
                if (callbacks.onerror) {
                    callbacks.onerror(error);
                }
            }
        };
        
        // Cancel any ongoing speech
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        
        if (typeof responsiveVoice !== 'undefined' && responsiveVoice && responsiveVoice.isPlaying()) {
            responsiveVoice.cancel();
        }
        
        // Use the selected engine
        if (engine === 'elevenlabs' && window.elevenlabs) {
            // *** BEGIN DYNAMIC APPROACH - USE SELECTED VOICE ***
            const apiKey = localStorage.getItem('elevenLabsApiKey');
            if (!apiKey) {
                showStatus('ElevenLabs API klíč není nastaven', 'error');
                onError('Missing API key');
                return;
            }
            
            // Get the voice ID from the dropdown rather than hardcoding
            let voiceId = voice; // Use the voice from localStorage
            
            // If we have the select element available, use its value directly (most up-to-date)
            if (elevenLabsVoiceSelect && elevenLabsVoiceSelect.value) {
                voiceId = elevenLabsVoiceSelect.value;
                console.log("Using voice directly from elevenLabsVoiceSelect:", voiceId);
            } else {
                console.log("Using voice from localStorage:", voiceId);
            }
            
            // Fallback to Domi if no voice is selected
            if (!voiceId) {
                voiceId = 'AZnzlk1XvdvUeBnXmlld'; // Domi as fallback
                console.log("No voice ID found, falling back to Domi voice");
            }
            
            // Get the voice details for the status message
            const selectedOption = elevenLabsVoiceSelect ? 
                elevenLabsVoiceSelect.options[elevenLabsVoiceSelect.selectedIndex] : null;
            const voiceName = selectedOption ? selectedOption.text : "ElevenLabs hlas";
            
            // Clean the text
            const cleanedText = text.replace(/\n+/g, ' ').trim();
            
            console.log("USING SELECTED VOICE IN SPEAKTEXT:");
            console.log("Voice ID:", voiceId);
            console.log("Voice Name:", voiceName);
            console.log("Text:", cleanedText.substring(0, 30) + "...");
            
            // Use appropriate style based on whether it's an anime voice
            const isAnimeVoice = selectedOption && 
                (selectedOption.text.toLowerCase().includes('anime') || 
                 voiceName.toLowerCase().includes('anime'));
            
            // Set style based on voice type and user setting
            const styleValue = isAnimeVoice ? 
                Math.max(0.5, parseFloat(localStorage.getItem('elevenLabsStyle') || 0.7)) : 
                parseFloat(localStorage.getItem('elevenLabsStyle') || 0);
            
            console.log("Voice type:", isAnimeVoice ? "Anime" : "Standard", "- Style value:", styleValue);
            
            showStatus(`Generuji hlas: ${voiceName}`, 'info');
            
            // Direct fetch approach with the selected voice
            fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': apiKey
                },
                body: JSON.stringify({
                    text: cleanedText,
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: {
                        stability: parseFloat(localStorage.getItem('elevenLabsStability') || 0.5),
                        similarity_boost: parseFloat(localStorage.getItem('elevenLabsClarity') || 0.8),
                        style: styleValue,
                        use_speaker_boost: true
                    }
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('HTTP error ' + response.status);
                }
                return response.blob();
            })
            .then(audioBlob => {
                console.log("ElevenLabs API call successful, playing audio");
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                
                audio.volume = volume;
                
                audio.onended = () => {
                    URL.revokeObjectURL(audioUrl);
                    onComplete();
                };
                
                audio.onerror = (event) => {
                    URL.revokeObjectURL(audioUrl);
                    onError(`Audio playback error: ${event.error}`);
                };
                
                audio.play().catch(error => {
                    onError(`Audio play error: ${error.message}`);
                });
                
                showStatus(`Přehrávám hlas: ${voiceName}`, 'success');
            })
            .catch(error => {
                console.error("ElevenLabs API call failed:", error);
                onError(`ElevenLabs error: ${error.message}`);
            });
            // *** END DYNAMIC APPROACH ***
        } else if (engine === 'responsivevoice' && typeof responsiveVoice !== 'undefined') {
            try {
                responsiveVoice.speak(text, voice, {
                    rate: rate,
                    pitch: pitch,
                    volume: volume,
                    onend: onComplete,
                    onerror: (error) => onError(`ResponsiveVoice error: ${error}`),
                });
                showStatus('Používám ResponsiveVoice', 'success');
            } catch (error) {
                onError(`ResponsiveVoice exception: ${error.message}`);
            }
        } else {
            // Fallback to Web Speech API
            try {
                if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(text);
                    
                    // Make sure voices are loaded
                    let voices = window.speechSynthesis.getVoices();
                    
                    // If no voices are available yet, wait for them to load
                    if (voices.length === 0) {
                        // Try to force voices to load
                        speechSynthesis.cancel();
                        
                        // Set a timeout to retry after a short delay
                        setTimeout(() => {
                            voices = window.speechSynthesis.getVoices();
                            completeUtteranceSetup(voices);
                        }, 200);
                    } else {
                        completeUtteranceSetup(voices);
                    }
                    
                    function completeUtteranceSetup(availableVoices) {
                        // Find the selected voice
                        const selectedVoice = availableVoices.find(v => v.name === voice);
                        
                        if (selectedVoice) {
                            utterance.voice = selectedVoice;
                        } else if (availableVoices.length > 0) {
                            // Default to first Czech or English voice
                            const czechVoice = availableVoices.find(v => v.lang.startsWith('cs'));
                            const englishVoice = availableVoices.find(v => v.lang.startsWith('en'));
                            utterance.voice = czechVoice || englishVoice || availableVoices[0];
                        }
                        
                        utterance.rate = rate;
                        utterance.pitch = pitch;
                        utterance.volume = volume;
                        
                        utterance.onend = onComplete;
                        utterance.onerror = (event) => {
                            // Only report non-interruption errors
                            if (event.error !== 'interrupted') {
                                onError(`SpeechSynthesis error: ${event.error}`);
                            } else {
                                // Just quietly complete for interruptions
                                onComplete();
                            }
                        };
                        
                        // Cancel any ongoing speech before starting new one
                        window.speechSynthesis.cancel();
                        
                        // Speak the text
                        window.speechSynthesis.speak(utterance);
                        showStatus('Používám Web Speech API', 'success');
                    }
                } else {
                    onError('Web Speech API není podporováno v tomto prohlížeči');
                }
            } catch (error) {
                onError(`SpeechSynthesis exception: ${error.message}`);
            }
        }
        
        return {
            cancel: () => {
                if (engine === 'elevenlabs') {
                    // No direct way to cancel ElevenLabs, but we can ignore on completion
                    currentSpeechId = Date.now().toString();
                } else if (engine === 'responsivevoice' && typeof responsiveVoice !== 'undefined') {
                    responsiveVoice.cancel();
                } else if (window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                }
                
                if (window.avatarController) {
                    window.avatarController.stopSpeaking();
                }
            }
        };
    };
    
    // Populate voice options
    function populateVoiceOptions() {
        if (!voiceSelect) {
            console.error("Voice select element not found!");
            return;
        }
        
        console.log("Populating voice options for engine:", voiceEngine.value);
        voiceSelect.innerHTML = '';
        
        if (voiceEngine.value === 'responsivevoice') {
            responsiveVoices.forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.name;
                option.textContent = `${voice.name} (${voice.lang})`;
                voiceSelect.appendChild(option);
            });
            
            // Set default if nothing is selected
            if (!voiceSelect.value && responsiveVoices.length > 0) {
                voiceSelect.value = responsiveVoices[0].name;
            }
            
            console.log("ResponsiveVoice options populated, selected:", voiceSelect.value);
        } else if (voiceEngine.value === 'elevenlabs') {
            // Use the elevenLabsVoices array for ElevenLabs options
            elevenLabsVoices.forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.id;
                option.textContent = `${voice.name} - ${voice.description}`;
                // Add a data attribute to identify anime voices
                if (voice.description.toLowerCase().includes('anime')) {
                    option.dataset.type = 'anime';
                }
                voiceSelect.appendChild(option);
            });
            
            // Get saved voice or default to first one
            const savedVoice = localStorage.getItem('selectedVoice');
            
            if (savedVoice) {
                // Try to find this voice in our options
                for (let i = 0; i < voiceSelect.options.length; i++) {
                    if (voiceSelect.options[i].value === savedVoice) {
                        voiceSelect.selectedIndex = i;
                        console.log("Found saved ElevenLabs voice:", savedVoice);
                        break;
                    }
                }
            }
            
            // Set default if nothing is selected
            if (!voiceSelect.value && elevenLabsVoices.length > 0) {
                voiceSelect.value = elevenLabsVoices[0].id;
                console.log("Set default ElevenLabs voice:", elevenLabsVoices[0].id);
            }

            // Show a status message recommending style setting for anime voices
            const selectedVoice = voiceSelect.options[voiceSelect.selectedIndex];
            if (selectedVoice && selectedVoice.dataset.type === 'anime') {
                showStatus('Pro anime hlasy doporučujeme nastavit Výraznost stylizace na hodnotu 0.5-0.8', 'info');
            }
            
            console.log("ElevenLabs options populated, selected:", voiceSelect.value);
        } else {
            // Web Speech API
            if ('speechSynthesis' in window) {
                const synth = window.speechSynthesis;
                const voices = synth.getVoices();
                
                // Filter only Czech and English voices
                const filteredVoices = voices.filter(voice => 
                    voice.lang.startsWith('cs') || voice.lang.startsWith('en')
                );
                
                filteredVoices.forEach(voice => {
                    const option = document.createElement('option');
                    option.value = voice.name;
                    option.textContent = `${voice.name} (${voice.lang})`;
                    voiceSelect.appendChild(option);
                });
                
                // Set default if nothing is selected
                if (!voiceSelect.value && filteredVoices.length > 0) {
                    voiceSelect.value = filteredVoices[0].name;
                }
                
                console.log("Web Speech API options populated, selected:", voiceSelect.value);
            }
        }
        
        // Save current voice setting
        if (voiceSelect.value) {
            localStorage.setItem('selectedVoice', voiceSelect.value);
            console.log("Saved selected voice to localStorage:", voiceSelect.value);
        }
    }
    
    // Voice select change event
    voiceSelect.addEventListener('change', () => {
        localStorage.setItem('selectedVoice', voiceSelect.value);
        
        // Show recommendation for anime voices
        if (voiceEngine.value === 'elevenlabs') {
            const selectedOption = voiceSelect.options[voiceSelect.selectedIndex];
            if (selectedOption && selectedOption.dataset.type === 'anime') {
                showStatus('Pro anime hlasy doporučujeme nastavit Výraznost stylizace na hodnotu 0.5-0.8', 'info');
                if (styleSlider && parseFloat(styleSlider.value) < 0.5) {
                    styleSlider.value = 0.7;
                    styleValue.textContent = styleSlider.value;
                    localStorage.setItem('voiceStyle', styleSlider.value);
                }
            }
        }
    });
    
    // Initialize on load
    loadSavedSettings();
    updateVisibleControls(localStorage.getItem('voiceEngine') || 'elevenlabs');
    
    // Create a global function for direct testing
    window.testElevenLabsVoice = function() {
        // Direct fetch approach that is known to work
        const apiKey = 'sk_cd7e8351c4ee70da54659af81d31ee031c02d2c9534c11e1';
        const voiceId = 'AZnzlk1XvdvUeBnXmlld'; // Domi anime voice
        const text = 'Ahoj! Jsem anime hlas Domi. Používám přímý test z globální funkce.';
        
        console.log("GLOBAL TEST ELEVENLABS VOICE FUNCTION");
        console.log("Using voice ID:", voiceId);
        
        fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': apiKey
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.8,
                    style: 0.7,
                    use_speaker_boost: true
                }
            })
        })
        .then(response => {
            console.log("Response status:", response.status);
            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }
            return response.blob();
        })
        .then(audioBlob => {
            console.log("Global test successful, playing audio");
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
            
            if (typeof showStatus === 'function') {
                showStatus('Přehrávám globální test anime hlasu', 'success');
            }
            
            return "Test successful!";
        })
        .catch(error => {
            console.error("Global test failed:", error);
            if (typeof showStatus === 'function') {
                showStatus('Chyba globálního testu: ' + error.message, 'error');
            }
            
            return "Test failed: " + error.message;
        });
        
        return "Test initiated...";
    };
    
    // DIRECT FIX: Force set the API key and voice
    localStorage.setItem('elevenLabsApiKey', 'sk_cd7e8351c4ee70da54659af81d31ee031c02d2c9534c11e1');
    
    // Force select an anime voice - Domi voice
    const animeVoiceId = 'AZnzlk1XvdvUeBnXmlld';  // Domi
    localStorage.setItem('selectedVoice', animeVoiceId);
    localStorage.setItem('voiceEngine', 'elevenlabs');
    console.log("DIRECT FIX APPLIED: Force-set ElevenLabs voice to Domi (AZnzlk1XvdvUeBnXmlld)");
    
    // Set related parameters for anime voice
    localStorage.setItem('elevenLabsStyle', '0.7');  // Higher style value for anime voices
    localStorage.setItem('elevenLabsStability', '0.5');
    localStorage.setItem('elevenLabsClarity', '0.8');
    
    // If the voice selects exist, set them directly
    if (elevenLabsVoiceSelect) {
        elevenLabsVoiceSelect.value = animeVoiceId;
        console.log("Set elevenLabsVoiceSelect dropdown to:", animeVoiceId);
    }
    
    if (voiceSelect) {
        // Also try to set the regular voice select
        for (let i = 0; i < voiceSelect.options.length; i++) {
            if (voiceSelect.options[i].value === animeVoiceId) {
                voiceSelect.selectedIndex = i;
                console.log("Set voiceSelect dropdown to index:", i);
                break;
            }
        }
    }
    
    if (voiceEngine) {
        voiceEngine.value = 'elevenlabs';
    }
    
    // Debug all localStorage items
    console.log("ALL CURRENT VOICE SETTINGS:");
    console.log("voiceEngine:", localStorage.getItem('voiceEngine'));
    console.log("selectedVoice:", localStorage.getItem('selectedVoice'));
    console.log("elevenLabsVoice:", localStorage.getItem('elevenLabsVoice'));
    console.log("elevenLabsApiKey:", localStorage.getItem('elevenLabsApiKey') ? 'Set (hidden)' : 'Not set');
    console.log("elevenLabsStyle:", localStorage.getItem('elevenLabsStyle'));
    console.log("elevenLabsStability:", localStorage.getItem('elevenLabsStability'));
    console.log("elevenLabsClarity:", localStorage.getItem('elevenLabsClarity'));
    
    // Add direct test button
    if (controlPanel) {
        // Add voice sync button first
        const syncVoicesBtn = document.createElement('button');
        syncVoicesBtn.textContent = 'SYNCHRONIZOVAT HLASY';
        syncVoicesBtn.style.cssText = 'background-color: #9C27B0; color: white; padding: 10px; margin-top: 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; width: 100%;';
        controlPanel.appendChild(syncVoicesBtn);
        
        syncVoicesBtn.addEventListener('click', function() {
            console.log("Synchronizing voice IDs...");
            
            // Create a map of HTML options to find mismatches
            const voiceMap = new Map();
            let updated = false;
            
            if (elevenLabsVoiceSelect) {
                console.log("Found elevenLabsVoiceSelect with " + elevenLabsVoiceSelect.options.length + " options");
                // Log all available voices in HTML
                Array.from(elevenLabsVoiceSelect.options).forEach(option => {
                    console.log(`HTML Voice: [${option.value}] ${option.text}`);
                    voiceMap.set(option.text.split(" (")[0], option.value);
                });
                
                // Check if our JS array needs updates
                elevenLabsVoices.forEach((voice, index) => {
                    const htmlVoiceId = voiceMap.get(voice.name);
                    if (htmlVoiceId && htmlVoiceId !== voice.id) {
                        console.log(`Mismatch found for ${voice.name}: JS ID=${voice.id}, HTML ID=${htmlVoiceId}`);
                        // Update our JS object
                        elevenLabsVoices[index].id = htmlVoiceId;
                        updated = true;
                    }
                });
                
                if (updated) {
                    // Get the currently selected voice name
                    const selectedOptionText = elevenLabsVoiceSelect.options[elevenLabsVoiceSelect.selectedIndex]?.text;
                    const selectedVoiceName = selectedOptionText ? selectedOptionText.split(" (")[0] : null;
                    
                    // Update localStorage with the correct ID
                    if (selectedVoiceName) {
                        const voice = elevenLabsVoices.find(v => v.name === selectedVoiceName);
                        if (voice) {
                            localStorage.setItem('selectedVoice', voice.id);
                            console.log(`Updated localStorage selectedVoice to: ${voice.id} (${voice.name})`);
                        }
                    }
                    
                    // Log updated voices
                    console.log("Updated voice mapping:");
                    elevenLabsVoices.forEach(voice => {
                        console.log(`${voice.name}: ${voice.id}`);
                    });
                    
                    showStatus('Hlasové ID úspěšně synchronizovány', 'success');
                } else {
                    console.log("No voice ID mismatches found");
                    showStatus('Hlasové ID jsou již synchronizovány', 'info');
                }
            } else {
                console.log("elevenLabsVoiceSelect not found");
                showStatus('Dropdown hlasů nenalezen', 'error');
            }
        });
        
        // Add a library test button
        const libraryTestBtn = document.createElement('button');
        libraryTestBtn.textContent = 'TEST KNIHOVNY ELEVENLABS';
        libraryTestBtn.style.cssText = 'background-color: #2196F3; color: white; padding: 10px; margin-top: 10px; margin-left: 10px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;';
        controlPanel.appendChild(libraryTestBtn);
        
        libraryTestBtn.addEventListener('click', function() {
            // Create an explicit test function that doesn't depend on the library
            const manualLibraryTest = function() {
                const apiKey = 'sk_cd7e8351c4ee70da54659af81d31ee031c02d2c9534c11e1';
                const voiceId = 'AZnzlk1XvdvUeBnXmlld'; // Domi anime voice
                const text = 'Ahoj! Toto je přímý test knihovny ElevenLabs.';
                
                console.log("MANUAL LIBRARY TEST");
                console.log("Using voice ID:", voiceId);
                
                fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'xi-api-key': apiKey
                    },
                    body: JSON.stringify({
                        text: text,
                        model_id: 'eleven_multilingual_v2',
                        voice_settings: {
                            stability: 0.5,
                            similarity_boost: 0.8,
                            style: 0.7,
                            use_speaker_boost: true
                        }
                    })
                })
                .then(response => {
                    console.log("Response status:", response.status);
                    if (!response.ok) {
                        throw new Error('HTTP error ' + response.status);
                    }
                    return response.blob();
                })
                .then(audioBlob => {
                    console.log("Manual library test successful, playing audio");
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);
                    audio.play();
                    showStatus('Test knihovny ElevenLabs úspěšný', 'success');
                })
                .catch(error => {
                    console.error("Manual library test failed:", error);
                    showStatus('Chyba testu knihovny: ' + error.message, 'error');
                });
            };
            
            // Call the directTest function from elevenlabs library or use manual test
            if (window.elevenlabs && typeof window.elevenlabs.directTest === 'function') {
                console.log("Calling elevenlabs.directTest() function");
                window.elevenlabs.directTest();
                showStatus('Testuji knihovnu ElevenLabs', 'info');
            } else {
                console.log("elevenlabs.directTest function not found, using manual test instead");
                manualLibraryTest();
                showStatus('Používám manuální test (directTest není k dispozici)', 'info');
            }
        });
        
        // Add a global test button
        const globalTestBtn = document.createElement('button');
        globalTestBtn.textContent = 'GLOBÁLNÍ TEST FUNKCE';
        globalTestBtn.style.cssText = 'background-color: #4CAF50; color: white; padding: 10px; margin-top: 10px; margin-left: 10px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;';
        controlPanel.appendChild(globalTestBtn);
        
        globalTestBtn.addEventListener('click', function() {
            console.log("Calling global testElevenLabsVoice function");
            const result = window.testElevenLabsVoice();
            console.log("Result:", result);
            showStatus('Spouštím globální test...', 'info');
        });
    }
    
    // Add direct test button
    const directTestBtn = document.createElement('button');
    directTestBtn.textContent = 'PŘÍMÝ TEST ANIME HLASU';
    directTestBtn.style.cssText = 'background-color: #ff5722; color: white; padding: 10px; margin-top: 10px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;';
    controlPanel.appendChild(directTestBtn);
    
    directTestBtn.addEventListener('click', function() {
        // Direct API call to ElevenLabs without any dependencies
        const apiKey = 'sk_cd7e8351c4ee70da54659af81d31ee031c02d2c9534c11e1';
        const voiceId = 'AZnzlk1XvdvUeBnXmlld'; // Domi anime voice
        const text = 'Ahoj! Jsem anime hlas Domi. Moc mě těší, že tě poznávám!';
        
        console.log("DIRECT API TEST WITH DOMI VOICE");
        
        fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': apiKey
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.8,
                    style: 0.7,
                    use_speaker_boost: true
                }
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }
            return response.blob();
        })
        .then(audioBlob => {
            console.log("Direct API call successful, playing audio");
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
            
            showStatus('Přehrávám přímý test anime hlasu', 'success');
        })
        .catch(error => {
            console.error("Direct API call failed:", error);
            showStatus('Chyba přímého testu: ' + error.message, 'error');
        });
    });
    
    // Clear any conflicting keys
    if (localStorage.getItem('elevenLabsVoice') && localStorage.getItem('voiceEngine') === 'elevenlabs') {
        // Ensure we're only using selectedVoice, not both
        localStorage.setItem('selectedVoice', localStorage.getItem('elevenLabsVoice'));
        localStorage.removeItem('elevenLabsVoice');
        console.log("Consolidated voice settings to selectedVoice only");
    }
    
    // Initialize voice options
    if (typeof populateVoiceOptions === 'function') {
        populateVoiceOptions();
    }
    
    // Show welcome message
    showStatus('Hlasový systém inicializován s ElevenLabs API', 'success');
});
