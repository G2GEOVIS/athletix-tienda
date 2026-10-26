/* Datos de la tienda ATHLETIX */
'use strict';

/* Tiempo estimado para tener listo un pedido */
const TIEMPO_LISTO = '24 a 48 horas';

/* Etapas de un pedido (los nombres coinciden con la base de datos) */
const ESTADOS = ['Recibido', 'Preparando', 'Listo', 'Retirado'];
const NOMBRE_ESTADO = { Recibido: 'Recibido', Preparando: 'Preparando', Listo: 'Listo para retirar', Retirado: 'Retirado', Cancelado: 'Cancelado' };

/* Provincias del Ecuador (para las direcciones) */
const PROVINCIAS = ['Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi', 'El Oro', 'Esmeraldas', 'Galápagos', 'Guayas', 'Imbabura', 'Loja', 'Los Ríos', 'Manabí', 'Morona Santiago', 'Napo', 'Orellana', 'Pastaza', 'Pichincha', 'Santa Elena', 'Santo Domingo de los Tsáchilas', 'Sucumbíos', 'Tungurahua', 'Zamora Chinchipe'];

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
    id: 'tn', nombre: 'Terrax Sendero Neón', categoria: 'calzado', publico: 'Unisex', precio: 149,
    etiqueta: '',
    tallas: ['37', '38', '39', '40', '41', '42', '43', '44', '45'],
    vistas: ['vista principal', 'vista del otro lado', 'detalle de la suela'],
    descripcion: 'Zapatilla de montaña para corredores que salen de la ciudad. Sus tacos de 5 mm muerden el barro y la tierra suelta, y la puntera reforzada protege el pie de piedras y raíces.',
    caracteristicas: ['Tacos de 5 mm para barro y tierra', 'Puntera reforzada contra impactos', 'Parte superior resistente a la abrasión'],
    ficha: [['Peso', '≈310 g'], ['Desnivel (drop)', '6 mm'], ['Tracción', 'TacoAgarre de 5 mm'], ['Uso ideal', 'Montaña, barro y tierra'], ['Tallas', '37 – 45 (EU)']],
    claves: ['zapatilla', 'zapatillas', 'zapato', 'zapatos', 'tenis', 'calzado', 'montaña', 'trail', 'sendero', 'unisex', 'hombre', 'mujer']
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
    id: 'sa', nombre: 'Aire Sónico Óseo', categoria: 'tecnologia', publico: 'Unisex', precio: 89,
    etiqueta: 'Nuevo',
    tallas: [],
    vistas: ['vista principal', 'auricular', 'arco'],
    descripcion: 'Audífonos de conducción ósea para correr escuchando música sin tapar tus oídos. Te mantienen atento al tráfico y a tu entorno, con un arco flexible que no se mueve aunque aceleres.',
    caracteristicas: ['Conducción ósea: oídos libres y atentos', 'Arco de titanio flexible y liviano', 'Resistentes al sudor y la lluvia (IP67)'],
    ficha: [['Tipo', 'Conducción ósea'], ['Batería', 'Hasta 8 h'], ['Conexión', 'Bluetooth 5.3'], ['Resistencia', 'IP67'], ['Peso', '≈29 g']],
    claves: ['audifonos', 'auriculares', 'audio', 'musica', 'tecnologia', 'unisex', 'hombre', 'mujer']
  },
  {
    id: 'cb', nombre: 'Cardio Banda Élite', categoria: 'tecnologia', publico: 'Unisex', precio: 79,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'sensor', 'broche'],
    descripcion: 'Banda cardiaca de pecho para entrenar por zonas con precisión. Envía tu frecuencia cardiaca en tiempo real al reloj, al teléfono o a la máquina del gimnasio.',
    caracteristicas: ['Medición de frecuencia cardiaca tipo ECG', 'Conexión Bluetooth y ANT+', 'Correa elástica lavable y ajustable'],
    ficha: [['Mide', 'Frecuencia cardiaca (tipo ECG)'], ['Batería', 'Hasta 400 h (pila CR2032)'], ['Conexión', 'Bluetooth y ANT+'], ['Resistencia', 'Al agua, 3 ATM'], ['Ajuste', 'Correa de 65 a 110 cm']],
    claves: ['banda', 'bandas', 'cardiaca', 'pulso', 'frecuencia', 'sensor', 'tecnologia', 'unisex', 'hombre', 'mujer']
  },
  {
    id: 'sp', nombre: 'Sensor de Zancada Pro', categoria: 'tecnologia', publico: 'Unisex', precio: 59,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'clip', 'sensor'],
    descripcion: 'Sensor de zancada que se engancha en la zapatilla y analiza tu técnica de carrera. Registra cadencia, longitud de zancada y tiempo de contacto para que corras de forma más eficiente.',
    caracteristicas: ['Analiza cadencia y longitud de zancada', 'Clip universal para cualquier zapatilla', 'Funciona incluso en cinta de correr'],
    ficha: [['Mide', 'Cadencia, zancada y tiempo de contacto'], ['Batería', 'Hasta 20 h, recargable'], ['Conexión', 'Bluetooth'], ['Montaje', 'Clip en los cordones'], ['Peso', '≈12 g']],
    claves: ['sensor', 'zancada', 'cadencia', 'tecnologia', 'unisex', 'hombre', 'mujer']
  },
  {
    id: 'hb', nombre: 'Cinturón Hidratación Pro', categoria: 'tecnologia', publico: 'Unisex', precio: 39,
    etiqueta: '',
    tallas: [],
    vistas: ['vista principal', 'botella', 'bolsillo'],
    descripcion: 'Cinturón de hidratación para corredores con dos botellas de 300 ml y un bolsillo para el celular. Se ajusta a la cintura sin rebotar, ideal para rodajes largos y montaña.',
    caracteristicas: ['Incluye 2 botellas de 300 ml', 'Bolsillo con cierre para celular de hasta 6.7"', 'Detalles reflectivos y ajuste sin rebote'],
    ficha: [['Capacidad', '2 botellas de 300 ml'], ['Bolsillo', 'Celular de hasta 6.7"'], ['Ajuste', 'Cintura de 65 a 110 cm'], ['Visibilidad', 'Detalles reflectivos'], ['Material', 'Lycra transpirable']],
    claves: ['cinturon', 'hidratacion', 'botella', 'botellas', 'agua', 'tecnologia', 'unisex', 'hombre', 'mujer']
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
  }
];

