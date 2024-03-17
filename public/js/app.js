let chaptersTrack = '';
let subtitlesTracks = [];
let metadataTracks = [];
document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('myVideo');

    const tracks = video.textTracks;
    for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].kind === 'chapters') {
            chaptersTrack = tracks[i];
            chaptersTrack.mode = "hidden";
        } else if (tracks[i].kind === 'subtitles') {
            tracks[i].mode = 'hidden';
            subtitlesTracks.push(tracks[i]);
        } else if (tracks[i].kind === 'metadata') {
            tracks[i].mode = 'hidden';
            metadataTracks.push(tracks[i]);
        }
    }
    chaptersManagment();
    setupLanguageButtons();
    setupSubtitlesIcon();
    metadataManagment();

})


function chaptersManagment() {

    const video = document.getElementById('myVideo');
    video.addEventListener("loadedmetadata", function () {
        const cues = chaptersTrack.cues;
        const duration = video.duration;
        const progressBar = document.getElementById('progress-bar');

        for (let i = 0; i < cues.length; i++) {
            const cue = cues[i];
            const positionPercent = (cue.startTime / duration) * 100;
            const chapterPoint = document.createElement('div');
            chapterPoint.className = 'chapter-point';
            chapterPoint.style.left = `calc(${positionPercent}%)`;

            const titleTooltip = document.createElement('div');
            titleTooltip.className = 'chapter-title-tooltip';
            titleTooltip.textContent = cue.text;
            chapterPoint.appendChild(titleTooltip);

            setupTooltipDisplay(chapterPoint);

            chapterPoint.addEventListener('click', function () {
                video.currentTime = cue.startTime;
                video.play();
            });

            progressBar.appendChild(chapterPoint);
        }
    });

}

function toggleSubtitles(language) {
    const iconSubs = document.getElementById('subtitles_icon');
    let track = subtitlesTracks.find(element => element.language === language) || subtitlesTracks[0];

    if (track && track.mode === "hidden") {
        track.mode = "showing";
        iconSubs.classList.add('active');
    } else if (track) {
        track.mode = "hidden";
        iconSubs.classList.remove('active');
    }
}

function disableAllSubsTracks() {
    subtitlesTracks.forEach(track => track.mode = "hidden")
}

function setupLanguageButtons() {
    const buttons = document.querySelectorAll('.button-lenguage');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            disableAllSubsTracks();
            localStorage.setItem('lenguage', button.value);
            toggleSubtitles(button.value);
        });
    });
}

function setupSubtitlesIcon() {
    const iconSubs = document.getElementById('subtitles_icon');

    iconSubs.addEventListener('click', function () {
        let language = localStorage.getItem('lenguage');
        toggleSubtitles(language);
    });
}

function setupTooltipDisplay(chapterPoint) {
    chapterPoint.addEventListener('mouseover', function () {
        this.querySelector('.chapter-title-tooltip').style.display = 'block';
    });
    chapterPoint.addEventListener('mouseout', function () {
        this.querySelector('.chapter-title-tooltip').style.display = 'none';
    });
}

function metadataManagment() {
    metadataTracks.forEach(track => {
        console.log(track);
        track.addEventListener('cuechange', function () {
            let cue = this.activeCues[0];
            if (cue) {
                let data = JSON.parse(cue.text);
                if (track.label === 'Drivers_Circuits') {
                    updateInfoDrivers(data);
                } else if (track.label === 'questions') {
                    updateQuestion(data)
                } else if (track.label === 'firstPerson') {
                    setFirstPerson(data);
                }
            }
        });
    });
}

