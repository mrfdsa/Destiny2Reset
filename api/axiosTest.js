import weeklyInfo from './test.json' assert {type: 'json'};
import d2ContentInfo from '../db/content.json' assert {type: 'json'};
import express from 'express';
import cors from 'cors';
//2029743966 activities

//변수명 정리
/** weeklyVgInfo : 주간 공격전*/
/** modifierInfo : 난이도별 공격전 모디파이어*/
/** activityHashTable : modifierInfo - activity HashTable*/
/** modifierHashInfo : weeklyVgInfo - modifierHashes*/
let weeklyVgInfo = new Object(weeklyInfo['Response']['2029743966']['activities']);
let contentModifierInfo = new Object(d2ContentInfo['DestinyActivityModifierDefinition']);
let activityTitleInfo = new Object(d2ContentInfo['DestinyActivityDefinition']);
let activityHashTable = {};
let modifierHashTable = {};
let modifierInfo= {};
let title = {};
const app = express();
const port = 8000;

let corsOpt = {
    'url' : 'http://localhost:8080',
    'method' : 'get',
    Credentials: true
}

app.use(cors(corsOpt));
app.get('/test', (req, res) => {
    getVgName();
    getHashTable();
    getModifierInfo();
    res.send(title);
});

app.listen(port, () => {
    console.log('app listening via port', port);
});

//공격전 정보
function getVgName() {
    const titleHash = weeklyVgInfo[0]["activityHash"];
    title['title'] = activityTitleInfo[titleHash]['displayProperties'];
    title['bgImage'] = activityTitleInfo[titleHash]['pgcrImage'];
    return title;
}

//공격전 난이도정보, 모디파이어 해쉬테이블 생성
function getHashTable() {
    for (let i = 0; i < weeklyVgInfo.length; i++) {
        activityHashTable[i] = weeklyVgInfo[i]["activityHash"];
        modifierHashTable[i] = weeklyVgInfo[i]["modifierHashes"];
    }
    return {activityHashTable, modifierHashTable}
}

//모디파이어 정보 객체저장
function getModifierInfo() {
    let modifierDetailInfo = [];
    for(let i=0; i<Object.keys(modifierHashTable).length; i++) {
        for(let j=0; j<modifierHashTable[i].length; j++) {
            const isExist = Boolean(contentModifierInfo[modifierHashTable[i][j]]);
            if(isExist) {
                modifierDetailInfo[j] = contentModifierInfo[modifierHashTable[i][j]];  
        }}
        modifierInfo[i] = [...modifierDetailInfo];
        modifierDetailInfo = [];
    }
    return modifierInfo;
}

//해쉬 추출
//공격전 모디파이어
//sqlite에서 공격전 정보 불러오기
function getModifierInfo() {
    console.log('3');
    //db연결 & 객체
    const db = new sqlite3.Database(conDB['dbLoc'],sqlite3.OPEN_READONLY,(err)=> {
        if(err) {
            console.log('error');
        }else {
            console.log('connected to db2');
        }
    });
    let rippedHashList = [];
    let modifierHashList = {};
    //해쉬추출
    //2중배열 가능하면 다른걸로 고칠것
    // for(const key in Object.keys(vgDesc)) {
    //     vgDesc[key]['modifiers'].forEach((hashes)=> {
    //         if(hashes['activityModifierHash'] != 1783825372) {
    //             let alternative = hashes['activityModifierHash']>>32;
    //             rippedHashList.push(alternative);
    //         }
    //     })
    //     modifierHashList[key] = rippedHashList;
    //     rippedHashList = [];
    // }
    return modifierList;
}

//코드 찌꺼기



//db.get promise return
// async function DB(query,hash) {
//     const db = new sqlite3.Database(conDB['dbLoc'], sqlite3.OPEN_READONLY,(err)=> {
//         console.log('db connected');
//     })
//     async function wtfIamDoing(query,hash) {
//       if(Object.keys(hash).length !== 1) {
//         db.get(query,hash,(err,result)=> {
//             queryResult = JSON.parse(result['json']);
//         })
//         db.close();
//       }
//     }
    
    //만약 루프를 돌려야 하는 상황이 있다면?
    
//     return queryResult;
// }
