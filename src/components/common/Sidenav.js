import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import Logo from '../../resources/logo.png';
import SmallLogo from '../../resources/logo.svg';
import { connect } from 'react-redux';
import { gapi } from "gapi-script";
import { setCookie } from './common';
import axios from 'axios';

const Sidenav = (props) => {
    const style = {
        userOption: {
            display: 'flex',
            flexDirection: 'row',
            width: 'fit-content'
        },
        logoutHidden: {
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: '#fff',
            borderRadius: '3px',
            width: '0px',
            border: '1px',
            whiteSpace: 'nowrap',
            marginLeft: '12px',
            boxShadow: '0px 4px 5px 0 #00000024',
            zIndex: '0',
            overflow: 'hidden',
            transition: 'width 1.05s',
            // transitionTimingFunction: 'ease-out'

        },
        logoutDisplay: {
            width: '150px',
        },

        firstIcon: {
            marginLeft: '10px'
        },

        iconChoice: {
            marginRight: '10px'
        },

        iconColorActive: {
            color: '#1565c0'
        }
    };

    const iconColor = {
        color: "#3A3A3A"
    };

    const showObj = (e) => {
        let userOption = document.getElementById("user-option");
        Object.assign(userOption.style, style.logoutDisplay);
    };

    const hideObj = () => {
        let userOption = document.getElementById("user-option");
        Object.assign(userOption.style, style.logoutHidden);
    }

    const toTeacher = () => {
        props.dispatch({
            type: "UPDATE_USER", payload: {
                userRoleId: 1
            }
        });
    }
    const toStudent = () => {
        props.dispatch({
            type: "UPDATE_USER", payload: {
                userRoleId: 2
            }
        });
    }
    const toParent = () => {
        props.dispatch({
            type: "UPDATE_USER", payload: {
                userRoleId: 3
            }
        });
    }

    const signOut = () => {
        setCookie("authenticated", "false", -1);
        axios.defaults.headers.common['Authorization'] = null;
        if (props.checkAuthen) {
            props.checkAuthen();
        }

        props.dispatch({ type: "SIGN_OUT", payload: null });
        props.history.push('/');

        // var auth2 = gapi.auth2.getAuthInstance();
        // if (!auth2) {
        //     gapi.client.init({
        //         'clientId': '1072039829865-jc2jf9cv96ifoph4ptpg1840s8n5gg5b.apps.googleusercontent.com',
        //         // 'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
        //         'scope': 'https://www.googleapis.com/auth/userinfo.profile'
        //     }).then(() => {
        //         var auth2 = gapi.auth2.getAuthInstance();
        //         if (auth2) {
        //             setCookie("authenticated", "false", -1);
        //             axios.defaults.headers.common['Authorization'] = null;
        //             if (props.checkAuthen) {
        //                 props.checkAuthen();
        //             }
        //             auth2.signOut().then(() => {
        //                 props.dispatch({ type: "SIGN_OUT", payload: null });
        //                 props.history.push('/');
        //             });
        //         }
        //     });
        // } else {
        //     setCookie("authenticated", "false", -1);
        //     axios.defaults.headers.common['Authorization'] = null;
        //     if (props.checkAuthen) {
        //         props.checkAuthen();
        //     }
        //     auth2.signOut().then(() => {
        //         props.dispatch({ type: "SIGN_OUT", payload: null });
        //         props.history.push('/');
        //     });
        // }
    }


    const link = (path, icon) => {
        return (
            <NavLink to={path} activeClassName="side-nav-active">
                <i className="material-icons padding-vertical-10" style={iconColor}>{icon}</i>
            </NavLink>
        )
    }

    const changeRole = (role, userRoleId) => {
        return (
            <div className="user-option" style={style.userOption} onMouseLeave={hideObj} >
                <NavLink to="/user/personalInfo" >
                    <i onMouseOver={showObj} className="material-icons padding-vertical-10" style={iconColor} >account_circle</i>
                </NavLink>
                <div id="user-option" style={style.logoutHidden}>
                    <i onClick={() => signOut()} className="material-icons padding-vertical-10" style={{ ...style.iconChoice, ...iconColor, ...style.firstIcon, cursor: "pointer" }} >exit_to_app</i>
                    <div className="role-changer" style={{ display: 'flex', flexDirection: 'row' }}>
                        {role === 3 && userRoleId === 1 ?
                            (
                                <i title='Giáo viên' className="material-icons padding-vertical-10" style={{ ...style.iconChoice, ...style.iconColorActive }} >import_contacts</i>
                            ) : (
                                <Link to="/home">
                                    <i title='Giáo viên' className="material-icons padding-vertical-10" onClick={toTeacher} style={{ ...style.iconChoice, ...iconColor }} >import_contacts</i>
                                </Link>
                            )
                        }
                        {role === 3 && userRoleId === 2 ?
                            (<i className="material-icons padding-vertical-10" style={{ ...style.iconChoice, ...style.iconColorActive }} >school</i>
                            ) : (
                                <Link to="/home">
                                    <i className="material-icons padding-vertical-10" onClick={toStudent} style={{ ...style.iconChoice, ...iconColor }} >school</i>
                                </Link>
                            )
                        }
                        {role === 3 && userRoleId === 3 ?
                            (
                                <i className="material-icons padding-vertical-10" style={{ ...style.iconChoice, ...style.iconColorActive }} >people_alt</i>
                            ) : (
                                <Link to="/home">
                                    <i className="material-icons padding-vertical-10" onClick={toParent} style={{ ...style.iconChoice, ...iconColor }} >people_alt</i>
                                </Link>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            {props.isAuthenticated && props.user.role === 3 && props.user.userRoleId === 1 &&
                <div className="my-sidenav z-depth-2 white">
                    <Link exact to='/home'>
                        <div className='side-nav-logo' >
                            <img src={SmallLogo} alt="HGEdu Logo" style={{ width: "20px", marginTop: "-5vh" }} />
                        </div>
                    </Link>
                    <div className="flex-column">
                        <Link className="sidenav-trigger" data-target='sidenavUserTeacher'>
                            <i className="material-icons padding-vertical-10" style={iconColor}>menu</i>
                        </Link>
                        {link("/home", "home")}

                        {link("/personalLibrary", "library_books")}

                        {link("/abbreviationLibrary", "border_color")}

                        {link("/studentManagement", "group")}

                        {link("/examManagement", "check_box")}
                    </div>
                    {changeRole(props.user.role, props.user.userRoleId)}
                </div>
            }
            {props.isAuthenticated && props.user.role === 3 && props.user.userRoleId === 2 &&
                <div className="my-sidenav z-depth-2 white">
                    <Link exact to='/home'>
                        <div className='side-nav-logo' >
                            <img src={SmallLogo} alt="HGEdu Logo" style={{ width: "20px", marginTop: "-7vh" }} />
                        </div>
                    </Link>
                    <div className="flex-column">
                        <Link className="sidenav-trigger" data-target='sidenavUserStudent'>
                            <i className="material-icons padding-vertical-10" style={iconColor}>menu</i>
                        </Link>
                        <NavLink to="/home" activeClassName="side-nav-active">
                            <i className="material-icons padding-vertical-10" style={iconColor}>home</i>
                        </NavLink>
                        <NavLink to="/studentManagement" activeClassName="side-nav-active">
                            <i className="material-icons padding-vertical-10" style={iconColor}>people</i>
                        </NavLink>
                        <NavLink to='/studentExams' activeClassName="side-nav-active">
                            <i className="material-icons padding-vertical-10" style={iconColor}>check_box</i>
                        </NavLink>
                    </div>
                    {/* <div className="user-option" style={style.userOption} onMouseLeave={hideObj} >
                        <NavLink to="/user" >
                            <i onMouseOver={showObj} className="material-icons padding-vertical-10" style={iconColor} >account_circle</i>
                        </NavLink>
                    </div> */}
                    {changeRole(props.user.role, props.user.userRoleId)}
                </div>
            }
            {props.isAuthenticated && props.user.role === 3 && props.user.userRoleId === 3 &&
                <div className="my-sidenav z-depth-2 white">
                    <Link exact to='/home'>
                        <div className='side-nav-logo' >
                            <img src={SmallLogo} alt="HGEdu Logo" style={{ width: "20px", marginTop: "-7vh" }} />
                        </div>
                    </Link>
                    <div className="flex-column">
                        <Link className="sidenav-trigger" data-target='sidenavUserParent'>
                            <i className="material-icons padding-vertical-10" style={iconColor}>menu</i>
                        </Link>
                        <NavLink to="/home" activeClassName="side-nav-active">
                            <i className="material-icons padding-vertical-10" style={iconColor}>home</i>
                        </NavLink>
                        <NavLink to='/studentManagement' activeClassName="side-nav-active">
                            <i className="material-icons left padding-vertical-10" style={iconColor}>group</i>
                        </NavLink>
                    </div>
                    {changeRole(props.user.role, props.user.userRoleId)}
                </div>
            }
            {props.isAuthenticated && props.user.role === 2 &&
                <div className="my-sidenav z-depth-2 white">
                    <Link exact to='/home'>
                        <div className='side-nav-logo' >
                            {/* <p className="brand-logo blue-text text-darken-3 bold">HGE</p> */}
                            <img src={SmallLogo} alt="HGEdu Logo" style={{ width: "20px", marginTop: "-7vh" }} />
                        </div>
                    </Link>
                    <div className="flex-column">
                        <Link className="sidenav-trigger" data-target='sidenavMod'>
                            <i className="material-icons padding-vertical-10" style={iconColor}>menu</i>
                        </Link>
                        <NavLink to="/home" activeClassName="side-nav-active">
                            <i className="material-icons padding-vertical-10" style={iconColor}>home</i>
                        </NavLink>
                        <NavLink to='/newsList' activeClassName="side-nav-active">
                            <i className="material-icons padding-vertical-10" style={iconColor}>event</i>
                        </NavLink>
                    </div>
                    {/* <NavLink to="/user">
                        <i className="material-icons padding-vertical-10" style={iconColor}>account_circle</i>
                    </NavLink> */}
                    <div className="user-option" style={style.userOption} onMouseLeave={hideObj} >
                        <NavLink to="/user" >
                            <i onMouseOver={showObj} className="material-icons padding-vertical-10" style={iconColor} >account_circle</i>
                        </NavLink>
                        <div id="user-option" style={style.logoutHidden}>
                            {/* <a href="#" onClick={() => signOut()}> */}
                            <i onClick={() => signOut()} className="material-icons padding-vertical-10" style={{ ...style.iconChoice, ...iconColor, ...style.firstIcon, cursor: "pointer" }} >exit_to_app</i>
                            {/* </a> */}
                            {/* <Link to="/home/logout"><i className="material-icons padding-vertical-10" style={{ ...style.iconChoice, ...iconColor }} >person_pin</i></Link>

                            <div class="role-changer" style={{ display: 'flex', flexDirection: 'row' }}>
                                <Link to="/home/logout"><i className="material-icons padding-vertical-10" style={{ ...style.iconChoice, ...iconColor }} >person</i></Link>
                                <Link to="/home/logout"><i className="material-icons padding-vertical-10" style={{ ...style.iconChoice, ...iconColor }} >people_alt</i></Link>
                            </div> */}
                        </div>
                    </div>
                </div>
            }
            {props.isAuthenticated && props.user.role === 1 &&
                <div className="my-sidenav z-depth-2 white">
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
                        {link("/home", "home")}

                        {link("/userManagement", "group")}
                    </div>
                    <div className="user-option" style={style.userOption} onMouseLeave={hideObj} >
                        <NavLink to="/user" >
                            <i onMouseOver={showObj} className="material-icons padding-vertical-10" style={iconColor} >account_circle</i>
                        </NavLink>
                        <div id="user-option" style={style.logoutHidden}>
                            {/* <a href="#" onClick={() => signOut()}> */}
                            <i onClick={() => signOut()} className="material-icons padding-vertical-10" style={{ ...style.iconChoice, ...iconColor, ...style.firstIcon, cursor: "pointer" }} >exit_to_app</i>
                            {/* </a> */}
                            {/* <Link to="/home/logout"><i className="material-icons padding-vertical-10" style={{ ...style.iconChoice, ...iconColor }} >person_pin</i></Link>

                            <div class="role-changer" style={{ display: 'flex', flexDirection: 'row' }}>
                                <Link to="/home/logout"><i className="material-icons padding-vertical-10" style={{ ...style.iconChoice, ...iconColor }} >person</i></Link>
                                <Link to="/home/logout"><i className="material-icons padding-vertical-10" style={{ ...style.iconChoice, ...iconColor }} >people_alt</i></Link>
                            </div> */}
                        </div>
                    </div>
                </div>
            }
            <ul className="sidenav" id='sidenavUserTeacher'>
                <div className="my-sidenav-big container white">
                    <Link to='/home'>
                        <div className='side-nav-logo flex-row' >
                            <img src={Logo} alt="HGEdu Logo" />
                        </div>
                    </Link>
                    <div className="flex-column">
                        <Link className="sidenav-trigger" data-target='sidenavUserTeacher'>
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
                        <NavLink to='/examManagement' className='flex-row' activeClassName="side-nav-active">
                            <i className="material-icons left padding-vertical-10" style={iconColor}>check_box</i>
                            <span style={iconColor}>Quản lí kiểm tra</span>
                        </NavLink>
                    </div>
                    <NavLink className='flex-row' to='/user'>
                        <i className="material-icons left padding-vertical-10" style={iconColor}>account_circle</i>
                        <span style={iconColor}>Người dùng</span>
                    </NavLink>
                </div>
            </ul>
            <ul className="sidenav" id='sidenavUserStudent'>
                <div className="my-sidenav-big container white">
                    <Link to='/home'>
                        <div className='side-nav-logo flex-row' >
                            <img src={Logo} alt="HGEdu Logo" />
                        </div>
                    </Link>
                    <div className="flex-column">
                        <Link className="sidenav-trigger" data-target='sidenavUserStudent'>
                            <i className="material-icons blue-text text-darken-2 padding-vertical-10">menu</i>
                        </Link>
                        <NavLink to="/home" className='flex-row' activeClassName="side-nav-active">
                            <i className="material-icons left padding-vertical-10" style={iconColor}>home</i>
                            <span style={iconColor}>Trang chủ</span>
                        </NavLink>
                        <NavLink to="/studentManagement" className='flex-row' activeClassName="side-nav-active">
                            <i className="material-icons padding-vertical-10" style={iconColor}>people</i>
                            <span style={iconColor}>Lớp học</span>
                        </NavLink>
                        <NavLink to='/studentExams' className='flex-row' activeClassName="side-nav-active">
                            <i className="material-icons left padding-vertical-10" style={iconColor}>check_box</i>
                            <span style={iconColor}>Kiểm tra</span>
                        </NavLink>
                    </div>
                    <NavLink className='flex-row' to='/user'>
                        <i className="material-icons left padding-vertical-10" style={iconColor}>account_circle</i>
                        <span style={iconColor}>Người dùng</span>
                    </NavLink>
                </div>
            </ul>
            <ul className="sidenav" id='sidenavUserParent'>
                <div className="my-sidenav-big container white">
                    <Link to='/home'>
                        <div className='side-nav-logo flex-row' >
                            <img src={Logo} alt="HGEdu Logo" />
                        </div>
                    </Link>
                    <div className="flex-column">
                        <Link className="sidenav-trigger" data-target='sidenavUserParent'>
                            <i className="material-icons blue-text text-darken-2 padding-vertical-10">menu</i>
                        </Link>
                        <NavLink to="/home" className='flex-row' activeClassName="side-nav-active">
                            <i className="material-icons left padding-vertical-10" style={iconColor}>home</i>
                            <span style={iconColor}>Trang chủ</span>
                        </NavLink>
                        <NavLink to='/studentManagement' className='flex-row' activeClassName="side-nav-active">
                            <i className="material-icons left padding-vertical-10" style={iconColor}>group</i>
                            <span style={iconColor}>Quản lí lớp học</span>
                        </NavLink>
                    </div>
                    <NavLink className='flex-row' to='/user'>
                        <i className="material-icons left padding-vertical-10" style={iconColor}>account_circle</i>
                        <span style={iconColor}>Người dùng</span>
                    </NavLink>
                </div>
            </ul>
            <ul className="sidenav" id='sidenavMod'>
                <div className="my-sidenav-big container white">
                    <Link to='/home'>
                        <div className='side-nav-logo flex-row' >
                            <img src={Logo} alt="HGEdu Logo" />
                        </div>
                    </Link>
                    <div className="flex-column">
                        <Link className="sidenav-trigger" data-target='sidenavMod'>
                            <i className="material-icons blue-text text-darken-2 padding-vertical-10">menu</i>
                        </Link>
                        <NavLink to="/home" className='flex-row' activeClassName="side-nav-active">
                            <i className="material-icons left padding-vertical-10" style={iconColor}>home</i>
                            <span style={iconColor}>Trang chủ</span>
                        </NavLink>
                        <NavLink to='/newsList' className='flex-row' activeClassName="side-nav-active">
                            <i className="material-icons left padding-vertical-10" style={iconColor}>event</i>
                            <span style={iconColor}>Quản lí bài đăng</span>
                        </NavLink>
                    </div>
                    <NavLink className='flex-row' to='/user'>
                        <i className="material-icons left padding-vertical-10" style={iconColor}>account_circle</i>
                        <span style={iconColor}>Người dùng</span>
                    </NavLink>
                </div>
            </ul>
            <ul className="sidenav" id='sidenavAdmin'>
                <div className="my-sidenav-big container white">
                    <Link to='/home'>
                        <div className='side-nav-logo flex-row' >
                            <img src={Logo} alt="HGEdu Logo" />
                        </div>
                    </Link>
                    <div className="flex-column">
                        <Link className="sidenav-trigger" data-target='sidenavAdmin'>
                            <i className="material-icons blue-text text-darken-2 padding-vertical-10">menu</i>
                        </Link>
                        <NavLink to="/home" className='flex-row' activeClassName="side-nav-active">
                            <i className="material-icons left padding-vertical-10" style={iconColor}>home</i>
                            <span style={iconColor}>Trang chủ</span>
                        </NavLink>
                        <NavLink to='/newsList' className='flex-row' activeClassName="side-nav-active">
                            <i className="material-icons left padding-vertical-10" style={iconColor}>event</i>
                            <span style={iconColor}>Quản lí bài đăng</span>
                        </NavLink>
                    </div>
                    <NavLink className='flex-row' to='/user'>
                        <i className="material-icons left padding-vertical-10" style={iconColor}>account_circle</i>
                        <span style={iconColor}>Người dùng</span>
                    </NavLink>
                </div>
            </ul>
        </div >

    )
}

const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps)(withRouter(Sidenav));