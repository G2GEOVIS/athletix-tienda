/*==============================================================*/
/* ATHLETIX - Modelo para PowerDesigner (DBMS: PostgreSQL)       */
/* File > Reverse Engineer > Database > Using script files       */
/* Mis tablas de la tienda modeladas con la forma de la clase:   */
/* tablas en singular y columnas con prefijo de 3 letras.        */
/* CLI_USUARIO y ADM_USUARIO guardan el identificador de la      */
/* cuenta de acceso (Supabase). La cédula se valida en la base   */
/* con la función cedula_valida (módulo 10).                     */
/*==============================================================*/

/*==============================================================*/
/* Table: CATEGORIA                                              */
/*==============================================================*/
create table CATEGORIA (
   CAT_CODIGO           INT2           not null,
   CAT_NOMBRE           VARCHAR(40)    not null,
   constraint PK_CATEGORIA primary key (CAT_CODIGO),
   constraint AK_CATEGORIA_NOMBRE unique (CAT_NOMBRE)
);

/*==============================================================*/
/* Table: PRODUCTO                                               */
/* La foto se toma de los archivos de la tienda por su código    */
/* (img/productos/<prd_codigo>-1.jpg), no se guarda en la base.  */
/*==============================================================*/
create table PRODUCTO (
   PRD_CODIGO           VARCHAR(10)    not null,
   CAT_CODIGO           INT2           not null,
   PRD_NOMBRE           VARCHAR(80)    not null,
   PRD_DESCRIPCION      TEXT           not null,
   PRD_PUBLICO          VARCHAR(6)     not null,
   PRD_PRECIO           NUMERIC(10,2)  not null,
   PRD_USA_TALLA        BOOL           not null,
   PRD_ACTIVO           BOOL           not null,
   constraint PK_PRODUCTO primary key (PRD_CODIGO),
   constraint CKC_PRD_PUBLICO check (PRD_PUBLICO in ('Hombre', 'Mujer', 'Unisex')),
   constraint CKC_PRD_PRECIO check (PRD_PRECIO > 0)
);

/*==============================================================*/
/* Table: PRODUCTO_TALLA  (stock por talla; U = talla única)     */
/*==============================================================*/
create table PRODUCTO_TALLA (
   PRD_CODIGO           VARCHAR(10)    not null,
   PTA_TALLA            VARCHAR(5)     not null,
   PTA_STOCK            INT4           not null,
   constraint PK_PRODUCTO_TALLA primary key (PRD_CODIGO, PTA_TALLA),
   constraint CKC_PTA_STOCK check (PTA_STOCK >= 0)
);

/*==============================================================*/
/* Table: CLIENTE                                                */
/* cli_usuario enlaza con la cuenta de acceso (correo/clave)     */
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
/* Table: METODO_PAGO  (solo los últimos 4 dígitos, nunca el     */
/* número completo ni el CVV)                                    */
/*==============================================================*/
create table METODO_PAGO (
   MPA_CODIGO           INT4          ,
   CLI_CEDULA           CHAR(10)       not null,
   MPA_MARCA            VARCHAR(12)    not null,
   MPA_ULTIMOS4         CHAR(4)        not null,
   MPA_TITULAR          VARCHAR(60)    not null,
   MPA_MES_VENCE        INT2           not null,
   MPA_ANIO_VENCE       INT2           not null,
   constraint PK_METODO_PAGO primary key (MPA_CODIGO),
   constraint AK_METODO_PAGO_CLIENTE unique (CLI_CEDULA, MPA_MARCA, MPA_ULTIMOS4, MPA_MES_VENCE, MPA_ANIO_VENCE),
   constraint CKC_MPA_MARCA check (MPA_MARCA in ('Visa', 'Mastercard')),
   constraint CKC_MPA_ULTIMOS4 check (MPA_ULTIMOS4 ~ '^[0-9]{4}$'),
   constraint CKC_MPA_MES check (MPA_MES_VENCE between 1 and 12),
   constraint CKC_MPA_ANIO check (MPA_ANIO_VENCE >= 2026)
);

