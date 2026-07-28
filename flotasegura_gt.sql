drop database if exists flotasegura_gt;
create database flotasegura_gt;
use flotasegura_gt;

-- Tabla de empresas (las compañias de transporte)
create table empresas (
  id                  int auto_increment not null,
  nombre              varchar(150)        not null,
  nit                 varchar(20)         not null,
  licenciaOperacion   varchar(50)         not null,
  direccion           varchar(255)        null,
  telefono            varchar(20)         null,
  email               varchar(120)        null,
  telefono_soporte    varchar(20)         null,
  email_facturacion   varchar(120)        null,
  estado              enum('activa','inactiva') not null default 'activa',
  creado_en           datetime            not null default current_timestamp,
  actualizado_en      datetime            not null default current_timestamp on update current_timestamp,
  primary key (id),
  unique key uq_empresa_nit (nit)
) engine=innodb;

-- Tabla de conductores (las personas que manejan)
create table conductores (
  id                      int auto_increment not null,
  empresaId               int          not null,
  nombreCompleto          varchar(150) not null,
  tipoLicencia            varchar(10)  null,
  licenciaNumero          varchar(30)  not null,
  licenciaVencimiento     date         null,
  horasManejoHoy          decimal(4,2) not null default 0,
  horasDescansoAcumuladas decimal(4,2) not null default 0,
  estado                  enum('disponible','en_ruta','descansando','inactivo') not null default 'disponible',
  telefono                varchar(20)  null,
  telefono_emergencia     varchar(20)  null,
  email                   varchar(120) null,
  primary key (id),
  unique key uq_conductor_licencia (licenciaNumero),
  constraint fk_conductor_empresa
    foreign key (empresaId) references empresas (id)
    on update cascade on delete restrict
) engine=innodb;

-- Tabla de vehiculos (camiones, cisternas, etc.)
create table vehiculos (
  id                   int auto_increment not null,
  empresaId            int          not null,
  placa                varchar(15)  not null,
  tipo                 varchar(40)  not null,
  marca                varchar(50)  null,
  modelo               varchar(50)  null,
  anio                 smallint     null,
  capacidadPeso        decimal(8,2) null,
  pesoActualCarga      decimal(8,2) not null default 0,
  estado               enum('disponible','en_ruta','mantenimiento','inactivo') not null default 'disponible',
  ultimoMantenimiento  date         null,
  telefono_gps         varchar(20)  null,
  email_mantenimiento  varchar(120) null,
  primary key (id),
  unique key uq_vehiculo_placa (placa),
  constraint fk_vehiculo_empresa
    foreign key (empresaId) references empresas (id)
    on update cascade on delete restrict
) engine=innodb;

-- Tabla de rutas (los caminos que se recorren)
create table rutas (
  id                  int auto_increment not null,
  nombre              varchar(150) not null,
  origenDescripcion   varchar(255) not null,
  destinoDescripcion  varchar(255) not null,
  distanciaKm         decimal(8,2) null,
  estimacionHoras     decimal(5,2) null,
  nivelRiesgo         enum('bajo','medio','alto','critico') not null default 'bajo',
  activa              tinyint(1)   not null default 1,
  telefono_encargado  varchar(20)  null,
  email_encargado     varchar(120) null,
  primary key (id)
) engine=innodb;

-- Tabla de puntos de parada (paradas dentro de una ruta)
create table puntos_parada (
  id                  int auto_increment not null,
  rutaId              int          not null,
  nombre              varchar(150) not null,
  tipoParada          enum('descanso','gasolinera','puerto_carga','revision','emergencia','comida') null,
  tiempoDescansoMin   int          not null default 0,
  orden               int          null,
  ubicacion           varchar(255) null,
  obligatorio         tinyint(1)   not null default 0,
  telefono_punto      varchar(20)  null,
  email_punto         varchar(120) null,
  primary key (id),
  constraint fk_parada_ruta
    foreign key (rutaId) references rutas (id)
    on update cascade on delete cascade,
  key idx_parada_ruta_orden (rutaId, orden)
) engine=innodb;

-- Tabla de cargas (lo que se transporta)
create table cargas (
  id                     int auto_increment not null,
  empresaId              int           not null,
  descripcion            varchar(255)  not null,
  pesoKg                 decimal(10,2) not null,
  tipoCarga              varchar(40)   null,
  requiereRefrigeracion  tinyint(1)    not null default 0,
  origenDireccion        varchar(255)  null,
  destinoDireccion       varchar(255)  null,
  estado                 enum('pendiente','asignada','en_transito','entregada','cancelada') not null default 'pendiente',
  telefono_contacto_envio varchar(20)  null,
  email_contacto_envio    varchar(120) null,
  primary key (id),
  constraint fk_carga_empresa
    foreign key (empresaId) references empresas (id)
    on update cascade on delete restrict
) engine=innodb;

