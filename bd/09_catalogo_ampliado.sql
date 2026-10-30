/*==============================================================*/
/* ATHLETIX - Catálogo ampliado                                  */
/*  - Calzado: 20 Hombre, 20 Mujer y 20 Unisex                   */
/*  - Tecnología: 15 Hombre y 15 Mujer (sin Unisex)              */
/* Productos de la línea propia ATHLETIX (sin marcas reales).    */
/*==============================================================*/
begin;

-- Tecnología ya no tiene productos unisex
update producto set prd_publico = 'Hombre' where prd_codigo in ('sa', 'cb', 'sp');
update producto set prd_publico = 'Mujer'  where prd_codigo = 'hb';

insert into producto (prd_codigo, cat_codigo, prd_nombre, prd_descripcion, prd_publico, prd_precio, prd_usa_talla, prd_etiqueta, prd_caracteristicas, prd_ficha) values
  ('zh11', 1, 'ATHLETIX Impulso Carbono', 'Zapatilla de competencia con placa de carbono y espuma de alto retorno. Pensada para bajar tus marcas en 10K, media maratón y maratón.', 'Hombre', 159.99, true, 'Nuevo', 'Placa de carbono de longitud completa
Espuma ultraligera de alto retorno
Malla técnica que no retiene sudor', 'Peso: ≈220 g
Desnivel (drop): 8 mm
Amortiguación: Espuma de alto retorno + placa de carbono
Uso ideal: Competencia
Tallas: 39 – 45 (EU)'),
  ('zh12', 1, 'ATHLETIX Ruta Diaria', 'Zapatilla cómoda y versátil para tus kilómetros de todos los días. Tejido de punto suave y amortiguación equilibrada.', 'Hombre', 99.99, true, null, 'Tejido de punto suave y transpirable
Amortiguación equilibrada
Suela de goma duradera', 'Peso: ≈280 g
Desnivel (drop): 10 mm
Amortiguación: Espuma estándar de doble capa
Uso ideal: Entrenamiento diario
Tallas: 39 – 45 (EU)'),
  ('zh13', 1, 'ATHLETIX Cumbre Trail', 'Zapatilla de trail para senderos técnicos. Tacos profundos, puntera protectora y malla resistente al roce.', 'Hombre', 129.99, true, null, 'Suela con tacos de 5 mm
Puntera de goma protectora
Malla resistente a la abrasión', 'Peso: ≈310 g
Desnivel (drop): 6 mm
Amortiguación: Espuma firme para terreno irregular
Uso ideal: Trail y montaña
Tallas: 39 – 45 (EU)'),
  ('zh14', 1, 'ATHLETIX Fuerza Gym', 'Zapatilla de entrenamiento funcional con base plana y estable para sentadillas, saltos y trepa de cuerda.', 'Hombre', 94.99, true, null, 'Base plana y estable
Protector lateral para trepa de cuerda
Talón firme', 'Peso: ≈300 g
Desnivel (drop): 4 mm
Amortiguación: Media, firme
Uso ideal: Gimnasio y funcional
Tallas: 39 – 45 (EU)'),
  ('zh15', 1, 'ATHLETIX Nube Max', 'Máxima amortiguación para rodajes largos y recuperación. Su suela balancín hace que cada paso sea suave.', 'Hombre', 139.99, true, null, 'Espuma extragruesa y suave
Suela balancín
Collar acolchado', 'Peso: ≈295 g
Desnivel (drop): 5 mm
Amortiguación: Máxima
Uso ideal: Rodajes largos y recuperación
Tallas: 39 – 45 (EU)'),
  ('zh16', 1, 'ATHLETIX Tempo Ligera', 'Zapatilla liviana y reactiva para series, cambios de ritmo y carreras cortas.', 'Hombre', 119.99, true, null, 'Muy liviana
Mediasuela reactiva
Malla abierta de secado rápido', 'Peso: ≈210 g
Desnivel (drop): 8 mm
Amortiguación: Espuma reactiva
Uso ideal: Series y ritmos rápidos
Tallas: 39 – 45 (EU)'),
  ('zh17', 1, 'ATHLETIX Cancha Pro', 'Zapatilla de básquet de caña alta con cuello acolchado y suela de gran agarre para cortes y saltos.', 'Hombre', 134.99, true, 'Nuevo', 'Caña alta que protege el tobillo
Suela de goma con patrón de agarre
Amortiguación en talón y antepié', 'Peso: ≈420 g
Desnivel (drop): 10 mm
Amortiguación: Alta en talón y antepié
Uso ideal: Básquet
Tallas: 39 – 45 (EU)'),
  ('zh18', 1, 'ATHLETIX Futsal Control', 'Zapatilla de fútbol sala con suela de goma que no marca y empeine para un toque preciso del balón.', 'Hombre', 79.99, true, null, 'Suela de goma que no marca
Empeine de cuero sintético
Puntera reforzada', 'Peso: ≈270 g
Desnivel (drop): 6 mm
Amortiguación: Baja
Uso ideal: Fútbol sala
Tallas: 39 – 45 (EU)'),
  ('zm11', 1, 'ATHLETIX Impulso Carbono Mujer', 'Zapatilla de competencia para mujer con placa de carbono y espuma de alto retorno, ideal para buscar tu mejor marca.', 'Mujer', 159.99, true, 'Nuevo', 'Placa de carbono de longitud completa
Espuma ultraligera de alto retorno
Horma específica para mujer', 'Peso: ≈190 g
Desnivel (drop): 8 mm
Amortiguación: Espuma de alto retorno + placa de carbono
Uso ideal: Competencia
Tallas: 35 – 41 (EU)'),
  ('zm12', 1, 'ATHLETIX Ruta Diaria Mujer', 'Zapatilla cómoda y versátil para mujer, perfecta para entrenar a diario con suavidad y estabilidad.', 'Mujer', 99.99, true, null, 'Tejido de punto suave
Amortiguación equilibrada
Horma específica para mujer', 'Peso: ≈240 g
Desnivel (drop): 10 mm
Amortiguación: Espuma estándar de doble capa
Uso ideal: Entrenamiento diario
Tallas: 35 – 41 (EU)'),
  ('zm13', 1, 'ATHLETIX Cumbre Trail Mujer', 'Zapatilla de trail para mujer con suela de tacos y puntera protectora, lista para senderos y montaña.', 'Mujer', 129.99, true, null, 'Suela con tacos de 5 mm
Puntera de goma protectora
Malla resistente a la abrasión', 'Peso: ≈270 g
Desnivel (drop): 6 mm
Amortiguación: Espuma firme para terreno irregular
Uso ideal: Trail y montaña
Tallas: 35 – 41 (EU)'),
  ('zm14', 1, 'ATHLETIX Fuerza Gym Mujer', 'Zapatilla de entrenamiento para mujer con base estable, ideal para pesas, clases y circuitos.', 'Mujer', 94.99, true, null, 'Base plana y estable
Detalles en oro rosa
Tejido de punto transpirable', 'Peso: ≈250 g
Desnivel (drop): 4 mm
Amortiguación: Media, firme
Uso ideal: Gimnasio y funcional
Tallas: 35 – 41 (EU)'),
  ('zm15', 1, 'ATHLETIX Nube Max Mujer', 'Máxima amortiguación para mujer en rodajes largos y días de recuperación.', 'Mujer', 139.99, true, null, 'Espuma extragruesa y suave
Suela balancín
Collar acolchado', 'Peso: ≈250 g
Desnivel (drop): 5 mm
Amortiguación: Máxima
Uso ideal: Rodajes largos y recuperación
Tallas: 35 – 41 (EU)'),
  ('zm16', 1, 'ATHLETIX Tempo Ligera Mujer', 'Zapatilla liviana y reactiva para mujer, pensada para series y cambios de ritmo.', 'Mujer', 119.99, true, null, 'Muy liviana
Mediasuela reactiva
Malla abierta de secado rápido', 'Peso: ≈185 g
Desnivel (drop): 8 mm
Amortiguación: Espuma reactiva
Uso ideal: Series y ritmos rápidos
Tallas: 35 – 41 (EU)'),
  ('zm17', 1, 'ATHLETIX Estudio Fit', 'Zapatilla tipo calcetín para clases de baile, aeróbicos y entrenamiento en estudio. Suela con punto de giro.', 'Mujer', 74.99, true, null, 'Ajuste tipo calcetín
Punto de giro en la suela
Muy flexible', 'Peso: ≈190 g
Desnivel (drop): 4 mm
Amortiguación: Ligera
Uso ideal: Baile y clases en estudio
Tallas: 35 – 41 (EU)'),
  ('zm18', 1, 'ATHLETIX Caminata Confort', 'Zapatilla para caminar todo el día con plantilla acolchada y materiales suaves.', 'Mujer', 84.99, true, null, 'Plantilla acolchada extraíble
Gamuza sintética y malla
Suela flexible antideslizante', 'Peso: ≈260 g
Desnivel (drop): 8 mm
Amortiguación: Suave
Uso ideal: Caminata y uso diario
Tallas: 35 – 41 (EU)'),
  ('zu01', 1, 'ATHLETIX Sendero Roca', 'Zapato de senderismo de caña baja en nobuk y malla, firme y cómodo para caminatas largas.', 'Unisex', 109.99, true, null, 'Nobuk y malla resistentes
Suela de tacos profundos
Puntera protectora', 'Peso: ≈380 g
Desnivel (drop): 10 mm
Amortiguación: Firme
Uso ideal: Senderismo
Tallas: 36 – 45 (EU)'),
  ('zu02', 1, 'ATHLETIX Slide Recuperación', 'Sandalia de recuperación con espuma gruesa y suave para descansar los pies después de entrenar.', 'Unisex', 39.99, true, null, 'Espuma gruesa que absorbe impactos
Plantilla anatómica
Tira acolchada', 'Peso: ≈220 g
Desnivel (drop): —
Amortiguación: Muy suave
Uso ideal: Recuperación
Tallas: 36 – 45 (EU)'),
  ('zu03', 1, 'ATHLETIX Urbano Negro', 'Zapatilla negra minimalista para correr y para el día a día. Combina con todo.', 'Unisex', 89.99, true, null, 'Tejido de punto negro
Mediasuela ligera
Diseño limpio', 'Peso: ≈250 g
Desnivel (drop): 8 mm
Amortiguación: Media
Uso ideal: Running urbano y uso diario
Tallas: 36 – 45 (EU)'),
  ('zu04', 1, 'ATHLETIX Clásico Retro', 'Zapatilla de estilo retro inspirada en el jogging clásico, con gamuza y suela de goma natural.', 'Unisex', 94.99, true, null, 'Gamuza y malla
Suela de goma natural
Plantilla acolchada', 'Peso: ≈300 g
Desnivel (drop): 10 mm
Amortiguación: Media
Uso ideal: Uso diario
Tallas: 36 – 45 (EU)'),
  ('zu05', 1, 'ATHLETIX Agua Trail', 'Zapato acuático de secado rápido con orificios de drenaje, ideal para ríos, playa y deportes de agua.', 'Unisex', 59.99, true, null, 'Malla de secado rápido
Orificios de drenaje
Suela de goma antideslizante', 'Peso: ≈200 g
Desnivel (drop): 0 mm
Amortiguación: Mínima
Uso ideal: Agua y playa
Tallas: 36 – 45 (EU)'),
  ('zu06', 1, 'ATHLETIX Cross Box', 'Zapatilla para entrenamiento cruzado y levantamiento con talón firme y base plana.', 'Unisex', 109.99, true, null, 'Talón con refuerzo
Base plana muy estable
Paneles laterales resistentes', 'Peso: ≈320 g
Desnivel (drop): 4 mm
Amortiguación: Firme
Uso ideal: Entrenamiento cruzado
Tallas: 36 – 45 (EU)'),
  ('zu07', 1, 'ATHLETIX Court Pádel', 'Zapatilla para tenis y pádel con suela de espiga y puntera reforzada para arrastres.', 'Unisex', 89.99, true, null, 'Suela de espiga para pista
Puntera reforzada
Soporte lateral', 'Peso: ≈340 g
Desnivel (drop): 8 mm
Amortiguación: Media
Uso ideal: Tenis y pádel
Tallas: 36 – 45 (EU)'),
  ('zu08', 1, 'ATHLETIX Ultraligera Knit', 'Zapatilla ultraligera de punto, cómoda como un calcetín, para correr y caminar.', 'Unisex', 84.99, true, null, 'Tejido de punto elástico
Muy liviana
Suela flexible', 'Peso: ≈190 g
Desnivel (drop): 6 mm
Amortiguación: Ligera
Uso ideal: Running suave y uso diario
Tallas: 36 – 45 (EU)'),
  ('zu09', 1, 'ATHLETIX Reflectiva Noche', 'Zapatilla con capellada reflectiva para correr seguro de noche o con poca luz.', 'Unisex', 119.99, true, null, 'Capellada reflectiva 360°
Detalles neón de alta visibilidad
Amortiguación media', 'Peso: ≈260 g
Desnivel (drop): 8 mm
Amortiguación: Media
Uso ideal: Running nocturno
Tallas: 36 – 45 (EU)'),
  ('zu10', 1, 'ATHLETIX Montaña Mid', 'Bota de caña media impermeable para senderismo, con buen soporte de tobillo y suela de agarre.', 'Unisex', 139.99, true, null, 'Membrana impermeable
Caña media con soporte de tobillo
Suela de tacos profundos', 'Peso: ≈480 g
Desnivel (drop): 12 mm
Amortiguación: Firme
Uso ideal: Senderismo y montaña
Tallas: 36 – 45 (EU)'),
  ('zu11', 1, 'ATHLETIX Salto Vóley', 'Zapatilla de vóley para cancha cubierta con suela de goma que agarra y amortigua los saltos.', 'Unisex', 99.99, true, null, 'Suela de goma para cancha
Amortiguación para saltos
Malla transpirable', 'Peso: ≈320 g
Desnivel (drop): 8 mm
Amortiguación: Media
Uso ideal: Vóley y deportes de cancha
Tallas: 36 – 45 (EU)'),
  ('zu12', 1, 'ATHLETIX Maratón Plata', 'Zapatilla de maratón con capellada traslúcida ultraligera y espuma alta de gran retorno.', 'Unisex', 149.99, true, null, 'Capellada traslúcida ultraligera
Espuma alta de gran retorno
Detalles neón', 'Peso: ≈205 g
Desnivel (drop): 8 mm
Amortiguación: Alta
Uso ideal: Maratón
Tallas: 36 – 45 (EU)'),
  ('zu13', 1, 'ATHLETIX Ciclo Indoor', 'Zapatilla de ciclismo indoor con suela rígida, correas de velcro y hebilla, compatible con calas.', 'Unisex', 119.99, true, null, 'Suela rígida compatible con calas
Dos velcros y hebilla
Ventilación perforada', 'Peso: ≈320 g
Desnivel (drop): —
Amortiguación: Ninguna (suela rígida)
Uso ideal: Ciclismo indoor y spinning
Tallas: 36 – 45 (EU)'),
  ('zu14', 1, 'ATHLETIX Escalada Approach', 'Zapatilla de aproximación con goma adherente y cordones hasta la punta para escalada y roca.', 'Unisex', 109.99, true, null, 'Goma adherente
Cordones hasta la punta
Reborde de goma protector', 'Peso: ≈350 g
Desnivel (drop): 6 mm
Amortiguación: Firme
Uso ideal: Escalada y aproximación
Tallas: 36 – 45 (EU)'),
  ('zu15', 1, 'ATHLETIX Natural Barefoot', 'Zapatilla minimalista con suela delgada y puntera ancha para un movimiento natural del pie.', 'Unisex', 79.99, true, null, 'Suela de 5 mm muy flexible
Puntera ancha
Sin desnivel', 'Peso: ≈180 g
Desnivel (drop): 0 mm
Amortiguación: Mínima
Uso ideal: Movimiento natural
Tallas: 36 – 45 (EU)'),
  ('zu16', 1, 'ATHLETIX Reposo Foam', 'Calzado de recuperación sin cordones con espuma suave y suela balancín para después de entrenar.', 'Unisex', 49.99, true, null, 'Espuma suave de una pieza
Suela balancín
Fácil de poner y quitar', 'Peso: ≈240 g
Desnivel (drop): 6 mm
Amortiguación: Muy suave
Uso ideal: Recuperación
Tallas: 36 – 45 (EU)'),
  ('zu17', 1, 'ATHLETIX Senderismo Ligero', 'Zapatilla de senderismo liviana con malla y suela de tacos, ideal para caminatas de un día.', 'Unisex', 99.99, true, null, 'Muy liviana
Malla transpirable
Suela de tacos', 'Peso: ≈330 g
Desnivel (drop): 10 mm
Amortiguación: Media
Uso ideal: Caminatas cortas
Tallas: 36 – 45 (EU)'),
  ('zu18', 1, 'ATHLETIX Pista Spikes', 'Zapatilla de clavos para velocidad en pista de atletismo, con placa rígida y clavos intercambiables.', 'Unisex', 89.99, true, null, 'Placa rígida de propulsión
Clavos intercambiables
Capellada muy liviana', 'Peso: ≈160 g
Desnivel (drop): 0 mm
Amortiguación: Ninguna
Uso ideal: Velocidad en pista
Tallas: 36 – 45 (EU)'),
  ('zu19', 1, 'ATHLETIX Césped FG', 'Zapato de fútbol para césped natural con tapones moldeados y empeine ligero para un buen toque.', 'Unisex', 89.99, true, null, 'Tapones moldeados para césped
Empeine ligero
Ajuste firme', 'Peso: ≈230 g
Desnivel (drop): —
Amortiguación: Baja
Uso ideal: Fútbol en césped natural
Tallas: 36 – 45 (EU)'),
  ('tm16', 2, 'Audífonos de Conducción Ósea Lila', 'Audífonos de conducción ósea que dejan tus oídos libres para escuchar el entorno mientras corres. Livianos, resistentes al sudor y cómodos por horas.', 'Mujer', 89.99, false, 'Nuevo', 'Oídos libres para correr seguro
Resistentes al sudor (IP67)
Batería de hasta 8 horas', 'Tipo: Conducción ósea
Batería: Hasta 8 h
Resistencia: IP67
Peso: ≈29 g
Conexión: Bluetooth 5.3')
on conflict (prd_codigo) do nothing;

insert into producto_talla (prd_codigo, pta_talla, pta_stock) values
  ('zh11', '39', 18),
  ('zh11', '40', 20),
  ('zh11', '41', 18),
  ('zh11', '42', 18),
  ('zh11', '43', 20),
  ('zh11', '44', 20),
  ('zh11', '45', 12),
  ('zh12', '39', 12),
  ('zh12', '40', 20),
  ('zh12', '41', 18),
  ('zh12', '42', 25),
  ('zh12', '43', 20),
  ('zh12', '44', 12),
  ('zh12', '45', 10),
  ('zh13', '39', 18),
  ('zh13', '40', 15),
  ('zh13', '41', 12),
  ('zh13', '42', 10),
  ('zh13', '43', 20),
  ('zh13', '44', 25),
  ('zh13', '45', 25),
  ('zh14', '39', 10),
  ('zh14', '40', 20),
  ('zh14', '41', 18),
  ('zh14', '42', 18),
  ('zh14', '43', 25),
  ('zh14', '44', 25),
  ('zh14', '45', 20),
  ('zh15', '39', 25),
  ('zh15', '40', 12),
  ('zh15', '41', 20),
  ('zh15', '42', 10),
  ('zh15', '43', 20),
  ('zh15', '44', 10),
  ('zh15', '45', 10),
  ('zh16', '39', 10),
  ('zh16', '40', 12),
  ('zh16', '41', 12),
  ('zh16', '42', 20),
  ('zh16', '43', 10),
  ('zh16', '44', 18),
  ('zh16', '45', 15),
  ('zh17', '39', 18),
  ('zh17', '40', 20),
  ('zh17', '41', 12),
  ('zh17', '42', 20),
  ('zh17', '43', 12),
  ('zh17', '44', 25),
  ('zh17', '45', 15),
  ('zh18', '39', 18),
  ('zh18', '40', 10),
  ('zh18', '41', 25),
  ('zh18', '42', 10),
  ('zh18', '43', 18),
  ('zh18', '44', 25),
  ('zh18', '45', 15),
  ('zm11', '35', 18),
  ('zm11', '36', 20),
  ('zm11', '37', 10),
  ('zm11', '38', 25),
  ('zm11', '39', 15),
  ('zm11', '40', 15),
  ('zm11', '41', 12),
  ('zm12', '35', 20),
  ('zm12', '36', 15),
  ('zm12', '37', 10),
  ('zm12', '38', 10),
  ('zm12', '39', 20),
  ('zm12', '40', 10),
  ('zm12', '41', 18),
  ('zm13', '35', 10),
  ('zm13', '36', 15),
  ('zm13', '37', 18),
  ('zm13', '38', 10),
  ('zm13', '39', 10),
  ('zm13', '40', 25),
  ('zm13', '41', 10),
  ('zm14', '35', 12),
  ('zm14', '36', 12),
  ('zm14', '37', 10),
  ('zm14', '38', 18),
  ('zm14', '39', 18),
  ('zm14', '40', 25),
  ('zm14', '41', 18),
  ('zm15', '35', 18),
  ('zm15', '36', 10),
  ('zm15', '37', 20),
  ('zm15', '38', 25),
  ('zm15', '39', 12),
  ('zm15', '40', 25),
  ('zm15', '41', 15),
  ('zm16', '35', 15),
  ('zm16', '36', 10),
  ('zm16', '37', 15),
  ('zm16', '38', 15),
  ('zm16', '39', 10),
  ('zm16', '40', 18),
  ('zm16', '41', 10),
  ('zm17', '35', 12),
  ('zm17', '36', 12),
  ('zm17', '37', 25),
  ('zm17', '38', 10),
  ('zm17', '39', 10),
  ('zm17', '40', 10),
  ('zm17', '41', 18),
  ('zm18', '35', 18),
  ('zm18', '36', 12),
  ('zm18', '37', 25),
  ('zm18', '38', 20),
  ('zm18', '39', 12),
  ('zm18', '40', 18),
  ('zm18', '41', 20),
  ('zu01', '36', 12),
  ('zu01', '37', 25),
  ('zu01', '38', 12),
  ('zu01', '39', 18),
  ('zu01', '40', 25),
  ('zu01', '41', 18),
  ('zu01', '42', 10),
  ('zu01', '43', 18),
  ('zu01', '44', 18),
  ('zu01', '45', 12),
  ('zu02', '36', 10),
  ('zu02', '37', 15),
  ('zu02', '38', 20),
  ('zu02', '39', 15),
  ('zu02', '40', 10),
  ('zu02', '41', 12),
  ('zu02', '42', 12),
  ('zu02', '43', 18),
  ('zu02', '44', 20),
  ('zu02', '45', 25),
  ('zu03', '36', 20),
  ('zu03', '37', 10),
  ('zu03', '38', 10),
  ('zu03', '39', 12),
  ('zu03', '40', 12),
  ('zu03', '41', 18),
  ('zu03', '42', 15),
  ('zu03', '43', 10),
  ('zu03', '44', 20),
  ('zu03', '45', 15),
  ('zu04', '36', 15),
  ('zu04', '37', 18),
  ('zu04', '38', 10),
  ('zu04', '39', 10),
  ('zu04', '40', 10),
  ('zu04', '41', 12),
  ('zu04', '42', 20),
  ('zu04', '43', 25),
  ('zu04', '44', 12),
  ('zu04', '45', 10),
  ('zu05', '36', 20),
  ('zu05', '37', 15),
  ('zu05', '38', 15),
  ('zu05', '39', 20),
  ('zu05', '40', 18),
  ('zu05', '41', 12),
  ('zu05', '42', 20),
  ('zu05', '43', 18),
  ('zu05', '44', 20),
  ('zu05', '45', 12),
  ('zu06', '36', 18),
  ('zu06', '37', 12),
  ('zu06', '38', 25),
  ('zu06', '39', 12),
  ('zu06', '40', 15),
  ('zu06', '41', 12),
  ('zu06', '42', 20),
  ('zu06', '43', 12),
  ('zu06', '44', 25),
  ('zu06', '45', 12),
  ('zu07', '36', 12),
  ('zu07', '37', 25),
  ('zu07', '38', 25),
  ('zu07', '39', 20),
  ('zu07', '40', 12),
  ('zu07', '41', 25),
  ('zu07', '42', 18),
  ('zu07', '43', 18),
  ('zu07', '44', 20),
  ('zu07', '45', 10),
  ('zu08', '36', 18),
  ('zu08', '37', 10),
  ('zu08', '38', 10),
  ('zu08', '39', 10),
  ('zu08', '40', 10),
  ('zu08', '41', 20),
  ('zu08', '42', 15),
  ('zu08', '43', 12),
  ('zu08', '44', 25),
  ('zu08', '45', 25),
  ('zu09', '36', 18),
  ('zu09', '37', 15),
  ('zu09', '38', 18),
  ('zu09', '39', 20),
  ('zu09', '40', 18),
  ('zu09', '41', 15),
  ('zu09', '42', 20),
  ('zu09', '43', 12),
  ('zu09', '44', 25),
  ('zu09', '45', 10),
  ('zu10', '36', 12),
  ('zu10', '37', 12),
  ('zu10', '38', 18),
  ('zu10', '39', 20),
  ('zu10', '40', 25),
  ('zu10', '41', 20),
  ('zu10', '42', 20),
  ('zu10', '43', 10),
  ('zu10', '44', 15),
  ('zu10', '45', 12),
  ('zu11', '36', 12),
  ('zu11', '37', 25),
  ('zu11', '38', 10),
  ('zu11', '39', 10),
  ('zu11', '40', 15),
  ('zu11', '41', 18),
  ('zu11', '42', 18),
  ('zu11', '43', 12),
  ('zu11', '44', 10),
  ('zu11', '45', 10),
  ('zu12', '36', 12),
  ('zu12', '37', 15),
  ('zu12', '38', 15),
  ('zu12', '39', 20),
  ('zu12', '40', 20),
  ('zu12', '41', 12),
  ('zu12', '42', 10),
  ('zu12', '43', 15),
  ('zu12', '44', 12),
  ('zu12', '45', 18),
  ('zu13', '36', 15),
  ('zu13', '37', 25),
  ('zu13', '38', 25),
  ('zu13', '39', 25),
  ('zu13', '40', 20),
  ('zu13', '41', 20),
  ('zu13', '42', 12),
  ('zu13', '43', 20),
  ('zu13', '44', 10),
  ('zu13', '45', 10),
  ('zu14', '36', 18),
  ('zu14', '37', 15),
  ('zu14', '38', 25),
  ('zu14', '39', 15),
  ('zu14', '40', 10),
  ('zu14', '41', 10),
  ('zu14', '42', 20),
  ('zu14', '43', 25),
  ('zu14', '44', 10),
  ('zu14', '45', 18),
  ('zu15', '36', 10),
  ('zu15', '37', 25),
  ('zu15', '38', 15),
  ('zu15', '39', 15),
  ('zu15', '40', 12),
  ('zu15', '41', 10),
  ('zu15', '42', 10),
  ('zu15', '43', 18),
  ('zu15', '44', 20),
  ('zu15', '45', 15),
  ('zu16', '36', 25),
  ('zu16', '37', 10),
  ('zu16', '38', 25),
  ('zu16', '39', 25),
  ('zu16', '40', 25),
  ('zu16', '41', 12),
  ('zu16', '42', 15),
  ('zu16', '43', 15),
  ('zu16', '44', 10),
  ('zu16', '45', 25),
  ('zu17', '36', 18),
  ('zu17', '37', 10),
  ('zu17', '38', 18),
  ('zu17', '39', 10),
  ('zu17', '40', 18),
  ('zu17', '41', 20),
  ('zu17', '42', 10),
  ('zu17', '43', 20),
  ('zu17', '44', 25),
  ('zu17', '45', 18),
  ('zu18', '36', 18),
  ('zu18', '37', 20),
  ('zu18', '38', 10),
  ('zu18', '39', 20),
  ('zu18', '40', 10),
  ('zu18', '41', 10),
  ('zu18', '42', 10),
  ('zu18', '43', 25),
  ('zu18', '44', 10),
  ('zu18', '45', 15),
  ('zu19', '36', 18),
  ('zu19', '37', 25),
  ('zu19', '38', 15),
  ('zu19', '39', 18),
  ('zu19', '40', 25),
  ('zu19', '41', 25),
  ('zu19', '42', 20),
  ('zu19', '43', 18),
  ('zu19', '44', 18),
  ('zu19', '45', 18),
  ('tm16', 'U', 25)
on conflict (prd_codigo, pta_talla) do nothing;

insert into producto_imagen (prd_codigo, pim_orden, pim_url, pim_descripcion) values
  ('zh11', 1, 'img/productos/zh11-1.jpg', 'vista principal'),
  ('zh11', 2, 'img/productos/zh11-2.jpg', 'vista del otro lado'),
  ('zh11', 3, 'img/productos/zh11-3.jpg', 'detalle de la punta y la suela'),
  ('zh12', 1, 'img/productos/zh12-1.jpg', 'vista principal'),
  ('zh12', 2, 'img/productos/zh12-2.jpg', 'vista del otro lado'),
  ('zh12', 3, 'img/productos/zh12-3.jpg', 'detalle de la punta y la suela'),
  ('zh13', 1, 'img/productos/zh13-1.jpg', 'vista principal'),
  ('zh13', 2, 'img/productos/zh13-2.jpg', 'vista del otro lado'),
  ('zh13', 3, 'img/productos/zh13-3.jpg', 'detalle de la punta y la suela'),
  ('zh14', 1, 'img/productos/zh14-1.jpg', 'vista principal'),
  ('zh14', 2, 'img/productos/zh14-2.jpg', 'vista del otro lado'),
  ('zh14', 3, 'img/productos/zh14-3.jpg', 'detalle de la punta y la suela'),
  ('zh15', 1, 'img/productos/zh15-1.jpg', 'vista principal'),
  ('zh15', 2, 'img/productos/zh15-2.jpg', 'vista del otro lado'),
  ('zh15', 3, 'img/productos/zh15-3.jpg', 'detalle de la punta y la suela'),
  ('zh16', 1, 'img/productos/zh16-1.jpg', 'vista principal'),
  ('zh16', 2, 'img/productos/zh16-2.jpg', 'vista del otro lado'),
  ('zh16', 3, 'img/productos/zh16-3.jpg', 'detalle de la punta y la suela'),
  ('zh17', 1, 'img/productos/zh17-1.jpg', 'vista principal'),
  ('zh17', 2, 'img/productos/zh17-2.jpg', 'vista del otro lado'),
  ('zh17', 3, 'img/productos/zh17-3.jpg', 'detalle de la punta y la suela'),
  ('zh18', 1, 'img/productos/zh18-1.jpg', 'vista principal'),
  ('zh18', 2, 'img/productos/zh18-2.jpg', 'vista del otro lado'),
  ('zh18', 3, 'img/productos/zh18-3.jpg', 'detalle de la punta y la suela'),
  ('zm11', 1, 'img/productos/zm11-1.jpg', 'vista principal'),
  ('zm11', 2, 'img/productos/zm11-2.jpg', 'vista del otro lado'),
  ('zm11', 3, 'img/productos/zm11-3.jpg', 'detalle de la punta y la suela'),
  ('zm12', 1, 'img/productos/zm12-1.jpg', 'vista principal'),
  ('zm12', 2, 'img/productos/zm12-2.jpg', 'vista del otro lado'),
  ('zm12', 3, 'img/productos/zm12-3.jpg', 'detalle de la punta y la suela'),
  ('zm13', 1, 'img/productos/zm13-1.jpg', 'vista principal'),
  ('zm13', 2, 'img/productos/zm13-2.jpg', 'vista del otro lado'),
  ('zm13', 3, 'img/productos/zm13-3.jpg', 'detalle de la punta y la suela'),
  ('zm14', 1, 'img/productos/zm14-1.jpg', 'vista principal'),
  ('zm14', 2, 'img/productos/zm14-2.jpg', 'vista del otro lado'),
  ('zm14', 3, 'img/productos/zm14-3.jpg', 'detalle de la punta y la suela'),
  ('zm15', 1, 'img/productos/zm15-1.jpg', 'vista principal'),
  ('zm15', 2, 'img/productos/zm15-2.jpg', 'vista del otro lado'),
  ('zm15', 3, 'img/productos/zm15-3.jpg', 'detalle de la punta y la suela'),
  ('zm16', 1, 'img/productos/zm16-1.jpg', 'vista principal'),
  ('zm16', 2, 'img/productos/zm16-2.jpg', 'vista del otro lado'),
  ('zm16', 3, 'img/productos/zm16-3.jpg', 'detalle de la punta y la suela'),
  ('zm17', 1, 'img/productos/zm17-1.jpg', 'vista principal'),
  ('zm17', 2, 'img/productos/zm17-2.jpg', 'vista del otro lado'),
  ('zm17', 3, 'img/productos/zm17-3.jpg', 'detalle de la punta y la suela'),
  ('zm18', 1, 'img/productos/zm18-1.jpg', 'vista principal'),
  ('zm18', 2, 'img/productos/zm18-2.jpg', 'vista del otro lado'),
  ('zm18', 3, 'img/productos/zm18-3.jpg', 'detalle de la punta y la suela'),
  ('zu01', 1, 'img/productos/zu01-1.jpg', 'vista principal'),
  ('zu01', 2, 'img/productos/zu01-2.jpg', 'vista del otro lado'),
  ('zu01', 3, 'img/productos/zu01-3.jpg', 'detalle de la punta y la suela'),
  ('zu02', 1, 'img/productos/zu02-1.jpg', 'vista principal'),
  ('zu02', 2, 'img/productos/zu02-2.jpg', 'vista del otro lado'),
  ('zu02', 3, 'img/productos/zu02-3.jpg', 'detalle de la punta y la suela'),
  ('zu03', 1, 'img/productos/zu03-1.jpg', 'vista principal'),
  ('zu03', 2, 'img/productos/zu03-2.jpg', 'vista del otro lado'),
  ('zu03', 3, 'img/productos/zu03-3.jpg', 'detalle de la punta y la suela'),
  ('zu04', 1, 'img/productos/zu04-1.jpg', 'vista principal'),
  ('zu04', 2, 'img/productos/zu04-2.jpg', 'vista del otro lado'),
  ('zu04', 3, 'img/productos/zu04-3.jpg', 'detalle de la punta y la suela'),
  ('zu05', 1, 'img/productos/zu05-1.jpg', 'vista principal'),
  ('zu05', 2, 'img/productos/zu05-2.jpg', 'vista del otro lado'),
  ('zu05', 3, 'img/productos/zu05-3.jpg', 'detalle de la punta y la suela'),
  ('zu06', 1, 'img/productos/zu06-1.jpg', 'vista principal'),
  ('zu06', 2, 'img/productos/zu06-2.jpg', 'vista del otro lado'),
  ('zu06', 3, 'img/productos/zu06-3.jpg', 'detalle de la punta y la suela'),
  ('zu07', 1, 'img/productos/zu07-1.jpg', 'vista principal'),
  ('zu07', 2, 'img/productos/zu07-2.jpg', 'vista del otro lado'),
  ('zu07', 3, 'img/productos/zu07-3.jpg', 'detalle de la punta y la suela'),
  ('zu08', 1, 'img/productos/zu08-1.jpg', 'vista principal'),
  ('zu08', 2, 'img/productos/zu08-2.jpg', 'vista del otro lado'),
  ('zu08', 3, 'img/productos/zu08-3.jpg', 'detalle de la punta y la suela'),
  ('zu09', 1, 'img/productos/zu09-1.jpg', 'vista principal'),
  ('zu09', 2, 'img/productos/zu09-2.jpg', 'vista del otro lado'),
  ('zu09', 3, 'img/productos/zu09-3.jpg', 'detalle de la punta y la suela'),
  ('zu10', 1, 'img/productos/zu10-1.jpg', 'vista principal'),
  ('zu10', 2, 'img/productos/zu10-2.jpg', 'vista del otro lado'),
  ('zu10', 3, 'img/productos/zu10-3.jpg', 'detalle de la punta y la suela'),
  ('zu11', 1, 'img/productos/zu11-1.jpg', 'vista principal'),
  ('zu11', 2, 'img/productos/zu11-2.jpg', 'vista del otro lado'),
  ('zu11', 3, 'img/productos/zu11-3.jpg', 'detalle de la punta y la suela'),
  ('zu12', 1, 'img/productos/zu12-1.jpg', 'vista principal'),
  ('zu12', 2, 'img/productos/zu12-2.jpg', 'vista del otro lado'),
  ('zu12', 3, 'img/productos/zu12-3.jpg', 'detalle de la punta y la suela'),
  ('zu13', 1, 'img/productos/zu13-1.jpg', 'vista principal'),
  ('zu13', 2, 'img/productos/zu13-2.jpg', 'vista del otro lado'),
  ('zu13', 3, 'img/productos/zu13-3.jpg', 'detalle de la punta y la suela'),
  ('zu14', 1, 'img/productos/zu14-1.jpg', 'vista principal'),
  ('zu14', 2, 'img/productos/zu14-2.jpg', 'vista del otro lado'),
  ('zu14', 3, 'img/productos/zu14-3.jpg', 'detalle de la punta y la suela'),
  ('zu15', 1, 'img/productos/zu15-1.jpg', 'vista principal'),
  ('zu15', 2, 'img/productos/zu15-2.jpg', 'vista del otro lado'),
  ('zu15', 3, 'img/productos/zu15-3.jpg', 'detalle de la punta y la suela'),
  ('zu16', 1, 'img/productos/zu16-1.jpg', 'vista principal'),
  ('zu16', 2, 'img/productos/zu16-2.jpg', 'vista del otro lado'),
  ('zu16', 3, 'img/productos/zu16-3.jpg', 'detalle de la punta y la suela'),
  ('zu17', 1, 'img/productos/zu17-1.jpg', 'vista principal'),
  ('zu17', 2, 'img/productos/zu17-2.jpg', 'vista del otro lado'),
  ('zu17', 3, 'img/productos/zu17-3.jpg', 'detalle de la punta y la suela'),
  ('zu18', 1, 'img/productos/zu18-1.jpg', 'vista principal'),
  ('zu18', 2, 'img/productos/zu18-2.jpg', 'vista del otro lado'),
  ('zu18', 3, 'img/productos/zu18-3.jpg', 'detalle de la punta y la suela'),
  ('zu19', 1, 'img/productos/zu19-1.jpg', 'vista principal'),
  ('zu19', 2, 'img/productos/zu19-2.jpg', 'vista del otro lado'),
  ('zu19', 3, 'img/productos/zu19-3.jpg', 'detalle de la punta y la suela'),
  ('tm16', 1, 'img/productos/tm16-1.jpg', 'vista principal'),
  ('tm16', 2, 'img/productos/tm16-2.jpg', 'auricular'),
  ('tm16', 3, 'img/productos/tm16-3.jpg', 'arco')
on conflict (prd_codigo, pim_orden) do nothing;

commit;
