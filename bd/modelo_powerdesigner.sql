/*==============================================================*/
/* ATHLETIX - Modelo físico para PowerDesigner                 */
/* DBMS: PostgreSQL                                              */
/* Uso: File > Reverse Engineer > Database...                    */
/*      DBMS: PostgreSQL 9.x (o la versión más alta disponible)  */
/*      Pestaña "Using script files" > agregar este archivo > OK */
/* Contiene solo tablas, claves y relaciones (sin funciones),    */
/* para que PowerDesigner dibuje el diagrama completo.          */
/*==============================================================*/

/*==============================================================*/
/* Table: USUARIOS  (cuenta de acceso que administra Supabase)   */
/*==============================================================*/
create table USUARIOS (
   ID                   UUID                 not null,
   EMAIL                VARCHAR(120)         not null,
   EMAIL_CONFIRMADO_EN  TIMESTAMP            null,
   CREADO_EN            TIMESTAMP            not null,
   constraint PK_USUARIOS primary key (ID),
   constraint AK_USUARIOS_EMAIL unique (EMAIL)
);
comment on table USUARIOS is 'Cuentas de acceso (auth.users de Supabase): correo, contraseña cifrada y confirmación';

/*==============================================================*/
/* Table: CLIENTES                                               */
/*==============================================================*/
create table CLIENTES (
   ID                   UUID                 not null,
   CEDULA               CHAR(10)             not null,
   NOMBRES              VARCHAR(60)          not null,
   APELLIDOS            VARCHAR(60)          not null,
   TELEFONO             CHAR(10)             not null,
   CORREO               VARCHAR(120)         not null,
   CREADO_EN            TIMESTAMP            not null,
   constraint PK_CLIENTES primary key (ID),
   constraint AK_CLIENTES_CEDULA unique (CEDULA),
   constraint AK_CLIENTES_CORREO unique (CORREO),
   constraint CKC_CLIENTES_TELEFONO check (TELEFONO like '09%')
);
comment on table CLIENTES is 'Datos personales del cliente; la cédula se valida con el algoritmo módulo 10';

/*==============================================================*/
/* Table: ADMINISTRADORES                                        */
/*==============================================================*/
create table ADMINISTRADORES (
   ID                   UUID                 not null,
   constraint PK_ADMINISTRADORES primary key (ID)
);
comment on table ADMINISTRADORES is 'Usuarios que pueden ver todos los pedidos y cambiar su estado';

/*==============================================================*/
/* Table: CATEGORIAS                                             */
/*==============================================================*/
create table CATEGORIAS (
   ID                   INT2                 not null,
   NOMBRE               VARCHAR(40)          not null,
   SLUG                 VARCHAR(40)          not null,
   constraint PK_CATEGORIAS primary key (ID),
   constraint AK_CATEGORIAS_NOMBRE unique (NOMBRE),
   constraint AK_CATEGORIAS_SLUG unique (SLUG)
);
comment on table CATEGORIAS is 'Calzado deportivo, tecnología deportiva y equipo de entrenamiento';

/*==============================================================*/
/* Table: PRODUCTOS                                              */
/*==============================================================*/
create table PRODUCTOS (
   ID                   INT4                 not null,
   CATEGORIA_ID         INT2                 not null,
   PUBLICO              VARCHAR(6)           not null,
   CODIGO               VARCHAR(12)          not null,
   NOMBRE               VARCHAR(80)          not null,
   DESCRIPCION          TEXT                 not null,
   PRECIO               NUMERIC(10,2)        not null,
   IMAGEN_URL           TEXT                 not null,
   USA_TALLA            BOOL                 not null,
   ACTIVO               BOOL                 not null,
   CREADO_EN            TIMESTAMP            not null,
   constraint PK_PRODUCTOS primary key (ID),
   constraint AK_PRODUCTOS_CODIGO unique (CODIGO),
   constraint CKC_PRODUCTOS_PUBLICO check (PUBLICO in ('Hombre','Mujer','Unisex')),
   constraint CKC_PRODUCTOS_PRECIO check (PRECIO > 0)
);
comment on table PRODUCTOS is 'Catálogo; el precio oficial que se cobra está aquí';