-- Tabla de viajes (cada recorrido que hace un conductor)
create table viajes (
  id                 int auto_increment not null,
  conductorId        int          not null,
  vehiculoId         int          not null,
  rutaId             int          not null,
  cargaId            int          null,
  estado             enum('programado','en_curso','pausado','completado','cancelado','accidente') not null default 'programado',
  inicioProgramado   datetime     not null,
  inicioReal         datetime     null,
  finReal            datetime     null,
  notasClaude        text         null,
  telefono_monitoreo varchar(20)  null,
  email_monitoreo    varchar(120) null,
  primary key (id),
  constraint fk_viaje_conductor foreign key (conductorId) references conductores (id) on update cascade on delete restrict,
  constraint fk_viaje_vehiculo  foreign key (vehiculoId) references vehiculos (id) on update cascade on delete restrict,
  constraint fk_viaje_ruta      foreign key (rutaId) references rutas (id) on update cascade on delete restrict,
  constraint fk_viaje_carga     foreign key (cargaId) references cargas (id) on update cascade on delete set null
) engine=innodb;

-- Tabla de monitoreo (seguimiento en tiempo real de un viaje)
create table monitoreos (
  id                        int auto_increment not null,
  viajeId                   int           not null,
  latitud                   decimal(10,6) null,
  longitud                  decimal(10,6) null,
  velocidad                 decimal(6,2)  null,
  horasConduccionContinua   decimal(4,2)  null,
  estadoConductor           enum('activo','alerta_fatiga','detenido','descanso') null,
  registradoEn              datetime      not null,
  comentario                text          null,
  telefono_operador         varchar(20)   null,
  email_operador            varchar(120)  null,
  primary key (id),
  constraint fk_monitoreo_viaje
    foreign key (viajeId) references viajes (id)
    on update cascade on delete cascade,
  key idx_monitoreo_viaje (viajeId)
) engine=innodb;

-- Tabla de alertas de fatiga (avisos de cansancio del conductor)
create table alertas_fatiga (
  id                  int auto_increment not null,
  viajeId             int          not null,
  conductorId         int          not null,
  tipoAlerta          enum('pre_fatiga','fatiga','descanso_obligatorio','velocidad_excesiva','ruta_peligrosa') null,
  mensaje             varchar(255) not null,
  nivelRiesgo         enum('bajo','medio','alto','critico') not null default 'medio',
  horasSinDescanso    decimal(4,2) null,
  atendida            tinyint(1)   not null default 0,
  generadaEn          datetime     not null,
  telefono_notificado varchar(20)  null,
  email_notificado    varchar(120) null,
  primary key (id),
  constraint fk_alerta_viaje     foreign key (viajeId) references viajes (id) on update cascade on delete cascade,
  constraint fk_alerta_conductor foreign key (conductorId) references conductores (id) on update cascade on delete restrict,
  key idx_alerta_atendida (atendida)
) engine=innodb;

-- Tabla de incidentes (problemas o accidentes durante un viaje)
create table incidentes (
  id                   int auto_increment not null,
  viajeId              int          not null,
  conductorId          int          not null,
  vehiculoId           int          not null,
  tipoIncidente        enum('accidente','falla_mecanica','robo','clima','cierre_vial','otro') null,
  descripcion          varchar(255) not null,
  severidad            enum('leve','moderado','grave','fatal') not null default 'leve',
  reportadoAutoridades tinyint(1)   not null default 0,
  ocurridoEn           datetime     not null,
  telefono_reporte     varchar(20)  null,
  email_reporte        varchar(120) null,
  primary key (id),
  constraint fk_incidente_viaje     foreign key (viajeId) references viajes (id) on update cascade on delete cascade,
  constraint fk_incidente_conductor foreign key (conductorId) references conductores (id) on update cascade on delete restrict,
  constraint fk_incidente_vehiculo  foreign key (vehiculoId) references vehiculos (id) on update cascade on delete restrict
) engine=innodb;

