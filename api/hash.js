import sqlite3 from 'sqlite3';
import cors from 'cors';
import express from 'express';
import httpResult from './test2.json' assert {type : 'json'};
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
//내가 지금 해야하는거
//1. 레이드 : displayProperties, 주간 레이드는 챌린지 갯수보고 뽑아오기, 근데 어케찾음????????,근데 굳이 정보 뽑아와야함?????? ===> 그냥 한꺼번에 다 출력하기 ㅅㅂ
//2. 공격전 : displayProperties,activity,modifier - 사실상 이거만 빼오면 됨.
//3. 잊구 : modifier,rewards - 이건 또 어케찾음????????
//2029743966 - 공격전
//그리고 이거 완성되면 db.js 대체할거
//일단 해야하는거 : deepsight.gg manifest 땡겨오기
/**expressJS*/
const server = express();
const port = process.env.PORT || 8080;
/**-------*/

/**sqlite3*/
const conDB = {
    dbLoc : process.env.DBLOACTION || '../db/content.db',
    milestone : `SELECT json from DestinyMilestoneDefinition WHERE id IN (?);`,
    modifier : `select json from DestinyActivityModifierDefinition where id IN (?)`,
    activity : `select json from DestinyActivityDefinition where id IN (?)`,
    item : `select json from DestinyInventoryItemDefinition where id (?)`,
};
const vgLevels = ["vgHero", "vgLegend", 'vgMaster', "vgGrandMaster"];
/**---------*/
function getHash(hash) {
    //axios로 불러왔을때를 상정해서 JSON파일을 불러오는걸로 대신함
    //왜냐면 작업하면서 자주 새로고침을 할 때가 많은데 그만큼 http요청을 많이 보내니까 뭔가 거부감듬 ㅎㅎ ㅋㅋ ㅈㅅ;;
    //2024 2 2 - getHash 함수 재작성
    const data = hash.Response;
    const milestone = [];
    const activity = [];
    Object.keys(data).forEach((val)=> {
        const {milestoneHash,activities} = data[val];
        if(data[val]['startDate'] !== undefined && data[val]['activities'] !== undefined) {
            milestone[milestone.length] = Number(milestoneHash) >> 32;
        };
        if(data[val]['activities'] !== undefined) {
            activity[activity.length] = activities.find((val)=>val); 
        }
    });
    // console.log(activityHash[0][0]['activityHash']);
    //해쉬 헤체음미
    return {milestone,activity};
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
    //milestonetype = 3(raid)
    //milestones : weekly activity List
    //hashList : weekly milestone hashList
    //lostsector and raid will be added.
    const vg = {};
    const vgResult = {
        'act' : [],
        'mod' : []
    };
    Object.values(httpResult['Response']['2029743966']['activities']).forEach((val)=> {
        const {activityHash,modifierHashes} = val;
        const modiHashTemp = [];
        modifierHashes.forEach((val,index)=> {
            modiHashTemp[index] = val >> 32;
        });
        vg[(activityHash>>32)] = modiHashTemp;
    });
    vgResult['act'] = await queryResult(conDB['activity'],Object.keys(vg));
    vgResult['mod'] = await queryResult(conDB['modifier'],Object.values(vg));
    res.send(vgResult);
});

function queryResult(query,hashes) {
    return new Promise((resovle,reject)=> {
        //query = select json from hashDefinition where id IN (?)
        //hashes = list of numbers, length is 23
        const result = {};
        const multiQuery=query.replace('?',hashes);
        const db = new sqlite3.Database(conDB['dbLoc'], () => console.log('connected'));
        db.all(multiQuery,(err,rows)=>{
            if(err) {reject(err); return;}
            rows.forEach((val,index)=> {
                const {pgcrImage} = JSON.parse(val['json']);
                if(index == 0 && pgcrImage !== undefined) {
                    result['bgImg'] = pgcrImage;
                }
                const {displayProperties} = JSON.parse(val['json']);
                const {description,name,icon} = displayProperties;
                result[name] = {description,name,icon};
            });
        });
        db.close(()=>{
            console.log('closed');
            resovle(result);
        });
    });
}
server.listen(port, () => {
    console.log(`running on ${port}`);
});
