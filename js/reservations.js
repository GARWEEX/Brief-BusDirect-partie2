export function placesLibres(trip) {
    return trip.capacity - trip.reservations.length;
}

export function estComplet(trip) {
    return placesLibres(trip) <= 0;
}

export function estVIP(numero) {
    const siege = Number(numero);
    return siege >= 1 && siege <= 4;
}

export function prixSiege(prix, numero) {
    return estVIP(numero) ? Math.round(Number(prix) * 1.1) : Number(prix);
}

export function recette(trip) {
    return trip.reservations.reduce((total, reservation) => {
        return total + prixSiege(trip.price, reservation.seat);
    }, 0);
}

export function premierSiegeLibre(trip) {
    for (let i = 5; i <= trip.capacity; i++) {
        const occupe = trip.reservations.some(reservation => {
            return Number(reservation.seat) === i;
        });

        if (!occupe) return i;
    }

    return null;
}
