# API Reference

## Authentication

### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "yourname",
  "email": "your@email.com",
  "password": "securepassword"
}

Response: 201 Created
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "username": "yourname",
    "email": "your@email.com",
    "plan": "free",
    "apiKey": "..."
  }
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "your@email.com",
  "password": "securepassword"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {...}
}
```

## Obfuscation

### Obfuscate Script
```
POST /api/obfuscate/obfuscate
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "local x = 5\nprint(x)",
  "name": "MyScript",
  "obfuscationLevel": 3
}

Response: 200 OK
{
  "success": true,
  "script": {
    "id": "...",
    "name": "MyScript",
    "loaderCode": "...",
    "obfuscatedCode": "...",
    "obfuscationLevel": 3,
    "status": "protected"
  },
  "stats": {
    "compressionRatio": "15.23%",
    "originalSize": 100,
    "obfuscatedSize": 85
  }
}
```

## Scripts

### List Scripts
```
GET /api/scripts/list
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "_id": "...",
    "name": "MyScript",
    "status": "protected",
    "obfuscationLevel": 3,
    "fileSize": 1024,
    "downloadCount": 5,
    "executionCount": 12,
    "createdAt": "2024-01-17T..."
  }
]
```

### Download Script
```
POST /api/scripts/{scriptId}/download
Authorization: Bearer <token>

Response: 200 OK
[Binary Lua file]
```

## Logs

### Record Execution
```
POST /api/logs/record
Authorization: Bearer <token>
Content-Type: application/json

{
  "scriptId": "...",
  "executor": "roblox",
  "hwid": "ABC123DEF456",
  "status": "success",
  "executionTime": 145
}

Response: 200 OK
{
  "logged": true
}
```

### Get Execution Logs
```
GET /api/logs/execution-logs
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "_id": "...",
    "scriptId": "...",
    "executor": "roblox",
    "status": "success",
    "timestamp": "2024-01-17T..."
  }
]
```

## Plans

### List Plans
```
GET /api/plans/list

Response: 200 OK
{
  "free": {
    "name": "Free",
    "price": 0,
    "obfuscationQuota": 10,
    "features": [...]
  },
  "starter": {...},
  "pro": {...},
  "elite": {...}
}
```

### Get Current Plan
```
GET /api/plans/current
Authorization: Bearer <token>

Response: 200 OK
{
  "currentPlan": "free",
  "planDetails": {...},
  "usage": {
    "obfuscation": 5,
    "quota": 10,
    "storage": 1024000,
    "scripts": 2
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "error": "Quota exceeded"
}
```

### 404 Not Found
```json
{
  "error": "Script not found"
}
```

### 500 Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Detailed error message"
}
```
