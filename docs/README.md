# ShinraGuard Documentation

## Overview
ShinraGuard is a professional Roblox Lua script obfuscator and protector with enterprise-grade security features.

## Features

### Script Obfuscation
- **5 Obfuscation Levels**: From basic to maximum security
- **Variable Renaming**: Automatic variable and function name obfuscation
- **String Encryption**: AES-256 encryption for sensitive strings
- **Anti-Debug**: Built-in protection against debuggers
- **Anti-Tamper**: Detects script modifications
- **Personal VM**: Virtual machine protection for level 4+ obfuscation

### Loader Protection
- **Browser Blocker**: Prevents execution in browsers
- **Roblox Executor Only**: Executes only in authorized Roblox executors
- **HWID Locking**: Bind scripts to specific hardware
- **Encryption**: Encrypted loader code with dynamic decryption

### Monitoring & Logs
- **Execution Logs**: Track when and where scripts execute
- **HWID Banning**: Ban compromised hardware IDs
- **IP Tracking**: Log execution IP addresses
- **Statistics**: Detailed analytics per script

### Plans

#### Free Plan - $0/month
- 10 Obfuscations per month
- 5 Script limit
- Basic obfuscation
- Anti-debug protection
- 100 MB storage

#### Starter Plan - $5/month
- 50 Obfuscations per month
- 50 Script limit
- Advanced obfuscation
- Anti-debug & Anti-tamper
- 1 GB storage
- 1 Provider integration

#### Pro Plan - $15/month
- 150 Obfuscations per month
- 200 Script limit
- Maximum obfuscation
- Personal VM
- 5 GB storage
- 3 Provider integrations
- Priority support

#### Elite Plan - $30/month
- 500 Obfuscations per month
- 1000 Script limit
- All features
- Custom watermark
- 10 GB storage
- All providers
- 24/7 support
- Custom VM

### Providers
- **Linkvertise**: URL shortener with monetization
- **WorkInk**: Link monetization platform
- **LootLabs**: Reward platform integration

## API Documentation

### Authentication
All API requests require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_token>
```

### Endpoints

#### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user

#### Obfuscation
- `POST /api/obfuscate/obfuscate` - Obfuscate a script
- `GET /api/obfuscate/preview/:scriptId` - Preview obfuscated code

#### Scripts
- `GET /api/scripts/list` - List all scripts
- `GET /api/scripts/:scriptId` - Get script details
- `DELETE /api/scripts/:scriptId` - Delete script
- `POST /api/scripts/:scriptId/download` - Download script

#### Logs
- `POST /api/logs/record` - Record execution log
- `GET /api/logs/execution-logs` - Get execution logs
- `GET /api/logs/script/:scriptId/logs` - Get script-specific logs

#### Plans
- `GET /api/plans/list` - List all plans
- `GET /api/plans/current` - Get current user plan
- `POST /api/plans/upgrade` - Upgrade plan

#### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/set-hwid` - Set HWID
- `POST /api/users/update-providers` - Configure providers

## Getting Started

1. Register an account at ShinraGuard
2. Choose a plan that fits your needs
3. Create your first API key
4. Start obfuscating scripts!

## Security

- AES-256 encryption for sensitive data
- SSL/TLS encryption in transit
- HWID locking and banning system
- Anti-debug and anti-tamper protection
- Regular security audits

## Support

Join our Discord community for support and updates:
https://discord.gg/hgn7Q8DUGu
