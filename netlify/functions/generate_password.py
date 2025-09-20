import json
import secrets
import string
from http.server import BaseHTTPRequestHandler

def generate_strong_password(length=16, include_symbols=True, include_numbers=True):
    """Generate a strong password"""
    lowercase = string.ascii_lowercase
    uppercase = string.ascii_uppercase
    numbers = string.digits
    symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    
    # Build character set
    charset = lowercase + uppercase
    if include_numbers:
        charset += numbers
    if include_symbols:
        charset += symbols
    
    # Ensure minimum requirements
    password = []
    
    # Add at least one character from each required set
    password.append(secrets.choice(lowercase))
    password.append(secrets.choice(uppercase))
    
    if include_numbers:
        password.append(secrets.choice(numbers))
    if include_symbols:
        password.append(secrets.choice(symbols))
    
    # Fill the rest randomly
    for _ in range(length - len(password)):
        password.append(secrets.choice(charset))
    
    # Shuffle the password
    secrets.SystemRandom().shuffle(password)
    
    return ''.join(password)

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Get the request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # Get parameters
            length = int(data.get('length', 16))
            include_symbols = data.get('include_symbols', True)
            include_numbers = data.get('include_numbers', True)
            
            # Validate length
            if length < 4 or length > 128:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Length must be between 4 and 128"}).encode())
                return
            
            # Generate password
            password = generate_strong_password(length, include_symbols, include_numbers)
            
            # Prepare response
            response = {
                "password": password,
                "length": len(password)
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
