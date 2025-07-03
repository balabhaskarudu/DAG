# Contributing to Production DAG Editor

Thank you for your interest in contributing to the Production DAG Editor! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git

### Setting Up Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/production-dag-editor.git
   cd production-dag-editor
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🎯 How to Contribute

### Reporting Bugs

1. **Check existing issues** to avoid duplicates
2. **Use the bug report template** when creating new issues
3. **Provide detailed information**:
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and OS information
   - Screenshots if applicable

### Suggesting Features

1. **Check existing feature requests** first
2. **Use the feature request template**
3. **Explain the use case** and benefits
4. **Consider implementation complexity**

### Code Contributions

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Add tests** for new functionality

4. **Run the test suite**:
   ```bash
   npm test
   npm run lint
   npm run format:check
   ```

5. **Commit your changes** with a clear message:
   ```bash
   git commit -m "feat: add new node validation feature"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request** with a clear description

## 📝 Coding Standards

### TypeScript Guidelines

- Use strict TypeScript configuration
- Define interfaces for all props and data structures
- Avoid `any` type - use proper typing
- Use meaningful variable and function names

### React Best Practices

- Use functional components with hooks
- Implement proper error boundaries
- Follow React naming conventions
- Use React.memo() for performance optimization when needed

### Code Style

- Follow the existing ESLint and Prettier configuration
- Use meaningful commit messages (conventional commits)
- Write self-documenting code with clear variable names
- Add comments for complex logic

### Testing Requirements

- Write unit tests for new components and utilities
- Maintain test coverage above 80%
- Use React Testing Library for component tests
- Mock external dependencies appropriately

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── __tests__/          # Test files
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

### Component Guidelines

- Keep components focused and single-purpose
- Use TypeScript interfaces for props
- Implement proper error handling
- Add accessibility attributes
- Include JSDoc comments for complex components

### Utility Functions

- Write pure functions when possible
- Add comprehensive unit tests
- Use descriptive function names
- Handle edge cases gracefully

## 🧪 Testing Guidelines

### Unit Tests

- Test component rendering and behavior
- Test user interactions
- Test edge cases and error conditions
- Use descriptive test names

### Integration Tests

- Test component interactions
- Test data flow between components
- Test API integrations

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📋 Pull Request Process

### Before Submitting

1. **Ensure all tests pass**
2. **Run linting and formatting**
3. **Update documentation** if needed
4. **Add/update tests** for new features
5. **Check for breaking changes**

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] All tests pass

## Screenshots
(if applicable)

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

### Review Process

1. **Automated checks** must pass (CI/CD pipeline)
2. **Code review** by maintainers
3. **Testing** in different environments
4. **Approval** and merge

## 🎨 Design Guidelines

### UI/UX Principles

- Follow existing design patterns
- Ensure accessibility compliance
- Use consistent spacing and colors
- Implement responsive design
- Add smooth animations and transitions

### Accessibility

- Use semantic HTML elements
- Add proper ARIA labels
- Ensure keyboard navigation
- Maintain color contrast ratios
- Test with screen readers

## 🚀 Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Workflow

1. **Feature freeze** for release candidates
2. **Testing** and bug fixes
3. **Documentation** updates
4. **Version bump** and changelog
5. **Release** and deployment

## 📞 Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Code Reviews**: Feedback on pull requests

### Maintainer Response Times

- **Issues**: Within 48 hours
- **Pull Requests**: Within 72 hours
- **Security Issues**: Within 24 hours

## 🏆 Recognition

Contributors are recognized in:
- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub contributors** page

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the Production DAG Editor! Your efforts help make this project better for everyone. 🎉