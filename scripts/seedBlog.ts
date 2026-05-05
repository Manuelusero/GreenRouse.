/**
 * Seed de artículos del blog GreenRouse
 * Ejecutar: npx ts-node -r tsconfig-paths/register scripts/seedBlog.ts
 * O desde Next.js: crear una API route temporal de seed (solo en dev)
 */

export const articulosSeed = [
  {
    titulo: 'Compostaje en Casa: La Guía Definitiva para Principiantes',
    slug: 'compostaje-en-casa-guia-principiantes',
    extracto:
      'El compost es el corazón de toda huerta orgánica. Aprendé cómo transformar residuos de cocina y jardín en fertilizante natural de alta calidad en pocos pasos.',
    contenido: `## ¿Qué es el compost y por qué te cambia la vida?

El compost es el resultado de la descomposición controlada de materia orgánica. Bacterias, hongos y pequeños organismos trabajan juntos para convertir restos de cocina y jardín en humus rico en nutrientes.

## Qué podés compostar

**Sí:**
- Cáscaras de frutas y verduras
- Restos de café y té
- Cáscaras de huevo (ralladas)
- Hojas secas y pasto cortado
- Cartón sin tintas brillantes

**No:**
- Carnes, pescado o lácteos (atraen plagas)
- Aceites o comidas cocidas
- Plantas enfermas
- Heces de animales carnívoros

## El equilibrio carbono/nitrógeno

La clave del compost exitoso está en la proporción 30:1 de materiales marrones (carbon) a verdes (nitrógeno).

- **Marrones**: hojas secas, cartón, paja, viruta de madera sin tratar
- **Verdes**: restos de verduras, yerba usada, pasto fresco, cáscaras

## Armando tu compostera

1. **Elegí el recipiente**: puede ser un cajón de madera reciclada, una compostera plástica o simplemente un rincón del jardín.
2. **Primera capa**: 10 cm de material marrón (hojas secas, cartón picado).
3. **Capa verde**: 5 cm de restos orgánicos.
4. **Alternás**: siempre capas marrones y verdes.
5. **Humedad**: el compost debe estar tan húmedo como una esponja exprimida.
6. **Aireo**: cada 2 semanas, revolvé bien para oxigenar.

## ¿Cuánto tarda?

En verano, con buena gestión, en 60-90 días tenés compost maduro. En invierno puede tardar 4-6 meses.

## Señales de compost listo

- Color marrón oscuro uniforme
- Aroma a tierra de bosque (nunca fétido)
- No se distinguen los materiales originales
- Textura esponjosa

## Aplicación en la huerta

Incorporá 3-5 cm de compost maduro al inicio de cada temporada. Tu suelo te lo va a agradecer con plantas más sanas y cosechas más abundantes.`,
    autor: 'Sofía Morales',
    autorBio:
      'Ingeniera agrónoma con 10 años de experiencia en agricultura regenerativa. Especialista en compostaje y enmiendas orgánicas.',
    categoria: 'Compostaje',
    tags: ['compostaje', 'huerta orgánica', 'fertilizante natural', 'principiantes', 'suelo'],
    metaTitle: 'Guía de Compostaje para Principiantes | GreenRouse',
    metaDescription:
      'Aprendé a hacer compost en casa con nuestra guía paso a paso. Transformá residuos en fertilizante natural y mejorá tu huerta orgánica.',
    imagenUrl: '/images/blog/compostaje-principiantes.jpg',
    imagenAlt: 'Compostera de madera con capas de materiales orgánicos en un jardín',
    publicado: true,
    destacado: true,
    fechaPublicacion: new Date('2026-04-15'),
    tiempoLectura: 8,
  },
  {
    titulo: 'Asociación de Cultivos: Cómo el Tomate y la Albahaca se Potencian Juntos',
    slug: 'asociacion-cultivos-tomate-albahaca',
    extracto:
      'La permacultura nos enseña que cada planta es parte de un sistema. Descubrí cómo combinar cultivos estratégicamente para repeler plagas, atraer polinizadores y mejorar los sabores.',
    contenido: `## La sabiduría de las plantas compañeras

Desde hace siglos, agricultores de todo el mundo descubrieron que ciertas plantas se benefician cuando crecen juntas. Esta práctica, conocida como asociación de cultivos o "companion planting", es uno de los pilares de la permacultura.

## El dúo estrella: Tomate + Albahaca

Esta combinación es probablemente la más famosa del mundo hortícola, y por buenas razones:

- La albahaca **repele trips y pulgones** gracias a sus aceites esenciales volátiles.
- Los tomates crecen junto a la albahaca y esta **mejora su sabor** al influir en los terpenos que producen.
- Ambas plantas tienen **requerimientos similares** de sol y agua.
- La albahaca atrae **abejas y abejorros** que polinizan los tomates.

## Otras asociaciones poderosas

### Tres Hermanas (técnica ancestral)
- **Maíz**: actúa como soporte para los porotos y da sombra a las zapallitos.
- **Porotos**: fijan nitrógeno del aire al suelo.
- **Zapallitos**: sus hojas grandes cubren el suelo, retienen humedad y suprimen malezas.

### Zanahoria + Puerro
Las zanahorias ahuyentan la mosca del puerro y viceversa. Una alianza perfecta bajo tierra.

### Rosas + Ajo
El ajo repele los pulgones que atacan a las rosales. Plantá un diente de ajo cada 30 cm alrededor del rosal.

### Lechuga + Rabanito
El rabanito crece rápido y destapa el suelo para las raíces de lechuga. Además actúa como trampa para pulgas de la tierra.

## Asociaciones a evitar

- **Tomate + Hinojo**: el hinojo es alelopático, inhibe el crecimiento del tomate.
- **Cebolla + Leguminosas**: las cebollas interfieren con los nódulos fijadores de nitrógeno.
- **Pepino + Papa**: compiten por nutrientes y pueden compartir enfermedades fúngicas.

## Cómo diseñar tu huerta con asociaciones

1. Dibujá un plano simple de tu espacio.
2. Agrupá las plantas por familia y compatibilidad.
3. Intercalá plantas aromáticas (albahaca, tomillo, lavanda) entre los cultivos.
4. Dejá corredores para polinizadores entre los canteros.
5. Rotá los grupos cada temporada para no agotar el suelo.

La asociación de cultivos no es una ciencia exacta, es una práctica de observación. Anotá qué funciona en tu microclima específico.`,
    autor: 'Diego Herrera',
    autorBio:
      'Diseñador de sistemas de permacultura certificado (PDC). Ha diseñado más de 50 huertas urbanas en Buenos Aires y GBA.',
    categoria: 'Permacultura',
    tags: ['asociación de cultivos', 'permacultura', 'tomate', 'albahaca', 'control de plagas'],
    metaTitle: 'Asociación de Cultivos: Tomate y Albahaca | GreenRouse',
    metaDescription:
      'Descubrí cómo la asociación de tomate y albahaca repele plagas y mejora los sabores. Guía completa de plantas compañeras para tu huerta.',
    imagenUrl: '/images/blog/asociacion-tomate-albahaca.jpg',
    imagenAlt: 'Plantas de tomate y albahaca creciendo juntas en un cantero de huerta',
    publicado: true,
    destacado: true,
    fechaPublicacion: new Date('2026-04-10'),
    tiempoLectura: 9,
  },
  {
    titulo: 'Suelo Vivo: Cómo Mejorar la Estructura de tu Tierra sin Químicos',
    slug: 'suelo-vivo-mejorar-estructura-tierra-organico',
    extracto:
      'Un suelo sano es mucho más que tierra: es un ecosistema complejo con millones de organismos. Aprendé técnicas regenerativas para nutrir tu suelo y reducir el riego a la mitad.',
    contenido: `## El suelo no es un sustrato, es un organismo vivo

Un gramo de suelo fértil contiene entre 100 millones y 1.000 millones de bacterias. Además de hongos, nematodos, lombrices, artrópodos y miles de otras formas de vida. Cuando usamos agroquímicos, matamos esta comunidad y el suelo se vuelve un polvo inerte que necesita fertilizantes cada vez más.

## Los 5 principios del suelo regenerativo

### 1. No labrar en exceso
El labreo profundo destruye los canales de hongos micorrícicos que transportan agua y nutrientes hasta las raíces. Optá por el "no-till" o labranza mínima.

### 2. Nunca dejes el suelo desnudo
El suelo expuesto pierde humedad, se erosiona y las semillas de malezas germinan más fácil. Cubrilo con mulch, plantas rastreras o cultivos de cobertura.

### 3. Mulch orgánico
Aplicá 5-8 cm de paja, hojas secas, viruta o compost sobre la superficie. El mulch:
- Retiene hasta un 70% más de humedad
- Regula la temperatura del suelo
- Se descompone lentamente alimentando a los microorganismos
- Suprime malezas sin herbicidas

### 4. Plantas de cobertura
En los períodos sin cultivo, sembrá:
- **Trébol rojo o blanco**: fija nitrógeno y alimenta abejas
- **Mostaza**: controla nematodos y hongos dañinos
- **Centeno**: crea biomasa y protege contra erosión
- **Facelia**: excelente melífera y de rápido crecimiento

### 5. Diversidad de cultivos
Un suelo monocultivado agota ciertos nutrientes y favorece patógenos específicos. La rotación y diversificación mantienen el equilibrio.

## Test rápido de la salud de tu suelo

Hacé un hoyo de 30 x 30 cm y contá las lombrices que encontrás en 5 minutos:
- **Más de 10**: suelo excelente
- **5-10**: suelo bueno, seguí mejorando
- **1-4**: suelo regular, necesita más materia orgánica
- **0**: suelo pobre, manos a la obra

## Enmiendas naturales

| Problema | Solución |
|----------|----------|
| Suelo arcilloso (duro, se agrieta) | Arena gruesa + compost |
| Suelo arenoso (no retiene agua) | Compost + arcilla en polvo |
| pH ácido | Cal dolomítica en invierno |
| pH alcalino | Azufre agrícola + compost de hojas de roble |
| Suelo compactado | Subsolado suave + aireación con horquilla |

## Té de compost: el fertilizante líquido del futuro

Llená un balde con 10 partes de agua y 1 parte de compost maduro. Aireá constantemente por 24-48 horas con una bomba de pecera. Aplicá como riego en la base de las plantas. Vas a ver resultados en 7 días.`,
    autor: 'Valentina Ríos',
    autorBio:
      'Bióloga especialista en ecología del suelo. Investigadora del CONICET. Autora del libro "Tierra Viva: Manual de Agricultura Regenerativa".',
    categoria: 'Suelos',
    tags: ['suelo orgánico', 'permacultura', 'mulch', 'no labranza', 'regenerativo'],
    metaTitle: 'Cómo Mejorar el Suelo de tu Huerta sin Químicos | GreenRouse',
    metaDescription:
      'Técnicas regenerativas para tener un suelo vivo y fértil. Mulch, compost, rotación y plantas de cobertura: todo lo que necesitás saber.',
    imagenUrl: '/images/blog/suelo-vivo-organico.jpg',
    imagenAlt: 'Manos sosteniendo tierra oscura y fértil con lombrices visibles',
    publicado: true,
    destacado: true,
    fechaPublicacion: new Date('2026-04-05'),
    tiempoLectura: 11,
  },
  {
    titulo: 'Primeros Pasos en tu Huerta Urbana: De Cero a tu Primera Cosecha',
    slug: 'primeros-pasos-huerta-urbana-primera-cosecha',
    extracto:
      'Empezar una huerta parece complicado, pero con la guía correcta podés tener tu primera cosecha en menos de 60 días. Esta guía es para vos si nunca plantaste nada.',
    contenido: `## ¿Por qué tener una huerta urbana?

Antes de ensuciarte las manos, hablemos de por qué vale la pena:

- **Ahorro real**: un balcón de 2 m² puede producir entre $8.000 y $15.000 pesos en verduras al mes (precios 2026).
- **Salud**: las verduras frescas tienen hasta 3 veces más nutrientes que las del almacén.
- **Bienestar**: 30 minutos en la huerta reduce el cortisol (hormona del estrés) en un 30%.
- **Soberanía alimentaria**: sabés exactamente qué comés.

## Evaluá tu espacio

Antes de comprar nada, observá tu espacio durante 3-4 días:

- ¿Cuántas horas de sol directo recibe? (mínimo 4-6 horas para la mayoría de verduras)
- ¿Hay viento constante? (considera instalar una tela media sombra)
- ¿Tenés acceso fácil al agua?
- ¿Cuánto espacio horizontal disponés? (incluso un balcón de 1 m funciona con macetas colgantes)

## Los 5 cultivos ideales para empezar

Elegí cultivos rápidos y resilientes para ganar confianza:

1. **Rabanitos**: listos en 25-30 días. Perfectos para ver resultados rápido.
2. **Lechuga mantecosa**: cosechable en 45-60 días. Muy tolerante a errores.
3. **Perejil**: lento para germinar pero dura meses. Cosecha continua.
4. **Albahaca**: aromática, rápida y con alto valor gastronómico.
5. **Espinaca mini**: lista en 40 días, puede hacerse en macetas de 20 cm.

## Qué necesitás (y qué no)

**Necesitás:**
- Sustrato de calidad (mezcla de tierra, compost y perlita)
- Macetas con agujeros de drenaje (o un cajón de madera reciclada)
- Semillas de vivero (no las del supermercado, tienen bajo poder germinativo)
- Una regadera con flor

**No necesitás:**
- Fertilizantes químicos
- Pesticidas
- Herramientas caras
- Un jardín grande

## La regla del drenaje

El error más común del principiante es el exceso de agua. Las raíces necesitan oxígeno. Antes de regar, metés el dedo 2-3 cm en la tierra: si está húmeda, no regués.

## Calendario de tu primera siembra (otoño-invierno en Argentina)

**Abril-Mayo**: lechugas, espinacas, acelga, remolacha, zanahoria, perejil, cilantro, rúcula
**Junio-Julio**: continuar con las anteriores, agregar guisantes y habas
**Agosto**: empezar almácigos de tomate y pimiento para trasplantar en primavera

## Seguimiento en GreenRouse

Usá la sección de parcelas para registrar tus siembras, llevar control del riego y recibir alertas de temporada. Tu huerta tiene memoria.`,
    autor: 'Martín Juárez',
    autorBio:
      'Educador ambiental y hortelano urbano. Coordina talleres de huerta en escuelas públicas del GBA.',
    categoria: 'Para Principiantes',
    tags: ['huerta urbana', 'principiantes', 'primera cosecha', 'balcón', 'macetas'],
    metaTitle: 'Cómo Empezar tu Huerta Urbana desde Cero | GreenRouse',
    metaDescription:
      'Guía completa para principiantes: cómo tener tu primera cosecha en 60 días. Perfecta para huerta en balcón, terraza o patio pequeño.',
    imagenUrl: '/images/blog/huerta-urbana-principiantes.jpg',
    imagenAlt: 'Balcón con macetas de lechugas, tomates y hierbas aromáticas',
    publicado: true,
    destacado: false,
    fechaPublicacion: new Date('2026-03-28'),
    tiempoLectura: 10,
  },
  {
    titulo: 'Control Natural de Pulgones: 7 Métodos que Realmente Funcionan',
    slug: 'control-natural-pulgones-metodos-efectivos',
    extracto:
      'Los pulgones son la plaga más común de la huerta orgánica. Antes de rendirte, probá estos métodos naturales y preventivos que no dañan a las plantas ni al ecosistema.',
    contenido: `## El enemigo más pequeño de la huerta

Los pulgones (áfidos) son insectos de 1-3 mm que se agrupan en colonias y se alimentan chupando la savia de tallos tiernos y hojas. Debilitan las plantas, transmiten virus y excretan melaza que promueve el hongo negro (fumagina).

## Identificación temprana

Buscalos en:
- El envés de las hojas (parte de abajo)
- Los brotes nuevos y puntas de tallo
- Cerca de las hormigas (las hormigas los pastorean porque se alimentan de su melaza)

Si ves hormigas subiendo y bajando por un tallo, casi seguro hay pulgones arriba.

## Método 1: Chorrito de agua

El más simple y efectivo para colonias pequeñas. Un chorro de agua fuerte en las zonas afectadas los derriba. Hacelo temprano a la mañana para que las plantas se sequen antes del mediodía.

## Método 2: Jabón potásico

Mezclá 15 ml de jabón potásico (o jabón de marsella rallado) en 1 litro de agua. Pulverizá directamente sobre los pulgones, especialmente el envés. El jabón rompe su cutícula y los deshidrata.

⚠️ No apliques con sol directo. Hacelo al atardecer.

## Método 3: Aceite de neem

El neem (Azadirachta indica) contiene azadirachtina, que interrumpe el ciclo reproductivo de los insectos. Mezclá 5 ml de aceite de neem + 2 ml de jabón neutro en 1 litro de agua. Agitá bien y pulverizá.

Funciona mejor como preventivo que como curador. Aplicalo cada 7-10 días.

## Método 4: Infusión de ajo y ají

Hervís 5 dientes de ajo + 1 ají picante en 1 litro de agua por 10 minutos. Dejás enfriar, colás y diluís 1:5 con agua. Pulverizá sobre las plantas afectadas. Los compuestos volátiles repelen a los pulgones.

## Método 5: Introducir enemigos naturales

La vaquita de San Antonio (mariquita) es el depredador natural del pulgón por excelencia. Una mariquita adulta consume hasta 200 pulgones por día.

Para atraerlas, plantá:
- Hinojo, eneldo, cilantro en flor
- Caléndula (también repele pulgones)
- Menta y albahaca

## Método 6: Plantas repelentes

Intercalá entre tus cultivos:
- **Caléndula**: repele muchos insectos dañinos
- **Lavanda**: los pulgones detestan su aroma
- **Nasturtio/capuchina**: actúa como trampa, los atrae lejos de tus cultivos

## Método 7: Prevención con suelo sano

Las plantas débiles son más susceptibles a las plagas. Un suelo rico en materia orgánica y sin exceso de nitrógeno (que hace crecer brotes muy tiernos) produce plantas con defensas naturales más fuertes.

## Cuándo preocuparse de verdad

Si después de 2-3 aplicaciones la infestación no cede y la planta está muy dañada, considerá sacarla para evitar que se disemine. No usen insecticidas sistémicos en la huerta orgánica.`,
    autor: 'Florencia Bengoa',
    autorBio: 'Agroecóloga y consultora de huertas orgánicas en el AMBA.',
    categoria: 'Control de Plagas',
    tags: ['pulgones', 'plagas', 'control natural', 'huerta orgánica', 'agroecología'],
    metaTitle: '7 Métodos Naturales para Eliminar Pulgones | GreenRouse',
    metaDescription:
      'Cómo eliminar pulgones de tu huerta sin químicos. Jabón potásico, aceite de neem, ajo y más métodos naturales y efectivos.',
    imagenUrl: '/images/blog/control-pulgones-natural.jpg',
    imagenAlt: 'Hoja con colonia de pulgones verdes en el envés',
    publicado: true,
    destacado: false,
    fechaPublicacion: new Date('2026-03-20'),
    tiempoLectura: 9,
  },
  {
    titulo: 'Diseño de Permacultura: Los 12 Principios que Transforman tu Huerta',
    slug: 'diseno-permacultura-12-principios',
    extracto:
      'La permacultura no es solo un método de cultivo: es una filosofía de diseño que imita los patrones de la naturaleza. Entendé los 12 principios de David Holmgren y aplicalos en tu espacio.',
    contenido: `## ¿Qué es la permacultura realmente?

Bill Mollison y David Holmgren acuñaron el término "permacultura" en los años 70 como contracción de "cultura permanente" (o "agricultura permanente"). No es un conjunto de técnicas, es una forma de pensar el diseño de sistemas humanos que sean resilientes, productivos y sostenibles.

## Los 12 principios de Holmgren

### 1. Observar e interactuar
Antes de hacer cualquier cambio en tu espacio, obsevá. ¿Dónde corre el agua? ¿Adónde sopla el viento? ¿Qué plantas crecen solas? La respuesta ya está en tu jardín.

### 2. Captar y almacenar energía
Cosechá agua de lluvia, compostá la materia orgánica, guardá semillas. La energía que pasa por tu sistema sin ser capturada es energía perdida.

### 3. Obtener un rendimiento
Un sistema de permacultura debe producir. La belleza sin productividad no es suficiente. Combiná plantas ornamentales comestibles, flores que atraigan polinizadores y especias.

### 4. Autorregulación y aceptar retroalimentación
Observá qué funciona y qué no. Si una planta no prospera en un lugar, no insistas: mové el diseño, no forces la naturaleza.

### 5. Usar y valorar los servicios y recursos renovables
El sol, el agua de lluvia, el viento, la biomasa: todos son recursos gratuitos. Diseñá para aprovecharlos antes de comprar insumos.

### 6. No producir residuos
En la naturaleza no existe la basura: todo es nutriente de otro proceso. El compost es la expresión máxima de este principio.

### 7. Diseñar desde los patrones a los detalles
Primero el plano general (zonas, sectores, flujos), después los detalles (qué especie va dónde).

### 8. Integrar en vez de segregar
Los monocultivos son frágiles. La diversidad crea resiliencia. Cada elemento del sistema debe tener múltiples funciones.

### 9. Usar soluciones lentas y pequeñas
Los sistemas pequeños son más manejables, eficientes y sostenibles. No intentés resolver todo a la vez.

### 10. Usar y valorar la diversidad
No plantes solo tomates. La biodiversidad es el seguro del sistema: si falla un cultivo, los otros sostienen la producción.

### 11. Usar los bordes y valorar lo marginal
Los bordes (entre cantero y pasillo, entre sombra y sol) son los espacios más productivos y biodiversos del sistema.

### 12. Usar y responder creativamente al cambio
La pérdida de una cosecha, una helada inesperada, una plaga nueva: son oportunidades para aprender y diseñar mejor.

## Cómo empezar con permacultura desde cero

1. **Mapa de observación**: dibujá tu espacio e indicá dónde cae el sol en cada hora del día, dónde se acumula agua, qué vistas querés preservar.
2. **Zonas**: zona 0 (casa) → zona 1 (huerta intensiva, acceso diario) → zona 2 (frutales, pollos) → zona 3+ (bosque comestible, forestación).
3. **Sectores**: marcá de dónde vienen el sol, el viento, el ruido, las vistas.
4. **Diseñá para las necesidades humanas primero**: ¿qué querés producir? ¿cuánto tiempo podés dedicarle?`,
    autor: 'Diego Herrera',
    autorBio:
      'Diseñador de sistemas de permacultura certificado (PDC). Ha diseñado más de 50 huertas urbanas en Buenos Aires y GBA.',
    categoria: 'Permacultura',
    tags: ['permacultura', 'diseño', 'holmgren', 'principios', 'sostenibilidad'],
    metaTitle: '12 Principios de Permacultura para tu Huerta | GreenRouse',
    metaDescription:
      'Los 12 principios de David Holmgren aplicados a la huerta urbana. Diseñá un sistema resiliente y productivo que imite los patrones de la naturaleza.',
    imagenUrl: '/images/blog/permacultura-principios.jpg',
    imagenAlt: 'Diseño esquemático de huerta con zonas de permacultura en vista aérea',
    publicado: true,
    destacado: false,
    fechaPublicacion: new Date('2026-03-15'),
    tiempoLectura: 12,
  },
  {
    titulo: 'Riego por Goteo Casero: Ahorrá Agua y Tiempo en tu Huerta',
    slug: 'riego-por-goteo-casero-ahorro-agua',
    extracto:
      'El riego por goteo es la forma más eficiente de regar. Podés armar un sistema casero por menos de $5.000 pesos que riega solo y reduce el consumo de agua hasta un 70%.',
    contenido: `## Por qué el goteo es superior al riego manual

El riego por aspersión moja hojas y favorece hongos. El riego manual es irregular. El goteo lleva el agua directo a la raíz, donde realmente la necesita la planta.

Beneficios comprobados:
- Hasta 70% menos consumo de agua
- Reduce enfermedades fúngicas (el follaje siempre seco)
- Moins de malezas (solo riegan la planta, no el espacio entre)
- Podés automatizarlo con un temporizador de $800

## Sistema casero con botellas PET

El método más simple y gratuito:

1. Tomá botellas de 1.5 L o 2 L
2. Hacé un agujero de 1-2 mm en la tapa con un clavo caliente
3. Llenala de agua, cerrala con la tapa con el agujero
4. Enterrala boca abajo al lado de la planta, con la mitad dentro de la tierra
5. El agua gotea lentamente durante 12-24 horas

Perfecto para vacaciones o para plantas que necesitan riego constante.

## Sistema con manguera perforada (ollas de riego)

Para canteros más grandes:
1. Comprá una manguera de jardín económica (8-12 mm de diámetro)
2. Con un taladro de 1.5 mm hacé agujeros cada 20-30 cm a lo largo de la manguera
3. Cerrá un extremo con un tapón
4. Conectá el otro extremo a la canilla con una reducción
5. Poné un temporizador mecánico ($1.200 en ferretería) para automatizar

## Calculo de caudal

La regla general: cada gotero debería aportar entre 2 y 4 litros/hora. Para calcular cuánto regar:

- Hortalizas de hoja: 3-4 L/m² por día en verano
- Tomates: 5-6 L/planta por día en floración
- Aromáticas: 1-2 L/m² cada 2 días

## Timer automático: el mejor regalo para tu huerta

Invertí en un temporizador de riego (también llamado "programador de riego"). Los modelos básicos con pantalla cuestan entre $2.500 y $5.000 y programan riego diario por duración y horario.

Configuración recomendada: **2 veces al día, 15 minutos cada vez, temprano y al atardecer** (nunca al mediodía).

## Mantenimiento del sistema

- Cada 15 días, limpiá los goteros con una aguja para destapar sedimentos.
- Al final de la temporada, vaciá las mangueras antes del frío.
- Si el caudal baja, verificá que no haya raíces obstruyendo.`,
    autor: 'Tomás Acosta',
    autorBio: 'Técnico en sistemas de riego y agricultura eficiente. Consultor independiente en el GBA.',
    categoria: 'Técnicas de Riego',
    tags: ['riego por goteo', 'ahorro de agua', 'huerta eficiente', 'bricolaje', 'automatización'],
    metaTitle: 'Sistema de Riego por Goteo Casero Paso a Paso | GreenRouse',
    metaDescription:
      'Armá tu propio sistema de riego por goteo con materiales reciclados y ahorrá hasta 70% de agua en tu huerta. Tutorial completo.',
    imagenUrl: '/images/blog/riego-goteo-casero.jpg',
    imagenAlt: 'Sistema de riego por goteo con manguera perforada en cantero de tomates',
    publicado: true,
    destacado: false,
    fechaPublicacion: new Date('2026-03-08'),
    tiempoLectura: 8,
  },
  {
    titulo: 'Siembra de Otoño en Argentina: Qué Plantar en Abril y Mayo',
    slug: 'siembra-otono-argentina-abril-mayo',
    extracto:
      'El otoño es la temporada más productiva para las hortalizas de hoja y raíz en Argentina. Descubrí qué plantar ahora para tener cosecha fresca durante todo el invierno.',
    contenido: `## El otoño: la temporada olvidada de la huerta

Muchos hortelanos dejan de sembrar cuando llega el frío. Error. El otoño-invierno es ideal para muchas hortalizas que no toleran el calor intenso. Las heladas suaves incluso mejoran el sabor de las espinacas y las acelgas.

## Clima otoñal en Argentina

**Buenos Aires y zona pampeana (USDA Zone 9-10):**
- Abril: 14-22°C. Ideal para casi todo lo de otoño.
- Mayo: 10-18°C. Empezar a cubrir almácigos nocturnos.
- Junio en adelante: heladas esporádicas, proteger con malla antigranizo o invernadero pequeño.

**NOA y NEA**: el otoño es la mejor temporada para hortalizas sensibles al calor.
**Patagonia**: ventana corta, preferir variedades rústicas de ciclo corto.

## Qué sembrar directo en abril

### Hortalizas de hoja
- **Lechuga** (todas las variedades): semilla pequeña, 0.5 cm de profundidad, en líneas de 20 cm entre sí.
- **Espinaca**: suelo muy bien preparado con compost. Germina mejor con suelo entre 10-18°C.
- **Acelga**: muy rústica, tolera heladas leves. Puede sembrarse hasta mayo.
- **Rúcula**: rapidísima, lista en 25-30 días. Resiembra sola regularmente.
- **Perejil y cilantro**: aromáticas de siembra directa, remojar semillas 12 horas antes.

### Raíces
- **Zanahoria**: suelo suelto, sin piedras ni palos, a 1 cm de profundidad. No trasplantar nunca.
- **Remolacha**: versátil, se come la raíz y las hojas. Muy fácil.
- **Rabanito**: ciclo ultrarrápido (25 días). Sembrar cada 15 días para cosecha continua.
- **Nabo**: muy nutritivo y resistente al frío. Poco cultivado pero muy productivo.

### Leguminosas de invierno
- **Arvejas (guisantes)**: necesitan soporte para trepar. Muy dulces cosechadas frescas.
- **Habas**: robustas, productivas y fijadoras de nitrógeno. Excelentes en suelos con poco compost.

## Qué sembrar en almácigo para trasplantar

- **Puerro y cebolla**: lleva tiempo pero se siembran ahora para tener plantas listas en invierno.
- **Brócoli y coliflor**: almácigo en abril, trasplante en junio.
- **Repollo**: igual que el brócoli.

## Densidades de siembra (referencia)

| Cultivo | Distancia entre plantas | Distancia entre hileras |
|---------|-------------------------|-------------------------|
| Lechuga | 25 cm | 30 cm |
| Espinaca | 15 cm | 20 cm |
| Zanahoria | 5-8 cm | 20 cm |
| Remolacha | 10-15 cm | 25 cm |
| Habas | 20-25 cm | 40 cm |

## Consejo extra: cubrir el suelo esta noche

Antes de la primera helada, cubrí la tierra con 5 cm de paja o viruta alrededor de las plantas. Esta capa de mulch protege las raíces, retiene calor y evita el congelamiento superficial.`,
    autor: 'Sofía Morales',
    autorBio:
      'Ingeniera agrónoma con 10 años de experiencia en agricultura regenerativa. Especialista en compostaje y enmiendas orgánicas.',
    categoria: 'Calendario de Siembra',
    tags: ['siembra de otoño', 'Argentina', 'abril', 'mayo', 'hortalizas de invierno'],
    metaTitle: 'Qué Plantar en Otoño en Argentina: Guía de Siembra | GreenRouse',
    metaDescription:
      'Guía completa de siembra para abril y mayo en Argentina. Lechugas, espinacas, zanahorias, habas y más: todo lo que podés plantar ahora.',
    imagenUrl: '/images/blog/siembra-otono-argentina.jpg',
    imagenAlt: 'Cantero de hortalizas de otoño con lechugas y espinacas bajo luz de tarde',
    publicado: true,
    destacado: false,
    fechaPublicacion: new Date('2026-04-01'),
    tiempoLectura: 10,
  },
  {
    titulo: 'Lombricultura: Convierte Residuos en Oro Negro para tu Huerta',
    slug: 'lombricultura-residuos-fertilizante-organico',
    extracto:
      'El lombricompost es el fertilizante orgánico más completo que existe. Con una caja de madera y lombrices rojas podés producir humus de máxima calidad en tu cocina o balcón.',
    contenido: `## ¿Qué es la lombricultura?

La lombricultura es la cría de lombrices para transformar materia orgánica en humus de lombriz (lombricompost o vermicompost). Es el proceso de descomposición más eficiente que existe: las lombrices transforman restos orgánicos en 60-90 días en el fertilizante más completo del mundo.

## Por qué el lombricompost es superior al compost común

| Característica | Compost | Lombricompost |
|----------------|---------|---------------|
| Nitrógeno disponible | Bajo-medio | Alto |
| Microorganismos benéficos | Muchos | Muchísimos |
| Tiempo de producción | 3-6 meses | 1-3 meses |
| Olor en proceso | Puede oler | Sin olor |
| Espacio necesario | Grande | Muy pequeño |
| Lixiviado útil | No | Sí (té de lombrices) |

## Las lombrices correctas

No cualquier lombriz sirve. Necesitás **Eisenia foetida** (lombriz roja californiana) o **Lumbricus rubellus**. Las lombrices de tierra comunes no funcionan en un sistema intensivo.

Podés conseguirlas en:
- Viveros especializados (~$500 los 100 gramos)
- Grupos de permacultura en redes sociales (muchas veces las regalan)
- Mercados de productores agroecológicos

## Armando tu lombricera

**Material necesario:**
- Caja de madera o plástico de 40 x 60 x 30 cm con tapa
- Perforaciones en el fondo (0.5 cm) para drenaje
- Bandeja inferior para recolectar el lixiviado

**Proceso:**
1. Poné 10 cm de material base: tierra negra + compost maduro a partes iguales.
2. Añadí 500 g de lombrices.
3. Cubrí con una capa fina de restos orgánicos.
4. Tapá con arpillera húmeda (para mantener humedad y oscuridad).

## Qué comen las lombrices

**Les encanta:**
- Cáscaras de frutas y verduras (sin cítricos en exceso)
- Yerba y poso de café
- Pan viejo (en pequeña cantidad)
- Hojas de ensalada, remolacha, zanahoria

**Evitar:**
- Carne, pescado, lácteos
- Cítricos en exceso (muy ácidos)
- Cebolla y ajo en grandes cantidades
- Alimentos muy condimentados

## Mantenimiento semanal (5 minutos)

1. Verificar humedad: apretá un puñado de material, debe soltar unas pocas gotas. Si está muy seco, humedecé; si muy húmedo, agregá cartón picado.
2. Agregar comida: enterrá los nuevos restos en distintos sectores de la caja, rotando.
3. Recolectar el lixiviado: ese líquido oscuro de la bandeja inferior es té de lombrices, diluilo 1:10 con agua y usalo como fertilizante foliar.

## Cosechando el lombricompost (a los 60-90 días)

Cuando ya no se distinguen los materiales originales y el color es marrón-negro uniforme, es hora de cosechar. Poné la mitad del contenido al sol: las lombrices huyen de la luz y se agrupan en la capa inferior. Sacá así el humus de la parte superior, reingresá las lombrices con el resto.

## Cuánto usar en la huerta

- **Siembra**: mezclá 20-30% de lombricompost con tierra del sustrato.
- **Plantas establecidas**: 2-3 cm superficial como top dressing cada 2 meses.
- **Trasplante**: un puñado directo en el hoyo de trasplante.`,
    autor: 'Valentina Ríos',
    autorBio:
      'Bióloga especialista en ecología del suelo. Investigadora del CONICET. Autora del libro "Tierra Viva: Manual de Agricultura Regenerativa".',
    categoria: 'Compostaje',
    tags: ['lombricultura', 'lombricompost', 'vermicompost', 'fertilizante natural', 'residuos orgánicos'],
    metaTitle: 'Lombricultura Casera: Guía Completa | GreenRouse',
    metaDescription:
      'Cómo hacer lombricompost en casa. Todo sobre lombrices rojas, qué alimentarlas y cómo producir el fertilizante orgánico más eficiente.',
    imagenUrl: '/images/blog/lombricultura-casera.jpg',
    imagenAlt: 'Manos sosteniendo lombricompost oscuro con lombrices rojas visibles',
    publicado: true,
    destacado: false,
    fechaPublicacion: new Date('2026-02-25'),
    tiempoLectura: 11,
  },
  {
    titulo: 'Variedades de Tomate para Argentina: Cuál Elegir Según tu Espacio',
    slug: 'variedades-tomate-argentina-cual-elegir',
    extracto:
      'Con más de 10.000 variedades de tomate en el mundo, elegir parece difícil. Esta guía te ayuda a seleccionar la variedad perfecta para tu clima, espacio y necesidades culinarias.',
    contenido: `## Por qué la variedad importa

Un tomate cherry en maceta de balcón puede producir 2 kg por planta. Un tomate perilla en el mismo espacio probablemente muera. Elegir la variedad correcta para tu contexto es tan importante como el riego y el suelo.

## Clasificación por tipo de crecimiento

### Determinados (o "bush")
- Crecen hasta cierta altura y paran.
- Toda la cosecha madura en pocas semanas.
- Ideal para: envasar, hacer salsa.
- No necesitan guía o sostenimiento complejo.
- Ejemplo: Perita San Marzano, Platense.

### Indeterminados
- Crecen durante toda la temporada (pueden llegar a 3-4 metros).
- Producción continua hasta las heladas.
- Necesitan tutorado y poda de brotes laterales (desdoblado).
- Ideal para: consumo fresco continuo.
- Ejemplo: Cherry, Cereza, Tomate Rosado.

## Guía por espacio disponible

### Maceta pequeña (20-30 cm de diámetro)
- **Cherry Tumbling Tom**: variedad colgante, ideal para macetas suspendidas.
- **Patio F1**: determinado, compacto, buena producción en poco espacio.

### Maceta grande (40+ cm) o cajonera
- **Cherry Supersweet 100**: muy productivo, sabor excepcional.
- **Cereza Amarillo Pera**: frutas dulces amarillas, muy ornamental.

### Cantero o jardín con espacio
- **Tomate Platense**: variedad local, rústica, muy adaptada a Buenos Aires.
- **Tomate Rosado de Tucumán**: grande, carnoso, excelente sabor.
- **San Marzano**: ideal para salsa y conservas.

## Variedades ancestrales (heirloom) en Argentina

Cada vez más disponibles en ferias de semillas y viveros agroecológicos:
- **Corazón de Buey** (Oxheart): rosa, enorme, muy poca acidez.
- **Negro de Crimea (Cherokee Purple)**: piel oscura, sabor complejo.
- **Tomate Zapotec (mexicano)**: forma irregular, muy productivo.
- **Green Zebra**: rayado verde-amarillo, ligeramente ácido.

La ventaja de las heirloom es que podés **guardar tus propias semillas** para el año siguiente.

## Cómo guardar semillas de tomate

1. Seleccioná el tomate más sano y sabroso de la planta más productiva.
2. Cortalo y sacá la semilla con la gelatina que la rodea.
3. Poné las semillas en un frasco con agua por 2-3 días (fermenta la gelatina).
4. Lavá bien, secá sobre papel por 2-3 semanas.
5. Guardá en sobre de papel dentro de un frasco de vidrio con sílica gel.
6. Duran 3-5 años si se guardan bien.

## Cuándo sembrar en Argentina

- **Buenos Aires**: almácigo de agosto a octubre, trasplante de octubre a noviembre.
- **NOA/Cuyo**: almácigo de julio a septiembre.
- **Patagonia**: variedades de ciclo corto (75-80 días), almácigo en octubre.`,
    autor: 'Martín Juárez',
    autorBio: 'Educador ambiental y hortelano urbano. Coordina talleres de huerta en escuelas públicas del GBA.',
    categoria: 'Guía de Cultivos',
    tags: ['tomate', 'variedades', 'Argentina', 'heirloom', 'semillas'],
    metaTitle: 'Variedades de Tomate para Argentina: Guía Completa | GreenRouse',
    metaDescription:
      'Las mejores variedades de tomate para cada espacio en Argentina. Cherry, perita, heirloom y más: cómo elegir y cuándo sembrar.',
    imagenUrl: '/images/blog/variedades-tomate-argentina.jpg',
    imagenAlt: 'Variedad de tomates de diferentes colores y formas sobre una tabla de madera',
    publicado: true,
    destacado: false,
    fechaPublicacion: new Date('2026-02-15'),
    tiempoLectura: 9,
  },
  {
    titulo: 'Hierbas Aromáticas Medicinales: Cultivá tu Farmacia en el Balcón',
    slug: 'hierbas-aromaticas-medicinales-balcon',
    extracto:
      'Menta, lavanda, tomillo, romero, orégano: estas plantas no solo dan sabor a tus platos sino que tienen propiedades medicinales probadas. Guía completa para cultivarlas en macetas.',
    contenido: `## El jardín medicinal más accesible

Las plantas aromáticas son el punto de entrada perfecto para quien empieza una huerta. Son resistentes al olvido, productivas en poco espacio y tienen un alto valor de uso. Un solo paquete de semillas de albahaca puede darte condimento durante toda la temporada.

## Las 10 aromáticas esenciales

### Menta (Mentha spp.)
- **Usos medicinales**: digestiva, antiespasmódica, descongestionante.
- **Cultivo**: se extiende horizontal, usá siempre maceta separada o se come toda la huerta.
- **Cuidados**: riego abundante, media sombra en verano.
- **Cosecha**: cortá las puntas para estimular ramificación.

### Albahaca (Ocimum basilicum)
- **Usos**: antiinflamatoria, antimicrobiana, repelente de insectos.
- **Cultivo**: pleno sol, temperatura mínima 15°C. Muy sensible al frío.
- **Consejo**: retirá las flores apenas aparecen para que la planta siga produciendo hojas.

### Lavanda (Lavandula angustifolia)
- **Usos medicinales**: ansiolítica, antiséptica, cicatrizante.
- **Cultivo**: suelo bien drenado, pleno sol. Tolera sequía pero no encharcamiento.
- **Cosecha**: cosechar las espigas justo cuando empiezan a abrirse las flores.

### Romero (Salvia rosmarinus)
- **Usos**: estimulante circulatorio, antioxidante, mejora la memoria.
- **Cultivo**: muy rústico. Pleno sol, poco riego, no le gusta el exceso de nitrógeno.
- **Extra**: su aroma repele ácaros y algunos insectos. Plantalo cerca de los crucíferas.

### Tomillo (Thymus vulgaris)
- **Usos medicinales**: antiséptico respiratorio, expectorante, antifúngico.
- **Cultivo**: sol, poco agua. Muy resistente a heladas leves.
- **Cosecha**: podas frecuentes la mantienen compacta y productiva.

### Melisa (Melissa officinalis)
- **Usos**: ansiolítica, digestiva, antiviral (antiherpes).
- **Cultivo**: tolera semisombra, agradece riego regular.
- **Cuidado**: florece rápido, lo que le quita potencia a las hojas. Podá antes de florecer.

### Orégano (Origanum vulgare)
- **Usos**: antimicrobiano potente, digestivo, antioxidante.
- **Cultivo**: muy rústico, tolera sequía y sol intenso. Se multiplica por división.
- **Cosecha**: en verano, antes de la floración. Secalo atado boca abajo.

### Salvia (Salvia officinalis)
- **Usos medicinales**: antisudorífica, antiinflamatoria, estrógeno vegetal (menopausia).
- **Cultivo**: pleno sol, suelo bien drenado. Semiperennis.
- **Atención**: no consumir en grandes cantidades en embarazo.

### Caléndula (Calendula officinalis)
- **Usos**: cicatrizante, antiinflamatoria, antimicótica.
- **Cultivo**: pleno sol, siembra directa. Florece de otoño a primavera.
- **Bonus**: sus flores son comestibles y repelen pulgones.

### Cedrón (Aloysia citrodora)
- **Usos**: digestivo, sedante leve, antiespasmódico.
- **Cultivo**: sol, resistente a sequías moderadas. Pierde las hojas en invierno.
- **Infusión**: 10 hojas frescas en agua recién hervida, 5 minutos de reposo.

## Cómo hacer un jardín de aromas en macetas

Agrupá las aromáticas por requerimiento de agua:
- **Riego abundante**: menta, albahaca, melisa
- **Riego moderado**: lavanda, romero, salvia, tomillo, orégano

Usá macetas de al menos 20 cm de diámetro con buen drenaje. Mezcla: 60% sustrato universal + 30% perlita + 10% compost maduro.

## Conservar las aromáticas

- **Secado**: atá en manojos pequeños y colgá boca abajo en lugar seco y ventilado.
- **Aceite herbario**: sumergí las plantas frescas en aceite de oliva. Listo en 2 semanas.
- **Tintura madre**: plantas frescas en alcohol de 60°. 30 días, agitando cada día.`,
    autor: 'Florencia Bengoa',
    autorBio: 'Agroecóloga y consultora de huertas orgánicas en el AMBA.',
    categoria: 'Plantas Aromáticas',
    tags: ['aromáticas', 'medicinales', 'menta', 'lavanda', 'balcón', 'macetas'],
    metaTitle: 'Hierbas Aromáticas Medicinales: Guía de Cultivo en Macetas | GreenRouse',
    metaDescription:
      'Cultivá menta, lavanda, romero, tomillo y otras aromáticas medicinales en macetas. Propiedades, cuidados y usos de las 10 esenciales.',
    imagenUrl: '/images/blog/hierbas-aromaticas-medicinales.jpg',
    imagenAlt: 'Macetas con hierbas aromáticas variadas en un balcón soleado',
    publicado: true,
    destacado: false,
    fechaPublicacion: new Date('2026-02-10'),
    tiempoLectura: 12,
  },
  {
    titulo: 'Bosque Comestible: Diseñá un Sistema Productivo de 7 Capas',
    slug: 'bosque-comestible-sistema-7-capas',
    extracto:
      'El bosque comestible es el sistema más resiliente y productivo de la permacultura. Inspirado en los ecosistemas naturales, te explica cómo diseñar un jardín que produce alimentos durante décadas con mínimo mantenimiento.',
    contenido: `## ¿Qué es un bosque comestible?

Un bosque comestible (también llamado jardín forestal o food forest) imita la estructura de un bosque natural pero con plantas en su mayoría comestibles. Una vez establecido, es casi autosuficiente: se riega solo con la lluvia, se fertiliza con sus propias hojas caídas y controla sus plagas con la biodiversidad.

## Las 7 capas del bosque comestible

### Capa 1: Árboles grandes (dosel)
Los árboles que dan la sombra general. En un espacio urbano podría ser un nogal, un naranjo o un manzano.

### Capa 2: Árboles pequeños y arbustos altos
Se benefician de la sombra parcial del dosel. Membrillo, higuera, kiwi.

### Capa 3: Arbustos (shrub layer)
Arándanos, frambuesas, grosellas. Producen frutas y crean hábitats para aves que controlan insectos.

### Capa 4: Plantas herbáceas (herbaceous layer)
Las plantas de ciclo anual o perenne bajas: ajo, cebolla, orégano, rúcula perenne, consuelda.

### Capa 5: Cobertoras del suelo (ground cover)
Plantas que cubren el suelo, retienen humedad y compiten con las malezas. Trébol blanco, nasturtio, tomillo rastrero.

### Capa 6: Rizosfera (raíces)
Las plantas cuyas raíces son comestibles o mejoran el suelo: zanahoria, nabo, topinambur, raíz de consuelda (acumuladora de nutrientes).

### Capa 7: Enredaderas verticales
Aprovechan la verticalidad: kiwi, maracuyá, frambuesa trepadora, chayote.

## Diseñando tu bosque en un espacio pequeño

No necesitás una hectárea. Un patio de 30 m² puede tener todas las capas a escala reducida:

- 1 árbol frutal enano (enano o en espalier)
- 2-3 arbustos bajos (frambuesas, arándanos)
- Herbáceas perennes en el sotobosque
- Cobertoras del suelo en todo espacio libre
- Una enredadera en la pared o cerco

## Establecimiento (los primeros 3 años)

### Año 1: La base
Plantá los árboles y arbustos mientras establecés el suelo con plantas de cobertura y anuales.

### Año 2: El desarrollo
Los árboles empiezan a crecer. Reducís el riego artificial. Las capas bajas se llenan de vida.

### Año 3 en adelante: La independencia
El sistema empieza a auto-regularse. Las primeras cosechas de árboles. El mantenimiento baja drásticamente.

## Por qué es el futuro de la agricultura urbana

Los bosques comestibles:
- Producen alimentos durante 50-100 años sin laboreo
- Capturan carbono atmósferico
- Crean hábitats para fauna benéfica
- Requieren 80% menos trabajo que una huerta tradicional
- Son resilientes a la sequía y a las heladas

Un jardín ordinario emite carbono. Un bosque comestible lo captura. En el contexto de la crisis climática, es quizás la forma más poderosa de actuar desde nuestros espacios individuales.`,
    autor: 'Diego Herrera',
    autorBio:
      'Diseñador de sistemas de permacultura certificado (PDC). Ha diseñado más de 50 huertas urbanas en Buenos Aires y GBA.',
    categoria: 'Permacultura',
    tags: ['bosque comestible', 'food forest', 'permacultura', 'agroforestería', '7 capas'],
    metaTitle: 'Bosque Comestible: Las 7 Capas y Cómo Diseñarlo | GreenRouse',
    metaDescription:
      'Guía completa del bosque comestible: qué es, las 7 capas del sistema y cómo diseñar uno en tu patio o jardín siguiendo los principios de permacultura.',
    imagenUrl: '/images/blog/bosque-comestible-7-capas.jpg',
    imagenAlt: 'Jardín con múltiples capas de vegetación comestible bajo un árbol frutal',
    publicado: true,
    destacado: false,
    fechaPublicacion: new Date('2026-01-30'),
    tiempoLectura: 13,
  },
]
