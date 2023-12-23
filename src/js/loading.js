let loadingPrecenteges = document.getElementById('loadingPrecents');
if (loadingPrecenteges) {
    window.addEventListener('setPrecenteges', (function(){
        let elem = loadingPrecenteges;
        return function(e){
            elem.innerText = e.detail.precents;
        }
    })());
}