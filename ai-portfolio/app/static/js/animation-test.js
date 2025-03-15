/**
 * Avatar Animation Test Script
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Animation test script loaded');
    
    // Test buttons
    const testButtons = document.querySelectorAll('.test-button');
    
    // Wait a bit for the avatar controller to initialize
    setTimeout(() => {
        // Check if controller is available
        if (!window.avatarController) {
            console.error('Avatar controller not found on window object');
            document.getElementById('avatar-status').innerHTML += '<p>ERROR: Avatar controller not initialized</p>';
            return;
        }
        
        console.log('Found avatar controller for testing:', window.avatarController);
        
        // Add event listeners to test buttons
        testButtons.forEach(button => {
            button.addEventListener('click', function() {
                const gesture = this.getAttribute('data-gesture');
                const expression = this.getAttribute('data-expression');
                
                console.log('Test button clicked:', { gesture, expression });
                
                if (gesture) {
                    console.log('Performing gesture:', gesture);
                    window.avatarController.performGesture(gesture);
                    document.getElementById('avatar-status').innerHTML += 
                        '<p>Triggered gesture: ' + gesture + '</p>';
                }
                
                if (expression) {
                    console.log('Setting expression:', expression);
                    window.avatarController.setExpression(expression);
                    document.getElementById('avatar-status').innerHTML += 
                        '<p>Triggered expression: ' + expression + '</p>';
                }
            });
        });
        
        console.log('Test buttons initialized:', testButtons.length);
    }, 1000);
});
