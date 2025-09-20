# 🚀 Deployment Guide

This guide covers deploying both the web application and browser extension.

## 🌐 Web Application Deployment

### Option 1: Railway (Recommended)

1. **Connect to Railway**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Deploy
   railway deploy
   ```

2. **Set Environment Variables**
   - `OPENAI_API_KEY` (optional)
   - `GOOGLE_CLIENT_ID` (optional)
   - `GOOGLE_CLIENT_SECRET` (optional)
   - `SECRET_KEY` (required)

### Option 2: Heroku

1. **Create Heroku App**
   ```bash
   # Install Heroku CLI
   # Create Procfile
   echo "web: python app.py" > Procfile
   
   # Deploy
   git push heroku main
   ```

2. **Set Environment Variables**
   ```bash
   heroku config:set OPENAI_API_KEY=your_key
   heroku config:set SECRET_KEY=your_secret
   ```

### Option 3: DigitalOcean App Platform

1. **Create App Spec**
   ```yaml
   name: securepass
   services:
   - name: web
     source_dir: /
     github:
       repo: Gokulakrishnxn/SecurePass
       branch: main
     run_command: python app.py
     environment_slug: python
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: SECRET_KEY
       value: your_secret_key
   ```

## 🔌 Browser Extension Deployment

### Chrome Web Store

1. **Prepare Extension**
   ```bash
   # Create production build
   zip -r securepass-extension.zip manifest.json popup.html popup.css popup.js content.js content.css background.js icons/ README_EXTENSION.md
   ```

2. **Upload to Chrome Web Store**
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
   - Pay $5 one-time developer fee
   - Upload `securepass-extension.zip`
   - Fill out store listing details
   - Submit for review

### Firefox Add-ons

1. **Prepare Extension**
   ```bash
   # Create Firefox-compatible manifest
   # Update manifest.json for Firefox compatibility
   ```

2. **Upload to Firefox Add-ons**
   - Go to [Firefox Add-ons Developer Hub](https://addons.mozilla.org/developers/)
   - Upload extension files
   - Fill out listing details
   - Submit for review

### Direct Distribution

1. **Package Extension**
   ```bash
   zip -r securepass-extension.zip manifest.json popup.html popup.css popup.js content.js content.css background.js icons/ README_EXTENSION.md
   ```

2. **Share Package**
   - Upload to GitHub Releases
   - Share download link
   - Provide installation instructions

## 🔧 Environment Configuration

### Required Variables
- `SECRET_KEY`: Flask secret key for sessions

### Optional Variables
- `OPENAI_API_KEY`: For AI-powered suggestions
- `GOOGLE_CLIENT_ID`: For Google OAuth
- `GOOGLE_CLIENT_SECRET`: For Google OAuth

### Production Checklist
- [ ] Set strong `SECRET_KEY`
- [ ] Configure domain and SSL
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test all features
- [ ] Update documentation

## 📊 Monitoring

### Web Application
- Set up uptime monitoring
- Monitor error logs
- Track API usage
- Monitor performance metrics

### Browser Extension
- Monitor user feedback
- Track installation metrics
- Monitor crash reports
- Update regularly

## 🔒 Security Considerations

### Web Application
- Use HTTPS in production
- Set secure headers
- Implement rate limiting
- Regular security updates

### Browser Extension
- Follow extension security best practices
- Regular security audits
- Keep dependencies updated
- Monitor for vulnerabilities

## 📈 Analytics

### Web Application
- Google Analytics
- User behavior tracking
- Performance monitoring
- Error tracking

### Browser Extension
- Extension analytics
- User engagement metrics
- Feature usage tracking
- Performance monitoring
