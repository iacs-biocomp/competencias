#!/bin/bash
cd ../
docker stop nodecompetencias
docker rm nodecompetencias
docker rmi iacs/nodecompetencias:devel


# mv .dockerignore .dockerignoreNormal && mv .dockerignoreMs .dockerignore

docker build \
-t registry.bigan.eu:5000/iacs/nodecompetencias:0.1.0 \
-t registry.bigan.eu:5000/iacs/nodecompetencias:devel -f dockerfile.stages .

# sudo docker build -t registry.bigan.eu:5000/iacs/nodecompetencias:0.1.0 -t registry.bigan.eu:5000/iacs/nodecompetencias:devel .

docker push registry.bigan.eu:5000/iacs/nodecompetencias:0.1.0
docker push registry.bigan.eu:5000/iacs/nodecompetencias:devel
docker tag registry.bigan.eu:5000/iacs/nodecompetencias:devel iacs/nodecompetencias:devel
docker rmi registry.bigan.eu:5000/iacs/nodecompetencias:0.1.0
docker rmi registry.bigan.eu:5000/iacs/nodecompetencias:devel

# mv .dockerignore .dockerignoreMs && mv .dockerignoreNormal .dockerignore

docker run --name=nodecompetencias --link=pg-competencias -d iacs/nodecompetencias:devel
