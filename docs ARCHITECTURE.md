# Architecture Documentation

## System Overview

chezmoii is a full-stack web application built with modern technologies to provide a scalable, maintainable, and secure platform for culinary services in Belgium.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   Pages     │  │ Components  │  │   Hooks     │  │   Lib   │ │
│  │             │  │             │  │             │  │         │ │
│  │ - Home      │  │ - UI        │  │ - Auth      │  │ - Query │ │
│  │ - Search    │  │ - Forms     │  │ - Data      │  │ - Utils │ │
│  │ - Profile   │  │ - Layout    │  │ - State     │  │ - i18n  │ │
│  │ - Booking   │  │ - Features  │  │             │  │         │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP/REST API
                                │
┌─────────────────────────────────────────────────────────────────┐
│                        Backend (Node.js)                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   Routes    │  │  Middleware │  │   Storage   │  │ Services│ │
│  │             │  │             │  │             │  │         │ │
│  │ - Auth      │  │ - Session   │  │ - Database  │  │ - Email │ │
│  │ - Users     │  │ - CORS      │  │ - Cache     │  │ - AI    │ │
│  │ - Chefs     │  │ - Logging   │  │ - Files     │  │ - Pay   │ │
│  │ - Bookings  │  │ - Security  │  │             │  │         │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ SQL/ORM
                                │
┌─────────────────────────────────────────────────────────────────┐
│                      Database (PostgreSQL)                     │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   Tables    │  │   Indexes   │  │    Views    │  │ Triggers│ │
│  │             │  │             │  │             │  │         │ │
│  │ - users     │  │ - Location  │  │ - Chef+User │  │ - Audit │ │
│  │ - chefs     │  │ - Time      │  │ - Booking   │  │ - Cache │ │
│  │ - bookings  │  │ - Search    │  │ - Reviews   │  │ - Stats │ │
│  │ - reviews   │  │ - Foreign   │  │             │  │         │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend Technologies

#### Core Framework
- **React 18**: Component-based UI library with hooks
- **TypeScript**: Static typing for better development experience
- **Vite**: Fast build tool and development server

#### State Management
- **TanStack Query v5**: Server state management and caching
- **React Context**: Global state for authentication and language
- **React Hook Form**: Form state management with validation

#### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library
- **Framer Motion**: Animation library

#### Routing & Navigation
- **Wouter**: Lightweight client-side routing
- **React Router**: (Alternative consideration)

#### Form Handling
- **React Hook Form**: Performant form management
- **Zod**: Schema validation library
- **@hookform/resolvers**: Form validation integration

### Backend Technologies

#### Core Framework
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **TypeScript**: Type-safe server-side development

#### Database & ORM
- **PostgreSQL**: Relational database management system
- **Drizzle ORM**: Type-safe SQL query builder
- **Drizzle Kit**: Database migration tool

#### Authentication & Security
- **Passport.js**: Authentication middleware
- **bcrypt**: Password hashing
- **Express Session**: Session management
- **CORS**: Cross-origin resource sharing

#### External Services
- **OpenAI API**: AI assistant functionality
- **Stripe API**: Payment processing
- **SendGrid**: Email service
- **Google OAuth**: Social authentication

### Development Tools

#### Code Quality
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript Compiler**: Type checking
- **Husky**: Git hooks

#### Build & Deployment
- **Vite**: Frontend bundling
- **esbuild**: Backend bundling
- **Docker**: Containerization
- **PM2**: Process management

## Project Structure

```
chezmoii/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/           # Base UI components (shadcn/ui)
│   │   │   ├── layout/       # Layout components
│   │   │   ├── forms/        # Form components
│   │   │   └── features/     # Feature-specific components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities and configurations
│   │   │   ├── contexts/     # React contexts
│   │   │   ├── utils/        # Helper functions
│   │   │   └── translations/ # i18n translations
│   │   └── assets/           # Static assets
│   └── public/               # Public files
├── server/                    # Backend Node.js application
│   ├── routes.ts             # API route definitions
│   ├── storage.ts            # Database abstraction layer
│   ├── storage-pg.ts         # PostgreSQL implementation
│   ├── auth.ts               # Authentication logic
│   ├── ai-assistant.ts       # AI service integration
│   ├── middleware/           # Custom middleware
│   └── utils/                # Server utilities
├── shared/                    # Shared code between frontend and backend
│   └── schema.ts             # Database schemas and types
├── docs/                      # Documentation
├── deploy/                    # Deployment configurations
└── tests/                     # Test files
```

## Data Architecture

### Database Schema

#### Core Entities

**Users Table**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'customer',
  language VARCHAR(5) DEFAULT 'fr',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Chefs Table**
