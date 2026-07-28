# flotasegura gt

proyecto de práctica en typescript. simula el control completo de
"flotasegura gt" (gestión de flotas de transporte pesado en guatemala),
con las 10 entidades del modelo de datos original.

## que hace el programa

es un menú de consola con un submenú por cada entidad:

1. **empresas transportistas** — listar, buscar, registrar, actualizar, desactivar, eliminar
2. **conductores** — listar, buscar, registrar, actualizar horas de manejo/descanso, cambiar estado, eliminar
3. **vehiculos** — listar, buscar, registrar, cambiar estado, registrar mantenimiento, eliminar
4. **cargas** — listar, buscar, registrar, cambiar estado, eliminar
5. **rutas y paradas** — listar/buscar/registrar rutas, ver y agregar paradas de una ruta, eliminar
6. **viajes** — listar, buscar, programar (conductor + vehiculo + ruta + carga), cambiar estado, eliminar
7. **monitoreo en tiempo real** — ver y registrar monitoreos de un viaje (velocidad, horas continuas, estado del conductor)
8. **alertas de fatiga** — listar, ver pendientes, generar, marcar como atendida
9. **incidentes** — listar, buscar, reportar (si es grave o fatal, marca el viaje como "accidente" automaticamente)

cada entidad guarda sus datos en su propio archivo `.json` dentro de
`src/data/`, que hace de "base de datos" simple para el proyecto.
también existe `database/schema.sql` con el modelo pensado originalmente
para mysql, por si se quiere migrar el proyecto a una base de datos real.

## manejo de errores

el programa nunca se cierra de golpe por un error:

- **capa de datos** (`data/`): si un archivo json no existe lo crea vacio;
  si esta dañado o no se puede leer/escribir, lanza un error con mensaje claro.
- **capa de servicios** (`services/`): valida datos obligatorios y que los
  ids relacionados existan antes de guardar (ej: no se puede crear un viaje
  con un conductor que no existe).
- **capa de menu** (`menu/`): cada opcion esta dentro de un `try/catch`, asi
  que si algo falla se muestra `error: ...` en consola y el menu sigue
  funcionando normalmente.
- **nivel global** (`index.ts`): por si algo se escapa de las capas
  anteriores, se atrapa con `process.on("uncaughtException")` y
  `process.on("unhandledRejection")` para que nunca se caiga sin explicacion.

## estructura de carpetas

```
src/
  api/         -> version opcional en api (express) de empresas
  client/      -> arranca el programa de consola
  data/        -> un archivo json + un repositorio por cada entidad
  menu/        -> un submenu por entidad + el menu principal
  models/      -> los tipos (interfaces y estados) de cada entidad
  services/    -> las reglas de negocio y validaciones de cada entidad
  utils/       -> lectura de consola (readline) y lectura/escritura de json
  index.ts     -> punto de entrada + manejo de errores global
```

## como correrlo

```bash
npm install
npm run dev
```

esto abre el menu principal de consola. tambien se puede correr como api
(solo empresas, de momento) con:

```bash
npm run api
```

y probar en el navegador o con postman: `http://localhost:3000/api/empresas`

## siguientes pasos

- agregar los endpoints de api para las demas entidades (por ahora solo
  esta empresas), siguiendo el mismo patron de `api/router.ts`.
- conectar el proyecto a una base de datos mysql real usando
  `database/schema.sql`, en vez de los archivos json.
- usar el campo `notasClaude` de `viaje` para guardar recomendaciones
  generadas automaticamente sobre el riesgo del viaje.
