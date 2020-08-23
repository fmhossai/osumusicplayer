"use strict";
const { app, BrowserWindow, dialog, ipcMain, Menu } = require("electron");
const fs = require("fs");
const { dirname } = require("path");
//path to songs folder and length of directory
let pathyy;
let osuDirectoryLength;
function RandomSong(event, randomNumber) {
    const Songfiles = fs.readdirSync(pathyy + `/` + fs.readdirSync(pathyy)[randomNumber]);
    const path2 = pathyy + `/` + fs.readdirSync(pathyy)[randomNumber];
    let reg = /.+(?=(.osu))/;
    const info = Songfiles.find((element) => reg.test(element));
    let infoFilePath = path2 + '/' + info;
    let name;
    let art;
    let bg;
    const infoFile = fs.readFileSync(infoFilePath);
    const regTitle = /(?<=(Title:)).+/;
    const regArtist = /(?<=(Artist:)).+/;
    const regBG = /(?<=(")).+\.(jpg|png|JPG)/;
    name = `${regTitle.exec(infoFile)[0]}`;
    console.log(name);
    art = `${regArtist.exec(infoFile)[0]}`;
    bg = `${regBG.exec(infoFile)[0]}`;
    event.reply("cool", [Songfiles, path2, name, art, bg]);
}
function createWindow() {
    const template = [
        { label: "File", submenu: [
                { label: "Choose osu! Folder", click: () => {
                        dialog.showOpenDialog({ properties: ["openDirectory"] }).then((result) => {
                            pathyy = result.filePaths[0];
                            let files = fs.readdirSync(pathyy);
                            files = files.filter((element) => (element !== '._.DS_Store' && element !== '.DS_Store'));
                            osuDirectoryLength = files.length;
                            win.webContents.send("numberofBeatmaps", files.length);
                        });
                    } },
                { label: "New",
                    click: () => {
                        const winFile = new BrowserWindow();
                    }
                }
            ] },
        { label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
            ] },
        { label: 'View',
            submenu: [
                { role: 'toggledevtools' },
                { role: `reload` }
            ] }
    ];
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    win.loadFile("index.html");
    ipcMain.on("randomButton", (e) => {
        const randomNumber = Math.floor(Math.random() * (osuDirectoryLength - 1));
        RandomSong(e, randomNumber);
    });
}
app.whenReady().then(createWindow);
