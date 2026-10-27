/*==============================================================*/
/* ATHLETIX - Modelo físico (PostgreSQL / Supabase)             */
/* Convención: tablas en singular y columnas con prefijo de 3   */
/* letras de su tabla (CLI_, PRD_, PED_, PAG_, PPC_...). Las     */
/* claves foráneas conservan el nombre de la columna padre.      */
/*==============================================================*/

/*==============================================================*/
/* Validación de cédula ecuatoriana (algoritmo módulo 10)        */
/*==============================================================*/
create or replace function cedula_valida(c text) returns boolean
language plpgsql immutable as $$
declare
  suma int := 0; d int; i int; prov int;
begin
  if c is null or c !~ '^[0-9]{10}$' then return false; end if;
  prov := substr(c, 1, 2)::int;
  if prov < 1 or (prov > 24 and prov <> 30) then return false; end if;
  if substr(c, 3, 1)::int > 5 then return false; end if;
  for i in 1..9 loop
    d := substr(c, i, 1)::int;
    if i % 2 = 1 then d := d * 2; if d > 9 then d := d - 9; end if; end if;
    suma := suma + d;
  end loop;
  return (10 - (suma % 10)) % 10 = substr(c, 10, 1)::int;
end $$;

/*==============================================================*/
/* Table: CATEGORIA                                              */
/*==============================================================*/
create table categoria (
   cat_codigo           int2           not null,
   cat_nombre           varchar(40)    not null,
   cat_slug             varchar(20)    not null,
   constraint pk_categoria primary key (cat_codigo),
   constraint ak_categoria_nombre unique (cat_nombre),
   constraint ak_categoria_slug unique (cat_slug)
);

/*==============================================================*/
/* Table: PRODUCTO                                               */
/*==============================================================*/
create table producto (
   prd_codigo           varchar(10)    not null,
   cat_codigo           int2           not null,
   prd_nombre           varchar(80)    not null,
   prd_descripcion      text           not null,
   prd_publico          varchar(6)     not null,
   prd_precio           numeric(12,2)  not null,
   prd_imagen           varchar(120)   not null,
   prd_usa_talla        bool           not null default false,
   prd_activo           bool           not null default true,
   prd_fecha_creacion   timestamptz    not null default now(),
   constraint pk_producto primary key (prd_codigo),
   constraint ckc_prd_publico check (prd_publico in ('Hombre', 'Mujer', 'Unisex')),
   constraint ckc_prd_precio check (prd_precio > 0)
);

/*==============================================================*/
/* Table: PRODUCTO_TALLA  (existencia por talla; U = única)      */
/*==============================================================*/
create table producto_talla (
   prd_codigo           varchar(10)    not null,
   pta_talla            varchar(5)     not null,
   pta_existencia       int4           not null default 0,
   constraint pk_producto_talla primary key (prd_codigo, pta_talla),
   constraint ckc_pta_existencia check (pta_existencia >= 0)
);

/*==============================================================*/
/* Table: CLIENTE                                                */
/*==============================================================*/
create table cliente (
   cli_cedula           char(10)       not null,
   cli_usuario          uuid           not null,
   cli_nombres          varchar(60)    not null,
   cli_apellidos        varchar(60)    not null,
   cli_telefono         char(10)       not null,
   cli_correo           varchar(120)   not null,
   cli_fecha_registro   timestamptz    not null default now(),
   constraint pk_cliente primary key (cli_cedula),
   constraint ak_cliente_usuario unique (cli_usuario),
   constraint ak_cliente_correo unique (cli_correo),
   constraint ckc_cli_cedula check (cedula_valida(cli_cedula)),
   constraint ckc_cli_nombres check (cli_nombres ~ '^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ'' -]{2,60}$'),
   constraint ckc_cli_apellidos check (cli_apellidos ~ '^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ'' -]{2,60}$'),
   constraint ckc_cli_telefono check (cli_telefono ~ '^09[0-9]{8}$')
);

/*==============================================================*/
/* Table: ADMINISTRADOR                                          */
/*==============================================================*/
create table administrador (
   adm_usuario          uuid           not null,
   constraint pk_administrador primary key (adm_usuario)
);

/*==============================================================*/
/* Table: TIENDA                                                 */
/*==============================================================*/
create table tienda (
   tie_codigo           int2           not null,
   tie_nombre           varchar(60)    not null,
   tie_direccion        varchar(120)   not null,
   tie_ciudad           varchar(40)    not null,
   tie_horario          varchar(60)    not null,
   constraint pk_tienda primary key (tie_codigo),
   constraint ak_tienda_nombre unique (tie_nombre)
);

/*==============================================================*/
/* Table: TARJETA  (solo últimos 4 dígitos, nunca el número)     */
/*==============================================================*/
create table tarjeta (
   tar_codigo           int4           generated by default as identity,
   cli_cedula           char(10)       not null,
   tar_marca            varchar(12)    not null,
   tar_ultimos4         char(4)        not null,
   tar_titular          varchar(60)    not null,
   tar_mes_vence        int2           not null,
   tar_anio_vence       int2           not null,
   constraint pk_tarjeta primary key (tar_codigo),
   constraint ak_tarjeta_cliente unique (cli_cedula, tar_marca, tar_ultimos4, tar_mes_vence, tar_anio_vence),
   constraint ckc_tar_marca check (tar_marca in ('Visa', 'Mastercard')),
   constraint ckc_tar_ultimos4 check (tar_ultimos4 ~ '^[0-9]{4}$'),
   constraint ckc_tar_mes check (tar_mes_vence between 1 and 12),
   constraint ckc_tar_anio check (tar_anio_vence >= 2026)
);