/* Guía de tallas (EU) */
const GUIA_TALLAS = [
  ['36', '22.5 cm'], ['36.5', '23 cm'], ['37', '23.5 cm'], ['37.5', '23.8 cm'], ['38', '24 cm'],
  ['38.5', '24.5 cm'], ['39', '25 cm'], ['40', '25.5 cm'], ['41', '26 cm'], ['42', '27 cm'],
  ['43', '27.5 cm'], ['44', '28.5 cm'], ['45', '29 cm']
];


const BUSQUEDAS_POPULARES = ['calzado', 'reloj', 'audífonos', 'bandas', 'conos', 'chaleco', 'mujer', 'hombre'];

const AYUDA = [
  ['¿Cómo compro?', 'Elige un producto (y tu talla si es calzado), agrégalo al carrito, inicia sesión, elige la tienda donde lo retiras y paga con tarjeta.'],
  ['¿Qué necesito para crear mi cuenta?', 'Tu nombre, apellido, cédula ecuatoriana, celular y un correo al que tengas acceso. Te enviaremos un enlace para confirmar el correo antes de tu primera compra. También puedes ingresar con tu cuenta de Google.'],
  ['No me llega el correo de confirmación', 'Revisa la carpeta de spam o promociones. Si no aparece en unos minutos, en «Iniciar sesión» puedes pedir que te lo enviemos otra vez.'],
  ['¿Cómo puedo pagar?', 'Con tarjeta Visa o Mastercard. Esta es una tienda académica: usa solo las tarjetas de prueba que aparecen en la pantalla de pago, nunca tu tarjeta real. Solo guardamos los últimos 4 dígitos.'],
  ['¿Cómo recibo mi pedido?', 'Lo retiras sin costo en la tienda que elijas. Te enviamos un correo cuando esté listo, normalmente en 24 a 48 horas. Presenta tu cédula al retirarlo.'],
  ['¿Cómo dejo una reseña?', 'Cuando retires tu pedido, entra al producto y verás el botón «Escribir reseña». Solo pueden opinar quienes compraron y retiraron el producto, y cada cliente deja una reseña por producto (puede editarla después).'],
  ['¿Puedo cambiar mi pedido después de pagar?', 'No. Antes de pagar puedes cambiar la talla, la cantidad o quitar productos del carrito. Una vez pagado, el pedido no se puede modificar.']
];
