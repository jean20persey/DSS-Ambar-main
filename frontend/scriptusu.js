function guardar(event){
    event.preventDefault();
    
    // Obtener los valores de los campos
    const dni = document.getElementById("dni").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const email = document.getElementById("correo").value.trim();

    // Validar que los campos no estén vacíos
    if (!dni || !nombre || !apellidos || !email) {
        alert('Por favor, complete todos los campos');
        return;
    }

    // Validar el formato del DNI (solo números)
    if (!/^\d+$/.test(dni)) {
        alert('El DNI debe contener solo números');
        return;
    }

    // Validar el formato del email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Por favor, ingrese un email válido');
        return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        dni: dni,
        nombre: nombre,
        apellidos: apellidos,
        email: email
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("https://dss-ambar-main.netlify.app/.netlify/functions/usuarios", requestOptions)
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.error || 'Error al crear usuario');
                });
            }
            return response.json();
        })
        .then(result => {
            console.log(result);
            alert('Usuario creado exitosamente');
            // Limpiar el formulario
            document.getElementById("adicionarEstudiante").reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        });
}

function cargar(resultado){
    try {
        let transformado = JSON.parse(resultado);
        var salida = "";

        if (!transformado || Object.keys(transformado).length === 0) {
            document.getElementById("rta").innerHTML = 'No se encontraron datos para este usuario';
            return;
        }

        for (const [clave, valor] of Object.entries(transformado)) {
            if (valor !== null && valor !== undefined) {
                salida = `${clave}: ${valor}<br>${salida}`;
            }
        }
        document.getElementById("rta").innerHTML = salida;
    } catch (error) {
        console.error('Error al procesar los datos:', error);
        document.getElementById("rta").innerHTML = 'Error al procesar los datos';
    }
}

function listar(event){
    event.preventDefault();
    
    const ndoc = document.getElementById("numdoc").value.trim();
    
    if (!ndoc) {
        alert('Por favor, ingrese un número de documento');
        return;
    }

    const requestOptions = {
        method: "GET",
        headers: {
            'Accept': 'application/json'
        }
    };

    // Mostrar mensaje de carga
    document.getElementById("rta").innerHTML = 'Buscando usuario...';

    fetch(`https://dss-ambar-main.netlify.app/.netlify/functions/usuarios/${ndoc}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Usuario no encontrado');
                }
                throw new Error('Error al buscar usuario');
            }
            return response.json();
        })
        .then(result => {
            if (!result) {
                document.getElementById("rta").innerHTML = 'No se encontró el usuario';
                return;
            }
            let salida = '';
            for (const [clave, valor] of Object.entries(result)) {
                if (valor !== null && valor !== undefined) {
                    salida += `<strong>${clave}:</strong> ${valor}<br>`;
                }
            }
            document.getElementById("rta").innerHTML = salida || 'No hay datos disponibles';
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("rta").innerHTML = 'Error: ' + error.message;
        });
}