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
    id: 'vx', nombre: 'ASICS Metaspeed Edge Paris', categoria: 'calzado', publico: 'Hombre', precio: 239.9,
    etiqueta: 'Nuevo',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla de competencia para corredores de zancada corta y cadencia alta. La espuma FF Turbo+ y la placa de carbono devuelven energía en cada paso, y la parte superior roja con degradado naranja es ligera y ventilada.',
    caracteristicas: ['Espuma FF Turbo+ de alto retorno', 'Placa de carbono de largo completo', 'Pensada para 10K, media maratón y maratón'],
    ficha: [['Amortiguación', 'FF Turbo+'], ['Placa', 'Carbono'], ['Peso', '≈190 g'], ['Desnivel (drop)', '5 mm'], ['Uso ideal', 'Competencia'], ['Color', 'Rojo y naranja'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'hombre', 'asics', 'metaspeed', 'edge', 'paris', 'competencia', 'carbono', 'rojo', 'naranja']
  },
  {
    id: 'sf', nombre: 'ASICS Metaspeed Sky Paris', categoria: 'calzado', publico: 'Hombre', precio: 249.5,
    etiqueta: '',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla de competencia para corredores que alargan la zancada al subir el ritmo. Combina la espuma FF Turbo+ con una placa de carbono para un despegue rápido, en un azul intenso con entresuela de colores.',
    caracteristicas: ['Espuma FF Turbo+ con placa de carbono', 'Diseñada para zancadas largas', 'Parte superior de malla ultraligera'],
    ficha: [['Amortiguación', 'FF Turbo+'], ['Placa', 'Carbono'], ['Peso', '≈185 g'], ['Desnivel (drop)', '5 mm'], ['Uso ideal', 'Competencia'], ['Color', 'Azul'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'hombre', 'asics', 'metaspeed', 'sky', 'paris', 'competencia', 'carbono', 'azul']
  },
  {
    id: 'oc', nombre: 'Brooks Glycerin 21', categoria: 'calzado', publico: 'Mujer', precio: 164.9,
    etiqueta: '',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla de máxima amortiguación para rodajes largos y recuperación. La espuma DNA LOFT v3 es muy suave y la malla morada se ajusta con comodidad al pie.',
    caracteristicas: ['Espuma DNA LOFT v3 de máxima suavidad', 'Ajuste cómodo y acolchado', 'Ideal para kilómetros largos'],
    ficha: [['Amortiguación', 'DNA LOFT v3'], ['Placa', 'Sin placa'], ['Peso', '≈255 g'], ['Desnivel (drop)', '10 mm'], ['Uso ideal', 'Rodajes largos'], ['Color', 'Morado'], ['Tallas', '36 – 40 (EU), con medias tallas']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'mujer', 'brooks', 'glycerin', 'amortiguacion', 'morado']
  },
  {
    id: 'lr', nombre: 'Craft CTM Ultra Carbon 2', categoria: 'calzado', publico: 'Mujer', precio: 199,
    etiqueta: 'Nuevo',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla con placa de carbono y espuma CTM Ultra para rodajes largos a buen ritmo. Blanca con un diseño de pinceladas azules en la entresuela.',
    caracteristicas: ['Espuma CTM Ultra de alto volumen', 'Placa de carbono', 'Estable en distancias largas'],
    ficha: [['Amortiguación', 'CTM Ultra'], ['Placa', 'Carbono'], ['Peso', '≈240 g'], ['Desnivel (drop)', '8 mm'], ['Uso ideal', 'Rodajes largos rápidos'], ['Color', 'Blanco y azul'], ['Tallas', '36 – 40 (EU), con medias tallas']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'mujer', 'craft', 'ctm', 'ultra', 'carbon', 'carbono', 'blanco', 'azul']
  },
  {
    id: 'tn', nombre: 'ASICS Novablast 4 Matcha', categoria: 'calzado', publico: 'Hombre', precio: 139.9,
    etiqueta: '',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla de entrenamiento diario con mucho rebote. La espuma FF Blast+ es suave y reactiva, ideal para rodajes y cambios de ritmo, y su color verde matcha la hace fácil de combinar.',
    caracteristicas: ['Espuma FF Blast+ suave y reactiva', 'Suela con buen agarre en asfalto', 'Cómoda para rodajes diarios'],
    ficha: [['Amortiguación', 'FF Blast+'], ['Placa', 'Sin placa'], ['Peso', '≈255 g'], ['Desnivel (drop)', '8 mm'], ['Uso ideal', 'Entrenamiento diario'], ['Color', 'Verde matcha'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'hombre', 'asics', 'novablast', 'matcha', 'diario', 'verde']
  },
  {
    id: 'pt', nombre: 'Reloj GPS de running negro', categoria: 'tecnologia', publico: null, precio: 249,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'pantalla', 'correa y botones'],
    descripcion: 'Reloj deportivo con GPS para correr con datos en tiempo real: ritmo, frecuencia cardiaca, distancia y tiempo en una pantalla clara y fácil de leer bajo el sol.',
    caracteristicas: ['GPS para medir ritmo y distancia', 'Pulso en la muñeca', 'Pantalla de alto contraste'],
    ficha: [['Pantalla', 'AMOLED de 1.4"'], ['Batería', 'Hasta 14 días (30 h con GPS)'], ['GPS', 'Doble frecuencia'], ['Mide', 'Ritmo, distancia y frecuencia cardiaca'], ['Resistencia al agua', '5 ATM'], ['Color', 'Negro']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'reloj', 'gps', 'running', 'negro']
  },
  {
    id: 'sa', nombre: 'Audífonos de conducción ósea Shokz', categoria: 'tecnologia', publico: null, precio: 179.9,
    etiqueta: 'Nuevo',
    tallas: [],
    vistas: ['vista principal', 'auricular', 'arco y botones'],
    descripcion: 'Audífonos que transmiten el sonido por los pómulos y dejan los oídos libres, para escuchar música sin perder de vista el tráfico. Color gris glaciar, resistentes al sudor.',
    caracteristicas: ['Oídos libres para oír el entorno', 'Resistentes al sudor y la lluvia', 'Arco de titanio flexible'],
    ficha: [['Tipo', 'Conducción ósea'], ['Batería', 'Hasta 10 h'], ['Conexión', 'Bluetooth 5.3'], ['Resistencia', 'IP55'], ['Peso', '≈29 g'], ['Color', 'Gris glaciar']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'audifonos', 'conduccion', 'osea', 'shokz', 'auriculares', 'gris']
  },
  {
    id: 'cb', nombre: 'Banda cardiaca Polar H10', categoria: 'tecnologia', publico: null, precio: 89.9,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'sensor', 'correa'],
    descripcion: 'Banda de pecho que mide la frecuencia cardiaca con la precisión de un electrocardiograma. Se conecta al reloj, al celular y a las máquinas del gimnasio.',
    caracteristicas: ['Medición del pulso muy precisa', 'Conexión Bluetooth y ANT+', 'Correa cómoda y lavable'],
    ficha: [['Mide', 'Frecuencia cardiaca (tipo ECG)'], ['Batería', 'Hasta 400 h (pila CR2025)'], ['Conexión', 'Bluetooth y ANT+'], ['Resistencia', 'Al agua, 30 m'], ['Ajuste', 'Correa de 65 a 93 cm'], ['Color', 'Negro']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'banda', 'cardiaca', 'polar', 'h10', 'pulso', 'pecho']
  },
  {
    id: 'sp', nombre: 'Sensor de potencia Stryd', categoria: 'tecnologia', publico: null, precio: 219,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'sensor', 'sensor en la zapatilla'],
    descripcion: 'Sensor que se engancha a los cordones y mide la potencia de carrera en vatios, además de cadencia, tiempo de contacto y oscilación. Ayuda a controlar el esfuerzo en cuestas y con viento.',
    caracteristicas: ['Potencia de carrera en vatios', 'Se engancha a los cordones', 'Compatible con relojes deportivos'],
    ficha: [['Mide', 'Potencia, cadencia y tiempo de contacto'], ['Batería', 'Hasta 20 h, recargable'], ['Conexión', 'Bluetooth y ANT+'], ['Montaje', 'Clip en los cordones'], ['Peso', '≈9 g'], ['Color', 'Negro']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'sensor', 'potencia', 'stryd']
  },
  {
    id: 'hb', nombre: 'Cinturón de hidratación morado', categoria: 'tecnologia', publico: null, precio: 31.5,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'botella', 'bolsillo'],
    descripcion: 'Cinturón para correr con dos botellas, bolsillo con cierre y malla transpirable. Morado con fucsia y detalles reflectivos.',
    caracteristicas: ['Dos botellas incluidas', 'Bolsillo con cierre', 'Detalles reflectivos'],
    ficha: [['Capacidad', '2 botellas de 300 ml'], ['Bolsillo', 'Celular de hasta 6.7"'], ['Ajuste', 'Cintura de 60 a 105 cm'], ['Visibilidad', 'Detalles reflectivos'], ['Material', 'Lycra y malla'], ['Color', 'Morado y fucsia']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'cinturon', 'hidratacion', 'morado', 'fucsia']
  },
  {
    id: 'au', nombre: 'Reloj inteligente rosa de fitness', categoria: 'tecnologia', publico: null, precio: 189,
    etiqueta: 'Nuevo',
    tallas: [],
    vistas: ['vista principal', 'pantalla', 'correa'],
    descripcion: 'Reloj inteligente con pantalla redonda que mide pasos, pulso, calorías y sueño. Correa de silicona rosa con caja en oro rosa.',
    caracteristicas: ['Mide pasos, pulso y sueño', 'Pantalla AMOLED redonda', 'Correa de silicona cómoda'],
    ficha: [['Pantalla', 'AMOLED redonda de 1.3"'], ['Batería', 'Hasta 10 días'], ['Mide', 'Pulso, pasos, calorías y sueño'], ['Resistencia al agua', '5 ATM'], ['Correa', 'Silicona, de 14 a 20 cm'], ['Color', 'Rosa y oro rosa']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'reloj', 'inteligente', 'rosa', 'fitness', 'smartwatch']
  },
  {
    id: 'at', nombre: 'Kit Pista de Agilidad Pro', categoria: 'entrenamiento', publico: null, precio: 45.9,
    etiqueta: '',
    tallas: [],
    vistas: ['kit completo', 'escalera', 'vallas y conos'],
    descripcion: 'Kit para entrenar velocidad y coordinación: escalera de agilidad, vallas bajas y conos. Se arma en segundos en la pista, la cancha o el parque.',
    caracteristicas: ['Escalera de 12 peldaños', '4 vallas y 4 conos', 'Se guarda en su bolsa'],
    ficha: [['Escalera', '6 m · 12 peldaños'], ['Vallas', '4 unidades de 15 cm'], ['Conos', '4 unidades'], ['Incluye', 'Bolsa de transporte'], ['Uso ideal', 'Velocidad y coordinación'], ['Color', 'Amarillo y naranja']],
    claves: ['entrenamiento', 'accesorio', 'gimnasio', 'kit', 'pista', 'agilidad', 'pro', 'escalera', 'conos', 'vallas']
  },
  {
    id: 'pv', nombre: 'Chaleco Fuerza Élite', categoria: 'entrenamiento', publico: null, precio: 89.5,
    etiqueta: 'Nuevo',
    tallas: [],
    vistas: ['vista principal', 'bolsillos de peso', 'hombros'],
    descripcion: 'Chaleco con bolsillos para pesas que agrega carga a tus carreras, saltos y ejercicios de fuerza. Se ajusta con correas laterales y no rebota.',
    caracteristicas: ['Peso ajustable hasta 10 kg', 'Correas laterales firmes', 'Espalda con malla transpirable'],
    ficha: [['Peso', 'Ajustable hasta 10 kg'], ['Talla', 'Única, ajustable'], ['Cierre', 'Correas laterales con velcro'], ['Material', 'Nylon reforzado'], ['Uso ideal', 'Fuerza, carrera y saltos'], ['Color', 'Negro']],
    claves: ['entrenamiento', 'accesorio', 'gimnasio', 'chaleco', 'fuerza', 'elite', 'peso', 'negro']
  },
  {
    id: 'sc', nombre: 'Paracaídas de Velocidad Pro', categoria: 'entrenamiento', publico: null, precio: 27.8,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'paracaídas', 'cinturón'],
    descripcion: 'Paracaídas de resistencia que se abre al correr y obliga a empujar con más fuerza. Mejora la aceleración y la potencia en carreras cortas.',
    caracteristicas: ['Resistencia que aumenta con la velocidad', 'Cinturón con liberación rápida', 'Se guarda en su bolsa'],
    ficha: [['Diámetro', '142 cm'], ['Cinturón', 'Ajustable con liberación rápida'], ['Resistencia', 'Aumenta con tu velocidad'], ['Incluye', 'Bolsa para guardarlo'], ['Uso ideal', 'Carreras cortas y arranques'], ['Color', 'Negro y blanco']],
    claves: ['entrenamiento', 'accesorio', 'gimnasio', 'paracaidas', 'velocidad', 'pro', 'resistencia']
  },
  {
    id: 'fl', nombre: 'Set Lazo de Fuerza', categoria: 'entrenamiento', publico: null, precio: 22.4,
    etiqueta: '',
    tallas: [],
    vistas: ['set completo', 'bolsa', 'bandas'],
    descripcion: 'Set de cinco bandas elásticas de distinta resistencia para fuerza, movilidad y calentamiento. Vienen en una bolsa de tela para llevarlas a todas partes.',
    caracteristicas: ['5 niveles de resistencia', 'Látex resistente', 'Bolsa de tela incluida'],
    ficha: [['Contenido', '5 bandas de látex'], ['Resistencia', 'De 5 a 40 kg aprox.'], ['Medida', '60 × 5 cm'], ['Incluye', 'Bolsa de tela'], ['Uso ideal', 'Fuerza y movilidad'], ['Color', 'Negro, rojo, azul, verde y amarillo']],
    claves: ['entrenamiento', 'accesorio', 'gimnasio', 'set', 'lazo', 'fuerza', 'bandas', 'elasticas', 'ligas']
  },
  {
    id: 'cm', nombre: 'Balón Medicinal Núcleo Pro', categoria: 'entrenamiento', publico: null, precio: 54,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'textura', 'costura'],
    descripcion: 'Balón medicinal de caucho con superficie texturizada que no se resbala. Ideal para lanzamientos, abdominales y ejercicios de fuerza funcional.',
    caracteristicas: ['Superficie texturizada antideslizante', 'Rebote controlado', 'Resistente a golpes y caídas'],
    ficha: [['Peso', '6 kg'], ['Diámetro', '≈28 cm'], ['Superficie', 'Texturizada antideslizante'], ['Material', 'Caucho reforzado'], ['Uso ideal', 'Abdomen y fuerza funcional'], ['Color', 'Negro']],
    claves: ['entrenamiento', 'accesorio', 'gimnasio', 'balon', 'medicinal', 'nucleo', 'pro', 'pelota', 'fuerza']
  },
  /* ---- Catálogo ampliado ---- */
  {
    id: 'zh01', nombre: 'Adidas Adizero Boston 12', categoria: 'calzado', publico: 'Hombre', precio: 164,
    etiqueta: '',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla rápida para series, tempos y rodajes largos. La espuma Lightstrike Pro y las varillas EnergyRods dan una pisada firme y veloz, en un amarillo limón que se ve en cualquier ruta.',
    caracteristicas: ['Espuma Lightstrike Pro en el antepié', 'Varillas EnergyRods para la transición', 'Versátil entre el entrenamiento y la carrera'],
    ficha: [['Amortiguación', 'Lightstrike Pro y Lightstrike 2.0'], ['Placa', 'Varillas EnergyRods'], ['Peso', '≈265 g'], ['Desnivel (drop)', '6.5 mm'], ['Uso ideal', 'Series y tempos'], ['Color', 'Amarillo limón'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'hombre', 'adidas', 'adizero', 'boston', 'velocidad', 'amarillo', 'limon']
  },
  {
    id: 'zh02', nombre: 'Adidas Adizero Adios Pro 4', categoria: 'calzado', publico: 'Hombre', precio: 245,
    etiqueta: '',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla de maratón con espuma Lightstrike Pro y varillas de carbono EnergyRods. Su suela en forma de balancín ayuda a mantener el ritmo en los últimos kilómetros. Color rojo coral.',
    caracteristicas: ['Varillas de carbono EnergyRods', 'Espuma Lightstrike Pro de alto rendimiento', 'Geometría en balancín para ritmos sostenidos'],
    ficha: [['Amortiguación', 'Lightstrike Pro'], ['Placa', 'Varillas de carbono'], ['Peso', '≈200 g'], ['Desnivel (drop)', '6 mm'], ['Uso ideal', 'Maratón'], ['Color', 'Rojo coral'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'hombre', 'adidas', 'adizero', 'adios', 'pro', 'competencia', 'carbono', 'rojo', 'coral']
  },
  {
    id: 'zh03', nombre: 'Brooks Ghost 16', categoria: 'calzado', publico: 'Hombre', precio: 139.5,
    etiqueta: '',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla neutra y cómoda para el día a día. La espuma DNA LOFT v3 amortigua sin perder estabilidad y la malla azul marino se ajusta bien al pie en distancias medias y largas.',
    caracteristicas: ['Espuma DNA LOFT v3 suave', 'Transiciones fluidas del talón a la punta', 'Ideal para empezar a correr'],
    ficha: [['Amortiguación', 'DNA LOFT v3'], ['Placa', 'Sin placa'], ['Peso', '≈269 g'], ['Desnivel (drop)', '12 mm'], ['Uso ideal', 'Entrenamiento diario'], ['Color', 'Azul marino'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'hombre', 'brooks', 'ghost', 'diario', 'azul', 'marino']
  },
  {
    id: 'zh04', nombre: 'HOKA Mach 6', categoria: 'calzado', publico: 'Hombre', precio: 148.75,
    etiqueta: '',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla ligera y reactiva para entrenamientos de ritmo. La espuma de EVA supercrítica rebota en cada pisada y su forma de balancín facilita la transición. Colores coral y amarillo.',
    caracteristicas: ['Espuma de EVA supercrítica', 'Forma de balancín para rodar mejor', 'Ligera para ritmos rápidos'],
    ficha: [['Amortiguación', 'EVA supercrítica'], ['Placa', 'Sin placa'], ['Peso', '≈232 g'], ['Desnivel (drop)', '5 mm'], ['Uso ideal', 'Ritmo y tempos'], ['Color', 'Coral y amarillo'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'hombre', 'hoka', 'mach', 'ritmo', 'coral', 'amarillo']
  },
  {
    id: 'zh05', nombre: 'Mizuno Wave Rebellion Pro 2', categoria: 'calzado', publico: 'Hombre', precio: 229,
    etiqueta: '',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla de competencia con espuma Mizuno Enerzy Lite+ y placa de carbono. Su talón recortado y su suela curva empujan hacia adelante. Amarillo neón con entresuela azul.',
    caracteristicas: ['Espuma Enerzy Lite+ de alto retorno', 'Placa de carbono', 'Talón recortado que impulsa la zancada'],
    ficha: [['Amortiguación', 'Enerzy Lite+'], ['Placa', 'Carbono'], ['Peso', '≈225 g'], ['Desnivel (drop)', '8 mm'], ['Uso ideal', 'Competencia'], ['Color', 'Amarillo neón y azul'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'hombre', 'mizuno', 'wave', 'rebellion', 'pro', 'competencia', 'carbono', 'amarillo', 'neon']
  },
  {
    id: 'zh06', nombre: 'New Balance FuelCell SuperComp Elite v4', categoria: 'calzado', publico: 'Hombre', precio: 259.9,
    etiqueta: '',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla de maratón con espuma FuelCell de alto rebote y placa de carbono Energy Arc. Blanca con detalles azul y lima, muy ligera para competir a ritmo alto.',
    caracteristicas: ['Espuma FuelCell de alto rebote', 'Placa de carbono Energy Arc', 'Parte superior ligera y ventilada'],
    ficha: [['Amortiguación', 'FuelCell'], ['Placa', 'Carbono'], ['Peso', '≈210 g'], ['Desnivel (drop)', '4 mm'], ['Uso ideal', 'Maratón'], ['Color', 'Blanco, azul y lima'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'hombre', 'new', 'balance', 'fuelcell', 'supercomp', 'elite', 'competencia', 'carbono', 'blanco', 'new balance']
  },
  {
    id: 'zh07', nombre: 'Nike Alphafly 3', categoria: 'calzado', publico: 'Hombre', precio: 289,
    etiqueta: '',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla de maratón con espuma ZoomX, unidades Air Zoom en el antepié y placa de carbono Flyplate. Blanca con naranja, pensada para los ritmos más exigentes.',
    caracteristicas: ['Espuma ZoomX con unidades Air Zoom', 'Placa de carbono Flyplate', 'Malla Atomknit ligera y transpirable'],
    ficha: [['Amortiguación', 'ZoomX y Air Zoom'], ['Placa', 'Carbono Flyplate'], ['Peso', '≈218 g'], ['Desnivel (drop)', '8 mm'], ['Uso ideal', 'Maratón'], ['Color', 'Blanco y naranja'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'hombre', 'nike', 'alphafly', 'competencia', 'carbono', 'blanco', 'naranja']
  },
  {
    id: 'zh08', nombre: 'Nike Vaporfly 3', categoria: 'calzado', publico: 'Hombre', precio: 259,
    etiqueta: '',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla de carrera rápida con espuma ZoomX y placa de carbono Flyplate. Muy ligera y reactiva para 5K, 10K y maratón, en verde neón.',
    caracteristicas: ['Espuma ZoomX muy ligera', 'Placa de carbono Flyplate', 'Malla Flyknit transpirable'],
    ficha: [['Amortiguación', 'ZoomX'], ['Placa', 'Carbono Flyplate'], ['Peso', '≈196 g'], ['Desnivel (drop)', '8 mm'], ['Uso ideal', 'Competencia'], ['Color', 'Verde neón'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'hombre', 'nike', 'vaporfly', 'competencia', 'carbono', 'verde', 'neon']
  },
  {
    id: 'zh09', nombre: 'On Cloudboom Echo 3', categoria: 'calzado', publico: 'Hombre', precio: 274.9,
    etiqueta: '',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla de maratón con espuma Helion HF y la placa Speedboard de carbono. Blanca con detalles negros, combina amortiguación alta y un despegue rápido.',
    caracteristicas: ['Espuma Helion HF de alto rendimiento', 'Speedboard de carbono', 'Suela CloudTec para aterrizajes suaves'],
    ficha: [['Amortiguación', 'Helion HF'], ['Placa', 'Speedboard de carbono'], ['Peso', '≈220 g'], ['Desnivel (drop)', '9 mm'], ['Uso ideal', 'Maratón'], ['Color', 'Blanco y negro'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'hombre', 'cloudboom', 'echo', 'competencia', 'carbono', 'blanco', 'on']
  },
  {
    id: 'zh10', nombre: 'Puma Deviate Nitro Elite 3', categoria: 'calzado', publico: 'Hombre', precio: 234.5,
    etiqueta: '',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla de competencia con espuma Nitro Elite y placa de carbono PWRPLATE. Su degradado de amarillo neón a azul intenso la hace inconfundible en la línea de salida.',
    caracteristicas: ['Espuma Nitro Elite de alto retorno', 'Placa de carbono PWRPLATE', 'Suela PUMAGRIP con buen agarre'],
    ficha: [['Amortiguación', 'Nitro Elite'], ['Placa', 'Carbono PWRPLATE'], ['Peso', '≈215 g'], ['Desnivel (drop)', '8 mm'], ['Uso ideal', 'Competencia'], ['Color', 'Amarillo neón y azul'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'hombre', 'puma', 'deviate', 'nitro', 'elite', 'competencia', 'carbono', 'amarillo', 'azul']
  },
  {
    id: 'zh11', nombre: 'Saucony Endorphin Speed 4', categoria: 'calzado', publico: 'Hombre', precio: 169.9,
    etiqueta: 'Nuevo',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla versátil para entrenamientos rápidos y carreras. La espuma PWRRUN PB y la placa de nylon dan rebote sin perder control. Turquesa con detalles naranjas.',
    caracteristicas: ['Espuma PWRRUN PB ligera', 'Placa de nylon flexible', 'Geometría SPEEDROLL que impulsa la pisada'],
    ficha: [['Amortiguación', 'PWRRUN PB'], ['Placa', 'Nylon'], ['Peso', '≈231 g'], ['Desnivel (drop)', '8 mm'], ['Uso ideal', 'Series y carreras'], ['Color', 'Turquesa y naranja'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'hombre', 'saucony', 'endorphin', 'speed', 'velocidad', 'turquesa', 'naranja']
  },
  {
    id: 'zh12', nombre: 'Under Armour Flow Velociti Elite', categoria: 'calzado', publico: 'Hombre', precio: 219,
    etiqueta: 'Nuevo',
    tallas: ['39', '40', '41', '42', '43', '44', '45'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla de competencia sin suela de goma: la espuma UA Flow agarra directo en el asfalto y la placa de carbono da impulso. Blanca con degradado fucsia.',
    caracteristicas: ['Espuma UA Flow sin suela de goma', 'Placa de carbono', 'Muy ligera para ritmos de carrera'],
    ficha: [['Amortiguación', 'UA Flow'], ['Placa', 'Carbono'], ['Peso', '≈210 g'], ['Desnivel (drop)', '8 mm'], ['Uso ideal', 'Competencia'], ['Color', 'Blanco y fucsia'], ['Tallas', '39 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'hombre', 'under', 'armour', 'flow', 'velociti', 'elite', 'competencia', 'carbono', 'blanco', 'fucsia', 'under armour']
  },
  {
    id: 'zm01', nombre: 'Diadora Atomo V7000', categoria: 'calzado', publico: 'Mujer', precio: 149,
    etiqueta: '',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla de entrenamiento con diseño italiano. Su espuma amortigua bien en rodajes diarios y la parte superior blanca con detalles azul marino y rojo da un estilo clásico.',
    caracteristicas: ['Espuma de amortiguación equilibrada', 'Diseño italiano con detalles tricolor', 'Cómoda para entrenar a diario'],
    ficha: [['Amortiguación', 'Espuma Diadora'], ['Placa', 'Sin placa'], ['Peso', '≈250 g'], ['Desnivel (drop)', '8 mm'], ['Uso ideal', 'Entrenamiento diario'], ['Color', 'Blanco, azul marino y rojo'], ['Tallas', '36 – 40 (EU), con medias tallas']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'mujer', 'diadora', 'atomo', 'v7000', 'diario', 'blanco']
  },
  {
    id: 'zm02', nombre: 'Karhu Fusion 4.0', categoria: 'calzado', publico: 'Mujer', precio: 138.5,
    etiqueta: '',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla finlandesa con tecnología Fulcrum, que guía la pisada del talón a la punta. Combina tonos crema, verde y naranja con una entresuela cómoda para el día a día.',
    caracteristicas: ['Tecnología Fulcrum que guía la pisada', 'Espuma ligera y cómoda', 'Estilo clásico para entrenar o pasear'],
    ficha: [['Amortiguación', 'Espuma Aero'], ['Placa', 'Sin placa'], ['Peso', '≈240 g'], ['Desnivel (drop)', '8 mm'], ['Uso ideal', 'Entrenamiento diario'], ['Color', 'Crema, verde y naranja'], ['Tallas', '36 – 40 (EU), con medias tallas']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'mujer', 'karhu', 'fusion', 'diario', 'crema', 'verde']
  },
  {
    id: 'zm03', nombre: 'Mizuno Wave Rebellion Flash 2', categoria: 'calzado', publico: 'Mujer', precio: 154.9,
    etiqueta: '',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla rápida para entrenamientos de ritmo con espuma Enerzy XP y placa de fibra de vidrio. Su degradado de morado a fucsia la hace muy llamativa.',
    caracteristicas: ['Espuma Enerzy XP de alto rebote', 'Placa de fibra de vidrio', 'Talón recortado para una transición rápida'],
    ficha: [['Amortiguación', 'Enerzy XP'], ['Placa', 'Fibra de vidrio'], ['Peso', '≈220 g'], ['Desnivel (drop)', '8 mm'], ['Uso ideal', 'Ritmo y tempos'], ['Color', 'Morado y fucsia'], ['Tallas', '36 – 40 (EU), con medias tallas']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'mujer', 'mizuno', 'wave', 'rebellion', 'flash', 'ritmo', 'morado', 'fucsia']
  },
  {
    id: 'zm04', nombre: 'Newton Distance 12', categoria: 'calzado', publico: 'Mujer', precio: 149.5,
    etiqueta: '',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla ligera con los tacos Action/Reaction en el antepié, que favorecen una pisada de media planta. Azul celeste con detalles amarillo neón.',
    caracteristicas: ['Tacos Action/Reaction en el antepié', 'Drop bajo para una pisada natural', 'Muy ligera'],
    ficha: [['Amortiguación', 'Action/Reaction'], ['Placa', 'Sin placa'], ['Peso', '≈205 g'], ['Desnivel (drop)', '3 mm'], ['Uso ideal', 'Ritmo y técnica'], ['Color', 'Celeste y amarillo neón'], ['Tallas', '36 – 40 (EU), con medias tallas']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'mujer', 'newton', 'distance', 'ritmo', 'celeste', 'azul']
  },
  {
    id: 'zm05', nombre: 'On Cloudstrike Edición Especial', categoria: 'calzado', publico: 'Mujer', precio: 159,
    etiqueta: '',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla de edición especial con la suela CloudTec, cuyas cápsulas se comprimen al aterrizar y se vuelven firmes al despegar. Blanca con fucsia.',
    caracteristicas: ['Suela CloudTec con cápsulas', 'Aterrizajes suaves y despegues firmes', 'Diseño de edición especial'],
    ficha: [['Amortiguación', 'CloudTec'], ['Placa', 'Sin placa'], ['Peso', '≈250 g'], ['Desnivel (drop)', '9 mm'], ['Uso ideal', 'Entrenamiento diario'], ['Color', 'Blanco y fucsia'], ['Tallas', '36 – 40 (EU), con medias tallas']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'mujer', 'cloudstrike', 'edicion', 'especial', 'diario', 'blanco', 'fucsia', 'rosa', 'on']
  },
  {
    id: 'zm06', nombre: 'Salomon Aero Glide 2', categoria: 'calzado', publico: 'Mujer', precio: 144.9,
    etiqueta: '',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla de asfalto con mucha amortiguación y forma de balancín. La espuma Energy Foam es suave y ligera, en celeste con detalles coral.',
    caracteristicas: ['Espuma Energy Foam suave', 'Forma de balancín para rodar mejor', 'Ligera para su nivel de amortiguación'],
    ficha: [['Amortiguación', 'Energy Foam'], ['Placa', 'Sin placa'], ['Peso', '≈215 g'], ['Desnivel (drop)', '10 mm'], ['Uso ideal', 'Rodajes largos'], ['Color', 'Celeste y coral'], ['Tallas', '36 – 40 (EU), con medias tallas']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'mujer', 'salomon', 'aero', 'glide', 'amortiguacion', 'celeste', 'coral']
  },
  {
    id: 'zm07', nombre: 'Salomon S/LAB Phantasm 2', categoria: 'calzado', publico: 'Mujer', precio: 239.9,
    etiqueta: '',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla de competencia de la línea S/LAB con espuma Energy Surge y placa de carbono. Roja con talón blanco, pensada para batir marcas.',
    caracteristicas: ['Espuma Energy Surge', 'Placa de carbono', 'Línea de competencia S/LAB'],
    ficha: [['Amortiguación', 'Energy Surge'], ['Placa', 'Carbono'], ['Peso', '≈205 g'], ['Desnivel (drop)', '9 mm'], ['Uso ideal', 'Competencia'], ['Color', 'Rojo'], ['Tallas', '36 – 40 (EU), con medias tallas']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'mujer', 'salomon', 'lab', 'phantasm', 'competencia', 'carbono', 'rojo']
  },
  {
    id: 'zm08', nombre: 'Skechers GOrun Speed Elite Hyper', categoria: 'calzado', publico: 'Mujer', precio: 179.5,
    etiqueta: '',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla de velocidad con espuma Hyper Burst Pro, muy ligera y reactiva. Su color coral neón la hace visible en cualquier entrenamiento.',
    caracteristicas: ['Espuma Hyper Burst Pro', 'Muy ligera y reactiva', 'Ideal para series y carreras cortas'],
    ficha: [['Amortiguación', 'Hyper Burst Pro'], ['Placa', 'Placa de carbono'], ['Peso', '≈190 g'], ['Desnivel (drop)', '8 mm'], ['Uso ideal', 'Series y carreras'], ['Color', 'Coral neón'], ['Tallas', '36 – 40 (EU), con medias tallas']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'mujer', 'skechers', 'gorun', 'speed', 'elite', 'hyper', 'velocidad', 'coral', 'neon']
  },
  {
    id: 'zm09', nombre: 'Topo Athletic Cyclone 2', categoria: 'calzado', publico: 'Mujer', precio: 139,
    etiqueta: '',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla ligera y rápida con espuma de PEBA y puntera ancha que deja mover los dedos. Verde menta con detalles coral.',
    caracteristicas: ['Espuma de PEBA muy ligera', 'Puntera ancha y cómoda', 'Drop bajo para una pisada natural'],
    ficha: [['Amortiguación', 'PEBA'], ['Placa', 'Sin placa'], ['Peso', '≈190 g'], ['Desnivel (drop)', '5 mm'], ['Uso ideal', 'Ritmo y tempos'], ['Color', 'Verde menta y coral'], ['Tallas', '36 – 40 (EU), con medias tallas']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'mujer', 'topo', 'athletic', 'cyclone', 'ritmo', 'verde', 'menta']
  },
  {
    id: 'zm10', nombre: 'Under Armour Infinite Elite', categoria: 'calzado', publico: 'Mujer', precio: 152.75,
    etiqueta: '',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla cómoda para rodajes largos con espuma UA HOVR+ que devuelve energía. Gris oscuro con entresuela rosa intenso.',
    caracteristicas: ['Espuma UA HOVR+ con retorno de energía', 'Suela con buen agarre', 'Cómoda para distancias largas'],
    ficha: [['Amortiguación', 'UA HOVR+'], ['Placa', 'Sin placa'], ['Peso', '≈230 g'], ['Desnivel (drop)', '8 mm'], ['Uso ideal', 'Rodajes largos'], ['Color', 'Gris y rosa'], ['Tallas', '36 – 40 (EU), con medias tallas']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'mujer', 'under', 'armour', 'infinite', 'elite', 'amortiguacion', 'gris', 'rosa', 'under armour']
  },
  {
    id: 'zm11', nombre: 'Under Armour Velociti Wind 3', categoria: 'calzado', publico: 'Mujer', precio: 129.9,
    etiqueta: 'Nuevo',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla ligera y versátil para entrenar a diario y subir el ritmo. Amarillo limón con detalles grises que se ven en cualquier ruta.',
    caracteristicas: ['Espuma ligera y reactiva', 'Malla transpirable', 'Versátil para entrenar a diario'],
    ficha: [['Amortiguación', 'Espuma UA Flow'], ['Placa', 'Sin placa'], ['Peso', '≈215 g'], ['Desnivel (drop)', '8 mm'], ['Uso ideal', 'Entrenamiento diario'], ['Color', 'Amarillo limón'], ['Tallas', '36 – 40 (EU), con medias tallas']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'mujer', 'under', 'armour', 'velociti', 'wind', 'diario', 'amarillo', 'limon', 'under armour']
  },
  {
    id: 'zm12', nombre: 'Topo Athletic Atmos', categoria: 'calzado', publico: 'Mujer', precio: 158,
    etiqueta: 'Nuevo',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla de máxima amortiguación con espuma ZipFoam y puntera ancha. Su color coral y la entresuela crema le dan un estilo cálido.',
    caracteristicas: ['Espuma ZipFoam de máxima amortiguación', 'Puntera ancha y cómoda', 'Ideal para rodajes largos'],
    ficha: [['Amortiguación', 'ZipFoam'], ['Placa', 'Sin placa'], ['Peso', '≈250 g'], ['Desnivel (drop)', '5 mm'], ['Uso ideal', 'Rodajes largos'], ['Color', 'Coral y crema'], ['Tallas', '36 – 40 (EU), con medias tallas']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'mujer', 'topo', 'athletic', 'atmos', 'amortiguacion', 'coral']
  },
  {
    id: 'zm13', nombre: 'Altra Escalante 4', categoria: 'calzado', publico: 'Mujer', precio: 136.4,
    etiqueta: 'Nuevo',
    tallas: ['36', '36.5', '37', '37.5', '38', '38.5', '39', '40'],
    vistas: ['par completo', 'zapatilla en primer plano', 'detalle de la puntera y la suela'],
    descripcion: 'Zapatilla de drop cero y puntera ancha para una pisada natural. La espuma Altra EGO es flexible y la malla rosa es suave al tacto.',
    caracteristicas: ['Drop cero para una pisada natural', 'Puntera ancha FootShape', 'Espuma Altra EGO flexible'],
    ficha: [['Amortiguación', 'Altra EGO'], ['Placa', 'Sin placa'], ['Peso', '≈210 g'], ['Desnivel (drop)', '0 mm'], ['Uso ideal', 'Entrenamiento diario'], ['Color', 'Rosa'], ['Tallas', '36 – 40 (EU), con medias tallas']],
    claves: ['zapatilla', 'zapatillas', 'tenis', 'calzado', 'correr', 'running', 'mujer', 'altra', 'escalante', 'diario', 'rosa']
  },
  {
    id: 'tm01', nombre: 'Reloj COROS Pace 3', categoria: 'tecnologia', publico: null, precio: 229,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'pantalla', 'correa'],
    descripcion: 'Reloj deportivo muy ligero con GPS de doble frecuencia y batería de larga duración. Correa de silicona gris perforada, cómoda para entrenar a diario.',
    caracteristicas: ['GPS de doble frecuencia', 'Batería de larga duración', 'Muy ligero en la muñeca'],
    ficha: [['Pantalla', 'Táctil de 1.2"'], ['Batería', 'Hasta 24 días (38 h con GPS)'], ['GPS', 'Doble frecuencia'], ['Mide', 'Ritmo, distancia, pulso y sueño'], ['Peso', '≈30 g'], ['Color', 'Blanco y gris']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'reloj', 'coros', 'pace', 'gps', 'blanco', 'gris']
  },
  {
    id: 'tm02', nombre: 'Secador de zapatillas con luz UV', categoria: 'tecnologia', publico: null, precio: 46.8,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'control', 'secadores'],
    descripcion: 'Secador eléctrico que se coloca dentro de las zapatillas para secarlas con calor suave y eliminar olores con luz UV. Con control de tiempo.',
    caracteristicas: ['Calor suave que no daña el calzado', 'Luz UV contra olores', 'Control con temporizador'],
    ficha: [['Función', 'Secado y luz UV'], ['Temporizador', '1, 2 o 3 horas'], ['Temperatura', '≈50 °C'], ['Alimentación', 'Enchufe de 110 V'], ['Incluye', '2 secadores y control'], ['Color', 'Blanco y gris']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'secador', 'zapatillas', 'con', 'luz', 'uv', 'blanco']
  },
  {
    id: 'tm03', nombre: 'Gafas deportivas rosas con lente espejado', categoria: 'tecnologia', publico: null, precio: 68.5,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'lente', 'patilla'],
    descripcion: 'Gafas para correr con lente espejado rosa que protege del sol y del viento. Montura ligera que no se mueve al correr.',
    caracteristicas: ['Lente espejado con filtro UV400', 'Montura ligera', 'No se mueven al correr'],
    ficha: [['Lente', 'Espejado con filtro UV400'], ['Montura', 'Ligera y flexible'], ['Peso', '≈28 g'], ['Ventilación', 'Ranuras en el lente'], ['Incluye', 'Funda de tela'], ['Color', 'Rosa']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'gafas', 'deportivas', 'rosas', 'con', 'lente', 'espejado', 'lentes', 'sol', 'rosa']
  },
  {
    id: 'tm07', nombre: 'Anillo inteligente oro rosa', categoria: 'tecnologia', publico: null, precio: 299,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'sensores', 'exterior'],
    descripcion: 'Anillo que mide el sueño, la frecuencia cardiaca y la recuperación después de entrenar. Acabado en oro rosa, ligero y resistente al agua.',
    caracteristicas: ['Mide sueño y recuperación', 'Acabado en oro rosa', 'Batería de varios días'],
    ficha: [['Mide', 'Sueño, pulso, temperatura y actividad'], ['Batería', 'Hasta 7 días'], ['Material', 'Titanio con acabado oro rosa'], ['Resistencia al agua', 'Hasta 100 m'], ['Conexión', 'Bluetooth'], ['Color', 'Oro rosa']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'anillo', 'inteligente', 'oro', 'rosa', 'sueno', 'oro rosa']
  },
  {
    id: 'tm08', nombre: 'Plantillas inteligentes rosas', categoria: 'tecnologia', publico: null, precio: 189.9,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'plantilla izquierda', 'plantilla derecha'],
    descripcion: 'Plantillas con sensores que registran la pisada, la cadencia y el equilibrio entre ambos pies. Superficie gris acolchada con bordes rosas.',
    caracteristicas: ['Sensores de pisada', 'Superficie acolchada', 'Se conectan al celular'],
    ficha: [['Mide', 'Pisada, cadencia y equilibrio'], ['Batería', 'Hasta 6 h, recargable'], ['Conexión', 'Bluetooth'], ['Material', 'Espuma acolchada'], ['Tallas', 'Recortables'], ['Color', 'Gris y rosa']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'plantillas', 'inteligentes', 'rosas', 'sensores', 'pisada', 'rosa']
  },
  {
    id: 'tm09', nombre: 'Alarma personal de seguridad rosa', categoria: 'tecnologia', publico: null, precio: 24.75,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'botón y luz', 'mosquetón'],
    descripcion: 'Alarma de bolsillo con sirena fuerte y luz LED para correr con más tranquilidad. Se lleva en las llaves o en la mochila con su mosquetón.',
    caracteristicas: ['Sirena muy fuerte', 'Luz LED para la noche', 'Mosquetón para llaves o mochila'],
    ficha: [['Sirena', '130 dB'], ['Luz', 'LED blanca'], ['Batería', 'Recargable por USB'], ['Activación', 'Botón o correa'], ['Peso', '≈40 g'], ['Color', 'Rosa']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'alarma', 'personal', 'seguridad', 'rosa', 'llavero']
  },
  {
    id: 'tm10', nombre: 'Botella inteligente rosa', categoria: 'tecnologia', publico: null, precio: 49.6,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'tapa', 'indicador luminoso'],
    descripcion: 'Botella de acero inoxidable con indicador luminoso que te recuerda beber agua durante el día. Tapa con asa y acabado rosa mate.',
    caracteristicas: ['Recordatorio luminoso para beber', 'Mantiene el agua fría', 'Acabado rosa mate'],
    ficha: [['Capacidad', '500 ml'], ['Material', 'Acero inoxidable'], ['Temperatura', 'Frío hasta 24 h'], ['Batería', 'Hasta 30 días, recargable'], ['Tapa', 'Con indicador y asa'], ['Color', 'Rosa']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'botella', 'inteligente', 'rosa', 'hidratacion']
  },
  {
    id: 'tm11', nombre: 'Monitor portátil de calidad del aire', categoria: 'tecnologia', publico: null, precio: 139,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'pantalla', 'correa'],
    descripcion: 'Medidor de bolsillo que muestra la calidad del aire antes de salir a correr: partículas PM2.5 y PM10, dióxido de carbono y compuestos orgánicos.',
    caracteristicas: ['Mide PM2.5, PM10 y CO₂', 'Pantalla a color fácil de leer', 'Con correa para llevarlo'],
    ficha: [['Mide', 'PM2.5, PM10, CO₂ y VOC'], ['Pantalla', 'A color de 2.4"'], ['Batería', 'Hasta 12 h, recargable'], ['Conexión', 'Bluetooth'], ['Peso', '≈120 g'], ['Color', 'Negro y naranja']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'monitor', 'portatil', 'calidad', 'del', 'aire', 'negro']
  },
  {
    id: 'tm12', nombre: 'Top deportivo rosa con sensor cardiaco', categoria: 'tecnologia', publico: null, precio: 74.9,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'sensor', 'espalda y tirantes'],
    descripcion: 'Top deportivo de soporte medio con sensor de frecuencia cardiaca integrado, sin necesidad de banda de pecho. Tela transpirable de secado rápido.',
    caracteristicas: ['Sensor cardiaco integrado', 'Soporte medio', 'Tela de secado rápido'],
    ficha: [['Mide', 'Frecuencia cardiaca'], ['Soporte', 'Medio'], ['Conexión', 'Bluetooth'], ['Tela', 'Transpirable de secado rápido'], ['Tallas', 'S, M y L'], ['Color', 'Rosa']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'top', 'deportivo', 'rosa', 'con', 'sensor', 'cardiaco', 'sujetador', 'pulso']
  },
  {
    id: 'tm13', nombre: 'Chaleco LED de alta visibilidad', categoria: 'tecnologia', publico: null, precio: 39.8,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'botón de encendido', 'correas'],
    descripcion: 'Chaleco ligero con luces LED y bandas reflectivas para que te vean al correr de noche. Se ajusta con correas y se carga por USB.',
    caracteristicas: ['Luces LED recargables', 'Bandas reflectivas', 'Ajuste con correas'],
    ficha: [['Luz', 'LED con 3 modos'], ['Batería', 'Hasta 8 h, recargable'], ['Visibilidad', 'Hasta 500 m'], ['Ajuste', 'Correas regulables'], ['Peso', '≈150 g'], ['Color', 'Negro y neón']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'chaleco', 'led', 'alta', 'visibilidad', 'luz', 'noche', 'reflectivo', 'neon']
  },
  {
    id: 'tm14', nombre: 'Secador de zapatillas con luz LED morada', categoria: 'tecnologia', publico: null, precio: 52.3,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'secadores y control', 'dentro de las zapatillas'],
    descripcion: 'Secador eléctrico con luz LED morada que seca y desinfecta las zapatillas después de entrenar. Control con botón de encendido y temporizador.',
    caracteristicas: ['Seca y elimina olores', 'Luz LED desinfectante', 'Control con temporizador'],
    ficha: [['Función', 'Secado y desinfección'], ['Temporizador', '1, 2 o 3 horas'], ['Temperatura', '≈50 °C'], ['Alimentación', 'Enchufe de 110 V'], ['Incluye', '2 secadores y control'], ['Color', 'Negro y rosa']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'secador', 'zapatillas', 'con', 'luz', 'led', 'morada', 'rosa']
  },
  {
    id: 'th02', nombre: 'Audífonos deportivos Under Armour', categoria: 'tecnologia', publico: null, precio: 129.5,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'estuche de carga', 'auricular'],
    descripcion: 'Audífonos inalámbricos con ganchos de oreja que no se mueven al correr. Resistentes al sudor y con estuche de carga para varias sesiones.',
    caracteristicas: ['Ganchos de oreja firmes', 'Resistentes al sudor', 'Estuche con carga extra'],
    ficha: [['Tipo', 'Inalámbricos con gancho'], ['Batería', 'Hasta 8 h (+24 h con el estuche)'], ['Conexión', 'Bluetooth 5.3'], ['Resistencia', 'IPX7'], ['Incluye', 'Estuche de carga'], ['Color', 'Negro y rojo']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'audifonos', 'deportivos', 'under', 'armour', 'auriculares', 'negro', 'under armour']
  },
  {
    id: 'th03', nombre: 'Cinturón de hidratación negro y lima', categoria: 'tecnologia', publico: null, precio: 32.9,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'botella', 'bolsillo'],
    descripcion: 'Cinturón para correr con dos botellas, bolsillo para el celular y detalles reflectivos en verde lima. Se ajusta a la cintura sin rebotar.',
    caracteristicas: ['Dos botellas incluidas', 'Bolsillo para celular y llaves', 'Detalles reflectivos'],
    ficha: [['Capacidad', '2 botellas de 300 ml'], ['Bolsillo', 'Celular de hasta 6.7"'], ['Ajuste', 'Cintura de 65 a 110 cm'], ['Visibilidad', 'Detalles reflectivos'], ['Material', 'Lycra transpirable'], ['Color', 'Negro y lima']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'cinturon', 'hidratacion', 'negro', 'lima']
  },
  {
    id: 'th05', nombre: 'Gafas deportivas inteligentes con pantalla', categoria: 'tecnologia', publico: null, precio: 279,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'pantalla en el lente', 'montura'],
    descripcion: 'Gafas para correr que muestran en el lente el ritmo, el pulso y la distancia, sin tener que mirar el reloj. Lente espejado que protege del sol.',
    caracteristicas: ['Datos en el lente sin mirar el reloj', 'Lente espejado con protección UV', 'Montura ligera y firme'],
    ficha: [['Pantalla', 'Proyección en el lente'], ['Muestra', 'Ritmo, pulso y distancia'], ['Batería', 'Hasta 10 h'], ['Conexión', 'Bluetooth'], ['Lente', 'Espejado con filtro UV400'], ['Color', 'Negro y rojo']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'gafas', 'deportivas', 'inteligentes', 'con', 'pantalla', 'lentes', 'negro', 'rojo']
  },
  {
    id: 'th07', nombre: 'Anillo inteligente Oura plateado', categoria: 'tecnologia', publico: null, precio: 349,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'sensores', 'exterior'],
    descripcion: 'Anillo que mide el sueño, la frecuencia cardiaca y la recuperación sin necesidad de llevar un reloj. De titanio plateado, ligero y resistente al agua.',
    caracteristicas: ['Mide sueño y recuperación', 'Titanio ligero y resistente', 'Batería de varios días'],
    ficha: [['Mide', 'Sueño, pulso, temperatura y actividad'], ['Batería', 'Hasta 7 días'], ['Material', 'Titanio'], ['Resistencia al agua', 'Hasta 100 m'], ['Conexión', 'Bluetooth'], ['Color', 'Plateado']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'anillo', 'inteligente', 'oura', 'plateado', 'sueno']
  },
  {
    id: 'th08', nombre: 'Plantillas inteligentes NURVV Run', categoria: 'tecnologia', publico: null, precio: 249,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'plantilla con sensor', 'base de la plantilla'],
    descripcion: 'Plantillas con sensores que analizan tu pisada: cadencia, zona de apoyo y equilibrio entre ambos pies. Te ayudan a mejorar la técnica y prevenir lesiones.',
    caracteristicas: ['Sensores en toda la plantilla', 'Analiza la pisada y la cadencia', 'Consejos para mejorar la técnica'],
    ficha: [['Mide', 'Pisada, cadencia y equilibrio'], ['Sensores', '32 por plantilla'], ['Batería', 'Hasta 5 h, recargable'], ['Conexión', 'Bluetooth'], ['Tallas', 'Recortables'], ['Color', 'Negro y azul']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'plantillas', 'inteligentes', 'nurvv', 'run', 'sensores', 'pisada']
  },
  {
    id: 'th09', nombre: 'Cámara GoPro HERO12 Black', categoria: 'tecnologia', publico: null, precio: 389,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'pantalla frontal', 'lente y soporte'],
    descripcion: 'Cámara de acción resistente al agua que graba en 5.3K con estabilización. Ideal para grabar tus carreras, entrenamientos y aventuras.',
    caracteristicas: ['Video 5.3K estabilizado', 'Resistente al agua', 'Incluye soporte de montaje'],
    ficha: [['Video', 'Hasta 5.3K a 60 fps'], ['Foto', '27 MP'], ['Estabilización', 'HyperSmooth 6.0'], ['Resistencia al agua', 'Hasta 10 m'], ['Pantallas', 'Frontal y trasera'], ['Color', 'Negro']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'camara', 'gopro', 'hero12', 'black', 'video']
  },
  {
    id: 'th10', nombre: 'Localizador GPS Garmin inReach Mini 2', categoria: 'tecnologia', publico: null, precio: 399.5,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'pantalla', 'mosquetón'],
    descripcion: 'Comunicador satelital de bolsillo con botón SOS, mensajes y ubicación en tiempo real. Pensado para rutas de montaña y lugares sin señal de celular.',
    caracteristicas: ['Botón SOS por satélite', 'Mensajes sin señal de celular', 'Compacto, con mosquetón'],
    ficha: [['Función', 'Ubicación, mensajes y SOS'], ['Red', 'Satélites Iridium'], ['Batería', 'Hasta 14 días'], ['Resistencia', 'IPX7'], ['Peso', '≈100 g'], ['Color', 'Negro y naranja']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'localizador', 'gps', 'garmin', 'inreach', 'mini', 'satelital', 'montana']
  },
  {
    id: 'th11', nombre: 'Botella térmica inteligente negra', categoria: 'tecnologia', publico: null, precio: 54.75,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'tapa con luz', 'cuerpo'],
    descripcion: 'Botella de acero inoxidable que mantiene el agua fría y te recuerda beber con una luz LED azul en la tapa. Con asa para llevarla al gimnasio.',
    caracteristicas: ['Recordatorio de hidratación con luz', 'Mantiene el agua fría por horas', 'Acero inoxidable'],
    ficha: [['Capacidad', '600 ml'], ['Material', 'Acero inoxidable'], ['Temperatura', 'Frío hasta 24 h'], ['Batería', 'Hasta 30 días, recargable'], ['Tapa', 'Con luz LED y asa'], ['Color', 'Negro']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'botella', 'termica', 'inteligente', 'negra', 'hidratacion', 'negro']
  },
  {
    id: 'th12', nombre: 'Pistola de masaje negra', categoria: 'tecnologia', publico: null, precio: 119,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'cabezal y panel de control', 'cabezales'],
    descripcion: 'Pistola de masaje con cuatro cabezales y varias velocidades para relajar los músculos después de entrenar. Silenciosa y con batería recargable.',
    caracteristicas: ['4 cabezales intercambiables', 'Varias velocidades', 'Motor silencioso'],
    ficha: [['Cabezales', '4 incluidos'], ['Velocidades', '5 niveles'], ['Batería', 'Hasta 6 h, recargable'], ['Ruido', 'Menos de 45 dB'], ['Peso', '≈700 g'], ['Color', 'Negro']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'pistola', 'masaje', 'negra', 'recuperacion', 'negro']
  },
  {
    id: 'th14', nombre: 'Linterna frontal LED negro y neón', categoria: 'tecnologia', publico: null, precio: 34.5,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'luces LED', 'cinta'],
    descripcion: 'Linterna de cabeza con tres luces LED para correr de noche o en la madrugada. Cinta ajustable con detalles reflectivos en verde neón.',
    caracteristicas: ['Tres luces LED', 'Batería recargable por USB', 'Cinta ajustable y reflectiva'],
    ficha: [['Luz', 'Hasta 400 lúmenes'], ['Modos', 'Alto, medio, bajo y parpadeo'], ['Batería', 'Hasta 8 h, recargable'], ['Resistencia', 'IPX4'], ['Peso', '≈80 g'], ['Color', 'Negro y neón']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'linterna', 'frontal', 'led', 'negro', 'neon', 'luz', 'noche']
  },
  {
    id: 'th15', nombre: 'Rodillera inteligente con sensor', categoria: 'tecnologia', publico: null, precio: 164,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'sensor', 'bisagra y ajuste'],
    descripcion: 'Rodillera con sensor de movimiento que registra la flexión de la rodilla al correr y saltar. Da soporte con bisagras laterales y se ajusta con velcro.',
    caracteristicas: ['Sensor de movimiento de la rodilla', 'Bisagras laterales de soporte', 'Ajuste con velcro'],
    ficha: [['Mide', 'Flexión y carga de la rodilla'], ['Soporte', 'Bisagras laterales'], ['Batería', 'Hasta 12 h, recargable'], ['Conexión', 'Bluetooth'], ['Talla', 'Ajustable'], ['Color', 'Negro y azul']],
    claves: ['tecnologia', 'deportiva', 'gadget', 'rodillera', 'inteligente', 'con', 'sensor', 'rodilla', 'negro']
  },
  {
    id: 'en07', nombre: 'Cajón Pliométrico 3 en 1', categoria: 'entrenamiento', publico: null, precio: 159,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Cajón de saltos con tres alturas para trabajar la potencia de piernas. Su superficie antideslizante da seguridad en cada salto.',
    caracteristicas: ['3 alturas en un solo cajón', 'Superficie antideslizante', 'Estructura firme y estable'],
    ficha: [['Alturas', '51, 61 y 76 cm (20, 24 y 30 pulgadas)'], ['Material', 'Madera reforzada'], ['Carga máxima', '150 kg'], ['Superficie', 'Antideslizante'], ['Uso ideal', 'Saltos y potencia']],
    claves: ['cajon', 'pliometrico', 'saltos', 'box', 'entrenamiento']
  },
  {
    id: 'en08', nombre: 'Tacos de Salida para Atletismo', categoria: 'entrenamiento', publico: null, precio: 189.5,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Tacos de salida ajustables para practicar la salida y la aceleración en pruebas de velocidad.',
    caracteristicas: ['Inclinación ajustable', 'Base metálica estable', 'Pedales con superficie de agarre'],
    ficha: [['Material', 'Aluminio y acero'], ['Ajuste', 'Distancia e inclinación'], ['Pedales', 'Antideslizantes'], ['Peso', '≈6 kg'], ['Uso ideal', 'Salidas de velocidad']],
    claves: ['tacos', 'salida', 'atletismo', 'velocidad', 'sprint', 'entrenamiento']
  },
  {
    id: 'en09', nombre: 'Sistema Electrónico de Cronometraje', categoria: 'entrenamiento', publico: null, precio: 349,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Sistema de fotoceldas para medir tus tiempos en tramos cortos con precisión. Incluye trípodes y se conecta al celular.',
    caracteristicas: ['Fotoceldas de alta precisión', 'Trípodes ajustables incluidos', 'Resultados en el celular'],
    ficha: [['Precisión', '1/1000 s'], ['Incluye', '2 fotoceldas y 2 trípodes'], ['Alcance', 'Hasta 50 m'], ['Batería', 'Hasta 10 h'], ['Conexión', 'Bluetooth']],
    claves: ['cronometraje', 'fotoceldas', 'tiempos', 'velocidad', 'entrenamiento']
  },
  {
    id: 'en10', nombre: 'Cinturón de Resistencia para Sprints', categoria: 'entrenamiento', publico: null, precio: 38.75,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Cinturón con cuerda elástica para hacer aceleraciones con resistencia controlada, solo o con un compañero.',
    caracteristicas: ['Cinturón acolchado y ajustable', 'Cuerda elástica de alta resistencia', 'Liberación rápida'],
    ficha: [['Cinturón', 'Ajustable 65 – 120 cm'], ['Cuerda', 'Elástica 3 m'], ['Resistencia', 'Media – alta'], ['Material', 'Nylon y látex'], ['Uso ideal', 'Aceleraciones y sprints']],
    claves: ['cinturon', 'resistencia', 'sprint', 'arrastre', 'entrenamiento']
  },
  {
    id: 'en11', nombre: 'Cuerda de Saltar de Velocidad', categoria: 'entrenamiento', publico: null, precio: 18.6,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Cuerda de saltar con rodamientos para giros rápidos. Mejora tu coordinación, ritmo y resistencia cardiovascular.',
    caracteristicas: ['Rodamientos para giros rápidos', 'Largo ajustable', 'Mangos ergonómicos'],
    ficha: [['Cable', 'Acero recubierto'], ['Largo', 'Hasta 3 m (ajustable)'], ['Mangos', 'Aluminio con agarre'], ['Peso', '≈180 g'], ['Uso ideal', 'Cardio y coordinación']],
    claves: ['cuerda', 'saltar', 'comba', 'cardio', 'entrenamiento']
  },
  {
    id: 'en12', nombre: 'Rodillo de Liberación Miofascial', categoria: 'entrenamiento', publico: null, precio: 32.4,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Rodillo con relieve para automasaje y movilidad. Ayuda a liberar la tensión muscular después de entrenar.',
    caracteristicas: ['Superficie con relieve de 3 zonas', 'Núcleo rígido que no se deforma', 'Liviano y fácil de llevar'],
    ficha: [['Medida', '33 × 14 cm'], ['Material', 'EVA sobre núcleo rígido'], ['Carga máxima', '150 kg'], ['Peso', '≈700 g'], ['Uso ideal', 'Automasaje y movilidad']],
    claves: ['rodillo', 'foam roller', 'masaje', 'movilidad', 'entrenamiento']
  },
  {
    id: 'en13', nombre: 'Tabla de Equilibrio', categoria: 'entrenamiento', publico: null, precio: 47.25,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Tabla redonda de equilibrio para trabajar estabilidad, tobillos y control del cuerpo.',
    caracteristicas: ['Superficie antideslizante', 'Base que gira en 360°', 'Ayuda a prevenir lesiones'],
    ficha: [['Diámetro', '40 cm'], ['Material', 'Madera con superficie de goma'], ['Inclinación', 'Hasta 15°'], ['Carga máxima', '150 kg'], ['Uso ideal', 'Equilibrio y tobillos']],
    claves: ['tabla', 'equilibrio', 'balance', 'estabilidad', 'entrenamiento']
  },
  {
    id: 'en14', nombre: 'Kit de Resistencia para Tobillos', categoria: 'entrenamiento', publico: null, precio: 29.9,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'detalle superior', 'detalle inferior'],
    descripcion: 'Par de tobilleras con bandas de resistencia para fortalecer piernas, glúteos y cadera.',
    caracteristicas: ['Tobilleras acolchadas con velcro', 'Bandas de distintas resistencias', 'Ideal para casa o gimnasio'],
    ficha: [['Contenido', '2 tobilleras y 3 bandas'], ['Resistencia', 'Ligera, media y fuerte'], ['Ajuste', 'Velcro'], ['Material', 'Neopreno y látex'], ['Uso ideal', 'Piernas y glúteos']],
    claves: ['tobilleras', 'tobillos', 'resistencia', 'bandas', 'piernas', 'entrenamiento']
  },
  {
    id: 'en15', nombre: 'Trineo de Arrastre para Entrenamiento', categoria: 'entrenamiento', publico: null, precio: 214,
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
  ['¿Cómo compro?', 'Elige un producto (y tu talla si es calzado), agrégalo al carrito, inicia sesión, elige la tienda donde lo retiras y paga con tarjeta o en efectivo al retirar.'],
  ['¿Qué necesito para crear mi cuenta?', 'Tu nombre, apellido, cédula ecuatoriana (o pasaporte si vives en otro país), celular y un correo al que tengas acceso. Te enviaremos un enlace para confirmar el correo antes de tu primera compra. También puedes entrar con tu cuenta de Google y completar tu cédula y celular.'],
  ['No me llega el correo de confirmación', 'Revisa la carpeta de spam o promociones. Si no aparece en unos minutos, en «Iniciar sesión» puedes pedir que te lo enviemos otra vez.'],
  ['¿Cómo puedo pagar?', 'Como prefieras: 1) con tarjeta de crédito o débito (Visa, Mastercard, American Express, Diners Club, Discover, JCB, UnionPay o Maestro), validamos el número, la fecha de vencimiento y el CVV; o 2) en efectivo en la tienda al retirar: reservamos tus productos y pagas en la caja cuando los recoges. Los pagos con tarjeta en línea son simulados: no se cobra dinero real.'],
  ['¿Entregan factura?', 'Sí. Al comprar te llega un correo con el detalle de tu pedido y la factura en PDF con tus datos (nombre, cédula, dirección y celular). Es un documento sin validez tributaria.'],
  ['¿Cómo recibo mi pedido?', 'Lo retiras gratis en la tienda que elijas. Está listo de 1 a 3 horas, según cuántos y qué productos pidas (por ejemplo, el calzado se busca por talla en bodega y la tecnología se revisa y se carga antes de entregarla); al comprar te mostramos la hora aproximada. Te enviamos la orden de pedido con tu número de pedido y un código de retiro de 6 caracteres. En la tienda presenta tu cédula y tu número de pedido (o el código) para verificar tu compra. No hacemos envíos a domicilio.'],
  ['Privacidad: ¿qué datos guardan?', 'Solo los necesarios para tu cuenta y tus pedidos: nombre, cédula, dirección, celular, correo, tus pedidos y la marca y últimos 4 dígitos de tus tarjetas. Tu contraseña se guarda cifrada (bcrypt) y nadie puede verla. Si entras con Google, solo recibimos tu nombre y tu correo. Si inicias sesión, tu carrito y tus favoritos se guardan en tu cuenta para que los veas en cualquier dispositivo; sin sesión quedan solo en este navegador. No vendemos ni compartimos tus datos.'],
  ['Condiciones de uso', 'Los pagos con tarjeta son simulados: no se cobra dinero real. Los pedidos se retiran en la tienda elegida presentando la cédula y el número de pedido o el código de retiro. Una vez pagado, el pedido no se puede modificar.'],
  ['¿Me avisan cuando cambia mi pedido?', 'Sí. Te llega un correo cuando recibimos tu compra y cada vez que tu pedido cambia: en preparación, listo para retirar, retirado o cancelado. También puedes verlo en «Mis pedidos».'],
  ['¿Cómo dejo una reseña?', 'Inicia sesión y entra a «Mis pedidos»: junto a cada producto que compraste está el botón «Escribir reseña». También puedes hacerlo desde la página del producto, en «Opiniones de clientes». La tienda verifica en tu cuenta que compraste ese producto: solo pueden opinar quienes lo compraron, y cada cliente deja una reseña por producto (puede editarla después).'],
  ['¿Qué pasa si un producto se agota mientras compro?', 'El stock se revisa en el momento de confirmar la compra. Si otra persona compró las últimas unidades antes que tú, te avisamos y ajustamos o quitamos ese producto del carrito; nunca se cobra un producto que no tenemos.'],
  ['¿Por qué solo el calzado tiene género?', 'Porque las tallas cambian entre hombre y mujer. Los relojes, sensores, audífonos y el equipo de entrenamiento sirven para todos, así que en esas categorías solo filtras por precio.'],
  ['¿Puedo cambiar mi pedido después de pagar?', 'No. Antes de pagar puedes cambiar la talla, la cantidad o quitar productos del carrito. Una vez pagado, el pedido no se puede modificar.']
];
