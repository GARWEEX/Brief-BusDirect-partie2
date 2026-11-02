import { renderTrajets } from "./render.js";
import { initialiser } from "./store.js";

const trips = await initialiser();
console.table(trips);


async function afficher() {
    renderTrajets(trips);
}



afficher();

