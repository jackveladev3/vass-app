# SmartClass Project

This is SmartClass Project developed using Vue.js.

## Application setup

1. Install the latest version of NodeJS and npm. You can download both at <https://nodejs.org/en/download/>.
2. Clone the application repository.
3. Navigate to the root folder of the application in the command line.
4. Update .env.development for development
5. Update .env.production for production
6. Update package.json scripts with aws deployment data
7. Type `npm install` to install required npm packages.
8. Type `npm run serve` to start a development server.
9. The application opens in your browser at <http://localhost:8080>.

## .env file

1. Update AWS config details from AWS account
2. Update VUE_APP_INVOKE_URL for API endpoint (Development Endpoint in .env.development file and Production Endpoint in .env.production file)
3. Update VUE_APP_DOMAIN for application URL (Development URL in .env.development file and Production URL in .env.production file)
4. Update VUE_APP_ENTERPRISE_ID with Enterprise ID from Database. 


## Deployment Build

### Dev
``` bash
# build for development
npm run deploy_dev
```

### Prod
``` bash
# build for production with minification
npm run deploy_prod
```
