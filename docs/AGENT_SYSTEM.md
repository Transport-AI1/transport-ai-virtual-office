# Sistema de agentes de Transport AI

## Oficina virtual

La aplicación incluye una sede 3D de dos plantas, con nueve despachos especializados, recepción y sala de reuniones. Se puede entrar en cada despacho desde el edificio o desde el directorio de departamentos.

Cada despacho ofrece:
- Ficha de misión y responsabilidades del trabajador.
- Conversación individual con el agente.
- Asignación y seguimiento de tareas.
- Historial de conversación y tareas guardado en el navegador mediante localStorage.

La persistencia actual es local al navegador: no sincroniza automáticamente entre dispositivos ni usuarios y se pierde si se borra el almacenamiento del sitio.

## Agentes y motor de IA local

Los nueve perfiles e instrucciones están versionados en `lib/agents.ts`. El endpoint `POST /api/agents` permite conversar con cada especialista y el Director de Operaciones utiliza `POST /api/director`.

Los endpoints `/api/agents` y `/api/director` utilizan la API compatible con OpenAI `/chat/completions`. El endpoint `/api/health` comprueba si el servidor responde y qué modelos anuncia. Por eso pueden conectarse a distintos motores locales sin modificar el código:

- GPT4All: `http://127.0.0.1:4891/v1`
- llama.cpp server: se puede iniciar en `http://127.0.0.1:4891/v1` para reutilizar la misma configuración.
- Modelo predeterminado mientras no se configure otro: `Llama 3.2 3B Instruct`.

Variables de entorno (en `.env.local`):

```env
LOCAL_LLM_BASE_URL=http://127.0.0.1:4891/v1
LOCAL_LLM_MODEL=Llama 3.2 3B Instruct
```

Las variables antiguas `GPT4ALL_BASE_URL` y `GPT4ALL_MODEL` siguen siendo compatibles, pero las variables `LOCAL_LLM_*` tienen prioridad. El nombre del modelo debe coincidir con el que espera el servidor local.

## Alternativa estudiada: llama.cpp en Mac Intel

El MacBook Pro de pruebas tiene un Intel Core i7-1068NG7 y 32 GB de RAM. llama.cpp declara soporte para instrucciones AVX/AVX2 en procesadores x86 y ofrece un servidor HTTP compatible con la API de OpenAI, por lo que es una alternativa técnicamente adecuada para probar en este equipo.

La integración prevista es:

1. Instalar una compilación de llama.cpp compatible con macOS Intel desde sus fuentes oficiales.
2. Empezar con Qwen2.5 3B Instruct Q5_K_M (aprox. 2,2 GB) para priorizar velocidad en el Intel de 4 núcleos. Si el rendimiento es aceptable y se necesita más capacidad, comparar después Qwen2.5 7B Instruct Q4_K_M (aprox. 4,68 GB), sabiendo que probablemente será más lento.
3. Iniciar `llama-server` enlazado solo a `127.0.0.1`, puerto `4891`, con el modelo descargado y un alias estable.
4. Configurar `LOCAL_LLM_BASE_URL=http://127.0.0.1:4891/v1` y `LOCAL_LLM_MODEL` con el alias configurado.
5. Comprobar primero `/v1/models`, después una petición corta a `/v1/chat/completions`, y por último los agentes de la oficina.

Ejemplo de arranque una vez instalado llama.cpp y descargado el GGUF (sustituir la ruta por la ubicación real del archivo):

```bash
llama-server -m "/ruta/al/modelo.gguf" --host 127.0.0.1 --port 4891 --alias transport-ai --threads 4
```

En ese caso, configurar `LOCAL_LLM_MODEL=transport-ai`.

**Importante:** 32 GB de RAM permiten cargar modelos cuantizados de 3B y 7B, pero no garantizan velocidad. El procesador tiene 4 núcleos y la generación será principalmente CPU. Conviene comparar primero el 3B Q5_K_M con el modelo actual; un 7B puede razonar mejor, pero también puede tardar bastante más. No se ha instalado ni probado todavía llama.cpp en este Mac.

## Activar GPT4All (motor actual)

1. Abre GPT4All en tu Mac.
2. Selecciona el modelo que quieras utilizar.
3. Activa **Enable Local API Server**. La dirección habitual es `http://127.0.0.1:4891/v1`.
4. Comprueba que el servidor está activo y que el modelo está cargado.
5. En tu Mac, abre Terminal dentro de la carpeta del proyecto y ejecuta `npm run dev`.
6. Abre `http://localhost:3000`. Las rutas de Next.js se ejecutan en el mismo Mac y pueden acceder al motor local.

## Importante sobre Vercel y seguridad

Una función alojada en Vercel no puede acceder a `127.0.0.1` de tu Mac. La conexión local está pensada para desarrollo: Next.js y el motor de IA deben ejecutarse en el mismo ordenador. La web publicada no podrá utilizar este endpoint local directamente.

No expongas el servidor local a Internet ni lo enlaces a `0.0.0.0` sin autenticación y controles de seguridad.

## Diagnóstico desde la interfaz

En la sección **Director de operaciones**, el botón **Comprobar conexión** consulta `/api/health` y muestra si el servidor local responde y si el modelo configurado aparece en `/v1/models`. Esta comprobación no genera texto ni consume tokens de inferencia.

La sección **Configuración** permite descargar una copia JSON de las tareas, los perfiles, los contactos del CRM y las conversaciones guardadas en el navegador. El archivo puede contener información interna: guárdalo en un lugar privado.

## Validación automática

El flujo de GitHub Actions `.github/workflows/validate.yml` instala dependencias, comprueba TypeScript y ejecuta la compilación de Next.js en cada push a `main` y en las pull requests.

## Qué puede hacer cada trabajador

Los agentes pueden analizar instrucciones, redactar, planificar y preparar entregables dentro de su conversación. El Director también puede convertir un objetivo en una cola estructurada mediante `POST /api/plan-tasks`, asignando cada tarea a uno de los especialistas. Desde el panel del Director, **Crear tareas y activar agentes** crea la cola y activa el modo autónomo. La bandeja de tareas permite asignar trabajo y activar el modo autónomo. Con el modo activo, el navegador procesa secuencialmente las tareas pendientes mediante `POST /api/execute-task`, usando el especialista asignado y el motor local. El resultado queda guardado como entregable en estado **Revisión**; una persona debe aprobarlo para marcar la tarea como completada. Los errores se pueden reintentar.

La ejecución autónoma actual solo realiza trabajo intelectual dentro del modelo local: redactar, analizar, planificar y preparar entregables. Requiere que la página de la oficina permanezca abierta y que GPT4All esté activo. No es un servicio 24/7 y se pausa si el navegador o el Mac se apagan.\n\nNo tienen acceso automático a correo, WhatsApp, bancos, clientes, GitHub ni otros servicios. No envían mensajes, realizan pagos, publican ni despliegan. Para eso hacen falta integraciones reales, permisos y aprobación humana.

## Siguientes fases

1. Base de datos compartida y autenticación.
2. Bandeja central de tareas conectada al Director de Operaciones.
3. Ejecutor persistente en segundo plano, con cola compartida y reanudación tras reinicios.\n4. Herramientas seguras y permisos granulares para cada agente.
4. Integraciones aprobadas (correo, CRM, WhatsApp, GitHub y calendario).
5. Registro de actividad y auditoría de acciones.
6. Edificio 3D con más detalle visual y navegación por plantas.
