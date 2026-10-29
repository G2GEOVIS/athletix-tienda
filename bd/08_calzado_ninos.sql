/*==============================================================*/
/* ATHLETIX - Calzado para niños y niñas (20 productos)          */
/* Género (prd_publico) + edad (prd_edad = 'Niño'):               */
/* Hombre + Niño = niños, Mujer + Niño = niñas. Tallas 28 a 35.  */
/* Fotos: diseños propios de ATHLETIX, sin marcas.               */
/*==============================================================*/
begin;

insert into producto (prd_codigo, cat_codigo, prd_nombre, prd_descripcion, prd_publico, prd_edad, prd_precio, prd_usa_talla, prd_etiqueta, prd_caracteristicas, prd_ficha) values
  ('kn01', 1, 'Pequeño Veloz Azul', 'Zapatilla para correr pensada para niños activos. Su malla azul deja respirar el pie y la suela acolchada amortigua en el recreo, la pista o el parque.', 'Hombre', 'Niño', 49.99, true, 'Nuevo', 'Malla transpirable y liviana
Suela acolchada que absorbe impactos
Detalles naranja de alta visibilidad', 'Edad: 4 a 11 años
Cierre: Cordones
Material: Malla y EVA
Uso ideal: Correr y jugar
Tallas: 28 – 35 (EU)'),
  ('kn02', 1, 'Brinco Velcro Lima', 'Zapatilla con dos correas de velcro para que el niño se la ponga solo y rápido. Puntera reforzada para los juegos más bruscos.', 'Hombre', 'Niño', 39.99, true, null, 'Doble correa de velcro
Puntera reforzada
Suela antideslizante', 'Edad: 4 a 11 años
Cierre: Velcro
Material: Cuero sintético
Uso ideal: Uso diario y escuela
Tallas: 28 – 35 (EU)'),
  ('kn03', 1, 'Escolar Clásico Negro', 'Zapatilla negra de líneas simples que cumple con el uniforme escolar y aguanta todo el día de clases y educación física.', 'Hombre', 'Niño', 44.99, true, null, 'Material fácil de limpiar
Plantilla acolchada
Suela de goma resistente', 'Edad: 4 a 11 años
Cierre: Cordones
Material: Cuero sintético
Uso ideal: Escuela y uniforme
Tallas: 28 – 35 (EU)'),
  ('kn04', 1, 'Multideporte Rojo Rayo', 'Zapatilla multideporte con suela de buen agarre para fútbol en patio, básquet y carreras. Liviana y firme a la vez.', 'Hombre', 'Niño', 47.99, true, null, 'Suela de goma con agarre multidireccional
Paneles de refuerzo laterales
Interior acolchado', 'Edad: 4 a 11 años
Cierre: Cordones
Material: Malla y sintético
Uso ideal: Educación física
Tallas: 28 – 35 (EU)'),
  ('kn05', 1, 'Sendero Junior Grafito', 'Zapatilla de montaña para niños con suela de tacos profundos. Perfecta para excursiones, campamentos y caminatas en tierra.', 'Hombre', 'Niño', 59.99, true, null, 'Suela de tacos para tierra y piedra
Puntera protectora
Malla resistente al roce', 'Edad: 4 a 11 años
Cierre: Cordones
Material: Malla y goma
Uso ideal: Caminatas y excursiones
Tallas: 28 – 35 (EU)'),
  ('kn06', 1, 'Clavada Junior Marino', 'Zapatilla de básquet de caña media con cuello acolchado que sujeta el tobillo en saltos y cambios de dirección.', 'Hombre', 'Niño', 64.99, true, 'Nuevo', 'Caña media que protege el tobillo
Mediasuela gruesa con amortiguación
Tejido de punto transpirable', 'Edad: 4 a 11 años
Cierre: Cordones
Material: Tejido de punto
Uso ideal: Básquet
Tallas: 28 – 35 (EU)'),
  ('kn07', 1, 'Futsal Junior Neón', 'Zapatilla de fútbol sala para niños con suela plana de goma que no marca la cancha y da un control preciso del balón.', 'Hombre', 'Niño', 42.99, true, null, 'Suela de goma que no marca
Empeine con buen toque de balón
Puntera reforzada', 'Edad: 4 a 11 años
Cierre: Cordones
Material: Sintético
Uso ideal: Fútbol sala
Tallas: 28 – 35 (EU)'),
  ('kn08', 1, 'Sin Cordones Gris Ágil', 'Zapatilla sin amarrar con cordones elásticos: se pone y se quita en segundos. Ideal para niños que aún no se atan los zapatos.', 'Hombre', 'Niño', 39.99, true, null, 'Cordones elásticos fijos
Tejido de punto flexible
Suela ultraliviana', 'Edad: 4 a 11 años
Cierre: Cordones elásticos
Material: Tejido de punto
Uso ideal: Uso diario
Tallas: 28 – 35 (EU)'),
  ('kn09', 1, 'Lona Oliva Recreo', 'Zapatilla de lona color oliva, fresca y cómoda para el día a día. Puntera de goma que resiste los juegos en el patio.', 'Hombre', 'Niño', 34.99, true, null, 'Lona de algodón transpirable
Puntera de goma
Suela vulcanizada flexible', 'Edad: 4 a 11 años
Cierre: Cordones
Material: Lona
Uso ideal: Uso diario
Tallas: 28 – 35 (EU)'),
  ('kn10', 1, 'Luces Rojas Turbo', 'Zapatilla con luces LED en la suela que se encienden con cada paso. Velcro y cordón elástico para ponérsela solo.', 'Hombre', 'Niño', 54.99, true, 'Nuevo', 'Luces LED que se activan al pisar
Correa de velcro
Malla liviana y transpirable', 'Edad: 4 a 11 años
Cierre: Velcro y cordón elástico
Material: Malla y sintético
Uso ideal: Uso diario y juego
Tallas: 28 – 35 (EU)'),
  ('ka01', 1, 'Pequeña Veloz Rosa', 'Zapatilla para correr pensada para niñas activas. Malla rosa que deja respirar el pie y suela acolchada para jugar y correr todo el día.', 'Mujer', 'Niño', 49.99, true, 'Nuevo', 'Malla transpirable y liviana
Suela acolchada que absorbe impactos
Detalles morados que dan estabilidad', 'Edad: 4 a 11 años
Cierre: Cordones
Material: Malla y EVA
Uso ideal: Correr y jugar
Tallas: 28 – 35 (EU)'),
  ('ka02', 1, 'Brinco Velcro Lila', 'Zapatilla lila con dos correas de velcro para ponérsela sola y rápido. Puntera reforzada y suela que no resbala.', 'Mujer', 'Niño', 39.99, true, null, 'Doble correa de velcro
Puntera reforzada
Suela antideslizante', 'Edad: 4 a 11 años
Cierre: Velcro
Material: Cuero sintético
Uso ideal: Uso diario y escuela
Tallas: 28 – 35 (EU)'),
  ('ka03', 1, 'Escolar Blanca Clásica', 'Zapatilla blanca de líneas simples con un toque rosa en el talón. Cumple con el uniforme de educación física y se limpia con facilidad.', 'Mujer', 'Niño', 44.99, true, null, 'Material fácil de limpiar
Plantilla acolchada
Suela de goma resistente', 'Edad: 4 a 11 años
Cierre: Cordones
Material: Cuero sintético
Uso ideal: Escuela y uniforme
Tallas: 28 – 35 (EU)'),
  ('ka04', 1, 'Luces Holográficas', 'Zapatilla plateada holográfica con luces LED rosadas que se encienden al pisar. Velcro y cordón elástico para ponérsela sola.', 'Mujer', 'Niño', 57.99, true, 'Nuevo', 'Luces LED que se activan al pisar
Paneles holográficos
Correa de velcro', 'Edad: 4 a 11 años
Cierre: Velcro y cordón elástico
Material: Malla y sintético
Uso ideal: Uso diario y juego
Tallas: 28 – 35 (EU)'),
  ('ka05', 1, 'Sendero Junior Turquesa', 'Zapatilla de montaña para niñas con suela de tacos y puntera protectora. Lista para excursiones, campamentos y caminatas.', 'Mujer', 'Niño', 59.99, true, null, 'Suela de tacos para tierra y piedra
Puntera protectora
Malla resistente al roce', 'Edad: 4 a 11 años
Cierre: Cordones
Material: Malla y goma
Uso ideal: Caminatas y excursiones
Tallas: 28 – 35 (EU)'),
  ('ka06', 1, 'Sin Cordones Menta', 'Zapatilla de punto color menta sin cordones: se pone en segundos y se adapta al pie como un calcetín.', 'Mujer', 'Niño', 39.99, true, null, 'Tejido de punto elástico
Tirador en el talón
Suela ultraliviana', 'Edad: 4 a 11 años
Cierre: Sin cordones
Material: Tejido de punto
Uso ideal: Uso diario
Tallas: 28 – 35 (EU)'),
  ('ka07', 1, 'Futsal Junior Fucsia', 'Zapatilla de fútbol sala para niñas con suela plana que no marca la cancha y da buen control del balón.', 'Mujer', 'Niño', 42.99, true, null, 'Suela de goma que no marca
Empeine con buen toque de balón
Puntera reforzada', 'Edad: 4 a 11 años
Cierre: Cordones
Material: Sintético
Uso ideal: Fútbol sala
Tallas: 28 – 35 (EU)'),
  ('ka08', 1, 'Gimnasia Oro Rosa', 'Zapatilla liviana y muy flexible para gimnasia, baile y danza. Suela delgada que deja sentir el piso y girar con facilidad.', 'Mujer', 'Niño', 44.99, true, null, 'Suela delgada y flexible
Detalles en oro rosa
Muy liviana', 'Edad: 4 a 11 años
Cierre: Cordones
Material: Textil
Uso ideal: Gimnasia y baile
Tallas: 28 – 35 (EU)'),
  ('ka09', 1, 'Lona Celeste Recreo', 'Zapatilla de lona celeste, fresca y cómoda para el día a día. Puntera de goma que resiste el juego en el patio.', 'Mujer', 'Niño', 34.99, true, null, 'Lona de algodón transpirable
Puntera de goma
Suela vulcanizada flexible', 'Edad: 4 a 11 años
Cierre: Cordones
Material: Lona
Uso ideal: Uso diario
Tallas: 28 – 35 (EU)'),
  ('ka10', 1, 'Clavada Junior Violeta', 'Zapatilla de básquet de caña media para niñas, con cuello acolchado violeta que sujeta el tobillo en saltos y giros.', 'Mujer', 'Niño', 64.99, true, null, 'Caña media que protege el tobillo
Mediasuela gruesa con amortiguación
Tejido de punto transpirable', 'Edad: 4 a 11 años
Cierre: Cordones
Material: Tejido de punto
Uso ideal: Básquet
Tallas: 28 – 35 (EU)')
on conflict (prd_codigo) do nothing;

insert into producto_talla (prd_codigo, pta_talla, pta_stock) values
  ('kn01', '28', 18),
  ('kn01', '29', 12),
  ('kn01', '30', 20),
  ('kn01', '31', 9),
  ('kn01', '32', 10),
  ('kn01', '33', 25),
  ('kn01', '34', 11),
  ('kn01', '35', 19),
  ('kn02', '28', 9),
  ('kn02', '29', 24),
  ('kn02', '30', 14),
  ('kn02', '31', 9),
  ('kn02', '32', 10),
  ('kn02', '33', 21),
  ('kn02', '34', 21),
  ('kn02', '35', 10),
  ('kn03', '28', 15),
  ('kn03', '29', 10),
  ('kn03', '30', 25),
  ('kn03', '31', 21),
  ('kn03', '32', 9),
  ('kn03', '33', 11),
  ('kn03', '34', 15),
  ('kn03', '35', 9),
  ('kn04', '28', 20),
  ('kn04', '29', 9),
  ('kn04', '30', 15),
  ('kn04', '31', 9),
  ('kn04', '32', 25),
  ('kn04', '33', 12),
  ('kn04', '34', 17),
  ('kn04', '35', 21),
  ('kn05', '28', 12),
  ('kn05', '29', 25),
  ('kn05', '30', 11),
  ('kn05', '31', 17),
  ('kn05', '32', 25),
  ('kn05', '33', 13),
  ('kn05', '34', 11),
  ('kn05', '35', 14),
  ('kn06', '28', 19),
  ('kn06', '29', 11),
  ('kn06', '30', 25),
  ('kn06', '31', 10),
  ('kn06', '32', 9),
  ('kn06', '33', 14),
  ('kn06', '34', 23),
  ('kn06', '35', 25),
  ('kn07', '28', 21),
  ('kn07', '29', 18),
  ('kn07', '30', 22),
  ('kn07', '31', 22),
  ('kn07', '32', 19),
  ('kn07', '33', 17),
  ('kn07', '34', 15),
  ('kn07', '35', 13),
  ('kn08', '28', 15),
  ('kn08', '29', 10),
  ('kn08', '30', 17),
  ('kn08', '31', 24),
  ('kn08', '32', 23),
  ('kn08', '33', 18),
  ('kn08', '34', 22),
  ('kn08', '35', 17),
  ('kn09', '28', 10),
  ('kn09', '29', 11),
  ('kn09', '30', 24),
  ('kn09', '31', 21),
  ('kn09', '32', 13),
  ('kn09', '33', 18),
  ('kn09', '34', 12),
  ('kn09', '35', 23),
  ('kn10', '28', 21),
  ('kn10', '29', 9),
  ('kn10', '30', 10),
  ('kn10', '31', 25),
  ('kn10', '32', 18),
  ('kn10', '33', 18),
  ('kn10', '34', 19),
  ('kn10', '35', 23),
  ('ka01', '28', 22),
  ('ka01', '29', 10),
  ('ka01', '30', 10),
  ('ka01', '31', 16),
  ('ka01', '32', 23),
  ('ka01', '33', 10),
  ('ka01', '34', 9),
  ('ka01', '35', 17),
  ('ka02', '28', 22),
  ('ka02', '29', 17),
  ('ka02', '30', 20),
  ('ka02', '31', 19),
  ('ka02', '32', 8),
  ('ka02', '33', 22),
  ('ka02', '34', 19),
  ('ka02', '35', 13),
  ('ka03', '28', 11),
  ('ka03', '29', 23),
  ('ka03', '30', 9),
  ('ka03', '31', 14),
  ('ka03', '32', 17),
  ('ka03', '33', 12),
  ('ka03', '34', 15),
  ('ka03', '35', 20),
  ('ka04', '28', 20),
  ('ka04', '29', 23),
  ('ka04', '30', 10),
  ('ka04', '31', 13),
  ('ka04', '32', 22),
  ('ka04', '33', 20),
  ('ka04', '34', 25),
  ('ka04', '35', 16),
  ('ka05', '28', 12),
  ('ka05', '29', 21),
  ('ka05', '30', 25),
  ('ka05', '31', 16),
  ('ka05', '32', 21),
  ('ka05', '33', 19),
  ('ka05', '34', 20),
  ('ka05', '35', 15),
  ('ka06', '28', 12),
  ('ka06', '29', 10),
  ('ka06', '30', 13),
  ('ka06', '31', 12),
  ('ka06', '32', 15),
  ('ka06', '33', 15),
  ('ka06', '34', 8),
  ('ka06', '35', 23),
  ('ka07', '28', 13),
  ('ka07', '29', 16),
  ('ka07', '30', 17),
  ('ka07', '31', 8),
  ('ka07', '32', 12),
  ('ka07', '33', 21),
  ('ka07', '34', 25),
  ('ka07', '35', 19),
  ('ka08', '28', 18),
  ('ka08', '29', 12),
  ('ka08', '30', 24),
  ('ka08', '31', 9),
  ('ka08', '32', 22),
  ('ka08', '33', 25),
  ('ka08', '34', 20),
  ('ka08', '35', 20),
  ('ka09', '28', 20),
  ('ka09', '29', 20),
  ('ka09', '30', 11),
  ('ka09', '31', 23),
  ('ka09', '32', 20),
  ('ka09', '33', 9),
  ('ka09', '34', 14),
  ('ka09', '35', 10),
  ('ka10', '28', 14),
  ('ka10', '29', 22),
  ('ka10', '30', 13),
  ('ka10', '31', 11),
  ('ka10', '32', 18),
  ('ka10', '33', 9),
  ('ka10', '34', 11),
  ('ka10', '35', 8)
on conflict (prd_codigo, pta_talla) do nothing;

insert into producto_imagen (prd_codigo, pim_orden, pim_url, pim_descripcion) values
  ('kn01', 1, 'img/productos/kn01-1.jpg', 'vista principal'),
  ('kn01', 2, 'img/productos/kn01-2.jpg', 'vista del otro lado'),
  ('kn01', 3, 'img/productos/kn01-3.jpg', 'detalle de la punta y la suela'),
  ('kn02', 1, 'img/productos/kn02-1.jpg', 'vista principal'),
  ('kn02', 2, 'img/productos/kn02-2.jpg', 'vista del otro lado'),
  ('kn02', 3, 'img/productos/kn02-3.jpg', 'detalle de la punta y la suela'),
  ('kn03', 1, 'img/productos/kn03-1.jpg', 'vista principal'),
  ('kn03', 2, 'img/productos/kn03-2.jpg', 'vista del otro lado'),
  ('kn03', 3, 'img/productos/kn03-3.jpg', 'detalle de la punta y la suela'),
  ('kn04', 1, 'img/productos/kn04-1.jpg', 'vista principal'),
  ('kn04', 2, 'img/productos/kn04-2.jpg', 'vista del otro lado'),
  ('kn04', 3, 'img/productos/kn04-3.jpg', 'detalle de la punta y la suela'),
  ('kn05', 1, 'img/productos/kn05-1.jpg', 'vista principal'),
  ('kn05', 2, 'img/productos/kn05-2.jpg', 'vista del otro lado'),
  ('kn05', 3, 'img/productos/kn05-3.jpg', 'detalle de la punta y la suela'),
  ('kn06', 1, 'img/productos/kn06-1.jpg', 'vista principal'),
  ('kn06', 2, 'img/productos/kn06-2.jpg', 'vista del otro lado'),
  ('kn06', 3, 'img/productos/kn06-3.jpg', 'detalle de la punta y la suela'),
  ('kn07', 1, 'img/productos/kn07-1.jpg', 'vista principal'),
  ('kn07', 2, 'img/productos/kn07-2.jpg', 'vista del otro lado'),
  ('kn07', 3, 'img/productos/kn07-3.jpg', 'detalle de la punta y la suela'),
  ('kn08', 1, 'img/productos/kn08-1.jpg', 'vista principal'),
  ('kn08', 2, 'img/productos/kn08-2.jpg', 'vista del otro lado'),
  ('kn08', 3, 'img/productos/kn08-3.jpg', 'detalle de la punta y la suela'),
  ('kn09', 1, 'img/productos/kn09-1.jpg', 'vista principal'),
  ('kn09', 2, 'img/productos/kn09-2.jpg', 'vista del otro lado'),
  ('kn09', 3, 'img/productos/kn09-3.jpg', 'detalle de la punta y la suela'),
  ('kn10', 1, 'img/productos/kn10-1.jpg', 'vista principal'),
  ('kn10', 2, 'img/productos/kn10-2.jpg', 'vista del otro lado'),
  ('kn10', 3, 'img/productos/kn10-3.jpg', 'detalle de la punta y la suela'),
  ('ka01', 1, 'img/productos/ka01-1.jpg', 'vista principal'),
  ('ka01', 2, 'img/productos/ka01-2.jpg', 'vista del otro lado'),
  ('ka01', 3, 'img/productos/ka01-3.jpg', 'detalle de la punta y la suela'),
  ('ka02', 1, 'img/productos/ka02-1.jpg', 'vista principal'),
  ('ka02', 2, 'img/productos/ka02-2.jpg', 'vista del otro lado'),
  ('ka02', 3, 'img/productos/ka02-3.jpg', 'detalle de la punta y la suela'),
  ('ka03', 1, 'img/productos/ka03-1.jpg', 'vista principal'),
  ('ka03', 2, 'img/productos/ka03-2.jpg', 'vista del otro lado'),
  ('ka03', 3, 'img/productos/ka03-3.jpg', 'detalle de la punta y la suela'),
  ('ka04', 1, 'img/productos/ka04-1.jpg', 'vista principal'),
  ('ka04', 2, 'img/productos/ka04-2.jpg', 'vista del otro lado'),
  ('ka04', 3, 'img/productos/ka04-3.jpg', 'detalle de la punta y la suela'),
  ('ka05', 1, 'img/productos/ka05-1.jpg', 'vista principal'),
  ('ka05', 2, 'img/productos/ka05-2.jpg', 'vista del otro lado'),
  ('ka05', 3, 'img/productos/ka05-3.jpg', 'detalle de la punta y la suela'),
  ('ka06', 1, 'img/productos/ka06-1.jpg', 'vista principal'),
  ('ka06', 2, 'img/productos/ka06-2.jpg', 'vista del otro lado'),
  ('ka06', 3, 'img/productos/ka06-3.jpg', 'detalle de la punta y la suela'),
  ('ka07', 1, 'img/productos/ka07-1.jpg', 'vista principal'),
  ('ka07', 2, 'img/productos/ka07-2.jpg', 'vista del otro lado'),
  ('ka07', 3, 'img/productos/ka07-3.jpg', 'detalle de la punta y la suela'),
  ('ka08', 1, 'img/productos/ka08-1.jpg', 'vista principal'),
  ('ka08', 2, 'img/productos/ka08-2.jpg', 'vista del otro lado'),
  ('ka08', 3, 'img/productos/ka08-3.jpg', 'detalle de la punta y la suela'),
  ('ka09', 1, 'img/productos/ka09-1.jpg', 'vista principal'),
  ('ka09', 2, 'img/productos/ka09-2.jpg', 'vista del otro lado'),
  ('ka09', 3, 'img/productos/ka09-3.jpg', 'detalle de la punta y la suela'),
  ('ka10', 1, 'img/productos/ka10-1.jpg', 'vista principal'),
  ('ka10', 2, 'img/productos/ka10-2.jpg', 'vista del otro lado'),
  ('ka10', 3, 'img/productos/ka10-3.jpg', 'detalle de la punta y la suela')
on conflict (prd_codigo, pim_orden) do nothing;

commit;
