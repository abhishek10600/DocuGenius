# Use the official Node.js LTS image
FROM node:lts

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the project files
COPY . .

# Expose the port
EXPOSE 5173

CMD ["npm", "run", "dev"]