function guardar(){
 
    let apellidos='';
    let datoingresado = document.getElementById("correo").value;
 
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    event.preventDefault();
 
    let raw = JSON.stringify({
      "dni": document.getElementById("dni").value,
      "nombre": document.getElementById("nombre").value,
      "apellidos": document.getElementById("apellidos").value,
      "email": document.getElementById("correo").value
    });
 
    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
 
    fetch("https://dss-ambar-main.netlify.app/.netlify/functions/usuarios", requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(result => {
        console.log(result);
        alert('Usuario creado exitosamente');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error al crear usuario: ' + error.message);
      });
}
 
function cargar(resultado){
    let transformado = JSON.parse(resultado);
    var salida="";
    var elemento="";
 
    for (const [clave, valor] of Object.entries(transformado)) {
        salida = "Clave=" + clave +  " Valor=" + valor + "<br>" + salida;
    }
    document.getElementById("rta").innerHTML = salida;
}
 
function listar(){
    event.preventDefault();
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    let ndoc = document.getElementById("numdoc").value;
    fetch("https://dss-ambar-main.netlify.app/.netlify/functions/usuarios/" + ndoc, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Usuario no encontrado');
        }
        return response.text();
      })
      .then((result) => cargar(result))
      .catch((error) => {
        console.error('Error:', error);
        document.getElementById("rta").innerHTML = 'Error: ' + error.message;
      });
}