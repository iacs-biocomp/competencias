#!/bin/bash

docker stop nodecompetencias; docker rm nodecompetencias
docker run -p 80:3000 -v /app/ngDist:/app/ngDist --name nodecompetencias -d nodecompetencias
