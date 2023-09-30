import '../style/main.css';

function Main() {
    return(
        <div id="mainWrapper" className='flex'>
            <div id="modalNightfall" className='flex'>
                <h1 id="mapTitle" className='font'>title</h1>
                <p id="mapDesc" className='font'>부제</p>
                <p id="mapModifier" className='font'>
                    <span>modifer goes here. annnnnd I have to get these hashes fuck.</span>
                </p>
            </div>
            <div id="modalReward">
                <p>보상 정보</p>
            </div>
        </div>
    )
}
export default Main;