const bottoni = document.querySelectorAll("#menu button");
const sezioni = document.querySelectorAll("main section");

function apriSezione(idBottone) {
    const nomeCercato = idBottone.toLowerCase();

    sezioni.forEach(sezione => {
        const nomeSezione = sezione.id.toLowerCase();

        if (nomeCercato.includes(nomeSezione)) {
            sezione.classList.add("active");
        } else {
            sezione.classList.remove("active");
        }
    });
}

bottoni.forEach(btn => {
    btn.addEventListener("click", () => {
        apriSezione(btn.id);
    });
});
