# pull the base image
FROM node:14.4.0

# set the working direction
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./

# add app
COPY . ./

RUN npm install

RUN npm run build

# start app
CMD ["npm", "start"]
