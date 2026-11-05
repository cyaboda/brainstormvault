# Brainstorm Vault V0.2

Interfaz estática inspirada en la referencia de diseño aprobada.

## Cómo usar
1. Abre `index.html` en un navegador moderno o publícalo mediante GitHub Pages.
2. Haz clic en `+` o `Añadir música` para importar tu MP3/WAV/FLAC/M4A compatible.
3. Puedes editar los metadatos, asociar una portada y un proyecto, filtrar y reproducir.
4. Las pistas y archivos se guardan **solo en ese navegador y dispositivo** mediante IndexedDB. El catálogo usa localStorage.

## Importante
- El diseño muestra portadas recortadas de la maqueta proporcionada por el usuario. Las canciones de ejemplo no contienen audio y el reproductor no simula música inexistente.
- Los archivos importados **no** se suben a GitHub ni se sincronizan entre dispositivos.
- Si borras los datos del sitio, usas incógnito, cambias de dominio o el navegador libera almacenamiento, podrías perder las pistas. Conserva tus originales.
- Las cuotas de almacenamiento varían según el navegador, dispositivo y origen.
- No hay Supabase, backend ni autenticación todavía. Publicar la web en GitHub Pages **no** hace privados los recursos web publicados. Para sincronización y protección real se requiere implementar autenticación, buckets privados y reglas de acceso antes de subir audio.
