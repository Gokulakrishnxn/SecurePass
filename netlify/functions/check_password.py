import json
import hashlib
import requests
import re
from http.server import BaseHTTPRequestHandler

def check_password_strength(password):
    """Check password strength locally"""
    score = 0
    feedback = []
    max_score = 5
    
    # Length check
    if len(password) >= 12:
        score += 1
    elif len(password) >= 8:
        score += 0.5
        feedback.append("Password should be at least 12 characters long")
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
    
    # Number check
    if re.search(r'\d', password):
        score += 1
    else:
        feedback.append("Password should contain numbers")
    
    # Special character check
    if re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', password):
        score += 1
    else:
        feedback.append("Password should contain special characters")
    
    # Determine strength
    if score >= 4.5:
        strength = "Strong"
    elif score >= 3:
        strength = "Medium"
    else:
        strength = "Weak"
    
    return {
        "strength": strength,
        "score": score,
        "max_score": max_score,
        "feedback": feedback
    }

def check_password_breach(password):
    """Check if password has been breached using Have I Been Pwned API"""
    try:
        # Hash the password with SHA-1
        password_hash = hashlib.sha1(password.encode('utf-8')).hexdigest().upper()
        hash_prefix = password_hash[:5]
        hash_suffix = password_hash[5:]
        
        # Query the API
        url = f"https://api.pwnedpasswords.com/range/{hash_prefix}"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            # Check if our hash suffix is in the response
            for line in response.text.split('\n'):
                if line.startswith(hash_suffix):
                    count = int(line.split(':')[1])
                    return {"breached": True, "count": count}
            
            return {"breached": False, "count": 0}
        else:
            return {"breached": False, "count": 0}
    except Exception as e:
        print(f"Error checking breach: {e}")
        return {"breached": False, "count": 0}

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Get the request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            password = data.get('password', '')
            
            if not password:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Password is required"}).encode())
                return
            
            # Check password strength
            strength_data = check_password_strength(password)
            
            # Check for breaches
            breach_data = check_password_breach(password)
            
            # Prepare response
            response = {
                "strength": strength_data,
                "breach": breach_data,
                "ai_suggestions": []  # AI suggestions not available in serverless
            }
            
            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
    
    def do_OPTIONS(self):
        # Handle CORS preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
