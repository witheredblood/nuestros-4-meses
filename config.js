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

  // ✉️ Mensajitos que aparecen al tocarlos (puedes poner más o menos).
  messages: [
    "Gracias por estar",
    "Me importas mucho",
    "Me haces feliz",
    "Qué bueno es tenerte",
    "Eres mi niña bonita",
    "Te quiero, Vane"
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
    msgHint: "Mensajitos para ti",
    moreBtn: "Hay algo más para ti",

    finalTitle: "Felices cuatro meses, mi niña bonita",
    finalText: "Gracias por estos cuatro meses. Quiero que sepas que me importas, y que me hace feliz que seas mi novia.",
    finalSign: "Tuyo, [tu nombre]"
  }
};
