document.addEventListener("DOMContentLoaded", () => {

    const songs = document.querySelectorAll(".songname h3");
    const audio = document.getElementById("audio");
    const album = document.querySelector(".albname");
    const box = document.getElementById("box");

    const playBtn = document.getElementById("playPause");
    const nextBtn = document.getElementById("next");
    const prevBtn = document.getElementById("prev");
    const shuffleBtn = document.getElementById("shuffle");
    const loopBtn = document.getElementById("loop");

    const progress = document.getElementById("progress");
    const cd = document.querySelector(".cd");
    const nowTitle = document.querySelector(".now-playing-title");

    let currentIndex = -1;
    let isShuffle = false;
    let isLoop = false;

    /* =====================
       PLAY SONG
    ======================*/
    function loadSong(index) {

        songs.forEach(s => s.classList.remove("active"));

        const song = songs[index];
        song.classList.add("active");

        currentIndex = index;

        audio.src = song.dataset.audio; // đúng với HTML
        nowTitle.textContent = song.textContent;
    }

    function playSong(index) {
        if (index !== undefined) {
            loadSong(index);
        }

        audio.play();
        playBtn.textContent = "⏸";
        cd.classList.add("playing");
        document.body.classList.add("player-active");
    }

    function pauseSong() {
        audio.pause();
        playBtn.textContent = "▶";
        cd.classList.remove("playing");
    }

    /* =====================
       CLICK SONG
    ======================*/
    songs.forEach((song, index) => {
        song.addEventListener("click", () => {
            playSong(index);
        });
    });

    /* =====================
       NEXT / PREV
    ======================*/
    function nextSong() {

        if (isShuffle) {
            let random;
            do {
                random = Math.floor(Math.random() * songs.length);
            } while (random === currentIndex);
            playSong(random);
            return;
        }

        let next = currentIndex + 1;
        if (next >= songs.length) next = 0;
        playSong(next);
    }

    function prevSong() {
        let prev = currentIndex - 1;
        if (prev < 0) prev = songs.length - 1;
        playSong(prev);
    }

    nextBtn.addEventListener("click", nextSong);
    prevBtn.addEventListener("click", prevSong);

    /* =====================
       AUTO NEXT WHEN END
    ======================*/
    audio.addEventListener("ended", () => {

        if (isLoop) {
            audio.currentTime = 0;
            audio.play();
            return;
        }

        nextSong();
    });

    /* =====================
       PLAY / PAUSE BUTTON
    ======================*/
    playBtn.addEventListener("click", () => {

        if (!audio.src && currentIndex === -1) return;

        if (audio.paused) {
            playSong();
        } else {
            pauseSong();
        }
    });

    /* =====================
       SHUFFLE
    ======================*/
    shuffleBtn.addEventListener("click", () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle("active-btn", isShuffle);
    });

    /* =====================
       LOOP
    ======================*/
    loopBtn.addEventListener("click", () => {
        isLoop = !isLoop;
        loopBtn.classList.toggle("active-btn", isLoop);
    });

    /* =====================
       PROGRESS BAR
    ======================*/
    audio.addEventListener("timeupdate", () => {

        if (!audio.duration) return;

        const percent = (audio.currentTime / audio.duration) * 100;
        progress.value = percent;

        progress.style.background =
            `linear-gradient(to right,
            #85777c 0%,
            #85777c ${percent}%,
            #ddd ${percent}%,
            #ddd 100%)`;
    });

    progress.addEventListener("input", () => {
        if (!audio.duration) return;
        audio.currentTime = (progress.value / 100) * audio.duration;
    });

    /* =====================
       CD SPIN
    ======================*/
    audio.addEventListener("play", () => {
        cd.classList.add("playing");
    });

    audio.addEventListener("pause", () => {
        cd.classList.remove("playing");
    });

    /* =====================
       MOBILE TAP
       Chạm màn hình -> chữ "màu hồng" chạy lên đầu
    ======================*/
    if (window.innerWidth <= 768) {

        document.addEventListener("touchstart", (e) => {

            // không kích hoạt nếu đang bấm vào list bài
            if (e.target.closest(".songname")) return;

            album.classList.add("move-up");
            box.classList.add("show");
        });
    }

});
