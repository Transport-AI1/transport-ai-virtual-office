# Sistema de agentes de Transport AI

## Arquitectura inicial

Los nueve agentes tienen perfiles versionados en `lib/agents.ts`. Cada perfil define misión, responsabilidades, capacidades, límites y sus instrucciones de sistema.

El primer agente con una vía de ejecución es el Director de Operaciones:

- Endpoint: `POST /api/director`
- Proveedor: Ollama en el propio equipo
- Modelo predeterminado: `qwen2.5:3b`
- Dirección predeterminada: `http://127.0.0.1:11434`

No se envían encargos a servicios externos. Si Ollama no está instalado o activo, el endpoint informa de ello y no simula una respuesta.

## Activación local

1. Instala Ollama desde https://ollama.com en el ordenador que ejecutará la aplicación.
2. Descarga un modelo compatible, por ejemplo `qwen2.5:3b`.
3. Inicia Ollama.
4. Ejecuta la aplicación Next.js en ese mismo ordenador.
5. Opcionalmente define:
   - `OLLAMA_BASE_URL`: dirección del servidor Ollama.
   - `OLLAMA_MODEL`: nombre del modelo instalado.

El modelo se ejecuta localmente; el rendimiento depende de la memoria y capacidad del ordenador. En un MacBook Pro de 2019 conviene empezar con un modelo pequeño y probar su velocidad antes de ampliar.

## Límites de seguridad

- El Director propone planes, tareas, responsables, dependencias y riesgos.
- No envía mensajes, no accede a cuentas, no compra, no publica ni despliega.
- No puede aprobar presupuestos ni comprometer a Transport AI.
- Las acciones externas requieren aprobación humana.
- La aplicación no guarda el contenido de los encargos en un servidor externo.

## Próximas etapas

1. Persistencia local de tareas y encargos.
2. Conversaciones individuales con cada agente.
3. Herramientas controladas y permisos por agente.
4. Coordinación entre agentes con registro de resultados.
5. Oficina 3D conectada a la actividad real del sistema.
