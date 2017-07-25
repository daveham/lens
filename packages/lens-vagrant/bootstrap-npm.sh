#!/usr/bin/env bash

echo "Installing global npm packages as current user"

whoami
node --version
npm --version
npm config get prefix

npm install -g yarn
npm install -g gulp
npm install -g nodemon
npm install -g mocha

npm install -g webpack
npm install -g redis-commander
npm install -g lerna
npm install -g create-react-app

echo "Finished installing global npm packages"
