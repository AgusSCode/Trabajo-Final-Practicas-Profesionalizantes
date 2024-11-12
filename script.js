// Array de recetas inicial para simular base de datos local
const recetasBase = [
    { 
        titulo: "Ensalada César", 
        ingredientes: ["lechuga", "pollo", "queso parmesano", "crutones"], 
        categoria: "entradas",
        instrucciones: [
            "Lavar y cortar la lechuga",
            "Cocinar el pollo y cortarlo en tiras",
            "Mezclar la lechuga con el pollo, queso parmesano y crutones",
            "Aliñar con salsa César."
        ],
		imagenURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR05WL051cVLuZ6KCSJPla_Q4mWfWOu7-DiAg&s"  // Campo para la imagen
    },
    { 
        titulo: "Sopa de Tomate", 
        ingredientes: ["tomate", "ajo", "albahaca"], 
        categoria: "entradas",
        instrucciones: [
            "Cortar los tomates y el ajo",
            "Sofreír el ajo en una olla con un poco de aceite",
            "Añadir los tomates y cocer durante 20 minutos",
            "Añadir la albahaca, licuar y servir."
        ],
		imagenURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx2xxndRaEi-Fz9jM45eZk9sys1KUI0otLeQ&s"  // Campo para la imagen
    },
    { 
        titulo: "Lasagna", 
        ingredientes: ["pasta", "queso", "carne", "salsa de tomate"], 
        categoria: "platos-principales",
        instrucciones: [
            "Cocinar las láminas de pasta",
            "Sofreír la carne con la salsa de tomate",
            "Intercalar capas de pasta, carne y queso en una fuente",
            "Hornear durante 30 minutos a 180°C."
        ],
		imagenURL: "https://cookingwithayeh.com/wp-content/uploads/2023/12/Spinach-Lasagna-SQ-12.jpg"  // Campo para la imagen
    },
    { 
        titulo: "Brownie", 
        ingredientes: ["chocolate", "azúcar", "harina"], 
        categoria: "postres",
        instrucciones: [
            "Derretir el chocolate",
            "Mezclar con el azúcar y la harina",
            "Verter la mezcla en un molde",
            "Hornear durante 25 minutos a 180°C."
        ],
		imagenURL: "https://www.aceitesdeolivadeespana.com/wp-content/uploads/2019/03/brownies-de-chocolate-1000x768.png"  // Campo para la imagen browniE
    },
    { 
        titulo: "Mojito", 
        ingredientes: ["menta", "ron", "limón", "azúcar"], 
        categoria: "bebidas",
        instrucciones: [
            "Machacar las hojas de menta con el azúcar y el jugo de limón",
            "Añadir hielo y ron",
            "Rellenar con soda y remover",
            "Servir frío."
        ],
		imagenURL: "https://images.mrcook.app/recipe-image/0191c363-d976-758a-80e3-05606a143e0f"  // Campo para la imagen
    }
];

window.addEventListener("beforeunload", () => {
    document.getElementById('form-receta').reset();
});

// Función para cargar recetas
function obtenerRecetas() {
    if (!localStorage.getItem('recetasInicializadas')) {
        localStorage.setItem('recetas', JSON.stringify(recetasBase));
        localStorage.setItem('recetasInicializadas', 'true');
    }
    return JSON.parse(localStorage.getItem('recetas')) || [];
}

// Función para eliminar una receta por índice
function eliminarReceta(index) {
    let recetasGuardadas = obtenerRecetas();
    recetasGuardadas.splice(index, 1); // Elimina la receta en la posición del índice
    localStorage.setItem('recetas', JSON.stringify(recetasGuardadas)); // Actualiza localStorage
    filtrarPorCategoria(); // Actualiza la lista de recetas
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function() {
    asignarEventosBotones(); // Asigna eventos cuando se carga la página
    filtrarPorCategoria(); // Filtra recetas por categoría al cargar la página
});

// Función para asignar eventos a botones después de actualizar el DOM
function asignarEventosBotones() {
    const btnsModificar = document.querySelectorAll(".btn-modificar");
    const btnsToggle = document.querySelectorAll(".btn-toggle");
    const btnsEliminar = document.querySelectorAll(".btn-eliminar");

    // Asigna eventos a botones de modificar
    btnsModificar.forEach((button) => {
        button.addEventListener("click", function() {
            const index = button.getAttribute("data-index");
            const receta = obtenerRecetaPorIndice(index);

            // Guardar la receta a modificar en localStorage
            localStorage.setItem("recetaAModificar", JSON.stringify(receta));
            window.location.href = "receta.html"; // Redirige a receta.html
        });
    });

    // Asigna eventos a botones de despliegue
    btnsToggle.forEach(button => {
        button.addEventListener("click", function() {
            const index = this.getAttribute("data-index");
            const recetaDiv = this.closest(".receta");
            const instruccionesDiv = document.getElementById(`instrucciones-${index}`);

            if (instruccionesDiv.style.display === "none") {
                instruccionesDiv.style.display = "block";
                recetaDiv.classList.add("active");
                this.innerHTML = "▲";
            } else {
                instruccionesDiv.style.display = "none";
                recetaDiv.classList.remove("active");
                this.innerHTML = "▼";
            }
        });
    });

    // Asigna eventos a botones de eliminar
    btnsEliminar.forEach(button => {
        button.addEventListener("click", function() {
            const index = this.getAttribute("data-index");
            if (confirm("¿Estás seguro de que deseas eliminar esta receta?")) {
                eliminarReceta(index);
            }
        });
    });
}

