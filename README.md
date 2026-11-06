# BRAINSTORM VAULT V1.0 · Liquid Glass + Supabase

## Publicación
1. En GitHub Pages, sube **index.html**, **cloud.js**, **manifest.webmanifest** y la carpeta **assets** (con su contenido). No borres datos del navegador ni el repositorio antes de verificar la migración.
2. Conserva las fuentes locales del proyecto en `assets/fonts/Garet-Book.otf` y `Garet-Heavy.otf` **solo si su licencia autoriza publicarlas**. No se distribuyen aquí.
3. Espera a que GitHub Pages actualice los archivos. Abre el sitio usando HTTPS y refresca con Ctrl+F5.
4. Inicia sesión con el usuario creado manualmente en Supabase Authentication. No hay registro público de cuentas desde esta app.
5. En el **mismo navegador de Windows donde importaste la música**, entra a **Ajustes → Sincronizar canciones locales**. Comprueba la biblioteca en el iPhone iniciando sesión con la misma cuenta.

## Conexión
- Supabase URL: `https://rghfzazfgbbjamhnucin.supabase.co`
- Se utiliza únicamente la **publishable key**, que se expone públicamente porque el repositorio es público. Las reglas RLS ya establecidas son imprescindibles.
- Tabla: `public.tracks`, bucket: `music` **privado**. Rutas: `UID/audio/<uuid>.<ext>` y `UID/covers/<uuid>.<ext>`.
- No incluyas secret keys, service_role ni contraseñas en el código o en GitHub.
- En Supabase **Authentication → Settings**, desactiva el registro público si quieres solo usuarios creados por ti.

## Límites y precauciones
- El bucket gratuito mostrado por tu cuenta tiene un **límite de 50 MB por archivo**. MP3 suelen caber; algunos WAV/FLAC no. La app muestra error antes de subirlos.
- Los archivos previamente importados se preservan en IndexedDB del mismo navegador/dominio. Durante la migración se copian a Supabase; no se eliminan localmente. Antes de empezar, haz copia de tus audios originales.
- Una vez sincronizados, aparecen desde otros equipos al acceder con la misma cuenta. Las nuevas importaciones se suben directamente a la nube.
- Los audios privados se reproducen mediante URLs firmadas de duración limitada, generadas bajo sesión autorizada. La reproducción en segundo plano y los formatos disponibles dependen de Safari/iOS.
- La onda real en la nube se calcula descargando temporalmente el audio desde Storage cuando es necesario. Con bibliotecas grandes puede tardar y consumir datos móviles.
- BPM y tonalidad siguen siendo **estimaciones**, corregibles desde la app.
- La comparación A/B conserva el segundo de reproducción, pero no compensa automáticamente volumen ni alineación musical.
- No constituye aún una app nativa de CarPlay.

## Verificación
- JavaScript `index.html` y `cloud.js` comprobado con `node --check`.
- No se han podido ejecutar pruebas de inicio de sesión ni de subida contra la cuenta real; deben verificarse con usuario autenticado.
