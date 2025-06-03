# Mortgage Payment Calculator

A comprehensive mortgage calculator web application built with React, TypeScript, and Tailwind CSS.

## Features

- Calculate mortgage payments based on property price, down payment, interest rate, and loan term
- Automatically fetch current mortgage interest rates based on credit score
- Get accurate property tax rates for any U.S. location
- View amortization schedule and payment breakdown
- Responsive design works on desktop and mobile devices
- Enhanced security with input validation and sanitization
- Secure API key management with client-side encryption

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Security Features

### Input Validation & Sanitization
- All user inputs are validated and sanitized to prevent XSS attacks
- Secure API key storage in browser's local storage
- Rate limiting for API calls
- Address validation for property tax lookups

### Security Headers
This application implements the following security headers:
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- Strict-Transport-Security

### Fallback Mechanisms
- The application works even without an API key using built-in fallback data
- All calculations can be performed offline without external dependencies

## Deployment

### Deploying to Vercel
The application is configured for seamless deployment to Vercel:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Use the following settings:
   - Framework Preset: Vite
   - Build Command: npm run build
   - Output Directory: dist
4. Deploy!

## API Integration

### Property Tax API

This application uses the [API Ninjas Property Tax API](https://api-ninjas.com/api/propertytax) to fetch accurate property tax rates. To enable this feature:

1. Sign up for an API key at [API Ninjas](https://api-ninjas.com/)
2. In the application interface, click "API Settings" in the Property Location section
3. Enter your API key in the secure modal
4. The key will be securely stored in your browser's local storage

Users can choose to add their own API key or use the built-in fallback data.

### Interest Rate Data

The application uses simulated current mortgage interest rates based on credit score and loan term. In a production environment, you could replace this with a real mortgage rate API.

## Building for Production

To build the application for production:

```bash
npm run build
```

The build files will be in the `dist` folder and can be deployed to any static hosting service.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
