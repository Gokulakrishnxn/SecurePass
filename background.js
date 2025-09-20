// Background script for SecurePass extension

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('SecurePass extension installed');
        
        // Set default settings
        chrome.storage.local.set({
            theme: 'light',
            passwordHistory: []
        });
    }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'checkPassword') {
        // This could be used for additional processing if needed
        console.log('Password check requested:', request.password ? 'Password provided' : 'No password');
        sendResponse({ success: true });
    }
});

// Handle tab updates to inject content script
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        // Inject content script on all pages
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        }).catch((error) => {
            // Ignore errors for restricted pages (chrome://, etc.)
            console.log('Could not inject content script:', error);
        });
        
        chrome.scripting.insertCSS({
            target: { tabId: tabId },
            files: ['content.css']
        }).catch((error) => {
            // Ignore errors for restricted pages
            console.log('Could not inject CSS:', error);
        });
    }
});

// Context menu for password fields
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'checkPassword',
        title: 'Check password strength with SecurePass',
        contexts: ['editable']
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'checkPassword') {
        // Open the extension popup
        chrome.action.openPopup();
    }
});
