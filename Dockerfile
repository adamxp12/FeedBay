FROM node:18

WORKDIR /app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm ci --only=production
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

ENV PORT=3000
ENV HOST="0.0.0.0"
EXPOSE $PORT
CMD [ "node", "server.js" ]
