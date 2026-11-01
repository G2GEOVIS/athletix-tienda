/* Datos de la tienda ATHLETIX */
'use strict';

/* Entrega: solo retiro en la tienda que elija el cliente (la base usa el mismo tiempo) */
/* Países para clientes que no viven en Ecuador (con el código para el celular) */
const PAISES = [
  ['Argentina', '+54'], ['Bolivia', '+591'], ['Brasil', '+55'], ['Canadá', '+1'], ['Chile', '+56'], ['China', '+86'], ['Colombia', '+57'],
  ['Costa Rica', '+506'], ['Cuba', '+53'], ['El Salvador', '+503'], ['España', '+34'], ['Estados Unidos', '+1'], ['Francia', '+33'],
  ['Alemania', '+49'], ['Guatemala', '+502'], ['Honduras', '+504'], ['Italia', '+39'], ['Japón', '+81'], ['México', '+52'],
  ['Nicaragua', '+505'], ['Panamá', '+507'], ['Paraguay', '+595'], ['Perú', '+51'], ['Portugal', '+351'], ['Reino Unido', '+44'],
  ['República Dominicana', '+1'], ['Uruguay', '+598'], ['Venezuela', '+58']
].sort((a, b) => a[0].localeCompare(b[0], 'es'));
const codigoPais = (pais) => (PAISES.find(([p]) => p === pais) || [])[1] || '';
// "C.I." para la cédula ecuatoriana (10 números) y "Pasaporte" para los demás documentos
const nombreDocumento = (numero, corto = true) => (/^\d{10}$/.test(String(numero || '').trim()) ? (corto ? 'C.I.' : 'Cédula') : 'Pasaporte');

const ENTREGA = { retiro: 'de 1 a 3 horas' }; // el tiempo exacto depende de los productos (ver minutosRetiro)


/* Nombre de cada estado para mostrar al cliente */
const nombreEstado = (estadoPedido) => NOMBRE_ESTADO[estadoPedido];

/* Etapas de un pedido (los nombres coinciden con la base de datos) */
const ESTADOS = ['Recibido', 'Preparando', 'Listo', 'Retirado'];
const NOMBRE_ESTADO = { Recibido: 'Recibido', Preparando: 'Preparando', Listo: 'Listo para retirar', Retirado: 'Retirado', Cancelado: 'Cancelado' };


const CATEGORIAS = {
  calzado: 'Calzado',
  tecnologia: 'Tecnología deportiva',
  entrenamiento: 'Entrenamiento'
};

