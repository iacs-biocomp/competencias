#!/bin/bash
cd ../
sudo docker stop nodecompetencias
sudo docker rm nodecompetencias
sudo docker rmi iacs/nodecompetencias:latest
sudo docker rmi iacs/nodecompetencias:0.1.0

# mv .dockerignore .dockerignoreNormal && mv .dockerignoreMs .dockerignore

sudo docker build \
-t registry.bigan.eu:5000/iacs/nodecompetencias:0.1.0 \
-t registry.bigan.eu:5000/iacs/nodecompetencias:devel -f dockerfile.stages .

# sudo docker build -t registry.bigan.eu:5000/iacs/nodecompetencias:0.1.0 -t registry.bigan.eu:5000/iacs/nodecompetencias:devel .

# sudo docker push registry.bigan.eu:5000/iacs/nodecompetencias:0.1.0
# sudo docker push registry.bigan.eu:5000/iacs/nodecompetencias:devel
# sudo docker rmi registry.bigan.eu:5000/iacs/nodecompetencias:0.1.0
# sudo docker rmi registry.bigan.eu:5000/iacs/nodecompetencias:devel

# mv .dockerignore .dockerignoreMs && mv .dockerignoreNormal .dockerignore


