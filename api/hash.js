import sqlite3 from 'sqlite3';
import cors from 'cors';
import express from 'express';
import httpResult from './test2.json' assert {type : 'json'};
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
//내가 지금 해야하는거
//1. 레이드 : displayProperties, 주간 레이드는 챌린지 갯수보고 뽑아오기, 근데 어케찾음????????
//2. 공격전 : displayProperties,activity,modifier - 사실상 이거만 빼오면 됨.
//3. 잊구 : modifier,rewards - 이건 또 어케찾음????????
//2029743966 - 공격전
//그리고 이거 완성되면 db.js 대체할거
/**expressJS*/
const server = express();
const port = process.env.PORT || 8080;
/**-------*/

/**sqlite3*/
const conDB = {
    dbLoc : process.env.DBLOACTION || '../db/content.db',
    milestone : `SELECT json FROM DestinyMilestoneDefinition WHERE id IN (?);`,
    modifier : `select json from DestinyActivityModifierDefinition where id IN (?)`,
    activity : `select json from DestinyActivityDefinition where id IN (?)`,
    item : `select json from DestinyInventoryItemDefinition where id (?)`,
};
const vgLevels = ["vgHero", "vgLegend", 'vgMaster', "vgGrandMaster"];
/**---------*/
function getHash(hash) {
    //axios로 불러왔을때를 상정해서 JSON파일을 불러오는걸로 대신함
    //왜냐면 작업하면서 자주 새로고침하면 그만큼 http 요청을 많이 보내야 해서임.
    const data = hash.Response;
    const convertedHash = [];
    Object.keys(data).forEach((val)=> {
        if(data[val]['startDate'] !== undefined) convertedHash[convertedHash.length] = Number(val) >> 32;
    });
    return convertedHash;
}

function queryResult(query,hashes) {
    return new Promise((resovle,reject)=> {
        //query = select json from hashDefinition where id IN (?)
        //hashes = list of numbers, length is 23
        let result = {};
        const multiQuery = query.replace('?',hashes);
        const db = new sqlite3.Database(conDB['dbLoc'], () => console.log('connected'));
        db.all(multiQuery,(err,rows)=>{
            if(err) {reject(err); return;}
            rows.forEach((val,index)=> {
                let {displayProperties} = JSON.parse(val['json']);
                result[displayProperties['name']] = displayProperties;
            });
        });
        db.close(()=>{
            console.log('closed');
            resovle(result);
        });
    });
}
//입력값 검증 - 이거는 함수값 받을때 쓰는 함수, 미완성
function chkInput(val,string,func) {
    if(('/^\d+$/').test(hash) === false && parseInt(hash) !== 0) return;
    if(Array.isArray(val)) return func(string,val);
    if(Number(val) !== NaN) return func(string,val);
    try{
        const result = 'input value is not right, check code again.';
        return console.log(result);
    }catch(error) {
        return console.log(error.message);
    }
}

server.use(cors());
server.get('/', async (req,res)=> {
    //query = select json from hashDefinition where id IN (?)
    //hashes = list of numbers, length is 23
    //milestonetype = 3(raid)
    const hashList = getHash(httpResult); 
    const result = await queryResult(conDB['milestone'],hashList);
    res.send(hashList);

});

server.listen(port, () => {
    console.log(`running on ${port}`);
});
