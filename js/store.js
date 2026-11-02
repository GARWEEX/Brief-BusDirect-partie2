export function initialiser() {
    const data = localStorage.getItem("trips");

    if (data !== null) {
        return JSON.parse(data);
    } else {
        return fetch('./data/trips.json')
            .then(async function (res) {
                const trips = await res.json();
                sauvegrader(trips);
                return trips;
            })
            .then(function(data){
                appendData(data);
                console.log(data);
                return data;
            })            
            .catch(function (err) {
                console.log('error: ' + err);
                return [];
            });
    }
}

function sauvegrader(trips) {
    return localStorage.setItem("trips", JSON.stringify(trips));
}
