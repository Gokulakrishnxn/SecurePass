from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import requests
import hashlib
import secrets
import string
import re
import os
from openai import OpenAI
from dotenv import load_dotenv
from flask_session import Session
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import json

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

# Google OAuth Configuration
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')

# Initialize OpenAI client
openai_client = None
openai_api_key = os.getenv('OPENAI_API_KEY')
if openai_api_key and openai_api_key != 'your_openai_api_key_here':
    try:
        openai_client = OpenAI(api_key=openai_api_key)
        print("✅ OpenAI client initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize OpenAI client: {e}")
        openai_client = None
else:
    print("⚠️ OpenAI API key not configured. AI features will be disabled.")
    print("   To enable AI features, set OPENAI_API_KEY environment variable")
    print("   Get your free API key from: https://platform.openai.com/api-keys")

# Google OAuth Status
if GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET:
    print("✅ Google OAuth configured successfully")
else:
    print("⚠️ Google OAuth not configured. Login features will be disabled.")
    print("   To enable Google login, set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables")
    print("   Get credentials from: https://console.developers.google.com/")

def check_password_strength(password):
    """Check password strength based on various criteria"""
    score = 0
    feedback = []
    
    # Length check
    if len(password) >= 8:
        score += 1
    else:
        feedback.append("Password should be at least 8 characters long")
    
    # Uppercase check
    if re.search(r'[A-Z]', password):
        score += 1
    else:
        feedback.append("Password should contain uppercase letters")
    
    # Lowercase check
    if re.search(r'[a-z]', password):
        score += 1
    else:
        feedback.append("Password should contain lowercase letters")
    
    # Digit check
    if re.search(r'\d', password):
        score += 1
    else:
        feedback.append("Password should contain numbers")
    
    # Special character check
    if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        score += 1
    else:
        feedback.append("Password should contain special characters")
    
    # Determine strength level
    if score <= 2:
        strength = "Weak"
    elif score <= 4:
        strength = "Medium"
    else:
        strength = "Strong"
    
    return {
        "strength": strength,
        "score": score,
        "max_score": 5,
        "feedback": feedback
    }

def check_password_breach(password):
    """Check if password has been breached using Have I Been Pwned API"""
    try:
        # Hash the password with SHA-1
        sha1_hash = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
        
        # Send first 5 characters to HIBP API
        prefix = sha1_hash[:5]
        suffix = sha1_hash[5:]
        
        url = f"https://api.pwnedpasswords.com/range/{prefix}"
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            # Check if our hash suffix is in the response
            for line in response.text.splitlines():
                if line.startswith(suffix):
                    count = int(line.split(':')[1])
                    return {
                        "breached": True,
                        "count": count
                    }
            return {"breached": False, "count": 0}
        else:
            return {"breached": False, "count": 0, "error": "API unavailable"}
    
    except Exception as e:
        return {"breached": False, "count": 0, "error": str(e)}

def generate_strong_password(length=16, include_symbols=True, include_numbers=True):
    """Generate a strong random password"""
    characters = string.ascii_letters
    
    if include_numbers:
        characters += string.digits
    
    if include_symbols:
        characters += "!@#$%^&*()_+-=[]{}|;:,.<>?"
    
    password = ''.join(secrets.choice(characters) for _ in range(length))
    
    # Ensure the password meets strength requirements
    while True:
        strength = check_password_strength(password)
        if strength["strength"] == "Strong":
            break
        password = ''.join(secrets.choice(characters) for _ in range(length))
    
    return password

def get_ai_password_suggestions(password, strength_data, breach_data):
    """Get AI-powered password security suggestions"""
    if not openai_client:
        return []
    
    try:
        # Create a prompt for AI suggestions
        prompt = f"""
        Analyze this password security situation and provide 3-5 concise, actionable security tips:
        
        Password: "{password[:10]}..." (length: {len(password)})
        Strength: {strength_data['strength']} (Score: {strength_data['score']}/5)
        Breach Status: {'Breached' if breach_data.get('breached') else 'Safe'}
        Issues: {', '.join(strength_data['feedback']) if strength_data['feedback'] else 'None'}
        
        Provide practical, specific advice for improving password security. Keep each tip under 50 words.
        Focus on actionable steps the user can take immediately.
        """
        
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a cybersecurity expert providing concise, actionable password security advice."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
            temperature=0.7
        )
        
        # Parse the response into individual suggestions
        suggestions_text = response.choices[0].message.content.strip()
        suggestions = [s.strip() for s in suggestions_text.split('\n') if s.strip()]
        
        # Clean up the suggestions (remove numbering, bullets, etc.)
        cleaned_suggestions = []
        for suggestion in suggestions:
            # Remove common prefixes
            suggestion = re.sub(r'^[\d\.\-\*\•]\s*', '', suggestion)
            suggestion = re.sub(r'^[A-Za-z]+:\s*', '', suggestion)
            if suggestion and len(suggestion) > 10:  # Filter out very short suggestions
                cleaned_suggestions.append(suggestion)
        
        return cleaned_suggestions[:5]  # Return max 5 suggestions
        
    except Exception as e:
        print(f"OpenAI API error: {e}")
        return []

# Authentication helper functions
def is_authenticated():
    return 'user' in session

def get_current_user():
    return session.get('user', None)

@app.route('/')
def index():
    user = get_current_user()
    return render_template('index.html', user=user, google_client_id=GOOGLE_CLIENT_ID)

@app.route('/auth/google', methods=['POST'])
def google_auth():
    if not GOOGLE_CLIENT_ID:
        return jsonify({"error": "Google OAuth not configured"}), 400
    
    try:
        token = request.json.get('token')
        if not token:
            return jsonify({"error": "No token provided"}), 400
        
        # Verify the token
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)
        
        # Store user information in session
        session['user'] = {
            'id': idinfo['sub'],
            'email': idinfo['email'],
            'name': idinfo.get('name', ''),
            'picture': idinfo.get('picture', '')
        }
        
        return jsonify({
            "success": True,
            "user": session['user']
        })
        
    except ValueError as e:
        print(f"Google auth error: {e}")
        return jsonify({"error": "Invalid token"}), 400
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "Authentication failed"}), 500

@app.route('/auth/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({"success": True})

@app.route('/auth/status')
def auth_status():
    return jsonify({
        "authenticated": is_authenticated(),
        "user": get_current_user()
    })

@app.route('/check_password', methods=['POST'])
def check_password():
    data = request.get_json()
    password = data.get('password', '')
    
    if not password:
        return jsonify({"error": "Password is required"}), 400
    
    # Check password strength
    strength_result = check_password_strength(password)
    
    # Check for breaches
    breach_result = check_password_breach(password)
    
    # Get AI suggestions
    ai_suggestions = get_ai_password_suggestions(password, strength_result, breach_result)
    
    return jsonify({
        "strength": strength_result,
        "breach": breach_result,
        "ai_suggestions": ai_suggestions
    })

@app.route('/generate_password', methods=['POST'])
def generate_password():
    data = request.get_json()
    length = data.get('length', 16)
    include_symbols = data.get('include_symbols', True)
    include_numbers = data.get('include_numbers', True)
    
    # Validate length
    if length < 8 or length > 128:
        return jsonify({"error": "Password length must be between 8 and 128 characters"}), 400
    
    password = generate_strong_password(length, include_symbols, include_numbers)
    
    return jsonify({
        "password": password,
        "length": len(password)
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)
