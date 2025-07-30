// ==================== DATOS DE RAMOS Y REQUISITOS ====================
// Organización por semestres
const semestres = {
    1: ["Biología básica", "Laboratorio de biología básica", "Orientación institucional", "Introducción a la filosofía", "Física básica", "Laboratorio de física", "Lengua Española Básica I", "Matemática Básica", "Química Básica", "Introducción a las ciencias sociales"],
    2: ["Biofísica", "Laboratorio de biofísica", "Educación física", "Fundamentos de Historia Social Dominicana", "Lengua Española Básica II", "Fundamentos de Desarrollo Cognitivo", "Química Orgánica", "Vida en Comunidad"],
    // ... (continúa agregando los demás semestres)
};

// Requisitos de cada ramo (ejemplo parcial)
const requisitos = {
    "Biofísica": ["Biología básica", "Laboratorio de biología básica", "Física básica", "Laboratorio de física"],
    "Laboratorio de biofísica": ["Biología básica", "Laboratorio de biología básica", "Física básica", "Laboratorio de física"],
    "Lengua Española Básica II": ["Lengua Española Básica I"],
    "Química Orgánica": ["Química Básica"], 
    // ... (agregar todos los demás requisitos)
};

// ==================== FUNCIONES ====================
const mapa = document.getElementById("mapa");
const modal = document.getElementById("modal");
const mensajeModal = document.getElementById("mensajeModal");
const cerrarModal = document.getElementById("cerrarModal");

// Cargar estado guardado
let aprobados = JSON.parse(localStorage.getItem("aprobados")) || [];

// Crear el mapa dinámicamente
function crearMapa() {
    for (const [num, ramos] of Object.entries(semestres)) {
        const divSemestre = document.createElement("div");
        divSemestre.className = "semestre";

        const titulo = document.createElement("h2");
        titulo.textContent = `Semestre ${num}`;
        divSemestre.appendChild(titulo);

        ramos.forEach(ramo => {
            const divRamo = document.createElement("div");
            divRamo.className = "ramo";
            divRamo.textContent = ramo;

            if (aprobados.includes(ramo)) divRamo.classList.add("aprobado");

            divRamo.addEventListener("click", () => toggleAprobado(ramo, divRamo));

            divSemestre.appendChild(divRamo);
        });

        mapa.appendChild(divSemestre);
    }
}

// Validar requisitos antes de aprobar
function requisitosCumplidos(ramo) {
    if (!requisitos[ramo]) return true; // Sin requisitos
    return requisitos[ramo].every(req => aprobados.includes(req));
}

// Marcar o desmarcar como aprobado
function toggleAprobado(ramo, elemento) {
    if (!aprobados.includes(ramo)) {
        // Intentando aprobar
        if (!requisitosCumplidos(ramo)) {
            const faltantes = requisitos[ramo].filter(req => !aprobados.includes(req));
            mensajeModal.textContent = `Para aprobar "${ramo}" debes aprobar primero: ${faltantes.join(", ")}`;
            modal.style.display = "block";
            return;
        }
        aprobados.push(ramo);
        elemento.classList.add("aprobado");
    } else {
        // Desmarcar aprobado
        aprobados = aprobados.filter(r => r !== ramo);
        elemento.classList.remove("aprobado");
    }
    localStorage.setItem("aprobados", JSON.stringify(aprobados));
}

// Cerrar modal
cerrarModal.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => { if (e.target == modal) modal.style.display = "none"; });

// Inicializar
crearMapa();
