const malla = [
  {
    semestre: "1° Semestre",
    ramos: [
      { nombre: "Intro. a Comunicación Visual", creditos: 6, prerequisitos: [] },
      { nombre: "Intro. a la Historia de la Arquitectura", creditos: 6, prerequisitos: [] },
      { nombre: "Matemática I", creditos: 6, prerequisitos: [] },
      { nombre: "Intro. a las Construcciones", creditos: 6, prerequisitos: [] },
      { nombre: "Intro. al Diseño Arquitectónico", creditos: 6, prerequisitos: [] }
    ]
  },
  {
    semestre: "2° Semestre",
    ramos: [
      { 
        nombre: "Comunicación Visual I", 
        creditos: 6, 
        prerequisitosEspeciales: {
          debenAprobarse: ["Intro. a Comunicación Visual"],
          debenAprobarseAlMenos: {
            cantidad: 2,
            ramos: [
              "Intro. a la Historia de la Arquitectura",
              "Matemática I",
              "Intro. a las Construcciones"
            ]
          }
        }
      },
      { nombre: "Historia de la Arquitectura I", creditos: 6, prerequisitos: ["Intro. a la Historia de la Arquitectura"] },
      { nombre: "Construcciones I", creditos: 6, prerequisitos: ["Intro. a las Construcciones"] },
      { nombre: "Estructuras I", creditos: 6, prerequisitos: ["Matemática I", "Intro. a las Construcciones", "Intro. a Comunicación Visual", "Intro. al Diseño Arquitectónico"] },
      { nombre: "Diseño Arquitectónico I", creditos: 6, prerequisitos: ["Intro. al Diseño Arquitectónico"] },
      { nombre: "Matemática II", creditos: 6, prerequisitos: ["Matemática I"] }
    ]
  },
  {
    semestre: "3° Semestre",
    ramos: [
      { nombre: "Comunicación Visual II", creditos: 6, prerequisitos: ["Comunicación Visual I"] },
      { nombre: "Historia de la Arquitectura II", creditos: 6, prerequisitos: ["Historia de la Arquitectura I"] },
      { nombre: "Construcciones II", creditos: 6, prerequisitos: ["Construcciones I"] },
      { nombre: "Estructuras II", creditos: 6, prerequisitos: ["Estructuras I"] },
      { nombre: "Diseño Arquitectónico II", creditos: 6, prerequisitos: ["Diseño Arquitectónico I"] }
    ]
  },
  {
    semestre: "4° Semestre",
    ramos: [
      { nombre: "Historia de la Arquitectura III", creditos: 6, prerequisitos: ["Historia de la Arquitectura II"] },
      { nombre: "Urbanismo I", creditos: 6, prerequisitos: [] },
      { nombre: "Construcciones III", creditos: 6, prerequisitos: ["Construcciones II"] },
      { nombre: "Estructuras III", creditos: 6, prerequisitos: ["Estructuras II"] },
      { nombre: "Diseño Arquitectónico III", creditos: 6, prerequisitos: ["Diseño Arquitectónico II"] }
    ]
  },
  {
    semestre: "5° Semestre",
    ramos: [
      { nombre: "Urbanismo II", creditos: 6, prerequisitos: ["Urbanismo I"] },
      { nombre: "Economía y Organización de Obra", creditos: 6, prerequisitos: [] },
      { nombre: "Construcciones IV", creditos: 6, prerequisitos: ["Construcciones III"] },
      { nombre: "Estructuras IV", creditos: 6, prerequisitos: ["Estructuras III"] },
      { nombre: "Diseño Arquitectónico IV", creditos: 6, prerequisitos: ["Diseño Arquitectónico III"] }
    ]
  },
  {
    semestre: "6° Semestre",
    ramos: [
      { nombre: "Teoría y Crítica de la Arquitectura y el Urbanismo", creditos: 6, prerequisitos: [] },
      { nombre: "Legislación de Obra", creditos: 6, prerequisitos: [] },
      { nombre: "Diseño Arquitectónico V", creditos: 6, prerequisitos: ["Diseño Arquitectónico IV"] }
    ]
  }
];

