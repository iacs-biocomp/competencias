La carpeta Entity dentro de interfaces deberia tener solo las interfaces de las entidades que el backend usa.
Los datos se pueden mandar acortados (No hace falta mandar todos los datos de una Competencia x ejemplo sino solo su id) Para eso se usa el DTO
En esa carpeta se añaden interfaces que indican el tipo de dato que se debe enviar o se recibirá

Normalmente el backend envia todos los datos completos (Interfaces de carpeta Entity) y recibe datos de tipo = (interfaces de la carpeta DTO)

<!-- TODO: Completar  -->
