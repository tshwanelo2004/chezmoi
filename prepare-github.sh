#!/bin/bash

# GitHub Preparation Script for chezmoii
# This script prepares the project for GitHub repository

set -e

echo "🚀 Preparing chezmoii for GitHub..."

# Create necessary directories
mkdir -p .github/workflows
mkdir -p .github/ISSUE_TEMPLATE
mkdir -p .github/PULL_REQUEST_TEMPLATE

# Create GitHub Actions workflow
cat > .github/workflows/ci.yml << 'EOF'
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: chezmoii_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Type check
      run: npm run check
    
    - name: Build
      run: npm run build
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/chezmoii_test
        SESSION_SECRET: test-secret
        GOOGLE_CLIENT_ID: test-client-id
        GOOGLE_CLIENT_SECRET: test-client-secret
    
    - name: Test
      run: npm test
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/chezmoii_test
        SESSION_SECRET: test-secret
        GOOGLE_CLIENT_ID: test-client-id
        GOOGLE_CLIENT_SECRET: test-client-secret
EOF

# Create issue templates
cat > .github/ISSUE_TEMPLATE/bug_report.yml << 'EOF'
name: Bug Report
description: Create a report to help us improve
title: "[BUG]: "
labels: ["bug", "needs-triage"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug report!

  - type: textarea
    id: what-happened
    attributes:
      label: What happened?
      description: Also tell us, what did you expect to happen?
      placeholder: Tell us what you see!
    validations:
      required: true

  - type: textarea
    id: reproduce
    attributes:
      label: Steps to Reproduce
      description: Tell us how to reproduce this bug
      placeholder: |
        1. Go to '...'
        2. Click on '....'
        3. Scroll down to '....'
        4. See error
    validations:
      required: true

  - type: dropdown
    id: browsers
    attributes:
      label: What browsers are you seeing the problem on?
      multiple: true
      options:
        - Firefox
        - Chrome
        - Safari
        - Microsoft Edge
        - Mobile Safari
        - Mobile Chrome

  - type: textarea
    id: logs
    attributes:
      label: Relevant log output
      description: Please copy and paste any relevant log output. This will be automatically formatted into code, so no need for backticks.
      render: shell
EOF

cat > .github/ISSUE_TEMPLATE/feature_request.yml << 'EOF'
name: Feature Request
description: Suggest an idea for this project
title: "[FEATURE]: "
labels: ["enhancement", "needs-triage"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to suggest a new feature!

  - type: textarea
    id: problem
    attributes:
      label: Is your feature request related to a problem?
      description: A clear and concise description of what the problem is.
      placeholder: I'm always frustrated when...
    validations:
      required: true

  - type: textarea
    id: solution
    attributes:
      label: Describe the solution you'd like
      description: A clear and concise description of what you want to happen.
    validations:
      required: true

  - type: textarea
    id: alternatives
    attributes:
      label: Describe alternatives you've considered
      description: A clear and concise description of any alternative solutions or features you've considered.

  - type: textarea
    id: context
    attributes:
      label: Additional context
      description: Add any other context or screenshots about the feature request here.
EOF

# Create pull request template
cat > .github/PULL_REQUEST_TEMPLATE/pull_request_template.md << 'EOF'
## Description
Brief description of the changes in this PR.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] This change requires a documentation update

## Testing
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] I have tested this change manually in the browser
- [ ] I have tested this change on mobile devices

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] Any dependent changes have been merged and published

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Additional Notes
Any additional notes for reviewers.
EOF

echo "✅ GitHub Actions workflow created"
echo "✅ Issue templates created"
echo "✅ Pull request template created"

# Note: Some development files (.replit, replit.nix) are protected and cannot be removed
echo "📝 Development files noted for manual cleanup after cloning"

# Check if git is initialized
if [ ! -d .git ]; then
    echo "🔧 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: chezmoii platform"
    echo "✅ Git repository initialized"
else
    echo "📝 Git repository already exists"
fi

echo ""
echo "🎉 chezmoii is ready for GitHub!"
echo ""
echo "Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Add the remote origin:"
echo "   git remote add origin https://github.com/yourusername/chezmoii.git"
echo "3. Push to GitHub:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "📚 Documentation created:"
echo "   - README.md (comprehensive overview)"
echo "   - CONTRIBUTING.md (contribution guidelines)"
echo "   - CHANGELOG.md (version history)"
echo "   - API_DOCUMENTATION.md (API reference)"
echo "   - SECURITY.md (security policy)"
echo "   - DEPLOYMENT.md (deployment guide)"
echo "   - LICENSE (MIT license)"
echo "   - docs/FEATURES.md (feature overview)"
echo "   - docs/ARCHITECTURE.md (technical architecture)"
echo ""
echo "🔧 GitHub configuration:"
echo "   - .github/workflows/ci.yml (CI/CD pipeline)"
echo "   - .github/ISSUE_TEMPLATE/ (issue templates)"
echo "   - .github/PULL_REQUEST_TEMPLATE/ (PR template)"
echo ""
echo "Ready to go! 🚀"
EOF
