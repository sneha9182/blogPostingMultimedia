FROM node:alpine

WORKDIR /app

# Copy package files from my_app directory
COPY my_blog/package*.json ./

RUN npm install

# Copy the rest of the application code from my_app
COPY my_blog ./

EXPOSE 3000

CMD ["npm", "start"]