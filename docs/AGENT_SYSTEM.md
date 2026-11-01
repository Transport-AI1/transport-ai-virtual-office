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

Los nueve perfiles e instrucciones están versionados en `lib/agents.ts`. El endpoint `POST /api/agents` permite conversar con cada especialista usando Ollama. El Director de Operaciones también tiene el endpoint `POST /api/director` para generar planes.

- Modelo predeterminado: `qwen2.5:3b`
- Dirección local: `http://127.0.0.1:11434`
- Variable opcional: `OLLAMA_MODEL`
- Variable opcional: `OLLAMA_BASE_URL`

No se simulan resultados: si Ollama no está disponible, la interfaz muestra un error.

## Activar IA sin pagar una API

1. Instala Ollama desde https://ollama.com.
2. Descarga el modelo desde Terminal: `ollama pull qwen2.5:3b`.
3. Abre Ollama y comprueba que está ejecutándose.
4. Si usas la aplicación publicada en Vercel, el navegador puede intentar conectarse directamente al Ollama de tu propio Mac. Para permitirlo, añade el dominio exacto de tu web a los orígenes autorizados.
5. En macOS, abre Terminal y ejecuta (sustituye el dominio de ejemplo por el dominio real de Vercel):

```bash
launchctl setenv OLLAMA_ORIGINS "https://TU-DOMINIO.vercel.app,http://localhost:3000"
```

6. Cierra Ollama completamente y vuelve a abrirlo para que recoja la variable.
7. Mantén Ollama escuchando solo en localhost. No configures `OLLAMA_HOST=0.0.0.0` ni abras el puerto 11434 a Internet.

Ollama documenta `OLLAMA_ORIGINS` para permitir orígenes web adicionales y `launchctl setenv` para establecer variables al ejecutar la aplicación de macOS: https://github.com/ollama/ollama/blob/main/docs/faq.mdx.

### Importante sobre Vercel

Una función alojada en Vercel no puede acceder a `127.0.0.1` de tu Mac. Por eso el chat de los despachos intenta primero el endpoint de la aplicación y, si el servidor no tiene acceso a Ollama, prueba desde el navegador contra el Ollama local. Para que esto funcione desde la web publicada, hay que autorizar el origen exacto con `OLLAMA_ORIGINS` y mantener el Mac encendido con Ollama abierto.

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