```sql
CREATE TABLE chefs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  specialties TEXT[],
  experience INTEGER,
  hourly_rate DECIMAL(10,2),
  profile_image VARCHAR(255),
  portfolio TEXT[],
  documents TEXT[],
  verified BOOLEAN DEFAULT FALSE,
  availability VARCHAR(20) DEFAULT 'available',
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Services Table**
```sql
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  chef_id INTEGER REFERENCES chefs(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  duration INTEGER,
  price DECIMAL(10,2),
  max_guests INTEGER,
  requirements TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Bookings Table**
```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  chef_id INTEGER REFERENCES chefs(id) ON DELETE CASCADE,
  service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP NOT NULL,
  guests INTEGER DEFAULT 1,
  status VARCHAR(20) DEFAULT 'pending',
  special_requests TEXT,
  total_price DECIMAL(10,2),
  payment_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Relationships

- **Users ↔ Chefs**: One-to-one optional relationship
- **Chefs → Services**: One-to-many relationship
- **Services → Bookings**: One-to-many relationship
- **Users → Bookings**: One-to-many relationship (as customers)
- **Chefs → Bookings**: One-to-many relationship (as service providers)

### Data Flow

#### User Registration Flow
1. User submits registration form
2. Frontend validates input with Zod schema
3. Backend validates and hashes password
4. User record created in database
5. Session established
6. Welcome email sent via SendGrid

#### Chef Onboarding Flow
1. User navigates to chef registration
2. Multi-step form with file uploads
3. Documents uploaded to server storage
4. Chef profile created with 'pending' status
5. Admin notification sent
6. Verification process initiated

#### Booking Flow
1. Customer searches for chefs
2. Filtered results returned from database
3. Customer selects chef and service
4. Booking form with date/time selection
5. Availability checked in real-time
6. Booking created with 'pending' status
7. Chef notification sent
8. Payment processing initiated

## Security Architecture

### Authentication & Authorization

#### Session Management
- Session-based authentication with secure cookies
- Session store in PostgreSQL for persistence
- CSRF protection on all forms
- Secure session configuration

#### Password Security
- bcrypt hashing with salt rounds
- Password complexity requirements
- Secure password reset flow
- Rate limiting on login attempts

#### OAuth Integration
- Google OAuth 2.0 implementation
- Secure token handling
- Profile information synchronization
- Fallback to local authentication

### Data Protection

#### Input Validation
- Client-side validation with Zod schemas
- Server-side validation for all inputs
- SQL injection prevention through parameterized queries
- XSS protection through output encoding

#### File Upload Security
- File type validation
- Size limitations
- Malware scanning
- Secure storage location

#### API Security
- Rate limiting on all endpoints
- Request size limitations
- CORS configuration
- Security headers

## Performance Architecture

### Frontend Performance

#### Code Splitting
- Route-based code splitting
- Component lazy loading
- Dynamic imports for heavy features
- Bundle size optimization

#### Caching Strategy
- TanStack Query caching
- Browser cache headers
- Service worker caching
- CDN integration

#### Image Optimization
- WebP format with fallbacks
- Responsive image loading
- Lazy loading implementation
- Image compression

### Backend Performance

#### Database Optimization
- Indexed columns for frequent queries
- Connection pooling
- Query optimization
- Database monitoring

#### Caching Layer
- Redis for session storage
- Query result caching
- Static file caching
- CDN integration

#### API Optimization
- Response compression
- Efficient pagination
- Bulk operations
- Async processing

## Deployment Architecture

### Development Environment
- Vite dev server for frontend
- Express server for backend
- PostgreSQL database
- Hot module replacement

### Production Environment
- Nginx reverse proxy
- PM2 process management
- PostgreSQL with replication
- SSL/TLS termination

### Monitoring & Logging
- Application performance monitoring
- Error tracking and reporting
- Database performance monitoring
- Security event logging

## Scalability Considerations

### Horizontal Scaling
- Stateless server design
- Load balancer configuration
- Database connection pooling
- Session store externalization

### Vertical Scaling
- Resource monitoring
- Performance profiling
- Bottleneck identification
- Optimization strategies

### Future Enhancements
- Microservices architecture
- Event-driven architecture
- Real-time features with WebSockets
- Mobile application development

## Quality Assurance

### Testing Strategy
- Unit tests for critical functions
- Integration tests for API endpoints
- End-to-end tests for user flows
- Performance testing

### Code Quality
- TypeScript for type safety
- ESLint for code consistency
- Prettier for formatting
- Code review process

### Documentation
- API documentation
- Code comments
- Architecture decisions
- Deployment guides

---

*This architecture documentation is maintained alongside the codebase and updated with each major architectural change.*
