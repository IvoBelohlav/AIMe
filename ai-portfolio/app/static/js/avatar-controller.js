/**
 * Avatar Animation Controller - Enhanced with element checks
 * Controls all animations for the digital avatar including:
 * - Lip sync (viseme mapping)
 * - Eye movements
 * - Gestures
 * - Expressions
 */
class AvatarController {
    constructor() {
        this.avatar = document.getElementById('avatar');
        
        // Check if avatar exists
        if (!this.avatar) {
            console.error('Avatar element not found! Animations will not work.');
            return;
        }
        
        this.currentExpression = 'neutral';
        this.isSpeaking = false;
        this.blinkInterval = null;
        this.eyeMovementInterval = null;
        this.idleAnimationInterval = null;
        
        // Mouth elements for visemes
        this.mouthStates = {
            'closed': document.getElementById('mouth-closed'),
            'a': document.getElementById('mouth-a'),
            'e': document.getElementById('mouth-e'),
            'i': document.getElementById('mouth-i'),
            'o': document.getElementById('mouth-o'),
            'u': document.getElementById('mouth-u')
        };
        
        // Check if mouth states exist
        if (!this.mouthStates.closed) {
            console.warn('Mouth elements not found. Lip sync will not work.');
        }
        
        // Expression elements
        this.expressions = {
            'happy': document.getElementById('expression-happy'),
            'thinking': document.getElementById('expression-thinking'),
            'surprised': document.getElementById('expression-surprised')
        };
        
        // Movement elements
        this.leftArm = document.getElementById('left-arm');
        this.rightArm = document.getElementById('right-arm');
        this.leftPupil = document.getElementById('left-pupil');
        this.rightPupil = document.getElementById('right-pupil');
        
        // Initialize animation properties
        this.initializeAnimations();
    }
    
    // Utility method to safely apply operations on elements
    safeElementOperation(element, operation, fallback = null) {
        if (element) {
            return operation(element);
        } else {
            console.warn('Element not found for operation');
            return fallback;
        }
    }
    
    initializeAnimations() {
        // Only start animations if avatar exists
        if (!this.avatar) return;
        
        // Start idle animations
        this.startBlinking();
        this.startIdleMovements();
        this.startRandomEyeMovements();
    }
    
    // Speech and lip-sync methods
    startSpeaking() {
        this.isSpeaking = true;
        this.showMouthState('a'); // Default starting position
    }
    
    stopSpeaking() {
        this.isSpeaking = false;
        this.showMouthState('closed');
    }
    
    showMouthState(state) {
        // Hide all mouth states
        Object.values(this.mouthStates).forEach(mouth => {
            if (mouth) {
                mouth.setAttribute('display', 'none');
            }
        });
        
        // Show the requested state
        if (this.mouthStates[state]) {
            this.mouthStates[state].setAttribute('display', 'block');
        } else if (this.mouthStates['closed']) {
            // Default to closed if state not found
            this.mouthStates['closed'].setAttribute('display', 'block');
        }
    }
    
    /**
     * Map phonemes to visemes (mouth shapes)
     * This is a simplified version - production would use a more complex mapping
     */
    mapPhonemeToViseme(phoneme) {
        const phonemeMap = {
            'a': 'a', 'æ': 'a', 'ɑ': 'a', 'ə': 'a',
            'e': 'e', 'ɛ': 'e', 'i': 'e', 'ɪ': 'e',
            'i': 'i', 'ɪ': 'i',
            'o': 'o', 'ɔ': 'o', 'ɒ': 'o',
            'u': 'u', 'ʊ': 'u', 'ʌ': 'u'
        };
        
        return phonemeMap[phoneme.toLowerCase()] || 'closed';
    }
    
    /**
     * Animate speech with a simplified viseme sequence based on text
     * For advanced implementation, you would use a proper TTS with phoneme timing data
     */
    animateSpeech(text) {
        if (!text || !this.mouthStates.closed) return;
        
        this.startSpeaking();
        
        const words = text.split(' ');
        let currentIndex = 0;
        
        // Simple algorithm to animate mouth based on vowels in text
        const animateNext = () => {
            if (currentIndex >= words.length) {
                this.stopSpeaking();
                return;
            }
            
            const word = words[currentIndex];
            currentIndex++;
            
            // Find first vowel in word
            const vowels = ['a', 'e', 'i', 'o', 'u'];
            let vowel = 'closed';
            
            for (let char of word.toLowerCase()) {
                if (vowels.includes(char)) {
                    vowel = char;
                    break;
                }
            }
            
            // Show corresponding mouth shape
            this.showMouthState(vowel);
            
            // Schedule next animation with a speed proportional to word length
            const duration = Math.max(200, word.length * 80);
            setTimeout(animateNext, duration);
        };
        
        // Start animation
        animateNext();
    }
    
    // Expression methods
    setExpression(expressionName) {
        const expressionsContainer = document.getElementById('expressions');
        
        // Check if expressions container exists
        if (!expressionsContainer) {
            console.warn('Expressions container not found');
            return;
        }
        
        // Hide current expressions
        expressionsContainer.setAttribute('display', 'none');
        Object.values(this.expressions).forEach(exp => {
            if (exp) {
                exp.setAttribute('display', 'none');
            }
        });
        
        // Show requested expression if it exists
        if (this.expressions[expressionName]) {
            expressionsContainer.setAttribute('display', 'block');
            this.expressions[expressionName].setAttribute('display', 'block');
            this.currentExpression = expressionName;
            
            // Auto-revert to neutral after a few seconds
            setTimeout(() => {
                if (expressionsContainer) {
                    expressionsContainer.setAttribute('display', 'none');
                }
                this.currentExpression = 'neutral';
            }, 4000);
        }
    }
    
