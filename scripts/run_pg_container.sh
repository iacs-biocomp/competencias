#!/bin/bash
GO_TO=$(dirname "$0")
cd $GO_TO

# First change this path to the directory where pgdata will be saved
YOUR_DB_VOLUME_PATH=~/dkVolumes/pgcompetences

docker run -d --name pgcompetences -e POSTGRES_PASSWORD=secretpassxd \
-p 5432:5432 \
-e PGDATA=/var/lib/postgresql/data/pgdata \
-v $YOUR_DB_VOLUME_PATH:/var/lib/postgresql/data \
postgres:alpine

sleep 5

cd ../back-comp/ && npm run migration:run
