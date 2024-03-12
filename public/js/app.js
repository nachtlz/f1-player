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
    console.log(subtitlesTracks);
    console.log(metadataTracks);
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
                }
            }
        });
    });
}

function updateInfoDrivers(data) {
    const container = document.getElementById('driversInfoContainer');
    container.innerHTML = '';
    data.drivers.forEach((driver, index) => {
        const driverContainer = document.createElement('div');
        driver.className = 'row';
        const driverContainerInfo = document.createElement('div');
        driverContainerInfo.className = 'col-sm';
        const img = document.createElement('img');
        img.src = driver.image;
        img.alt = driver.driver;
        img.className = 'img-fluid';
        const p = document.createElement('p');
        p.textContent = driver.driver;
        p.className = 'text-driver';

        driverContainerInfo.appendChild(img);
        driverContainerInfo.appendChild(p);
        driverContainer.appendChild(driverContainerInfo);
        container.appendChild(driverContainer);

        if (index < data.drivers.length - 1) {
            const vs = document.createElement('p');
            vs.className = 'mx-2';
            vs.textContent = 'VS';
            container.appendChild(vs);
        }
    })
}


