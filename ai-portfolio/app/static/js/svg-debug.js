/**
 * SVG Debug Script
 * This script checks if the SVG elements required for animations are properly loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('SVG debug script loaded');
    
    // Wait a bit for SVG to fully load
    setTimeout(() => {
        // Check for key SVG elements
        const elements = [
            { id: 'avatar', name: 'Avatar SVG' },
            { id: 'avatar-main', name: 'Main Avatar Group' },
            { id: 'head-group', name: 'Head Group' },
            { id: 'body', name: 'Body' },
            { id: 'mouth-current', name: 'Current Mouth Shape' },
            { id: 'left-arm', name: 'Left Arm' },
            { id: 'right-arm', name: 'Right Arm' },
            { id: 'left-forearm', name: 'Left Forearm' },
            { id: 'right-forearm', name: 'Right Forearm' },
            { id: 'left-pupil', name: 'Left Pupil' },
            { id: 'right-pupil', name: 'Right Pupil' }
        ];
        
        // Get debug panel
        const debugPanel = document.getElementById('avatar-status');
        if (!debugPanel) return;
        
        // Add header
        debugPanel.innerHTML += '<h4>SVG Element Check</h4>';
        
        // Check each element
        let allFound = true;
        elements.forEach(elem => {
            const element = document.getElementById(elem.id);
            const found = !!element;
            
            if (!found) allFound = false;
            
            debugPanel.innerHTML += 
                '<p>' + elem.name + ': ' + 
                (found ? '<span style="color:green">✓ Found</span>' : '<span style="color:red">✗ Missing</span>') + 
                '</p>';
        });
        
        // Overall status
        debugPanel.innerHTML += 
            '<p>Overall SVG Status: ' + 
            (allFound ? 
                '<span style="color:green">✓ All elements found</span>' : 
                '<span style="color:red">✗ Some elements missing</span>') + 
            '</p>';
            
        // Direct check of SVG content
        const avatar = document.getElementById('avatar');
        if (avatar) {
            const svgContent = avatar.outerHTML.substring(0, 100) + '...';
            debugPanel.innerHTML += '<p>SVG content sample: <code>' + svgContent + '</code></p>';
        }
    }, 1000);
});
