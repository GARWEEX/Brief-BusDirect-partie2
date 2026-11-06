import { initialiser, sauvegarder } from "./store.js";
import { afficherCabine } from "./render.js";
import { estComplet, premierSiegeLibre } from "./reservations.js";
import { validerNom, validerTelephone } from "./validators.js";

let trips = [];
let trip;

const id = Number(new URLSearchParams(location.search).get("id"));
const tripInfo = document.getElementById("tripInfo");

function afficherMessage(idElement, texte, erreur = false) {
    const element = document.getElementById(idElement);

    if (!element) return;

    element.textContent = texte;
    element.className = "text-sm mt-2 " +
        (erreur ? "text-red-600" : "text-green-700");

    setTimeout(() => {
        element.textContent = "";
    }, 3000);
}

function actualiserSiege() {
    afficherCabine(trip);
}

function enregistrer() {
    sauvegarder(trips);
    actualiserSiege();
}

function validerPassager(nomId, telephoneId, erreurNomId, erreurTelephoneId,
    reservations, attente, indexIgnore = -1) {

    const nom = document.getElementById(nomId).value.trim();
    const telephone = document.getElementById(telephoneId).value.trim();

    const erreurNom = validerNom(
        nom, reservations, attente, indexIgnore
    );

    const erreurTelephone = validerTelephone(
        telephone, reservations, attente, indexIgnore
    );

    document.getElementById(erreurNomId).textContent = erreurNom;
    document.getElementById(erreurTelephoneId).textContent = erreurTelephone;

    return {
        name: nom,
        phone: telephone,
        erreur: erreurNom || erreurTelephone
    };
}

function reserverPassager(event) {
    event.preventDefault();

    if (estComplet(trip)) {
        afficherMessage(
            "reserveMessage",
            "Le trajet est complet. Utilisez la liste d'attente.",
            true
        );
        return;
    }

    const passager = validerPassager(
        "reserveName",
        "reservePhone",
        "reserveNameError",
        "reservePhoneError",
        trip.reservations,
        trip.waitingList
    );

    if (passager.erreur) return;

    const choix = document.getElementById("reserveSeat").value;
    let siege = choix === "" ? premierSiegeLibre(trip) : Number(choix);

    if (!siege && choix === "") {
        afficherMessage(
            "reserveMessage",
            "Aucun siège normal libre. Choisissez un siège VIP dans la liste.",
            true
        );
        return;
    }

    if (!Number.isInteger(siege) || siege < 1 || siege > trip.capacity) {
        afficherMessage("reserveMessage", "Choisissez un siège valide.", true);
        return;
    }

    const siegeOccupe = trip.reservations.some(reservation => {
        return Number(reservation.seat) === siege;
    });

    if (siegeOccupe) {
        afficherMessage("reserveMessage", "Ce siège est déjà occupé.", true);
        return;
    }

    trip.reservations.push({
        name: passager.name,
        phone: passager.phone,
        seat: siege
    });

    enregistrer();
    document.getElementById("reserveForm").reset();
    afficherMessage("reserveMessage", "Réservation confirmée.");
}

function chargerPassager(event) {
    const index = event.target.value;

    if (index === "") {
        document.getElementById("editName").value = "";
        document.getElementById("editPhone").value = "";
        actualiserSiege();
        return;
    }

    const passager = trip.reservations[Number(index)];

    if (!passager) return;

    actualiserSiege();
    document.getElementById("editName").value = passager.name;
    document.getElementById("editPhone").value = passager.phone;
    document.getElementById("editSeat").value = String(passager.seat);
}

