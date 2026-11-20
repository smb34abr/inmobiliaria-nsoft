# Inmobiliaria Nsoft — MVP Mínimo Inmobiliario

Prototipo funcional en **Next.js + TypeScript + Tailwind CSS** basado en la línea visual limpia e intuitiva de `diseño.png`.

## Módulos incluidos (MVP mínimo)
1. **Dashboard básico** (`/`) — KPIs de inmuebles captados, disponibles, visitas, ventas y captaciones por agente.
2. **Inmuebles y Captación** (`/inmuebles`) — Tabla con búsqueda, filtros, alta de inmuebles y cambio de estado (`Captado → Publicado → Visitado → Oferta → Vendido`).
3. **Clientes** (`/clientes`) — Propietarios, Compradores e Inquilinos.
4. **Pipeline de ventas** (`/pipeline`) — Tablero por etapas con avance rápido de prospectos.
5. **Actividades** (`/actividades`) — Llamadas, WhatsApp, correos y reuniones.
6. **Visitas** (`/visitas`) — Programación y registro de resultados.
7. **Usuarios** (`/usuarios`) — Administrador, Gerente y Agente inmobiliario.
8. **Configuración** (`/configuracion`) — Personalización de marca y reinicio de datos de prueba.

## Cómo ejecutarlo localmente

Requiere **Node.js 18+** instalado en tu equipo:

```bash
npm install
npm run dev
```

Luego abre `http://localhost:3000` en tu navegador.

## Despliegue en producción (Vercel + GitHub)

1. Crea un repositorio nuevo en GitHub (vacío, sin README).
2. Conecta esta carpeta y sube el código:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/inmobiliaria-nsoft.git
   git branch -M main
   git push -u origin main
   ```
3. Entra a [vercel.com](https://vercel.com), haz clic en **Add New → Project**, importa tu repositorio y presiona **Deploy**.
   Vercel detectará Next.js automáticamente y generará tu URL en producción con HTTPS.
