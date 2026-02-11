
document.addEventListener("DOMContentLoaded", () => {

    const songs = document.querySelectorAll(".songname h3");
    const audio = document.getElementById("audio");
    const album = document.querySelector(".albname");
    const box = document.getElementById("box");
    const progress = document.getElementById("progress");
    const shuffleBtn = document.getElementById("shuffle");
    const loopBtn = document.getElementById("loop");
    const cd = document.querySelector(".cd");

    let currentIndex = -1;
    let isShuffle = false;
    let isLoop = false;
    let playerOpened = false;

    /* =====================
       PHÍM P
    ======================*/
    document.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "p") {
            album.classList.add("move-up");
            box.classList.add("show");
        }
    });

    /* =====================
       PLAY FUNCTION
    ======================*/
    function playSong(index) {

        if (index === currentIndex) return;

        const oldSong = songs[currentIndex];
        const newSong = songs[index];

        if (oldSong) {
            oldSong.classList.remove("active");
            oldSong.classList.add("leaving");
            setTimeout(() => oldSong.classList.remove("leaving"), 600);
        }

        newSong.classList.add("active");
        currentIndex = index;

        audio.src = newSong.dataset.audio;
        audio.play();

        // mở player lần đầu
        if (!playerOpened) {
            document.body.classList.add("player-active");
            playerOpened = true;
        }
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
       AUTO NEXT
    ======================*/
    audio.addEventListener("ended", () => {

        if (isLoop) {
            playSong(currentIndex);
            return;
        }

        if (isShuffle) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * songs.length);
            } while (randomIndex === currentIndex);
            playSong(randomIndex);
        } else {
            let next = currentIndex + 1;
            if (next >= songs.length) next = 0;
            playSong(next);
        }
    });

    /* =====================
       PROGRESS UPDATE
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
       SHUFFLE
    ======================*/
    shuffleBtn.addEventListener("click", () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle("active-btn");
    });

    /* =====================
       LOOP
    ======================*/
    loopBtn.addEventListener("click", () => {
        isLoop = !isLoop;
        loopBtn.classList.toggle("active-btn");
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
       MOBILE TAP COLLAPSE
    ======================*/
    if (window.innerWidth <= 768) {

        let collapsed = false;

        document.addEventListener("click", (e) => {

            if (e.target.closest(".songname")) return;

            collapsed = !collapsed;
            document.body.classList.toggle("mobile-collapse", collapsed);
        });
    }

});

document.addEventListener("keydown", function(e){
    if(e.key.toLowerCase() === "p"){
        document.body.classList.add("player-open");
    }
});
document.querySelectorAll(".songname h3").forEach(song => {
    song.addEventListener("click", function(){

        document.body.classList.add("player-active");

        document.querySelectorAll(".songname h3")
            .forEach(s => s.classList.remove("active"));

        this.classList.add("active");
    });
});

document.addEventListener("DOMContentLoaded", function(){

    const audio = document.getElementById("audio");
    const playBtn = document.getElementById("playPause");
    const nextBtn = document.getElementById("next");
    const prevBtn = document.getElementById("prev");
    const cd = document.querySelector(".cd");
    const songs = document.querySelectorAll(".songname h3");
    const nowTitle = document.querySelector(".now-playing-title");

    /* ===== BẤM P ===== */
    document.addEventListener("keydown", function(e){
        if(e.key.toLowerCase() === "p"){
            document.body.classList.add("player-open");
        }
    });

    /* ===== CLICK SONG ===== */
    songs.forEach(song => {
        song.addEventListener("click", function(){

            songs.forEach(s => s.classList.remove("active"));
            this.classList.add("active");

            const src = this.getAttribute("data-src");

            if(src){
                audio.src = src;
                audio.play().then(() => {
                    playBtn.textContent = "⏸";
                    cd.classList.add("playing");
                }).catch(err => {
                    console.log("Play bị chặn:", err);
                });
            }

            if(nowTitle){
                nowTitle.textContent = this.textContent;
            }
        });
    });

    /* ===== PLAY / PAUSE ===== */
    playBtn.addEventListener("click", function(){

        if(!audio.src){
            console.log("Chưa chọn bài");
            return;
        }

        if(audio.paused){
            audio.play();
            playBtn.textContent = "⏸";
            cd.classList.add("playing");
        } else {
            audio.pause();
            playBtn.textContent = "▶";
            cd.classList.remove("playing");
        }
    });
    // ===== NEXT =====
    nextBtn.addEventListener("click", function () {
        currentIndex++;

        if (currentIndex >= songs.length) {
            currentIndex = 0; // quay lại bài đầu
        }

        loadSong(currentIndex);
        playSong();
    });

    // ===== PREV =====
    prevBtn.addEventListener("click", function () {
        currentIndex--;

        if (currentIndex < 0) {
            currentIndex = songs.length - 1; // về bài cuối
        }

        audio.src = songs[currentIndex].dataset.audio;
        audio.play();

    });
    /* ===== KẾT THÚC BÀI ===== */
    audio.addEventListener("ended", function(){
        playBtn.textContent = "▶";
        cd.classList.remove("playing");
    });

});