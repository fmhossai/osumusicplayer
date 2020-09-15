const { ipcRenderer } = require("electron")
let pausePaths = [
    `M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M30,58C14.561,58,2,45.439,2,30
    S14.561,2,30,2s28,12.561,28,28S45.439,58,30,58z`,
    `M33,46h8V14h-8V46z M35,16h4v28h-4V16z`,
    `M19,46h8V14h-8V46z M21,16h4v28h-4V16z`
]
let playPaths = [
    `M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30
    c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15
    C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z`,
    `M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M30,58C14.561,58,2,45.439,2,30
    S14.561,2,30,2s28,12.561,28,28S45.439,58,30,58z`
] 
let songElement = document.getElementById("playButton") as HTMLAudioElement
if (localStorage.getItem("DirectoryLength")){
    let numberOfBeatmaps = document.querySelector(".numberBeatmaps")
    numberOfBeatmaps.textContent = `you have ${localStorage.getItem("DirectoryLength")} beatmaps in your songs library`
}
else{
    let numberOfBeatmaps = document.querySelector(".numberBeatmaps")
    numberOfBeatmaps.textContent = `Choose osu! Songs Folder`
}
songElement.addEventListener("click", function(){
    let song = document.getElementById("song") as HTMLAudioElement
    if (song.paused){
        song.play()
        document.documentElement.style.setProperty("--play-state", "running")
        while(this.firstChild){
            this.firstChild.remove()
        }
        pausePaths.forEach((element)=>{
            let pathElement = document.createElementNS("http://www.w3.org/2000/svg","path")
            pathElement.setAttributeNS(null, "d",element)
            this.appendChild(pathElement)
        })
    }
    else{
        song.pause()
        document.documentElement.style.setProperty("--play-state", "paused")
        while(this.firstChild){
            this.firstChild.remove()
        }
        playPaths.forEach((element)=>{
            let pathElement = document.createElementNS("http://www.w3.org/2000/svg","path")
            pathElement.setAttributeNS(null, "d",element)
            this.appendChild(pathElement)
        })
    }
})

function SongMethods(song:HTMLAudioElement){
    let duration = document.querySelector(".duration")
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

const randomButton = document.getElementById("rand")
randomButton.addEventListener("click",()=>{
    ipcRenderer.send("randomButton", [parseInt(localStorage.getItem("DirectoryLength")),localStorage.getItem("SongsPath")])
})
ipcRenderer.on("numberofBeatmaps",(e:any,result:Array<any>)=>{
    localStorage.setItem("SongsPath", `${result[1]}`)
    localStorage.setItem("DirectoryLength",`${result[0]}`)
})
ipcRenderer.on("cool",(e:any,result:Array<any>)=>{
    display(result)
})
function display(result:Array<any>){ 
    let song = document.getElementById("song") as HTMLAudioElement
    let bg = document.querySelector(".bg") as HTMLImageElement
    // const regSong = /^.*\.mp3$/
    // const SongFile = result[0].find((element:string)=> regSong.test(element))
    document.getElementById("progress").classList.remove("progressbar")
    song.src = `${result[1]}/${result[5]}`
    SongMethods(song)
    bg.src = `${result[1]}/${result[4]}`
    let title = document.querySelector(".SongTitle")
    let artist = document.querySelector(".SongArtist")
    title.textContent = `${result[2]}`
    artist.textContent = `${result[3]}`
}

