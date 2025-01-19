# Contributing Guide

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/crypto-portfolio`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`

## Development Workflow

1. Create a Supabase project and set up environment variables
2. Run the development server: `npm run dev`
3. Make your changes following our coding standards
4. Write/update tests as needed
5. Submit a pull request

## Coding Standards

- Use TypeScript for all new files
- Follow the existing project structure
- Write meaningful commit messages
- Add JSDoc comments for functions and components
- Use named exports instead of default exports
- Keep components small and focused
- Extract reusable logic into hooks

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Get approval from at least one maintainer
5. Squash commits before merging

## Branch Naming

- Features: `feature/description`
- Bugs: `fix/description`
- Documentation: `docs/description`
- Performance: `perf/description`

## Code Review Guidelines

- Review for security best practices
- Check for proper error handling
- Ensure code follows project structure
- Verify proper typing
- Look for potential performance issues