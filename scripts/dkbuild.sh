#!/bin/bash
GO_TO=$(dirname "$0")
cd $GO_TO

cd ../back-comp
sudo docker stop nodecompetencias
sudo docker rm nodecompetencias
sudo docker rmi iacs/nodecompetencias:latest
sudo docker rmi iacs/nodecompetencias:0.1.0

npm run build
mv .env .envDev && mv .envProd .env

sudo docker build -t registry.bigan.eu:5000/iacs/nodecompetencias:0.1.0 -t registry.bigan.eu:5000/iacs/nodecompetencias:devel .

sudo docker push registry.bigan.eu:5000/iacs/nodecompetencias:0.1.0
sudo docker push registry.bigan.eu:5000/iacs/nodecompetencias:devel
sudo docker rmi registry.bigan.eu:5000/iacs/nodecompetencias:0.1.0
sudo docker rmi registry.bigan.eu:5000/iacs/nodecompetencias:devel

mv .env .envProd && mv .envDev .env

