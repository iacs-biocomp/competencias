#!/bin/bash
GO_TO=$(dirname "$0")
cd $GO_TO

echo $(tput setaf 2)"Desplegando en local"$(tput sgr0)
cd ../backend
docker stop nodecompetencias; docker rm nodecompetencias
docker run -p 80:3000 -v /app/ngDist:/app/ngDist --name nodecompetencias -d nodecompetencias
echo $(tput setaf 2)"Desplegado"$(tput sgr0)

