export function placeLibres(trip) {
   return trip.capacity - (trip.reservations ? trip.reservations.length : 0);
}
export function estComplet(trip){
    return placeLibres(trip) === 0;
}
