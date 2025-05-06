FROM node:22

# Set the working directory inside the container
WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application
COPY . .

# Expose the application port
EXPOSE 8000

# Set environment variables
ENV MONGO_URI=mongodb://mongo:27017/itineraryDB

# Start the Express server
CMD ["npm", "start"]
