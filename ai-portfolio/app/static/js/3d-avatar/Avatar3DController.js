/**
 * ThreeJS Avatar Controller
 * Provides 3D avatar functionality with animations and lip-sync
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import TWEEN from '@tweenjs/tween.js';

class Avatar3DController {
    constructor(containerId = 'avatar-container') {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Avatar container not found:', containerId);
            return;
        }

        // Animation state
        this.isSpeaking = false;
        this.currentExpression = 'neutral';
        this.gestureTimeout = null;
        this.animations = {};
        this.mixer = null;
        this.avatarModel = null;
        
        // Initialize Three.js scene
        this.initScene();
        this.initLights();
        this.loadAvatar();
        this.animate();
        
        // Expose to window object for testing
        window.avatar3D = this;
        console.log('3D Avatar Controller initialized');
    }
    
    initScene() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);
        
        // Create camera
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(0, 1.6, 3);
        this.camera.lookAt(0, 1, 0);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);
        
        // Add controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 1, 0);
        this.controls.enableDamping = true;
        this.controls.enableZoom = true;
        this.controls.enablePan = false;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 5;
        this.controls.update();
        
        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }
    
    initLights() {
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Add directional light
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(10, 10, 10);
        mainLight.castShadow = true;
        this.scene.add(mainLight);
        
        // Add fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-10, 5, -10);
        this.scene.add(fillLight);
    }
    
    loadAvatar() {
        // Use a placeholder cube while actual model loads
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshStandardMaterial({ color: 0x3f51b5 });
        this.avatarPlaceholder = new THREE.Mesh(geometry, material);
        this.avatarPlaceholder.position.set(0, 1, 0);
        this.scene.add(this.avatarPlaceholder);
        
        // Debug panel update if available
        this.debugLog('Loading 3D avatar model...');
        
        // Load actual avatar model
        const loader = new GLTFLoader();
        
        // Use the local model file
        const avatarUrl = '/static/models/avatar.glb';
        
        loader.load(
            avatarUrl,
            (gltf) => {
                console.log('3D avatar model loaded successfully');
                this.debugLog('3D avatar model loaded successfully');
                this.scene.remove(this.avatarPlaceholder);
                
                this.avatarModel = gltf.scene;
                this.avatarModel.position.set(0, 0, 0);
                this.avatarModel.scale.set(1, 1, 1);
                this.scene.add(this.avatarModel);
                
                // Setup animations
                this.mixer = new THREE.AnimationMixer(this.avatarModel);
                
                if (gltf.animations && gltf.animations.length > 0) {
                    console.log('3D model animations found:', gltf.animations.length);
                    this.debugLog(`Found ${gltf.animations.length} animations in model`);
                    
                    gltf.animations.forEach(clip => {
                        console.log('Animation found:', clip.name);
                        const action = this.mixer.clipAction(clip);
                        this.animations[clip.name] = action;
                    });
                } else {
                    console.warn('No animations found in the 3D model');
                    this.debugLog('Warning: No animations found in the 3D model');
                    
                    // Create dummy animations for compatibility
                    this.createDummyAnimations();
                }
                
                // Initialize blendshapes/morphTargets if they exist
                this.initBlendShapes();
            },
            (xhr) => {
                const progress = Math.floor(xhr.loaded / xhr.total * 100);
                console.log('Avatar loading progress: ' + progress + '%');
                if (progress % 25 === 0) {
                    this.debugLog(`Loading progress: ${progress}%`);
                }
            },
            (error) => {
                console.error('Error loading 3D avatar:', error);
                this.debugLog('Error loading 3D avatar: ' + error.message);
            }
        );
    }
    
    createDummyAnimations() {
        // For compatibility with the interface, create dummy animation objects
        const dummyClip = new THREE.AnimationClip('Idle', 1, []);
        const dummyAction = this.mixer.clipAction(dummyClip);
        this.animations['Idle'] = dummyAction;
        
        // Create functional dummy animations for each gesture
        const createDummyAnimation = (name, transformFunc) => {
            // Create a dummy track that will actually animate something
            const times = [0, 0.5, 1]; // keyframe times
            
            // Find a mesh to animate (head, hands, etc.)
            let targetMesh = null;
            this.avatarModel.traverse((node) => {
                if (node.isMesh && !targetMesh) {
                    targetMesh = node;
                }
            });
            
            if (!targetMesh) {
                console.warn('No target mesh found for dummy animation');
                return;
            }
            
            // Create a position track
            const posValues = [];
            const rotValues = [];
            const scaleValues = [];
            
            // Apply the transform function to generate keyframe values
            transformFunc(posValues, rotValues, scaleValues);
            
            // Create tracks based on the values
            const tracks = [];
            
            if (posValues.length > 0) {
                const posTrack = new THREE.VectorKeyframeTrack(
                    `${targetMesh.name}.position`, 
                    times, 
                    posValues
                );
                tracks.push(posTrack);
            }
            
            if (rotValues.length > 0) {
                const rotTrack = new THREE.QuaternionKeyframeTrack(
                    `${targetMesh.name}.quaternion`, 
                    times, 
                    rotValues
                );
                tracks.push(rotTrack);
            }
            
            if (scaleValues.length > 0) {
                const scaleTrack = new THREE.VectorKeyframeTrack(
                    `${targetMesh.name}.scale`, 
                    times, 
                    scaleValues
                );
                tracks.push(scaleTrack);
            }
            
            // Create clip and action
            const clip = new THREE.AnimationClip(name, 1, tracks);
            this.animations[name] = this.mixer.clipAction(clip);
        };
        
        // Define animation transforms
        createDummyAnimation('Wave', (pos, rot, scale) => {
            // Create a simple waving motion
            rot.push(
                0, 0, 0, 1,           // Initial rotation (as quaternion)
                0, 0, 0.1, 0.99,      // Mid rotation
                0, 0, 0, 1            // Back to initial
            );
        });
        
        createDummyAnimation('Nod', (pos, rot, scale) => {
            // Nodding head (forward/back)
            rot.push(
                0, 0, 0, 1,           // Initial rotation
                0.1, 0, 0, 0.99,      // Nod down
                0, 0, 0, 1            // Back to initial
            );
        });
        
        createDummyAnimation('HeadShake', (pos, rot, scale) => {
            // Shaking head (left/right)
            rot.push(
                0, 0, 0, 1,           // Initial rotation
                0, -0.1, 0, 0.99,     // Turn left
                0, 0, 0, 1            // Back to initial
            );
        });
        
        createDummyAnimation('Shrug', (pos, rot, scale) => {
            // Shrugging shoulders
            pos.push(
                0, 0, 0,              // Initial position
                0, 0.1, 0,            // Raise a bit
                0, 0, 0               // Back to initial
            );
        });
        
        createDummyAnimation('Excited', (pos, rot, scale) => {
            // Excited bounce
            pos.push(
                0, 0, 0,              // Initial position
                0, 0.15, 0,           // Jump up
                0, 0, 0               // Back to initial
            );
        });
        
        createDummyAnimation('Thinking', (pos, rot, scale) => {
            // Thinking pose
            rot.push(
                0, 0, 0, 1,           // Initial rotation
                0.05, 0.05, 0, 0.99,  // Tilt head
                0, 0, 0, 1            // Back to initial
            );
        });
        
        console.log('Created functional dummy animations for compatibility');
        this.debugLog('Created functional dummy animations for compatibility');
    }
    
    // Helper method to log to debug panel if available
    debugLog(message) {
        const debugPanel = document.getElementById('avatar-status');
        if (debugPanel) {
            const p = document.createElement('p');
            p.textContent = message;
            debugPanel.appendChild(p);
            
            // Scroll to bottom
            debugPanel.scrollTop = debugPanel.scrollHeight;
        }
    }
    
    initBlendShapes() {
        if (!this.avatarModel) return;
        
        // Find the head/face mesh that contains morph targets
        this.headMesh = null;
        this.avatarModel.traverse((node) => {
            if (node.isMesh && node.morphTargetDictionary) {
                this.headMesh = node;
                console.log('Found head mesh with morph targets:', 
                            Object.keys(node.morphTargetDictionary));
                this.debugLog('Found morph targets: ' + 
                            Object.keys(node.morphTargetDictionary).join(', '));
            }
        });
        
        if (!this.headMesh) {
            console.warn('No mesh with morph targets found in the model');
            this.debugLog('Warning: No morph targets found. Creating dummy morph targets.');
            
            // Find a suitable mesh to add fake morph targets to
            let targetMesh = null;
            this.avatarModel.traverse((node) => {
                if (node.isMesh && !targetMesh) {
                    targetMesh = node;
                }
            });
            
            if (targetMesh) {
                // Add dummy morph targets
                targetMesh.morphTargetDictionary = {
                    'mouthSmile': 0,
                    'mouthSad': 1,
                    'mouthO': 2,
                    'eyeSquint': 3,
                    'browAngry': 4,
                    'browRaise': 5,
                    'mouthA': 6,
                    'mouthE': 7,
                    'mouthI': 8,
                    'mouthU': 9
                };
                
                // Initialize influences
                targetMesh.morphTargetInfluences = Array(10).fill(0);
                
                // Set as head mesh
                this.headMesh = targetMesh;
                
                console.log('Created dummy morph targets on mesh:', targetMesh.name);
                this.debugLog('Created dummy morph targets for expressions');
            }
        }
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Update controls
        if (this.controls) {
            this.controls.update();
        }
        
        // Update animation mixer
        if (this.mixer) {
            this.mixer.update(0.016); // ~60fps
        }
        
        // Update any tweens
        TWEEN.update();
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        if (!this.container || !this.camera || !this.renderer) return;
        
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    // Animation Methods
    performGesture(gestureName) {
        console.log('Performing 3D gesture:', gestureName);
        this.debugLog(`Attempting gesture: ${gestureName}`);
        
        if (!this.mixer) {
            console.warn('Animation mixer not initialized yet');
            this.debugLog('Warning: Animation mixer not initialized yet');
            return;
        }
        
        // If animations object doesn't exist, create it
        if (!this.animations) {
            this.animations = {};
            if (this.avatarModel) {
                this.createDummyAnimations();
            } else {
                this.debugLog('Warning: Avatar model not loaded yet');
                return;
            }
        }
        
        try {
            // Clear any existing gesture
            if (this.gestureTimeout) {
                clearTimeout(this.gestureTimeout);
            }
            
            // Normalize gesture name to lowercase for consistency
            const normalizedGestureName = gestureName.toLowerCase();
            
            // Map gesture to animation
            const animationName = this.mapGestureToAnimation(normalizedGestureName);
            
            // If animation doesn't exist, try to create it
            if (!this.animations[animationName]) {
                console.log(`Animation "${animationName}" not found, creating it dynamically`);
                this.createSpecificDummyAnimation(animationName);
            }
            
            if (!this.animations[animationName]) {
                console.warn(`Still can't find animation for gesture: ${gestureName} -> ${animationName}`);
                this.debugLog(`Warning: Animation not found for gesture: ${gestureName}`);
                return;
            }
            
            // Stop any other animations
            Object.values(this.animations).forEach(action => {
                if (action && action.isRunning && action.isRunning()) {
                    action.fadeOut(0.3);
                }
            });
            
            // Play the animation
            const action = this.animations[animationName];
            action.reset();
            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true;
            action.fadeIn(0.3).play();
            
            // Set a timeout to return to idle
            this.gestureTimeout = setTimeout(() => {
                action.fadeOut(0.5);
                if (this.animations['Idle']) {
                    this.animations['Idle'].reset().fadeIn(0.5).play();
                }
            }, 2000);
            
            this.debugLog(`Playing animation: ${animationName}`);
        } catch (error) {
            console.error('Error performing gesture:', error);
            this.debugLog(`Error performing gesture: ${error.message}`);
        }
    }
    
    // Helper to create a specific animation on demand
    createSpecificDummyAnimation(name) {
        if (!this.avatarModel || !this.mixer) return;
        
        let transformFunc;
        switch (name) {
            case 'Wave':
                transformFunc = (pos, rot, scale) => {
                    rot.push(
                        0, 0, 0, 1,
                        0, 0, 0.1, 0.99,
                        0, 0, 0, 1
                    );
                };
                break;
            case 'Nod':
                transformFunc = (pos, rot, scale) => {
                    rot.push(
                        0, 0, 0, 1,
                        0.1, 0, 0, 0.99,
                        0, 0, 0, 1
                    );
                };
                break;
            case 'HeadShake':
                transformFunc = (pos, rot, scale) => {
                    rot.push(
                        0, 0, 0, 1,
                        0, -0.1, 0, 0.99,
                        0, 0, 0, 1
                    );
                };
                break;
            case 'Shrug':
                transformFunc = (pos, rot, scale) => {
                    pos.push(
                        0, 0, 0,
                        0, 0.1, 0,
                        0, 0, 0
                    );
                };
                break;
            case 'Excited':
                transformFunc = (pos, rot, scale) => {
                    pos.push(
                        0, 0, 0,
                        0, 0.15, 0,
                        0, 0, 0
                    );
                };
                break;
            case 'Thinking':
                transformFunc = (pos, rot, scale) => {
                    rot.push(
                        0, 0, 0, 1,
                        0.05, 0.05, 0, 0.99,
                        0, 0, 0, 1
                    );
                };
                break;
            default:
                transformFunc = (pos, rot, scale) => {
                    // Generic animation for unknown types
                    pos.push(
                        0, 0, 0,
                        0, 0.05, 0,
                        0, 0, 0
                    );
                };
                break;
        }
        
        const times = [0, 0.5, 1];
        
        // Find a mesh to animate
        let targetMesh = null;
        this.avatarModel.traverse((node) => {
            if (node.isMesh && !targetMesh) {
                targetMesh = node;
            }
        });
        
        if (!targetMesh) {
            console.warn('No target mesh found for dummy animation');
            return;
        }
        
        // Create a position track
        const posValues = [];
        const rotValues = [];
        const scaleValues = [];
        
        // Apply the transform function
        transformFunc(posValues, rotValues, scaleValues);
        
        // Create tracks based on values
        const tracks = [];
        
        if (posValues.length > 0) {
            const posTrack = new THREE.VectorKeyframeTrack(
                `${targetMesh.name}.position`, 
                times, 
                posValues
            );
            tracks.push(posTrack);
        }
        
        if (rotValues.length > 0) {
            const rotTrack = new THREE.QuaternionKeyframeTrack(
                `${targetMesh.name}.quaternion`, 
                times, 
                rotValues
            );
            tracks.push(rotTrack);
        }
        
        if (scaleValues.length > 0) {
            const scaleTrack = new THREE.VectorKeyframeTrack(
                `${targetMesh.name}.scale`, 
                times, 
                scaleValues
            );
            tracks.push(scaleTrack);
        }
        
        // Create clip and action
        const clip = new THREE.AnimationClip(name, 1, tracks);
        this.animations[name] = this.mixer.clipAction(clip);
        
        console.log(`Created dynamic animation: ${name}`);
        this.debugLog(`Created dynamic animation: ${name}`);
    }
    
    mapGestureToAnimation(gestureName) {
        // Map your gesture names to the actual animation names in your model
        const gestureMap = {
            'wave': 'Wave',
            'nod': 'Nod',
            'shake': 'HeadShake',
            'shrug': 'Shrug',
            'excited': 'Excited',
            'think': 'Thinking',
            // Make sure we handle all the button data-gesture attributes
            'thinking': 'Thinking',
            // Czech gesture names from test buttons
            'mávání': 'Wave',
            'přikývnutí': 'Nod',
            'zavrtění': 'HeadShake',
            'pokrčení': 'Shrug'
        };
        
        console.log('3D Avatar: Mapping gesture', gestureName, 'to animation:', gestureMap[gestureName] || 'Idle');
        return gestureMap[gestureName.toLowerCase()] || 'Idle';
    }
    
    setExpression(expressionName) {
        console.log('Setting 3D expression:', expressionName);
        this.debugLog(`Attempting expression: ${expressionName}`);
        
        if (!this.headMesh) {
            console.warn('Head mesh not available for expressions');
            
            // Try to create dummy morph targets if we have a model
            if (this.avatarModel) {
                this.initBlendShapes();
            } else {
                this.debugLog('Warning: Avatar model not loaded yet');
                return;
            }
            
            // Check again after attempt to create
            if (!this.headMesh) {
                this.debugLog('Warning: Failed to create morph targets for expressions');
                return;
            }
        }
        
        if (!this.headMesh.morphTargetDictionary || !this.headMesh.morphTargetInfluences) {
            console.warn('Morph target dictionary or influences missing');
            this.debugLog('Warning: Missing morph target properties');
            return;
        }
        
        try {
            // Reset all expressions
            Object.keys(this.headMesh.morphTargetDictionary).forEach(key => {
                const index = this.headMesh.morphTargetDictionary[key];
                this.headMesh.morphTargetInfluences[index] = 0;
            });
            
            // Normalize expression name to lowercase for consistency
            const normalizedExpressionName = expressionName.toLowerCase();
            
            // Map expression name to morph target name
            const morphTargetName = this.mapExpressionToMorphTarget(normalizedExpressionName);
            const morphIndex = this.headMesh.morphTargetDictionary[morphTargetName];
            
            if (morphIndex === undefined) {
                console.warn(`Morph target not found for expression: ${expressionName} (mapped to ${morphTargetName})`);
                this.debugLog(`Warning: Morph target not found for expression: ${expressionName}`);
                return;
            }
            
            // Create a tween for smooth transition
            const startValue = { value: 0 };
            const endValue = { value: 1 };
            
            new TWEEN.Tween(startValue)
                .to(endValue, 300)
                .onUpdate((obj) => {
                    this.headMesh.morphTargetInfluences[morphIndex] = obj.value;
                })
                .start();
            
            this.debugLog(`Applied expression: ${expressionName} using morph target: ${morphTargetName}`);
            
            // Auto-revert after 4 seconds
            if (expressionName !== 'neutral') {
                setTimeout(() => {
                    new TWEEN.Tween({ value: 1 })
                        .to({ value: 0 }, 500)
                        .onUpdate((obj) => {
                            if (this.headMesh && this.headMesh.morphTargetInfluences) {
                                this.headMesh.morphTargetInfluences[morphIndex] = obj.value;
                            }
                        })
                        .start();
                    this.debugLog(`Reverting expression: ${expressionName}`);
                }, 4000);
            }
        } catch (error) {
            console.error('Error setting expression:', error);
            this.debugLog(`Error setting expression: ${error.message}`);
        }
    }
    
    mapExpressionToMorphTarget(expressionName) {
        // Map your expression names to the actual morph target names in your model
        const expressionMap = {
            'happy': 'mouthSmile',
            'sad': 'mouthSad',
            'surprised': 'mouthO',
            'thinking': 'eyeSquint',
            'angry': 'browAngry',
            'confused': 'browRaise',
            // Czech expression names from test buttons
            'radost': 'mouthSmile',
            'smutek': 'mouthSad',
            'překvapení': 'mouthO',
            'přemýšlení': 'eyeSquint'
        };
        
        console.log('3D Avatar: Mapping expression', expressionName, 'to morph target:', expressionMap[expressionName] || 'neutral');
        return expressionMap[expressionName.toLowerCase()] || 'neutral';
    }
    
    startSpeaking(text) {
        this.isSpeaking = true;
        console.log('Starting 3D lip-sync for:', text);
        
        if (!this.headMesh || !this.headMesh.morphTargetDictionary) {
            console.warn('Morph targets not available for lip-sync');
            return;
        }
        
        // Simple viseme extraction and animation
        const chars = text.split('');
        let currentIndex = 0;
        
        const animateNext = () => {
            if (currentIndex >= chars.length || !this.isSpeaking) {
                this.stopSpeaking();
                return;
            }
            
            const char = chars[currentIndex].toLowerCase();
            currentIndex++;
            
            // Reset all mouth shapes
            ['mouthA', 'mouthE', 'mouthI', 'mouthO', 'mouthU'].forEach(shape => {
                if (this.headMesh.morphTargetDictionary[shape] !== undefined) {
                    const index = this.headMesh.morphTargetDictionary[shape];
                    this.headMesh.morphTargetInfluences[index] = 0;
                }
            });
            
            // Set appropriate mouth shape
            let viseme = null;
            
            if ('aáàâä'.includes(char)) {
                viseme = 'mouthA';
            } else if ('eéèêë'.includes(char)) {
                viseme = 'mouthE';
            } else if ('iíìîïyý'.includes(char)) {
                viseme = 'mouthI';
            } else if ('oóòôö'.includes(char)) {
                viseme = 'mouthO';
            } else if ('uúùûüů'.includes(char)) {
                viseme = 'mouthU';
            }
            
            if (viseme && this.headMesh.morphTargetDictionary[viseme] !== undefined) {
                const index = this.headMesh.morphTargetDictionary[viseme];
                this.headMesh.morphTargetInfluences[index] = 1;
            }
            
            // Schedule next animation
            setTimeout(animateNext, 80);
        };
        
        // Start animation
        animateNext();
    }
    
    stopSpeaking() {
        this.isSpeaking = false;
        console.log('Stopping 3D lip-sync');
        
        if (!this.headMesh || !this.headMesh.morphTargetDictionary) return;
        
        // Reset all mouth shapes
        ['mouthA', 'mouthE', 'mouthI', 'mouthO', 'mouthU'].forEach(shape => {
            if (this.headMesh.morphTargetDictionary[shape] !== undefined) {
                const index = this.headMesh.morphTargetDictionary[shape];
                this.headMesh.morphTargetInfluences[index] = 0;
            }
        });
    }
    
    respondToSentiment(sentiment) {
        console.log('Responding to sentiment with 3D avatar:', sentiment);
        
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
    
    cleanup() {
        console.log('Cleaning up 3D avatar');
        
        // Stop animations
        if (this.mixer) {
            this.mixer.stopAllAction();
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.onWindowResize);
        
        // Dispose of resources
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

export default Avatar3DController;
