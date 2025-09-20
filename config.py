import os

# OpenAI API Configuration
# To use AI features, set your OpenAI API key as an environment variable:
# export OPENAI_API_KEY="your_api_key_here"
# 
# Or create a .env file with:
# OPENAI_API_KEY=your_api_key_here

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# You can get a free OpenAI API key from: https://platform.openai.com/api-keys
# The free tier provides $5 in credits which is plenty for testing

# Google OAuth Configuration
# To enable Google login, set these environment variables:
# export GOOGLE_CLIENT_ID="your_google_client_id"
# export GOOGLE_CLIENT_SECRET="your_google_client_secret"
# export SECRET_KEY="your_secret_key_for_sessions"

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')

# Get Google OAuth credentials from: https://console.developers.google.com/
# 1. Create a new project or select existing one
# 2. Enable Google+ API
# 3. Create OAuth 2.0 credentials
# 4. Add your domain to authorized origins
# 5. Set the client ID and secret as environment variables
