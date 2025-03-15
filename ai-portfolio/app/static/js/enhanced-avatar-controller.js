/**
 * Enhanced Avatar Animation Controller with simplified implementation
 */
class EnhancedAvatarController {
    constructor() {
        // Main avatar elements
        this.avatar = document.getElementById('avatar');
        this.avatarMain = document.getElementById('avatar-main');
        this.headGroup = document.getElementById('head-group');
        this.body = document.getElementById('body');
        this.mouthCurrent = document.getElementById('mouth-current');
        this.leftArm = document.getElementById('left-arm');
        this.rightArm = document.getElementById('right-arm');
        this.leftForearm = document.getElementById('left-forearm');
        this.rightForearm = document.getElementById('right-forearm');
        this.leftPupil = document.getElementById('left-pupil');
        this.rightPupil = document.getElementById('right-pupil');
        this.leftEyelid = document.getElementById('left-eyelid');
        this.rightEyelid = document.getElementById('right-eyelid');
        this.leftEyebrow = document.getElementById('left-eyebrow');
        this.rightEyebrow = document.getElementById('right-eyebrow');
        
        // Check if elements exist
        console.log('Avatar elements found:');
        console.log('- Avatar:', !!this.avatar);
        console.log('- Avatar Main:', !!this.avatarMain);
        console.log('- Head Group:', !!this.headGroup);
        console.log('- Right Arm:', !!this.rightArm);
        console.log('- Left Arm:', !!this.leftArm);
        
        // Animation state
        this.isSpeaking = false;
        this.currentExpression = 'neutral';
        this.gestureTimeout = null;
        
        // Initialize animations
        this.initAnimations();
        
        // Expose to window object for testing
        window.avatarController = this;
        console.log('Enhanced Avatar Controller initialized and exposed to window object');
    }
    
    initAnimations() {
        // Check if avatar exists
        if (!this.avatar) {
            console.error('Avatar elements not found. Animations will not work.');
            return;
        }
        
        // Start idle animations
        this.startBlinking();
        this.startBreathing();
        this.startIdleMovements();
        
        console.log('Avatar animations initialized');
    }
    
    startBlinking() {
        if (!this.leftEyelid || !this.rightEyelid) {
            console.warn('Eyelids not found, blinking animation will not work');
            return;
        }
        
        this.blinkInterval = setInterval(() => {
            // Simple blink animation using opacity
            this.leftEyelid.style.opacity = 1;
            this.rightEyelid.style.opacity = 1;
            
            setTimeout(() => {
                if (this.leftEyelid && this.rightEyelid) {
                    this.leftEyelid.style.opacity = 0;
                    this.rightEyelid.style.opacity = 0;
                }
            }, 150);
        }, 5000 + Math.random() * 3000);
        
        console.log('Blinking animation started');
    }
    
    startBreathing() {
        if (!this.body) {
            console.warn('Body element not found, breathing animation will not work');
            return;
        }
        
        this.body.classList.add('breathe');
        console.log('Breathing animation started');
    }
    
    startIdleMovements() {
        if (!this.headGroup) {
            console.warn('Head group not found, idle movements will not work');
            return;
        }
        
        this.headGroup.classList.add('bobble');
        console.log('Idle movements started');
    }
    
    performGesture(gestureName) {
        console.log('Performing gesture:', gestureName);
        
        // Clear any existing gesture timeout
        if (this.gestureTimeout) {
            clearTimeout(this.gestureTimeout);
        }
        
        switch(gestureName) {
            case 'wave':
                if (this.rightForearm) {
                    this.rightForearm.classList.add('wave');
                    this.gestureTimeout = setTimeout(() => {
                        this.rightForearm.classList.remove('wave');
                    }, 1500);
                }
                break;
                
            case 'nod':
                if (this.headGroup) {
                    this.headGroup.classList.add('nod');
                    this.gestureTimeout = setTimeout(() => {
                        this.headGroup.classList.remove('nod');
                    }, 1500);
                }
                break;
                
            case 'shake':
                if (this.headGroup) {
                    this.headGroup.classList.add('shake');
                    this.gestureTimeout = setTimeout(() => {
                        this.headGroup.classList.remove('shake');
                    }, 1500);
                }
                break;
                
            case 'shrug':
                if (this.leftArm && this.rightArm) {
                    this.leftArm.classList.add('shrug');
                    this.rightArm.classList.add('shrug');
                    this.gestureTimeout = setTimeout(() => {
                        this.leftArm.classList.remove('shrug');
                        this.rightArm.classList.remove('shrug');
                    }, 1500);
                }
                break;
                
            case 'excited':
                if (this.avatarMain) {
                    this.avatarMain.classList.add('excited');
                    this.gestureTimeout = setTimeout(() => {
                        this.avatarMain.classList.remove('excited');
                    }, 1500);
                }
                break;
                
            case 'think':
                this.setExpression('thinking');
                break;
                
            default:
                console.warn('Unknown gesture:', gestureName);
                break;
        }
    }
    