-- Empresas
insert into empresas (id, nombre, nit, licenciaOperacion, direccion, telefono, email, telefono_soporte, email_facturacion, estado) values
(1, 'Transportes Quetzal S.A.', '123456-7', 'LO-2024-001', '5ta Avenida 12-30 Zona 9, Guatemala', '22334455', 'contacto@quetzal.gt', '15001111', 'facturacion@quetzal.gt', 'activa'),
(2, 'Logistica del Norte', '765432-1', 'LO-2024-014', 'Km 5 Carretera a El Salvador, Guatemala', '22445566', 'info@logisticanorte.gt', '15002222', 'facturas@logisticanorte.gt', 'activa'),
(3, 'Carga Segura Peten', '987654-3', 'LO-2024-027', 'Barrio San Benito, Flores, Peten', '77123456', 'contacto@cargasegurapeten.gt', '15003333', 'facturacion@cargasegurapeten.gt', 'activa'),
(4, 'Fletes del Pacifico', '456789-2', 'LO-2024-033', 'Zona 4, Escuintla', '78234567', 'ventas@fletespacifico.gt', '15004444', 'facturas@fletespacifico.gt', 'inactiva');

-- Conductores (las personas)
insert into conductores (id, empresaId, nombreCompleto, tipoLicencia, licenciaNumero, licenciaVencimiento, horasManejoHoy, horasDescansoAcumuladas, estado, telefono, telefono_emergencia, email) values
(1, 1, 'Carlos Mendez', 'E', 'GT-LIC-0001', '2027-03-15', 4.50, 8.00, 'en_ruta', '55112233', '55119999', 'carlos.mendez@quetzal.gt'),
(2, 1, 'Ana Lopez', 'E', 'GT-LIC-0002', '2026-11-20', 0.00, 10.00, 'disponible', '55223344', '55229999', 'ana.lopez@quetzal.gt'),
(3, 2, 'Jose Ramirez', 'A', 'GT-LIC-0003', '2027-01-10', 6.00, 4.00, 'en_ruta', '55334455', '55339999', 'jose.ramirez@logisticanorte.gt'),
(4, 3, 'Maria Gonzalez', 'E', 'GT-LIC-0004', '2026-09-05', 0.00, 12.00, 'descansando', '55445566', '55449999', 'maria.gonzalez@cargasegurapeten.gt'),
(5, 2, 'Luis Hernandez', 'A', 'GT-LIC-0005', '2027-06-30', 2.00, 9.50, 'disponible', '55556677', '55559999', 'luis.hernandez@logisticanorte.gt');

-- Vehiculos
insert into vehiculos (id, empresaId, placa, tipo, marca, modelo, anio, capacidadPeso, pesoActualCarga, estado, ultimoMantenimiento, telefono_gps, email_mantenimiento) values
(1, 1, 'C-123ABC', 'trailer', 'Freightliner', 'Cascadia', 2022, 30.00, 18.50, 'en_ruta', '2026-06-01', '55990001', 'taller@quetzal.gt'),
(2, 1, 'C-456DEF', 'cisterna', 'Kenworth', 'T680', 2021, 25.00, 0.00, 'disponible', '2026-05-15', '55990002', 'taller@quetzal.gt'),
(3, 2, 'P-789GHI', 'trailer', 'Volvo', 'VNL', 2023, 32.00, 20.00, 'en_ruta', '2026-07-01', '55990003', 'taller@logisticanorte.gt'),
(4, 3, 'P-321JKL', 'furgon', 'International', 'DuraStar', 2019, 12.00, 0.00, 'mantenimiento', '2026-07-20', '55990004', 'taller@cargasegurapeten.gt'),
(5, 2, 'P-654MNO', 'plataforma', 'Mack', 'Anthem', 2020, 28.00, 9.50, 'disponible', '2026-04-10', '55990005', 'taller@logisticanorte.gt');

-- Rutas
insert into rutas (id, nombre, origenDescripcion, destinoDescripcion, distanciaKm, estimacionHoras, nivelRiesgo, activa, telefono_encargado, email_encargado) values
(1, 'Guatemala - Puerto Barrios', 'Ciudad de Guatemala', 'Puerto Barrios, Izabal', 297.00, 5.50, 'medio', 1, '55700001', 'monitoreo.izabal@flotasegura.gt'),
(2, 'Guatemala - Tecun Uman', 'Ciudad de Guatemala', 'Tecun Uman, San Marcos', 253.00, 4.75, 'alto', 1, '55700002', 'monitoreo.sanmarcos@flotasegura.gt'),
(3, 'Guatemala - Flores', 'Ciudad de Guatemala', 'Flores, Peten', 500.00, 8.00, 'alto', 1, '55700003', 'monitoreo.peten@flotasegura.gt'),
(4, 'Guatemala - Escuintla', 'Ciudad de Guatemala', 'Escuintla', 60.00, 1.25, 'bajo', 1, '55700004', 'monitoreo.escuintla@flotasegura.gt');

