# First time setup

TODO: Make this all encapsulated with docker

1. Install the [Git Large File Storage (LFS)](https://git-lfs.github.com/) extension.
2. Install the Node.js version specified by [package.json](./package.json)'s `engine` property.
3. Install ffmpeg:
    - MacOS: `brew install ffmpeg --with-libvpx --with-libvorbis`
    - Linux: `sudo apt-get install ffmpeg`

   This is used by build scripts to compress videos.
4. In the terminal, run:

    ```bash
    cp config/config.sample.js config/config.js # Create own config. Edit for environment.
    npm install                                 # Install dependencies
    npm run build                               # Compile static assets (JS, CSS, image compression)
    npm start                                   # Start the app on port specified in config.js
    ```

[back](../README.md)
