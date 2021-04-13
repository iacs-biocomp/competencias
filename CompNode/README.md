# NodeCompetencias

## Como generar la imagen para desplegar

```bash
# No es necesario instalar dependencias para generar el contenedor, para compilar angular si
# Estando posicionado en la carpeta CompNode:
cd back-comp && \
./dkbuild.sh \
cd ..
# Cuando este la imagen correr este comando para desplegarlo, en el volumen ha de estar la carpeta del compilado de angular
# Crear la carpeta primero para que el owner no sea root sino el usuario 
mkdir /app/ngDist

docker run --restart=always \
-p 80:3000 -v /app/ngDist:/app/ngDist --name nodecompetencias -d nodecompetencias

# Para compilar angular y moverlo a la carpeta /app/ngDist esta un script dentro de FrontComp
# Recordatorio, es necesario tener las dependencias (@angular/core y @angular/compiler) para compilarlo sino da error, instalar con el comando:
npm i
# O si se usa yarn
yarn install
# Luego ir a la carpeta y compilar
cd FrontComp && ./buildCpToVolume.sh; cd ..
```

## ORM

La documentación de [typeORM](https://orkhan.gitbook.io/typeorm/docs)

## Installation

```bash
#Instala las dependencias del proyecto (tener node instalado)
npm i
# O si usas yarn:
yarn install
```

## Correr la aplicación:

Para lanzar la aplicación mientras se desarrolla:

```bash
# En la carpeta del Frontend
ng serve
# En la del backend
nest start --watch
```

## Depurar la aplicación:

Si se quiere depurar el backend hay que lanzar este en modo debug

```bash
nest start --watch --debug
```

Luego enlazar el debugger a este proceso, para vscode crear una configuración en la carpeta .vscode con nombre launch.json

```json
"configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}/FrontComp"
    },
    {
      "name": "Attach",
      "port": 9229,
      "request": "attach",
      "skipFiles": ["<node_internals>/**"],
      "type": "pwa-node"
    }
  ]
```
