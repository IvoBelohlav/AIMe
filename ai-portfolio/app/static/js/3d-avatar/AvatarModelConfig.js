/**
 * 3D Avatar Model Configuration
 * Configure morph targets, animations, and model parameters
 */

const AvatarModelConfig = {
    // Model URL (replace with your actual model URL)
    modelUrl: '/static/models/avatar.glb',
    
    // Default position, rotation, scale
    defaultPosition: { x: 0, y: 0, z: 0 },
    defaultRotation: { x: 0, y: 0, z: 0 },
    defaultScale: { x: 1, y: 1, z: 1 },
    
    // Camera settings
    camera: {
        position: { x: 0, y: 1.6, z: 3 },
        target: { x: 0, y: 1, z: 0 },
        fov: 45,
        near: 0.1,
        far: 1000
    },
    
    // Animation mappings
    animations: {
        'idle': 'Idle',
        'wave': 'Wave',
        'nod': 'Nod',
        'shake': 'HeadShake',
        'shrug': 'Shrug',
        'excited': 'Excited',
        'think': 'Thinking'
    },
    
    // Morph target mappings
    morphTargets: {
        'happy': 'mouthSmile',
        'sad': 'mouthSad',
        'surprised': 'mouthO',
        'thinking': 'eyeSquint',
        'angry': 'browAngry',
        'confused': 'browRaise'
    },
    
    // Viseme mappings for lip sync
    visemes: {
        'a': 'mouthA',
        'e': 'mouthE',
        'i': 'mouthI',
        'o': 'mouthO',
        'u': 'mouthU',
        'm': 'mouthClosed'
    }
};

export default AvatarModelConfig;
