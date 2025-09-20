// Content script for detecting and interacting with password fields

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getCurrentPassword') {
        const passwordField = getCurrentPasswordField();
        if (passwordField) {
            sendResponse({ password: passwordField.value });
        } else {
            sendResponse({ password: null });
        }
    } else if (request.action === 'fillPassword') {
        const passwordField = getCurrentPasswordField();
        if (passwordField) {
            passwordField.value = request.password;
            passwordField.dispatchEvent(new Event('input', { bubbles: true }));
            passwordField.dispatchEvent(new Event('change', { bubbles: true }));
            sendResponse({ success: true });
        } else {
            sendResponse({ success: false });
        }
    }
});

// Get the currently focused password field or the first visible password field
function getCurrentPasswordField() {
    // First, try to get the currently focused element
    const activeElement = document.activeElement;
    if (activeElement && activeElement.type === 'password') {
        return activeElement;
    }
    
    // If no focused password field, find the first visible password field
    const passwordFields = document.querySelectorAll('input[type="password"]');
    for (const field of passwordFields) {
        if (isElementVisible(field)) {
            return field;
        }
    }
    
    return null;
}

// Check if an element is visible
function isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    
    return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.opacity !== '0'
    );
}

// Add visual indicators for password fields
function addPasswordFieldIndicators() {
    const passwordFields = document.querySelectorAll('input[type="password"]');
    
    passwordFields.forEach(field => {
        // Skip if already processed
        if (field.dataset.securepassProcessed) return;
        
        // Add a small indicator
        const indicator = document.createElement('div');
        indicator.className = 'securepass-indicator';
        indicator.innerHTML = '🔒';
        indicator.title = 'SecurePass: Click to check this password';
        indicator.style.cssText = `
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 12px;
            cursor: pointer;
            z-index: 1000;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 2px 4px;
            border-radius: 3px;
            opacity: 0.7;
            transition: opacity 0.2s;
        `;
        
        // Make the field's parent position relative if it isn't already
        const parent = field.parentElement;
        if (getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative';
        }
        
        parent.appendChild(indicator);
        
        // Add click handler
        indicator.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Focus the password field
            field.focus();
            
            // Send message to popup to check this password
            chrome.runtime.sendMessage({
                action: 'checkPassword',
                password: field.value
            });
        });
        
        // Show/hide indicator on hover
        field.addEventListener('mouseenter', () => {
            indicator.style.opacity = '1';
        });
        
        field.addEventListener('mouseleave', () => {
            indicator.style.opacity = '0.7';
        });
        
        // Mark as processed
        field.dataset.securepassProcessed = 'true';
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addPasswordFieldIndicators);
} else {
    addPasswordFieldIndicators();
}

// Watch for dynamically added password fields
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                // Check if the added node is a password field
                if (node.type === 'password') {
                    addPasswordFieldIndicators();
                }
                // Check if the added node contains password fields
                if (node.querySelectorAll) {
                    const passwordFields = node.querySelectorAll('input[type="password"]');
                    if (passwordFields.length > 0) {
                        addPasswordFieldIndicators();
                    }
                }
            }
        });
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
