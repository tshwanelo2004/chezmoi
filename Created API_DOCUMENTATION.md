# API Documentation

This document provides comprehensive information about the chezmoii API endpoints.

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

The API uses session-based authentication. Users must be logged in to access protected endpoints.

### Authentication Endpoints

#### GET /api/auth/me
Get current user information.

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "customer",
  "createdAt": "2025-01-16T10:00:00Z"
}
```

#### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  }
}
```

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+32123456789",
  "language": "fr"
}
```

#### POST /api/auth/logout
Logout current user.

**Response:**
```json
{
  "success": true
}
```

### Google OAuth

#### GET /api/auth/google
Initiate Google OAuth flow.

#### GET /api/auth/google/callback
Handle Google OAuth callback.

## User Management

### Users

#### GET /api/users/:id
Get user by ID.

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+32123456789",
  "language": "fr",
  "role": "customer",
  "createdAt": "2025-01-16T10:00:00Z"
}
```

#### PUT /api/users/:id
Update user information.

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+32987654321",
  "language": "nl"
}
```

## Chef Management

### Chefs

#### GET /api/chefs
Get all chefs with optional filtering.

**Query Parameters:**
- `location` (string): Filter by location
- `specialties` (array): Filter by specialties
- `maxPrice` (number): Maximum price filter
- `minRating` (number): Minimum rating filter
- `page` (number): Page number for pagination
- `limit` (number): Items per page

**Response:**
```json
{
  "chefs": [
    {
      "id": 1,
      "userId": 2,
      "title": "Professional Chef",
      "description": "Experienced chef specializing in French cuisine",
      "location": "Brussels",
      "specialties": ["French", "Mediterranean"],
      "experience": 5,
      "rating": 4.8,
      "reviewCount": 24,
      "hourlyRate": 45,
      "profileImage": "chef-profile.jpg",
      "portfolio": ["dish1.jpg", "dish2.jpg"],
      "verified": true,
      "availability": "available",
      "user": {
        "name": "Marie Dubois",
        "email": "marie@example.com"
      }
    }
  ],
  "totalCount": 1,
  "page": 1,
  "totalPages": 1
}
```

#### GET /api/chefs/:id
Get chef by ID with user information.

#### GET /api/chefs/featured
Get featured chefs for homepage.

#### POST /api/chefs
Create new chef profile (requires authentication).

**Request Body:**
```json
{
  "title": "Professional Chef",
  "description": "Experienced chef specializing in French cuisine",
  "location": "Brussels",
  "specialties": ["French", "Mediterranean"],
  "experience": 5,
  "hourlyRate": 45,
  "profileImage": "chef-profile.jpg",
  "portfolio": ["dish1.jpg", "dish2.jpg"],
  "documents": ["certificate.pdf"]
}
```

#### PUT /api/chefs/:id
Update chef profile (requires authentication and ownership).

#### DELETE /api/chefs/:id
Delete chef profile (requires authentication and ownership).

### Chef Services

#### GET /api/chefs/:chefId/services
Get services offered by a chef.

#### POST /api/chefs/:chefId/services
Create new service (requires authentication).

**Request Body:**
```json
{
  "name": "French Cooking Lesson",
  "description": "Learn to cook traditional French dishes",
  "category": "cooking_lesson",
  "duration": 120,
  "price": 80,
  "maxGuests": 4,
  "requirements": ["Basic cooking knowledge"]
}
```

#### PUT /api/services/:id
Update service (requires authentication and ownership).

#### DELETE /api/services/:id
Delete service (requires authentication and ownership).

## Booking Management

### Bookings

#### GET /api/bookings
Get user's bookings (requires authentication).

#### GET /api/bookings/:id
Get booking by ID (requires authentication and access rights).

#### POST /api/bookings
Create new booking (requires authentication).

**Request Body:**
```json
{
  "chefId": 1,
  "serviceId": 1,
  "scheduledAt": "2025-01-20T18:00:00Z",
  "guests": 2,
  "specialRequests": "Vegetarian options preferred",
  "totalPrice": 160
}
```

#### PUT /api/bookings/:id
Update booking (requires authentication and ownership).

#### DELETE /api/bookings/:id
Cancel booking (requires authentication and ownership).

### Booking Status Management

#### PUT /api/bookings/:id/status
Update booking status (chef only).

**Request Body:**
```json
{
  "status": "confirmed",
  "notes": "Looking forward to cooking for you!"
}
```

**Status Options:**
- `pending`: Awaiting chef confirmation
- `confirmed`: Chef has accepted the booking
- `in_progress`: Service is currently being provided
- `completed`: Service has been completed
- `cancelled`: Booking has been cancelled

## Review System

### Reviews

#### GET /api/chefs/:chefId/reviews
Get reviews for a chef.

#### POST /api/reviews
Create new review (requires authentication and completed booking).

**Request Body:**
```json
{
  "bookingId": 1,
  "chefId": 1,
  "rating": 5,
  "comment": "Excellent service! The food was amazing.",
  "categories": {
    "food_quality": 5,
    "professionalism": 5,
    "communication": 4,
    "value": 5
  }
}
```

#### PUT /api/reviews/:id
Update review (requires authentication and ownership).

#### DELETE /api/reviews/:id
Delete review (requires authentication and ownership).

## Messaging System

### Messages

#### GET /api/messages/conversations
Get user's conversations (requires authentication).

#### GET /api/messages/conversation/:userId
Get conversation with specific user (requires authentication).

#### POST /api/messages
Send message (requires authentication).

**Request Body:**
```json
{
  "recipientId": 2,
  "content": "Hello, I'd like to book your cooking lesson service.",
  "bookingId": 1
}
```

#### PUT /api/messages/:id/read
Mark message as read (requires authentication).

## Search and Discovery

### Search

#### GET /api/search/chefs
Advanced chef search.

**Query Parameters:**
- `query` (string): Search query
- `location` (string): Location filter
- `specialties` (array): Specialty filters
- `priceRange` (object): Price range filter
- `availability` (string): Availability filter
- `rating` (number): Minimum rating
- `sortBy` (string): Sort criteria
- `page` (number): Page number
- `limit` (number): Items per page

#### GET /api/search/services
Search services.

**Query Parameters:**
- `query` (string): Search query
- `category` (string): Service category
- `location` (string): Location filter
- `priceRange` (object): Price range filter
- `duration` (number): Service duration
- `page` (number): Page number
- `limit` (number): Items per page

## Newsletter and Communications

### Newsletter

#### POST /api/newsletter/subscribe
Subscribe to newsletter.

**Request Body:**
```json
{
  "email": "user@example.com",
  "language": "fr"
}
```

#### DELETE /api/newsletter/unsubscribe
Unsubscribe from newsletter.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

## Job Applications

### Job Applications

#### POST /api/jobs/apply
Submit job application.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+32123456789",
  "position": "chef",
  "experience": "5 years in professional kitchens",
  "resume": "resume.pdf",
  "portfolio": ["dish1.jpg", "dish2.jpg"]
}
```

