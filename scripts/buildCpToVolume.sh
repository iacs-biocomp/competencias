#!/bin/bash
GO_TO=$(dirname "$0")
cd $GO_TO

cd ../FrontComp
npm run build:prod
cp -r dist/FrontComp/. /app/ngDist
