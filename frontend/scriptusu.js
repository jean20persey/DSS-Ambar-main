function guardar(event) {
  event.preventDefault(); // evita recargar el formulario

  const dni = document.getElementById("dni").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const apellidos = document.getElementById("apellidos").value.trim();
  const email = document.getElementById("correo").value.trim();

  // Verificamos que todos los campos tengan valores válidos
  if (!dni || !nombre || !apellidos || !email) {
    alert("Por favor completa todos los campos.");
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    dni,
    nombre,
    apellidos,
    email
  });

  console.log("Datos a enviar:", raw); // ayuda para depurar

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  fetch("https://ambar-main.netlify.app/.netlify/functions/usuarios", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log("Respuesta del servidor:", result);
      alert("Usuario registrado con éxito.");
    })
    .catch((error) => {
      console.error("Error al registrar usuario:", error);
      alert("Ocurrió un error al registrar el usuario.");
    });
}


function cargar(resultado) {
  let transformado = JSON.parse(resultado);
  let salida = "";

  for (const [clave, valor] of Object.entries(transformado)) {
    salida = `Clave=${clave} Valor=${valor}<br>` + salida;
  }

  document.getElementById("rta").innerHTML = salida;
}


function listar(event) {
  event.preventDefault();

  const ndoc = document.getElementById("numdoc").value.trim();

  if (!ndoc) {
    alert("Por favor ingresa un número de documento.");
    return;
  }

  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  fetch(`https://ambar-main.netlify.app/.netlify/functions/usuarios?iden=${ndoc}`, requestOptions)
    .then((response) => response.text())
    .then((result) => cargar(result))
    .catch((error) => {
      console.error("Error al consultar usuario:", error);
      alert("Ocurrió un error al consultar el usuario.");
    });
}