const PRODUCTOS = [
  {
    id: 'vx', nombre: 'Veloz Aero Llama', categoria: 'calzado', publico: 'Hombre', precio: 165,
    etiqueta: 'Nuevo',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['vista principal', 'vista del otro lado', 'detalle de la suela'],
    descripcion: 'Zapatilla para correr de alto rendimiento para ritmos rápidos y competencias. Su espuma RebotePlus y la placa de propulsión de nylon convierten cada zancada en impulso, con una malla ultraligera que se ajusta al pie.',
    caracteristicas: ['Espuma RebotePlus con placa de propulsión', 'Malla técnica ultraligera y transpirable', 'Pensada para competencias de 5K a media maratón'],
    ficha: [['Peso', '≈230 g'], ['Desnivel (drop)', '8 mm'], ['Amortiguación', 'RebotePlus + placa de nylon'], ['Uso ideal', 'Competencia y ritmos rápidos'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'zapato', 'zapatos', 'tenis', 'calzado', 'correr', 'running', 'carrera', 'competencia', 'hombre']
  },
  {
    id: 'sf', nombre: 'Flujo Tormenta Turquesa', categoria: 'calzado', publico: 'Hombre', precio: 135,
    etiqueta: '',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['vista principal', 'vista del otro lado', 'detalle de la suela'],
    descripcion: 'Zapatilla para correr amortiguada para rodajes largos y entrenamiento diario. La espuma NúcleoNube de doble densidad absorbe el impacto en cada pisada y su suela ancha da estabilidad kilómetro tras kilómetro.',
    caracteristicas: ['Espuma NúcleoNube de doble densidad', 'Suela ancha que aporta estabilidad', 'Lengüeta y cuello acolchados'],
    ficha: [['Peso', '≈290 g'], ['Desnivel (drop)', '10 mm'], ['Amortiguación', 'NúcleoNube doble densidad'], ['Uso ideal', 'Rodajes largos y diarios'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'zapato', 'zapatos', 'tenis', 'calzado', 'correr', 'running', 'amortiguada', 'hombre']
  },
  {
    id: 'oc', nombre: 'Ritmo Océano Coral', categoria: 'calzado', publico: 'Mujer', precio: 119,
    etiqueta: '',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['vista principal', 'vista del otro lado', 'detalle de la suela'],
    descripcion: 'Zapatilla para correr ligera para mujer, ideal para entrenar a diario. Su malla transpirable mantiene el pie fresco y la mediasuela FlexiLigera acompaña el movimiento natural de la pisada.',
    caracteristicas: ['Mediasuela FlexiLigera muy liviana', 'Malla transpirable de secado rápido', 'Detalles reflectivos para correr de noche'],
    ficha: [['Peso', '≈210 g'], ['Desnivel (drop)', '8 mm'], ['Amortiguación', 'FlexiLigera'], ['Uso ideal', 'Entrenamiento diario'], ['Tallas', '36, 36.5, 37, 37.5, 38, 38.5, 39 y 40 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'zapato', 'zapatos', 'tenis', 'calzado', 'correr', 'running', 'mujer']
  },
  {
    id: 'lr', nombre: 'Luz Carrera Lima', categoria: 'calzado', publico: 'Mujer', precio: 129,
    etiqueta: 'Nuevo',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['vista principal', 'vista del otro lado', 'detalle de la suela'],
    descripcion: 'Zapatilla para correr con suela reactiva para mujer. La espuma ResorteLigero devuelve energía en cada zancada, perfecta para series, ritmo sostenido y cambios de ritmo.',
    caracteristicas: ['Espuma ResorteLigero de alto retorno', 'Suela con relieve que mejora el agarre', 'Diseño de alta visibilidad'],
    ficha: [['Peso', '≈235 g'], ['Desnivel (drop)', '6 mm'], ['Amortiguación', 'ResorteLigero reactiva'], ['Uso ideal', 'Series y cambios de ritmo'], ['Tallas', '36, 36.5, 37, 37.5, 38, 38.5, 39 y 40 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'zapato', 'zapatos', 'tenis', 'calzado', 'correr', 'running', 'series', 'mujer']
  },
  {
    id: 'tn', nombre: 'Terrax Sendero Neón', categoria: 'calzado', publico: 'Hombre', precio: 149,
    etiqueta: '',
    tallas: ['37', '38', '39', '40', '41', '42', '43', '44', '45'],
    vistas: ['vista principal', 'vista del otro lado', 'detalle de la suela'],
    descripcion: 'Zapatilla de montaña para corredores que salen de la ciudad. Sus tacos de 5 mm muerden el barro y la tierra suelta, y la puntera reforzada protege el pie de piedras y raíces.',
    caracteristicas: ['Tacos de 5 mm para barro y tierra', 'Puntera reforzada contra impactos', 'Parte superior resistente a la abrasión'],
    ficha: [['Peso', '≈310 g'], ['Desnivel (drop)', '6 mm'], ['Tracción', 'TacoAgarre de 5 mm'], ['Uso ideal', 'Montaña, barro y tierra'], ['Tallas', '37 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'zapato', 'zapatos', 'tenis', 'calzado', 'montaña', 'trail', 'sendero', 'hombre']
  },
  {
    id: 'pt', nombre: 'Pulso Ruta GPS Pro', categoria: 'tecnologia', publico: 'Hombre', precio: 229,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'pantalla', 'correa'],
    descripcion: 'Reloj deportivo con GPS pensado para corredores. Muestra en tiempo real tu ritmo, distancia y frecuencia cardiaca en una pantalla AMOLED grande y fácil de leer mientras corres.',
    caracteristicas: ['GPS de doble frecuencia para rutas precisas', 'Pantalla AMOLED de 1.4" visible al sol', 'Hasta 14 días de batería'],
    ficha: [['Pantalla', 'AMOLED 1.4"'], ['Batería', 'Hasta 14 días (30 h con GPS)'], ['GPS', 'Doble frecuencia'], ['Mide', 'Ritmo, distancia y frecuencia cardiaca'], ['Resistencia al agua', '5 ATM']],
    claves: ['reloj', 'relojes', 'gps', 'smartwatch', 'tecnologia', 'hombre']
  },
  {
    id: 'sa', nombre: 'Aire Sónico Óseo', categoria: 'tecnologia', publico: 'Hombre', precio: 89,
    etiqueta: 'Nuevo',
    tallas: [],
    vistas: ['vista principal', 'auricular', 'arco'],
    descripcion: 'Audífonos de conducción ósea para correr escuchando música sin tapar tus oídos. Te mantienen atento al tráfico y a tu entorno, con un arco flexible que no se mueve aunque aceleres.',
    caracteristicas: ['Conducción ósea: oídos libres y atentos', 'Arco de titanio flexible y liviano', 'Resistentes al sudor y la lluvia (IP67)'],
    ficha: [['Tipo', 'Conducción ósea'], ['Batería', 'Hasta 8 h'], ['Conexión', 'Bluetooth 5.3'], ['Resistencia', 'IP67'], ['Peso', '≈29 g']],
    claves: ['audifonos', 'auriculares', 'audio', 'musica', 'tecnologia', 'hombre']
  },
  {
    id: 'cb', nombre: 'Cardio Banda Élite', categoria: 'tecnologia', publico: 'Hombre', precio: 79,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'sensor', 'broche'],
    descripcion: 'Banda cardiaca de pecho para entrenar por zonas con precisión. Envía tu frecuencia cardiaca en tiempo real al reloj, al teléfono o a la máquina del gimnasio.',
    caracteristicas: ['Medición de frecuencia cardiaca tipo ECG', 'Conexión Bluetooth y ANT+', 'Correa elástica lavable y ajustable'],
    ficha: [['Mide', 'Frecuencia cardiaca (tipo ECG)'], ['Batería', 'Hasta 400 h (pila CR2032)'], ['Conexión', 'Bluetooth y ANT+'], ['Resistencia', 'Al agua, 3 ATM'], ['Ajuste', 'Correa de 65 a 110 cm']],
    claves: ['banda', 'bandas', 'cardiaca', 'pulso', 'frecuencia', 'sensor', 'tecnologia', 'hombre']
  },
  {
    id: 'sp', nombre: 'Sensor de Zancada Pro', categoria: 'tecnologia', publico: 'Hombre', precio: 59,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'clip', 'sensor'],
    descripcion: 'Sensor de zancada que se engancha en la zapatilla y analiza tu técnica de carrera. Registra cadencia, longitud de zancada y tiempo de contacto para que corras de forma más eficiente.',
    caracteristicas: ['Analiza cadencia y longitud de zancada', 'Clip universal para cualquier zapatilla', 'Funciona incluso en cinta de correr'],
    ficha: [['Mide', 'Cadencia, zancada y tiempo de contacto'], ['Batería', 'Hasta 20 h, recargable'], ['Conexión', 'Bluetooth'], ['Montaje', 'Clip en los cordones'], ['Peso', '≈12 g']],
    claves: ['sensor', 'zancada', 'cadencia', 'tecnologia', 'hombre']
  },
  {
    id: 'hb', nombre: 'Cinturón Hidratación Pro', categoria: 'tecnologia', publico: 'Mujer', precio: 39,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'botella', 'bolsillo'],
    descripcion: 'Cinturón de hidratación para corredores con dos botellas de 300 ml y un bolsillo para el celular. Se ajusta a la cintura sin rebotar, ideal para rodajes largos y montaña.',
    caracteristicas: ['Incluye 2 botellas de 300 ml', 'Bolsillo con cierre para celular de hasta 6.7"', 'Detalles reflectivos y ajuste sin rebote'],
    ficha: [['Capacidad', '2 botellas de 300 ml'], ['Bolsillo', 'Celular de hasta 6.7"'], ['Ajuste', 'Cintura de 65 a 110 cm'], ['Visibilidad', 'Detalles reflectivos'], ['Material', 'Lycra transpirable']],
    claves: ['cinturon', 'hidratacion', 'botella', 'botellas', 'agua', 'tecnologia', 'mujer']
  },
  {
    id: 'au', nombre: 'Reloj Aura Rosa Pro', categoria: 'tecnologia', publico: 'Mujer', precio: 189,
    etiqueta: 'Nuevo',
    tallas: [],
    vistas: ['vista principal', 'pantalla', 'correa'],
    descripcion: 'Reloj inteligente para mujer con caja color oro rosa y correa de silicona suave. Registra tus entrenamientos, pasos, frecuencia cardiaca y sueño en una pantalla AMOLED redonda de colores vivos.',
    caracteristicas: ['Pantalla AMOLED redonda de 1.32"', 'Mide frecuencia cardiaca, pasos, calorías y sueño', 'Correa de silicona suave e hipoalergénica'],
    ficha: [['Pantalla', 'AMOLED redonda 1.32"'], ['Batería', 'Hasta 10 días'], ['Mide', 'FC, pasos, calorías y sueño'], ['Resistencia al agua', '5 ATM'], ['Correa', 'Silicona, ajustable de 14 a 20 cm']],
    claves: ['reloj', 'relojes', 'smartwatch', 'inteligente', 'rosa', 'tecnologia', 'mujer']
  },
  {
    id: 'at', nombre: 'Kit Pista de Agilidad Pro', categoria: 'entrenamiento', publico: null, precio: 49,
    etiqueta: '',
    tallas: [],
    vistas: ['kit completo', 'escalera', 'vallas y conos'],
    descripcion: 'Kit completo de agilidad para preparación atlética. Combina escalera, vallas y conos para trabajar velocidad de pies, coordinación y cambios de dirección en cancha o en el parque.',
    caracteristicas: ['Escalera de 12 peldaños ajustables', '4 vallas y 4 conos para armar circuitos', 'Incluye bolsa de transporte'],
    ficha: [['Escalera', '6 m · 12 peldaños'], ['Vallas', '4 unidades de 15 cm'], ['Conos', '4 unidades'], ['Incluye', 'Bolsa de transporte'], ['Uso ideal', 'Velocidad y coordinación']],
    claves: ['conos', 'cono', 'escalera', 'vallas', 'agilidad', 'entrenamiento', 'velocidad']
  },
  {
    id: 'pv', nombre: 'Chaleco Fuerza Élite', categoria: 'entrenamiento', publico: null, precio: 89,
    etiqueta: 'Nuevo',
    tallas: [],
    vistas: ['vista principal', 'bolsillos de peso', 'hombros'],
    descripcion: 'Chaleco lastrado para sumar carga a tus entrenamientos de fuerza, carrera y saltos. Sus placas extraíbles permiten ajustar el peso según tu nivel y progresar poco a poco.',
    caracteristicas: ['Peso ajustable con placas extraíbles', 'Correas laterales que evitan el rebote', 'Tela resistente y acolchada'],
    ficha: [['Peso', 'Ajustable hasta 10 kg'], ['Talla', 'Única, ajustable'], ['Cierre', 'Correas laterales con velcro'], ['Material', 'Nylon reforzado'], ['Uso ideal', 'Fuerza, carrera y saltos']],
    claves: ['chaleco', 'lastrado', 'peso', 'fuerza', 'entrenamiento']
  },
  {
    id: 'sc', nombre: 'Paracaídas de Velocidad Pro', categoria: 'entrenamiento', publico: null, precio: 35,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'paracaídas', 'cinturón'],
    descripcion: 'Paracaídas de resistencia para mejorar tu aceleración y velocidad. Al correr se abre detrás de ti y aumenta la resistencia de forma progresiva según tu velocidad.',
    caracteristicas: ['Resistencia progresiva al acelerar', 'Cinturón con liberación rápida', 'Se guarda plegado en segundos'],
    ficha: [['Diámetro', '142 cm'], ['Cinturón', 'Ajustable con liberación rápida'], ['Resistencia', 'Aumenta con tu velocidad'], ['Incluye', 'Bolsa para guardarlo'], ['Uso ideal', 'Carreras cortas y arranques']],
    claves: ['paracaidas', 'velocidad', 'resistencia', 'sprint', 'entrenamiento']
  },
  {
    id: 'fl', nombre: 'Set Lazo de Fuerza', categoria: 'entrenamiento', publico: null, precio: 25,
    etiqueta: '',
    tallas: [],
    vistas: ['set completo', 'bolsa', 'bandas'],
    descripcion: 'Set de 5 bandas de resistencia para fuerza, movilidad y calentamiento. Cada color tiene un nivel distinto y todas se guardan en su bolsa para llevarlas a donde entrenes.',
    caracteristicas: ['5 niveles de resistencia por color', 'Látex natural resistente', 'Bolsa de transporte incluida'],
    ficha: [['Contenido', '5 bandas de látex'], ['Resistencia', 'De 5 a 40 kg aprox.'], ['Medida', '60 × 5 cm'], ['Incluye', 'Bolsa de tela'], ['Uso ideal', 'Fuerza y movilidad']],
    claves: ['bandas', 'banda', 'elasticas', 'elastica', 'ligas', 'lazo', 'resistencia', 'fuerza', 'entrenamiento']
  },
  {
    id: 'cm', nombre: 'Balón Medicinal Núcleo Pro', categoria: 'entrenamiento', publico: null, precio: 45,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'textura', 'agarre'],
    descripcion: 'Balón medicinal para fuerza funcional y trabajo abdominal. Su superficie texturizada da un agarre firme en lanzamientos, giros y abdominales, incluso con las manos sudadas.',
    caracteristicas: ['Superficie texturizada antideslizante', 'Rebote controlado para lanzamientos', 'Resistente a golpes y caídas'],
    ficha: [['Peso', '6 kg'], ['Diámetro', '≈28 cm'], ['Superficie', 'Texturizada antideslizante'], ['Material', 'Caucho reforzado'], ['Uso ideal', 'Abdomen y fuerza funcional']],
    claves: ['balon', 'medicinal', 'pelota', 'abdomen', 'fuerza', 'entrenamiento']
  },
  /* ---- Catálogo ampliado ---- */
  {
    id: 'zh01', nombre: 'ATHLETIX Pulso Gel', categoria: 'calzado', publico: 'Hombre', precio: 149.99,
    etiqueta: '',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['vista lateral', 'vista interior', 'vista frontal'],
    descripcion: 'Zapatilla de running de estabilidad para rodajes largos. Su espuma de doble densidad absorbe el impacto y la parte superior de punto negro, con finas líneas blancas, mantiene el pie fresco y sujeto.',
    caracteristicas: ['Espuma de doble densidad para mayor confort', 'Parte superior de punto transpirable', 'Gran estabilidad en cada zancada'],
    ficha: [['Amortiguación', 'Espuma de doble densidad'], ['Color', 'Negro'], ['Peso', '≈300 g'], ['Desnivel (drop)', '10 mm'], ['Uso ideal', 'Rodajes largos y estabilidad'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'hombre', 'athletix', 'pulso', 'gel', 'estabilidad', 'negro']
  },
  {
    id: 'zh02', nombre: 'ATHLETIX Vuelo Neón', categoria: 'calzado', publico: 'Hombre', precio: 129.99,
    etiqueta: '',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['vista lateral', 'vista interior', 'vista frontal'],
    descripcion: 'Zapatilla versátil para el entrenamiento diario. Su espuma reactiva da una pisada suave, y la malla blanca con detalles verde lima deja respirar el pie y se ve en cualquier ruta.',
    caracteristicas: ['Amortiguación suave y reactiva', 'Malla transpirable con detalles de alta visibilidad', 'Ideal para entrenamientos y competencias'],
    ficha: [['Amortiguación', 'Espuma reactiva'], ['Color', 'Blanco y lima'], ['Peso', '≈285 g'], ['Desnivel (drop)', '10 mm'], ['Uso ideal', 'Entrenamiento diario'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'hombre', 'athletix', 'vuelo', 'neon', 'blanco', 'lima']
  },
  {
    id: 'zh03', nombre: 'ATHLETIX Onda Azul', categoria: 'calzado', publico: 'Hombre', precio: 119.99,
    etiqueta: '',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['vista lateral', 'vista interior', 'vista frontal'],
    descripcion: 'Zapatilla de running cómoda y estable para uso diario. La entresuela reparte el impacto y da una transición fluida, y su malla azul rey es ligera y fresca.',
    caracteristicas: ['Entresuela estable de transición fluida', 'Malla ligera y transpirable', 'Suela con buen agarre en asfalto'],
    ficha: [['Amortiguación', 'Espuma estable'], ['Color', 'Azul rey'], ['Peso', '≈290 g'], ['Desnivel (drop)', '12 mm'], ['Uso ideal', 'Uso diario y distancias medias'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'hombre', 'athletix', 'onda', 'azul']
  },
  {
    id: 'zh04', nombre: 'ATHLETIX Sendero Volcán', categoria: 'calzado', publico: 'Hombre', precio: 109.99,
    etiqueta: '',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['vista lateral', 'vista interior', 'vista frontal'],
    descripcion: 'Zapatilla de trail running para senderos y terrenos mixtos. Su suela con tacos profundos agarra en tierra, piedra y asfalto, y la puntera reforzada protege el pie en las bajadas.',
    caracteristicas: ['Suela con tacos de máximo agarre', 'Puntera y talón reforzados', 'Tejido ripstop resistente'],
    ficha: [['Amortiguación', 'Espuma protectora de trail'], ['Color', 'Negro y rojo'], ['Peso', '≈300 g'], ['Desnivel (drop)', '8 mm'], ['Uso ideal', 'Trail y terrenos mixtos'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'hombre', 'athletix', 'sendero', 'volcán', 'trail', 'montaña', 'negro', 'rojo']
  },
  {
    id: 'zh05', nombre: 'ATHLETIX Rayo Lima', categoria: 'calzado', publico: 'Hombre', precio: 139.99,
    etiqueta: '',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['vista lateral', 'vista interior', 'vista frontal'],
    descripcion: 'Zapatilla ligera y rápida para series y ritmos de competencia. Su espuma de alto retorno devuelve energía en cada zancada y su color amarillo neón no pasa desapercibido.',
    caracteristicas: ['Ligereza y alta respuesta', 'Parte superior de punto ultraligera', 'Diseñada para ritmos rápidos'],
    ficha: [['Amortiguación', 'Espuma de alto retorno'], ['Color', 'Amarillo neón'], ['Peso', '≈260 g'], ['Desnivel (drop)', '6 mm'], ['Uso ideal', 'Series y competencia'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'hombre', 'athletix', 'rayo', 'lima', 'velocidad', 'amarillo', 'neon']
  },
  {
    id: 'zh06', nombre: 'ATHLETIX Grafito Ride', categoria: 'calzado', publico: 'Hombre', precio: 119.99,
    etiqueta: '',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['vista lateral', 'vista interior', 'vista frontal'],
    descripcion: 'Zapatilla equilibrada que sirve para casi todo: rodajes suaves, cambios de ritmo y uso diario. Su malla gris grafito con talón plateado combina con cualquier ropa deportiva.',
    caracteristicas: ['Amortiguación cómoda y duradera', 'Malla transpirable', 'Transición suave en cada zancada'],
    ficha: [['Amortiguación', 'Espuma de larga duración'], ['Color', 'Gris grafito'], ['Peso', '≈275 g'], ['Desnivel (drop)', '8 mm'], ['Uso ideal', 'Versatilidad'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'hombre', 'athletix', 'grafito', 'ride', 'gris']
  },
  {
    id: 'zh07', nombre: 'ATHLETIX Nube Alta', categoria: 'calzado', publico: 'Hombre', precio: 129.99,
    etiqueta: '',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['vista lateral', 'vista interior', 'vista frontal'],
    descripcion: 'Zapatilla de amortiguación máxima y muy liviana para sumar kilómetros con comodidad. Su entresuela alta con forma de balancín hace que cada paso sea suave y natural.',
    caracteristicas: ['Amortiguación máxima y ligera', 'Entresuela tipo balancín', 'Comodidad en largas distancias'],
    ficha: [['Amortiguación', 'Espuma de alto volumen'], ['Color', 'Blanco y naranja'], ['Peso', '≈250 g'], ['Desnivel (drop)', '5 mm'], ['Uso ideal', 'Largas distancias'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'hombre', 'athletix', 'nube', 'alta', 'blanco', 'naranja']
  },
  {
    id: 'zh08', nombre: 'ATHLETIX Trueno Negro', categoria: 'calzado', publico: 'Hombre', precio: 119.99,
    etiqueta: '',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['vista lateral', 'vista interior', 'vista frontal'],
    descripcion: 'Zapatilla de entrenamiento diario con transiciones suaves y un ajuste seguro. Su malla negra con cuello amarillo amortigua sin perder estabilidad.',
    caracteristicas: ['Amortiguación equilibrada', 'Ajuste cómodo y seguro', 'Ideal para entrenamientos diarios y carreras'],
    ficha: [['Amortiguación', 'Espuma equilibrada'], ['Color', 'Negro y amarillo'], ['Peso', '≈285 g'], ['Desnivel (drop)', '12 mm'], ['Uso ideal', 'Entrenamiento diario'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'hombre', 'athletix', 'trueno', 'negro', 'amarillo']
  },
  {
    id: 'zh09', nombre: 'ATHLETIX Estable Marino', categoria: 'calzado', publico: 'Hombre', precio: 129.99,
    etiqueta: '',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['vista lateral', 'vista interior', 'vista frontal'],
    descripcion: 'Zapatilla de soporte para corredores con pisada pronadora. Su talón firme guía el pie y la espuma da una pisada cómoda kilómetro tras kilómetro.',
    caracteristicas: ['Talón firme para mayor estabilidad', 'Malla superior transpirable', 'Perfecta para corredores de todos los niveles'],
    ficha: [['Amortiguación', 'Espuma con soporte'], ['Color', 'Azul marino y naranja'], ['Peso', '≈285 g'], ['Desnivel (drop)', '8 mm'], ['Uso ideal', 'Pisada pronadora'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'hombre', 'athletix', 'estable', 'marino', 'soporte', 'pronador', 'azul']
  },
  {
    id: 'zh10', nombre: 'ATHLETIX Élite Carmín', categoria: 'calzado', publico: 'Hombre', precio: 124.99,
    etiqueta: '',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['vista lateral', 'vista interior', 'vista frontal'],
    descripcion: 'Zapatilla cómoda con retorno de energía para rodajes largos. Su parte superior de punto color vino con talón metálico rosado acompaña la pisada y mantiene el pie fresco.',
    caracteristicas: ['Espuma con retorno de energía', 'Parte superior de punto ligera', 'Máximo confort en largas distancias'],
    ficha: [['Amortiguación', 'Espuma de retorno de energía'], ['Color', 'Vino'], ['Peso', '≈280 g'], ['Desnivel (drop)', '8 mm'], ['Uso ideal', 'Rodajes largos'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'hombre', 'athletix', 'elite', 'carmín', 'vino', 'granate']
  },
  {
    id: 'zm01', nombre: 'ATHLETIX Pulso Lavanda', categoria: 'calzado', publico: 'Mujer', precio: 149.99,
    etiqueta: '',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['vista lateral', 'vista interior', 'vista frontal'],
    descripcion: 'Zapatilla de estabilidad para mujer con amortiguación de larga duración. Su malla lavanda y el talón con degradado pastel dan soporte y estilo en entrenamientos y carreras largas.',
    caracteristicas: ['Amortiguación de larga duración', 'Soporte y estabilidad para mayor control', 'Ideal para entrenamientos y carreras largas'],
    ficha: [['Amortiguación', 'Espuma de doble densidad'], ['Color', 'Lavanda'], ['Peso', '≈260 g'], ['Desnivel (drop)', '10 mm'], ['Uso ideal', 'Rodajes largos y estabilidad'], ['Tallas', '36 – 40 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'mujer', 'athletix', 'pulso', 'lavanda', 'estabilidad', 'lila']
  },
  {
    id: 'zm02', nombre: 'ATHLETIX Vuelo Rosa', categoria: 'calzado', publico: 'Mujer', precio: 129.99,
    etiqueta: '',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['vista lateral', 'vista interior', 'vista frontal'],
    descripcion: 'Zapatilla de running para mujer, cómoda y ligera. Su espuma da buen retorno de energía y la malla rosa con detalles coral deja respirar el pie.',
    caracteristicas: ['Amortiguación con retorno de energía', 'Malla transpirable ultraligera', 'Perfecta para entrenamientos diarios y carreras'],
    ficha: [['Amortiguación', 'Espuma reactiva'], ['Color', 'Rosa y coral'], ['Peso', '≈240 g'], ['Desnivel (drop)', '10 mm'], ['Uso ideal', 'Entrenamiento diario'], ['Tallas', '36 – 40 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'mujer', 'athletix', 'vuelo', 'rosa', 'coral']
  },
  {
    id: 'zm03', nombre: 'ATHLETIX Onda Turquesa', categoria: 'calzado', publico: 'Mujer', precio: 119.99,
    etiqueta: '',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['vista lateral', 'vista interior', 'vista frontal'],
    descripcion: 'Zapatilla cómoda para mujer con una pisada estable. Su amortiguación suave y reactiva acompaña distancias medias y largas, en un fresco color turquesa con menta.',
    caracteristicas: ['Pisada estable', 'Amortiguación suave y reactiva', 'Ideal para distancias medias y largas'],
    ficha: [['Amortiguación', 'Espuma estable'], ['Color', 'Turquesa y menta'], ['Peso', '≈245 g'], ['Desnivel (drop)', '12 mm'], ['Uso ideal', 'Distancias medias y largas'], ['Tallas', '36 – 40 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'mujer', 'athletix', 'onda', 'turquesa', 'menta']
  },
  {
    id: 'zm04', nombre: 'ATHLETIX Nube Durazno', categoria: 'calzado', publico: 'Mujer', precio: 134.99,
    etiqueta: '',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['vista lateral', 'vista interior', 'vista frontal'],
    descripcion: 'Zapatilla de máxima comodidad para mujer. Su espuma es muy suave y la malla blanca con detalles durazno se adapta al pie en carreras largas y uso diario.',
    caracteristicas: ['Espuma ultra suave', 'Malla transpirable que se adapta al pie', 'Ideal para carreras largas y uso diario'],
    ficha: [['Amortiguación', 'Espuma ultra suave'], ['Color', 'Blanco y durazno'], ['Peso', '≈250 g'], ['Desnivel (drop)', '6 mm'], ['Uso ideal', 'Máxima comodidad'], ['Tallas', '36 – 40 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'mujer', 'athletix', 'nube', 'durazno', 'blanco']
  },
  {
    id: 'zm05', nombre: 'ATHLETIX Rayo Coral', categoria: 'calzado', publico: 'Mujer', precio: 119.99,
    etiqueta: '',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['vista lateral', 'vista interior', 'vista frontal'],
    descripcion: 'Zapatilla ligera para mujer pensada para ganar velocidad. Su espuma color coral da una gran respuesta y la parte superior de punto negro es muy liviana.',
    caracteristicas: ['Ligereza y gran respuesta', 'Parte superior de punto ultraligera', 'Ideal para mejorar tu ritmo y velocidad'],
    ficha: [['Amortiguación', 'Espuma de alto retorno'], ['Color', 'Negro y coral'], ['Peso', '≈225 g'], ['Desnivel (drop)', '8 mm'], ['Uso ideal', 'Velocidad'], ['Tallas', '36 – 40 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'mujer', 'athletix', 'rayo', 'coral', 'velocidad', 'negro']
  },
  {
    id: 'zm06', nombre: 'ATHLETIX Lila Ride', categoria: 'calzado', publico: 'Mujer', precio: 119.99,
    etiqueta: '',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['vista lateral', 'vista interior', 'vista frontal'],
    descripcion: 'Zapatilla versátil para mujer que sirve para todo tipo de entrenamiento. Su espuma es cómoda y la parte superior de punto lila es ligera y transpirable.',
    caracteristicas: ['Amortiguación cómoda', 'Parte superior de punto ligera', 'Ideal para todo tipo de entrenamientos'],
    ficha: [['Amortiguación', 'Espuma de larga duración'], ['Color', 'Lila'], ['Peso', '≈240 g'], ['Desnivel (drop)', '8 mm'], ['Uso ideal', 'Versatilidad'], ['Tallas', '36 – 40 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'mujer', 'athletix', 'lila', 'ride', 'morado']
  },
  {
    id: 'zm07', nombre: 'ATHLETIX Nube Salmón', categoria: 'calzado', publico: 'Mujer', precio: 129.99,
    etiqueta: '',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['vista lateral', 'vista interior', 'vista frontal'],
    descripcion: 'Zapatilla muy suave y liviana para mujer, ideal para largas distancias y recuperación. Su entresuela flexible amortigua cada paso y su color salmón alegra cualquier entrenamiento.',
    caracteristicas: ['Amortiguación máxima', 'Gran ligereza y flexibilidad', 'Ideal para largas distancias y recuperación'],
    ficha: [['Amortiguación', 'Espuma de alto volumen'], ['Color', 'Salmón'], ['Peso', '≈205 g'], ['Desnivel (drop)', '5 mm'], ['Uso ideal', 'Largas distancias'], ['Tallas', '36 – 40 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'mujer', 'athletix', 'nube', 'salmon', 'coral']
  },
  {
    id: 'zm08', nombre: 'ATHLETIX Trueno Violeta', categoria: 'calzado', publico: 'Mujer', precio: 119.99,
    etiqueta: '',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['vista lateral', 'vista interior', 'vista frontal'],
    descripcion: 'Zapatilla equilibrada para mujer con transiciones suaves y estables. Su malla color ciruela con detalles violeta es excelente para entrenamientos diarios y carreras.',
    caracteristicas: ['Amortiguación equilibrada', 'Transiciones suaves y estables', 'Excelente para entrenamientos diarios y carreras'],
    ficha: [['Amortiguación', 'Espuma equilibrada'], ['Color', 'Ciruela y violeta'], ['Peso', '≈255 g'], ['Desnivel (drop)', '12 mm'], ['Uso ideal', 'Entrenamiento diario'], ['Tallas', '36 – 40 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'mujer', 'athletix', 'trueno', 'violeta', 'morado', 'ciruela']
  },
  {
    id: 'zm09', nombre: 'ATHLETIX Estable Celeste', categoria: 'calzado', publico: 'Mujer', precio: 129.99,
    etiqueta: '',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['vista lateral', 'vista interior', 'vista frontal'],
    descripcion: 'Zapatilla de soporte para corredoras con pronación. Su talón firme guía la pisada y la amortiguación protege las articulaciones, en un suave celeste con detalles naranja.',
    caracteristicas: ['Talón firme para mayor estabilidad', 'Amortiguación protectora', 'Ideal para corredoras con pronación'],
    ficha: [['Amortiguación', 'Espuma con soporte'], ['Color', 'Celeste y naranja'], ['Peso', '≈250 g'], ['Desnivel (drop)', '8 mm'], ['Uso ideal', 'Pisada pronadora'], ['Tallas', '36 – 40 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'mujer', 'athletix', 'estable', 'celeste', 'soporte', 'pronadora', 'azul']
  },
  {
    id: 'zm10', nombre: 'ATHLETIX Élite Magenta', categoria: 'calzado', publico: 'Mujer', precio: 124.99,
    etiqueta: '',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['vista lateral', 'vista interior', 'vista frontal'],
    descripcion: 'Zapatilla cómoda para mujer con espuma que devuelve energía. Ligera y transpirable, en negro con detalles magenta, sirve para entrenamientos y competencias.',
    caracteristicas: ['Espuma con retorno de energía', 'Malla ligera y transpirable', 'Ideal para entrenamientos y competencias'],
    ficha: [['Amortiguación', 'Espuma de retorno de energía'], ['Color', 'Negro y magenta'], ['Peso', '≈240 g'], ['Desnivel (drop)', '8 mm'], ['Uso ideal', 'Entrenamiento y competencia'], ['Tallas', '36 – 40 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'mujer', 'athletix', 'elite', 'magenta', 'negro', 'fucsia']
  },
  {
    id: 'tm01', nombre: 'Reloj GPS Running Rosa', categoria: 'tecnologia', publico: 'Mujer', precio: 189.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Reloj deportivo con GPS para corredoras. Registra ritmo, distancia, tiempo, pulso y rutas en una pantalla redonda de colores vivos.',
    caracteristicas: ['GPS integrado para registrar tus rutas', 'Pulso en la muñeca las 24 horas', 'Hasta 10 días de batería'],
    ficha: [['Pantalla', 'AMOLED redonda 1.3\''], ['GPS', 'Integrado'], ['Mide', 'Ritmo, distancia, tiempo y pulso'], ['Batería', 'Hasta 10 días'], ['Resistencia al agua', '5 ATM']],
    claves: ['reloj', 'relojes', 'gps', 'smartwatch', 'running', 'tecnologia', 'mujer']
  },
  {
    id: 'tm02', nombre: 'Audífonos Inalámbricos Deportivos Rosa', categoria: 'tecnologia', publico: 'Mujer', precio: 59.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Audífonos inalámbricos para correr y entrenar. Se ajustan firme al oído, resisten el sudor y su estuche de carga te da varias recargas.',
    caracteristicas: ['Ajuste firme que no se cae al correr', 'Resistentes al sudor y a la lluvia', 'Estuche de carga incluido'],
    ficha: [['Conexión', 'Bluetooth 5.3'], ['Batería', '6 h + 24 h con estuche'], ['Resistencia', 'IPX5 (sudor y lluvia)'], ['Incluye', 'Estuche de carga y almohadillas'], ['Uso ideal', 'Correr y gimnasio']],
    claves: ['audifonos', 'auriculares', 'inalambricos', 'musica', 'bluetooth', 'tecnologia', 'mujer']
  },
  {
    id: 'tm03', nombre: 'Pulsera de Actividad Rosa', categoria: 'tecnologia', publico: 'Mujer', precio: 49.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Pulsera inteligente liviana que cuenta tus pasos, actividad, sueño y pulso. Te avisa de las notificaciones del celular sin molestarte al entrenar.',
    caracteristicas: ['Pasos, sueño y frecuencia cardiaca', 'Pantalla a color fácil de leer', 'Hasta 14 días de batería'],
    ficha: [['Pantalla', 'AMOLED 1.1\''], ['Mide', 'Pasos, sueño, pulso y calorías'], ['Batería', 'Hasta 14 días'], ['Resistencia al agua', '5 ATM'], ['Compatible', 'Android y iPhone']],
    claves: ['pulsera', 'banda', 'actividad', 'smartband', 'tecnologia', 'mujer']
  },
  {
    id: 'tm07', nombre: 'Anillo Inteligente de Recuperación', categoria: 'tecnologia', publico: 'Mujer', precio: 219.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Anillo inteligente color oro rosa que mide tu sueño, actividad y recuperación. Es cómodo para usarlo todo el día y toda la noche.',
    caracteristicas: ['Mide sueño, actividad y recuperación', 'Diseño discreto de titanio', 'Hasta 6 días de batería'],
    ficha: [['Material', 'Titanio, acabado oro rosa'], ['Mide', 'Sueño, pulso, temperatura y actividad'], ['Batería', 'Hasta 6 días'], ['Resistencia al agua', '10 ATM'], ['Incluye', 'Base de carga']],
    claves: ['anillo', 'smart ring', 'sueño', 'recuperacion', 'tecnologia', 'mujer']
  },
  {
    id: 'tm08', nombre: 'Plantillas Inteligentes para Running Mujer', categoria: 'tecnologia', publico: 'Mujer', precio: 189.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Plantillas con sensores que analizan tu pisada y la presión del pie mientras corres. Envían los datos al celular para mejorar tu técnica.',
    caracteristicas: ['Analizan pisada y presión del pie', 'Datos en tiempo real en la app', 'Recargables por USB'],
    ficha: [['Sensores', 'Presión en 3 zonas del pie'], ['Mide', 'Pisada, cadencia y tiempo de contacto'], ['Batería', 'Hasta 20 h de uso'], ['Tallas', 'Recortables 35 – 41'], ['Compatible', 'Android y iPhone']],
    claves: ['plantillas', 'pisada', 'sensor', 'running', 'tecnologia', 'mujer']
  },
  {
    id: 'tm09', nombre: 'Dispositivo de Seguridad para Corredoras', categoria: 'tecnologia', publico: 'Mujer', precio: 49.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Dispositivo compacto con botón SOS que comparte tu ubicación con tus contactos y emite una alarma fuerte. Ideal para correr sola o de noche.',
    caracteristicas: ['Botón SOS con ubicación compartida', 'Alarma de 120 dB', 'Clip para cintura o brazo'],
    ficha: [['Funciones', 'SOS, ubicación y alarma'], ['Alarma', '120 dB'], ['Batería', 'Hasta 7 días'], ['Montaje', 'Clip y correa'], ['Compatible', 'App en el celular']],
    claves: ['seguridad', 'sos', 'alarma', 'corredora', 'tecnologia', 'mujer']
  },
  {
    id: 'tm10', nombre: 'Botella Inteligente de Hidratación Rosa', categoria: 'tecnologia', publico: 'Mujer', precio: 44.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Botella que te recuerda tomar agua con una luz y registra lo que bebes en la app. Mantiene el agua fría durante tus entrenamientos.',
    caracteristicas: ['Recordatorios de hidratación con luz', 'Registro de consumo en la app', 'Acero inoxidable con doble pared'],
    ficha: [['Capacidad', '600 ml'], ['Material', 'Acero inoxidable'], ['Mantiene frío', 'Hasta 12 h'], ['Batería', 'Hasta 14 días'], ['Compatible', 'Android y iPhone']],
    claves: ['botella', 'agua', 'hidratacion', 'termo', 'tecnologia', 'mujer']
  },
  {
    id: 'tm11', nombre: 'Pistola de Masaje Muscular Rosa', categoria: 'tecnologia', publico: 'Mujer', precio: 89.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Pistola de masaje compacta para aliviar la tensión y acelerar la recuperación después de entrenar. Incluye 4 cabezales para distintas zonas.',
    caracteristicas: ['5 niveles de intensidad', '4 cabezales intercambiables', 'Silenciosa y liviana'],
    ficha: [['Velocidades', '5 niveles'], ['Cabezales', '4 incluidos'], ['Batería', 'Hasta 4 h'], ['Peso', '≈450 g'], ['Uso ideal', 'Recuperación muscular']],
    claves: ['masaje', 'masajeador', 'pistola', 'recuperacion', 'muscular', 'tecnologia', 'mujer']
  },
  {
    id: 'tm12', nombre: 'Top Deportivo con Sensor Cardíaco', categoria: 'tecnologia', publico: 'Mujer', precio: 99.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Top deportivo con sensor de frecuencia cardiaca integrado. Mide tu pulso con precisión sin usar banda de pecho y es cómodo para entrenar.',
    caracteristicas: ['Sensor cardiaco integrado en la tela', 'Tela transpirable de secado rápido', 'Compatible con relojes y apps'],
    ficha: [['Mide', 'Frecuencia cardiaca'], ['Conexión', 'Bluetooth y ANT+'], ['Tela', 'Poliamida y elastano'], ['Tallas', 'S, M, L'], ['Lavado', 'Lavable (retirando el sensor)']],
    claves: ['top', 'sujetador', 'sensor', 'pulso', 'ropa', 'tecnologia', 'mujer']
  },
  {
    id: 'tm13', nombre: 'Luz LED Recargable para Correr', categoria: 'tecnologia', publico: 'Mujer', precio: 24.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Luz LED recargable que se engancha a la ropa para que te vean cuando corres con poca luz. Tiene varios modos de encendido.',
    caracteristicas: ['3 modos: fija, intermitente y suave', 'Recargable por USB-C', 'Clip firme para ropa o mochila'],
    ficha: [['Modos', '3'], ['Batería', 'Hasta 8 h'], ['Carga', 'USB-C'], ['Resistencia', 'IPX4 (lluvia)'], ['Peso', '≈30 g']],
    claves: ['luz', 'led', 'visibilidad', 'noche', 'seguridad', 'tecnologia', 'mujer']
  },
  {
    id: 'tm14', nombre: 'Cargador y Base para Reloj Deportivo', categoria: 'tecnologia', publico: 'Mujer', precio: 19.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Base de carga magnética para tu reloj deportivo. Lo mantiene en su lugar mientras carga y deja ver la pantalla.',
    caracteristicas: ['Conexión magnética fácil', 'Cable USB de 1 m incluido', 'Diseño compacto para el escritorio'],
    ficha: [['Tipo', 'Base magnética'], ['Cable', 'USB de 1 m'], ['Material', 'Silicona y aluminio'], ['Compatible', 'Relojes deportivos con carga de pines'], ['Incluye', 'Base y cable']],
    claves: ['cargador', 'base', 'reloj', 'accesorio', 'tecnologia', 'mujer']
  },
  {
    id: 'tm15', nombre: 'Cronómetro Digital de Intervalos', categoria: 'tecnologia', publico: 'Mujer', precio: 29.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Cronómetro deportivo para medir series, vueltas y descansos. Su pantalla grande se lee fácil mientras entrenas.',
    caracteristicas: ['Memoria de vueltas y parciales', 'Temporizador de intervalos', 'Resistente al agua'],
    ficha: [['Memoria', '100 vueltas'], ['Precisión', '1/100 s'], ['Funciones', 'Cronómetro, intervalos y alarma'], ['Resistencia al agua', '3 ATM'], ['Batería', 'Pila de botón (1 año)']],
    claves: ['cronometro', 'tiempo', 'intervalos', 'series', 'tecnologia', 'mujer']
  },
  {
    id: 'th02', nombre: 'Audífonos Deportivos Resistentes al Sudor', categoria: 'tecnologia', publico: 'Hombre', precio: 69.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Audífonos inalámbricos con ganchos que se quedan firmes al correr o en el gimnasio. Resisten el sudor y tienen buen sonido.',
    caracteristicas: ['Ganchos de ajuste seguro', 'Resistentes al sudor y al agua', 'Estuche de carga incluido'],
    ficha: [['Conexión', 'Bluetooth 5.3'], ['Batería', '8 h + 30 h con estuche'], ['Resistencia', 'IPX7'], ['Incluye', 'Estuche y almohadillas'], ['Uso ideal', 'Correr y gimnasio']],
    claves: ['audifonos', 'auriculares', 'inalambricos', 'musica', 'bluetooth', 'tecnologia', 'hombre']
  },
  {
    id: 'th03', nombre: 'Pulsera de Rendimiento Deportivo', categoria: 'tecnologia', publico: 'Hombre', precio: 59.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Pulsera inteligente que registra tu actividad, pulso y sueño para que sepas cómo rindes y cuándo descansar.',
    caracteristicas: ['Actividad, pulso y sueño', 'Más de 100 modos deportivos', 'Hasta 14 días de batería'],
    ficha: [['Pantalla', 'AMOLED 1.6\''], ['Mide', 'Pasos, pulso, sueño y oxígeno'], ['Batería', 'Hasta 14 días'], ['Resistencia al agua', '5 ATM'], ['Compatible', 'Android y iPhone']],
    claves: ['pulsera', 'banda', 'actividad', 'smartband', 'tecnologia', 'hombre']
  },
  {
    id: 'th05', nombre: 'Sensor de Potencia para Running', categoria: 'tecnologia', publico: 'Hombre', precio: 169.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Sensor que se engancha a la zapatilla y mide la potencia de tu carrera para dosificar el esfuerzo en entrenamientos y competencias.',
    caracteristicas: ['Mide potencia de carrera en vatios', 'Se engancha a los cordones', 'Compatible con relojes deportivos'],
    ficha: [['Mide', 'Potencia, cadencia y zancada'], ['Conexión', 'Bluetooth y ANT+'], ['Batería', 'Hasta 40 h'], ['Peso', '≈15 g'], ['Resistencia', 'IP67']],
    claves: ['sensor', 'potencia', 'running', 'metricas', 'tecnologia', 'hombre']
  },
  {
    id: 'th07', nombre: 'Anillo Inteligente Deportivo', categoria: 'tecnologia', publico: 'Hombre', precio: 219.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Anillo inteligente negro que mide tu descanso y recuperación para planificar mejor tus entrenamientos.',
    caracteristicas: ['Mide sueño, pulso y recuperación', 'Diseño resistente de titanio', 'Hasta 6 días de batería'],
    ficha: [['Material', 'Titanio negro'], ['Mide', 'Sueño, pulso, temperatura y actividad'], ['Batería', 'Hasta 6 días'], ['Resistencia al agua', '10 ATM'], ['Incluye', 'Base de carga']],
    claves: ['anillo', 'smart ring', 'sueño', 'recuperacion', 'tecnologia', 'hombre']
  },
  {
    id: 'th08', nombre: 'Plantillas con Sensores de Pisada', categoria: 'tecnologia', publico: 'Hombre', precio: 189.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Plantillas con sensores que analizan tu pisada y la presión del pie para mejorar tu técnica y prevenir lesiones.',
    caracteristicas: ['Analizan pisada y presión', 'Datos en tiempo real en la app', 'Recargables por USB'],
    ficha: [['Sensores', 'Presión en 3 zonas del pie'], ['Mide', 'Pisada, cadencia y tiempo de contacto'], ['Batería', 'Hasta 20 h de uso'], ['Tallas', 'Recortables 39 – 45'], ['Compatible', 'Android y iPhone']],
    claves: ['plantillas', 'pisada', 'sensor', 'running', 'tecnologia', 'hombre']
  },
  {
    id: 'th09', nombre: 'Cámara Deportiva Compacta', categoria: 'tecnologia', publico: 'Hombre', precio: 199.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Cámara de acción pequeña y resistente para grabar tu técnica de carrera y tus sesiones de entrenamiento en alta calidad.',
    caracteristicas: ['Video 4K estabilizado', 'Resistente al agua sin carcasa', 'Pantalla doble para encuadrarte'],
    ficha: [['Video', '4K a 60 fps'], ['Estabilización', 'Electrónica'], ['Resistencia al agua', 'Hasta 10 m'], ['Batería', '≈90 min de grabación'], ['Incluye', 'Soporte y batería']],
    claves: ['camara', 'video', 'grabar', 'accion', 'tecnologia', 'hombre']
  },
  {
    id: 'th10', nombre: 'Localizador GPS Personal', categoria: 'tecnologia', publico: 'Hombre', precio: 79.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Localizador GPS compacto que comparte tu ubicación con tus contactos mientras entrenas al aire libre.',
    caracteristicas: ['Ubicación en tiempo real', 'Botón de emergencia', 'Batería de larga duración'],
    ficha: [['Funciones', 'Ubicación y SOS'], ['Conectividad', 'GPS y red móvil'], ['Batería', 'Hasta 7 días'], ['Resistencia', 'IP67'], ['Uso ideal', 'Trail y entrenamientos al aire libre']],
    claves: ['localizador', 'gps', 'seguridad', 'ubicacion', 'tecnologia', 'hombre']
  },
  {
    id: 'th11', nombre: 'Botella Inteligente', categoria: 'tecnologia', publico: 'Hombre', precio: 44.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Botella de acero con recordatorios de hidratación y registro de consumo en la app. Mantiene el agua fría en tus entrenamientos.',
    caracteristicas: ['Recordatorios de hidratación', 'Registro de consumo en la app', 'Acero inoxidable con doble pared'],
    ficha: [['Capacidad', '700 ml'], ['Material', 'Acero inoxidable'], ['Mantiene frío', 'Hasta 12 h'], ['Batería', 'Hasta 14 días'], ['Compatible', 'Android y iPhone']],
    claves: ['botella', 'agua', 'hidratacion', 'termo', 'tecnologia', 'hombre']
  },
  {
    id: 'th12', nombre: 'Masajeador Muscular Eléctrico', categoria: 'tecnologia', publico: 'Hombre', precio: 119.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Masajeador de percusión potente para recuperarte después del ejercicio. Incluye varios cabezales para piernas, espalda y brazos.',
    caracteristicas: ['6 niveles de intensidad', '4 cabezales intercambiables', 'Motor potente y silencioso'],
    ficha: [['Velocidades', '6 niveles'], ['Cabezales', '4 incluidos'], ['Batería', 'Hasta 5 h'], ['Peso', '≈800 g'], ['Uso ideal', 'Recuperación muscular']],
    claves: ['masaje', 'masajeador', 'pistola', 'recuperacion', 'muscular', 'tecnologia', 'hombre']
  },
  {
    id: 'th14', nombre: 'Linterna Frontal para Running', categoria: 'tecnologia', publico: 'Hombre', precio: 39.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Linterna frontal liviana y recargable para correr de noche o en senderos. Su banda elástica no se mueve al correr.',
    caracteristicas: ['Hasta 400 lúmenes', 'Recargable por USB-C', 'Banda elástica cómoda'],
    ficha: [['Potencia', '400 lúmenes'], ['Modos', '4 (incluye luz roja)'], ['Batería', 'Hasta 10 h'], ['Resistencia', 'IPX4 (lluvia)'], ['Peso', '≈80 g']],
    claves: ['linterna', 'frontal', 'luz', 'noche', 'trail', 'tecnologia', 'hombre']
  },
  {
    id: 'th15', nombre: 'Cronómetro Profesional con Vueltas', categoria: 'tecnologia', publico: 'Hombre', precio: 34.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Cronómetro profesional para entrenadores y atletas. Mide parciales, intervalos y tiempos con precisión de centésimas.',
    caracteristicas: ['Memoria de vueltas y parciales', 'Precisión de 1/100 s', 'Diseño robusto y resistente'],
    ficha: [['Memoria', '200 vueltas'], ['Precisión', '1/100 s'], ['Funciones', 'Cronómetro, parciales e intervalos'], ['Resistencia al agua', '5 ATM'], ['Batería', 'Pila de botón (2 años)']],
    claves: ['cronometro', 'tiempo', 'vueltas', 'parciales', 'tecnologia', 'hombre']
  },
  {
    id: 'en07', nombre: 'Cajón Pliométrico 3 en 1', categoria: 'entrenamiento', publico: null, precio: 79.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Cajón de saltos con tres alturas para trabajar la potencia de piernas. Su superficie antideslizante da seguridad en cada salto.',
    caracteristicas: ['3 alturas en un solo cajón', 'Superficie antideslizante', 'Estructura firme y estable'],
    ficha: [['Alturas', '50, 60 y 75 cm'], ['Material', 'Madera reforzada'], ['Carga máxima', '150 kg'], ['Superficie', 'Antideslizante'], ['Uso ideal', 'Saltos y potencia']],
    claves: ['cajon', 'pliometrico', 'saltos', 'box', 'entrenamiento']
  },
  {
    id: 'en08', nombre: 'Tacos de Salida para Atletismo', categoria: 'entrenamiento', publico: null, precio: 79.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Tacos de salida ajustables para practicar la salida y la aceleración en pruebas de velocidad.',
    caracteristicas: ['Inclinación ajustable', 'Base metálica estable', 'Pedales con superficie de agarre'],
    ficha: [['Material', 'Aluminio y acero'], ['Ajuste', 'Distancia e inclinación'], ['Pedales', 'Antideslizantes'], ['Peso', '≈6 kg'], ['Uso ideal', 'Salidas de velocidad']],
    claves: ['tacos', 'salida', 'atletismo', 'velocidad', 'sprint', 'entrenamiento']
  },
  {
    id: 'en09', nombre: 'Sistema Electrónico de Cronometraje', categoria: 'entrenamiento', publico: null, precio: 349.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Sistema de fotoceldas para medir tus tiempos en tramos cortos con precisión. Incluye trípodes y se conecta al celular.',
    caracteristicas: ['Fotoceldas de alta precisión', 'Trípodes ajustables incluidos', 'Resultados en el celular'],
    ficha: [['Precisión', '1/1000 s'], ['Incluye', '2 fotoceldas y 2 trípodes'], ['Alcance', 'Hasta 50 m'], ['Batería', 'Hasta 10 h'], ['Conexión', 'Bluetooth']],
    claves: ['cronometraje', 'fotoceldas', 'tiempos', 'velocidad', 'entrenamiento']
  },
  {
    id: 'en10', nombre: 'Cinturón de Resistencia para Sprints', categoria: 'entrenamiento', publico: null, precio: 34.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Cinturón con cuerda elástica para hacer aceleraciones con resistencia controlada, solo o con un compañero.',
    caracteristicas: ['Cinturón acolchado y ajustable', 'Cuerda elástica de alta resistencia', 'Liberación rápida'],
    ficha: [['Cinturón', 'Ajustable 65 – 120 cm'], ['Cuerda', 'Elástica 3 m'], ['Resistencia', 'Media – alta'], ['Material', 'Nylon y látex'], ['Uso ideal', 'Aceleraciones y sprints']],
    claves: ['cinturon', 'resistencia', 'sprint', 'arrastre', 'entrenamiento']
  },
  {
    id: 'en11', nombre: 'Cuerda de Saltar de Velocidad', categoria: 'entrenamiento', publico: null, precio: 19.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Cuerda de saltar con rodamientos para giros rápidos. Mejora tu coordinación, ritmo y resistencia cardiovascular.',
    caracteristicas: ['Rodamientos para giros rápidos', 'Largo ajustable', 'Mangos ergonómicos'],
    ficha: [['Cable', 'Acero recubierto'], ['Largo', 'Hasta 3 m (ajustable)'], ['Mangos', 'Aluminio con agarre'], ['Peso', '≈180 g'], ['Uso ideal', 'Cardio y coordinación']],
    claves: ['cuerda', 'saltar', 'comba', 'cardio', 'entrenamiento']
  },
  {
    id: 'en12', nombre: 'Rodillo de Liberación Miofascial', categoria: 'entrenamiento', publico: null, precio: 29.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Rodillo con relieve para automasaje y movilidad. Ayuda a liberar la tensión muscular después de entrenar.',
    caracteristicas: ['Superficie con relieve de 3 zonas', 'Núcleo rígido que no se deforma', 'Liviano y fácil de llevar'],
    ficha: [['Medida', '33 × 14 cm'], ['Material', 'EVA sobre núcleo rígido'], ['Carga máxima', '150 kg'], ['Peso', '≈700 g'], ['Uso ideal', 'Automasaje y movilidad']],
    claves: ['rodillo', 'foam roller', 'masaje', 'movilidad', 'entrenamiento']
  },
  {
    id: 'en13', nombre: 'Tabla de Equilibrio', categoria: 'entrenamiento', publico: null, precio: 34.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Tabla redonda de equilibrio para trabajar estabilidad, tobillos y control del cuerpo.',
    caracteristicas: ['Superficie antideslizante', 'Base que gira en 360°', 'Ayuda a prevenir lesiones'],
    ficha: [['Diámetro', '40 cm'], ['Material', 'Madera con superficie de goma'], ['Inclinación', 'Hasta 15°'], ['Carga máxima', '150 kg'], ['Uso ideal', 'Equilibrio y tobillos']],
    claves: ['tabla', 'equilibrio', 'balance', 'estabilidad', 'entrenamiento']
  },
  {
    id: 'en14', nombre: 'Kit de Resistencia para Tobillos', categoria: 'entrenamiento', publico: null, precio: 24.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Par de tobilleras con bandas de resistencia para fortalecer piernas, glúteos y cadera.',
    caracteristicas: ['Tobilleras acolchadas con velcro', 'Bandas de distintas resistencias', 'Ideal para casa o gimnasio'],
    ficha: [['Contenido', '2 tobilleras y 3 bandas'], ['Resistencia', 'Ligera, media y fuerte'], ['Ajuste', 'Velcro'], ['Material', 'Neopreno y látex'], ['Uso ideal', 'Piernas y glúteos']],
    claves: ['tobilleras', 'tobillos', 'resistencia', 'bandas', 'piernas', 'entrenamiento']
  },
  {
    id: 'en15', nombre: 'Trineo de Arrastre para Entrenamiento', categoria: 'entrenamiento', publico: null, precio: 129.99,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Trineo de acero para arrastres y empujes. Desarrolla fuerza horizontal y aceleración; se le pueden agregar discos de peso.',
    caracteristicas: ['Estructura de acero resistente', 'Admite discos de peso', 'Para empujar o arrastrar'],
    ficha: [['Material', 'Acero'], ['Peso propio', '≈12 kg'], ['Carga', 'Discos de hasta 100 kg'], ['Superficie', 'Césped y pista'], ['Uso ideal', 'Fuerza y aceleración']],
    claves: ['trineo', 'sled', 'arrastre', 'fuerza', 'entrenamiento']
  }
];

/* Guía de tallas (EU) */
const GUIA_TALLAS = [
  ['35', '22 cm'], ['36', '22.5 cm'], ['36.5', '23 cm'], ['37', '23.5 cm'], ['37.5', '23.8 cm'], ['38', '24 cm'],
  ['38.5', '24.5 cm'], ['39', '25 cm'], ['40', '25.5 cm'], ['41', '26 cm'], ['42', '27 cm'],
  ['43', '27.5 cm'], ['44', '28.5 cm'], ['45', '29 cm']
];


const BUSQUEDAS_POPULARES = ['calzado', 'reloj', 'audífonos', 'bandas', 'conos', 'chaleco', 'mujer', 'hombre'];

const AYUDA = [
  ['¿Cómo compro?', 'Elige un producto (y tu talla si es calzado), agrégalo al carrito, inicia sesión, elige la tienda donde lo retiras y paga con tarjeta.'],
  ['¿Qué necesito para crear mi cuenta?', 'Tu nombre, apellido, cédula ecuatoriana, celular y un correo al que tengas acceso. Te enviaremos un enlace para confirmar el correo antes de tu primera compra. También puedes entrar con tu cuenta de Google y completar tu cédula y celular.'],
  ['No me llega el correo de confirmación', 'Revisa la carpeta de spam o promociones. Si no aparece en unos minutos, en «Iniciar sesión» puedes pedir que te lo enviemos otra vez.'],
  ['¿Cómo puedo pagar?', 'Como prefieras: 1) con tarjeta de crédito o débito (Visa, Mastercard, American Express, Diners Club, Discover, JCB, UnionPay o Maestro), validamos el número, la fecha de vencimiento y el CVV; o 2) en efectivo en la tienda al retirar: reservamos tus productos y pagas en la caja cuando los recoges. Los pagos con tarjeta en línea son simulados: no se cobra dinero real.'],
  ['¿Entregan factura?', 'Sí. Al comprar te llega un correo con el detalle de tu pedido y la factura en PDF con tus datos (nombre, cédula, dirección y celular). Es un documento sin validez tributaria.'],
  ['¿Cómo recibo mi pedido?', 'Lo retiras gratis en la tienda que elijas. Está listo de 1 a 3 horas, según cuántos y qué productos pidas (por ejemplo, el calzado se busca por talla en bodega y la tecnología se revisa y se carga antes de entregarla); al comprar te mostramos la hora aproximada. Te enviamos la orden de pedido con tu número de pedido y un código de retiro de 6 caracteres. En la tienda presenta tu cédula y tu número de pedido (o el código) para verificar tu compra. No hacemos envíos a domicilio.'],
  ['Privacidad: ¿qué datos guardan?', 'Solo los necesarios para tu cuenta y tus pedidos: nombre, cédula, dirección, celular, correo, tus pedidos y la marca y últimos 4 dígitos de tus tarjetas. Tu contraseña se guarda cifrada (bcrypt) y nadie puede verla. Si entras con Google, solo recibimos tu nombre y tu correo. En tu navegador (localStorage) guardamos tu carrito, tus favoritos y la última tienda de retiro que elegiste, separados por cuenta; se borran si limpias los datos del navegador. No vendemos ni compartimos tus datos.'],
  ['Condiciones de uso', 'Los pagos con tarjeta son simulados: no se cobra dinero real. Los pedidos se retiran en la tienda elegida presentando la cédula y el número de pedido o el código de retiro. Una vez pagado, el pedido no se puede modificar.'],
  ['¿Me avisan cuando cambia mi pedido?', 'Sí. Te llega un correo cuando recibimos tu compra y cada vez que tu pedido cambia: en preparación, listo para retirar, retirado o cancelado. También puedes verlo en «Mis pedidos».'],
  ['¿Cómo dejo una reseña?', 'Inicia sesión y entra a «Mis pedidos»: junto a cada producto que compraste está el botón «Escribir reseña». También puedes hacerlo desde la página del producto, en «Opiniones de clientes». La tienda verifica en tu cuenta que compraste ese producto: solo pueden opinar quienes lo compraron, y cada cliente deja una reseña por producto (puede editarla después).'],
  ['¿Puedo cambiar mi pedido después de pagar?', 'No. Antes de pagar puedes cambiar la talla, la cantidad o quitar productos del carrito. Una vez pagado, el pedido no se puede modificar.']
];
