import {
    placesLibres,
    estComplet,
    recette,
    estVIP,
    prixSiege
} from "./reservations.js";

export function afficherStatistiques(trips) {
    const totalPassagers = trips.reduce((total, trip) => {
        return total + trip.reservations.length;
    }, 0);

    const recetteTotale = trips.reduce((total, trip) => {
        return total + recette(trip);
    }, 0);

    const totalTrajets = document.getElementById("totalTrips");
    const totalReservations = document.getElementById("totalPassengers");
    const totalRecette = document.getElementById("totalRevenue");

    if (totalTrajets) totalTrajets.textContent = trips.length;
    if (totalReservations) totalReservations.textContent = totalPassagers;
    if (totalRecette) totalRecette.textContent = `${recetteTotale} DH`;
}

export function renderTrajets(trajetsPage, tousLesTrajets = trajetsPage) {
    const liste = document.getElementById("listeTrajets");

    liste.innerHTML = trajetsPage.map(carteTrajet).join("");
    afficherStatistiques(tousLesTrajets);
}

function carteTrajet(trip) {
    const {
        id,
        departure,
        destination,
        departureTime,
        arrivalTime,
        price,
        waitingList
    } = trip;

    const complet = estComplet(trip);
    const libres = placesLibres(trip);

    return `
        <article class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div class="flex justify-between gap-2 items-start">
                <h3 class="text-lg font-bold text-gray-800">
                    ${echapper(departure)} → ${echapper(destination)}
                </h3>
                <span class="text-sm rounded px-2 py-1 ${complet ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
        }">
                    ${complet ? "Complet" : "Disponible"}
                </span>
            </div>

            <p class="text-gray-600 mt-2">
                ${echapper(departureTime)} - ${echapper(arrivalTime)}
            </p>
            <p class="mt-2">Prix : <strong>${price} DH</strong></p>
            <p>Places libres : ${libres} / ${trip.capacity}</p>
            <p>En attente : ${waitingList.length}</p>

            <button
                type="button"
                data-id="${echapper(id)}"
                class="ouvrir inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2"
            >
                Ouvrir la cabine
            </button>
        </article>
    `;
}

export function renderPagination(page, total) {
    const pagination = document.getElementById("pagination");

    if (!pagination) return;

    let boutons = "";

    if (page > 1) {
        boutons += `
            <button type="button" data-page="${page - 1}"
                class="px-4 py-2 rounded bg-blue-100 text-blue-800 hover:bg-blue-200">
                Précédent
            </button>
        `;
    }

    for (let i = 1; i <= total; i++) {
        boutons += `
            <button type="button" data-page="${i}" ${page === i ? "disabled" : ""}
                aria-current="${page === i ? "page" : "false"}"
                class="px-4 py-2 rounded ${page === i
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"}">
                ${i}
            </button>
        `;
    }

    if (page < total) {
        boutons += `
            <button type="button" data-page="${page + 1}"
                class="px-4 py-2 rounded bg-blue-100 text-blue-800 hover:bg-blue-200">
                Suivant
            </button>
        `;
    }

    pagination.innerHTML = boutons;
}

export function afficherCabine(trip) {
    afficherInformationsTrajet(trip);
    afficherPlanBus(trip);
    afficherReservations(trip);
    remplirSieges(trip);
    afficherAttente(trip);
}

function afficherInformationsTrajet(trip) {
    const {
        departure,
        destination,
        departureTime,
        arrivalTime,
        price,
        capacity
    } = trip;

    document.getElementById("tripInfo").innerHTML = `
        <h2 class="text-xl font-bold">
            ${echapper(departure)} → ${echapper(destination)}
        </h2>
        <p class="mt-2">
            ${echapper(departureTime)} - ${echapper(arrivalTime)}
            | Prix de base : ${price} DH
        </p>
        <p>
            Places libres : ${placesLibres(trip)} / ${capacity}
            | Recette : ${recette(trip)} DH
        </p>
    `;
}

