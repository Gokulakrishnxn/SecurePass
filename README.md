# 🔒 SecurePass - Professional Password Security Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.3+-green.svg)](https://flask.palletsprojects.com)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-orange.svg)](https://chrome.google.com/webstore)

A comprehensive password security solution featuring both a web application and browser extension. Built with Flask backend and modern web technologies, SecurePass provides professional-grade password strength checking, breach detection, and secure password generation.

## ✨ Features

### 🌐 Web Application
- **🔍 Password Strength Analysis**: Real-time analysis with detailed feedback
- **🛡️ Breach Detection**: Integration with Have I Been Pwned API
- **🎲 Password Generator**: Customizable secure password creation
- **📊 Visual Strength Indicators**: Interactive cards and progress bars
- **🌙 Dark Mode**: Professional light/dark theme toggle
- **📱 Mobile Responsive**: Optimized for all device sizes
- **📚 Password History**: Local storage of recent checks
- **💡 Security Tips**: Educational best practices
- **🤖 AI Integration**: OpenAI-powered password suggestions (optional)

### 🔌 Browser Extension
- **⚡ Quick Access**: Instant password checking from any website
- **🎯 Smart Detection**: Automatically finds password fields
- **🔄 One-Click Fill**: Generate and fill passwords directly
- **🔒 Visual Indicators**: Lock icons next to password fields
- **💾 Local Storage**: Secure, private password history
- **🌐 Cross-Site**: Works on any website with password fields

## 🚀 Quick Start

### Web Application

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gokulakrishnxn/SecurePass.git
   cd SecurePass
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Access the app**
   Open your browser and navigate to `http://localhost:5002`

### Browser Extension

1. **Download the extension files**
   ```bash
   # All extension files are in the root directory
   ```

2. **Install in Chrome/Edge/Brave**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the SecurePass folder

3. **Install in Firefox**
   - Open `about:debugging`
   - Click "This Firefox"
   - Click "Load Temporary Add-on"
   - Select `manifest.json`

## 📁 Project Structure

```
SecurePass/
├── 🌐 Web Application
│   ├── app.py                 # Flask backend server
│   ├── requirements.txt       # Python dependencies
│   ├── config.py             # Configuration settings
│   ├── templates/
│   │   └── index.html        # Main web interface
│   └── static/
│       ├── style.css         # Web app styling
│       └── script.js         # Web app functionality
│
├── 🔌 Browser Extension
│   ├── manifest.json         # Extension configuration
│   ├── popup.html            # Extension popup interface
│   ├── popup.css             # Extension styling
│   ├── popup.js              # Extension functionality
│   ├── content.js            # Website integration script
│   ├── content.css           # Content script styling
│   ├── background.js         # Background service worker
│   └── icons/                # Extension icons
│       ├── icon16.png
│       ├── icon32.png
│       ├── icon48.png
│       └── icon128.png
│
├── 📚 Documentation
│   ├── README.md             # This file
│   ├── README_EXTENSION.md   # Extension-specific guide
│   └── test_extension.html   # Extension testing page
│
└── 📦 Distribution
    └── securepass-extension.zip  # Packaged extension
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# OpenAI API (Optional - for AI suggestions)
OPENAI_API_KEY=your_openai_api_key_here

# Google OAuth (Optional - for user authentication)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Flask Secret Key
SECRET_KEY=your_secret_key_here
```

### API Keys Setup

1. **OpenAI API** (Optional)
   - Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Set `OPENAI_API_KEY` environment variable

2. **Google OAuth** (Optional)
   - Create credentials at [Google Cloud Console](https://console.developers.google.com/)
   - Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

## 🛠️ API Endpoints

### Web Application API

| Endpoint | Method | Description | Request Body |
|----------|--------|-------------|--------------|
| `/` | GET | Main application page | - |
| `/check_password` | POST | Check password strength | `{"password": "string"}` |
| `/generate_password` | POST | Generate secure password | `{"length": int, "include_symbols": bool, "include_numbers": bool}` |
| `/auth/google` | GET | Google OAuth login | - |
| `/auth/logout` | GET | User logout | - |
| `/auth/status` | GET | Check auth status | - |

### Response Examples

**Password Check Response:**
```json
{
  "strength": {
    "strength": "Strong",
    "score": 5,
    "max_score": 5,
    "feedback": []
  },
  "breach": {
    "breached": false,
    "count": 0
  },
  "ai_suggestions": []
}
```

**Password Generation Response:**
```json
{
  "password": "Kx9#mP2$vL8@nQ4!",
  "length": 16
}
```

## 🔒 Security Features

- **🔐 No Password Storage**: Passwords are never stored or logged
- **🛡️ Secure Transmission**: HTTPS-ready with secure headers
- **🎲 Cryptographically Secure**: Uses secure random generation
- **🌐 Breach Detection**: Real-time checking against known breaches
- **🔒 Local Processing**: Password analysis happens locally
- **📱 Privacy First**: No tracking or data collection

## 🎨 Design Philosophy

- **🎯 Minimalist**: Clean, distraction-free interface
- **🌙 Professional**: Black and white theme with Apple fonts
- **📱 Responsive**: Works perfectly on all devices
- **♿ Accessible**: WCAG compliant design
- **⚡ Fast**: Optimized for performance

## 🧪 Testing

### Web Application Testing
```bash
# Run the Flask app
python app.py

# Test endpoints
curl -X POST http://localhost:5002/check_password \
  -H "Content-Type: application/json" \
  -d '{"password": "test123"}'
```

### Extension Testing
1. Open `test_extension.html` in your browser
2. Install the extension
3. Test password field detection and interaction

## 📦 Distribution

### Web Application
- Deploy to any Python hosting service (Heroku, Railway, DigitalOcean)
- Configure environment variables
- Set up domain and SSL certificate

### Browser Extension
- **Chrome Web Store**: Package and submit for review
- **Firefox Add-ons**: Submit to Mozilla Add-ons
- **Direct Distribution**: Share the `securepass-extension.zip` file

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- Follow PEP 8 for Python code
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure cross-browser compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Have I Been Pwned](https://haveibeenpwned.com/) for breach detection API
- [OpenAI](https://openai.com/) for AI-powered suggestions
- [Flask](https://flask.palletsprojects.com/) for the web framework
- [Chrome Extensions](https://developer.chrome.com/docs/extensions/) for extension APIs

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Gokulakrishnxn/SecurePass/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Gokulakrishnxn/SecurePass/discussions)
- **Website**: [Gokulakrishnan.dev](https://gokulakrishnan.dev)

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Gokulakrishnxn/SecurePass&type=Date)](https://star-history.com/#Gokulakrishnxn/SecurePass&Date)

---

<div align="center">
  <p>Built with ❤️ by <a href="https://gokulakrishnan.dev">Gokulakrishnan</a></p>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>
