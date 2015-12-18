FROM node:4.2.3

# Copy Source
COPY . /usr/src/app

# Install packages
WORKDIR /usr/src/app
RUN npm install

# Expose port 3000 to host
EXPOSE 3000

# Start server
CMD ["npm", "start"]
