FROM public.ecr.aws/bitnami/node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
#COPY . ./src
RUN npm install
#RUN npm run build

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "node", "app.js" ]