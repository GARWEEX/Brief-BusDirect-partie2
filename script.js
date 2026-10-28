
const sieges = document.querySelectorAll(".sieg");

const buyName = document.getElementById("buyName");
const buySeat = document.getElementById("buySeat");
const buyBtn = document.getElementById("buyBtn");

const modName = document.getElementById("modName");
const modSeat = document.getElementById("modSeat");
const newSeat = document.getElementById("newSeat");
const modBtn = document.getElementById("modBtn");

const delSeat = document.getElementById("delSeat");
const delBtn = document.getElementById("delBtn");
const totalPrice = document.getElementById("totalPrice");

let reservations = JSON.parse(localStorage.getItem("reservations")) || [];
let draggedSeat = "";



function displayReservations() {
    for (let i = 0; i < sieges.length; i++) {
        let num = sieges[i].dataset.seat;

        sieges[i].classList.remove("occupe");
        sieges[i].style.backgroundColor = "";
        sieges[i].style.color = "";
        sieges[i].textContent = num;
        sieges[i].draggable = false;
    }

    for (let i = 0; i < reservations.length; i++) {
        for (let j = 0; j < sieges.length; j++) {
            if (String(sieges[j].dataset.seat) === String(reservations[i].seat)) {
                sieges[j].classList.add("occupe");
                sieges[j].style.backgroundColor = "red";
                sieges[j].style.color = "white";
                sieges[j].draggable = true;
                sieges[j].textContent = "";

                let numero = document.createElement("div");
                numero.textContent = reservations[i].seat;

                let nom = document.createElement("span");
                nom.classList.add("passager", "text-xs", "font-normal");
                nom.textContent = reservations[i].name;

                sieges[j].appendChild(numero);
                sieges[j].appendChild(nom);
            }
        }
    }

    modSeat.innerHTML = '<option value="">Choisir le siège à modifier</option>';
    newSeat.innerHTML = '<option value="">Choisir le nouveau siège</option>';
    delSeat.innerHTML = '<option value="">Choisir votre siège</option>';

    for (let i = 1; i <= 20; i++) {
        let seatReserved = false;

        for (let j = 0; j < reservations.length; j++) {
            if (String(reservations[j].seat) === String(i)) {
                seatReserved = true;
            }
        }

        if (!seatReserved) {
            let option = document.createElement("option");
            option.value = i;
            option.textContent = i;
            newSeat.appendChild(option);
        }
    }

    for (let i = 0; i < reservations.length; i++) {
        let texte = "Siège " + reservations[i].seat +
            " (" + reservations[i].name + ")";

        let option1 = document.createElement("option");
        option1.value = reservations[i].seat;
        option1.textContent = texte;
        modSeat.appendChild(option1);

        let option2 = document.createElement("option");
        option2.value = reservations[i].seat;
        option2.textContent = texte;
        delSeat.appendChild(option2);
    }

    if (totalPrice !== null) {
        totalPrice.textContent = reservations.length * 80;
    }

    localStorage.setItem("reservations", JSON.stringify(reservations));
}

buyBtn.addEventListener("click",function(){
    let nom = buyName.value.trim();
    let numSiege = buySeat.value;
    let seatReserved = false;
     if (nom === "") {
        alert("vous dever entrer un nom")
        return;
    }
    for (let i=0;i < reservations.length; i++) {
        if (reservations[i].name.toLowerCase() === nom.toLowerCase()) {
        alert("vous aver deja une reservation")
        return;
    }
   
    if (numSiege ==="") {
    alert("vous dever chisir une siege")

    }
    }

    for (let i = 0; i < reservations.length; i++) {
        if (String(reservations[i].seat) === String(numSiege)) {
            seatReserved = true;
            break;
        }
    }

    if (seatReserved) {
        alert("Ce siège est déjà réservé !");
        return;
    }

    reservations.push({
        name: nom,
        seat: numSiege
    });

    displayReservations();

    buyName.value = "";
});

modBtn.addEventListener("click", function () {
    let ancienSiege = modSeat.value;
    let nom = modName.value.trim();
    let siegeChoisi = newSeat.value;
    let index = -1;

    if (ancienSiege === "") {
        alert("Veuillez choisir une réservation à modifier !");
        return;
    }

    if (nom === "" && siegeChoisi === "") {
        alert("Veuillez entrer un nouveau nom ou choisir un nouveau siège !");
        return;
    }

    for (let i = 0; i < reservations.length; i++) {
        if (String(reservations[i].seat) === String(ancienSiege)) {
            index = i;
            break;
        }
    }

    if (index === -1) {
        alert("Réservation introuvable !");
        return;
    }

    if (siegeChoisi !== "" && String(siegeChoisi) !== String(ancienSiege)) {
        let seatReserved = false;

        for (let i = 0; i < reservations.length; i++) {
            if (String(reservations[i].seat) === String(siegeChoisi)) {
                seatReserved = true;
                break;
            }
        }

        if (seatReserved) {
            alert("Ce siège est déjà réservé !");
            return;
        }

        reservations[index].seat = siegeChoisi;
    }

    if (nom !== "") {
        reservations[index].name = nom;
    }

    displayReservations();

    modName.value = "";
    modSeat.value = "";
    newSeat.value = "";

    alert("Réservation modifiée avec succès !");
});

delBtn.addEventListener("click", function () {
    let numSiege = delSeat.value;

    if (numSiege === "") {
        alert("Veuillez choisir un siège !");
        return;
    }

    for (let i = 0; i < reservations.length; i++) {
        if (String(reservations[i].seat) === String(numSiege)) {
            reservations.splice(i, 1);
            displayReservations();
            alert("Réservation supprimée avec succès !");
            return;
        }
    }

    alert("Réservation introuvable !");
});

for (let i = 0; i < sieges.length; i++) {
    sieges[i].addEventListener("dragstart", function (event) {
        if (sieges[i].classList.contains("occupe")) {
            draggedSeat = sieges[i].dataset.seat;
            event.dataTransfer.setData("text/plain", draggedSeat);
        } else {
            event.preventDefault();
        }
    });

    sieges[i].addEventListener("dragover", function (event) {
        event.preventDefault();
    });

    sieges[i].addEventListener("drop", function (event) {
        event.preventDefault();

        let ancienSiege = event.dataTransfer.getData("text/plain");
        let nouveauSiege = sieges[i].dataset.seat;
        let seatReserved = false;

        if (ancienSiege === "" || ancienSiege === nouveauSiege) {
            return;
        }

        for (let j = 0; j < reservations.length; j++) {
            if (String(reservations[j].seat) === String(nouveauSiege)) {
                seatReserved = true;
                break;
            }
        }

        if (seatReserved) {
            alert("Ce siège est déjà réservé !");
            return;
        }

        for (let j = 0; j < reservations.length; j++) {
            if (String(reservations[j].seat) === String(ancienSiege)) {
                reservations[j].seat = nouveauSiege;
                break;
            }
        }

        displayReservations();

        draggedSeat = "";

       
    });

    sieges[i].addEventListener("dragend", function () {
        draggedSeat = "";
    });
}

displayReservations();