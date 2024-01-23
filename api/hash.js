import sqlite3 from 'sqlite3';
import cors from 'cors';
import express from 'express';
import httpResult from './test.json' assert {type : 'json'};
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
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
    item : `select json from DestinyInventoryItemDefinition where id IN (?)`,
};
const vgLevels = ["vgHero", "vgLegend", 'vgMaster', "vgGrandMaster"];
/**---------*/
function getHash(hash) {
    //만약 axios로 불러왔다고 가정했을때
    const data = hash.Response;
    const convertedHash = [];
    Object.keys(data).forEach((val)=> {
        if(data[val]['startDate'] !== undefined) convertedHash[convertedHash.length] = Number(val) >> 32;
    });
    return convertedHash;
}

function queryResult(query,hashes) {
    const result = {};
    //query = select json from hashDefinition where id IN (?)
    //hashes = list of numbers, length is 23 
    const db = new sqlite3.Database('../db/content.db',()=>console.log('connnect'));
    db.all(query,[hashes],(err,rows)=> {
        if(err) throw(err);
        if(rows.length !== 0) {
            rows.forEach((val,index)=> {
                const {description,name,icon} = JSON.parse(val['json'])['displayProperties'];
            });
        }
        console.log('wtf is wrong with rows');
    });
    db.close(()=> {console.log('close')});
    return result;
}

server.use(cors());
server.get('/', async (req,res)=> {
    const hashList = getHash(httpResult);
    const result = queryResult(conDB['milestone'],hashList);
    res.send(result);
});

server.listen(port, () => {
    console.log(`running on ${port}`);
});