function afficherPlanBus(trip) {
    const plan = document.getElementById("planBus");
    plan.innerHTML = "";
    plan.style.gridTemplateColumns =
        "repeat(2, minmax(0, 1fr)) minmax(0, 0.45fr) repeat(2, minmax(0, 1fr))";

    for (let i = 1; i <= trip.capacity; i++) {
        const reservation = trip.reservations.find(reservation => {
            return Number(reservation.seat) === i;
        });

        const siege = document.createElement("div");
        siege.className = "min-h-16 rounded border p-2 text-sm text-center " +
            (reservation
                ? "bg-red-500 text-white border-red-600"
                : estVIP(i)
                    ? "bg-yellow-200 text-gray-900 border-yellow-400"
                    : "bg-blue-100 text-blue-900 border-blue-300");

        siege.setAttribute("role", "group");
        siege.setAttribute("aria-label", `Siège ${String(i).padStart(2, "0")}, ${reservation
                ? "occupé par " + reservation.name
                : estVIP(i) ? "VIP libre" : "libre"
            }`);

        siege.innerHTML = `
            <strong>${String(i).padStart(2, "0")}</strong>
            ${reservation
                ? `<span class="block text-xs">${echapper(reservation.name)}</span>
                   <span class="block text-xs">Occupé</span>`
                : estVIP(i)
                    ? '<span class="block text-xs">VIP · Libre</span>'
                    : '<span class="block text-xs">Libre</span>'}
        `;

        plan.appendChild(siege);

        if (i % 4 === 2 && i + 2 <= trip.capacity) {
            const allee = document.createElement("div");
            allee.className = "flex items-center justify-center text-xs text-gray-500";
            allee.textContent = "Allée";
            allee.setAttribute("aria-hidden", "true");
            plan.appendChild(allee);
        }
    }
}

function afficherReservations(trip) {
    const listes = ["editPassenger", "cancelPassenger"];

    listes.forEach(id => {
        const select = document.getElementById(id);
        const ancienneValeur = select.value;

        select.innerHTML = '<option value="">Choisir un passager</option>';

        trip.reservations.forEach((reservation, index) => {
            const option = new Option(
                `${reservation.name} - Siège ${String(reservation.seat).padStart(2, "0")}`,
                String(index)
            );
            select.add(option);
        });

        if (ancienneValeur !== "" && trip.reservations[Number(ancienneValeur)]) {
            select.value = ancienneValeur;
        }
    });
}

function remplirSieges(trip) {
    const reserve = document.getElementById("reserveSeat");
    const edit = document.getElementById("editSeat");
    const indexPassager = document.getElementById("editPassenger").value;

    const reservationActuelle = indexPassager === ""
        ? null
        : trip.reservations[Number(indexPassager)];

    reserve.innerHTML = '<option value="">Premier siège libre non VIP</option>';
    edit.innerHTML = '<option value="">Choisir un siège</option>';

    for (let i = 1; i <= trip.capacity; i++) {
        const reservation = trip.reservations.find(reservation => {
            return Number(reservation.seat) === i;
        });

        if (!reservation) {
            reserve.add(new Option(
                `Siège ${String(i).padStart(2, "0")}${estVIP(i) ? " - VIP" : ""} (${prixSiege(trip.price, i)} DH)`,
                String(i)
            ));
        }

        const optionEdit = new Option(
            `Siège ${String(i).padStart(2, "0")}${estVIP(i) ? " - VIP" : ""}${reservation ? " - Occupé par " + reservation.name : ""
            }`,
            String(i)
        );

        if (reservation && (!reservationActuelle ||
            Number(reservation.seat) !== Number(reservationActuelle.seat))) {
            optionEdit.disabled = true;
        }

        edit.add(optionEdit);
    }

    if (reservationActuelle) {
        edit.value = String(reservationActuelle.seat);
    }
}

function afficherAttente(trip) {
    const liste = document.getElementById("waitingList");
    liste.innerHTML = "";

    trip.waitingList.forEach((passager, index) => {
        const li = document.createElement("li");
        li.className = "flex items-center justify-between gap-2";

        const texte = document.createElement("span");
        texte.textContent = `Position ${index + 1} : ${passager.name} (${passager.phone})`;

        const bouton = document.createElement("button");
        bouton.type = "button";
        bouton.dataset.index = index;
        bouton.className = "text-red-600 underline shrink-0";
        bouton.textContent = "Retirer";

        li.append(texte, bouton);
        liste.appendChild(li);
    });

    const complet = estComplet(trip);
    const formulaireReservation = document.getElementById("reserveForm");
    const formulaireAttente = document.getElementById("waitForm");

    formulaireReservation.querySelectorAll("input, select, button").forEach(element => {
        element.disabled = complet;
    });

    formulaireAttente.querySelectorAll("input, select, button").forEach(element => {
        element.disabled = !complet;
    });

    formulaireReservation.classList.toggle("opacity-60", complet);
    formulaireAttente.classList.toggle("opacity-60", !complet);

    document.getElementById("seatMessage").textContent = complet
        ? "Trajet complet : les nouvelles demandes passent par la liste d'attente."
        : "Choisissez un siège libre ou laissez le choix vide pour attribuer le premier siège libre non VIP.";
}

function echapper(texte) {
    return String(texte).replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);
}
