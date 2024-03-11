let chaptersTrack = '';
let subtitlesTracks = [];

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
        }
    }
    console.log(subtitlesTracks);
    chaptersManagment();
    subitlesPlay();

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
function subitlesPlay() {
    const iconSubs = document.getElementById('subtitles_icon');

    iconSubs.addEventListener('click', function () {
        if (subtitlesTracks[0].mode === "hidden") {
            subtitlesTracks[0].mode = "showing";
        } else {
            subtitlesTracks[0].mode = "hidden";
        }

    })
}
/*
document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById('myVideo');
    const chaptersTrack = video.textTracks[0];
    chaptersTrack.mode = "hidden";

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
});

*/
function setupTooltipDisplay(chapterPoint) {
    chapterPoint.addEventListener('mouseover', function () {
        this.querySelector('.chapter-title-tooltip').style.display = 'block';
    });
    chapterPoint.addEventListener('mouseout', function () {
        this.querySelector('.chapter-title-tooltip').style.display = 'none';
    });
}
