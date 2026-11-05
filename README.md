# BRAINSTORM VAULT V0.8 · Liquid Glass

Rediseño integral inspirado en la maqueta aprobada: fondo atmosférico, paneles translúcidos, sidebar y reproductor estilo macOS, biblioteca central y tarjeta de FLOW a la derecha. FLOW completo sigue disponible haciendo clic en su tarjeta o en el botón del reproductor.

## Instalación en GitHub Pages

1. Sube `index.html`, `manifest.webmanifest` y el directorio `assets` a la raíz del repositorio (reemplaza los anteriores).
2. Mantén los archivos `Garet-Book.otf` y `Garet-Heavy.otf` **solo si su licencia permite la publicación**, en `assets/fonts/`. Las fuentes no se distribuyen en el ZIP.
3. Comprueba el resultado con Ctrl+F5.

La música y los metadatos se mantienen en el almacenamiento local IndexedDB y localStorage del mismo origen web. No borres los datos del sitio ni cambies el dominio si quieres conservarlos. Haz una copia de los originales de tus canciones.

## Funciones

Importar audio, reproducir, editar, eliminar, marcar favoritos, filtrar, analizar aproximadamente BPM y tonalidad, visualizar la onda real en FLOW y comparar dos archivos A/B desde un punto de reproducción equivalente. El panel lateral es un acceso previo decorativo; la onda real y los selectores A/B funcionales están en FLOW Studio. No hay sincronización en nube.


## V0.9
- Retirado el panel FLOW lateral de Inicio.
- Añadidas ondas reales y navegables dentro de cada fila de música.
- Para ver la onda se analiza localmente el audio ya importado.
- Se conservan base IndexedDB, controles y datos.


## V0.9.1
- La columna del título tiene ancho controlado para que la forma de onda empiece junto al nombre de la pista.
- La forma de onda utiliza todo el espacio flexible restante.
- Ajustes responsive sin modificar la biblioteca guardada.


## V0.9.2
- Sidebar de cristal de altura completa, con margen uniforme de 20 px arriba y abajo.
- Almacenamiento fijado visualmente al pie del panel cuando hay espacio.
- Conserva la biblioteca, mini ondas y el almacenamiento local de las versiones anteriores.


## V0.9.3
- Waveforms centradas horizontalmente entre la información de la canción y el BPM.
- Barras más delgadas, suaves y equilibradas, con alto de 24 px.
- Escalado de canvas según el tamaño real mostrado y densidad de pantalla.