// Función para filtrar recetas por categoría
function filtrarPorCategoria() {
    const filtroCategoria = document.getElementById("filtro-categoria");
    if (!filtroCategoria) return;

    const resultadoFiltro = document.getElementById("resultado-filtro");
    const categoriaSeleccionada = filtroCategoria.value;

    const recetas = obtenerRecetas();
    resultadoFiltro.innerHTML = "";

    const recetasFiltradas = categoriaSeleccionada === "todas"
        ? recetas
        : recetas.filter(receta => receta.categoria === categoriaSeleccionada);

    if (recetasFiltradas.length === 0) {
        resultadoFiltro.innerHTML = "<p>No hay recetas en esta categoría.</p>";
    } else {
        recetasFiltradas.forEach((receta, index) => {
            const instruccionesNumeradas = formatearInstrucciones(receta.instrucciones);

            const recetaDiv = document.createElement("div");
            recetaDiv.classList.add("receta");

            const recetaInfo = `
                <div class="receta-header">
                    <img src="${receta.imagenURL}" alt="${receta.titulo}" class="receta-imagen">
                    <p class="receta-titulo"><strong>${receta.titulo}</strong></p>
                    <p class="receta-ingredientes"><strong>Ingredientes:</strong> ${Array.isArray(receta.ingredientes) ? receta.ingredientes.join(", ") : receta.ingredientes}</p>
                    <button class="btn-toggle" data-index="${index}">▼</button>
                    <button class="btn-modificar" data-index="${index}">Modificar</button>
                    <button class="btn-eliminar" data-index="${index}">Eliminar</button>
                </div>
                <div class="instrucciones" id="instrucciones-${index}" style="display: none;">
                    <p style="margin-bottom: 20px;"><strong>Instrucciones:</strong></p>
                    <p>${instruccionesNumeradas}</p>
                </div>
            `;
            recetaDiv.innerHTML = recetaInfo;
            resultadoFiltro.appendChild(recetaDiv);
        });
    }

    asignarEventosBotones(); // Reasigna eventos después de actualizar el DOM
    console.log("Recetas filtradas para la categoría:", categoriaSeleccionada, recetasFiltradas);
}


let recetaEnEdicion = null; // Variable de estado para el índice de la receta en edición

// Manejo del formulario para agregar o editar receta
function manejarFormularioReceta(event) {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value.trim();
    const categoria = document.getElementById('categoria').value;
    const ingredientes = document.getElementById('ingredientes').value.trim().split(",").map(ing => ing.trim());
    const instrucciones = document.getElementById('instrucciones').value.trim().split(". ").map(inst => inst.trim());
    const imagenInput = document.getElementById('imagen');
    let imagen = null;

    // Comprobar si se seleccionó una imagen
    if (imagenInput && imagenInput.files.length > 0) {
        const file = imagenInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            imagen = event.target.result;
            guardarReceta(titulo, categoria, ingredientes, instrucciones, imagen);
        };
        reader.readAsDataURL(file);
    } else {
        imagen = recetaEnEdicion !== null ? obtenerRecetas()[recetaEnEdicion].imagen : null;
        guardarReceta(titulo, categoria, ingredientes, instrucciones, imagen);
    }
}

// Función para guardar la receta
function guardarReceta(titulo, categoria, ingredientes, instrucciones, imagen) {
    if (!titulo || !categoria || ingredientes.length === 0 || instrucciones.length === 0) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    const nuevaReceta = { titulo, categoria, ingredientes, instruccionesNumeradas, imagen };
    let recetasGuardadas = obtenerRecetas();

    if (recetaEnEdicion !== null) {
        // Modificación
        recetasGuardadas[recetaEnEdicion] = nuevaReceta;
        alert("Receta modificada con éxito");
    } else {
        // Agregar nueva receta
        recetasGuardadas.push(nuevaReceta);
        alert("Receta agregada con éxito");
    }

    localStorage.setItem('recetas', JSON.stringify(recetasGuardadas));
    recetaEnEdicion = null; // Resetear estado
    filtrarPorCategoria(); // Actualizar la lista
    document.getElementById('form-receta').reset(); // Limpiar formulario
    document.getElementById('btn-guardar').textContent = "Agregar receta"; // Resetear texto del botón
    document.getElementById('formulario-receta').style.display = "none"; // Ocultar formulario
}

