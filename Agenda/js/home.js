var selectedRow = null;

function showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;

    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const main = document.querySelector(".main");
    container.insertBefore(div, main);
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
}

function clearFields() {
    document.querySelector("#NameContacto").value = "";
    document.querySelector("#ApellidoContacto").value = "";
    document.querySelector("#NumeroContacto").value = "";
}

async function loadContacts() {
    try {
        const response = await fetch('http://www.raydelto.org/agenda.php');
        if (!response.ok) {
            throw new Error('No se pudo cargar la lista de contactos.');
        }
        const contacts = await response.json();
        const list = document.querySelector("#lista-contactos");
        list.innerHTML = "";
        contacts.forEach(contact => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${contact.nombre}</td>
                <td>${contact.apellido}</td>
                <td>${contact.telefono}</td>
            `;
            list.appendChild(row);
        });
    } catch (error) {
        showAlert(error.message, "danger");
    }
}


document.querySelector("#contacto-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const Nombre = document.querySelector("#NameContacto").value;
    const Apellido = document.querySelector("#ApellidoContacto").value;
    const Telefono = document.querySelector("#NumeroContacto").value;

    if (Nombre === "" || Apellido === "" || Telefono === "") {
        showAlert("Rellene todos los campos", "danger");
        return; 
    }
    else {
        try {
            const response = await fetch('http://www.raydelto.org/agenda.php', {
                method: 'POST',
                body: JSON.stringify({ nombre: Nombre, apellido: Apellido, telefono: Telefono })
            });
            
            console.log("Response status:", response.status);
            console.log("Response headers:", response.headers);

            const responseText = await response.text();
            console.log("Response text:", responseText);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = JSON.parse(responseText);
            console.log("Parsed response:", responseData);

            showAlert("Contacto agregado", "success");
            clearFields();
            loadContacts();
        } catch (error) {
            console.error("Error details:", error);
            showAlert(`Error al agregar contacto: ${error.message}`, "danger");
        }
    }
});

document.addEventListener("DOMContentLoaded", loadContacts);