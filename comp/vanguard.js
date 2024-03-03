import axios from 'axios';
import '../style/main.css';
import {useQuery} from '@tanstack/react-query';

export default function Vanguard() {
    const config = {
        imgUrl: 'https://bungie.net',
        url: 'http://localhost:8080/',
        levels: ['vgHero','vgLegend','vgMaster','vgGrandMaster']
    }
    //reactQuery & state
    //mainComp
    //index for pagination
    const {data,isLoading,error} = useQuery({
        queryKey: ['dataResult'],
        queryFn:async()=> {
            try{
                const data = await axios.get(config['url']);
                return data['data'];
            }catch(error) {
                console.log(error);
            }
        }
    });
    //일단 구현 해야하는거
    //react-query 없이 구현해보기
    if(isLoading) {
        return(
            <div id="main_wrapper" className="mainFlex">
                <h1 className="mapTitle">Loading...</h1>
            </div>
        );
    }

    if(error) {
        return (
            <div id="main_wrapper" className="mainFlex bgImg">
                <h1 className="font">{error}</h1>
            </div>
        );
    }


    if(data) {
        const {description,name} = data['act']['황혼전: 그랜드마스터'];
        const style = {
            backgroundImage:`url(${config['imgUrl']}${data['act']['bgImg']})`,
            backgroundSize:'cover',
            backgroundPosition:'50% 50%',
        }
       return(
        <div id="main_wrapper" className='main_grid' style={style}>
            <span id='main_title' className='main_flex'>{description}<br />{name}</span>
            <section id='main_modifier' className='main_flex'>
                {Object.values(data['mod']).map((val,index)=> {
                    const {icon,name,description} = val;
                    if(description.length === 0) return;
                    return(
                        <article key={index} className='modifiers'>
                            <img key={index} className='main_icon' src={config['imgUrl']+icon} alt={name} />
                        </article>
                    )
                })}
            </section>
            <section id='main_reward' className='main_flex'>
                {config['levels'].map((val)=> {
                    return(
                    <section className="main_flex">
                        <img src='#' alt='보상이미지' />
                        <span>index <br />{val}</span>
                    </section>)
                })}
            </section>
        </div>
       );
    }

    return (
        <div id="wrpMain" className="flexRow">
            <h1>data : null</h1>
        </div>
    )
}
