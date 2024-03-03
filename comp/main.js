import '../style/main.css';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
export default function Main() {
    /**넣을것들 */
    /** - 현재 시즌 */
    /** - 현재 남은시간*/
    /** 넣고싶은 것들*/
    /** - 번지 블로그 RSS*/
    // https://deepsight.gg/manifest/DeepsightDropTableDefinition.json
    //test
    //test2
    //Axios config
    const curSeason = '소원의 시즌';
    const curDate = new Date();
    const date = `${curDate.getFullYear()}-${curDate.getMonth()}-${curDate.getDay()}`;
    const seasonStart = new Date('2023-11-29');
    const seasonEnd = new Date('2024-06-05');
    const remain = setStr(Math.ceil((seasonEnd-seasonStart)/3600/1000/24));
    const config = {
        method: 'get',
        test: 'https://dummyjson.com/products',
    };
    //날짜 문자열로 바꾸는 함수
    //ㅅㅂ 더 나은 방법이 있을텐데
    function setStr(date) {
        return JSON.stringify(date);
    }


    //일단 데이터 불러와야 야하는거
    //1. deepsight.gg - https://deepsight.gg/manifest/DeepsightDropTableDefinition.json
    //2. bungieAPI news RSS - 
    const {data,isLoading,error} = useQuery({
        queryKey:['data'],
        queryFn:async()=> {
            try{
                const data = await axios.get(config['test']);
                return data['data'];
            }catch(err) {
                console.log(error);
            }
        }
    });
    if(isLoading) {
        return(
        <section id='main_loading'>
            <h2 className='font'>Loading...</h2>
        </section>)
    }
    if(error) {
        console.log(error.message);
    }
    if(data) {
        const products = data['products'];
        return(
        <section id='main_wrapper' className='main_grid'>
            <article id='main_title' className='main_flex'>
                <p>{curSeason}</p>
            </article>
            <article id='main_season' className='main_flex'>
                <p>시즌 시작 : {setStr(seasonStart)}</p>
                <p>시즌 종료 : {setStr(seasonEnd)}</p>
                <p>시즌 종료까지 {remain}일</p>
            </article>
            <article id='main_blog' className='main_flex'>
            <button type='button' onClick={btnAction()}>Prev</button>
            <button type='button' onClick={btnAction()}>Next</button>
            {
                Object.values(products).map((val,index)=> {
                    if(index > 3) return;
                    return (
                    <>
                        <BlogPost index={index} data={val}/>
                    </>)
                })
            }
            </article>
        </section>
        );
    }    
}

function btnAction(val) {
    //prev
    //next
    return val;
}


function BlogPost(val) {
    const {id,title,thumbnail,description} = val['data'];
    return(
    <>
        <a key={id} herf="#" className="main_article main_flex">
            <img  className='main_img' src={thumbnail} alt={title}/>
            <article  className='main_flex'>
                <span  className='main_desc font'>{description}</span>
                <span  className='main_title font'>{title}</span>
            </article>
        </a>
    </>
    );
}
