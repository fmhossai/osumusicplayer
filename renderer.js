const { ipcRenderer } = require("electron")

//the current song
let song1

let play = document.getElementsByClassName("play")[0]
function SongMethods(path, song){
    void document.getElementById("progress").offsetWidth
    document.getElementById("progress").classList.add("progressbar")
    song.addEventListener("loadedmetadata",()=>{
        let root = document.documentElement
        root.style.setProperty("--song-duration", `${Math.floor(song.duration)}s`)
        song.play()
    })
    song.addEventListener("timeupdate",()=>{
        let minutes = Math.floor(song.currentTime/60)
        let seconds = Math.floor(song.currentTime - minutes*60)
        duration.textContent = `${("0" + minutes).slice(-2)}:${("0"+ seconds).slice(-2)}`
    })
    //if i put this eventlistener here, it doesnt work
}
//if i put this eventlistener here, it works
play.addEventListener("click",()=>{
    if (song1.paused){
        song1.play()
        play.textContent = "Pause"
    }
    else{
        song1.pause()
        song1.textContent = "Play"
    }
})

let duration = document.querySelector(".meow")

const randomButton = document.getElementById("rand")
randomButton.addEventListener("click",()=>{
    ipcRenderer.send("randomButton")
})
ipcRenderer.on("numberofBeatmaps",(e,result)=>{
    let numberOfBeatmaps = document.querySelector(".numberBeatmaps")
    numberOfBeatmaps.textContent = `you have ${result} beatmaps in your songs library`
})
ipcRenderer.on("cool",(e,result)=>{
    display(result)
})
function display(result){ 
    let bg = document.querySelector(".bg")
    const regSong = /^.+\.mp3$/
    const Song = result[0].find((element)=> regSong.test(element))
    if (song1){
        document.getElementById("progress").classList.remove("progressbar")
        song1.setAttribute("src", `${result[1]}/${Song}`)
        SongMethods(result[1],song1)
    }
    else{
        song1 = new Audio(`${result[1]}/${Song}`)
        SongMethods(result[1],song1)
    }
    bg.src = `${result[1]}/${result[4]}`
    let title = document.querySelector(".SongTitle")
    let artist = document.querySelector(".SongArtist")
    title.textContent = `${result[2]}`
    artist.textContent = `${result[3]}`
}

