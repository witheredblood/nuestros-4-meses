/* ============================================================
   TODO LO PERSONAL VIVE AQUÍ. Edita este archivo y recarga la página.
   (Los colores están al inicio de style.css, en :root)
   ============================================================ */
window.CONFIG = {

  // 📅 FECHA DE NOVIAZGO — formato AAAA-MM-DD, por ejemplo "2026-06-15".
  // Mientras esté en null, el contador mostrará un aviso.
  startDate: null,

  // 🎵 Música opcional: pon el archivo en esta carpeta, por ejemplo "cancion.mp3".
  // Si lo dejas vacío no aparece ningún botón. Nunca suena sola: ella la activa.
  music: "",

  // 💌 LA CARTA — cada bloque es una estrofa de la carta.
  letter: [
    "Eres hermosa, perdona la franqueza,<br>pero es lo primero que viene a mi mente,<br>al contemplar de cerca tu belleza<br>cada vez que la vida te pone enfrente.",
    "Hoy cumplimos cuatro meses de historia<br>y sigo pensando que no tengo remedio;<br>tu amor se ha quedado grabado en mi memoria,<br>alejando del mundo cualquier intermedio.",
    "Cada vez que te veo me vuelvo a enamorar,<br>entre más pasa el tiempo, más te adoro;<br>en este viaje que apenas va a comenzar,<br>tú eres el sueño que más añoro.",
    "No sé qué me hiciste en este cuatrimestre,<br>pero no puedo dejar de pensar en ti;<br>no hay otra estrella que igual que tú brille,<br>te has vuelto lo más importante para mí.",
    "Soy un caso perdido si de ti me desvío,<br>el solo pensarte me arranca un suspiro;<br>en este amor tan tuyo y tan mío,<br>me pregunto si sabes cuánto te admiro.",
    "Estoy enamorado y no lo digo a la ligera,<br>estos cuatro meses son solo el inicio;<br>no sé si alguien más con esta fuerza te quiera,<br>pero por tu amor, la vida entera sacrificio."
  ],

  // 💗 RAZONES (el botón las muestra al azar sin repetir). Escribe las tuyas.
  reasons: [
    "[Razón 1: escribe aquí por qué la quieres]",
    "[Razón 2]",
    "[Razón 3]",
    "[Razón 4]",
    "[Razón 5]"
  ],

  // ✉️ Ocho estrofas que aparecen por separado al tocarlas.
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

  // El corazón dice una de estas frases en cada toque (la última se repite).
  heartLines: ["Te quiero.", "Otra vez: te quiero.", "Y lo digo en serio.", "Feliz aniversario, Vane."],

  // Textos de la página
  text: {
    welcomeTitle: "Para mi niña bonita",
    welcomeText: "Hice algo para ti.",
    openBtn: "Abrir mi regalito",

    annivKicker: "Nuestro aniversario",
    annivPhrase: "Cuatro meses a tu lado, y cada uno ha sido importante para mí.",
    annivNote: "Quizá sean solo cuatro meses, pero lo que siento por ti es muy real y muy importante para mí.",

    letterTitle: "Una carta para ti",
    letterHint: "Toca el sobre para abrirlo.",
    surpTitle: "Un par de cosas más",
    surpHint: "Toca, que hay sorpresas.",
    reasonBtn: "Una razón por la que te quiero",
    reasonsDone: "Esas fueron todas, por ahora",
    msgHint: "Ocho estrofas para ti",
    moreBtn: "Hay algo más para ti",

    finalTitle: "Felices cuatro meses, mi niña bonita",
    finalText: "Gracias por estos cuatro meses. Quiero que sepas que me importas, y que me hace feliz que seas mi novia.",
    finalSign: "Tuyo, [tu nombre]"
  }
};
