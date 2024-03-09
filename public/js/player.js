document.addEventListener("DOMContentLoaded", function () {
    iniciarApp();
});

function iniciarApp() {
    setupProgressBar();
    setupPlayPauseToggle();
    setupVolumeControl();
    setupFastForwardRewind();
}

function setupProgressBar() {
    const video = document.getElementById('myVideo');
    const progressBarFill = document.getElementById('progress-bar-fill');

    // Actualizar el progreso del video mientras se reproduce
    video.addEventListener('timeupdate', function () {
        let progress = (video.currentTime / video.duration) * 100;
        progressBarFill.style.width = progress + '%';
    });


    // Controlar el progreso del video al hacer clic en la barra de progreso
    /*
    progressBar.addEventListener('click', function (event) {
        var posX = event.pageX - progressBar.offsetLeft;
        var totalWidth = progressBar.clientWidth;
        var progress = (posX / totalWidth) * video.duration;
        video.currentTime = progress;
    });
    */

}
function setupPlayPauseToggle() {
    const video = document.getElementById('myVideo');
    const playPauseButton = document.getElementById('play-pause-button');
    const playPauseIcon = document.getElementById('play-pause');

    playPauseButton.addEventListener('click', function () {
        if (video.paused) {
            video.play();
            playPauseButton.style.display = 'none';
        } else {
            video.pause();
        }
    });


    video.addEventListener('ended', function () {
        playPauseButton.style.display = 'block';
        playPauseButton.className = 'fas fa-play';
    });

    video.addEventListener('click', function () {
        if (video.paused) {
            playPauseButton.style.display = 'none';
            playPauseIcon.className = 'fas fa-pause';

            video.play();
        } else {
            playPauseButton.style.display = 'block';
            playPauseButton.className = 'fas fa-play';
            playPauseIcon.className = 'fas fa-play';

            video.pause();
        }
    });
    video.addEventListener('play', function () {
        playPauseButton.style.display = 'none';
        playPauseIcon.className = 'fas fa-pause';


    })
    playPauseIcon.addEventListener('click', function () {
        if (video.paused) {
            playPauseIcon.className = 'fas fa-pause';
            video.play();
        } else {
            playPauseIcon.className = 'fas fa-play';
            video.pause();
        }

    })


}

function setupVolumeControl() {
    var video = document.getElementById('myVideo');
    var volumeSlider = document.getElementById('volume-slider');
    var volumeIcon = document.getElementById('volume-icon');

    video.volume = 0.5;
    volumeSlider.value = 0.5;
    updateVolumeIcon(0.5, volumeIcon);
    updateBarVolume(0.5, volumeSlider);

    volumeSlider.addEventListener('input', function () {
        const volume = volumeSlider.value;
        video.volume = volume;
        updateVolumeIcon(volume, volumeIcon);
        updateBarVolume(volume, volumeSlider);
    });
    volumeIcon.addEventListener('click', function () {
        volumeSlider.value = 0;
        video.volume = 0;
        updateVolumeIcon(0, volumeIcon);
        updateBarVolume(0, volumeSlider);
    })
}

function updateVolumeIcon(volume, volumeIcon) {

    if (volume === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (volume <= 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    }
    else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

function updateBarVolume(volume, volumeSlider) {
    const color = volume == 0 ? '#aaa' : `rgb(${255 * (1 - volume)}, ${255 * volume}, 0)`;
    volumeSlider.style.background = `linear-gradient(to right, ${color} 0%, ${color} ${volume * 100}%, #fff ${volume * 100}%, #fff 100%)`;
}

function setupFastForwardRewind() {
    const video = document.getElementById('myVideo');
    const forwardButton = document.getElementById('forward-button');
    const rewindButton = document.getElementById('rewind-button');

    forwardButton.addEventListener('click', () => video.currentTime += 5);
    rewindButton.addEventListener('click', () => video.currentTime -= 5);
}