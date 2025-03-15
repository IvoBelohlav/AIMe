// Voice control functionality
document.addEventListener('DOMContentLoaded', function() {
    const voiceSelect = document.getElementById('voice-select');
    const rateSlider = document.getElementById('rate-slider');
    const rateValue = document.getElementById('rate-value');
    const pitchSlider = document.getElementById('pitch-slider');
    const pitchValue = document.getElementById('pitch-value');
    const testVoiceBtn = document.getElementById('test-voice-btn');
    
    // Skip if elements don't exist
    if (!voiceSelect || !rateSlider || !pitchSlider || !testVoiceBtn) {
        console.log('Voice control elements not found');
        return;
    }
    
    console.log('Voice controls initialized');
    
    // Initialize from localStorage if available
    const savedVoice = localStorage.getItem('selectedVoice');
    const savedRate = localStorage.getItem('speechRate');
    const savedPitch = localStorage.getItem('speechPitch');
    
    if (savedVoice) {
        voiceSelect.value = savedVoice;
    }
    
    if (savedRate) {
        rateSlider.value = savedRate;
        rateValue.textContent = savedRate;
    }
    
    if (savedPitch) {
        pitchSlider.value = savedPitch;
        pitchValue.textContent = savedPitch;
    }
    
    // Update voice settings in real-time
    voiceSelect.addEventListener('change', function() {
        localStorage.setItem('selectedVoice', voiceSelect.value);
        console.log('Voice changed to:', voiceSelect.value);
    });
    
    rateSlider.addEventListener('input', function() {
        rateValue.textContent = rateSlider.value;
        localStorage.setItem('speechRate', rateSlider.value);
        console.log('Rate changed to:', rateSlider.value);
    });
    
    pitchSlider.addEventListener('input', function() {
        pitchValue.textContent = pitchSlider.value;
        localStorage.setItem('speechPitch', pitchSlider.value);
        console.log('Pitch changed to:', pitchSlider.value);
    });
    
    // Test voice button
    testVoiceBtn.addEventListener('click', function() {
        const testText = "Ahoj, takhle bude znít můj hlas. Jak se ti to líbí?";
        console.log('Testing voice with:', testText);
        
        if (typeof responsiveVoice !== 'undefined') {
            responsiveVoice.speak(testText, voiceSelect.value, {
                pitch: parseFloat(pitchSlider.value),
                rate: parseFloat(rateSlider.value)
            });
            console.log('Using ResponsiveVoice with:', voiceSelect.value);
        } else {
            // Fallback to Web Speech API
            console.log('ResponsiveVoice not available, using Web Speech API');
            const utterance = new SpeechSynthesisUtterance(testText);
            utterance.lang = 'cs-CZ';
            utterance.rate = parseFloat(rateSlider.value);
            utterance.pitch = parseFloat(pitchSlider.value);
            speechSynthesis.speak(utterance);
        }
    });
});
