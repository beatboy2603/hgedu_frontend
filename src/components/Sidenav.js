import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import Logo from './../resources/logo.png';
import SmallLogo from './../resources/logo.svg';
import { connect } from 'react-redux';


const Sidenav = (props) => {

    const iconColor = {
        color: "#3A3A3A"
    }
    return (
        <div>
            {props.user.role == "admin" &&
                <div className="my-sidenav container z-depth-2 white">
                    <Link exact to='/home'>
                        <div className='side-nav-logo' >
                            {/* <p className="brand-logo blue-text text-darken-3 bold">HGE</p> */}
                            <img src={SmallLogo} alt="HGEdu Logo" style={{ width: "20px", marginTop: "-7vh" }} />
                        </div>
                    </Link>
                    <div className="flex-column">
                        <Link className="sidenav-trigger" data-target='sidenavAdmin'>
                            <i className="material-icons padding-vertical-10" style={iconColor}>menu</i>
                        </Link>
                        <NavLink to="/home" activeClassName="side-nav-active">
                            <i className="material-icons padding-vertical-10" style={iconColor}>home</i>
                        </NavLink>
                        <NavLink to="/personalLibrary" activeClassName="side-nav-active">
                            <i className="material-icons padding-vertical-10" style={iconColor}>library_books</i>
                        </NavLink>
                        <NavLink to='/abbreviationLibrary' activeClassName="side-nav-active">
                            <i className="material-icons padding-vertical-10" style={iconColor}>border_color</i>
                        </NavLink>
                        <NavLink to='/studentManagement' activeClassName="side-nav-active">
                            <i className="material-icons padding-vertical-10" style={iconColor}>group</i>
                        </NavLink>
                        <NavLink to='/testManagement' activeClassName="side-nav-active">
                            <i className="material-icons padding-vertical-10" style={iconColor}>check_box</i>
                        </NavLink>
                    </div>
                    <NavLink>
                        <i className="material-icons padding-vertical-10" style={iconColor}>account_circle</i>
                    </NavLink>
                </div>
            }
            <ul className="sidenav" id='sidenavAdmin'>
                <div className="my-sidenav-big container white">
                    <Link to='/home'>
                        <div className='side-nav-logo flex-row' >
                            <img src={Logo} alt="HGEdu Logo" />
                        </div>
                    </Link>
                    <div className="flex-column">
                        <Link className="sidenav-trigger" data-target='sidenav'>
                            <i className="material-icons blue-text text-darken-2 padding-vertical-10">menu</i>
                        </Link>
                        <NavLink to="/home" className='flex-row' activeClassName="side-nav-active">
                            <i className="material-icons left padding-vertical-10" style={iconColor}>home</i>
                            <span style={iconColor}>Trang chủ</span>
                        </NavLink>
                        <NavLink to="/personalLibrary" className='flex-row' activeClassName="side-nav-active">
                            <i className="material-icons left padding-vertical-10" style={iconColor}>library_books</i>
                            <span style={iconColor}>Thư viện cá nhân</span>
                        </NavLink>
                        <NavLink to='/abbreviationLibrary' className='flex-row' activeClassName="side-nav-active">
                            <i className="material-icons left padding-vertical-10" style={iconColor}>border_color</i>
                            <span style={iconColor}>Thư viện viết tắt</span>
                        </NavLink>
                        <NavLink to='/studentManagement' className='flex-row' activeClassName="side-nav-active">
                            <i className="material-icons left padding-vertical-10" style={iconColor}>group</i>
                            <span style={iconColor}>Quản lí học sinh</span>
                        </NavLink>
                        <NavLink to='/testManagement' className='flex-row' activeClassName="side-nav-active">
                            <i className="material-icons left padding-vertical-10" style={iconColor}>check_box</i>
                            <span style={iconColor}>Quản lí kiểm tra</span>
                        </NavLink>
                    </div>
                    <NavLink className='flex-row'>
                        <i className="material-icons left padding-vertical-10" style={iconColor}>account_circle</i>
                        <span style={iconColor}>Người dùng</span>
                    </NavLink>
                </div>
            </ul>
        </div>

    )
}

const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps)(withRouter(Sidenav));