    setExpression(expressionName) {
        console.log('Setting expression:', expressionName);
        
        if (!this.avatarMain) {
            console.warn('Avatar main group not found, expression changes will not work');
            return;
        }
        
        // Remove current expression classes
        this.avatarMain.classList.remove('expression-happy', 'expression-sad', 'expression-surprised', 
                             'expression-thinking', 'expression-angry', 'expression-confused');
        
        // Add new expression class if not neutral
        if (expressionName !== 'neutral' && expressionName) {
            this.avatarMain.classList.add('expression-' + expressionName);
            this.currentExpression = expressionName;
            
            // Auto-revert to neutral after 4 seconds
            setTimeout(() => {
                this.avatarMain.classList.remove('expression-' + expressionName);
                this.currentExpression = 'neutral';
            }, 4000);
        }
    }
    
    startSpeaking(text) {
        this.isSpeaking = true;
        
        if (text && this.mouthCurrent) {
            // Basic lip-sync animation
            const chars = text.split('');
            let currentIndex = 0;
            
            const animateNext = () => {
                if (currentIndex >= chars.length || !this.isSpeaking) {
                    this.stopSpeaking();
                    return;
                }
                
                const char = chars[currentIndex].toLowerCase();
                currentIndex++;
                
                // Simplify viseme mapping
                if ('aáàâä'.includes(char)) {
                    this.avatarMain.classList.add('viseme-a');
                } else if ('eéèêë'.includes(char)) {
                    this.avatarMain.classList.add('viseme-e');
                } else if ('iíìîïyý'.includes(char)) {
                    this.avatarMain.classList.add('viseme-i');
                } else if ('oóòôö'.includes(char)) {
                    this.avatarMain.classList.add('viseme-o');
                } else if ('uúùûüů'.includes(char)) {
                    this.avatarMain.classList.add('viseme-u');
                } else if ('mbp'.includes(char)) {
                    this.avatarMain.classList.add('viseme-m');
                } else {
                    this.avatarMain.classList.remove('viseme-a', 'viseme-e', 'viseme-i', 'viseme-o', 'viseme-u', 'viseme-m');
                }
                
                // Schedule next animation
                setTimeout(animateNext, 80);
            };
            
            // Start animation
            animateNext();
        }
        
        console.log('Speaking started');
    }
    
    stopSpeaking() {
        this.isSpeaking = false;
        
        // Reset mouth to closed position
        if (this.avatarMain) {
            this.avatarMain.classList.remove('viseme-a', 'viseme-e', 'viseme-i', 'viseme-o', 'viseme-u', 'viseme-m');
        }
        
        console.log('Speaking stopped');
    }
    
    respondToSentiment(sentiment) {
        console.log('Responding to sentiment:', sentiment);
        
        switch(sentiment) {
            case 'positive':
                this.setExpression('happy');
                setTimeout(() => this.performGesture('excited'), 500);
                break;
                
            case 'negative':
                this.setExpression('sad');
                break;
                
            case 'neutral':
            default:
                // No specific reaction for neutral
                break;
        }
    }
    
    respondToUserSpeaking(isSpeaking) {
        if (isSpeaking) {
            // Look attentive when user is speaking
            if (this.leftPupil && this.rightPupil) {
                // Look slightly up
                this.leftPupil.setAttribute('cy', '108');
                this.rightPupil.setAttribute('cy', '108');
            }
        } else {
            // Return to normal
            if (this.leftPupil && this.rightPupil) {
                this.leftPupil.setAttribute('cy', '110');
                this.rightPupil.setAttribute('cy', '110');
            }
        }
    }
    
    cleanup() {
        // Clear all intervals
        if (this.blinkInterval) clearInterval(this.blinkInterval);
        if (this.gestureTimeout) clearTimeout(this.gestureTimeout);
        
        // Remove animation classes
        if (this.body) this.body.classList.remove('breathe');
        if (this.headGroup) this.headGroup.classList.remove('bobble');
        
        console.log('Avatar controller cleaned up');
    }
}
