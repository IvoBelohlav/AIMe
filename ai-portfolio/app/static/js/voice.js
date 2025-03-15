document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const voiceButton = document.getElementById('voice-button');
    const voiceSelect = document.getElementById('voice-select');
    const rateSlider = document.getElementById('rate-slider');
    const rateValue = document.getElementById('rate-value');
    const pitchSlider = document.getElementById('pitch-slider');
    const pitchValue = document.getElementById('pitch-value');
    const testVoiceBtn = document.getElementById('test-voice');
    const toggleVoiceBtn = document.getElementById('toggle-voice');
    const voiceSettings = document.getElementById('voice-settings');
    
    // Global state for voice features
    window.voiceEnabled = localStorage.getItem('voiceEnabled') !== 'false'; // Default to true
    window.selectedVoice = null;
    window.speechRate = 1;
    window.speechPitch = 1;
    
    // Initialize voice settings
    function initVoiceSettings() {
        // Initialize toggle button state
        updateVoiceToggleButton();
        
        // Load voice settings from localStorage if available
        const savedRate = localStorage.getItem('speechRate');
        if (savedRate) {
            rateSlider.value = savedRate;
            rateValue.textContent = savedRate;
            window.speechRate = parseFloat(savedRate);
        }
        
        const savedPitch = localStorage.getItem('speechPitch');
        if (savedPitch) {
            pitchSlider.value = savedPitch;
            pitchValue.textContent = savedPitch;
            window.speechPitch = parseFloat(savedPitch);
        }
        
        // Initialize available voices
        if (window.speechSynthesis) {
            // For Chrome, voices load asynchronously
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = populateVoiceList;
            }
            
            populateVoiceList();
        }
    }
    
    // Populate voice select dropdown
    function populateVoiceList() {
        const voices = window.speechSynthesis.getVoices();
        
        // Clear existing options
        voiceSelect.innerHTML = '';
        
        // Add available voices
        voices.forEach(function(voice, i) {
            const option = document.createElement('option');
            option.textContent = `${voice.name}`;
            option.setAttribute('data-index', i);
            option.setAttribute('data-name', voice.name);
            voiceSelect.appendChild(option);
        });
        
        // Set saved voice if available
        const savedVoice = localStorage.getItem('selectedVoice');
        if (savedVoice) {
            for (let i = 0; i < voiceSelect.options.length; i++) {
                if (voiceSelect.options[i].getAttribute('data-name') === savedVoice) {
                    voiceSelect.selectedIndex = i;
                    break;
                }
            }
        }
        
        // Set the selected voice
        updateSelectedVoice();
    }
    
    // Update selected voice
    function updateSelectedVoice() {
        const selectedOption = voiceSelect.options[voiceSelect.selectedIndex];
        if (selectedOption) {
            const index = selectedOption.getAttribute('data-index');
            const voices = window.speechSynthesis.getVoices();
            window.selectedVoice = voices[index];
            
            // Save selection
            localStorage.setItem('selectedVoice', selectedOption.getAttribute('data-name'));
        }
    }
    
    // Update voice toggle button
    function updateVoiceToggleButton() {
        toggleVoiceBtn.textContent = window.voiceEnabled ? 'Voice On' : 'Voice Off';
        toggleVoiceBtn.className = window.voiceEnabled ? 'btn toggle-on' : 'btn';
    }
    
    // Event Listeners
    
    // Voice selection
    voiceSelect.addEventListener('change', updateSelectedVoice);
    
    // Rate slider
    rateSlider.addEventListener('input', function() {
        const value = rateSlider.value;
        rateValue.textContent = value;
        window.speechRate = parseFloat(value);
        localStorage.setItem('speechRate', value);
    });
    
    // Pitch slider
    pitchSlider.addEventListener('input', function() {
        const value = pitchSlider.value;
        pitchValue.textContent = value;
        window.speechPitch = parseFloat(value);
        localStorage.setItem('speechPitch', value);
    });
    
    // Test voice button
    testVoiceBtn.addEventListener('click', function() {
        speakText('This is a test of the voice settings for the AI assistant.');
    });
    
    // Toggle voice button
    toggleVoiceBtn.addEventListener('click', function() {
        window.voiceEnabled = !window.voiceEnabled;
        localStorage.setItem('voiceEnabled', window.voiceEnabled);
        updateVoiceToggleButton();
    });
    
    // Voice input button
    voiceButton.addEventListener('click', function() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Speech recognition is not supported in your browser');
            return;
        }
        
        // Add listening class for visual feedback
        voiceButton.classList.add('listening');
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('chat-input').value = transcript;
            
            // Auto-submit after speech recognition
            setTimeout(function() {
                document.getElementById('chat-form').dispatchEvent(new Event('submit'));
            }, 500);
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error', event.error);
            voiceButton.classList.remove('listening');
        };
        
        recognition.onend = function() {
            voiceButton.classList.remove('listening');
        };
        
        recognition.start();
    });
    
    // Toggle voice settings visibility
    const settingsToggle = document.createElement('button');
    settingsToggle.textContent = '⚙️ Voice Settings';
    settingsToggle.className = 'settings-toggle';
    settingsToggle.style.cssText = 'position: absolute; top: 10px; right: 10px; background: none; border: none; cursor: pointer;';
    
    document.querySelector('.chat-container').appendChild(settingsToggle);
    
    settingsToggle.addEventListener('click', function() {
        voiceSettings.style.display = voiceSettings.style.display === 'none' ? 'block' : 'none';
    });
    
    // Initialize
    initVoiceSettings();
});
