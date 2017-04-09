# The Upload form
This repository contains the source code for the upload form web application.
The application has been developed to solve a one of my own problems and
is supposed to be used to provide a drop only upload form to collect files.
The files can only be retrieved manually from the server.

# Docker image
I've added a docker image to package the application with all the necessary
dependencies in one single container.
The docker image is built with the following command:

`` docker build . -t softbrix/shatabang ``

Please use the provided docker-compose.yml to spin up the instance. This will also
start the required redis server which will be used by the task processor.

`` docker-compose up -d ``

# Config
The application needs a config_server.json file with information regarding the
upload folders.
The default folder will be data but can be change to anything else.
