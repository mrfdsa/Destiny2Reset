import axios from 'axios';
import '../style/main.css';
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
    url: 'http://localhost:8080/test',
    levels: ['vgHero','vgLegend','vgMaster','vgGrandMaster']
}

//reactQuery getQuery
// function getQuery() {
//     const {data,isLoading} = useQuery({
//         queryKey: ['dataResult'],
//         queryFn:async()=> {
//             const result = await axios.get(config['url']);
//             return result['data'];
//         }ww
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
                console.log(result['data']);
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

    // 보상 & 모디파이어 작성한 코드
    // function CmpModifier() {
    //     const vgModifier = data['modifier']['vgHero'];
    //     let output=[];
    //     for(const [index,value] of Object.entries(vgModifier)) {
    //         if(value['name']) {
    //         output.push(<img key={index} alt={value['name']} src={config['imgUrl']+value['icon']} className='icModifier flex'/>)
    //     }}
    //     return(
    //         <div id="wrpModifier" className="border">
    //             {output}
    //         </div>
    //     )
    // }

    // function CmpReward() {
    //     //난이도별 모디파이어 추출
    //     const vgReward = data['rewards']['vgHero'];
    //     let output=[];
    //     for(const [index,value] of Object.entries(vgReward)) {
    //         if(value['name']) {
    //             output.push(<img key={index} alt={value['name']} src={config['imgUrl']+value['icon']} className='icReward flex'/>)
    //         }
    //     }
    //     return (
    //         <div id="wrpReward" className="border">
    //             {output}       
    //         </div>
    //     )
    // }
    //dataSet: data 종류(modifier,level,etc...)
    //status: style 지정용 class이름(icModifier,icReward)
    //level: 공격전 난이도(vgHero,vgLevend,vgMaster,vgGrandMaster)
      
    //subComp - crucible(예정)
    //subComp - raid(예정)
    if(isLoading) {
        return(
            <div id="wrpMain" className="mainFlex">
                <h1 className="mapTitle">Loading...</h1>
            </div>
        );
        //고려사항
        //로딩시간이 길어진다면?
        //로딩 중 로딩게이지 말고 뭘 더 보여줘야하나?
    }

    if(error) {
        return (
            <div id="wrpMain" className="mainFlex bgImg">
                <h1 className="mapTitle">{error}</h1>
            </div>
        )
        //고려사항
        //에러케이스 세분화
        //http 에러코드별 분류
        //겉은 에러메세지, 에러정보를 서버에 전송해야 한다.
    }

    if(data) {
        const url=config['bgUrl']+data['style']['bgImg'];
        const levels = Object.keys(data['modifier']).map((val)=>val);
        function RenderComponent(dataSet,level) {
            const result = data[dataSet][level];
            let elId='';
            let output=[];
            for(const [index,value] of Object.entries(result)) {
                if(result[index]['desc'] !== '') {
                    output.push(<img key={index} alt={value['name']} src={config['imgUrl']+value['icon']} className='ic' />)
                }
            }
            switch(dataSet) {
                case 'modifier':
                    elId='wrpModifier';
                    return(
                        <div id={elId} className='border mainGrid' >
                            {output}
                        </div>
                    );
                case 'rewards':
                    elId='wrpRewards'
                    return(
                        <div id={elId} className='border flexRow'>
                            {output}
                        </div>
                    );
            }
        } 

        if(data) {
        const levels = Object.keys(data['modifier']).map((val)=>val);

        function RenderComponent(dataSet,level) {
            let result = data[dataSet][level];
            let output = [];
            for(const [index,value] of Object.entries(result)) {
                if(result[index]['desc'] !== '') {
                    output.push(<img key={index} alt={value['name']} src={config['imgUrl']+value['icon']} className='ic' />);
                }
            }
            return(
                <div className={`border mainGrid wrp_${dataSet}`} >
                    {output}
                </div>
            );
        } 
        //render render component, wtf??????
        return(
            <div id="wrpMain" className="mainFlexRow bgImg">
                {levels.map((level)=>
                    <div className="wrpInfo mainFlex" key={levels.indexOf(level)}>
                        {config['dataSet'].map((data)=> RenderComponent(data,level))}
                    </div>
                )}
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
