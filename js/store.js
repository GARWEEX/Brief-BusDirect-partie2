fetch ('./data/data.json')
.then(function (res){
    return res.json();
})

.then(function(data){
    appendData(data);
    console.log(data)
})

.catch(function(err){
    console.log('error:'+err);
});

function appendData(data){
    let mainContainer = document.getElementById("traget");
    
    for (let i=0;i < data.length;i++){
        let div = document.createElement("div");
        div.innerHTML =data[i].destination;
        mainContainer.appendChild(div);
    }
}