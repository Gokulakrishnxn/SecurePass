// DOM elements
const passwordInput = document.getElementById('passwordInput');
const checkBtn = document.getElementById('checkBtn');
const togglePassword = document.getElementById('togglePassword');
const strengthResult = document.getElementById('strengthResult');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const strengthPercentage = document.getElementById('strengthPercentage');
const strengthDetails = document.getElementById('strengthDetails');
const breachResult = document.getElementById('breachResult');

const passwordLength = document.getElementById('passwordLength');
const lengthValue = document.getElementById('lengthValue');
const includeSymbols = document.getElementById('includeSymbols');
const includeNumbers = document.getElementById('includeNumbers');
const generateBtn = document.getElementById('generateBtn');
const generatedPassword = document.getElementById('generatedPassword');
const generatedPasswordInput = document.getElementById('generatedPasswordInput');
const copyBtn = document.getElementById('copyBtn');

const passwordHistory = document.getElementById('passwordHistory');
const clearHistory = document.getElementById('clearHistory');
const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeIcon = document.getElementById('darkModeIcon');

const checkCurrentField = document.getElementById('checkCurrentField');
const fillGenerated = document.getElementById('fillGenerated');

// Password length slider
passwordLength.addEventListener('input', function() {
    lengthValue.textContent = this.value;
});

// Toggle password visibility
function togglePasswordVisibility() {
    const eyeIcon = togglePassword.querySelector('.eye-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.textContent = '🙈';
        togglePassword.title = 'Hide password';
    } else {
        passwordInput.type = 'password';
        eyeIcon.textContent = '👁️';
        togglePassword.title = 'Show password';
    }
}

togglePassword.addEventListener('click', togglePasswordVisibility);

// Check password strength
async function checkPasswordStrength() {
    const password = passwordInput.value.trim();
    
    if (!password) {
        strengthResult.classList.add('hidden');
        return;
    }
    
    checkBtn.textContent = 'Checking...';
    checkBtn.disabled = true;
    
    try {
        // Check password strength locally first
        const strengthData = checkPasswordStrengthLocal(password);
        
        // Check for breaches
        const breachData = await checkPasswordBreach(password);
        
        // Display results
        displayStrengthResult(strengthData, breachData, [], password);
        strengthResult.classList.remove('hidden');
        
    } catch (error) {
        console.error('Error checking password:', error);
        strengthResult.innerHTML = '<div class="breach-result breached">Error checking password</div>';
        strengthResult.classList.remove('hidden');
    } finally {
        checkBtn.textContent = 'Check';
        checkBtn.disabled = false;
    }
}

// Local password strength checking
function checkPasswordStrengthLocal(password) {
    let score = 0;
    const feedback = [];
    const maxScore = 5;
    
    // Length check
    if (password.length >= 12) {
        score += 1;
    } else if (password.length >= 8) {
        score += 0.5;
        feedback.push('Password should be at least 12 characters long');
    } else {
        feedback.push('Password should be at least 8 characters long');
    }
    
    // Uppercase check
    if (/[A-Z]/.test(password)) {
        score += 1;
    } else {
        feedback.push('Password should contain uppercase letters');
    }
    
    // Lowercase check
    if (/[a-z]/.test(password)) {
        score += 1;
    } else {
        feedback.push('Password should contain lowercase letters');
    }
    
    // Number check
    if (/\d/.test(password)) {
        score += 1;
    } else {
        feedback.push('Password should contain numbers');
    }
    
    // Special character check
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        score += 1;
    } else {
        feedback.push('Password should contain special characters');
    }
    
    // Determine strength
    let strength;
    if (score >= 4.5) {
        strength = 'Strong';
    } else if (score >= 3) {
        strength = 'Medium';
    } else {
        strength = 'Weak';
    }
    
    return {
        strength: strength,
        score: score,
        max_score: maxScore,
        feedback: feedback
    };
}

