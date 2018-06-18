# dlevs.com

This is the repo for my personal portfolio site, [dlevs.com](https://dlevs.com). It is a [Node.js](https://nodejs.org/) app built using [the Koa framework](https://www.npmjs.com/package/koa).

## First time setup

1. Install the Node.js version specified by [package.json](./package.json)'s `engine` property.
2. Install ffmpeg:
    - MacOS: `brew install ffmpeg --with-libvpx --with-libvorbis`
    - Linux: `sudo apt-get install ffmpeg`

   This is used by build scripts to compress videos.
3. Copy all media files not committed to this repository to `/publicSrc/processUncommitted`. This directory is for images, videos, etc, and is gitignored from repository due to file size.
4. In the terminal, run:
    ```bash
    npm install                             # Install dependencies
    npm run build                           # Compile static assets (JS, CSS, image compression)
    cp config.sample.js config.js           # Create own config. Edit for environment.
    npm start                               # Start the app on port specified in config.js
    ```

### Other commands

| Command | Description |
| --- | --- |
| `npm start` | Run the app in production mode. |
| `npm run dev` | Run the app in development mode. Server restarts when assets change. |
| `npm run clean` | Remove files generated by the build. |
| `npm run build` | Compile static assets and compress images. |
| `npm run lint` | Lint files. Runs automatically on commit. |
| `npm run addtravelblogimages` | Add boilerplate JSON for new images to the travelPosts JSON file. Example `npm run addtravelblogimages -- ./publicSrc/processUncommitted/media/travel/japan/*` |

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

### Media

| Directory | Comments |
| --- | --- |
| `/publicSrc/process` | Files that are processed by build scripts, the output of which goes into the `/public` directory to be served as static content. |
| `/publicSrc/processUncommitted` | The same as `/publicSrc/process`, but for large images and videos that are excluded from this repository due to file size. |

For every file processed, an object with metadata about that file is appended to `/data/generated/media.json`. The objects contain:

- File paths of each of the output files (for example, a large version and a small version of an image)
- Image/ video width
- Image/ video height
- Geolocation data
- etc

The information stored in this JSON is used by pug mixins to automatically populate multiple `<source>` elements for `<picture>` and `<video>`.

Pug mixins will also apply padding based on [the padding-bottom hack](http://andyshora.com/css-image-container-padding-hack.html) to prevent page flicker due to reflow, and will apply lazy-load attributes where necessary.

Files in the above directories are processed as follows:

#### Images

During the build,

- SVGs get compressed via [svgo](https://www.npmjs.com/package/svgo).
- PNGs and JPGs get resized and compressed by [sharp](https://www.npmjs.com/package/sharp), and their metadata extracted.

For the PNGs and JPGs, multiple image files are outputted per source file. These have varying sizes and formats so that the most relevant may be used in a particular view.

#### Video

MP4 files are compressed using [fluent-ffmpeg](https://www.npmjs.com/package/fluent-ffmpeg), and outputted as a smaller MP4 file, and a WEBM file.

TODO: Video streaming with the current code does not work in Safari. It probably should not be handled by the same app that serves the HTML.

### Frontend source files

| Directory | Comments |
| --- | --- |
| `/scripts` | Frontend scripts |
| `/styles` | Frontend styles (PostCSS) |

The scripts and styles in these directories are bundled into a single file for JS and another for CSS. They are used only on the client.

### Static files

| Directory | Comments |
| --- | --- |
| `/publicSrc/copy` | Static files to serve from site root. These get copied to `/public` by build scripts. |
| `/public` | Static files to serve from site root that are generated by build. |

### Build scripts

| Directory | Comments |
| --- | --- |
| `/build` | Scripts for compiling assets/ images |

All build scripts are initiated from `package.json`.

## Testing

### Overview

| Command | Description |
| --- | --- |
| `npm test` | Run unit tests. Includes all files ending with `.test.js`. |
| `npm run test:browser` | Run tests against a server. Includes all files ending with `.browsertest.js`. Needs some environment variables to be defined. |

### Browser tests

Some variables need to be passed to `npm run test:browser`:

| Command | Description |
| --- | --- |
| `env TEST_HOSTNAME=localhost:3000 npm run test:browser` | Run tests against localhost. |
| `env TEST_HOSTNAME=staging.dlevs.com TEST_USERNAME=foo TEST_PASSWORD=bar npm run test:browser` | Run  tests against staging. |
| `env TEST_HOSTNAME=dlevs.com npm run test:browser` | Run tests against production. |
| `env TEST_HOSTNAME=dlevs.com npm run test:browser -- sitemap` | Runs only tests with "sitemap" in the filename. |
| `env TEST_HOSTNAME=dlevs.com npm run test:browser -- --updateSnapshot` | Runs tests and updates the screenshots in `/tests/imageSnapshots/<HOSTNAME>`. Manually check these to ensure rendering is correct. All subsequent usages of `npm run test:browser` will compare the current UI to these screenshots, until running again with the `--updateSnapshot` flag. This can highlight UI regression. |
