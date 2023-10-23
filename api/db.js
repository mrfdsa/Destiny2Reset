import sqlite3 from 'sqlite3';
import cors from 'cors';
import express from 'express';
// import { connect, config } from './bungie.js';
import dotenv from 'dotenv';
import test from './test.json' assert {type : 'json'};
dotenv.config({ path: '../.env' });

//전역변수
const vgList = ["vgHero", "vgLegend", 'vgMaster', "vgGrandMaster"]
let url = {
    'bgImage' : '',
    'icType' : '',
    'icItem' : ''
}
let vgInfo = {}
let vgHashes = {}
let vgModifier = {};
let vgDesc = {}
let modifierRipped = {};
//테스트용 객체

//server
//express & cors & json parse
const app = express();
const port = process.env.PORT || 8080;

//미들웨어
let middleWare = function(req,res,next) {
    getInfo();
    getQuery();
    next();
}
app.use(middleWare);
app.get('/test', (req, res,error) => {
    res.send(modifierRipped);
});

app.listen(port, () => {
    console.log(`running on ${port}`);
});

//주간 공격전 해쉬 추출
//그리고 해쉬변환
//나중에 연결할때 async 붙일 것
async function getInfo() {
    console.log('1');
    // const result = await connect(config);
    // const weeklyReset = await result['data']['Response']['2029743966']['activities'];
    const weeklyReset = test['Response']['2029743966']['activities'];
    for (let i = 0; i < vgList.length; i++) {
        vgInfo[vgList[i]] = weeklyReset[i];
        vgHashes[i] = vgInfo[vgList[i]]['activityHash'] >> 32;
    }
    for (const keys of Object.keys(vgInfo)) {
        vgModifier[keys] = vgInfo[keys]['modifierHashes'];
    }
    return {vgHashes,vgModifier};
}


//DB연결, 쿼리 결과 받아오기
const conDB = {
    'dbLoc' : '../db/content.db',
    'modifierQuery' : 'select json from DestinyActivityModifierDefinition where id=?',
    'activityQuery' : 'select json from DestinyActivityDefinition where id=?',
    'rewardQuery' : 'select json from Dsetin'
}

function getQuery() {
    console.log('2');
    //mysql3
    const db = new sqlite3.Database(conDB['dbLoc'], sqlite3.OPEN_READONLY,(err)=> {
        try {
            console.log('connnected to DB1');
        }catch(error) {
            console.log(err);
        }
     });
    for(let i=0; i<vgList.length; i++) {
            db.get(conDB['activityQuery'], vgHashes[i], (error, result) => {
                let tuneResult = JSON.parse(result['json']);
                try {
                    vgDesc[vgList[i]] = {
                        'displayProperties' : tuneResult['displayProperties'],
                        'reward' : tuneResult['rewards'][0]['rewardItems']
                    }
                }
                catch(error) {
                    console.log('error occured, try again.');
                }
        })  
    }
    for(const values of vgModifier['vgGrandMaster']) {
        let hash = values >> 32;
        db.get(conDB.modifierQuery,[hash],(error,result)=> {
            let title = JSON.parse(result['json'])['displayProperties']['name']
            modifierRipped[title] = JSON.parse(result['json'])['displayProperties']
        })
    }
    db.close((err)=> {
        if(err) {
            console.log(err);
        }
        console.log('disconnected')
    });
    return {vgDesc,modifierRipped};
}

function getReward() {
    db.get(conDB['rewardQuery'],[])
}