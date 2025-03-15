/**
 * Avatar Animation Test Script
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Animation test script loaded');
    
    // Test buttons
    const testButtons = document.querySelectorAll('.test-button');
    const avatarStatus = document.getElementById('avatar-status');
    
    function logStatus(message) {
        if (avatarStatus) {
            const p = document.createElement('p');
            p.textContent = message;
            avatarStatus.appendChild(p);
            
            // Scroll to bottom
            avatarStatus.scrollTop = avatarStatus.scrollHeight;
        }
    }
    
    // Initialize test buttons - wait a bit longer to ensure 3D avatar is loaded
    setTimeout(() => {
        try {
            // Check if controller is available
            if (!window.avatarController) {
                const errorMsg = 'Avatar controller not found on window object';
                console.error(errorMsg);
                logStatus('ERROR: ' + errorMsg);
                return;
            }
            
            console.log('Found avatar controller for testing:', window.avatarController);
            logStatus('Animation test controls initialized');
            
            // Add event listeners to test buttons
            testButtons.forEach(button => {
                button.addEventListener('click', function(event) {
                    try {
                        // Prevent default button behavior
                        event.preventDefault();
                        
                        const gesture = this.getAttribute('data-gesture');
                        const expression = this.getAttribute('data-expression');
                        
                        console.log('Test button clicked:', { gesture, expression });
                        
                        if (gesture) {
                            console.log('Requesting gesture:', gesture);
                            logStatus('Requesting gesture: ' + gesture);
                            
                            // Use setTimeout to ensure it's executed after current event loop
                            setTimeout(() => {
                                window.avatarController.performGesture(gesture);
                            }, 0);
                        }
                        
                        if (expression) {
                            console.log('Requesting expression:', expression);
                            logStatus('Requesting expression: ' + expression);
                            
                            // Use setTimeout to ensure it's executed after current event loop
                            setTimeout(() => {
                                window.avatarController.setExpression(expression);
                            }, 0);
                        }
                    } catch (error) {
                        console.error('Error handling animation test button:', error);
                        logStatus('ERROR: Failed to trigger animation - ' + error.message);
                    }
                });
            });
            
            console.log('Test buttons initialized:', testButtons.length);
            
            // Add clear log button
            const clearLogButton = document.createElement('button');
            clearLogButton.textContent = 'Clear Log';
            clearLogButton.className = 'test-button';
            clearLogButton.style.backgroundColor = '#ffcccc';
            clearLogButton.style.marginTop = '10px';
            clearLogButton.addEventListener('click', () => {
                avatarStatus.innerHTML = '<h4>Ladící informace</h4>';
                logStatus('Log cleared');
            });
            
            // Add the button to the page
            if (avatarStatus) {
                avatarStatus.appendChild(clearLogButton);
            }
        } catch (error) {
            console.error('Failed to initialize animation tests:', error);
            logStatus('ERROR: Failed to initialize animation tests - ' + error.message);
        }
    }, 1500); // Wait longer to ensure all controllers are ready
});
