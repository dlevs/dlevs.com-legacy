#!/usr/bin/env bash

rm -rf node_modules
npm install
npm run build
pm2 restart staging.dlevs
sudo rm -rf /data/nginx/cache/staging.dlevs
