const { ipcRenderer } = require("electron")
let song1
console.log("hi")
function SongMethods(path, song){
    void document.getElementById("progress").offsetWidth
    document.getElementById("progress").classList.add("progressbar")
    song.addEventListener("loadedmetadata",()=>{
        console.log(song.duration)
        let root = document.documentElement
        root.style.setProperty("--song-duration", `${Math.floor(song.duration)}s`)
        song.play()
    })
    song.addEventListener("timeupdate",()=>{
        let minutes = Math.floor(song.currentTime/60)
        duration.textContent = `${minutes}:${Math.floor(song.currentTime - minutes*60)}`
    })
}

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
    let regSong = /^.+\.mp3$/
    let regBG = /.+\.(jpg|png|JPG)/
    let regTitle = /.+\s-\s.+(?=\s\()/
    const Song = result[0].find((element)=> regSong.test(element))
    const Background = result[0].find((element)=> regBG.test(element))
    const Title = result[0].find((element)=> regTitle.test(element))
    if (song1){
        document.getElementById("progress").classList.remove("progressbar")
        song1.setAttribute("src", `${result[1]}/${Song}`)
    }
    else{
        song1 = new Audio(`${result[1]}/${Song}`)
    }
    
    SongMethods(result[1],song1)
    let title_revised = regTitle.exec(Title)[0]
    console.log(Background)
    bg.src = `${result[1]}/${Background}`
    let title = document.querySelector(".meow")
    title.textContent = `${title_revised}`
}