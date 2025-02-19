# use node base image. LAYER 1
FROM node:22

# add app source code to image. cd into directory. LAYER 2. set the working directory inside the container.
WORKDIR /app

# copy package files
COPY package*.json /app/

# shell form: install dependencies
RUN npm install

# copy over source code
COPY . /app/

# access app publicly
ENV PORT=5173

EXPOSE 5173

# exec form to run app
CMD ["npm","run","dev"]
# CMD ["npm","start"]
# CMD ["vite", "serve", "--port", "8080"]


# docker build -t anaGianno/spotifyprofile:1.0 .

# port forwarding local:container
# docker run -p 5173:8080 sha256:1558168b3c67e7ff2ba008e51c0a5668eedd690245036df655b809bde9a327be

# volumes: dedicated folder inside the host machine, creates files for other containers
# docker volume create shared-stuff