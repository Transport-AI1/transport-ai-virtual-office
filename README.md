# Transport AI — Virtual Office

Oficina virtual privada para organizar la actividad interna de Transport AI.

## Primera versión

- Centro de dirección con resumen general.
- Nueve perfiles de agentes especializados.
- Gestión manual de tareas y responsables.
- Secciones preparadas para proyectos, clientes, documentos y finanzas.
- Interfaz adaptable a escritorio y móvil.
- Sin servicios de pago ni acciones externas automáticas.

## Desarrollo

Requisitos: Node.js 20 o superior.

```bash
npm install
npm run dev
```

Abre http://localhost:3000.

## Estado actual

Esta versión es una interfaz funcional con datos de demostración en memoria. Los perfiles no ejecutan tareas ni se comunican autónomamente todavía. La persistencia local, la conexión con modelos de IA y la oficina 3D se desarrollarán en fases posteriores.

El administrador conserva la aprobación final de cualquier acción externa.
