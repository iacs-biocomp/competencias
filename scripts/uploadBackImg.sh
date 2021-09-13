#!/bin/bash
GO_TO=$(dirname "$0")
cd $GO_TO

echo $(tput setaf 2)"Subiendo imagen al registro docker de "$(tput sgr0)$(tput setaf 5)"Pre-producción"$(tput sgr0)
sudo docker push registry.bigan.eu:5000/guiasalud/nginx:1.0.0

