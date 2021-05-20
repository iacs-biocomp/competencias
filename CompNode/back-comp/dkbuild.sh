npm run build
mv .env .envDev && mv .envProd .env
sudo docker build -t nodecompetencias .
mv .env .envProd && mv .envDev .env

