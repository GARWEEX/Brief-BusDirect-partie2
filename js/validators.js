export function validerNom(nom, reservations, attente, indexIgnore = -1) {
    const nomNormalise = nom.trim().toLowerCase();

    if (!nomNormalise) {
        return "Le nom du passager est obligatoire.";
    }

    const existeReservation = reservations.some((reservation, index) => {
        return index !== indexIgnore &&
            reservation.name.trim().toLowerCase() === nomNormalise;
    });

    const existeAttente = attente.some(passager => {
        return passager.name.trim().toLowerCase() === nomNormalise;
    });

    if (existeReservation || existeAttente) {
        return "Ce nom est déjà utilisé sur ce trajet.";
    }

    return "";
}

export function validerTelephone(telephone, reservations, attente, indexIgnore = -1) {
    const numero = telephone.trim();

    if (!/^0[67]\d{8}$/.test(numero)) {
        return "Entrez 10 chiffres commençant par 06 ou 07.";
    }

    const existeReservation = reservations.some((reservation, index) => {
        return index !== indexIgnore && reservation.phone.trim() === numero;
    });

    const existeAttente = attente.some(passager => {
        return passager.phone.trim() === numero;
    });

    if (existeReservation || existeAttente) {
        return "Ce numéro est déjà utilisé sur ce trajet.";
    }

    return "";
}
