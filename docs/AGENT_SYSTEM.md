# Sistema de agentes de Transport AI

## Oficina virtual

La aplicación incluye una sede 3D de dos plantas, con nueve despachos especializados, recepción y sala de reuniones. Se puede entrar en cada despacho desde el edificio o desde el directorio de departamentos.

Cada despacho ofrece:
- Ficha de misión y responsabilidades del trabajador.
- Conversación individual con el agente.
- Asignación y seguimiento de tareas.
- Historial de conversación y tareas guardado en el navegador mediante localStorage.

La persistencia actual es local al navegador: no sincroniza automáticamente entre dispositivos ni usuarios y se pierde si se borra el almacenamiento del sitio.

## Agentes y ejecución

Los nueve perfiles e instrucciones están versionados en `lib/agents.ts`. El endpoint `POST /api/agents` permite conversar con cada especialista usando la API local compatible con OpenAI de GPT4All. El Director de Operaciones utiliza `POST /api/director`.

- Dirección predeterminada: `http://127.0.0.1:4891/v1`
- Endpoint: `/chat/completions`
- Modelo predeterminado: `Llama 3.2 3B Instruct`
- Variable opcional: `GPT4ALL_BASE_URL`
- Variable opcional: `GPT4ALL_MODEL`

No se simulan resultados: si GPT4All no está disponible o el modelo no está cargado, la interfaz muestra un error.

## Activar IA sin pagar una API

1. Abre GPT4All en tu Mac.
2. Descarga o selecciona el modelo que quieras utilizar (la configuración inicial contempla `Llama 3.2 3B Instruct`).
3. Activa **Enable Local API Server** en los ajustes de GPT4All. La dirección habitual es `http://127.0.0.1:4891/v1`.
4. Comprueba que el servidor está activo y que el modelo está cargado.
5. En tu Mac, abre Terminal dentro de la carpeta del proyecto y ejecuta `npm run dev`.
6. Abre `http://localhost:3000`. Las rutas de Next.js se ejecutan en el mismo Mac y pueden acceder a GPT4All en `127.0.0.1`.

Si el nombre del modelo que muestra GPT4All es diferente, puedes definir `GPT4ALL_MODEL` en el entorno de Next.js con el nombre exacto devuelto por `/v1/models`.

## Importante sobre Vercel

Una función alojada en Vercel no puede acceder a `127.0.0.1` de tu Mac. Por tanto, la conexión del servidor que acabamos de configurar está pensada para desarrollo local: Next.js y GPT4All deben ejecutarse en el mismo ordenador. La web publicada no podrá utilizar este endpoint local directamente. No expongas el puerto 4891 a Internet ni publiques una API local sin autenticación y controles de seguridad.

## Qué puede hacer cada trabajador

Los agentes pueden analizar instrucciones, redactar, planificar y preparar entregables dentro de su conversación. La bandeja de tareas permite asignar trabajo y marcarlo como completado; por ahora el estado de finalización lo actualiza una persona.

No tienen acceso automático a correo, WhatsApp, bancos, clientes, GitHub ni otros servicios. No envían mensajes, realizan pagos, publican ni despliegan. Para eso hacen falta integraciones reales, permisos y aprobación humana.

## Siguientes fases

1. Base de datos compartida y autenticación.
2. Bandeja central de tareas conectada al Director de Operaciones.
3. Herramientas seguras y permisos granulares para cada agente.
4. Integraciones aprobadas (correo, CRM, WhatsApp, GitHub y calendario).
5. Registro de actividad y auditoría de acciones.
6. Edificio 3D con más detalle visual y navegación por plantas.
