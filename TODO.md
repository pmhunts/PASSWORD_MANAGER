# TODO: Update Password Manager API Routes and Server.js

## Completed

- [x] Update server.js: Change default MONGODB_URI to 'mongodb+srv://PASSWORD_MANAGER:Pm%4012345@cluster0.7djwocg.mongodb.net/securevault?retryWrites=true&w=majority', update CORS to include localhost:3000 and credentials, ensure all logic matches provided code.
- [x] Update api/users/register.js: Add username/password validation, add console.error logging, update CORS headers to include credentials.
- [x] Update api/users/login.js: Add username/password validation, add console.error logging, update CORS headers to include credentials.
- [x] Update api/passwords/index.js: Change auth error status from 500 to 401, update CORS headers to include credentials.
- [x] Update api/passwords/[id].js: Change auth error status from 500 to 401, update CORS headers to include credentials.

## Completed

- [x] Test API routes locally using server.js.
- [x] Deploy to Vercel and verify functionality.
- [x] Update TODO.md to mark tasks as completed.
