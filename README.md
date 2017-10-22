# The Upload form
This repository contains the source code for the upload form web application.
The application has been developed to solve a one of my own problems and
is supposed to be used to provide a drop only upload form to collect files.
The files can only be retrieved manually from the server.

# Docker image
I've added a docker image to package the application with all the necessary
dependencies in one single container.
The docker image is built with the following command:

`` docker build . -t softbrix/upload_app ``

After a successful build can you use then the provided docker-compose.yml to spin up the instance.

`` docker-compose up -d ``

# Config
The application needs a config_server.json file with information regarding the
upload folders.
The default folder will be ./data/ but can be change to anything else.
The application also needs a config_client.js file. This can be altered to update
 the language or the descriptions in the application.

# Recaptcha
I strongly suggest you to add the necessary configuration for the recaptcha to work.
Especially if this application is used in an internet facing environment. You need to
register the domain at: https://www.google.com/recaptcha/admin
If you start the server without configuring recaptcha, then you need to provide a
force (-f) flag to the command line.
