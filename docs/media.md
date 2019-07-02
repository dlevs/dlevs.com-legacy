# Media

Build scripts process media files in `/publicSrc/process`. For every file processed, an object with
metadata about that file is appended to `/data/generated/media.json`. The
objects contain information like:

- File paths of each of the output files (for example, a large version and a small version of an image)
- Image/video width
- Image/video height
- Geolocation data

The information stored in this JSON is used by pug mixins to automatically populate multiple `<source>` elements for `<picture>` and `<video>`.

Pug mixins will also apply padding based on [the padding-bottom hack](http://andyshora.com/css-image-container-padding-hack.html) to prevent page flicker due to reflow, and will apply lazy-load attributes where necessary.

Processing depends on the source file type:

## Vector images

SVGs get compressed via [svgo](https://www.npmjs.com/package/svgo).


## Raster images

PNGs and JPGs get resized and compressed by [sharp](https://www.npmjs.com/package/sharp), and their metadata extracted. Multiple sizes/formats are outputted per source file.

## Video

MP4 files are compressed using [fluent-ffmpeg](https://www.npmjs.com/package/fluent-ffmpeg), and outputted as a smaller MP4 file, and a WEBM file.

TODO: Video streaming with the current code does not work in Safari. It probably should not be handled by the same app that serves the HTML.

[back](../README.md)
