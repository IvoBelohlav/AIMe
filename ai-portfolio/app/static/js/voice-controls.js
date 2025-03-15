document.addEventListener('DOMContentLoaded', function() {
    // Voice control elements
    const voiceSelect = document.getElementById('voice-select');
    const rateSlider = document.getElementById('rate-slider');
    const rateValue = document.getElementById('rate-value');
    const pitchSlider = document.getElementById('pitch-slider');
    const pitchValue = document.getElementById('pitch-value');
    const testVoiceBtn = document.getElementById('test-voice-btn');
    
    // Check if elements exist
    if (!voiceSelect || !rateSlider || !pitchSlider || !testVoiceBtn) {
        console.warn('Voice control elements not found');
        return;
    }
    
    // Initialize ResponsiveVoice check
    const hasResponsiveVoice = typeof responsiveVoice !== 'undefined';
    
    // Load saved settings from localStorage
    function loadSavedSettings() {
        // Voice type
        const savedVoice = localStorage.getItem('selectedVoice');
        if (savedVoice) {
            // Find and select the saved voice
            for (let i = 0; i < voiceSelect.options.length; i++) {
                if (voiceSelect.options[i].value === savedVoice) {
                    voiceSelect.selectedIndex = i;
                    break;
                }
            }
        }
        
        // Rate
        const savedRate = localStorage.getItem('speechRate');
        if (savedRate) {
            rateSlider.value = savedRate;
            rateValue.textContent = savedRate;
        }
        
        // Pitch
        const savedPitch = localStorage.getItem('speechPitch');
        if (savedPitch) {
            pitchSlider.value = savedPitch;
            pitchValue.textContent = savedPitch;
        }
    }
    
    // Initialize voice settings
    function initVoiceSettings() {
        // Set default values if not already in localStorage
        if (!localStorage.getItem('selectedVoice')) {
            localStorage.setItem('selectedVoice', 'Czech Female');
        }
        
        if (!localStorage.getItem('speechRate')) {
            localStorage.setItem('speechRate', '1.0');
        }
        
        if (!localStorage.getItem('speechPitch')) {
            localStorage.setItem('speechPitch', '1.0');
        }
        
        // Load saved settings
        loadSavedSettings();
        
        console.log('Voice controls initialized with settings:', {
            voice: localStorage.getItem('selectedVoice'),
            rate: localStorage.getItem('speechRate'),
            pitch: localStorage.getItem('speechPitch')
        });
    }
    
    // Add event listeners
    voiceSelect.addEventListener('change', function() {
        localStorage.setItem('selectedVoice', voiceSelect.value);
        console.log('Voice changed to:', voiceSelect.value);
    });
    
    rateSlider.addEventListener('input', function() {
        rateValue.textContent = rateSlider.value;
        localStorage.setItem('speechRate', rateSlider.value);
    });
    
    pitchSlider.addEventListener('input', function() {
        pitchValue.textContent = pitchSlider.value;
        localStorage.setItem('speechPitch', pitchSlider.value);
    });
    
    // Test voice button
    testVoiceBtn.addEventListener('click', function() {
        const testPhrase = "Ahoj, takhle bude znít můj hlas. Jak se ti to líbí?";
        
        // Access the avatarController if available
        if (window.avatarController) {
            window.avatarController.startSpeaking(testPhrase);
        }
        
        if (hasResponsiveVoice) {
            // Test with ResponsiveVoice
            responsiveVoice.speak(testPhrase, voiceSelect.value, {
                pitch: parseFloat(pitchSlider.value),
                rate: parseFloat(rateSlider.value),
                onend: function() {
                    if (window.avatarController) {
                        window.avatarController.stopSpeaking();
                    }
                }
            });
        } else {
            // Fallback to Web Speech API
            console.log('Testing voice with:', testPhrase);
            console.log('ResponsiveVoice not available, using Web Speech API');
            
            if (window.speechSynthesis) {
                // Clear any ongoing speech
                window.speechSynthesis.cancel();
                
                const utterance = new SpeechSynthesisUtterance(testPhrase);
                utterance.lang = 'cs-CZ';
                utterance.rate = parseFloat(rateSlider.value);
                utterance.pitch = parseFloat(pitchSlider.value);
                
                // Try to find Czech voice
                const voices = window.speechSynthesis.getVoices();
                const czechVoice = voices.find(voice => 
                    voice.lang.startsWith('cs') || voice.name.includes('Czech')
                );
                
                if (czechVoice) {
                    utterance.voice = czechVoice;
                    console.log('Using Czech voice:', czechVoice.name);
                }
                
                utterance.onend = function() {
                    if (window.avatarController) {
                        window.avatarController.stopSpeaking();
                    }
                };
                
                window.speechSynthesis.speak(utterance);
            } else {
                console.error('Speech synthesis not supported in this browser');
                
                // Still animate mouth even without sound
                if (window.avatarController) {
                    setTimeout(() => {
                        window.avatarController.stopSpeaking();
                    }, 3000);
                }
            }
        }
    });
    
    // Initialize settings
    initVoiceSettings();
    console.log('Voice controls initialized');
});
