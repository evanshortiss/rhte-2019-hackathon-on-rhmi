FROM node:10-slim

COPY package*.json ./

RUN npm install

COPY . .

# Remove our "devDependencies" since they're required for build, but not runtime
RUN npm prune --production

# We don't expose anything from the generator, but maybe in the future
# EXPOSE 8080

CMD [ "npm", "start" ]