/*==============================================================*/
/* Table: PEDIDO                                                 */
/* ped_clave_pago: identifica el intento de pago para no cobrar dos   */
/* veces si el cliente pulsa "Pagar" otra vez o la red se corta. */
/*==============================================================*/
create table PEDIDO (
   PED_NUMERO           INT4           not null,
   CLI_CEDULA           CHAR(10)       not null,
   TIE_CODIGO           INT2           not null,
   MPA_CODIGO           INT4           null,
   PED_FECHA            TIMESTAMPTZ    not null,
   PED_ESTADO           VARCHAR(12)    not null,
   PED_SUBTOTAL         NUMERIC(10,2)  not null,
   PED_IVA              NUMERIC(10,2)  not null,
   PED_TOTAL            NUMERIC(10,2)  not null,
   PED_CLAVE            UUID           null,
   constraint PK_PEDIDO primary key (PED_NUMERO),
   constraint AK_PEDIDO_CLAVE unique (PED_CLAVE),
   constraint CKC_PED_ESTADO check (PED_ESTADO in ('Recibido', 'Preparando', 'Listo', 'Retirado', 'Cancelado')),
   constraint CKC_PED_VALORES check (PED_SUBTOTAL >= 0 and PED_IVA >= 0 and PED_TOTAL = PED_SUBTOTAL + PED_IVA)
);

/*==============================================================*/
/* Table: DETALLE_PEDIDO                                         */
/*==============================================================*/
create table DETALLE_PEDIDO (
   PED_NUMERO           INT4           not null,
   PRD_CODIGO           VARCHAR(10)    not null,
   DPE_TALLA            VARCHAR(5)     not null,
   DPE_CANTIDAD         INT2           not null,
   DPE_PRECIO_UNITARIO  NUMERIC(10,2)  not null,
   constraint PK_DETALLE_PEDIDO primary key (PED_NUMERO, PRD_CODIGO, DPE_TALLA),
   constraint CKC_DPE_CANTIDAD check (DPE_CANTIDAD between 1 and 10),
   constraint CKC_DPE_PRECIO check (DPE_PRECIO_UNITARIO > 0)
);

/*==============================================================*/
/* Table: RESENA  (una por cliente y producto; solo si lo compró */
/* y lo retiró)                                                  */
/*==============================================================*/
create table RESENA (
   CLI_CEDULA           CHAR(10)       not null,
   PRD_CODIGO           VARCHAR(10)    not null,
   RES_ESTRELLAS        INT2           not null,
   RES_COMENTARIO       VARCHAR(500)   not null,
   RES_FECHA            TIMESTAMPTZ    not null,
   constraint PK_RESENA primary key (CLI_CEDULA, PRD_CODIGO),
   constraint CKC_RES_ESTRELLAS check (RES_ESTRELLAS between 1 and 5),
   constraint CKC_RES_COMENTARIO check (length(trim(RES_COMENTARIO)) >= 10)
);

/*==============================================================*/
/* Relaciones                                                    */
/*==============================================================*/
alter table PRODUCTO add constraint FK_CATEGORIA_PRODUCTO foreign key (CAT_CODIGO) references CATEGORIA (CAT_CODIGO) on delete restrict;
alter table PRODUCTO_TALLA add constraint FK_PRODUCTO_PRODUCTOTALLA foreign key (PRD_CODIGO) references PRODUCTO (PRD_CODIGO) on delete cascade;
alter table METODO_PAGO add constraint FK_CLIENTE_METODOPAGO foreign key (CLI_CEDULA) references CLIENTE (CLI_CEDULA) on delete cascade;
alter table PEDIDO add constraint FK_CLIENTE_PEDIDO foreign key (CLI_CEDULA) references CLIENTE (CLI_CEDULA) on delete restrict;
alter table PEDIDO add constraint FK_TIENDA_PEDIDO foreign key (TIE_CODIGO) references TIENDA (TIE_CODIGO) on delete restrict;
alter table PEDIDO add constraint FK_METODOPAGO_PEDIDO foreign key (MPA_CODIGO) references METODO_PAGO (MPA_CODIGO) on delete set null;
alter table DETALLE_PEDIDO add constraint FK_PEDIDO_DETALLEPEDIDO foreign key (PED_NUMERO) references PEDIDO (PED_NUMERO) on delete cascade;
alter table DETALLE_PEDIDO add constraint FK_PRODUCTO_DETALLEPEDIDO foreign key (PRD_CODIGO) references PRODUCTO (PRD_CODIGO) on delete restrict;
alter table RESENA add constraint FK_CLIENTE_RESENA foreign key (CLI_CEDULA) references CLIENTE (CLI_CEDULA) on delete cascade;
alter table RESENA add constraint FK_PRODUCTO_RESENA foreign key (PRD_CODIGO) references PRODUCTO (PRD_CODIGO) on delete cascade;
