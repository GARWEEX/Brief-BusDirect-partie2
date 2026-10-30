const submitButton = document.getElementById("submit-button") || document.getElementById("buyBtn");
const modifyButton = document.getElementById("modify-button") || document.getElementById("modBtn");
const deleteButton = document.getElementById("delete-button") || document.getElementById("delBtn");
const nameInput = document.getElementById("reservation-name") || document.getElementById("buyName");
const seatNumber = document.getElementById("seat-number") || document.getElementById("buySeat");
const modifySeat = document.getElementById("modify-seat") || document.getElementById("modSeat");
const deleteSeat = document.getElementById("delete-seat") || document.getElementById("delSeat");
const newName = document.getElementById("new-name") || document.getElementById("modName");
const newSeat = document.getElementById("new-seat") || document.getElementById("newSeat");

let reservations = JSON.parse(localStorage.getItem("reservations")) || [];

function displayReservations() {
  localStorage.setItem("reservations", JSON.stringify(reservations));
  const ticketsTotal = document.getElementById("tickets-total") || document.getElementById("totalPrice");
  if (ticketsTotal) ticketsTotal.textContent = reservations.length * 80;

  for (let i = 1; i <= 20; i++) {
    const seat = document.getElementById("seat-" + i) || document.querySelector(`[data-seat="${i}"]`);

    if (seat) {
      seat.textContent = i;
      seat.style.backgroundColor = "";
      seat.style.color = "";
      seat.classList.remove("bg-red-500", "text-white");
    }
  }

  for (let i = 0; i < reservations.length; i++) {
    const seatNum = reservations[i].seat;
    const seat = document.getElementById("seat-" + seatNum) || document.querySelector(`[data-seat="${seatNum}"]`);

    if (seat) {
      seat.textContent = seatNum + " - " + reservations[i].name;
      seat.style.backgroundColor = "#c60000";
      seat.style.color = "#ffffff";
    }
  }

  if (modifySeat) modifySeat.innerHTML = '<option value="">Choisir votre prénom</option>';
  if (deleteSeat) deleteSeat.innerHTML = '<option value="">Choisir une réservation</option>';

  for (let i = 0; i < reservations.length; i++) {
    if (modifySeat) {
      const option1 = document.createElement("option");
      option1.value = reservations[i].seat;
      option1.textContent = reservations[i].name + " - Siège " + reservations[i].seat;
      modifySeat.appendChild(option1);
    }

    if (deleteSeat) {
      const option2 = document.createElement("option");
      option2.value = reservations[i].seat;
      option2.textContent = reservations[i].name + " - Siège " + reservations[i].seat;
      deleteSeat.appendChild(option2);
    }
  }

  localStorage.setItem("reservations", JSON.stringify(reservations));
}

if (submitButton) {
  submitButton.addEventListener("click", function () {
    const name = nameInput ? nameInput.value.trim() : "";
    const seat = seatNumber ? seatNumber.value : "";

    if (name === "") {
      alert("Veuillez saisir votre prénom.");
      return;
    }

    let nameExists = false;
    reservations.forEach((reservation) => {
      if (reservation.name.toLowerCase() === name.toLowerCase()) {
        nameExists = true;
      }
    });

    if (nameExists) {
      alert("Vous avez déjà une réservation avec ce prénom.");
      return;
    }

    let seatReserved = false;

    for (let i = 0; i < reservations.length; i++) {
      if (Number(reservations[i].seat) === Number(seat)) {
        seatReserved = true;
        break;
      }
    }

    if (seatReserved) {
      alert("Ce siège est déjà réservé.");
      return;
    }

    reservations.push({ name: name, seat: Number(seat) });

    displayReservations();

    if (nameInput) nameInput.value = "";

    alert("Réservation ajoutée avec succès.");
  });
}

if (modifyButton) {
  modifyButton.addEventListener("click", function () {
    const seat = modifySeat ? modifySeat.value : "";
    const name = newName ? newName.value.trim() : "";
    const seatChange = newSeat ? newSeat.value : "";

    if (seat === "") {
      alert("Veuillez choisir une réservation.");
      return;
    }

    if (name === "") {
      alert("Veuillez saisir le nouveau prénom.");
      return;
    }

    let seatReserved = false;

    for (let i = 0; i < reservations.length; i++) {
      if (
        Number(reservations[i].seat) === Number(seatChange) &&
        Number(reservations[i].seat) !== Number(seat)
      ) {
        seatReserved = true;
        break;
      }
    }

    if (seatReserved) {
      alert("Ce siège est déjà réservé.");
      return;
    }

    for (let i = 0; i < reservations.length; i++) {
      if (Number(reservations[i].seat) === Number(seat)) {
        reservations[i].name = name;
        if (seatChange) reservations[i].seat = Number(seatChange);
        break;
      }
    }

    displayReservations();

    if (newName) newName.value = "";

    alert("Réservation modifiée avec succès.");
  });
}

if (deleteButton) {
  deleteButton.addEventListener("click", function () {
    const seat = deleteSeat ? deleteSeat.value : "";

    if (seat === "") {
      alert("Veuillez choisir une réservation.");
      return;
    }

    for (let i = 0; i < reservations.length; i++) {
      if (Number(reservations[i].seat) === Number(seat)) {
        reservations.splice(i, 1);
        break;
      }
    }

    displayReservations();

    alert("Réservation supprimée avec succès.");
  });
}

displayReservations();
