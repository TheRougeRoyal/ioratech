# Security Policy

## Reporting Vulnerabilities
Please report security vulnerabilities to security@ioratech.com.

## Security Features
- **Input Validation**: All API endpoints are validated using Zod.
- **Rate Limiting**: IP-based and endpoint-specific rate limits.
- **Security Headers**: Strict CSP, X-Content-Type-Options, and HSTS configured.
- **API Key Security**: API keys are hashed using SHA-256 and stored as hashes.
- **Auth**: Integrated with Firebase Auth for secure session management.