#### GET /api/jobs/applications
Get job applications (admin only).

## AI Assistant

### AI Assistant

#### POST /api/ai/chat
Chat with AI assistant.

**Request Body:**
```json
{
  "message": "How do I become a chef on the platform?",
  "language": "fr",
  "context": {
    "page": "home",
    "userType": "customer"
  }
}
```

**Response:**
```json
{
  "response": "Pour devenir chef sur notre plateforme, vous devez...",
  "suggestions": [
    "Voir le processus d'inscription",
    "Contacter notre équipe",
    "Consulter les exigences"
  ]
}
```

## File Upload

### File Upload

#### POST /api/upload/image
Upload image file.

**Request:**
- Content-Type: multipart/form-data
- Field name: `image`
- Supported formats: JPEG, PNG, WebP
- Max size: 5MB

**Response:**
```json
{
  "success": true,
  "filename": "upload_123456789.jpg",
  "url": "/uploads/upload_123456789.jpg",
  "size": 1024000
}
```

#### POST /api/upload/document
Upload document file.

**Request:**
- Content-Type: multipart/form-data
- Field name: `document`
- Supported formats: PDF, DOC, DOCX
- Max size: 10MB

## Error Handling

### Error Response Format

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "validation error details"
  }
}
```

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `422`: Validation Error
- `500`: Internal Server Error

### Common Error Codes

- `VALIDATION_ERROR`: Request validation failed
- `AUTHENTICATION_REQUIRED`: User must be logged in
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `DUPLICATE_RESOURCE`: Resource already exists
- `RATE_LIMIT_EXCEEDED`: Too many requests

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **Search endpoints**: 100 requests per minute
- **General endpoints**: 1000 requests per hour
- **File upload**: 10 requests per minute

## Webhooks

### Stripe Webhooks

#### POST /api/webhooks/stripe
Handle Stripe webhook events.

**Events:**
- `payment_intent.succeeded`: Payment completed
- `payment_intent.payment_failed`: Payment failed
- `customer.subscription.created`: Subscription created
- `customer.subscription.updated`: Subscription updated
- `customer.subscription.deleted`: Subscription cancelled

## Testing

### Test Endpoints

#### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-16T10:00:00Z",
  "version": "1.0.0",
  "database": "connected"
}
```

#### GET /api/version
Get API version information.

**Response:**
```json
{
  "version": "1.0.0",
  "buildDate": "2025-01-16T10:00:00Z",
  "environment": "production"
}
```

## SDK and Client Libraries

### JavaScript/TypeScript
```typescript
import { ChezmoiiClient } from 'chezmoii-sdk';

const client = new ChezmoiiClient({
  baseUrl: 'https://api.chezmoii.be',
  apiKey: 'your-api-key'
});

// Search chefs
const chefs = await client.chefs.search({
  location: 'Brussels',
  specialties: ['French'],
  maxPrice: 100
});
```

### Python
```python
from chezmoii import ChezmoiiClient

client = ChezmoiiClient(
    base_url='https://api.chezmoii.be',
    api_key='your-api-key'
)

# Search chefs
chefs = client.chefs.search(
    location='Brussels',
    specialties=['French'],
    max_price=100
)
```

## Support

For API support, please contact:
- Email: developers@chezmoii.be
- Documentation: https://docs.chezmoii.be
- GitHub Issues: https://github.com/yourusername/chezmoii/issues