/*==============================================================*/
/* Table: PRODUCTO_TALLAS                                        */
/*==============================================================*/
create table PRODUCTO_TALLAS (
   PRODUCTO_ID          INT4                 not null,
   TALLA                VARCHAR(5)           not null,
   STOCK                INT4                 not null,
   constraint PK_PRODUCTO_TALLAS primary key (PRODUCTO_ID, TALLA),
   constraint CKC_PRODUCTO_TALLAS_STOCK check (STOCK >= 0)
);
comment on table PRODUCTO_TALLAS is 'Stock por talla; los productos sin talla usan la talla U (única)';

/*==============================================================*/
/* Table: METODOS_PAGO                                           */
/*==============================================================*/
create table METODOS_PAGO (
   ID                   INT4                 not null,
   CLIENTE_ID           UUID                 not null,
   MARCA                VARCHAR(12)          not null,
   ULTIMOS4             CHAR(4)              not null,
   TITULAR              VARCHAR(60)          not null,
   MES_VENCE            INT2                 not null,
   ANIO_VENCE           INT2                 not null,
   constraint PK_METODOS_PAGO primary key (ID),
   constraint AK_METODOS_PAGO_TARJETA unique (CLIENTE_ID, MARCA, ULTIMOS4, MES_VENCE, ANIO_VENCE),
   constraint CKC_METODOS_PAGO_MARCA check (MARCA in ('Visa','Mastercard')),
   constraint CKC_METODOS_PAGO_MES check (MES_VENCE between 1 and 12)
);
comment on table METODOS_PAGO is 'Solo últimos 4 dígitos y vencimiento; nunca el número completo ni el CVV';

/*==============================================================*/
/* Table: TIENDAS                                                */
/*==============================================================*/
create table TIENDAS (
   ID                   INT2                 not null,
   NOMBRE               VARCHAR(60)          not null,
   DIRECCION            VARCHAR(120)         not null,
   CIUDAD               VARCHAR(40)          not null,
   HORARIO              VARCHAR(60)          not null,
   constraint PK_TIENDAS primary key (ID),
   constraint AK_TIENDAS_NOMBRE unique (NOMBRE)
);
comment on table TIENDAS is 'Locales donde el cliente retira su pedido';

/*==============================================================*/
/* Table: PEDIDOS                                                */
/*==============================================================*/
create table PEDIDOS (
   ID                   INT4                 not null,
   NUMERO               VARCHAR(16)          not null,
   CLAVE                UUID                 null,
   CLIENTE_ID           UUID                 not null,
   TIENDA_ID            INT2                 not null,
   METODO_PAGO_ID       INT4                 not null,
   ESTADO               VARCHAR(12)          not null,
   SUBTOTAL             NUMERIC(10,2)        not null,
   IVA                  NUMERIC(10,2)        not null,
   TOTAL                NUMERIC(10,2)        not null,
   CREADO_EN            TIMESTAMP            not null,
   ACTUALIZADO_EN       TIMESTAMP            not null,
   constraint PK_PEDIDOS primary key (ID),
   constraint AK_PEDIDOS_NUMERO unique (NUMERO),
   constraint AK_PEDIDOS_CLAVE unique (CLAVE),
   constraint CKC_PEDIDOS_ESTADO check (ESTADO in ('Recibido','Preparando','Listo','Retirado','Cancelado')),
   constraint CKC_PEDIDOS_TOTAL check (TOTAL = SUBTOTAL + IVA)
);
comment on table PEDIDOS is 'Cabecera del pedido; CLAVE evita pedidos duplicados por reintentos de pago';