/*==============================================================*/
/* Table: PEDIDOCLIENTE                                          */
/*==============================================================*/
create sequence if not exists seq_ped_numero start 1001;

create table pedidocliente (
   ped_numero           numeric(12)    not null default nextval('seq_ped_numero'),
   cli_cedula           char(10)       not null,
   tie_codigo           int2           not null,
   ped_fecha            timestamptz    not null default now(),
   ped_estado           varchar(20)    not null default 'Recibido',
   ped_subtotal         numeric(12,2)  not null,
   ped_iva              numeric(12,2)  not null,
   ped_total            numeric(12,2)  not null,
   ped_clave            uuid           null,
   ped_fecha_actualizacion timestamptz not null default now(),
   constraint pk_pedidocliente primary key (ped_numero),
   constraint ak_pedidocliente_clave unique (ped_clave),
   constraint ckc_ped_estado check (ped_estado in ('Recibido', 'Preparando', 'Listo', 'Retirado', 'Cancelado')),
   constraint ckc_ped_valores check (ped_subtotal >= 0 and ped_iva >= 0 and ped_total = ped_subtotal + ped_iva)
);

/*==============================================================*/
/* Table: PAGOS                                                  */
/*==============================================================*/
create table pagos (
   pag_codigo           varchar(15)    not null,
   ped_numero           numeric(12)    not null,
   tar_codigo           int4           not null,
   pag_monto            numeric(12,2)  not null,
   pag_fecha            timestamptz    not null default now(),
   constraint pk_pagos primary key (pag_codigo),
   constraint ckc_pag_monto check (pag_monto > 0)
);

/*==============================================================*/
/* Table: PRODUCTO_PEDCLI  (detalle del pedido)                  */
/*==============================================================*/
create table producto_pedcli (
   ped_numero           numeric(12)    not null,
   prd_codigo           varchar(10)    not null,
   ppc_talla            varchar(5)     not null default 'U',
   ppc_cantidad         int2           not null,
   ppc_precio           numeric(12,2)  not null,
   constraint pk_producto_pedcli primary key (ped_numero, prd_codigo, ppc_talla),
   constraint ckc_ppc_cantidad check (ppc_cantidad between 1 and 10),
   constraint ckc_ppc_precio check (ppc_precio > 0)
);

/*==============================================================*/
/* Table: RESENA  (solo de clientes que compraron y retiraron)   */
/*==============================================================*/
create table resena (
   res_codigo           int4           generated by default as identity,
   cli_cedula           char(10)       not null,
   prd_codigo           varchar(10)    not null,
   res_estrellas        int2           not null,
   res_comentario       varchar(500)   not null,
   res_autor            varchar(40)    null,
   res_fecha            timestamptz    not null default now(),
   constraint pk_resena primary key (res_codigo),
   constraint ak_resena_cliente_producto unique (cli_cedula, prd_codigo),
   constraint ckc_res_estrellas check (res_estrellas between 1 and 5),
   constraint ckc_res_comentario check (length(trim(res_comentario)) >= 10)
);

/*==============================================================*/
/* Relaciones                                                    */
/*==============================================================*/
alter table producto add constraint fk_categoria_producto foreign key (cat_codigo) references categoria (cat_codigo) on delete restrict;
alter table producto_talla add constraint fk_producto_productotalla foreign key (prd_codigo) references producto (prd_codigo) on delete cascade;
alter table cliente add constraint fk_usuario_cliente foreign key (cli_usuario) references auth.users (id) on delete cascade;
alter table administrador add constraint fk_usuario_administrador foreign key (adm_usuario) references auth.users (id) on delete cascade;
alter table tarjeta add constraint fk_cliente_tarjeta foreign key (cli_cedula) references cliente (cli_cedula) on delete cascade;
alter table pedidocliente add constraint fk_cliente_pedidocliente foreign key (cli_cedula) references cliente (cli_cedula) on delete restrict;
alter table pedidocliente add constraint fk_tienda_pedidocliente foreign key (tie_codigo) references tienda (tie_codigo) on delete restrict;
alter table pagos add constraint fk_pedidocliente_pago foreign key (ped_numero) references pedidocliente (ped_numero) on delete cascade;
alter table pagos add constraint fk_tarjeta_pago foreign key (tar_codigo) references tarjeta (tar_codigo) on delete restrict;
alter table producto_pedcli add constraint fk_pedcli_prodpedcli foreign key (ped_numero) references pedidocliente (ped_numero) on delete cascade;
alter table producto_pedcli add constraint fk_producto_prdpedcli foreign key (prd_codigo) references producto (prd_codigo) on delete restrict;
alter table resena add constraint fk_cliente_resena foreign key (cli_cedula) references cliente (cli_cedula) on delete cascade;
alter table resena add constraint fk_producto_resena foreign key (prd_codigo) references producto (prd_codigo) on delete cascade;

create index idx_producto_categoria on producto (cat_codigo, prd_publico);
create index idx_pedidocliente_cliente on pedidocliente (cli_cedula, ped_fecha desc);
create index idx_resena_producto on resena (prd_codigo);
