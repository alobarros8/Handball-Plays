# 🔗 Configuración de la Función de Compartir

## Paso 1: Obtener API Key de JSONBin.io

Para usar la función de compartir jugadas, necesitas obtener una API key gratuita de JSONBin.io:

1. Ve a [https://jsonbin.io](https://jsonbin.io)
2. Haz clic en "Sign Up" para crear una cuenta gratuita
3. Inicia sesión en tu cuenta
4. Ve a la sección **"API Keys"** en el menú lateral
5. Copia tu **"X-Master-Key"** (empieza con `$2a$10$...`)

## Paso 2: Configurar la Variable de Entorno

1. En la carpeta raíz del proyecto, crea un archivo llamado `.env` (sin extensión antes del punto)
2. Abre el archivo `.env` con un editor de texto
3. Agrega la siguiente línea, reemplazando `tu_api_key_aqui` con tu API key real:

```
VITE_JSONBIN_API_KEY=tu_api_key_aqui
```

**Ejemplo:**
```
VITE_JSONBIN_API_KEY=$2a$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEF
```

4. Guarda el archivo

## Paso 3: Reiniciar el Servidor de Desarrollo

Después de crear el archivo `.env`, reinicia el servidor:

```bash
# Detén el servidor con Ctrl+C
# Luego vuelve a iniciarlo
npm run dev
```

## ✅ Verificar la Configuración

1. Graba una jugada
2. Guárdala con un nombre
3. Abre "Mis Jugadas"
4. Haz clic en "🔗 Compartir"
5. Si todo está bien, verás un enlace para compartir

## 🔒 Seguridad

- El archivo `.env` está en `.gitignore`, por lo que tu API key **NO** se subirá a GitHub
- **NUNCA** compartas tu API key públicamente
- Si accidentalmente expones tu API key, puedes regenerarla en el dashboard de JSONBin.io

## ❓ Solución de Problemas

### "Para compartir jugadas necesitas configurar tu API key..."
- Verifica que el archivo `.env` existe en la raíz del proyecto
- Verifica que la línea comienza con `VITE_JSONBIN_API_KEY=`
- Verifica que no hay espacios alrededor del `=`
- Reinicia el servidor de desarrollo

### Error 401 Unauthorized
- Tu API key puede ser incorrecta
- Verifica que copiaste la clave completa desde JSONBin.io
- Asegúrate de que tu cuenta de JSONBin.io esté activa
