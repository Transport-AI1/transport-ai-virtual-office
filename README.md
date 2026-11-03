# Transport AI — Virtual Office

Oficina virtual privada para organizar el trabajo de Transport AI con nueve perfiles especializados y un entorno 3D interactivo.

## Funciones actuales

- Centro de dirección con resumen de agentes y tareas.
- Sede 3D de dos plantas con nueve despachos.
- Conversación individual con cada agente especializado.
- Director de Operaciones para preparar planes de trabajo.
- Bandeja de tareas con ejecución autónoma secuencial por especialista, entregables guardados y aprobación humana.
- CRM local para registrar empresas, contactos, estado comercial y próximos seguimientos.
- Copia de seguridad descargable de tareas, perfiles, contactos y conversaciones.
- Memoria compartida entre especialistas (hasta 30 entregables recientes) guardada en el navegador mediante `localStorage`.
- API de servidor para conectar un motor local compatible con OpenAI.
- Comprobación de conectividad y modelos disponibles en el servidor local.
- Director que descompone objetivos en tareas y las asigna automáticamente a especialistas.
- Modo autónomo local: procesa tareas pendientes mientras la oficina permanece abierta y GPT4All está activo.
- Sin necesidad de una API de pago ni acciones externas automáticas.

## Motor de IA local

Los endpoints `/api/agents`, `/api/director` y `/api/health` utilizan un servidor local compatible con la API de OpenAI.

Configuración predeterminada:
- URL: `http://127.0.0.1:4891/v1`
- Modelo: `Llama 3.2 3B Instruct`

Se puede cambiar el motor sin modificar el código mediante variables de entorno en `.env.local`:

```env
LOCAL_LLM_BASE_URL=http://127.0.0.1:4891/v1
LOCAL_LLM_MODEL=Llama 3.2 3B Instruct
```

Para conectar una instancia de GPT4All del Mac desde una aplicación alojada en Vercel, configura un túnel HTTPS con acceso protegido por **Cloudflare Access**. En las variables de entorno de Vercel configura:

```env
LOCAL_LLM_BASE_URL=https://ia.tudominio.com/v1
LOCAL_LLM_MODEL=Llama 3.2 3B Instruct
LLM_ACCESS_CLIENT_ID=valor-del-service-token
LLM_ACCESS_CLIENT_SECRET=secreto-del-service-token
```

El hostname debe apuntar mediante Cloudflare Tunnel al servicio GPT4All del Mac (`http://127.0.0.1:4891`). Crea una política de Cloudflare Access que exija un Service Token. La aplicación enviará las credenciales de Access desde el servidor de Next.js; nunca las expongas en variables `NEXT_PUBLIC_*` ni en el navegador. No publiques GPT4All directamente en Internet.

También se mantienen las variables anteriores `GPT4ALL_BASE_URL` y `GPT4ALL_MODEL` por compatibilidad. Las variables `LOCAL_LLM_*` tienen prioridad.

Para una alternativa local basada en llama.cpp y modelos GGUF, consulta [docs/AGENT_SYSTEM.md](docs/AGENT_SYSTEM.md). La compatibilidad y el rendimiento deben comprobarse en el equipo antes de sustituir el motor actual.

## Desarrollo

Requisitos: Node.js 20 o superior.

```bash
npm install
npm run dev
```

Abre http://localhost:3000.

## Límites importantes

- La memoria, las tareas y el CRM se guardan en el navegador; los agentes comparten ese contexto en ese mismo navegador, pero no se sincroniza entre usuarios o dispositivos ni constituye una base de datos de servidor.
- Los agentes pueden ejecutar automáticamente el trabajo intelectual de las tareas asignadas. Cada especialista puede consultar hasta cinco recuerdos recientes y un segundo especialista realiza una revisión cruzada; los resultados quedan pendientes de aprobación humana.
- No tienen acceso automático a correo, WhatsApp, bancos, CRM ni repositorios.
- Cualquier integración o acción externa necesitará permisos, controles y aprobación humana.
- Una web alojada en Vercel no puede acceder al servidor `127.0.0.1` del Mac. El motor local y Next.js deben ejecutarse en el mismo equipo.
- No expongas el puerto del motor local a Internet sin autenticación y controles de seguridad.

El administrador conserva la aprobación final de cualquier acción externa.