    // Blinking animation
    startBlinking() {
        const eyes = document.getElementById('eyes');
        if (!eyes) {
            console.warn('Eyes element not found. Blinking will not work.');
            return;
        }
        
        this.blinkInterval = setInterval(() => {
            // Blink animation using CSS
            eyes.classList.add('blink');
            
            setTimeout(() => {
                eyes.classList.remove('blink');
            }, 200);
        }, 5000 + Math.random() * 5000); // Random blink between 5-10 seconds
    }
    
    stopBlinking() {
        if (this.blinkInterval) {
            clearInterval(this.blinkInterval);
        }
    }
    
    // Eye movement
    moveEyes(x, y) {
        if (!this.leftPupil || !this.rightPupil) {
            return;
        }
        
        const maxMovement = 3; // Max pixel movement of pupils
        
        // Calculate movement based on input coordinates
        const normalizedX = Math.max(-1, Math.min(1, x)); // Normalize to -1 to 1
        const normalizedY = Math.max(-1, Math.min(1, y)); // Normalize to -1 to 1
        
        const moveX = normalizedX * maxMovement;
        const moveY = normalizedY * maxMovement;
        
        // Apply movement to pupils
        this.leftPupil.setAttribute('cx', 120 + moveX);
        this.leftPupil.setAttribute('cy', 110 + moveY);
        this.rightPupil.setAttribute('cx', 180 + moveX);
        this.rightPupil.setAttribute('cy', 110 + moveY);
    }
    
    startRandomEyeMovements() {
        if (!this.leftPupil || !this.rightPupil) {
            return;
        }
        
        this.eyeMovementInterval = setInterval(() => {
            const randomX = (Math.random() * 2) - 1; // -1 to 1
            const randomY = (Math.random() * 2) - 1; // -1 to 1
            
            this.moveEyes(randomX, randomY);
            
            // Return to center after a moment
            setTimeout(() => {
                this.moveEyes(0, 0);
            }, 500);
            
        }, 7000 + Math.random() * 5000); // Random movement between 7-12 seconds
    }
    
    // Gesture and idle animations
    performGesture(gestureName) {
        if (!this.avatar) return;
        
        switch(gestureName) {
            case 'wave':
                this.animateWave();
                break;
            case 'think':
                this.animateThink();
                break;
            case 'excited':
                this.animateExcited();
                break;
            default:
                // No recognized gesture
                break;
        }
    }
    
    animateWave() {
        if (!this.rightArm) return;
        
        // Simple animation using CSS animation classes
        this.rightArm.classList.add('wave-animation');
        setTimeout(() => {
            if (this.rightArm) {
                this.rightArm.classList.remove('wave-animation');
            }
        }, 2000);
    }
    
    animateThink() {
        if (!this.rightArm) return;
        
        this.rightArm.classList.add('think-animation');
        this.setExpression('thinking');
        setTimeout(() => {
            if (this.rightArm) {
                this.rightArm.classList.remove('think-animation');
            }
        }, 3000);
    }
    
    animateExcited() {
        if (!this.leftArm || !this.rightArm) return;
        
        this.leftArm.classList.add('excited-animation');
        this.rightArm.classList.add('excited-animation');
        this.setExpression('happy');
        setTimeout(() => {
            if (this.leftArm) {
                this.leftArm.classList.remove('excited-animation');
            }
            if (this.rightArm) {
                this.rightArm.classList.remove('excited-animation');
            }
        }, 1500);
    }
    
    startIdleMovements() {
        if (!this.avatar) return;
        
        this.idleAnimationInterval = setInterval(() => {
            // Small idle movement to make the avatar seem alive
            const randomChoice = Math.floor(Math.random() * 5);
            
            switch(randomChoice) {
                case 0:
                    // Small head tilt
                    this.avatar.classList.add('head-tilt');
                    setTimeout(() => {
                        if (this.avatar) {
                            this.avatar.classList.remove('head-tilt');
                        }
                    }, 1000);
                    break;
                case 1:
                    // Shift weight
                    this.avatar.classList.add('shift-weight');
                    setTimeout(() => {
                        if (this.avatar) {
                            this.avatar.classList.remove('shift-weight');
                        }
                    }, 1500);
                    break;
                default:
                    // Do nothing for other values
                    break;
            }
        }, 10000 + Math.random() * 10000); // Random idle between 10-20 seconds
    }
    
    // Speech detection response - make avatar pay attention to user
    respondToUserSpeaking(isSpeaking) {
        if (!this.avatar) return;
        
        if (isSpeaking) {
            // Focus eyes slightly up to "look" at speaker
            this.moveEyes(0, -0.5);
            
            // Head tilt slightly to show attention
            this.avatar.classList.add('attentive');
        } else {
            // Return to normal state
            this.moveEyes(0, 0);
            this.avatar.classList.remove('attentive');
        }
    }
    
    // Sentiment-based responses
    respondToSentiment(sentiment) {
        if (!this.avatar) return;
        
        // Sentiment should be 'positive', 'negative', or 'neutral'
        switch(sentiment) {
            case 'positive':
                this.setExpression('happy');
                setTimeout(() => this.performGesture('excited'), 500);
                break;
            case 'negative':
                // Look a bit sad
                this.avatar.classList.add('sad');
                setTimeout(() => {
                    if (this.avatar) {
                        this.avatar.classList.remove('sad');
                    }
                }, 3000);
                break;
            case 'neutral':
            default:
                // Do nothing special
                break;
        }
    }
    
    // Clean up intervals on destruction
    destroy() {
        this.stopBlinking();
        
        if (this.eyeMovementInterval) {
            clearInterval(this.eyeMovementInterval);
        }
        
        if (this.idleAnimationInterval) {
            clearInterval(this.idleAnimationInterval);
        }
    }
}
