# Risk Configuration API

A simple Node.js| Method | Endpoint | Description |
|--------|-----------|-----------|
| GET | `/health` | Health check |
| GET | `/configs` | Get all configurations |
| GET | `/configs/:resourceId` | Get config by resourceId |
| POST | `/configs/:resourceId` | Save config for resourceId |
| PUT | `/configs/:resourceId` | Update config for resourceId |
| DELETE | `/configs/:resourceId` | Delete config by resourceId |I for managing risk configurations by resourceId. This API allows you to save, retrieve, update, and delete risk configurations for specific resources using their resourceId as the key.

## Features

- ✅ Full CRUD operations for risk configurations
- ✅ ResourceId-based storage (no auto-generated IDs)
- ✅ Automatic timestamps (createdAt, updatedAt)
- ✅ Input validation and error handling
- ✅ CORS support
- ✅ Health check endpoint
- ✅ In-memory data storage
- ✅ Upsert functionality (create or update)

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **For development (with auto-restart):**
   ```bash
   npm run dev
   ```

The server will start on port 3000 by default. You can change this by setting the `PORT` environment variable.

## API Endpoints

### Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/objects` | Get all objects |
| GET | `/objects/:id` | Get object by ID |
| POST | `/objects` | Create new object |
| PUT | `/objects/:id` | Update object completely |
| DELETE | `/objects/:id` | Delete object |

## API Usage Examples

### 1. Save a Risk Configuration

**Request:**
```bash
curl -X POST http://localhost:3000/configs/portfolio-123 \
  -H "Content-Type: application/json" \
  -d '{
    "riskThreshold": 0.15,
    "maxExposure": 1000000,
    "riskMetrics": {
      "var95": 0.05,
      "expectedShortfall": 0.08
    },
    "alertSettings": {
      "enableAlerts": true,
      "thresholds": [0.10, 0.15, 0.20]
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Configuration created successfully",
  "data": {
    "resourceId": "portfolio-123",
    "config": {
      "riskThreshold": 0.15,
      "maxExposure": 1000000,
      "riskMetrics": {
        "var95": 0.05,
        "expectedShortfall": 0.08
      },
      "alertSettings": {
        "enableAlerts": true,
        "thresholds": [0.10, 0.15, 0.20]
      }
    },
    "createdAt": "2025-09-22T10:30:00.000Z",
    "updatedAt": "2025-09-22T10:30:00.000Z"
  }
}
```

### 2. Get All Configurations

**Request:**
```bash
curl http://localhost:3000/configs
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "resourceId": "portfolio-123",
      "config": {
        "riskThreshold": 0.15,
        "maxExposure": 1000000,
        "riskMetrics": {
          "var95": 0.05,
          "expectedShortfall": 0.08
        },
        "alertSettings": {
          "enableAlerts": true,
          "thresholds": [0.10, 0.15, 0.20]
        }
      },
      "createdAt": "2025-09-22T10:30:00.000Z",
      "updatedAt": "2025-09-22T10:30:00.000Z"
    }
  ]
}
```

### 3. Get Configuration by ResourceId

**Request:**
```bash
curl http://localhost:3000/configs/portfolio-123
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resourceId": "portfolio-123",
    "config": {
      "riskThreshold": 0.15,
      "maxExposure": 1000000,
      "riskMetrics": {
        "var95": 0.05,
        "expectedShortfall": 0.08
      },
      "alertSettings": {
        "enableAlerts": true,
        "thresholds": [0.10, 0.15, 0.20]
      }
    },
    "createdAt": "2025-09-22T10:30:00.000Z",
    "updatedAt": "2025-09-22T10:30:00.000Z"
  }
}
```

### 4. Update Configuration

**Request:**
```bash
curl -X PUT http://localhost:3000/configs/portfolio-123 \
  -H "Content-Type: application/json" \
  -d '{
    "riskThreshold": 0.12,
    "maxExposure": 1200000,
    "riskMetrics": {
      "var95": 0.04,
      "expectedShortfall": 0.07
    },
    "alertSettings": {
      "enableAlerts": true,
      "thresholds": [0.08, 0.12, 0.16],
      "emailNotifications": true
    },
    "lastReviewDate": "2025-09-22"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Configuration updated successfully",
  "data": {
    "resourceId": "portfolio-123",
    "config": {
      "riskThreshold": 0.12,
      "maxExposure": 1200000,
      "riskMetrics": {
        "var95": 0.04,
        "expectedShortfall": 0.07
      },
      "alertSettings": {
        "enableAlerts": true,
        "thresholds": [0.08, 0.12, 0.16],
        "emailNotifications": true
      },
      "lastReviewDate": "2025-09-22"
    },
    "createdAt": "2025-09-22T10:30:00.000Z",
    "updatedAt": "2025-09-22T10:35:00.000Z"
  }
}
```

**Note:** PUT completely replaces the configuration (except `resourceId`, `createdAt`, and `updatedAt` which are preserved).

### 5. Delete Configuration

**Request:**
```bash
curl -X DELETE http://localhost:3000/configs/portfolio-123
```

