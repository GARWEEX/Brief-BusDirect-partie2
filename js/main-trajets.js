import { initialiser } from "./store.js";
import { renderPagination, renderTrajets } from "./render.js";
import { estComplet } from "./reservations.js";

let trips = [];
let resultats = [];
let pageActuelle = 1;
const limite = 6;

const recherche = document.getElementById("searchTrip");
const filtre = document.getElementById("statusFilter");
const listeTrajets = document.getElementById("listeTrajets");
const pagination = document.getElementById("pagination");
const resultCount = document.getElementById("resultCount");
const pageMessage = document.getElementById("pageMessage");

function filtrerTrajets() {
    const texte = recherche.value.trim().toLowerCase();
    const statut = filtre.value;

    resultats = trips.filter(trip => {
        const depart = trip.departure.toLowerCase();
        const destination = trip.destination.toLowerCase();
        const correspondTexte =
            depart.includes(texte) || destination.includes(texte);

        const correspondStatut =
            statut === "all" ||
            (statut === "available" && !estComplet(trip)) ||
            (statut === "full" && estComplet(trip));

        return correspondTexte && correspondStatut;
    });

    pageActuelle = 1;
    afficherPage();
}

function afficherPage() {
    const nombrePages = Math.max(1, Math.ceil(resultats.length / limite));

    if (pageActuelle > nombrePages) {
        pageActuelle = nombrePages;
    }

    const debut = (pageActuelle - 1) * limite;
    const trajetsPage = resultats.slice(debut, debut + limite);

    renderTrajets(trajetsPage, trips);

    if (resultats.length === 0) {
        listeTrajets.innerHTML =
            '<p class="text-center w-full">Aucun trajet ne correspond.</p>';
    }

    resultCount.textContent = resultats.length === 0
        ? "0 trajet trouvé"
        : `${resultats.length} trajet(s) trouvé(s) · Page ${pageActuelle} sur ${nombrePages}`;

    pageMessage.textContent = resultats.length === 0
        ? "Essayez une autre ville ou un autre filtre."
        : "";

    renderPagination(pageActuelle, nombrePages);
}

async function afficherTout() {
    try {
        trips = await initialiser();
        resultats = trips;

        recherche.addEventListener("input", filtrerTrajets);
        filtre.addEventListener("change", filtrerTrajets);

        pagination.addEventListener("click", event => {
            const bouton = event.target.closest("[data-page]");

            if (!bouton || bouton.disabled) return;

            pageActuelle = Number(bouton.dataset.page);
            afficherPage();
        });

        listeTrajets.addEventListener("click", event => {
            const bouton = event.target.closest(".ouvrir");

            if (!bouton) return;

            location.href = `cabine.html?id=${encodeURIComponent(bouton.dataset.id)}`;
        });

        afficherPage();
    } catch (erreur) {
        pageMessage.textContent =
            "Impossible de charger les trajets. Ouvrez le projet avec Live Server.";
        console.error(erreur);
    }
}

afficherTout();
