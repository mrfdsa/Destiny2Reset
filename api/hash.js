import sqlite3 from 'sqlite3';
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
// import { connect, config } from './bungie.js';
import test from './test.json' assert {type : 'json'};
dotenv.config({ path: '../.env' });


//고려사항
//api키는 github에서 숨길수는 있는데 어떻게 숨김???????
//nextJS 마이그레이션


//해야하는 것
//잊혀진구역 & 주간레이드 정보 모으기

//해쉬추출
// const result = await connect(config);
// const weeklyReset = result['data']['Response']['2029743966']['activities'];
//전역변수
const conDB = {
    dbLoc : process.env.DBLOACTION || '../db/content.db',
    milestone : `select json from DestinyMilestoneDefinition where id = ?`,
    modifier : `select json from DestinyActivityModifierDefinition where id = ?`,
    activity : `select json from DestinyActivityDefinition where id = ?`,
    item : `select json from DestinyInventoryItemDefinition where id = ?`,
};
const vgLevels = ["vgHero", "vgLegend", 'vgMaster', "vgGrandMaster"];


//vgInfo : divide weeklyReset by difficulty
//vgHashes : calculated hashes from weeklyReset - activityHash
//vgRippedModifier : modifierHashList from vgInfo
async function getInfo() {
    let vgInfo={},vgRippedHashList={},vgRippedModifier = {}
    let vgHashes = [];
    const weeklyReset = await test['Response']['2029743966']['activities'];
    for (let i = 0; i < vgLevels.length; i++) {
        vgInfo[vgLevels[i]] = weeklyReset[i];
        vgHashes[i] = vgInfo[vgLevels[i]]['activityHash'] >> 32;
        vgRippedModifier[i] = vgInfo[vgLevels[i]]['modifierHashes'];
    }
    // 이 부분을 축약할 방법?
    for(let i=0; i<Object.keys(vgRippedModifier).length; i++) {
        let rippedHash = new Array();
        for(let j=0; j<Object.values(vgRippedModifier[i]).length;j++) {
            rippedHash[j] = Object.values(vgRippedModifier[i])[j] >> 32;
        }
        vgRippedHashList[i] = rippedHash;
    }
    return {vgHashes,vgRippedHashList};
}
// function getRippedModifierList(hashes) {
//     for(let i=0; i<Object.keys(vgRippedModifier).length; i++) {
//         let rippedHash = new Array();
//         for(let j=0; j<Object.values(vgRippedModifier[i]).length;j++) {
//             rippedHash[j] = Object.values(vgRippedModifier[i])[j] >> 32;
//         }
//         vgRippedHashList[i] = rippedHash;
//     }
//     return hashes;
// }

async function getQuery() {
    const infoResult = await getInfo();
    const db = new sqlite3.Database(conDB['dbLoc'],sqlite3.OPEN_READONLY,()=> {console.log('db CON')});
    let vgDesc = {};
    let modifierResult = {};
    let rippedItemHash = {};
    let itemRewards = {};
    let style = {};
    let wtf = Object.keys(test["Response"]);
    for(const hash of infoResult['vgHashes']) {
        db.get(conDB['activity'], hash, (error, result) => {
            if(infoResult['vgHashes'].indexOf(hash) === 0) {
                const tuneResult = JSON?.parse(result['json']);
                style = {
                    bgImage : tuneResult['pgcrImage'],
                    title : tuneResult['displayProperties']['description'],
                    icon : tuneResult['displayProperties']['icon']
                };
            }
            const tuneResult = JSON?.parse(result['json']);
            const index = JSON?.parse(infoResult['vgHashes'].indexOf(hash));
            vgDesc[index] = tuneResult['displayProperties']['name'];
            rippedItemHash[index] = tuneResult['rewards'][0]['rewardItems'];
        });
    }
    //modifier
    for(const keys of Object.keys(infoResult['vgRippedHashList'])) {
        let objResult = {};
        // for(const index of infoResult['vgRippedHashList'][key]) {
        //     console.log(index);
        //     objResult[Object.keys(objResult).length] = await returnQuery(conDB['modifierQuery'],index);
        // }
        for(const index in infoResult['vgRippedHashList'][keys]) {
            const result = await returnQuery(conDB['modifier'],infoResult['vgRippedHashList'][keys][index]);
            objResult[index] = {
                name : result['name'],
                desc : result['description'],
                icon : result['icon']
            }
        }
        modifierResult[vgLevels[keys]] = objResult;
    }
    //reward
    for(const key of Object.keys(rippedItemHash)) {
        let queryResult = {};
        for(const index in rippedItemHash[key]) {
            // await returnQuery(conDB['modifierQuery'],infoResult['vgRippedHashList'][key][index])
            let modifiedHash = rippedItemHash[key][index]['itemHash'] >> 32;
            queryResult[index] = await returnQuery(conDB['itemQuery'],modifiedHash);
        };
        itemRewards[vgLevels[key]] = queryResult;
    };

    //promise return from modifiers
    function returnQuery(query,hash) {
        return new Promise((resolve,reject) => {
            db.get(query,hash,(error,result)=> {
                if(error) {console.log(error);}
                resolve(JSON.parse(result['json'])['displayProperties']);
            });
        });
    }
    db.close(()=> {console.log('closed')});
    // return {vgDesc,modifierResult,itemRewards,style};
    return wtf;
}

//server
//express & cors & json parse 
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.get('/test', (req, res,error) => {
    const hashList = returnHash();
    res.send(hashList);
    // res.send({desc : result['vgDesc'],style: result['style'],modifier : result['modifierResult'], rewards: result['itemRewards'] });
});

app.listen(port, () => {
    console.log(`running on ${port}`);
});
