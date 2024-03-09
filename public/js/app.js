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

function setupTooltipDisplay(chapterPoint) {
    chapterPoint.addEventListener('mouseover', function () {
        this.querySelector('.chapter-title-tooltip').style.display = 'block';
    });
    chapterPoint.addEventListener('mouseout', function () {
        this.querySelector('.chapter-title-tooltip').style.display = 'none';
    });
}