// Check password breach
async function checkPasswordBreach(password) {
    try {
        const hash = await sha1(password);
        const hashPrefix = hash.substring(0, 5);
        const hashSuffix = hash.substring(5).toUpperCase();
        
        const response = await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`);
        const data = await response.text();
        
        const lines = data.split('\n');
        for (const line of lines) {
            const [hash, count] = line.split(':');
            if (hash === hashSuffix) {
                return {
                    breached: true,
                    count: parseInt(count)
                };
            }
        }
        
        return {
            breached: false,
            count: 0
        };
    } catch (error) {
        console.error('Error checking breach:', error);
        return {
            breached: false,
            count: 0
        };
    }
}

// SHA1 hash function
async function sha1(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Display strength result
function displayStrengthResult(strengthData, breachData, aiSuggestions, password) {
    // Update strength bar and text
    strengthBar.className = 'strength-fill ' + strengthData.strength.toLowerCase();
    strengthText.textContent = strengthData.strength;
    
    // Update strength percentage
    const percentage = Math.round((strengthData.score / strengthData.max_score) * 100);
    strengthPercentage.textContent = `${percentage}%`;
    
    // Add to password history
    addToHistory(password, strengthData.strength);
    
    // Update strength details
    strengthDetails.innerHTML = '';
    if (strengthData.feedback.length > 0) {
        const ul = document.createElement('ul');
        strengthData.feedback.forEach(feedback => {
            const li = document.createElement('li');
            li.textContent = feedback;
            li.className = 'invalid';
            ul.appendChild(li);
        });
        strengthDetails.appendChild(ul);
    }
    
    // Update breach result
    breachResult.className = 'breach-result ' + (breachData.breached ? 'breached' : 'safe');
    if (breachData.breached) {
        breachResult.textContent = `⚠️ Password found in ${breachData.count.toLocaleString()} data breaches`;
    } else {
        breachResult.textContent = '✅ Password not found in known breaches';
    }
}

// Generate password
function generatePassword() {
    const length = parseInt(passwordLength.value);
    const useSymbols = includeSymbols.checked;
    const useNumbers = includeNumbers.checked;
    
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let charset = lowercase + uppercase;
    if (useNumbers) charset += numbers;
    if (useSymbols) charset += symbols;
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    generatedPasswordInput.value = password;
    generatedPassword.classList.remove('hidden');
}

// Copy password to clipboard
copyBtn.addEventListener('click', () => {
    const password = generatedPasswordInput.value;
    navigator.clipboard.writeText(password).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
        }, 2000);
    });
});

// Password History Functions
function addToHistory(password, strength) {
    chrome.storage.local.get(['passwordHistory'], (result) => {
        let history = result.passwordHistory || [];
        
        // Remove if already exists
        history = history.filter(item => item.password !== password);
        
        // Add to beginning
        history.unshift({
            password: password,
            strength: strength,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 10
        history = history.slice(0, 10);
        
        chrome.storage.local.set({ passwordHistory: history }, () => {
            updateHistoryDisplay();
        });
    });
}

function updateHistoryDisplay() {
    chrome.storage.local.get(['passwordHistory'], (result) => {
        const history = result.passwordHistory || [];
        const historyList = document.getElementById('passwordHistory');
        
        if (history.length === 0) {
            historyList.innerHTML = '<p class="no-history">No passwords checked yet</p>';
            return;
        }
        
        historyList.innerHTML = history.map(item => `
            <div class="history-item">
                <span class="history-password">${item.password}</span>
                <span class="history-strength ${item.strength.toLowerCase()}">${item.strength}</span>
            </div>
        `).join('');
    });
}

function clearPasswordHistory() {
    chrome.storage.local.remove(['passwordHistory'], () => {
        updateHistoryDisplay();
    });
}

// Dark Mode Functions
function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    chrome.storage.local.set({ theme: newTheme });
    
    const icon = document.getElementById('darkModeIcon');
    icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

function initializeTheme() {
    chrome.storage.local.get(['theme'], (result) => {
        const savedTheme = result.theme || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const icon = document.getElementById('darkModeIcon');
        icon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    });
}

// Content script communication
function checkCurrentPasswordField() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getCurrentPassword' }, (response) => {
            if (response && response.password) {
                passwordInput.value = response.password;
                checkPasswordStrength();
            }
        });
    });
}

function fillCurrentPasswordField() {
    const password = generatedPasswordInput.value;
    if (!password) return;
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { 
            action: 'fillPassword', 
            password: password 
        });
    });
}

// Event Listeners
checkBtn.addEventListener('click', checkPasswordStrength);
generateBtn.addEventListener('click', generatePassword);
clearHistory.addEventListener('click', clearPasswordHistory);
darkModeToggle.addEventListener('click', toggleDarkMode);
checkCurrentField.addEventListener('click', checkCurrentPasswordField);
fillGenerated.addEventListener('click', fillCurrentPasswordField);

// Allow Enter key to check password
passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkPasswordStrength();
    }
});

// Real-time password strength checking
let checkTimeout;
passwordInput.addEventListener('input', function() {
    clearTimeout(checkTimeout);
    
    if (this.value.length >= 4) {
        checkTimeout = setTimeout(() => {
            if (this.value.trim()) {
                checkPasswordStrength();
            }
        }, 1000);
    } else {
        strengthResult.classList.add('hidden');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set initial length value
    lengthValue.textContent = passwordLength.value;
    
    // Initialize theme
    initializeTheme();
    
    // Initialize password history
    updateHistoryDisplay();
    
    // Focus on password input
    passwordInput.focus();
});