**Response:**
```json
{
  "success": true,
  "message": "Configuration deleted successfully",
  "data": {
    "resourceId": "portfolio-123",
    "config": {
      "riskThreshold": 0.12,
      "maxExposure": 1200000,
      "riskMetrics": {
        "var95": 0.04,
        "expectedShortfall": 0.07
      },
      "alertSettings": {
        "enableAlerts": true,
        "thresholds": [0.08, 0.12, 0.16],
        "emailNotifications": true
      },
      "lastReviewDate": "2025-09-22"
    },
    "createdAt": "2025-09-22T10:30:00.000Z",
    "updatedAt": "2025-09-22T10:35:00.000Z"
  }
}
```

## Error Handling

The API provides detailed error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request body",
  "message": "Request body must be a valid configuration object"
}
```

### 404 Not Found
```json
{
  "error": "Configuration not found",
  "message": "Configuration for resourceId 'portfolio-123' does not exist"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## Configuration Structure

Each stored configuration automatically gets:
- `resourceId`: The unique identifier you provide
- `config`: Your configuration object
- `createdAt`: ISO timestamp when configuration was first created
- `updatedAt`: ISO timestamp when configuration was last updated

## Data Persistence

⚠️ **Note:** This API uses in-memory storage. All data will be lost when the server restarts. For production use, consider integrating with a database like MongoDB, PostgreSQL, or Redis.

## Testing the API

You can test the API using:
- cURL (examples provided above)
- Postman
- Insomnia  
- Any HTTP client

Example using JavaScript fetch:
```javascript
// Save a risk configuration
const response = await fetch('http://localhost:3000/configs/portfolio-456', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    riskThreshold: 0.10,
    maxExposure: 500000,
    alertSettings: {
      enableAlerts: true,
      thresholds: [0.05, 0.10, 0.15]
    }
  })
});
const result = await response.json();
console.log(result);
```

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## License

MIT

## API Usage Examples

### 1. Create an Object

**Request:**
```bash
curl -X POST http://localhost:3000/objects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "zipCode": "10001"
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Object created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "data": {
      "name": "John Doe",
      "age": 30,
      "email": "john@example.com",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "zipCode": "10001"
      }
    },
    "createdAt": "2025-09-22T10:30:00.000Z",
    "updatedAt": "2025-09-22T10:30:00.000Z"
  }
}
```

### 2. Get All Objects

**Request:**
```bash
curl http://localhost:3000/objects
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "data": {
        "name": "John Doe",
        "age": 30,
        "email": "john@example.com",
        "address": {
          "street": "123 Main St",
          "city": "New York",
          "zipCode": "10001"
        }
      },
      "createdAt": "2025-09-22T10:30:00.000Z",
      "updatedAt": "2025-09-22T10:30:00.000Z"
    }
  ]
}
```

### 3. Get Object by ID

**Request:**
```bash
curl http://localhost:3000/objects/550e8400-e29b-41d4-a716-446655440000
```

### 4. Update Object with Diff

**Example 1: Simple updates**
```bash
curl -X PUT http://localhost:3000/objects/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "age": 31,
    "email": null,
    "phone": "555-1234"
  }'
```

**Example 2: Using $set and $unset operators**
```bash
curl -X PUT http://localhost:3000/objects/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "name": { "$set": "Jane Doe" },
    "age": { "$set": 28 },
    "email": { "$unset": true }
  }'
```

**Example 3: Nested object updates**
```bash
curl -X PUT http://localhost:3000/objects/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "address": {
      "street": "456 Oak Avenue",
      "country": "USA"
    }
  }'
```

This will update the street address and add a country field while keeping the existing city and zipCode.

### 5. Delete Object

**Request:**
```bash
curl -X DELETE http://localhost:3000/objects/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "success": true,
  "message": "Object deleted successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "data": { ... },
    "createdAt": "2025-09-22T10:30:00.000Z",
    "updatedAt": "2025-09-22T10:32:00.000Z"
  }
}
```

## Diff Operation Examples

### Before applying diff:
```json
{
  "id": "123",
  "data": {
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "zipCode": "10001"
    },
    "hobbies": ["reading", "swimming"]
  }
}
```

### Diff operations:

1. **Update age and remove email:**
   ```json
   {
     "age": 31,
     "email": null
   }
   ```

2. **Update nested address:**
   ```json
   {
     "address": {
       "street": "456 Oak Ave",
       "country": "USA"
     }
   }
   ```

3. **Using MongoDB-style operators:**
   ```json
   {
     "name": { "$set": "Jane Smith" },
     "email": { "$unset": true },
     "phone": { "$set": "555-1234" }
   }
   ```

### After applying diff (example 1):
```json
{
  "id": "123",
  "data": {
    "name": "John Doe",
    "age": 31,
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "zipCode": "10001"
    },
    "hobbies": ["reading", "swimming"]
  }
}
```

## Error Handling

The API provides detailed error responses:

### 400 Bad Request
```json
{
  "error": "Invalid diff format",
  "message": "Invalid $unset operation at age: must be boolean"
}
```

### 404 Not Found
```json
{
  "error": "Object not found",
  "message": "Object with ID 550e8400-e29b-41d4-a716-446655440000 does not exist"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## Data Persistence

⚠️ **Note:** This API uses in-memory storage. All data will be lost when the server restarts. For production use, consider integrating with a database like MongoDB, PostgreSQL, or Redis.

## Testing the API

You can test the API using:
- cURL (examples provided above)
- Postman
- Insomnia
- Any HTTP client

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## License

MIT