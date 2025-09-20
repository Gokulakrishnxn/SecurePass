# SecurePass Browser Extension

A professional password strength checker and generator browser extension that helps you create and verify secure passwords.

## Features

- 🔒 **Password Strength Checker**: Real-time password strength analysis
- 🛡️ **Breach Detection**: Check if your password has been compromised using Have I Been Pwned API
- 🎲 **Password Generator**: Create strong, customizable passwords
- 📱 **Browser Integration**: Works on any website with password fields
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📚 **Password History**: Keep track of recently checked passwords
- 💡 **Security Tips**: Learn best practices for password security

## Installation

### Chrome/Edge/Brave

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The SecurePass icon should appear in your browser toolbar

### Firefox

1. Download or clone this repository
2. Open Firefox and go to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from the extension folder

## Usage

### Basic Usage

1. **Click the SecurePass icon** in your browser toolbar to open the popup
2. **Enter a password** in the input field and click "Check" to analyze its strength
3. **Generate passwords** using the generator with customizable options
4. **Use Quick Actions** to check passwords from current web page fields

### Advanced Features

- **Check Current Field**: Click "Check Current Field" to analyze the password in the currently focused input field
- **Fill with Generated**: Click "Fill with Generated" to automatically fill the current password field with a generated password
- **Password History**: View your recent password checks in the history section
- **Dark Mode**: Toggle between light and dark themes using the moon/sun icon

### Website Integration

The extension automatically detects password fields on web pages and adds a small lock icon (🔒) next to them. Click this icon to quickly check the password strength.

## Privacy & Security

- **No Data Storage**: Your passwords are never stored on our servers
- **Local Processing**: Password strength checking happens locally in your browser
- **Secure API**: Breach checking uses the secure Have I Been Pwned API
- **Local History**: Password history is stored locally in your browser

## Permissions

The extension requires the following permissions:

- **activeTab**: To interact with password fields on the current page
- **storage**: To save your theme preference and password history locally
- **scripting**: To inject content scripts for password field detection
- **host_permissions**: To access the Have I Been Pwned API for breach checking

## Development

### Project Structure

```
├── manifest.json          # Extension manifest
├── popup.html             # Extension popup interface
├── popup.css              # Popup styling
├── popup.js               # Popup functionality
├── content.js             # Content script for web page interaction
├── content.css            # Content script styling
├── background.js          # Background service worker
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README_EXTENSION.md    # This file
```

### Building

No build process is required. The extension works directly with the source files.

### Testing

1. Load the extension in developer mode
2. Test on various websites with password fields
3. Verify all features work correctly
4. Check that the popup opens and functions properly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or feature requests, please visit the project repository or contact [Gokulakrishnan.dev](https://gokulakrishnan.dev).

## Changelog

### Version 1.0.0
- Initial release
- Password strength checking
- Breach detection
- Password generation
- Browser integration
- Dark mode support
- Password history
- Security tips