// Inicialización de eventos cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    const filtroCategoria = document.getElementById("filtro-categoria");
    if (filtroCategoria) {
        filtroCategoria.addEventListener("change", filtrarPorCategoria);
    }

    const formReceta = document.getElementById('form-receta');
    if (formReceta) {
        formReceta.addEventListener('submit', manejarFormularioReceta);
    }

 

    filtrarPorCategoria();  // Carga inicial de las recetas
});


// Función para formatear las instrucciones antes de guardarlas o mostrarlas
function formatearInstrucciones(instrucciones) {
    // Si las instrucciones son un array, se procesan
    if (Array.isArray(instrucciones)) {
        return instrucciones.map((inst, i) => {
            const paso = inst.trim();
            // Asegurarse de que no haya dos puntos finales
            return `${i + 1}. ${paso.replace(/\.*$/, '')}.`; // Quita puntos finales previos y agrega uno
        }).join("<br>"); // Separar los pasos con <br>
    }

    // Si las instrucciones son un string, se procesan
    return instrucciones.split("\n").map((inst, i) => {
        const paso = inst.trim().replace(/^\d+\.\s*/, ""); // Eliminar numeración manual si existe
        // Asegurarse de que no haya dos puntos finales
        return `${i + 1}. ${paso.replace(/\.*$/, '')}.`; // Quita puntos finales previos y agrega uno
    }).join("<br>"); // Separar los pasos con <br>
}

// Función para actualizar la receta en el sistema
function actualizarReceta(index) {
    const titulo = document.getElementById('titulo').value.trim();
    const ingredientes = document.getElementById('ingredientes').value.trim().split(",").map(ing => ing.trim());
    const instrucciones = document.getElementById('instrucciones').value.trim().split(". ").map(inst => inst.trim());
    const imagen = document.getElementById('imagen').files[0]; 

    const recetas = obtenerRecetas();
    recetas[index] = { titulo, ingredientes, instrucciones, imagen };

    localStorage.setItem('recetas', JSON.stringify(recetas));
    alert('Receta actualizada correctamente');
    filtrarPorCategoria();
}


function obtenerRecetas() {
    const recetasGuardadas = JSON.parse(localStorage.getItem('recetas'));
    if (!recetasGuardadas || recetasGuardadas.length === 0) {
        // Si no hay recetas guardadas o el array está vacío, usar recetas base y guardarlas
        localStorage.setItem('recetas', JSON.stringify(recetasBase));
        return recetasBase;
    }
    return recetasGuardadas;
}
function restablecerRecetas() {
    localStorage.removeItem('recetas');
    filtrarPorCategoria(); // Recargará las recetas desde el array base
}
function guardarRecetas(recetas) {
    localStorage.setItem("recetas", JSON.stringify(recetas)); // Guardar recetas en el localStorage
}
// Función para modificar una receta existente
function modificarReceta(index) {
    // Obtener los valores modificados del formulario
    const titulo = document.getElementById("titulo").value.trim();
    const ingredientes = document.getElementById("ingredientes").value.split(",").map(i => i.trim());
    const instrucciones = document.getElementById("instrucciones").value.split(". ").map(i => i.trim());
    const categoria = document.getElementById("categoria").value;

    if (!titulo || !ingredientes.length || !instrucciones.length || !categoria) {
        alert("Todos los campos deben estar completos.");
        return;
    }

    // Obtener las recetas actuales del localStorage
    const recetas = obtenerRecetas();

    // Modificar la receta seleccionada
    recetas[index] = {
        titulo,
        ingredientes,
        instrucciones,
        categoria,
        imagen: recetas[index].imagen  // Mantener la imagen si no se cambia
    };

    // Actualizar localStorage
    localStorage.setItem("recetas", JSON.stringify(recetas));

    // Restablecer el formulario y el botón de guardar
    document.getElementById("formulario-receta").reset();
    document.getElementById("formulario-receta").style.display = "none";
    document.getElementById("btn-guardar").textContent = "Agregar Receta";
    document.getElementById("btn-guardar").onclick = manejarFormularioReceta;

    // Volver a filtrar para mostrar las recetas actualizadas
    filtrarPorCategoria();

    alert("Receta modificada con éxito");
}

// Función para cancelar la edición
function cancelarEdicion() {
    recetaEnEdicion = null;
    document.getElementById("form-receta").reset();
    document.getElementById("btn-guardar").textContent = "Agregar receta";
}

// Agrega un botón de cancelar y su evento de clic
const cancelarButton = document.getElementById("btn-cancelar");
if (cancelarButton) {
    cancelarButton.addEventListener("click", cancelarEdicion);
}

function obtenerRecetaPorIndice(index) {
    const recetas = obtenerRecetas();
    return recetas[index];
}