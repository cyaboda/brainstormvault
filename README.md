# BRAINSTORM VAULT V0.3

Diseño blanco de referencia. Página de inicio con banner y **Mi música**, sin la sección Proyectos. La biblioteca empieza vacía y los proyectos también.

## Publicación en GitHub Pages

1. Sube `index.html`, `manifest.webmanifest` y la carpeta `assets/`.
2. En tu propio repositorio, crea la carpeta `assets/fonts/`.
3. Sube allí tus archivos de fuente autorizados `Garet-Book.otf` y `Garet-Heavy.otf`. **Las fuentes no se incluyen en este ZIP.**
4. Publica los cambios. Es posible que debas recargar con Ctrl+F5.

## Datos locales

Las canciones importadas se guardan en IndexedDB en este navegador y origen, no en GitHub.
Esta versión usa almacenamiento `brainstorm-vault-v03` y `bv03-data` para iniciar con la biblioteca vacía; **no borra los datos previos de V0.2**. Los datos no se sincronizan entre navegadores ni dispositivos. No elimines los audios originales.

Para agregar música, usa el botón + en la parte superior o «Añadir música» en la biblioteca vacía.
