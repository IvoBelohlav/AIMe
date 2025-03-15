document.addEventListener('DOMContentLoaded', function() {
    // Initialize EnhancedAvatarController
    try {
        // Make sure the EnhancedAvatarController class is loaded
        if (typeof EnhancedAvatarController === 'undefined') {
            console.error('EnhancedAvatarController class not found. Check script loading order.');
            return;
        }
        
        // Create controller instance
        const avatarController = new EnhancedAvatarController();
        
        // Explicitly assign to window object
        window.avatarController = avatarController;
        console.log('Avatar controller initialized and assigned to window.avatarController');
    } catch (error) {
        console.error('Error initializing avatar controller:', error);
    }
    
    // Initialize other components
    console.log('App.js loaded and initialized');
});
