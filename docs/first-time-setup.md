# First time setup

1. Install the Node.js version specified by [package.json](./package.json)'s `engine` property.
2. Install ffmpeg:
    - MacOS: `brew install ffmpeg --with-libvpx --with-libvorbis`
    - Linux: `sudo apt-get install ffmpeg`

   This is used by build scripts to compress videos.
3. Copy all media files not committed to this repository to `/publicSrc/processUncommitted`. This directory is for images, videos, etc, and is gitignored from repository due to file size.
4. In the terminal, run:
    ```bash
    cp config.sample.js config.js           # Create own config. Edit for environment.
    npm install                             # Install dependencies
    npm run build                           # Compile static assets (JS, CSS, image compression)
    npm start                               # Start the app on port specified in config.js
    ```

[back](../README.md)
