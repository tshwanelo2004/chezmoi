# chezmoii - Belgian Culinary Platform

A dynamic bilingual culinary platform connecting student chefs and amateur cooks across Belgium with customers seeking personalized home cooking experiences.
🍲 Empowering local culinary talent to bring gourmet experiences into Belgian homes — one dish at a time.
<img width="1885" height="756" alt="image" src="https://github.com/user-attachments/assets/d1c7b4a1-3f96-45e3-9e99-1c5f8062d515" />

## 🌟 Features

### Core Platform
- **Bilingual Support**: Full French/Dutch localization
- **Chef Marketplace**: Browse and book qualified chefs
- **Service Categories**: Personal chef, cooking lessons, meal prep
- **Real-time Messaging**: Chef-customer communication
- **Review System**: Customer feedback and ratings
- **Payment Integration**: Stripe payment processing

### Modern UX Features
- **Drag & Drop Upload**: Intuitive image upload for portfolios
- **AI Assistant**: Bilingual chatbot for user support
- **Responsive Design**: Mobile-first approach
- **Dark Mode Support**: Theme switching capability
- **Progressive Web App**: Fast, app-like experience

### Chef Features
- **Profile Creation**: Comprehensive chef onboarding
- **Portfolio Management**: Visual showcase of culinary work
- **Booking Management**: Accept/decline reservations
- **Document Upload**: Certificates and credentials
- **Availability Control**: Manage working hours

### Customer Features
- **Advanced Search**: Filter by location, cuisine, price
- **Detailed Profiles**: View chef experience and specialties
- **Booking System**: Schedule culinary experiences
- **Secure Payments**: Protected transaction processing
- **Review System**: Rate and review services

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for routing
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **TanStack Query** for state management
- **React Hook Form** + Zod validation
- **Framer Motion** for animations

### Backend
- **Node.js** with Express
- **PostgreSQL** database
- **Drizzle ORM** for database operations
- **Passport.js** for authentication
- **OpenAI API** for AI assistant
- **Stripe** for payments
- **SendGrid** for email notifications

### DevOps & Deployment
- **Vite** build system
- **TypeScript** for type safety
- **Docker** containerization
- **AWS** deployment configuration
- **Replit** development environment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/chezmoii.git
cd chezmoii
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.production.example .env
# Edit .env with your configuration
```

4. **Database setup**
```bash
npm run db:push
npm run db:seed
```

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:5000` to view the application.

## 📋 Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/chezmoii

# Authentication
SESSION_SECRET=your-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Payment Processing
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# Email Services
SENDGRID_API_KEY=your-sendgrid-api-key

# AI Assistant
OPENAI_API_KEY=your-openai-api-key

# CRM Integration
HUBSPOT_API_KEY=your-hubspot-api-key
```

## 🏗 Project Structure

```
chezmoii/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and contexts
│   │   └── hooks/         # Custom React hooks
├── server/                # Express backend
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database abstraction
│   ├── ai-assistant.ts    # OpenAI integration
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schemas
├── docs/                  # Documentation
└── deploy/                # Deployment configurations
```

## 🔧 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Database operations
npm run db:push          # Push schema changes
npm run db:studio        # Open database studio
npm run db:seed          # Seed with sample data

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📊 Database Schema

### Core Entities
- **Users**: Authentication and profile data
- **Chefs**: Extended chef profiles with ratings
- **Services**: Chef offerings and pricing
- **Bookings**: Customer reservations
- **Reviews**: Rating and feedback system
- **Messages**: Chef-customer communication

### Relationships
- Users can be Chefs (1:1 optional)
- Chefs have many Services (1:N)
- Services have many Bookings (1:N)
- Bookings have many Reviews (1:N)
- Users exchange Messages (N:N)

## 🌍 Internationalization

The platform supports French and Dutch with:
- Complete UI translation
- Localized date/time formatting
- Currency formatting (EUR)
- Regional content adaptation
- SEO-optimized URLs

## 🤖 AI Assistant

Integrated OpenAI-powered assistant provides:
- Bilingual support (French/Dutch)
- Contextual help based on user location
- Chef onboarding guidance
- Platform navigation assistance
- FAQ responses

## 🔒 Security Features

- **Authentication**: Session-based with Google OAuth
- **Data Protection**: Input validation and sanitization
- **CSRF Protection**: Request verification
- **SQL Injection**: Parameterized queries
- **File Upload**: Type and size validation
- **Rate Limiting**: API endpoint protection

## 📱 Mobile Responsiveness

- Progressive Web App capabilities
- Touch-friendly interface
- Optimized performance on mobile devices
- Offline functionality (coming soon)
- App-like navigation

## 🚀 Deployment

### Replit (Development)
```bash
# Already configured for Replit
npm run dev
```

### AWS (Production)
```bash
# Build and deploy
npm run build
./deploy-to-aws.sh
```

### Docker
```bash
# Build container
docker build -t chezmoii .

# Run container
docker run -p 5000:5000 chezmoii
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style
- TypeScript for type safety
- ESLint + Prettier for formatting
- Conventional commits
- Component-based architecture

### Testing
```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📈 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized loading times
- **Image Optimization**: WebP format with fallbacks
- **Code Splitting**: Lazy loading of components
- **Caching**: Strategic browser and server caching

## 🐛 Bug Reports

Please report issues via GitHub Issues with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots if applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shadcn/ui** for the beautiful component library
- **OpenAI** for AI assistant capabilities
- **Stripe** for secure payment processing
- **Replit** for development environment
- **Belgian culinary community** for inspiration

## 📞 Support

For support, email tshwanelovanreeth@gmail.com or join our community chat.

---

**Built with ❤️ for the Belgian culinary community**
