import axios from 'axios';
import '../style/main.css';
import {useEffect,useState,props} from 'react';
// import {createBrowserRouter,RouterProvider} from "react-router-dom";
import {useQuery} from '@tanstack/react-query';

//축약어 리스트
//vg : vanGuard(공격전)
//md : Modifier(모디파이어)
//cmp : component(컴포넌트)
//queryClient component;


//고려사항
//api 숨기기
//전역변수 설계

//전역변수
const config = {
    imgUrl: 'https://bungie.net',
    url: 'http://localhost:8080/test'
}

//reactQuery getQuery
// function getQuery() {
//     const {data,isLoading} = useQuery({
//         queryKey: ['dataResult'],
//         queryFn:async()=> {
//             const result = await axios.get(config['url']);
//             return result['data'];
//         }
//     });
//     return {data,isLoading};
// }


function Main() {
    //reactQuery & state
    //mainComp
    const {data,isLoading,error} = useQuery({
        queryKey: ['dataResult'],
        queryFn:async()=> {
            try{
                const result = await axios.get(config['url']);
                return result['data'];
            }catch(error) {
                console.log(error);
            }
        }
    });
    //vanguard Component
    //map() 함수 혹은 비슷한 함수들을 사용해 모디파이어 & 보상 아이콘 이미지 출력
    //같이 사용될 함수는 일단 하나의 함수로 묶어버리기
    // function getRender(data,element) {
    //     const renderValue = data;
    //     let output = [];
    //     for(const [level,desc] of Object.entries(data)) {
    //         for(cosnt [index,value] of Object.entries(desc)) {
    //             output.push(<element key={index} alt={desc['name']} src={config['imgUrl']+value['icon']} className='icModifier flex' />)
    //         }
    //     }
    //     return output;
    // }


    function CmpModifier() {
        const vgModifier = data['modifier']['vgHero'];
        let output=[];
        for(const [index,value] of Object.entries(vgModifier)) {
            if(value['name']) {
            output.push(<img key={index} alt={value['name']} src={config['imgUrl']+value['icon']} className='icModifier flex'/>)
        }}
        return(
            <div id="wrpModifier" className="border">
                {output}
            </div>
        )
    }

    function CmpReward() {
        //난이도별 모디파이어 추출
        const vgReward = data['rewards']['vgHero'];
        let output=[];
        for(const [index,value] of Object.entries(vgReward)) {
            if(value['name']) {
                output.push(<img key={index} alt={value['name']} src={config['imgUrl']+value['icon']} className='icReward flex'/>)
            }
        }
        return (
            <div id="wrpReward" className="border">
                {output}       
            </div>
        )
    }
    //dataSet: data 종류(modifier,level,etc...)
    //status: style 지정용 class이름(icModifier,icReward)
    //level: 공격전 난이도(vgHero,vgLevend,vgMaster,vgGrandMaster)
    function RenderComponent(dataSet,level,status) {
        const result = data[dataSet][level];
        const state = status;
        const output=[];

        for(const [index,value] of Object.entries(result)) {
            if(value['name']) {
                output.push(<img key={index} alt={value['name']} src={config['imgUrl']+value['icon']} className='ic' />)
            }
        }
        return(
            <div id={state} className='border flex'>
                {output}
            </div>
        )
    }   
    //subComp - crucible(예정)
    //subComp - raid(예정)
    if(isLoading) {
        return(
            <div id="wrpMain" className="flex">
                <h1 className="mapTitle">Loading...</h1>
            </div>
        );
        //고려사항
        //로딩시간이 길어진다면?
        //로딩 중 로딩게이지 말고 뭘 더 보여줘야하나?
    }

    if(error) {
        return (
            <div id="wrpMain" className="flex bgImg">
                <h1 className="mapTitle">{error}</h1>
            </div>
        )
        //고려사항
        //에러케이스 세분화
        //http 에러코드별 분류
        //겉은 에러메세지, 에러정보를 서버에 전송해야 한다.
    }

    if(data) {
        return(
            <div id="wrpMain" className="flexRow bgImg">
                <h1 id="mapTitle">{data['style']['title']}</h1>
                {RenderComponent('modifier','vgHero','wrpModifier')}
                {RenderComponent('rewards','vgHero','wrpReward')}
            </div>
        )
    }

    return (
        <div id="wrpMain" className="flexRow bgImg">
            <h1>data : null</h1>
        </div>
    )
    
};
export default Main;
