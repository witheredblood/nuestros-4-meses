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

  // 📸 FOTOS: pon tus imágenes en la carpeta /photos con estos nombres
  // (o cambia el nombre aquí). Si una foto no existe, se ve un espacio reservado.
  photos: [
    { src: "photos/foto1.jpg", text: "Aquí va el texto de este recuerdo. Edítalo en config.js." },
    { src: "photos/foto2.jpg", text: "Segundo recuerdo: cuéntale qué sentías ese día." },
    { src: "photos/foto3.jpg", text: "Tercer recuerdo: escribe lo que quieras que lea." },
    { src: "photos/foto4.jpg", text: "Cuarto recuerdo: puedes agregar o quitar fotos de esta lista." }
  ],

  // 💌 LA CARTA — cada línea es un párrafo. Texto provisional: reemplázalo por el tuyo.
  letter: [
    "Vane:",
    "Hoy cumplimos cuatro meses y quise escribirte esto yo mismo.",
    "[Aquí va tu carta, con tus palabras y a tu manera. Escríbela como si se lo dijeras en persona.]",
    "Con cariño,<br>[tu nombre]"
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

    memTitle: "Nuestros recuerdos",
    memHint: "Toca una foto.",
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
