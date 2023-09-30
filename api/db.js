import sqlite3 from 'sqlite3';
import cors from 'cors';
import express from 'express';
import { connect, config } from './bungie.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

//전역변수
const vgList = ["vgHero", "vgLegend", 'vgMaster', "vgGrandMaster"];
let vgInfo = {};
let hashes = {};
let finalInfo = {};
//server
//express & cors & json parse
const app = express();
const port = process.env.PROT || 8080;

app.get('/', (req, res) => {
    const result = new Promise((resolve, reject) => {
        getInfo();
        for (let i = 0; i < hashes.length; i++) {
            getSetHash(hashes[i]);
        };
        resolve(res.send(finalInfo));
    });
});

app.listen(port, () => {
    console.log(`running on ${port}`);
});


async function getInfo() {
    const result = await connect(config);
    const weeklyReset = result['data']['Response']['2029743966']['activities'];
    for (let i = 0; i < vgList.length; i++) {
        vgInfo[vgList[i]] = weeklyReset[i];
    }
    return getSetHash();
}

//hash 변환
async function getSetHash() {
    for (let i = 0; i < vgList.length; i++) {
        hashes[i] = vgInfo[vgList[i]]['activityHash'] >> 32;
    }
    return hashes;
}

//DB연결, 쿼리 결과 받아오기
async function getQuery(e) {
    const conDB = {
        dbLoc: "../db/content.db",
        query: 'SELECT json FROM DestinyActivityDefinition WHERE id=?'
    }
    let db = new sqlite3.Database(conDB.dbLoc, sqlite3.OPEN_READONLY);
    db.all(conDB.query, [e], (error, result) => {
        finalInfo = result;
        console.log(finalInfo);
    })
    db.close();
    return finalInfo;
}


//모디파이어 해쉬테이블
//근데 이거까진 만들어야 하나???? 모르겠다 진짜
// async function vgHashTb() {
//     for(let i=0; i<Object.keys(hashes); i++) {

//     }
// }