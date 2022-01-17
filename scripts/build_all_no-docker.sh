#!/bin/bash
GO_TO=$(dirname "$0")
cd $GO_TO

function build_front {
    cd ../FrontComp/;
    npm i;
    npm run build:prod
}
function build_back {
    cd ../back-comp/
    npm i;
    npm run build:prod
}

build_front &
build_back &
wait
