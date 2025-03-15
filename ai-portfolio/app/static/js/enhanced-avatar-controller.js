/**
 * Enhanced Avatar Animation Controller with lip sync and advanced gestures
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
        this.leftHand = document.getElementById('left-hand');
        this.rightHand = document.getElementById('right-hand');
        this.leftEye = document.getElementById('left-eye');
        this.rightEye = document.getElementById('right-eye');
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
        this.blinkInterval = null;
        this.idleAnimationInterval = null;
        this.lipSyncQueue = [];
        this.processingLipSync = false;
        
        // Czech phoneme to viseme mapping (simplified)
        this.phonemeToViseme = {
            'a': 'a', 'á': 'a', 
            'e': 'e', 'é': 'e', 'ě': 'e',
            'i': 'i', 'í': 'i', 'y': 'i', 'ý': 'i',
            'o': 'o', 'ó': 'o',
            'u': 'u', 'ú': 'u', 'ů': 'u',
            'm': 'm', 'b': 'm', 'p': 'm',
            'f': 'u', 'v': 'u',
            'default': 'rest'
        };
        
        // Gesture mapping based on words/phrases
        this.gestureMapping = {
            'ahoj': 'wave',
            'zdravím': 'wave',
            'čau': 'wave',
            'děkuji': 'nod',
            'děkuju': 'nod',
            'díky': 'nod',
            'ne': 'shake',
            'nevím': 'shrug',
            'možná': 'shrug',
            'pracoval jsem': 'pointRight',
            'vytvořil jsem': 'pointRight',
            'rád': 'happy',
            'super': 'excited',
            'skvělé': 'excited',
            'výborně': 'excited',
            'bohužel': 'sad',
            'problém': 'sad',
            'promiň': 'sad'
        };
        
        this.initAnimations();
        console.log('Enhanced Avatar Controller initialized');
        
        // Expose controller to window for testing
        window.avatarController = this;
    }
    
    /**
     * Initialize animations and idle behaviors
     */
    initAnimations() {
        // Check if avatar elements exist
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
    
    // Rest of the implementation...
    // ... (keep all the existing methods)
}
