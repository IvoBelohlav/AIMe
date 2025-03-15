/**
 * This script provides tools to test avatar expressions and animations manually.
 * Include this script in your page during development to test the avatar.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Only run in development mode
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return;
    }
    
    // Create test panel
    const testPanel = document.createElement('div');
    testPanel.className = 'avatar-test-panel';
    testPanel.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: white; border: 1px solid #ddd; border-radius: 10px; padding: 15px; width: 300px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 1000;';
    
    // Create heading
    const heading = document.createElement('h3');
    heading.textContent = 'Avatar Test Panel';
    heading.style.cssText = 'margin-top: 0; margin-bottom: 10px; font-size: 16px;';
    testPanel.appendChild(heading);
    
    // Create test controls
    const controls = [
        { name: 'Wave', action: () => window.avatarController?.performGesture('wave') },
        { name: 'Think', action: () => window.avatarController?.performGesture('think') },
        { name: 'Excited', action: () => window.avatarController?.performGesture('excited') },
        { name: 'Happy', action: () => window.avatarController?.setExpression('happy') },
        { name: 'Surprised', action: () => window.avatarController?.setExpression('surprised') },
        { name: 'Thinking', action: () => window.avatarController?.setExpression('thinking') },
        { name: 'Speak Test', action: () => {
            window.avatarController?.animateSpeech('This is a test of the speech animation system. Can you see my lips moving as I speak?');
        }},
        { name: 'Reset', action: () => {
            window.avatarController?.stopSpeaking();
            document.getElementById('expressions')?.setAttribute('display', 'none');
        }}
    ];
    
    // Create buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 5px;';
    
    controls.forEach(control => {
        const button = document.createElement('button');
        button.textContent = control.name;
        button.style.cssText = 'background: #f0f0f0; border: 1px solid #ddd; border-radius: 5px; padding: 5px 10px; cursor: pointer; flex-grow: 1;';
        button.addEventListener('click', control.action);
        buttonContainer.appendChild(button);
    });
    
    testPanel.appendChild(buttonContainer);
    
    // Add to page
    document.body.appendChild(testPanel);
    
    // Make it draggable
    let isDragging = false;
    let dragOffsetX, dragOffsetY;
    
    heading.style.cursor = 'move';
    heading.addEventListener('mousedown', function(e) {
        isDragging = true;
        dragOffsetX = e.clientX - testPanel.getBoundingClientRect().left;
        dragOffsetY = e.clientY - testPanel.getBoundingClientRect().top;
    });
    
    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            testPanel.style.left = (e.clientX - dragOffsetX) + 'px';
            testPanel.style.top = (e.clientY - dragOffsetY) + 'px';
            testPanel.style.right = 'auto';
            testPanel.style.bottom = 'auto';
        }
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.cssText = 'position: absolute; top: 10px; right: 10px; background: none; border: none; cursor: pointer; font-weight: bold;';
    closeButton.addEventListener('click', function() {
        testPanel.remove();
    });
    
    testPanel.appendChild(closeButton);
    
    // Expose avatar controller to window for console testing
    if (window.avatarController) {
        window.testAvatar = window.avatarController;
        console.log('Avatar test controller available as window.testAvatar');
    }
});
