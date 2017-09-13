#!/usr/bin/env bash

echo Deleting old npm packages
rm -rf node_modules

echo Installing new npm packages
npm install

echo Generating static assets
npm run build

echo Restarting nodejs server
pm2 restart staging.dlevs

echo Clearing nginx cache for this site
sudo rm -rf /data/nginx/cache/staging.dlevs.com
