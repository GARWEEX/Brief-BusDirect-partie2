import { renderTrajets } from "./render.js";
import { initialiser } from "./store.js";

const trips = await initialiser();
console.table(trips);



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
               renderTrajets(trips);
        });

        renderTrajets(filtered);}

        if (searchInput) searchInput.addEventListener("input", afficher);
    if (statusSelect) statusSelect.addEventListener("change", afficher);
    
        

afficher();

