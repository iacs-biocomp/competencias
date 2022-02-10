#!/bin/bash
GO_TO=$(dirname "$0")
cd $GO_TO

function build_front {
    cd ../frontend/;
    npm i;
    npm run build:prod
}
function build_back {
    cd ../backend/
    npm i;
    npm run build:prod
}

build_front &
build_back &
wait
