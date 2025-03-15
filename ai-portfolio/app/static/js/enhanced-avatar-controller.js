/**
 * Enhanced Avatar Animation Controller with natural movement patterns
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
        this.smileLineLeft = document.getElementById('smile-line-left');
        this.smileLineRight = document.getElementById('smile-line-right');
        
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
        this.idleAnimationTimeout = null;
        this.lastBlinkTime = Date.now();
        this.isUserInteracting = false;
        
        // Initialize animations
        this.initAnimations();
        
        // Add event listener for cursor movement - avatar follows cursor
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        
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
        this.scheduleMicroExpressions();
        
        console.log('Avatar animations initialized');
    }
    
    startBlinking() {
        if (!this.leftEyelid || !this.rightEyelid) {
            console.warn('Eyelids not found, blinking animation will not work');
            return;
        }
        
        // More human-like blinking pattern
        const blink = () => {
            // More natural rapid blinks
            this.leftEyelid.style.opacity = 1;
            this.rightEyelid.style.opacity = 1;
            
            setTimeout(() => {
                if (this.leftEyelid && this.rightEyelid) {
                    this.leftEyelid.style.opacity = 0;
                    this.rightEyelid.style.opacity = 0;
                    
                    // Sometimes do a double blink
                    if (Math.random() < 0.2) {
                        setTimeout(() => {
                            this.leftEyelid.style.opacity = 1;
                            this.rightEyelid.style.opacity = 1;
                            
                            setTimeout(() => {
                                this.leftEyelid.style.opacity = 0;
                                this.rightEyelid.style.opacity = 0;
                            }, 100);
                        }, 200);
                    }
                }
                
                // Schedule next blink with variable timing for more natural feel
                const nextBlinkTime = 2000 + Math.random() * 4000;
                this.lastBlinkTime = Date.now() + nextBlinkTime;
                setTimeout(blink, nextBlinkTime);
            }, 150);
        };
        
        // Initial blink
        setTimeout(blink, 1000 + Math.random() * 2000);
        
        console.log('Natural blinking animation started');
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
        
        // Schedule random micro-movements for more lifelike behavior
        this.scheduleIdleGesture();
    }
    
    scheduleIdleGesture() {
        // Clear any existing timeout
        if (this.idleAnimationTimeout) {
            clearTimeout(this.idleAnimationTimeout);
        }
        
        // Don't do random movements while speaking or user is interacting
        if (this.isSpeaking || this.isUserInteracting) {
            this.idleAnimationTimeout = setTimeout(() => this.scheduleIdleGesture(), 5000);
            return;
        }
        
        const randomDelay = 8000 + Math.random() * 15000;
        
        this.idleAnimationTimeout = setTimeout(() => {
            // Choose a random subtle gesture
            const gestures = ['lookAround', 'adjustPosture', 'subtleNod', 'think', 'smallShrug'];
            const randomGesture = gestures[Math.floor(Math.random() * gestures.length)];
            
            // Perform the selected gesture
            switch(randomGesture) {
                case 'lookAround':
                    this.lookAt({x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight});
                    break;
                case 'adjustPosture':
                    if (this.body) {
                        const originalClasses = this.body.classList.value;
                        this.body.classList.add('adjustPosture');
                        setTimeout(() => {
                            this.body.classList.remove('adjustPosture');
                        }, 2000);
                    }
                    break;
                case 'subtleNod':
                    this.performGesture('nod');
                    break;
                case 'think':
                    this.setExpression('thinking');
                    break;
                case 'smallShrug':
                    this.performGesture('shrug');
                    break;
            }
            
            // Schedule next idle gesture
            this.scheduleIdleGesture();
        }, randomDelay);
    }
    
    scheduleMicroExpressions() {
        // Subtle microexpressions for lifelike quality
        setInterval(() => {
            // Don't do microexpressions during speaking
            if (this.isSpeaking) return;
            
            // Small random chance to show a quick micro-expression
            if (Math.random() < 0.1) {
                const expressions = ['happy', 'surprised', 'thinking'];
                const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
                
                // Apply micro-expression briefly
                this.avatarMain.classList.add('micro-expression-' + randomExpression);
                setTimeout(() => {
                    this.avatarMain.classList.remove('micro-expression-' + randomExpression);
                }, 300 + Math.random() * 200);
            }
        }, 5000);
    }
    
    handleMouseMove(event) {
        // Make the eyes subtly follow the cursor for interactivity
        if (!this.leftPupil || !this.rightPupil) return;
        
        // Calculate eye movement based on mouse position
        // Uses a dampening factor to make movements subtle
        const dampeningFactor = 3;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Calculate normalized position (-1 to 1)
        const normalizedX = (event.clientX / windowWidth) * 2 - 1;
        const normalizedY = (event.clientY / windowHeight) * 2 - 1;
        
        // Apply dampened movement
        const moveX = normalizedX * 2 / dampeningFactor;
        const moveY = normalizedY * 2 / dampeningFactor;
        
        // Apply to pupils with a CSS transform
        this.leftPupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
        this.rightPupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
        
        // Trigger occasional blink when mouse moves quickly
        const now = Date.now();
        if (now - this.lastBlinkTime > 2000 && Math.random() < 0.1) {
            this.leftEyelid.style.opacity = 1;
            this.rightEyelid.style.opacity = 1;
            
            setTimeout(() => {
                this.leftEyelid.style.opacity = 0;
                this.rightEyelid.style.opacity = 0;
                this.lastBlinkTime = now;
            }, 150);
        }
    }
    
    lookAt(position) {
        if (!this.leftPupil || !this.rightPupil || !this.headGroup) return;
        
        // Calculate normalized position (-1 to 1)
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        const normalizedX = (position.x / windowWidth) * 2 - 1;
        const normalizedY = (position.y / windowHeight) * 2 - 1;
        
        // Apply subtle movement to pupils (2px max)
        const maxMove = 2;
        const moveX = normalizedX * maxMove;
        const moveY = normalizedY * maxMove;
        
        // Apply to pupils with a CSS transform
        this.leftPupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
        this.rightPupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
        
        // Also slightly tilt the head
        const headTiltX = normalizedX * 2; // 2 degrees max tilt
        const headTiltY = normalizedY * 1; // 1 degree max tilt
        this.headGroup.style.transform = `rotateY(${headTiltX}deg) rotateX(${headTiltY}deg)`;
        
        // Reset head position after a delay
        setTimeout(() => {
            this.headGroup.style.transform = '';
        }, 2000);
    }
    
    performGesture(gestureName) {
        console.log('Performing gesture:', gestureName);
        
        // Clear any existing gesture timeout
        if (this.gestureTimeout) {
            clearTimeout(this.gestureTimeout);
        }
        
        // Mark as user interacting to prevent random gestures
        this.isUserInteracting = true;
        
        switch(gestureName) {
            case 'wave':
                if (this.rightForearm) {
                    this.rightForearm.classList.add('wave');
                    
                    // Add head and body movements for a more natural wave
                    if (this.headGroup) {
                        this.headGroup.classList.add('nod');
                    }
                    
                    this.gestureTimeout = setTimeout(() => {
                        this.rightForearm.classList.remove('wave');
                        this.headGroup.classList.remove('nod');
                        this.isUserInteracting = false;
                    }, 1500);
                }
                break;
                
            case 'nod':
                if (this.headGroup) {
                    this.headGroup.classList.add('nod');
                    
                    // Sometimes add a smile with a nod
                    if (Math.random() < 0.5) {
                        this.setExpression('happy');
                    }
                    
                    this.gestureTimeout = setTimeout(() => {
                        this.headGroup.classList.remove('nod');
                        this.isUserInteracting = false;
                    }, 1500);
                }
                break;
                
            case 'shake':
                if (this.headGroup) {
                    this.headGroup.classList.add('shake');
                    this.gestureTimeout = setTimeout(() => {
                        this.headGroup.classList.remove('shake');
                        this.isUserInteracting = false;
                    }, 1500);
                }
                break;
                
            case 'shrug':
                if (this.leftArm && this.rightArm) {
                    this.leftArm.classList.add('shrug');
                    this.rightArm.classList.add('shrug');
                    
                    // Add head tilt for more natural shrug
                    if (this.headGroup) {
                        this.headGroup.style.transform = 'rotateZ(3deg)';
                    }
                    
                    this.gestureTimeout = setTimeout(() => {
                        this.leftArm.classList.remove('shrug');
                        this.rightArm.classList.remove('shrug');
                        this.headGroup.style.transform = '';
                        this.isUserInteracting = false;
                    }, 1500);
                }
                break;
                
            case 'excited':
                if (this.avatarMain) {
                    this.avatarMain.classList.add('excited');
                    this.setExpression('happy');
                    
                    this.gestureTimeout = setTimeout(() => {
                        this.avatarMain.classList.remove('excited');
                        this.isUserInteracting = false;
                    }, 1500);
                }
                break;
                
            case 'think':
                this.setExpression('thinking');
                
                // Add hand to chin gesture for thinking
                if (this.rightArm) {
                    this.rightArm.style.transform = 'rotate(40deg)';
                    this.rightForearm.style.transform = 'rotate(-30deg)';
                }
                
                this.gestureTimeout = setTimeout(() => {
                    if (this.rightArm) {
                        this.rightArm.style.transform = '';
                        this.rightForearm.style.transform = '';
                    }
                    this.isUserInteracting = false;
                }, 3000);
                break;
                
            default:
                console.warn('Unknown gesture:', gestureName);
                this.isUserInteracting = false;
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
        
        // For smile lines
        if (this.smileLineLeft && this.smileLineRight) {
            this.smileLineLeft.classList.remove('smile');
            this.smileLineRight.classList.remove('smile');
        }
        
        // Add new expression class if not neutral
        if (expressionName !== 'neutral' && expressionName) {
            this.avatarMain.classList.add('expression-' + expressionName);
            this.currentExpression = expressionName;
            
            // Activate smile lines for happy expressions
            if (expressionName === 'happy' && this.smileLineLeft && this.smileLineRight) {
                this.smileLineLeft.classList.add('smile');
                this.smileLineRight.classList.add('smile');
            }
            
            // Auto-revert to neutral after 4 seconds
            setTimeout(() => {
                this.avatarMain.classList.remove('expression-' + expressionName);
                
                // Fade out smile lines naturally
                if (this.smileLineLeft && this.smileLineRight) {
                    this.smileLineLeft.classList.remove('smile');
                    this.smileLineRight.classList.remove('smile');
                }
                
                this.currentExpression = 'neutral';
            }, 4000);
        }
    }
    
    startSpeaking(text) {
        this.isSpeaking = true;
        
        if (text && this.mouthCurrent) {
            // Enhanced lip-sync animation
            const chars = text.split('');
            let currentIndex = 0;
            let visemeCount = 0;
            let lastChar = '';
            
            const animateNext = () => {
                if (currentIndex >= chars.length || !this.isSpeaking) {
                    this.stopSpeaking();
                    return;
                }
                
                const char = chars[currentIndex].toLowerCase();
                currentIndex++;
                
                // Skip non-vowel/consonant characters or repeated same characters
                if (!/[a-z]/i.test(char) || char === lastChar) {
                    setTimeout(animateNext, 30);
                    return;
                }
                
                lastChar = char;
                visemeCount++;
                
                // Clear previous viseme classes
                this.avatarMain.classList.remove('viseme-a', 'viseme-e', 'viseme-i', 'viseme-o', 'viseme-u', 'viseme-m');
                
                // Improved mapping of characters to mouth shapes
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
                    // For consonants or other characters, use a shorter duration
                    setTimeout(animateNext, 40);
                    return;
                }
                
                // Every ~10 visemes, add a natural blink
                if (visemeCount % 10 === 0 && Math.random() < 0.7 && this.leftEyelid && this.rightEyelid) {
                    this.leftEyelid.style.opacity = 1;
                    this.rightEyelid.style.opacity = 1;
                    setTimeout(() => {
                        this.leftEyelid.style.opacity = 0;
                        this.rightEyelid.style.opacity = 0;
                    }, 150);
                }
                
                // Add subtle head movements during speech
                if (visemeCount % 15 === 0 && this.headGroup) {
                    const randomAngle = (Math.random() - 0.5) * 2;
                    this.headGroup.style.transform = `rotateZ(${randomAngle}deg)`;
                    setTimeout(() => {
                        this.headGroup.style.transform = '';
                    }, 300);
                }
                
                // Schedule next animation with variable timing based on character
                const duration = 'aeiou'.includes(char) ? 80 : 60; // Vowels longer than consonants
                setTimeout(animateNext, duration);
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
        
        if (!this.avatarMain) {
            console.warn('Avatar main group not found, sentiment responses will not work');
            return;
        }
        
        // Map sentiment to expressions and gestures
        switch(sentiment.toLowerCase()) {
            case 'positive':
            case 'happy':
                this.setExpression('happy');
                if (Math.random() < 0.5) {
                    this.performGesture('nod');
                } else {
                    this.performGesture('excited');
                }
                break;
                
            case 'negative':
            case 'sad':
                this.setExpression('sad');
                if (Math.random() < 0.5) {
                    this.performGesture('shake');
                }
                break;
                
            case 'neutral':
                this.setExpression('neutral');
                if (Math.random() < 0.3) {
                    this.performGesture('nod');
                }
                break;
                
            case 'surprised':
            case 'surprise':
                this.setExpression('surprised');
                break;
                
            case 'angry':
                this.setExpression('angry');
                this.performGesture('shake');
                break;
                
            case 'confused':
                this.setExpression('confused');
                this.performGesture('think');
                break;
                
            case 'thinking':
                this.setExpression('thinking');
                this.performGesture('think');
                break;
                
            default:
                console.warn('Unknown sentiment:', sentiment);
                break;
        }
    }
    
    respondToUserSpeaking(isSpeaking) {
        // Make avatar look more attentive when user is speaking
        if (isSpeaking) {
            // Show interest by raising eyebrows slightly and maintaining eye contact
            if (this.leftEyebrow && this.rightEyebrow) {
                this.leftEyebrow.setAttribute('d', this.leftEyebrow.getAttribute('d').replace('95', '92'));
                this.rightEyebrow.setAttribute('d', this.rightEyebrow.getAttribute('d').replace('95', '92'));
            }
            
            // Occasional nods while listening
            const nodInterval = setInterval(() => {
                if (Math.random() < 0.3 && this.headGroup) {
                    const smallNod = document.createElement('style');
                    smallNod.textContent = `
                        @keyframes smallNod {
                            0% { transform: rotate(0deg); }
                            50% { transform: rotate(1deg); }
                            100% { transform: rotate(0deg); }
                        }
                    `;
                    document.head.appendChild(smallNod);
                    
                    this.headGroup.style.animation = 'smallNod 1s ease-in-out';
                    setTimeout(() => {
                        this.headGroup.style.animation = '';
                        document.head.removeChild(smallNod);
                    }, 1000);
                }
            }, 3000);
            
            // Save interval for cleanup
            this.userSpeakingInterval = nodInterval;
        } else {
            // Reset eyebrows
            if (this.leftEyebrow && this.rightEyebrow) {
                this.leftEyebrow.setAttribute('d', this.leftEyebrow.getAttribute('d').replace('92', '95'));
                this.rightEyebrow.setAttribute('d', this.rightEyebrow.getAttribute('d').replace('92', '95'));
            }
            
            // Clear any nodding intervals
            if (this.userSpeakingInterval) {
                clearInterval(this.userSpeakingInterval);
                this.userSpeakingInterval = null;
            }
        }
    }
    
    cleanup() {
        // Remove event listeners
        document.removeEventListener('mousemove', this.handleMouseMove);
        
        // Clear all timers
        if (this.gestureTimeout) clearTimeout(this.gestureTimeout);
        if (this.idleAnimationTimeout) clearTimeout(this.idleAnimationTimeout);
        if (this.userSpeakingInterval) clearInterval(this.userSpeakingInterval);
        
        console.log('Avatar controller cleaned up');
    }
}