const aprobadosKey = "aprobados-arquitectura";
const container = document.getElementById("malla-container");

let aprobados = JSON.parse(localStorage.getItem(aprobadosKey)) || [];

function cumplePrerrequisitos(ramo) {
  // Si no tiene prerequisitos ni prerequisitosEspeciales
  if (!ramo.prerequisitos && !ramo.prerequisitosEspeciales) return false;

  // Prerrequisitos normales
  if (ramo.prerequisitos) {
    for (const pre of ramo.prerequisitos) {
      if (!aprobados.includes(pre)) return true; // bloqueado
    }
  }

  // Prerrequisitos especiales (como Comunicación Visual I)
  if (ramo.prerequisitosEspeciales) {
    const especiales = ramo.prerequisitosEspeciales;

    // Validar los que deben estar aprobados sí o sí
    if (especiales.debenAprobarse) {
      for (const pre of especiales.debenAprobarse) {
        if (!aprobados.includes(pre)) return true;
      }
    }

    // Validar los que necesitan al menos cierta cantidad aprobada
    if (especiales.debenAprobarseAlMenos) {
      const { cantidad, ramos } = especiales.debenAprobarseAlMenos;
      let count = 0;
      for (const r of ramos) {
        if (aprobados.includes(r)) count++;
      }
      if (count < cantidad) return true; // bloqueado
    }
  }

  return false; // si pasó todo, no está bloqueado
}

function toggleRamo(nombre) {
  if (aprobados.includes(nombre)) {
    aprobados = aprobados.filter(r => r !== nombre);
  } else {
    aprobados.push(nombre);
  }
  localStorage.setItem(aprobadosKey, JSON.stringify(aprobados));
  renderMalla();
}

function renderMalla() {
  container.innerHTML = "";
  malla.forEach(semestre => {
    const divSem = document.createElement("div");
    divSem.className = "semestre";
    const h2 = document.createElement("h2");
    h2.textContent = semestre.semestre;
    divSem.appendChild(h2);

    semestre.ramos.forEach(ramo => {
      const bloqueado = cumplePrerrequisitos(ramo);
      const aprobado = aprobados.includes(ramo.nombre);

      const divRamo = document.createElement("div");
      divRamo.className = "ramo";
      if (bloqueado) divRamo.classList.add("bloqueado");
      if (aprobado) divRamo.classList.add("aprobado");

      // Tooltip con prerequisitos
      let titleText = "";
      if (ramo.prerequisitos && ramo.prerequisitos.length > 0) {
        titleText += "Prerrequisitos: " + ramo.prerequisitos.join(", ") + ". ";
      }
      if (ramo.prerequisitosEspeciales) {
        const esp = ramo.prerequisitosEspeciales;
        if (esp.debenAprobarse) {
          titleText += "Debe aprobar: " + esp.debenAprobarse.join(", ") + ". ";
        }
        if (esp.debenAprobarseAlMenos) {
          titleText += `Debe aprobar al menos ${esp.debenAprobarseAlMenos.cantidad} de: ${esp.debenAprobarseAlMenos.ramos.join(", ")}.`;
        }
      }
      divRamo.title = titleText.trim();

      if (!bloqueado) {
        divRamo.onclick = () => toggleRamo(ramo.nombre);
      }

      const nombreSpan = document.createElement("span");
      nombreSpan.className = "nombre";
      nombreSpan.textContent = ramo.nombre;

      const creditosSpan = document.createElement("span");
      creditosSpan.className = "creditos";
      creditosSpan.textContent = `${ramo.creditos} créditos`;

      divRamo.appendChild(nombreSpan);
      divRamo.appendChild(creditosSpan);
      divSem.appendChild(divRamo);
    });

    container.appendChild(divSem);
  });
}

renderMalla();


