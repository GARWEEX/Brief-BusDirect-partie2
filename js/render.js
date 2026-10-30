import { estComplet, placeLibres } from "./reservations.js";

export function renderTrajets(trips) {
    const container = document.getElementById("cards-container") || document.getElementById("list");

    if (!container) return;

    if (!trips || trips.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center text-gray-500 font-bold py-10">Aucun trajet trouvé.</p>`;
        return;
    }

    container.innerHTML = trips.map(trip => {
        const { id, departure, destination, price, departureTime, arrivalTime } = trip;
        const complet = estComplet(trip);
        const placeLibre = placeLibres(trip);

        return `
            <div class="card bg-white rounded-lg shadow-md border border-gray-300 p-6 flex flex-col justify-between hover:shadow-md transition duration-200">
                <div>
                    <div class="flex justify-between items-center mb-3">
                        <span class="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                            ${departureTime || "08:00"} - ${arrivalTime || "10:30"}
                        </span>
                        <span class="text-xl font-bold text-gray-900">${price ? price : "80"} DH</span>
                    </div>
                    <div>
                        <h5 class="text-xl font-bold text-gray-800 mb-2">Trajet : ${departure} &rarr; ${destination}</h5>
                        <p class="text-gray-600 font-medium text-base mb-4">
                            Places disponibles : <span class="font-bold text-gray-800">${placeLibre} 👤</span>
                        </p>
                    </div>
                </div>
                <div class="flex justify-between items-center gap-3 mt-2">
                    <span class="${complet ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"} text-xs font-bold px-3 py-1 rounded-full">
                        ${complet ? "Complet" : "Disponible"}
                    </span>
                    <a href="ticket.html?id=${id || 1}" class="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition focus:scale-95">
                        explore
                    </a>
                </div>
            </div>
        `;
    }).join("");
}
