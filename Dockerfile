# Use Node.js 18 Alpine as the base image
FROM node:18-alpine

# Install curl for the healthcheck required by the challenge
RUN apk --no-cache add curl

# Set the working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application (Vite creates the 'dist' folder)
RUN npm run build

# Install 'serve' to run the static site
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Start the application on port 3000
CMD [ "serve", "-s", "dist", "-l", "3000" ]