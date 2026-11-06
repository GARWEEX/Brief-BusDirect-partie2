const CLE = "busdirectTrips";

function preparerTrajets(trips) {
    if (!Array.isArray(trips)) {
        throw new Error("Les données des trajets sont invalides.");
    }

    return trips.map(trip => ({
        ...trip,
        id: Number(trip.id),
        price: Number(trip.price) || 0,
        capacity: Number(trip.capacity) || 20,
        reservations: Array.isArray(trip.reservations) ? trip.reservations : [],
        waitingList: Array.isArray(trip.waitingList) ? trip.waitingList : []
    }));
}

export async function initialiser() {
    const donnees = localStorage.getItem(CLE);

    if (donnees) {
        try {
            return preparerTrajets(JSON.parse(donnees));
        } catch (erreur) {
            console.warn("Les données sauvegardées sont invalides. Rechargement des données initiales.", erreur);
            localStorage.removeItem(CLE);
        }
    }

    const reponse = await fetch("./data/trips.json");

    if (!reponse.ok) {
        throw new Error("Impossible de charger data/trips.json.");
    }

    const trips = preparerTrajets(await reponse.json());
    sauvegarder(trips);

    return trips;
}

export function sauvegarder(trips) {
    localStorage.setItem(CLE, JSON.stringify(trips));
}
