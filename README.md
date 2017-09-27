## Overview
This is the repo for my personal portfolio site, [dlevs.com](https://dlevs.com). It is a [Node.js](https://nodejs.org/) app built using [the Koa framework](https://www.npmjs.com/package/koa).

The app is daemonised by [pm2](https://www.npmjs.com/package/pm2), and sits behind an [nginx](https://www.nginx.com/) reverse proxy which caches all requests. [instantclick](https://www.npmjs.com/package/instantclick) is used on the frontend to make things a little snappier for desktop users.

## Directory structure

### Core app files

| Directory | Comments |
| --- | --- |
| `/routes` | Routes and controllers |
| `/views` | Templates (Pug) |
| `/lib` | Utility functions |

### Data

| Directory | Comments |
| --- | --- |
| `/data` | JSON files written by hand |
| `/data/generated` | JSON files generated by build scripts |

The site does not make use of any databases. Data to populate templates is stored in JSON files.

### Images

| Directory | Comments |
| --- | --- |
| `/images` | Images organised into directories |
| `/images/travel` | Travel images gitignored from repository due to filesize |

All images sit in the `/images` directory. They are copied by build tasks to `/public-dist/images`.

During the process:
- SVGs get compressed via [svgo](https://www.npmjs.com/package/svgo).
- PNGs and JPGs get resized and compressed by [sharp](https://www.npmjs.com/package/sharp), and their metadata extracted.

For the PNGs and JPGs, multiple image files are outputted per source file. These have varying sizes and formats so that the most relevant may be used in a particular view.

Also, meta from each image is appended to a JSON file, containing:
- File paths of each of the output files
- Width
- Height
- Geolocation

The information stored in the JSON is used by pug mixins to serve the best-suited image. For example, Chrome users will see WEBP images, while other users will see JPG. Pug mixins will also apply padding based on [the padding-bottom hack](http://andyshora.com/css-image-container-padding-hack.html) to prevent page flicker due to reflow, and will apply lazy-load attributes where necessary.

### Frontend source files

| Directory | Comments |
| --- | --- |
| `/scripts` | Frontend scripts |
| `/styles` | Frontend styles (PostCSS) |

The scripts and styles in these directories are bundled into a single file for JS and another for CSS. They are used only on the client.

### Static files

| Directory | Comments |
| --- | --- |
| `/public` | Static files to serve from site root |
| `/public-dist` | Static files to serve from site root that are generated by build |


## Build tasks
The direcories `/data/generated` and `/public-dist` may optionally be deleted before a build, via `npm run clean`.

Their contents are generated by running `npm run build`. Running `npm run clean` before a build will make it take significantly longer, as it must reprocess the images.

## Deployment
The following aren't specific to this repository. But this is a handy place for me to keep this for my reference. Some of this setup is overkill for the project, but it's been a great learning opportunity.

### Staging
Changes can be pushed directly to the repository at `/var/repo/dlevs.com.git`. A build and cache flush will be triggered for [staging.dlevs.com](https://staging.dlevs.com).

### Production
Deploy from staging to production with the following:
```
rm -rf /var/www/backup.dlevs.com/*
mv /var/www/dlevs.com/* /var/www/backup.dlevs.com
cp -R /var/www/staging.dlevs.com/* /var/www/dlevs.com
cp /var/www/backup.dlevs.com/config.json /var/www/dlevs.com/config.json 
pm2 restart prod.dlevs
sudo rm -rf /data/nginx/cache/dlevs.com/*
```

### Useful commands
```
# Run staging
pm2 start /var/www/staging.dlevs.com/index.js --name staging.dlevs

# Run prod
pm2 start /var/www/dlevs.com/index.js --name prod.dlevs

# Restart staging
pm2 restart staging.dlevs

# Restart prod
pm2 restart prod.dlevs

# Clear cache staging
sudo rm -rf /data/nginx/cache/staging.dlevs.com/*

# Clear cache prod
sudo rm -rf /data/nginx/cache/dlevs.com/*
```
