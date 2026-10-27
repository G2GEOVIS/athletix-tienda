/*==============================================================*/
/* ATHLETIX - Modelo para PowerDesigner (DBMS: PostgreSQL)       */
/* File > Reverse Engineer > Database > Using script files       */
/* Convención de la clase: tablas en singular y columnas con     */
/* prefijo de 3 letras de su tabla. CLI_USUARIO y ADM_USUARIO    */
/* guardan el identificador de la cuenta de acceso (Supabase).   */
/*==============================================================*/

/*==============================================================*/
/* Table: CATEGORIA                                              */
/*==============================================================*/
create table CATEGORIA (
   CAT_CODIGO           INT2           not null,
   CAT_NOMBRE           VARCHAR(40)    not null,
   CAT_SLUG             VARCHAR(20)    not null,
   constraint PK_CATEGORIA primary key (CAT_CODIGO),
   constraint AK_CATEGORIA_NOMBRE unique (CAT_NOMBRE),
   constraint AK_CATEGORIA_SLUG unique (CAT_SLUG)
);

/*==============================================================*/
/* Table: PRODUCTO                                               */
/*==============================================================*/
create table PRODUCTO (
   PRD_CODIGO           VARCHAR(10)    not null,
   CAT_CODIGO           INT2           not null,
   PRD_NOMBRE           VARCHAR(80)    not null,
   PRD_DESCRIPCION      TEXT           not null,
   PRD_PUBLICO          VARCHAR(6)     not null,
   PRD_PRECIO           NUMERIC(12,2)  not null,
   PRD_IMAGEN           VARCHAR(120)   not null,
   PRD_USA_TALLA        BOOL           not null,
   PRD_ACTIVO           BOOL           not null,
   PRD_FECHA_CREACION   TIMESTAMPTZ    not null,
   constraint PK_PRODUCTO primary key (PRD_CODIGO),
   constraint CKC_PRD_PUBLICO check (PRD_PUBLICO in ('Hombre', 'Mujer', 'Unisex')),
   constraint CKC_PRD_PRECIO check (PRD_PRECIO > 0)
);

/*==============================================================*/
/* Table: PRODUCTO_TALLA  (existencia por talla; U = única)      */
/*==============================================================*/
create table PRODUCTO_TALLA (
   PRD_CODIGO           VARCHAR(10)    not null,
   PTA_TALLA            VARCHAR(5)     not null,
   PTA_EXISTENCIA       INT4           not null,
   constraint PK_PRODUCTO_TALLA primary key (PRD_CODIGO, PTA_TALLA),
   constraint CKC_PTA_EXISTENCIA check (PTA_EXISTENCIA >= 0)
);

/*==============================================================*/
/* Table: CLIENTE                                                */
/*==============================================================*/
create table CLIENTE (
   CLI_CEDULA           CHAR(10)       not null,
   CLI_USUARIO          UUID           not null,
   CLI_NOMBRES          VARCHAR(60)    not null,
   CLI_APELLIDOS        VARCHAR(60)    not null,
   CLI_TELEFONO         CHAR(10)       not null,
   CLI_CORREO           VARCHAR(120)   not null,
   CLI_FECHA_REGISTRO   TIMESTAMPTZ    not null,
   constraint PK_CLIENTE primary key (CLI_CEDULA),
   constraint AK_CLIENTE_USUARIO unique (CLI_USUARIO),
   constraint AK_CLIENTE_CORREO unique (CLI_CORREO),
   constraint CKC_CLI_NOMBRES check (CLI_NOMBRES ~ '^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ'' -]{2,60}$'),
   constraint CKC_CLI_APELLIDOS check (CLI_APELLIDOS ~ '^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ'' -]{2,60}$'),
   constraint CKC_CLI_TELEFONO check (CLI_TELEFONO ~ '^09[0-9]{8}$')
);

