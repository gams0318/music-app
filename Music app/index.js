const image = document.querySelector(".container .song-image img");
const songName = document.querySelector(".container .song-info .song-name");
const songArtist = document.querySelector(".container .song-info .artist");
const audio = document.querySelector('audio')
const cancel = document.querySelector('#Cancel')
const replay = document.querySelector("#replay");
const play = document.querySelector("#play");
const musicList = document.querySelector("#musicList");
const next = document.querySelector("#next");
const previous = document.querySelector("#previous");
const library = document.querySelector('.music-library');
const progress = document.querySelector('.progress-section')
const progressBar = document.querySelector('.bar')


const playAudio = () => {
    play.classList.add('playing');
    updateLibrary()
    audio.play();
    play.innerHTML = 'pause';
}
const pauseAudio = () => {
    play.classList.remove('playing');
    audio.pause();
    play.innerHTML = 'play_arrow';

}
const playPause = () => {
    const playStatus = play.classList.contains('playing');
    playStatus ? pauseAudio() : playAudio();
}

let index = 1;
const loadApp = () => {
    if (index == 0)
        index = 5;
    if (index == 6)
        index = 1;
    image.src = `images/${musicLib[index - 1].img}.jpg`;
    songName.textContent = `${musicLib[index - 1].name}`;
    songArtist.textContent = `${musicLib[index - 1].artist}`;
    audio.src = `songs/${musicLib[index - 1].src}.mp3`
}
const nextSong = () => {
    index++;
    loadApp();
    playAudio();
}
const prevSong = () => {
    index--;
    loadApp();
    playAudio();
}
const replaySong = () => {
    let repeatBtn = replay.innerText;
    switch (repeatBtn) {
        case ("repeat"):
            {
                replay.innerText = "repeat_one";
                break;
            }
        case ("repeat_one"):
            {
                replay.innerText = "shuffle";
                break;
            }
        default:
            {
                replay.innerText = "repeat";
                break;
            }
    }
}
const showLibrary = () => {

    library.classList.add('active')
}
const cancelList = () => {
    library.classList.remove('active');
}
cancel.addEventListener('click', cancelList);
musicList.addEventListener('click', showLibrary)
play.addEventListener('click', playPause);
next.addEventListener('click', nextSong)
previous.addEventListener('click', prevSong)
replay.addEventListener('click', replaySong);
progress.addEventListener('click', (e) => {
    let offsetWidth = e.offsetX;
    let progressWidth = progress.clientWidth;
    progressBar.style.width = `${(offsetWidth / progressWidth) * 100}%`
    audio.currentTime = (e.offsetX / progress.clientWidth) * audio.duration;
    playAudio();

})
import { musicLib } from "./library.js";
for (let i = 0; i < musicLib.length; i++) {
    let list = `<li index="${i + 1}" class="">
    <img src="images/${musicLib[i].img}.jpg" alt=""> 
    <div class="info">
    <div class="title">
    ${musicLib[i].name}</div>
    <div class="artist">
    ${musicLib[i].artist}</div>

    </div>

<audio id="${musicLib[i].src}" src="songs/${musicLib[i].src}.mp3"></audio>
<div class="duration">--</div>
</li>`
    library.querySelector('ul').insertAdjacentHTML('beforeend', list)

    let audioTag = library.querySelector(`#${musicLib[i].src}`);
    audioTag.addEventListener('loadeddata', () => {
        let dur = audioTag.duration;

        let min = Math.floor(dur / 60);
        let sec = Math.floor(dur % 60);
        if (sec < 10)
            sec = `0${sec}`
        library.querySelectorAll('.duration')[i].textContent = `${min}:${sec}`

    })
}

let libraryList = library.querySelectorAll('li');
libraryList.forEach((list, i) => {

    list.addEventListener('click', () => {
        libraryList.forEach(e => e.classList.remove('playing'))
        list.classList.add('playing')
        index = i + 1;
        loadApp();
        playAudio();
    })
})

audio.addEventListener('loadeddata', (e) => {
    let duration = audio.duration;
    const endTime = document.querySelector('.counter .stop');
    let min = Math.floor(duration / 60);
    let sec = Math.floor(duration % 60);
    if (sec < 10)
        sec = `0${sec}`
    endTime.textContent = `${min}:${sec}`
})
audio.addEventListener('timeupdate', (e) => {
    let currentTime = e.target.currentTime;

    const currentPlayTime = document.querySelector('.counter .start')
    let min = Math.floor(currentTime / 60);
    let sec = Math.floor(currentTime % 60);
    if (sec < 10)
        sec = `0${sec}`
    currentPlayTime.textContent = `${min}:${sec}`
    progressBar.style.width = `${(currentTime / audio.duration) * 100}%`
})
audio.addEventListener('ended', (e) => {
    if (replay.innerText == 'repeat_one') {
        audio.currentTime = 0;
        playAudio();
    }
    else if (replay.innerText == "repeat") {
        nextSong();
    }
    else {
        let newindex = Math.floor(Math.random() * musicLib.length) + 1;
        do {
            newindex = Math.floor(Math.random() * musicLib.length) + 1;

        }
        while (newindex == index);
        index = newindex;
        loadApp();
        playAudio();
    }
})

const updateLibrary = () => {
    libraryList.forEach(list => {
        list.classList.remove('playing');
        libraryList[index - 1].classList.add('playing')
    })
}

window.addEventListener('load', loadApp)
window.addEventListener('keypress', (e) => {

    if (e.key == " ")
        playPause();
    else if (e.key == 'p')
        prevSong();
    else if (e.key == 'n')
        nextSong();
})