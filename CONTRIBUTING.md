# Contributing Guide

La dependencia esencial es node y su package manager por defecto (npm) aunque puedes usar yarn si lo prefieres.

Para instalar node y npm en debian, ubuntu, mint...

```bash
sudo apt-get update
sudo apt-get install nodejs npm
```

Si se quiere otro manejador de paquetes como pnpm o yarn:

```bash
npm i -g yarn
npm i -g pnpm
# Con pnpm hay que configurar un par de cosas:
pnpm config set shamefully-hoist=true
# Asi la estructura de los node_modules sigue siengo igual que la de npm
```

## Como generar la imagen para desplegar

```bash
# Estando posicionado en la carpeta raiz del proyecto:
cd back-comp && \
npm i ;\
sudo ./dkbuild.sh ;\
cd ..
# Crear la carpeta primero para que el owner no sea root sino el usuario
mkdir /app/ngDist
# Cuando este la imagen y la carpeta correr este comando para desplegarlo, en el volumen ha de estar la carpeta del compilado de angular
sudo docker run --restart=always \
-p 80:3000 -v /app/ngDist:/app/ngDist --name nodecompetencias -d nodecompetencias

# Para compilar angular y moverlo a la carpeta /app/ngDist esta un script dentro de FrontComp
# Recordatorio, es necesario tener las dependencias (@angular/core y @angular/compiler) para compilarlo sino da error, con este comando las instala y compila:
cd FrontComp && \
npm i ; \
sudo ./buildCpToVolume.sh; cd ..
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

Si se tienen las CLI de angular y Nest:

```bash
# En la carpeta del Frontend
ng serve
# En la del backend
nest start --watch
```

Si no se tienen estas CLI instalados

```bash
# En la carpeta del Frontend
npm run start
# En la del backend
npm run start:dev
```

Para instalar las dos CLI (Recomendado)

```sh
sudo npm i -g @nestjs/cli
sudo npm i -g @angular/cli
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

## Herramientas para la programación

[Bcrypt generator](https://bcrypthashgenerator.tool-kit.dev/) seleccionar prefijo 2b y rounds 10 para generar el hash de la contraseña

[Json2TS](http://www.json2ts.com/) Web para generar interfaces de typescript a partir de un Json

[Angular material](https://material.angular.io/) Componentes ya hechos de angular

[Libro resumen y tips Typescript](https://basarat.gitbook.io/typescript/)

## Setting up your environment

If you are making a Pull Request, please fork this repository before continuing.

For more information on forking or GitHub usage, please navigate to: [https://docs.github.com/en/github/getting-started-with-github](https://docs.github.com/en/github/getting-started-with-github)

```bash
# Example of cloning the competences repository (forked)

# Using HTTPS
git clone https://github.com/<your_username>/competencias.git

# Using SSH
git clone git@github.com:<your_username>/competencias.git
```

Once cloned, navigate to the folder by typing cd `competencias` and then running the following commands:

```bash
# Install all project dependencies
npm install
pnpm install

# Start the project
yarn watch
```

Start your local development server(may take several minutes) by running `yarn watch` in the terminal.

## Recommended packages(draft)

> These rules are still work in progress, so are not strictly enforced for the time being.

### Commitizen(draft)

The [Commitizen](https://github.com/commitizen/cz-cli) allows for easy to read and organized commits with minimal change to normal commit functions. To get started, please visit: [https://github.com/commitizen/cz-cli](https://github.com/commitizen/cz-cli)

### Commit Guidelines w/Commitizen(draft)

All commits will be auto-formatted by commitizen following a fluid interface

### Commit types(draft)

- **feat**: Commits that result in new features. Backward compatible features will release with the next MINOR whereas breaking changes will be in the next MAJOR. The body of a commit with breaking changes must begin with BREAKING CHANGE, followed by a description of how the API has changed.
- **fix**: Commits that provide fixes for bugs within hedgehog-lab's codebase.
- **docs**: Commits that provide updates to the docs.
- **style**: Commits that do not affect how the code runs, these are simply changes to formatting.
- **refactor**: Commits that neither fixes a bug nor adds a feature.
- **perf**: Commits that improve performance.
- **test**: Commits that add missing or correct existing tests.
- **chore**: Other commits that don't modify core or test files.
- **revert**: Commits that revert previous commits.

## Submitting Changes / Pull Requests(draft)

> These rules are still work in progress, so are not strictly enforced for the time being.

Please rebase your change on the latest master before submitting your PR. We suggest you pull at least daily to avoid digressing too far from the master branch.
Keep your repo fresh can minimize the churn addressing conflicting changes. 

### Pull Requests For hedgehog-lab(draft)

> Pull requests related to the hedgehog-lab core:

- For any new features, bug fixes and documentation updates, please submit pull requests to master.

### Pull Requests For Docs

For any pull requests related to hedgehog-lab docs, please submit your pull request to the master branch.
