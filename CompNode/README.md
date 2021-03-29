# NodeCompetencias

## Como generar la imagen para desplegar

```bash
cd back-comp
./dkbuild
# Cuando este la imagen correr este comando para desplegarlo, en el volumen ha de estar la carpeta del compilado de angular
docker run --restart=always \
-p 80:3000 -v /app/ngDist:/app/ngDist --name nodecompetencias -d nodecompetencias
```

## ORM

La documentación de [typeORM](https://orkhan.gitbook.io/typeorm/docs)

## Installation

```bash
$ npm i #Instala las dependencias del proyecto (tener node instalado)
```

## Correr la aplicación:
