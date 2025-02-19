# use node base image. 
FROM node:22

# add app source code to image. cd into directory. set the working directory inside the container.
WORKDIR /app

# copy package files
COPY package*.json /app/

# shell form: install dependencies
RUN npm install

# copy over source code
COPY . /app/

# access app publicly
ENV PORT=3000

EXPOSE 3000

# exec form to run app
CMD ["npm","start"]