/*==============================================================*/
/* Table: ADMINISTRADOR                                          */
/*==============================================================*/
create table ADMINISTRADOR (
   ADM_USUARIO          UUID           not null,
   constraint PK_ADMINISTRADOR primary key (ADM_USUARIO)
);

/*==============================================================*/
/* Table: TIENDA                                                 */
/*==============================================================*/
create table TIENDA (
   TIE_CODIGO           INT2           not null,
   TIE_NOMBRE           VARCHAR(60)    not null,
   TIE_DIRECCION        VARCHAR(120)   not null,
   TIE_CIUDAD           VARCHAR(40)    not null,
   TIE_HORARIO          VARCHAR(60)    not null,
   constraint PK_TIENDA primary key (TIE_CODIGO),
   constraint AK_TIENDA_NOMBRE unique (TIE_NOMBRE)
);

/*==============================================================*/
/* Table: TARJETA  (solo últimos 4 dígitos, nunca el número)     */
/*==============================================================*/
create table TARJETA (
   TAR_CODIGO           INT4           not null,
   CLI_CEDULA           CHAR(10)       not null,
   TAR_MARCA            VARCHAR(12)    not null,
   TAR_ULTIMOS4         CHAR(4)        not null,
   TAR_TITULAR          VARCHAR(60)    not null,
   TAR_MES_VENCE        INT2           not null,
   TAR_ANIO_VENCE       INT2           not null,
   constraint PK_TARJETA primary key (TAR_CODIGO),
   constraint AK_TARJETA_CLIENTE unique (CLI_CEDULA, TAR_MARCA, TAR_ULTIMOS4, TAR_MES_VENCE, TAR_ANIO_VENCE),
   constraint CKC_TAR_MARCA check (TAR_MARCA in ('Visa', 'Mastercard')),
   constraint CKC_TAR_ULTIMOS4 check (TAR_ULTIMOS4 ~ '^[0-9]{4}$'),
   constraint CKC_TAR_MES check (TAR_MES_VENCE between 1 and 12),
   constraint CKC_TAR_ANIO check (TAR_ANIO_VENCE >= 2026)
);

/*==============================================================*/
/* Table: PEDIDOCLIENTE                                          */
/*==============================================================*/
create table PEDIDOCLIENTE (
   PED_NUMERO           NUMERIC(12) not null,
   CLI_CEDULA           CHAR(10)       not null,
   TIE_CODIGO           INT2           not null,
   PED_FECHA            TIMESTAMPTZ    not null,
   PED_ESTADO           VARCHAR(20)    not null,
   PED_SUBTOTAL         NUMERIC(12,2)  not null,
   PED_IVA              NUMERIC(12,2)  not null,
   PED_TOTAL            NUMERIC(12,2)  not null,
   PED_CLAVE            UUID           null,
   PED_FECHA_ACTUALIZACION TIMESTAMPTZ not null,
   constraint PK_PEDIDOCLIENTE primary key (PED_NUMERO),
   constraint AK_PEDIDOCLIENTE_CLAVE unique (PED_CLAVE),
   constraint CKC_PED_ESTADO check (PED_ESTADO in ('Recibido', 'Preparando', 'Listo', 'Retirado', 'Cancelado')),
   constraint CKC_PED_VALORES check (PED_SUBTOTAL >= 0 and PED_IVA >= 0 and PED_TOTAL = PED_SUBTOTAL + PED_IVA)
);

/*==============================================================*/
/* Table: PAGOS                                                  */
/*==============================================================*/
create table PAGOS (
   PAG_CODIGO           VARCHAR(15)    not null,
   PED_NUMERO           NUMERIC(12)    not null,
   TAR_CODIGO           INT4           not null,
   PAG_MONTO            NUMERIC(12,2)  not null,
   PAG_FECHA            TIMESTAMPTZ    not null,
   constraint PK_PAGOS primary key (PAG_CODIGO),
   constraint CKC_PAG_MONTO check (PAG_MONTO > 0)
);

