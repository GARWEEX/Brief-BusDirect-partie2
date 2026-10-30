import { renderTrajets } from "./render.js";
import { initialiser } from "./store.js";

document.addEventListener("DOMContentLoaded", async () => {
    const trips = await initialiser();

    const searchInput = document.getElementById("search");
    const statusSelect = document.getElementById("status");

    function afficher() {
        const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const statusVal = statusSelect ? statusSelect.value.toLowerCase() : "";

        const filtered = (trips || []).filter(trip => {
            const matchesSearch = trip.departure.toLowerCase().includes(searchVal) ||
                                  trip.destination.toLowerCase().includes(searchVal);
            
            const libre = trip.capacity - (trip.reservations ? trip.reservations.length : 0);
            let matchesStatus = true;
            if (statusVal === "disponible") matchesStatus = libre > 0;
            if (statusVal === "complet") matchesStatus = libre === 0;

            return matchesSearch && matchesStatus;
        });

        renderTrajets(filtered);
    }

    if (searchInput) searchInput.addEventListener("input", afficher);
    if (statusSelect) statusSelect.addEventListener("change", afficher);

    afficher();
});
