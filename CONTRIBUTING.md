# Contributing to chezmoii

Thank you for your interest in contributing to chezmoii! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git
- Code editor (VS Code recommended)

### Development Setup

1. **Fork and clone the repository**
```bash
git clone https://github.com/yourusername/chezmoii.git
cd chezmoii
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment**
```bash
cp .env.production.example .env
# Configure your environment variables
```

4. **Start development server**
```bash
npm run dev
```

## 📋 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Maintain consistent indentation (2 spaces)

### Project Structure
```
client/src/
├── components/     # Reusable UI components
│   ├── ui/        # Base UI components (shadcn/ui)
│   └── layout/    # Layout components
├── pages/         # Page components
├── lib/           # Utilities, contexts, helpers
├── hooks/         # Custom React hooks
└── assets/        # Static assets

server/
├── routes.ts      # API route definitions
├── storage.ts     # Database abstraction layer
├── ai-assistant.ts # OpenAI integration
├── auth.ts        # Authentication logic
└── index.ts       # Server entry point

shared/
└── schema.ts      # Database schemas and types
```

### Component Guidelines

#### React Components
- Use functional components with hooks
- Implement proper TypeScript types
- Use React.memo for performance optimization
- Follow the component naming convention

```tsx
// Good
interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

export function UserProfile({ user, onUpdate }: UserProfileProps) {
  // Component implementation
}

// Bad
export default function userProfile(props: any) {
  // Component implementation
}
```

#### Styling
- Use Tailwind CSS for styling
- Follow the existing color scheme
- Use shadcn/ui components when possible
- Implement responsive design

```tsx
// Good
<div className="bg-red-800 text-white p-4 rounded-lg hover:bg-red-900 transition-colors">
  Content
</div>

// Bad
<div style={{ backgroundColor: '#800A0A', color: 'white' }}>
  Content
</div>
```

### Backend Guidelines

#### API Routes
- Use RESTful conventions
- Implement proper error handling
- Add input validation
- Use TypeScript types

```typescript
// Good
app.get('/api/chefs/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const chef = await storage.getChef(id);
    
    if (!chef) {
      return res.status(404).json({ error: 'Chef not found' });
    }
    
    res.json(chef);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

#### Database Operations
- Use the storage abstraction layer
- Implement proper error handling
- Use transactions for complex operations
- Add appropriate indexes

### Testing

#### Unit Tests
```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

#### Integration Tests
- Test API endpoints
- Test database operations
- Test authentication flows

## 🌍 Internationalization

### Adding New Languages
1. Create translation files in `client/src/lib/translations/`
2. Update the language context
3. Add locale-specific formatting
4. Test all UI components

### Translation Guidelines
- Use clear, concise language
- Maintain consistency in terminology
- Consider cultural context
- Test with native speakers

## 🚀 Deployment

### Development Deployment
```bash
# Build the project
npm run build

# Test production build
npm run start
```

### Production Deployment
1. Update version in `package.json`
2. Run full test suite
3. Build optimized bundle
4. Deploy to staging environment
5. Run acceptance tests
6. Deploy to production

## 📝 Pull Request Process

### Before Submitting
1. **Test your changes**
   - Run the full test suite
   - Test in multiple browsers
   - Verify mobile responsiveness
   - Check accessibility

2. **Code Quality**
   - Run ESLint and fix issues
   - Format code with Prettier
   - Update documentation
   - Add tests for new features

3. **Documentation**
   - Update README if needed
   - Add JSDoc comments
   - Update API documentation
   - Include migration notes

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🐛 Bug Reports

### Before Reporting
1. Check existing issues
2. Verify the bug in latest version
3. Test in multiple environments
4. Gather relevant information

### Bug Report Template
```markdown
## Bug Description
Clear description of the issue

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 91]
- Node.js: [e.g., 18.17.0]
- Database: [e.g., PostgreSQL 14]

## Additional Context
Screenshots, logs, or other relevant information
```

## 💡 Feature Requests

### Feature Request Template
```markdown
## Feature Description
Clear description of the requested feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other approaches you've considered

## Additional Context
Mockups, examples, or related issues
```

## 📚 Resources

### Documentation
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com)

### Tools
- [VS Code](https://code.visualstudio.com)
- [Postman](https://www.postman.com) for API testing
- [DB Browser for SQLite](https://sqlitebrowser.org) for database inspection

## 🤝 Community

### Communication
- GitHub Issues for bug reports and feature requests
- GitHub Discussions for general questions
- Email: developers@chezmoii.be for private matters

### Code of Conduct
- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow project guidelines

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Annual contributor spotlight

## 📄 License

By contributing to chezmoii, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You

Your contributions help make chezmoii better for the Belgian culinary community. Thank you for your time and effort!
