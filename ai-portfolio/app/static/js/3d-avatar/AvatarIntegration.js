/**
 * 3D Avatar Integration
 * Integrates the 3D avatar with the existing chat and voice systems
 */
import Avatar3DController from './Avatar3DController.js';

class AvatarIntegration {
    constructor() {
        console.log('3D Avatar Integration initializing...');
        
        try {
            // Initialize 3D avatar controller
            this.avatar3D = new Avatar3DController('avatar-container-3d');
            console.log('3D avatar controller initialized');
            
            // Reference to the original 2D controller for compatibility
            this.avatar2D = window.avatarController;
            
            if (!this.avatar2D) {
                console.warn('2D avatar controller not found, will continue with 3D only');
            } else {
                console.log('Found existing 2D avatar controller');
            }
            
            // Start with 3D mode active by default
            this.activeMode = '3d';
            
            // Make sure the containers have the correct visibility
            const container2D = document.getElementById('avatar-container-2d');
            const container3D = document.getElementById('avatar-container-3d');
            
            if (container2D) container2D.style.display = 'none';
            if (container3D) container3D.style.display = 'block';
            
            // Set up toggle button if it exists
            this.setupToggleButton();
            
            // Expose methods for both controllers
            this.exposeController();
            
            // Add to debug panel
            this.updateDebugPanel('3D Avatar initialized successfully');
        } catch (error) {
            console.error('Error initializing 3D avatar:', error);
            // Fallback to 2D if there's an error
            this.activeMode = '2d';
            const container2D = document.getElementById('avatar-container-2d');
            const container3D = document.getElementById('avatar-container-3d');
            
            if (container2D) container2D.style.display = 'block';
            if (container3D) container3D.style.display = 'none';
            
            this.updateDebugPanel('Error initializing 3D avatar: ' + error.message);
        }
    }
    
    updateDebugPanel(message) {
        const debugPanel = document.getElementById('avatar-status');
        if (debugPanel) {
            const p = document.createElement('p');
            p.textContent = message;
            debugPanel.appendChild(p);
            
            // Scroll to bottom
            debugPanel.scrollTop = debugPanel.scrollHeight;
        }
    }
    
    setupToggleButton() {
        const toggleButton = document.getElementById('toggle-avatar-mode');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                this.toggleAvatarMode();
            });
            console.log('Avatar toggle button initialized');
        } else {
            console.warn('Avatar toggle button not found');
        }
    }
    
    toggleAvatarMode() {
        // Toggle between 2D and 3D modes
        const container2D = document.getElementById('avatar-container-2d');
        const container3D = document.getElementById('avatar-container-3d');
        
        if (!container2D || !container3D) {
            console.error('Avatar containers not found');
            return;
        }
        
        if (this.activeMode === '3d') {
            this.activeMode = '2d';
            container3D.style.display = 'none';
            container2D.style.display = 'block';
            this.updateDebugPanel('Switched to 2D avatar');
        } else {
            this.activeMode = '3d';
            container2D.style.display = 'none';
            container3D.style.display = 'block';
            this.updateDebugPanel('Switched to 3D avatar');
        }
        
        console.log('Avatar mode switched to:', this.activeMode);
    }
    
    exposeController() {
        // Create a proxy controller that delegates to the active avatar
        const proxyController = {
            performGesture: (gesture) => {
                if (!gesture) return;
                
                // Normalize gesture name to lowercase for consistency
                const normalizedGesture = gesture.toLowerCase();
                console.log(`Avatar Integration: Performing gesture "${normalizedGesture}" in ${this.activeMode} mode`);
                this.updateDebugPanel(`Performing gesture: ${normalizedGesture} in ${this.activeMode} mode`);
                
                if (this.activeMode === '3d' && this.avatar3D) {
                    this.avatar3D.performGesture(normalizedGesture);
                } else if (this.avatar2D) {
                    this.avatar2D.performGesture(normalizedGesture);
                }
            },
            setExpression: (expression) => {
                if (!expression) return;
                
                // Normalize expression name to lowercase for consistency
                const normalizedExpression = expression.toLowerCase();
                console.log(`Avatar Integration: Setting expression "${normalizedExpression}" in ${this.activeMode} mode`);
                this.updateDebugPanel(`Setting expression: ${normalizedExpression} in ${this.activeMode} mode`);
                
                if (this.activeMode === '3d' && this.avatar3D) {
                    this.avatar3D.setExpression(normalizedExpression);
                } else if (this.avatar2D) {
                    this.avatar2D.setExpression(normalizedExpression);
                }
            },
            startSpeaking: (text) => {
                console.log(`Avatar Integration: Starting speech in ${this.activeMode} mode`);
                this.updateDebugPanel(`Starting speech in ${this.activeMode} mode`);
                
                if (this.activeMode === '3d' && this.avatar3D) {
                    this.avatar3D.startSpeaking(text);
                } else if (this.avatar2D) {
                    this.avatar2D.startSpeaking(text);
                }
            },
            stopSpeaking: () => {
                console.log(`Avatar Integration: Stopping speech in ${this.activeMode} mode`);
                
                if (this.activeMode === '3d' && this.avatar3D) {
                    this.avatar3D.stopSpeaking();
                } else if (this.avatar2D) {
                    this.avatar2D.stopSpeaking();
                }
            },
            respondToSentiment: (sentiment) => {
                console.log(`Avatar Integration: Responding to sentiment "${sentiment}" in ${this.activeMode} mode`);
                
                if (this.activeMode === '3d' && this.avatar3D) {
                    this.avatar3D.respondToSentiment(sentiment);
                } else if (this.avatar2D) {
                    this.avatar2D.respondToSentiment(sentiment);
                }
            }
        };
        
        // Preserve a reference to the original controller if it exists
        if (window.avatarController) {
            window.originalAvatarController = window.avatarController;
        }
        
        // Replace the global avatarController with our proxy
        window.avatarController = proxyController;
        console.log('Avatar integration complete - controller exposed as window.avatarController');
        this.updateDebugPanel('Avatar integration complete - both 2D and 3D controllers are ready');
    }
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for the original controller to initialize first
    setTimeout(() => {
        try {
            window.avatarIntegration = new AvatarIntegration();
            console.log('Avatar integration initialized successfully');
        } catch (error) {
            console.error('Failed to initialize avatar integration:', error);
        }
    }, 1000); // Increased timeout to ensure 2D controller is loaded first
});

export default AvatarIntegration;
