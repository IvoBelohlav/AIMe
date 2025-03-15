/**
 * ElevenLabs API Integration
 * This library provides methods to interact with the ElevenLabs Text-to-Speech API.
 * It supports voice generation with style parameters for anime and specialized voices.
 */

window.elevenlabs = (function() {
    // API configuration
    const API_BASE_URL = 'https://api.elevenlabs.io/v1';
    
    /**
     * Generate speech using ElevenLabs API
     * @param {Object} options - Generation options
     * @param {string} options.apiKey - ElevenLabs API key
     * @param {string} options.voiceId - Voice ID to use
     * @param {string} options.text - Text to convert to speech
     * @param {number} options.stability - Voice stability (0.0-1.0)
     * @param {number} options.similarityBoost - Voice clarity/similarity boost (0.0-1.0)
     * @param {number} options.style - Style weight for specialized voices like anime (0.0-1.0)
     * @param {Function} options.onSuccess - Success callback with audio blob
     * @param {Function} options.onError - Error callback
     * @param {Function} options.onProgress - Progress callback (optional)
     */
    function generate(options) {
        const { 
            apiKey, 
            voiceId, 
            text, 
            stability = 0.75, 
            similarityBoost = 0.75, 
            style,
            onSuccess, 
            onError, 
            onProgress 
        } = options;
        
        console.log("### ELEVENLABS GENERATE ###");
        console.log("Voice ID:", voiceId);
        console.log("Text length:", text ? text.length : 0);
        console.log("Stability:", stability);
        console.log("SimilarityBoost:", similarityBoost);
        console.log("Style:", style);
        
        // Validation
        if (!apiKey) {
            console.error("ElevenLabs API key is missing");
            if (onError) onError('API key is required');
            return;
        }
        
        if (!voiceId) {
            console.error("ElevenLabs voice ID is missing");
            if (onError) onError('Voice ID is required');
            return;
        }
        
        if (!text || text.trim().length === 0) {
            console.error("ElevenLabs text is empty");
            if (onError) onError('Text is required');
            return;
        }
        
        // Build request payload
        const payload = {
            text: text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
                stability: stability,
                similarity_boost: similarityBoost,
                use_speaker_boost: true
            }
        };
        
        // Add style parameter only if it's defined and > 0
        if (style !== undefined && style > 0) {
            payload.voice_settings.style = style;
            console.log("Adding style parameter:", style);
        }
        
        // Prepare request
        const url = `${API_BASE_URL}/text-to-speech/${voiceId}`;
        console.log("Making ElevenLabs API request to:", url);
        console.log("Payload:", JSON.stringify(payload));
        
        // Use the exact same approach as the direct test which works
        console.log("USING DIRECT FETCH APPROACH - KNOWN TO WORK");
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': apiKey
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            console.log("ElevenLabs API response status:", response.status);
            console.log("ElevenLabs API response headers:", Object.fromEntries([...response.headers.entries()]));
            
            if (!response.ok) {
                // Try to get error message from response
                return response.json()
                    .then(errorData => {
                        console.error("ElevenLabs API error:", errorData);
                        throw new Error(`${response.status}: ${errorData.detail || 'Unknown error'}`);
                    })
                    .catch(jsonError => {
                        console.error("Error parsing JSON error response:", jsonError);
                        throw new Error(`HTTP error ${response.status}`);
                    });
            }
            return response.blob();
        })
        .then(audioBlob => {
            console.log("ElevenLabs API success, received audio blob:", audioBlob.type, "size:", audioBlob.size);
            if (onSuccess) onSuccess(audioBlob);
        })
        .catch(error => {
            console.error('ElevenLabs API error:', error);
            if (onError) onError(error.message || 'Unknown error');
        });
    }
    
    /**
     * Get available voices from ElevenLabs API
     * @param {Object} options - Options
     * @param {string} options.apiKey - ElevenLabs API key
     * @param {Function} options.onSuccess - Success callback with voices array
     * @param {Function} options.onError - Error callback
     */
    function getVoices(options) {
        const { apiKey, onSuccess, onError } = options;
        
        if (!apiKey) {
            if (onError) onError('API key is required');
            return;
        }
        
        const url = `${API_BASE_URL}/voices`;
        
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'xi-api-key': apiKey
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (onSuccess) onSuccess(data.voices || []);
        })
        .catch(error => {
            console.error('Error fetching ElevenLabs voices:', error);
            if (onError) onError(error.message || 'Unknown error');
        });
    }
    
    /**
     * Verify API key is valid
     * @param {Object} options - Options
     * @param {string} options.apiKey - ElevenLabs API key
     * @param {Function} options.onSuccess - Success callback
     * @param {Function} options.onError - Error callback
     */
    function verifyApiKey(options) {
        const { apiKey, onSuccess, onError } = options;
        
        if (!apiKey) {
            if (onError) onError('API key is required');
            return;
        }
        
        // Just try to get user info to verify key
        const url = `${API_BASE_URL}/user/subscription`;
        
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'xi-api-key': apiKey
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Invalid API key or API error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (onSuccess) onSuccess(data);
        })
        .catch(error => {
            console.error('Error verifying ElevenLabs API key:', error);
            if (onError) onError(error.message || 'Unknown error');
        });
    }
    
    /**
     * Direct test using exact same parameters as the working direct test button
     * This is a simplified version for testing
     */
    function directTest() {
        const apiKey = 'sk_cd7e8351c4ee70da54659af81d31ee031c02d2c9534c11e1';
        const voiceId = 'AZnzlk1XvdvUeBnXmlld'; // Domi anime voice
        const text = 'Ahoj! Toto je test knihovny ElevenLabs. Používám stejné parametry jako přímý test.';
        
        console.log("ELEVENLABS LIBRARY - DIRECT TEST FUNCTION");
        console.log("Using voice ID:", voiceId);
        
        const url = `${API_BASE_URL}/text-to-speech/${voiceId}`;
        
        fetch(url, {
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
            console.log("Direct test successful, playing audio");
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
        })
        .catch(error => {
            console.error("Library direct test failed:", error);
        });
    }
    
    // Public API
    return {
        generate,
        getVoices,
        verifyApiKey,
        directTest
    };
})(); 