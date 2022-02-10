#!/bin/bash
GO_TO=$(dirname "$0")
cd $GO_TO

# First change this path to the directory where pgdata will be saved
YOUR_DB_VOLUME_PATH=~/dkVolumes/pgcompetences
# Database password
DB_PASSWORD=secretpassxd

echo "$(tput setaf 3)"Volume directory used: $YOUR_DB_VOLUME_PATH, password: $DB_PASSWORD"$(tput sgr0)"

docker run -d --rm --name pgcompetences -e POSTGRES_PASSWORD=$DB_PASSWORD \
-p 5432:5432 \
-e PGDATA=/var/lib/postgresql/data/pgdata \
-v $YOUR_DB_VOLUME_PATH:/var/lib/postgresql/data \
postgres:alpine  &

wait

echo "$(tput setaf 2)"Container created and running"$(tput sgr0)"
echo "$(tput setaf 2)"Executing all migrations"$(tput sgr0)"

cd ../backend/ && npm run migration:run

# TODO: add file.sql from pgdump that inserts Default Roles and Admin user.
