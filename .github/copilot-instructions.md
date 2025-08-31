This is a TypeScript monorepo using packages structure.

The architecture is designed to be modular and extensible, accommodating new domains and functionality as they are developed.

## Code Patterns
- Use async/await pattern for database and service operations
- Export default for primary module functions and classes
- Export named for types and interfaces
- Use MongoDB collections with typed interfaces
- Implement migrations with `up` methods
- Follow the service pattern for authentication implementations
- Maintain separation of concerns between modules and components
- Keep component responsibilities focused and single-purpose

## Architecture Principles
- Avoid coupling between packages and modules
- Design services with clear boundaries and responsibilities
- Create small, focused components rather than monolithic ones
- Consider security implications in all data handling operations
- Optimize for performance, especially database queries and frontend rendering

## Documentation Standards
- Add comments for functions, classes, and interfaces
- Include purpose descriptions for complex logic
- Document parameters and return types
- Explain non-obvious implementations and business logic
- Add comments for magic numbers and complex algorithms

## React Best Practices
- Keep component complexity low (prefer composition over large components)
- Use hooks appropriately and avoid excessive state
- Implement proper memoization for expensive operations
- Extract business logic from UI components
- Consider accessibility in all UI implementations

## Database Patterns
- Use MongoDB indexing for performance
- Use ObjectId for document identifiers
- Write database migrations for any schema changes
- Version document structures appropriately
- Consider indexing implications for query patterns