/*==============================================================*/
/* Table: PRODUCTO_PEDCLI  (detalle del pedido)                  */
/*==============================================================*/
create table PRODUCTO_PEDCLI (
   PED_NUMERO           NUMERIC(12)    not null,
   PRD_CODIGO           VARCHAR(10)    not null,
   PPC_TALLA            VARCHAR(5)     not null,
   PPC_CANTIDAD         INT2           not null,
   PPC_PRECIO           NUMERIC(12,2)  not null,
   constraint PK_PRODUCTO_PEDCLI primary key (PED_NUMERO, PRD_CODIGO, PPC_TALLA),
   constraint CKC_PPC_CANTIDAD check (PPC_CANTIDAD between 1 and 10),
   constraint CKC_PPC_PRECIO check (PPC_PRECIO > 0)
);

/*==============================================================*/
/* Table: RESENA  (solo de clientes que compraron y retiraron)   */
/*==============================================================*/
create table RESENA (
   RES_CODIGO           INT4           not null,
   CLI_CEDULA           CHAR(10)       not null,
   PRD_CODIGO           VARCHAR(10)    not null,
   RES_ESTRELLAS        INT2           not null,
   RES_COMENTARIO       VARCHAR(500)   not null,
   RES_AUTOR            VARCHAR(40)    null,
   RES_FECHA            TIMESTAMPTZ    not null,
   constraint PK_RESENA primary key (RES_CODIGO),
   constraint AK_RESENA_CLIENTE_PRODUCTO unique (CLI_CEDULA, PRD_CODIGO),
   constraint CKC_RES_ESTRELLAS check (RES_ESTRELLAS between 1 and 5),
   constraint CKC_RES_COMENTARIO check (length(trim(RES_COMENTARIO)) >= 10)
);

/*==============================================================*/
/* Relaciones                                                    */
/*==============================================================*/
alter table PRODUCTO add constraint FK_CATEGORIA_PRODUCTO foreign key (CAT_CODIGO) references CATEGORIA (CAT_CODIGO) on delete restrict;
alter table PRODUCTO_TALLA add constraint FK_PRODUCTO_PRODUCTOTALLA foreign key (PRD_CODIGO) references PRODUCTO (PRD_CODIGO) on delete cascade;
alter table TARJETA add constraint FK_CLIENTE_TARJETA foreign key (CLI_CEDULA) references CLIENTE (CLI_CEDULA) on delete cascade;
alter table PEDIDOCLIENTE add constraint FK_CLIENTE_PEDIDOCLIENTE foreign key (CLI_CEDULA) references CLIENTE (CLI_CEDULA) on delete restrict;
alter table PEDIDOCLIENTE add constraint FK_TIENDA_PEDIDOCLIENTE foreign key (TIE_CODIGO) references TIENDA (TIE_CODIGO) on delete restrict;
alter table PAGOS add constraint FK_PEDIDOCLIENTE_PAGO foreign key (PED_NUMERO) references PEDIDOCLIENTE (PED_NUMERO) on delete cascade;
alter table PAGOS add constraint FK_TARJETA_PAGO foreign key (TAR_CODIGO) references TARJETA (TAR_CODIGO) on delete restrict;
alter table PRODUCTO_PEDCLI add constraint FK_PEDCLI_PRODPEDCLI foreign key (PED_NUMERO) references PEDIDOCLIENTE (PED_NUMERO) on delete cascade;
alter table PRODUCTO_PEDCLI add constraint FK_PRODUCTO_PRDPEDCLI foreign key (PRD_CODIGO) references PRODUCTO (PRD_CODIGO) on delete restrict;
alter table RESENA add constraint FK_CLIENTE_RESENA foreign key (CLI_CEDULA) references CLIENTE (CLI_CEDULA) on delete cascade;
alter table RESENA add constraint FK_PRODUCTO_RESENA foreign key (PRD_CODIGO) references PRODUCTO (PRD_CODIGO) on delete cascade;