function updateInfoDrivers(data) {
    const container = document.getElementById('driversBattleContainer');
    const firstPersonContainer = document.getElementById('driverFirstPerson');
    const circuitContainer = document.getElementById('circuit_container');

    container.innerHTML = '';
    circuitContainer.innerHTML = '';
    firstPersonContainer.classList.add('hidden');
    data.drivers.forEach((driver, index) => {
        const battleItem = document.createElement('div');
        driver.className = 'battle_item';
        const driverNameContainer = document.createElement('div');
        driverNameContainer.className = 'driver_name_battle';
        const img_driver = document.createElement('img');
        img_driver.src = driver.image;
        img_driver.alt = driver.driver;
        img_driver.className = 'image_driver_battle';
        const p = document.createElement('p');
        p.textContent = driver.driver;
        const img_flag = document.createElement('img');
        img_flag.className = "flag_driver";
        img_flag.src = driver.bandera;

        driverNameContainer.appendChild(p);
        driverNameContainer.append(img_flag);
        battleItem.appendChild(img_driver);
        battleItem.appendChild(driverNameContainer);

        container.appendChild(battleItem);

        if (index < data.drivers.length - 1) {
            const vs = document.createElement('p');
            vs.className = 'mx-2';
            vs.textContent = 'VS';
            container.appendChild(vs);
        }
    });

    container.classList.remove('hidden');

    // Procesa la información del circuito
    const circuitImageContainer = document.createElement('div');
    circuitImageContainer.className = 'circuit_image_container';

    const circuitImage = document.createElement('img');
    circuitImage.className = 'circuit_image';
    circuitImage.src = data.circuito.image;

    circuitImageContainer.appendChild(circuitImage);
    circuitContainer.appendChild(circuitImageContainer);

    const circuitInfoContainer = document.createElement('div');
    circuitInfoContainer.className = 'circuit_info_container';

    const dateCircuitContainer = document.createElement('div');
    dateCircuitContainer.className = 'date_circuit_container';

    const dateContent = document.createElement('div');
    dateContent.className = 'date_content';

    const dataCircuit = document.createElement('h3');
    dataCircuit.className = 'data_circuit';
    dataCircuit.textContent = data.circuito.fecha;

    const mesCircuit = document.createElement('p');
    mesCircuit.className = 'mes_circuit';
    mesCircuit.textContent = data.circuito.mes;

    dateContent.appendChild(dataCircuit);
    dateContent.appendChild(mesCircuit);

    const flagCircuit = document.createElement('img');
    flagCircuit.className = 'flag_circuit';
    flagCircuit.src = data.circuito.bandera;

    dateCircuitContainer.appendChild(dateContent);
    dateCircuitContainer.appendChild(flagCircuit);

    const descriptionContainer = document.createElement('div');
    descriptionContainer.className = 'description_container';

    const countryCircuitContainer = document.createElement('div');
    countryCircuitContainer.className = 'country_circuit_container';

    const countryCircuit = document.createElement('h2');
    countryCircuit.className = 'country_circuit';
    countryCircuit.textContent = data.circuito.pais;

    const chevronRightIcon = document.createElement('i');
    chevronRightIcon.className = 'fas fa-chevron-right';

    countryCircuitContainer.appendChild(countryCircuit);
    countryCircuitContainer.appendChild(chevronRightIcon);

    const nameCircuitPrix = document.createElement('p');
    nameCircuitPrix.className = 'prix_name_circuit';
    nameCircuitPrix.textContent = data.circuito.name;

    const descriptionCircuit = document.createElement('p');
    descriptionCircuit.className = 'description_circuit';
    descriptionCircuit.textContent = data.circuito.circuito;

    descriptionContainer.appendChild(countryCircuitContainer);
    descriptionContainer.appendChild(nameCircuitPrix);

    descriptionContainer.appendChild(descriptionCircuit);

    circuitInfoContainer.appendChild(dateCircuitContainer);
    circuitInfoContainer.appendChild(descriptionContainer);

    circuitContainer.appendChild(circuitInfoContainer);
}
function updateQuestion(questions) {
    const video = document.getElementById('myVideo');
    video.pause();

    const divQuestions = document.querySelector('.question-container');
    divQuestions.classList.remove('hidden');

    const divAnswer = document.getElementById('answers');
    divAnswer.innerHTML = '';

    const p = document.querySelector('.question-title');
    p.textContent = questions.question;

    let allButtons = [];
    let selected_btn = null;
    let option_selected = -1;

    questions.options.forEach((option, index) => {
        const buttonAnswer = document.createElement('button');
        buttonAnswer.className = "answer-button";
        buttonAnswer.textContent = option;
        buttonAnswer.addEventListener('click', function () {
            allButtons.forEach(btn => btn.classList.remove('clicked'));
            buttonAnswer.classList.add('clicked');
            option_selected = index;
            selected_btn = buttonAnswer;
        });
        divAnswer.appendChild(buttonAnswer);
        allButtons.push(buttonAnswer);
    });


    setTimeout(() => {
        if (option_selected !== -1 && option_selected === questions.correct) {
            selected_btn.classList.remove('clicked');
            selected_btn.classList.add('correct');
            let correctCount = parseInt(localStorage.getItem('correct') || '0');
            correctCount += 1;
            localStorage.setItem('correct', correctCount.toString());

        } else if (option_selected !== -1) {
            selected_btn.classList.remove('clicked');
            selected_btn.classList.add('wrong');
        }
        setTimeout(() => {
            divQuestions.classList.add('hidden');
            video.play();
        }, 1000)
    }, 5000);


}
function setFirstPerson(driver) {
    const battleContainer = document.getElementById('driversBattleContainer');
    const firstPersonContainer = document.getElementById('driverFirstPerson');

    battleContainer.classList.add('hidden');
    firstPersonContainer.innerHTML = '';


    const escuderiaContainer = document.createElement('div');
    escuderiaContainer.className = 'escuderia-container';
    const escuderia_name = document.createElement('p');
    escuderia_name.className = 'escuderia-text';
    escuderia_name.textContent = driver.escuderia;
    const logo_escuderia = document.createElement('img');
    logo_escuderia.className = 'escuderia_logo';
    logo_escuderia.src = driver.logo;
    escuderiaContainer.appendChild(escuderia_name)
    escuderiaContainer.appendChild(logo_escuderia);

    const driverContainer = document.createElement('div');
    driverContainer.className = 'driver_container';

    const driverNameContainer = document.createElement('div');
    driverNameContainer.className = 'driver_name';
    const name = document.createElement('p');
    name.textContent = driver.driver
    const img_flag = document.createElement('img');
    img_flag.className = "flag_driver";
    img_flag.src = driver.bandera;
    driverNameContainer.appendChild(name);
    driverNameContainer.appendChild(img_flag);

    const img_driver = document.createElement('img');
    img_driver.src = driver.img;
    img_driver.alt = driver.driver;
    img_driver.className = 'img_driver';

    driverContainer.appendChild(driverNameContainer)
    driverContainer.appendChild(img_driver);

    const carContainer = document.createElement('div');
    carContainer.className = 'car_img_container';
    const img_car = document.createElement('img');
    img_car.src = driver.car;
    img_car.alt = driver.driver
    carContainer.appendChild(img_car)

    firstPersonContainer.appendChild(escuderiaContainer);
    firstPersonContainer.appendChild(driverContainer);
    firstPersonContainer.appendChild(carContainer);
    firstPersonContainer.classList.remove('hidden');


}

