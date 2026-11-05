# Brainstorm Vault 0.6 – FLOW

V0.6 incorpora un reproductor expandido FLOW con forma de onda calculada localmente y navegación mediante clic o flechas.

## A/B Studio
Selecciona dos archivos importados y usa A/B. La aplicación cambia de archivo conservando el segundo de reproducción. Si las versiones no están alineadas en tiempo, la comparación no quedará sincronizada musicalmente. No se realiza igualación de volumen ni mezcla simultánea.

## Publicación
Sube `index.html`, `manifest.webmanifest` y `assets/` a GitHub Pages. Se mantiene la misma base IndexedDB/localStorage de V0.3-V0.5. No se eliminan datos anteriores. Tus canciones siguen guardadas solo en el navegador.

## Fuentes
Coloca Garet-Book.otf y Garet-Heavy.otf en assets/fonts/ si la licencia permite publicarlas. Las fuentes no se incluyen en este paquete.

## Límites
La forma de onda se calcula desde el archivo completo y usa memoria del navegador; archivos muy grandes o formatos no soportados pueden fallar. BPM y tonalidad siguen siendo estimaciones.
