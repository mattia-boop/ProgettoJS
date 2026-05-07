async function fetchLegalitaData() {
    const displayElement = document.getElementById("boh");

    // Wikipedia API per cercare il numero di pagine legate alle "vittime di mafia"
    const url = "https://it.wikipedia.org/w/api.php?action=query&list=search&srsearch=vittime+di+mafia&format=json&origin=*";

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();

            // srsearch ci dà il numero totale di pagine (totalhits)
            if (data.query && data.query.searchinfo) {
                const totalePagine = data.query.searchinfo.totalhits;
                displayElement.textContent = `${totalePagine}`;
            }
        } else {
            throw new Error("Errore API");
        }
    } catch (error) {
        displayElement.textContent = "Errore API"; // Fallback in caso di errore
    }
}

fetchLegalitaData();

document.addEventListener("DOMContentLoaded", () => {

    const bottoniNav = document.querySelectorAll("nav button");
    bottoniNav.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-target");
            document.getElementById(id).scrollIntoView({
                behavior: "smooth"
            });
        });
    });

    const titoliOrg = document.querySelectorAll(".titoloOrg");
    titoliOrg.forEach(titolo => {
        titolo.addEventListener("click", () => {
            const id = titolo.getAttribute("data-org");
            const sezione = document.getElementById(id);
            const span = titolo.querySelector("span");

            if (sezione.classList.contains('aperto')) {
                sezione.classList.remove('aperto');
                span.innerText = "▼";
            } else {
                sezione.classList.add('aperto');
                span.innerText = "▲";
            }
        });
    });

    const btnCalcola = document.getElementById("btnCalcola");
    btnCalcola.addEventListener("click", () => {
        const val = document.getElementById("cifra").value;
        const divRisultato = document.getElementById("risultato");

        if (val <= 0) return;

        const borse = Math.floor(val / 3000);
        const kitSoccorso = Math.floor(val / 150);
        const centriSport = Math.floor(val / 50000);

        divRisultato.innerHTML = `
            • <span class="valoreEvidenziato">${borse}</span> Borse di studio per studenti meritevoli<br>
            • <span class="valoreEvidenziato">${kitSoccorso}</span> Kit di primo soccorso per le associazioni locali<br>
            • <span class="valoreEvidenziato">${centriSport}</span> Nuovi centri sportivi di aggregazione giovanile
        `;
    });

    const domande = [
        { q: "Quale organizzazione è basata sulle 'ndrine e vincoli di sangue?", o: ["'Ndrangheta", "Camorra", "Cosa Nostra"], a: 0 },
        { q: "In che anno avvenne la strage di Capaci?", o: ["1986", "1992", "1993"], a: 1 },
        { q: "Chi guidò la campagna antimafia tra il 1925 e il 1929?", o: ["Giovanni Falcone", "Cesare Mori", "Paolo Borsellino"], a: 1 },
        { q: "Quale legge permette il riutilizzo sociale dei beni confiscati?", o: ["Legge 109/96", "Legge Biagi", "41-bis"], a: 0 },
        { q: "Dove ha radici storiche la Camorra?", o: ["Sicilia", "Calabria", "Campania"], a: 2 }
    ];

    let indiceDomanda = 0;
    let punteggio = 0;

    function caricaDomanda() {
        if (indiceDomanda >= domande.length) {
            mostraRisultatoFinale();
            return;
        }

        const d = domande[indiceDomanda];
        const contenitore = document.getElementById("opzioniQuiz");
        const feedback = document.getElementById("feedbackQuiz");
        const areaBottone = document.getElementById("contenitoreBottoneAvanza");

        document.getElementById("testoDomanda").innerText = d.q;
        contenitore.innerHTML = "";
        feedback.innerText = "";
        areaBottone.innerHTML = "";

        d.o.forEach((opt, i) => {
            const btn = document.createElement("button");
            btn.innerText = opt;

            btn.addEventListener("click", () => {
                const tuttiBottoni = contenitore.querySelectorAll("button");
                tuttiBottoni.forEach(b => b.disabled = true);

                if (i === d.a) {
                    punteggio++;
                    feedback.innerText = "Risposta Corretta! ✅";
                    feedback.style.color = "#4ecca3";
                } else {
                    feedback.innerText = "Risposta Sbagliata! ❌";
                    feedback.style.color = "#ff4d4d";
                }

                const btnAvanza = document.createElement("button");
                btnAvanza.innerText = (indiceDomanda === domande.length - 1) ? "Termina Quiz" : "Prossima Domanda";
                btnAvanza.className = "bottoneAzione";
                btnAvanza.style.marginTop = "20px";

                btnAvanza.addEventListener("click", () => {
                    indiceDomanda++;
                    caricaDomanda();
                });

                areaBottone.appendChild(btnAvanza);
            });
            contenitore.appendChild(btn);
        });
    }

    function mostraRisultatoFinale() {
        const box = document.getElementById("quizBox");
        box.innerHTML = `
            <h3 class="quizFinitoTitolo">QUIZ COMPLETATO</h3>
            <p class="quizFinitoPunteggio">Il tuo punteggio finale: <b>${punteggio} / ${domande.length}</b></p>
            <button id="btnReset" class="bottoneAzione">Riprova il Test</button>
        `;
        document.getElementById("btnReset").addEventListener("click", () => {
            location.reload();
        });
    }

    caricaDomanda();
});