import sqlite3 from 'sqlite3';
import cors from 'cors';
import express from 'express';
// import { connect, config } from './bungie.js';
import dotenv from 'dotenv';
import test from './test.json' assert {type : 'json'};
dotenv.config({ path: '../.env' });

//전역변수
const conDB = {
    'dbLoc' : '../db/content.db',
    'modifierQuery' : 'select json from DestinyActivityModifierDefinition where id=?',
    'activityQuery' : 'select json from DestinyActivityDefinition where id=?',
    'itemQuery' : 'select json from DestinyInventoryDefinition where id=?',
};
const vgList = ["vgHero", "vgLegend", 'vgMaster', "vgGrandMaster"];
let vgInfo = {};
let vgHashes = [];
let vgRippedHashList = {};
let vgDesc = {};
let queryResult = {};
//mysql3
//DB연결, 쿼리결과 받아오기


//주간 공격전 해쉬 추출
//그리고 해쉬변환
//나중에 연결할때 async 붙일 것
async function getInfo() {
    let vgModifier = {};
    console.log('1');
    // const result = await connect(config);
    // const weeklyReset = result['data']['Response']['2029743966']['activities'];
    const weeklyReset = test['Response']['2029743966']['activities'];
    for (let i = 0; i < vgList.length; i++) {
        vgInfo[vgList[i]] = weeklyReset[i];
        vgHashes[i] = vgInfo[vgList[i]]['activityHash'] >> 32;
        vgModifier[i] = vgInfo[vgList[i]]['modifierHashes'];
    }

    for(let i=0; i<Object.keys(vgModifier).length; i++) {
        let rippedHash = new Array();
        for(let j=0; j<Object.values(vgModifier[i]).length;j++) {
            rippedHash[j] = Object.values(vgModifier[i])[j] >> 32;
        }        
        vgRippedHashList[i] = rippedHash;
    }
    return {vgHashes,vgRippedHashList};
}

async function getQuery() {
    const db = new sqlite3.Database(conDB['dbLoc'],sqlite3.OPEN_READONLY,()=> {console.log('db CON')});
    if(Object.keys(vgRippedHashList).length < 1) {
        console.log('single');
        db.get(query,hash,(error,result) =>{
                queryResult = JSON.parse(result['json']);
            });
        db.close(()=> {console.log('closed')});
    }
    for(const key in Object.keys(vgRippedHashList)) {
        let objResult = new Object();
        for(const index of vgRippedHashList[key]) {
            objResult[Object.keys(objResult).length] = await promiseQuery(conDB['modifierQuery'],index);
            // db.get(query,index,(error,result)=> {
            //     const modifierTitle = JSON.parse(result['json'])['displayProperties']['name']
            //     objResult[modifierTitle] = JSON.parse(result['json']);
            // })
        }
        queryResult[vgList[key]] = objResult;
    }

    //sqlite3 promise return
    function promiseQuery(query,hash) {
        return new Promise((resolve,reject) => {
                db.get(query,hash,(error,result)=> {
                    if(error) {console.log(error);}
                    resolve(JSON.parse(result['json'])['displayProperties']);
                    // const modifierTitle = JSON.parse(result['json'])['displayProperties']['name']
                    // objResult[modifierTitle] = JSON.parse(result['json']);
                });
        });
    }

    for(const hash of vgHashes) {
        db.get(conDB['activityQuery'], hash, (error, result) => {
            let tuneResult = JSON.parse(result['json']);
            let index = JSON.parse(vgHashes.indexOf(hash));
            try {
                vgDesc[index] = {
                    'displayProperties' : tuneResult['displayProperties'],
                    'reward' : tuneResult['rewards'][0]['rewardItems']
                }
            }
            catch(err) {
                console.log(error);
            }  
        })
    }
    db.close(()=> {console.log('closed')});
    return {vgDesc,queryResult}
}

//server
//express & cors & json parse 
const app = express();
app.use(cors());
const port = process.env.PORT || 8080;

//미들웨어
let middleWare = async function(req,res,next) {
    getInfo();
    getQuery();
    next();
}
app.use(middleWare);
app.get('/test', (req, res,error) => {
    res.send({vgDesc,queryResult});
});

app.listen(port, () => {
    console.log(`running on ${port}`);
});
