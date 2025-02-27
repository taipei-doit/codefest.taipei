#!/bin/bash

mkdir -p public
# Remove all files in the public directory
rm -rf public/*

# Run the build command
run-p type-check build-only

# Copy the built files to the public directory
mkdir -p public
cp -r dist/* public/

# Copy index.html to 404.html
cp public/index.html public/404.html
