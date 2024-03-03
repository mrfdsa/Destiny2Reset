import '../style/header.css';
import {Outlet,Link} from 'react-router-dom'
function Header() {
    //set nav list & navState
    const navList = ['vanguard','Lost','Raid'];
    //show nested informations
    return(
        <>
            <header id="headerWrapper" className='headerFlex'>
                <Link id="title" className='font navHyper' to='/'>데스티니 정보뷰어</Link>
                <ul id="navigation">
                    {navList.map((val,index) => {
                        return(
                            <li key={index} className='font navList'><Link to={val} key={index} className='navHyper'>{val}</Link></li>
                        )
                    })}
                </ul>
            </header>
            <div id="wrpContent">
               <Outlet />
            </div>
        </>
    )
}
export default Header;
