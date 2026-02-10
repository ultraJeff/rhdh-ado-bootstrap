# API Reference

This document describes the API endpoints exposed by ${{ values.name }}.

## Base URL

| Environment | URL |
|-------------|-----|
| Local | `http://localhost:3000` |
| OpenShift | Check the Route in `${{ values.namespace }}` namespace |

## Endpoints

### Health Check

```
GET /
```

Returns a simple health check response.

**Response**

```json
{
  "message": "Hello from ${{ values.name }}!",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Status Codes**

| Code | Description |
|------|-------------|
| 200 | Service is healthy |
| 500 | Internal server error |

**Example**

```bash
curl http://localhost:3000/
```

---

## Extending the API

To add new endpoints, modify `src/index.ts`:

```typescript
import express from 'express';

const app = express();
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello from ${{ values.name }}!',
    timestamp: new Date().toISOString()
  });
});

// Add your new endpoint here
app.get('/api/example', (req, res) => {
  res.json({ data: 'Your data here' });
});

// POST endpoint example
app.post('/api/data', (req, res) => {
  const { body } = req;
  // Process the data
  res.status(201).json({ success: true, received: body });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Error Handling

The API returns errors in the following format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `INTERNAL_ERROR` | 500 | Server error |

## Authentication

By default, the API does not require authentication. To add authentication:

1. Install a JWT library:
   ```bash
   npm install jsonwebtoken
   ```

2. Create an authentication middleware:
   ```typescript
   import jwt from 'jsonwebtoken';

   const authMiddleware = (req, res, next) => {
     const token = req.headers.authorization?.split(' ')[1];
     
     if (!token) {
       return res.status(401).json({ error: 'No token provided' });
     }

     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.user = decoded;
       next();
     } catch (err) {
       return res.status(403).json({ error: 'Invalid token' });
     }
   };

   // Apply to routes
   app.get('/api/protected', authMiddleware, (req, res) => {
     res.json({ user: req.user });
   });
   ```

## Rate Limiting

To add rate limiting, install express-rate-limit:

```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

## OpenAPI Specification

To expose an OpenAPI specification, consider adding `swagger-jsdoc` and `swagger-ui-express`:

```bash
npm install swagger-jsdoc swagger-ui-express
```

This will allow you to document your API and have it appear in the Backstage API catalog.
