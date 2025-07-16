const ramos = [
  { nombre: "Intro. a Comunicación Visual", semestre: 1 },
  { nombre: "Intro. a la Historia de la Arquitectura", semestre: 1 },
  { nombre: "Matemática I", semestre: 1 },
  { nombre: "Intro. a las Construcciones", semestre: 1 },
  { nombre: "Intro. al Diseño Arquitectónico", semestre: 1 },

  {
    nombre: "Comunicación Visual I",
    semestre: 2,
    prerequisitos: ["Intro. a Comunicación Visual"],
    opcionales: ["Intro. a la Historia de la Arquitectura", "Matemática I", "Intro. a las Construcciones"],
    minOpcionales: 2,
  },

  {
    nombre: "Estructuras I",
    semestre: 2,
    prerequisitos: [
      "Matemática I",
      "Intro. a las Construcciones",
      "Intro. a Comunicación Visual",
      "Intro. al Diseño Arquitectónico"
    ],
  },

  { nombre: "Historia de la Arquitectura I", semestre: 2 },
  { nombre: "Construcciones I", semestre: 2 },
  { nombre: "Diseño Arquitectónico I", semestre: 2 },
  { nombre: "Matemática II", semestre: 2 },
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
  const porSemestre = {};

  for (const ramo of ramos) {
    if (!porSemestre[ramo.semestre]) porSemestre[ramo.semestre] = [];
    porSemestre[ramo.semestre].push(ramo);
  }

  for (const semestre of Object.keys(porSemestre)) {
    const div = document.createElement("div");
    div.className = "semestre";
    div.innerHTML = `<h2>${semestre}° Semestre</h2>`;

    for (const ramo of porSemestre[semestre]) {
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


