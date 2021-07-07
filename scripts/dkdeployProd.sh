echo $(tput setaf 2)"Desplegando en "$(tput sgr0)$(tput setaf 5)"Pre-producción"$(tput sgr0)
echo $(tput setaf 3)"Generando tar de nodecompetencias"$(tput sgr0)
docker save -o nodecompetencias.tar nodecompetencias
echo $(tput setaf 1)"Falta añadir usuario del sv de desarrollo"$(tput sgr0)
exit 1
# TODO: Subir a docker registry en vez de scp
scp nodecompetencias.tar root@develop.bigan.eu:~/dkImages
