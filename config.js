window.CONFIG = {
  // Fecha de noviazgo (AAAA-MM-DD)
  startDate: "2026-07-10",

  // Fecha de desbloqueo (10 de noviembre a las 00:00) y código secreto de acceso anticipado
  unlockDate: "2026-11-10T00:00:00",
  secretCode: "091020040525200310072026",

  // Música manual opcional (vacío = desactivado)
  music: "",

  // Carta (cada elemento es una estrofa)
  letter: [
    "Eres hermosa, perdona la franqueza,<br>pero es lo primero que viene a mi mente,<br>al contemplar de cerca tu belleza<br>cada vez que la vida te pone enfrente.",
    "Hoy cumplimos cuatro meses de historia<br>y sigo pensando que no tengo remedio;<br>tu amor se ha quedado grabado en mi memoria,<br>alejando del mundo cualquier intermedio.",
    "Cada vez que te veo me vuelvo a enamorar,<br>entre más pasa el tiempo, más te adoro;<br>en este viaje que apenas va a comenzar,<br>tú eres el sueño que más añoro.",
    "No sé qué me hiciste en este cuatrimestre,<br>pero no puedo dejar de pensar en ti;<br>no hay otra estrella que igual que tú brille,<br>te has vuelto lo más importante para mí.",
    "Soy un caso perdido si de ti me desvío,<br>el solo pensarte me arranca un suspiro;<br>en este amor tan tuyo y tan mío,<br>me pregunto si sabes cuánto te admiro.",
    "Estoy enamorado y no lo digo a la ligera,<br>estos cuatro meses son solo el inicio;<br>no sé si alguien más con esta fuerza te quiera,<br>pero por tu amor, la vida entera sacrificio."
  ],

  // Razones (se muestran al azar sin repetir)
  reasons: [
    "Por la paz tan bonita que siento cada vez que estoy contigo.",
    "Por tu risa, que tiene el poder de arreglarme hasta el día más pesado.",
    "Porque contigo puedo ser yo mismo sin fingir nada.",
    "Por la ternura con la que me tratas y los pequeños detalles que tienes conmigo.",
    "Porque haces que cualquier plan sencillo se vuelva mi momento favorito del día.",
    "Por tu forma tan linda de ver la vida y el cariño que le pones a todo.",
    "Porque me escuchas, me entiendes y siempre sabes cómo hacerme sonreír.",
    "Porque a tu lado me siento en casa, tranquilo y completamente feliz."
  ],

  // Ocho estrofas (libros I a VIII)
  messages: [
    {
      num: "I",
      verse: "A flor del romero\ndecorando pasillos en el cielo,\nguitarra callada que hablas\nde un amor sincero\nque quiere arroparte las mañanas."
    },
    {
      num: "II",
      verse: "Ay, que mira soñándote la luna,\ny yo te miro en deseo,\nque para mí solo hay una,\ny no es la flor del romero,\neres tú enraizándote en mi cielo."
    },
    {
      num: "III",
      verse: "Cañí, la copla de un querer,\nde aceituna, piel y vida,\ncolor de romance que inunda\nlos amaneceres\nen la cara oculta de la luna."
    },
    {
      num: "IV",
      verse: "Porque te vengo rondando\nen sangre y fuego,\ndelirios de boca y beso,\nque acercan mis labios en verso\npara decirte: te quiero."
    },
    {
      num: "V",
      verse: "Roncan las palmas\ny, en ecos de luceros,\nlos volantes de tu enagua\nme van marcando el camino\nque me lleve hasta tu pecho."
    },
    {
      num: "VI",
      verse: "Te espero sin vara ni mimbre,\nsabiendo que ha de llegar la dicha,\nen que la lágrima sea fuente\nque moje tus manos,\nhaciéndose río por donde navegue mi nombre."
    },
    {
      num: "VII",
      verse: "Y al abrigo de tus brazos,\nquedarme prendido a tu pecho,\ny que mi corazón salga al acecho\na recogerte todos los latidos\npara hacerte locura de mis sentidos."
    },
    {
      num: "VIII",
      verse: "Que se queden mis pestañas\nrondando los portales de tus ojos,\ny que, sin avisar al sereno, me abras\npara dejarte en el buzón de tu iris\nla carta que te diga: «Te amo»."
    }
  ],

  // Frases del corazón
  heartLines: [
    "Te quiero.",
    "Otra vez: te quiero.",
    "Y lo digo muy en serio.",
    "Me encantas demasiado.",
    "Felices 4 meses de novios, mi niña bonita ♥"
  ],

  // Textos de la interfaz
  text: {
    welcomeTitle: "Para mi niña bonita",
    welcomeText: "Hice algo especial para ti.",
    openBtn: "Abrir mi regalito",

    annivKicker: "Tú y yo",
    annivPhrase: "Cada día a tu lado se ha vuelto mi parte favorita de la vida.",
    annivNote: "Y esto es apenas el comienzo de todo lo bonito que nos falta vivir juntos.",

    letterTitle: "Una carta para ti",
    letterHint: "Toca el sobre para abrirlo.",
    surpTitle: "Un par de cosas más",
    surpHint: "Toca, que hay sorpresas.",
    reasonBtn: "Una razón por la que te quiero",
    reasonsDone: "Y aún me quedan infinitas razones más para quererte ♥",
    msgHint: "Ocho estrofas para ti",
    moreBtn: "Hay algo más para ti",

    finalTitle: "Felices cuatro meses de novios, mi niña bonita",
    finalText: "Gracias por estos cuatro meses juntos. Quiero que sepas cuánto me importas y lo feliz que me hace ser tu novio.",
    finalSign: "Siempre tuyo ♥"
  },

  // 1. Notas de la Abejita interactiva (al tocarla)
  beeNotes: [
    "Bzz ♥ Dato curioso: tu sonrisa me ilumina todo el día.",
    "Traje polen de cerezo para la niña más linda de mi mundo ♥",
    "Bzz... Cada día contigo suma mil flores nuevas a mi jardín.",
    "Eres mi lugar favorito en todo el servidor ♥",
    "Bzz ♥ Me encantas hoy, mañana y siempre."
  ],

  // 2. Recetas de la Mesa de Trabajo (Crafting Table)
  recipes: [
    {
      id: "cupon",
      name: "Cupón: Cita Especial",
      resultIcon: "mc/name_tag.png",
      lore: "✦ Canjeable cuando tú quieras",
      desc: "Válido por una salida juntos a comer tu antojo favorito + abrazos y besos ilimitados.",
      grid: [
        "mc/sugar.png", "mc/pink_petals.png", "mc/sugar.png",
        "mc/pink_petals.png", "mc/paper.png", "mc/pink_petals.png",
        "mc/sugar.png", "mc/diamond.png", "mc/sugar.png"
      ]
    },
    {
      id: "manzana",
      name: "Manzana Dorada de Mimos",
      resultIcon: "mc/golden_apple.png",
      lore: "✦ Regeneración ∞ · Absorción IV",
      desc: "Cura cualquier día pesado al instante con cariñitos, atención al 100% y muchos mimos.",
      grid: [
        "mc/diamond.png", "mc/sugar.png", "mc/diamond.png",
        "mc/sugar.png", "mc/golden_apple.png", "mc/sugar.png",
        "mc/pink_petals.png", "mc/honey_bottle.png", "mc/pink_petals.png"
      ]
    },
    {
      id: "promesa",
      name: "Libro Encantado: Nosotros",
      resultIcon: "mc/enchanted_book.png",
      lore: "✦ Lealtad III · Irrompible X",
      desc: "La promesa de seguir construyendo recuerdos, risas y aventuras juntos mes tras mes.",
      grid: [
        "mc/amethyst_shard.png", "mc/pink_petals.png", "mc/amethyst_shard.png",
        "mc/paper.png", "mc/writable_book.png", "mc/paper.png",
        "mc/diamond.png", "mc/amethyst_shard.png", "mc/diamond.png"
      ]
    }
  ],

  // 3. Pociones del Soporte de Pociones (Brewing Stand)
  potions: [
    {
      name: "Poción de Amor Infinito",
      icon: "mc/dragon_breath.png",
      duration: "∞:∞",
      effect: "+1000% Ganas de abrazarte y besarte",
      desc: "Se activa automáticamente cada vez que te veo o pienso en ti."
    },
    {
      name: "Elixir de Calma Instantánea IV",
      icon: "mc/honey_bottle.png",
      duration: "Instantáneo",
      effect: "+100% Paz en el corazón",
      desc: "Basta escuchar tu voz o tu risa para que todo esté bien."
    },
    {
      name: "Esencia de Cristal de Cerezo",
      icon: "mc/amethyst_shard.png",
      duration: "04:00 (y contando)",
      effect: "Suerte V · Felicidad máxima",
      desc: "Cuatro meses del efecto más bonito que me ha pasado en la vida."
    }
  ],

  // 4. Discos del Tocadiscos (Jukebox)
  discs: [
    {
      id: "blind_spots",
      title: "C418 - Blind Spots",
      subtitle: "Nuestra canción principal ♥",
      icon: "mc/music_disc_cat.png",
      src: "sonidos/blind_spots.mp3",
      color: "#55ff55"
    },
    {
      id: "cherry_lullaby",
      title: "Melodía - Cerezos al Atardecer",
      subtitle: "Caja musical de cristal (Síntesis)",
      icon: "mc/music_disc_otherside.png",
      synth: "cherry",
      color: "#55ffff"
    },
    {
      id: "starlight_duet",
      title: "Melodía - Bajo las Estrellas",
      subtitle: "Notas dulces de medianoche (Síntesis)",
      icon: "mc/music_disc_relic.png",
      synth: "stars",
      color: "#ff99cc"
    }
  ],

  // 5. Mapa y Coordenadas de Nuestro Mundo
  worldMap: {
    seed: "10072026",
    biome: "Bosque de Cerezos (Cherry Grove)",
    waypoints: [
      {
        coords: "X: 10 · Y: 07 · Z: 2026",
        title: "El Primer Bloque",
        desc: "Donde comenzó nuestra aventura juntos el 10 de julio de 2026."
      },
      {
        coords: "X: 04 · Y: 120 · Z: 1011",
        title: "Mirador de los 4 Meses",
        desc: "Cuatro meses llenos de risas, cariño y momentos inolvidables."
      },
      {
        coords: "X: ∞ · Y: 256 · Z: ∞",
        title: "Nuestro Horizonte",
        desc: "Todo el mapa que nos falta explorar siempre de la mano."
      }
    ]
  }
};

// Mesa de encantamientos
window.ENCHANT_CFG = {
  title: "Mesa de encantamientos",
  hint: "Toca el libro para abrirlo.",
  items: [
    {
      title: "✦ Lealtad III",
      text: "Mi corazón siempre regresa a ti, sin importar la distancia ni el tiempo."
    },
    {
      title: "✦ Infinidad I",
      text: "Para que las risas, los abrazos y las ganas de estar juntos no se nos acaben nunca."
    },
    {
      title: "✦ Irrompible III",
      text: "Por lo nuestro, que cada día que pasa se vuelve más fuerte, más bonito y más real."
    }
  ]
};
