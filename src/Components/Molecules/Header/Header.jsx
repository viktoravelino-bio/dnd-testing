import { useStoreState } from 'pullstate';
import { AppStore } from '../../../stores/AppStore';
import { getAuth, signOut } from 'firebase/auth';
import './Header.css';
const Header = () => {
    const store = useStoreState(AppStore);

    const showMenu = () => {
        console.log('showMenu');
        document.querySelector('.header__user__menu').classList.toggle('open');
    };
    const logout = () => {
        console.log('logout');
        signOut(getAuth());
    };
    return (
        <div className='header'>
            <div className='header__left'>
                <div className='header__logo'>Kanbam! 💥</div>
            </div>
            <div className='header__right'>
                <div className='header__user'>
                    <button className='header__user__button' onClick={() => showMenu()}>
                        <img src={store.user.photoURL} alt='user' className='header__user__image' />
                    </button>
                    <div className='header__user__menu'>
                        <div className='header__user__menu__item email'>{store.user.email}</div>
                        <div className='header__user__menu__item logout' onClick={() => logout()}>
                            Logout
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