/*==============================================================*/
/* Table: DETALLE_PEDIDO                                         */
/*==============================================================*/
create table DETALLE_PEDIDO (
   ID                   INT4                 not null,
   PEDIDO_ID            INT4                 not null,
   PRODUCTO_ID          INT4                 not null,
   TALLA                VARCHAR(5)           null,
   CANTIDAD             INT2                 not null,
   PRECIO_UNITARIO      NUMERIC(10,2)        not null,
   constraint PK_DETALLE_PEDIDO primary key (ID),
   constraint AK_DETALLE_LINEA unique (PEDIDO_ID, PRODUCTO_ID, TALLA),
   constraint CKC_DETALLE_CANTIDAD check (CANTIDAD between 1 and 10)
);
comment on table DETALLE_PEDIDO is 'Productos de cada pedido con el precio del momento de la compra';

/*==============================================================*/
/* Table: RESENAS                                                */
/*==============================================================*/
create table RESENAS (
   ID                   INT4                 not null,
   CLIENTE_ID           UUID                 not null,
   PRODUCTO_ID          INT4                 not null,
   AUTOR                VARCHAR(40)          null,
   ESTRELLAS            INT2                 not null,
   COMENTARIO           VARCHAR(500)         not null,
   CREADO_EN            TIMESTAMP            not null,
   constraint PK_RESENAS primary key (ID),
   constraint AK_RESENAS_CLIENTE_PRODUCTO unique (CLIENTE_ID, PRODUCTO_ID),
   constraint CKC_RESENAS_ESTRELLAS check (ESTRELLAS between 1 and 5)
);
comment on table RESENAS is 'Reseñas de compra verificada: solo de clientes que compraron y retiraron el producto';

/*==============================================================*/
/* Relaciones (claves foráneas)                                  */
/*==============================================================*/
alter table CLIENTES
   add constraint FK_CLIENTES_USUARIOS foreign key (ID)
      references USUARIOS (ID) on delete cascade on update restrict;

alter table ADMINISTRADORES
   add constraint FK_ADMINISTRADORES_USUARIOS foreign key (ID)
      references USUARIOS (ID) on delete cascade on update restrict;

alter table PRODUCTOS
   add constraint FK_PRODUCTOS_CATEGORIAS foreign key (CATEGORIA_ID)
      references CATEGORIAS (ID) on delete restrict on update restrict;

alter table PRODUCTO_TALLAS
   add constraint FK_TALLAS_PRODUCTOS foreign key (PRODUCTO_ID)
      references PRODUCTOS (ID) on delete cascade on update restrict;

alter table METODOS_PAGO
   add constraint FK_METODOS_PAGO_CLIENTES foreign key (CLIENTE_ID)
      references CLIENTES (ID) on delete cascade on update restrict;

alter table PEDIDOS
   add constraint FK_PEDIDOS_CLIENTES foreign key (CLIENTE_ID)
      references CLIENTES (ID) on delete restrict on update restrict;

alter table PEDIDOS
   add constraint FK_PEDIDOS_TIENDAS foreign key (TIENDA_ID)
      references TIENDAS (ID) on delete restrict on update restrict;

alter table PEDIDOS
   add constraint FK_PEDIDOS_METODOS_PAGO foreign key (METODO_PAGO_ID)
      references METODOS_PAGO (ID) on delete restrict on update restrict;

alter table DETALLE_PEDIDO
   add constraint FK_DETALLE_PEDIDOS foreign key (PEDIDO_ID)
      references PEDIDOS (ID) on delete cascade on update restrict;

alter table DETALLE_PEDIDO
   add constraint FK_DETALLE_PRODUCTOS foreign key (PRODUCTO_ID)
      references PRODUCTOS (ID) on delete restrict on update restrict;

alter table RESENAS
   add constraint FK_RESENAS_CLIENTES foreign key (CLIENTE_ID)
      references CLIENTES (ID) on delete cascade on update restrict;

alter table RESENAS
   add constraint FK_RESENAS_PRODUCTOS foreign key (PRODUCTO_ID)
      references PRODUCTOS (ID) on delete cascade on update restrict;
