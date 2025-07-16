const ramos = [
  // 1° Año
  { nombre: "Intro. a Comunicación Visual", año: 1 },
  { nombre: "Intro. a la Historia de la Arquitectura", año: 1 },
  { nombre: "Matemática I", año: 1 },
  { nombre: "Intro. a las Construcciones", año: 1 },
  { nombre: "Intro. al Diseño Arquitectónico", año: 1 },

  // 2° Año
  {
    nombre: "Comunicación Visual I",
    año: 2,
    prerequisitos: ["Intro. a Comunicación Visual"],
    opcionales: ["Intro. a la Historia de la Arquitectura", "Matemática I", "Intro. a las Construcciones"],
    minOpcionales: 2
  },
  {
    nombre: "Historia de la Arquitectura I",
    año: 2,
    prerequisitos: ["Intro. a la Historia de la Arquitectura"]
  },
  {
    nombre: "Construcciones I",
    año: 2,
    prerequisitos: ["Intro. a las Construcciones"]
  },
  {
    nombre: "Estructuras I",
    año: 2,
    prerequisitos: [
      "Matemática I",
      "Intro. a las Construcciones",
      "Intro. a Comunicación Visual",
      "Intro. al Diseño Arquitectónico"
    ]
  },
  {
    nombre: "Diseño Arquitectónico I",
    año: 2,
    prerequisitos: ["Intro. al Diseño Arquitectónico", "Comunicación Visual I"]
  },
  {
    nombre: "Matemática II",
    año: 2,
    prerequisitos: ["Matemática I"]
  },

  // 3° Año
  {
    nombre: "Comunicación Visual II",
    año: 3,
    prerequisitos: ["Comunicación Visual I"]
  },
  {
    nombre: "Historia de la Arquitectura II",
    año: 3,
    prerequisitos: ["Historia de la Arquitectura I"]
  },
  {
    nombre: "Construcciones II",
    año: 3,
    prerequisitos: ["Construcciones I"]
  },
  {
    nombre: "Estructuras II",
    año: 3,
    prerequisitos: ["Estructuras I", "Matemática II"]
  },
  {
    nombre: "Diseño Arquitectónico II",
    año: 3,
    prerequisitos: ["Diseño Arquitectónico I", "Comunicación Visual II"]
  },

  // 4° Año
  {
    nombre: "Historia de la Arquitectura III",
    año: 4,
    prerequisitos: ["Historia de la Arquitectura II"]
  },
  {
    nombre: "Urbanismo I",
    año: 4,
    prerequisitos: ["Historia de la Arquitectura II"]
  },
  {
    nombre: "Construcciones III",
    año: 4,
    prerequisitos: ["Construcciones II"]
  },
  {
    nombre: "Estructuras III",
    año: 4,
    prerequisitos: ["Estructuras II"]
  },
  {
    nombre: "Diseño Arquitectónico III",
    año: 4,
    prerequisitos: ["Diseño Arquitectónico II"]
  },

  // 5° Año
  {
    nombre: "Urbanismo II",
    año: 5,
    prerequisitos: ["Urbanismo I", "Historia de la Arquitectura III"]
  },
  {
    nombre: "Economía y Organización de Obra",
    año: 5,
    prerequisitos: ["Construcciones III"]
  },
  {
    nombre: "Construcciones IV",
    año: 5,
    prerequisitos: ["Construcciones III"]
  },
  {
    nombre: "Estructuras IV",
    año: 5,
    prerequisitos: ["Estructuras III"]
  },
  {
    nombre: "Diseño Arquitectónico IV",
    año: 5,
    prerequisitos: ["Diseño Arquitectónico III"]
  },

  // 6° Año
  {
    nombre: "Teoría y Crítica de la Arq. y el Urb.",
    año: 6,
    prerequisitos: ["Urbanismo II"]
  },
  {
    nombre: "Legislación de Obra",
    año: 6,
    prerequisitos: ["Construcciones IV", "Economía y Organización de Obra"]
  },
  {
    nombre: "Diseño Arquitectónico V",
    año: 6,
    prerequisitos: ["Diseño Arquitectónico IV"]
  }
];

const container = document.getElementById("malla-container");
let aprobados = new Set();

function cumplePrerrequisitos(ramo) {
  const tieneTodos = (ramo.prerequisitos || []).every(p => aprobados.has(p));
  const opcionalesAprobados = (ramo.opcionales || []).filter(p => aprobados.has(p)).length;
  const tieneOpcionales = ramo.minOpcionales ? opcionalesAprobados >= ramo.minOpcionales : true;
  return tieneTodos && tieneOpcionales;
}

function renderMalla() {
  container.innerHTML = "";
  const porAño = {};

  for (const ramo of ramos) {
    if (!porAño[ramo.año]) porAño[ramo.año] = [];
    porAño[ramo.año].push(ramo);
  }

  for (const año of Object.keys(porAño)) {
    const div = document.createElement("div");
    div.className = "año";
    div.innerHTML = `<h2>${año}° Año</h2>`;

    for (const ramo of porAño[año]) {
      const btn = document.createElement("div");
      btn.className = "ramo";

      const bloqueado = !cumplePrerrequisitos(ramo);
      if (bloqueado) btn.classList.add("bloqueado");
      if (aprobados.has(ramo.nombre)) btn.classList.add("aprobado");

      btn.textContent = ramo.nombre;
      const tooltip = [
        ...(ramo.prerequisitos?.length ? [`Requiere: ${ramo.prerequisitos.join(", ")}`] : []),
        ...(ramo.opcionales?.length
          ? [`+ ${ramo.minOpcionales} de: ${ramo.opcionales.join(", ")}`]
          : []),
      ];
      btn.title = tooltip.join("\n");

      btn.onclick = () => {
        if (bloqueado) return;
        if (aprobados.has(ramo.nombre)) {
          aprobados.delete(ramo.nombre);
        } else {
          aprobados.add(ramo.nombre);
        }
        renderMalla();
      };

      div.appendChild(btn);
    }

    container.appendChild(div);
  }
}

renderMalla();


