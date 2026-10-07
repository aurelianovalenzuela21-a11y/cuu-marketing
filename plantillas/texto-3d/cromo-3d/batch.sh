#!/bin/bash
# uso: batch.sh "slug|Texto|Con|Renglones" ...
W=/tmp/claude-0/-home-user-cuu-marketing/c6cac766-4a36-5467-9871-eead52dac80c/scratchpad
OUT=/home/user/cuu-marketing/plantillas/videos-agrupaciones/video/grupos
mkdir -p $OUT
for item in "$@"; do
  slug="${item%%=*}"; txt="${item#*=}"
  q="texto=$(python3 -c 'import sys,urllib.parse;print(urllib.parse.quote(sys.argv[1]))' "$txt")&metal=plata&fondo=transparente${EXTRA}"
  rm -rf $W/t3/g_$slug && mkdir -p $W/t3/g_$slug
  node $W/t3/render.js "$(npm root -g)" "$q" $W/t3/g_$slug full 2>&1 | grep -v toNonIndexed
  ffmpeg -y -loglevel error -framerate 30 -i $W/frames_libre/f%04d.png -framerate 30 -i $W/t3/g_$slug/f%04d.png \
    -filter_complex "[0][1]overlay=0:0:format=auto,format=yuv420p" -c:v libx264 -preset slow -crf 16 -movflags +faststart $OUT/$slug.mp4
  echo "listo $slug $(ls $W/t3/g_$slug | wc -l)"
done
