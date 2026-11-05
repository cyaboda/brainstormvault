# BRAINSTORM VAULT V0.4

## Actualizaciones
- Controles de reproducción SVG refinados, accesibles y sin caracteres tipográficos incorrectos.
- Estimación local automática de BPM y tonalidad al importar audio con Web Audio API.
- Botón «Analizar audio» en el detalle de cada canción existente.
- Los campos BPM y Tonalidad se pueden editar manualmente.
- Mantiene el IndexedDB y localStorage de la V0.3. No borres datos del navegador.

## Publicar
Sube index.html, manifest.webmanifest y assets a la raíz de GitHub Pages.
Para activar Garet, añade tus archivos Garet-Book.otf y Garet-Heavy.otf a assets/fonts/ si la licencia permite alojarlos públicamente. No se incluyen las fuentes en este ZIP.

## Importante
La detección es orientativa, no de estudio: puede confundir tempo simple/doble y tonalidades relativas, modulaciones o temas sin centro tonal definido. La precisión depende del arreglo y la mezcla. Los audios se procesan localmente, sin servidores. La decodificación necesita un navegador moderno y memoria suficiente; los archivos superiores a 110 MB requieren entrada manual.
El almacenamiento de audio continúa siendo solo local.


## V0.5
- Reproductor rediseñado como un dock compacto con controles encapsulados y barra de progreso fina.
- Acciones de canción rediseñadas con botones tipo chip más elegantes.
