# Security Policy

## Reporting Security Issues

Please do not open a public issue for vulnerabilities or exposed credentials. Contact the maintainer directly through the email listed on the GitHub profile, or open a private security advisory if available.

## Sensitive Data

Do not commit:

- Clerk API keys or webhook secrets
- JWT signing keys
- Hugging Face tokens
- `.env` files
- Generated SQLite databases with user IDs or challenge history
- Model artifacts or provider response logs containing user data

Use the provided `.env.example` files for documentation only.