function modifierPassager(event) {
    event.preventDefault();

    const index = document.getElementById("editPassenger").value;

    if (index === "" || !trip.reservations[Number(index)]) {
        afficherMessage("editMessage", "Choisissez une réservation.", true);
        return;
    }

    const numero = Number(index);
    const passager = validerPassager(
        "editName",
        "editPhone",
        "editNameError",
        "editPhoneError",
        trip.reservations,
        trip.waitingList,
        numero
    );

    if (passager.erreur) return;

    const ancienneReservation = trip.reservations[numero];
    const valeurSiege = document.getElementById("editSeat").value;
    const siege = valeurSiege === ""
        ? Number(ancienneReservation.seat)
        : Number(valeurSiege);

    if (!Number.isInteger(siege) || siege < 1 || siege > trip.capacity) {
        afficherMessage("editMessage", "Choisissez un siège valide.", true);
        return;
    }

    const siegeOccupe = trip.reservations.some((reservation, i) => {
        return i !== numero && Number(reservation.seat) === siege;
    });

    if (siegeOccupe) {
        afficherMessage("editMessage", "Ce siège est déjà occupé.", true);
        return;
    }

    ancienneReservation.name = passager.name;
    ancienneReservation.phone = passager.phone;
    ancienneReservation.seat = siege;

    enregistrer();
    afficherMessage("editMessage", "Réservation modifiée.");
}

function annulerPassager(event) {
    event.preventDefault();

    const index = document.getElementById("cancelPassenger").value;

    if (index === "" || !trip.reservations[Number(index)]) {
        afficherMessage("cancelMessage", "Choisissez une réservation.", true);
        return;
    }

    const numero = Number(index);
    const siege = Number(trip.reservations[numero].seat);

    trip.reservations.splice(numero, 1);

    let texte = "Réservation annulée.";

    if (trip.waitingList.length > 0) {
        const passager = trip.waitingList.shift();

        trip.reservations.push({
            name: passager.name,
            phone: passager.phone,
            seat: siege
        });

        texte = `${passager.name} a obtenu le siège ${siege}.`;
    }

    document.getElementById("cancelForm").reset();
    document.getElementById("editForm").reset();
    enregistrer();
    afficherMessage("cancelMessage", texte);
}

function ajouterListeAttente(event) {
    event.preventDefault();

    if (!estComplet(trip)) {
        afficherMessage(
            "waitMessage",
            "Il reste des places. Réservez directement.",
            true
        );
        return;
    }

    const passager = validerPassager(
        "waitName",
        "waitPhone",
        "waitNameError",
        "waitPhoneError",
        trip.reservations,
        trip.waitingList
    );

    if (passager.erreur) return;

    trip.waitingList.push({
        name: passager.name,
        phone: passager.phone
    });

    enregistrer();
    document.getElementById("waitForm").reset();
    afficherMessage("waitMessage", "Ajouté à la liste d'attente.");
}

function retirerPassagerAttente(event) {
    const bouton = event.target.closest("[data-index]");

    if (!bouton) return;

    const index = Number(bouton.dataset.index);

    if (!Number.isInteger(index) || index < 0 || index >= trip.waitingList.length) {
        return;
    }

    trip.waitingList.splice(index, 1);
    enregistrer();
    afficherMessage("waitMessage", "Passager retiré de la liste d'attente.");
}

async function afficherTout() {
    try {
        trips = await initialiser();
        trip = trips.find(trip => Number(trip.id) === id);

        if (!trip) {
            tripInfo.textContent = "Trajet introuvable.";
            document.getElementById("planBus").innerHTML = "";
            document.querySelector("main > .grid")?.classList.add("hidden");
            return;
        }

        actualiserSiege();

        document.getElementById("reserveForm")
            .addEventListener("submit", reserverPassager);

        document.getElementById("editPassenger")
            .addEventListener("change", chargerPassager);

        document.getElementById("editForm")
            .addEventListener("submit", modifierPassager);

        document.getElementById("cancelForm")
            .addEventListener("submit", annulerPassager);

        document.getElementById("waitForm")
            .addEventListener("submit", ajouterListeAttente);

        document.getElementById("waitingList")
            .addEventListener("click", retirerPassagerAttente);
    } catch (erreur) {
        tripInfo.textContent =
            "Erreur de chargement. Ouvrez le projet avec Live Server.";
        console.error(erreur);
    }
}

afficherTout();
