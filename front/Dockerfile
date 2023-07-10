# Start from the official Node.js LTS base image
FROM node:18.16.1-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the rest of the code
COPY . /app/

# Install dependencies, npm ci로 설치하면 package-lock.json을 참조.
RUN npm ci

# Build the app
RUN npm run build

# Expose port 3000
EXPOSE 3000

# # Start the app
# CMD ["npm", "start"]