const {app, BrowserWindow, dialog, ipcMain, Menu} = require("electron")
const fs = require("fs")
const { dirname } = require("path")

let pathyy
let osuDirectoryLength
function RandomSong(event, randomNumber){
    files = fs.readdirSync(pathyy + `/` + fs.readdirSync(pathyy)[randomNumber])
    path2 = pathyy + `/` + fs.readdirSync(pathyy)[randomNumber]
    console.log(files)
    let reg = /(?<=").+\.(osu)/
    const info = files.find((element)=> reg.exec(element))
    let infoFile = path2 + '/' + info
    event.reply("cool",[files,path2])
}
function createWindow(){
    const template = [
        {label: "File",
         submenu:[
             {label: "Choose osu! Folder",
             click: ()=>{
                dialog.showOpenDialog({properties:["openDirectory"]}).then((result)=>{
                    pathyy = result.filePaths[0]
                    files = fs.readdirSync(pathyy)
                    const files2 = files.filter((element)=> (element !== '._.DS_Store' && element !=='.DS_Store'))
                    osuDirectoryLength = files.length
                    win.webContents.send("numberofBeatmaps", files.length)  
                })
             }}
         ]},
        {label : 'Edit',
         submenu: [
             {role: 'undo'},
             {role: 'redo'},
         ]},
         {label: 'View',
          submenu:[
              {role: 'toggledevtools'},
              {role: `reload`}
          ]}    
    ]
    const win = new BrowserWindow({
        width:800,
        height:600,
        webPreferences: {
            nodeIntegration: true
        }
    })
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
    win.loadFile("index.html")
    ipcMain.on("randomButton",(e,arg)=>{
        const randomNumber = Math.floor(Math.random()*(osuDirectoryLength-1))
        RandomSong(e,randomNumber)
    })
}

app.whenReady().then(createWindow)