-- Puntos de parada
insert into puntos_parada (id, rutaId, nombre, tipoParada, tiempoDescansoMin, orden, ubicacion, obligatorio, telefono_punto, email_punto) values
(1, 1, 'Gasolinera El Rancho', 'gasolinera', 15, 1, 'El Rancho, El Progreso', 1, '55800001', 'elrancho@gasolineras.gt'),
(2, 1, 'Descanso Rio Hondo', 'descanso', 30, 2, 'Rio Hondo, Zacapa', 1, '55800002', 'riohondo@paradas.gt'),
(3, 2, 'Revision Coatepeque', 'revision', 20, 1, 'Coatepeque, Quetzaltenango', 1, '55800003', 'coatepeque@paradas.gt'),
(4, 3, 'Comida Poptun', 'comida', 40, 1, 'Poptun, Peten', 0, '55800004', 'poptun@paradas.gt');

-- Cargas
insert into cargas (id, empresaId, descripcion, pesoKg, tipoCarga, requiereRefrigeracion, origenDireccion, destinoDireccion, estado, telefono_contacto_envio, email_contacto_envio) values
(1, 1, 'Electrodomesticos', 18500.00, 'general', 0, 'Zona 4, Guatemala', 'Puerto Barrios, Izabal', 'en_transito', '55900001', 'envios@quetzal.gt'),
(2, 2, 'Productos lacteos', 12000.00, 'perecedero', 1, 'Zona 12, Guatemala', 'Tecun Uman, San Marcos', 'asignada', '55900002', 'envios@logisticanorte.gt'),
(3, 2, 'Repuestos industriales', 9500.00, 'general', 0, 'Amatitlan', 'Coban, Alta Verapaz', 'pendiente', '55900003', 'envios2@logisticanorte.gt'),
(4, 3, 'Material de construccion', 15000.00, 'general', 0, 'Peten', 'Coban, Alta Verapaz', 'pendiente', '55900004', 'envios@cargasegurapeten.gt');

-- Viajes
insert into viajes (id, conductorId, vehiculoId, rutaId, cargaId, estado, inicioProgramado, inicioReal, finReal, notasClaude, telefono_monitoreo, email_monitoreo) values
(1, 1, 1, 1, 1, 'en_curso', '2026-07-27 06:00:00', '2026-07-27 06:10:00', null, 'Viaje sin novedades hasta el ultimo reporte.', '55700010', 'monitoreo1@flotasegura.gt'),
(2, 3, 3, 2, 2, 'programado', '2026-07-29 05:00:00', null, null, 'Pendiente de confirmar salida.', '55700011', 'monitoreo2@flotasegura.gt'),
(3, 2, 2, 4, null, 'completado', '2026-07-20 07:00:00', '2026-07-20 07:05:00', '2026-07-20 09:30:00', 'Entrega completada sin incidentes.', '55700012', 'monitoreo3@flotasegura.gt'),
(4, 5, 5, 3, 4, 'pausado', '2026-07-28 04:00:00', '2026-07-28 04:15:00', null, 'Pausado por descanso obligatorio del conductor.', '55700013', 'monitoreo4@flotasegura.gt');

-- Monitoreos
insert into monitoreos (id, viajeId, latitud, longitud, velocidad, horasConduccionContinua, estadoConductor, registradoEn, comentario, telefono_operador, email_operador) values
(1, 1, 15.133700, -89.396900, 78.50, 4.50, 'activo', '2026-07-28 09:00:00', 'Conduccion normal, sin alertas.', '55910001', 'operador1@flotasegura.gt'),
(2, 4, 14.640700, -90.513200, 0.00, 3.00, 'descanso', '2026-07-28 08:00:00', 'Vehiculo detenido por descanso programado.', '55910002', 'operador2@flotasegura.gt');

-- Alertas de fatiga
insert into alertas_fatiga (id, viajeId, conductorId, tipoAlerta, mensaje, nivelRiesgo, horasSinDescanso, atendida, generadaEn, telefono_notificado, email_notificado) values
(1, 4, 5, 'descanso_obligatorio', 'Conductor supero limite de horas continuas de manejo', 'alto', 6.50, 1, '2026-07-28 08:00:00', '55920001', 'seguridad@logisticanorte.gt'),
(2, 1, 1, 'pre_fatiga', 'Conductor muestra signos tempranos de cansancio', 'medio', 4.50, 0, '2026-07-28 09:00:00', '55920002', 'seguridad@quetzal.gt');

-- Incidentes
insert into incidentes (id, viajeId, conductorId, vehiculoId, tipoIncidente, descripcion, severidad, reportadoAutoridades, ocurridoEn, telefono_reporte, email_reporte) values
(1, 3, 2, 2, 'falla_mecanica', 'Falla menor de frenos resuelta en ruta', 'leve', 0, '2026-07-20 08:00:00', '55930001', 'incidentes@quetzal.gt');