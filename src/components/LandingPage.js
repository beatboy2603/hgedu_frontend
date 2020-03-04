import React, { Component } from 'react';
import axios from "axios";
import { GoogleLogin } from 'react-google-login';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { serverUrl, setCookie } from './common/common';
import Logo from '../resources/logo_transparent_2.png';
import LogoTransparent from '../resources/logo_transparent.png';
import BackGroundIMG from '../resources/Landing/0/landing_page.jpg';
import SubPost from './SubPost';
import Landing_1 from '../resources/Landing/1/Landing_1.png';
import Landing_2 from '../resources/Landing/2/Landing_2.png';
import Landing_3 from '../resources/Landing/3/Landing_3.png';
import Landing_4 from '../resources/Landing/4/Landing_4.png';
import Landing_5 from '../resources/Landing/5/Landing_5.png';
import { Carousel } from 'react-materialize';

class LandingPage extends Component {

    state = {
        isLoading: false,
        newsList: [],
        inputVal: "0",
        width: "0px",
    }

    onSignIn = (googleUser) => { }

    // signOut = () => {
    //     let props = this.props;
    //     var auth2 = gapi.auth2.getAuthInstance();
    //     if (auth2) {
    //         auth2.signOut().then(() => {
    //             console.log('User signed out.');
    //             props.dispatch({ type: "SIGN_OUT", payload: null });
    //             this.redirect();
    //         });
    //     }
    // }

    redirect = () => {
        if (this.props.user.role) {
            this.props.history.push('/home');
        } else {
            this.props.history.push('/');
        }
    }

    decodeToken = (token) => {
        return axios.get("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + token)
        // .then(res => {
        //     console.log(res.data);
        //     return res.data;
        // })
    }

    handleLoading = () => {
        this.setState(prevState => ({
            isLoading: !prevState.isLoading,
        }))
    }

    goTo = (e, place) => {
        e.preventDefault();
        window.scroll({ top: document.getElementById(place).offsetTop, left: 0, behavior: 'smooth' })
    }

    componentDidMount() {
        axios.get(serverUrl + 'api/news')
            .then(res => {
                this.setState({ newsList: res.data })
            })
    }

    handleOnChange = (e) => {
        let value = e.target.value;
        let width = value + "px"
        this.setState({
            input: value,
            width: width,
        })
    }

    render() {
        const responseGoogle = (res) => {
            var token = res.tokenObj.id_token;
            console.log(token);
            // let googleToken = this.decodeToken(token);
            axios.post(serverUrl + 'api/authen', {
                token
            }).then(res => {
                console.log(res);
                if (res.data.message == "signup") {
                    console.log("signup");
                    let user = {
                        email: res.data.email,
                        name: res.data.name,
                        picture: res.data.picture,
                        role: 3,
                    }
                    this.props.dispatch({ type: "UPDATE_USER", payload: user });
                    this.props.dispatch({ type: "UPDATE_USER", payload: { googleJwt: token } });
                    this.props.history.push('/signup');
                } else if (res.data.message == "signup-mod") {
                    console.log("signupMod");
                    let user = {
                        email: res.data.email,
                        name: res.data.name,
                        picture: res.data.picture,
                        role: 2,
                    }
                    this.props.dispatch({ type: "UPDATE_USER", payload: user });
                    this.props.dispatch({ type: "UPDATE_USER", payload: { googleJwt: token } });
                    this.props.history.push('/signup');
                } else {
                    let user = res.data.user;
                    let bannedUntil = new Date(user.bannedUntil);
                    let todaysDate = new Date();
                    let dateDifference = Number(todaysDate) - Number(bannedUntil);
                    // console.log("diff", dateDifference);
                    if (!user.isBan || (user.isBan && !user.isBanForever && dateDifference > 0)) {
                        if (user.isBan) {
                            user.isBan = false;
                            axios.post(serverUrl + "api/user/unBanUsers", user).then(res => {
                                console.log("after", res.data);
                            })
                        }
                        // let user = res.data.user;
                        let jwt = res.data.jwt;
                        // this.props.dispatch({ type: "CHANGE_ROLE", payload: user.roleId });
                        this.decodeToken(token).then(res => {
                            let googleToken = res.data;
                            let user = {
                                email: googleToken.email,
                                name: googleToken.name,
                                picture: googleToken.picture,
                                sub: googleToken.sub,
                            }
                            console.log(googleToken.name);
                            this.props.dispatch({ type: "UPDATE_USER", payload: user });
                        })
                        this.props.dispatch({
                            type: "UPDATE_USER", payload: {
                                googleJwt: token,
                                uid: user.userId,
                                phone: user.phoneNumber,
                                gender: user.gender,
                                role: user.roleId,
                                dob: user.dob,
                                school: user.school,
                            }
                        });
                        this.props.dispatch({ type: "UPDATE_JWT", payload: jwt });
                        axios.defaults.headers.common['Authorization'] = "Bearer " + jwt;
                        // axios.interceptors.response.use(function (response) {
                        //     if (response.headers.renewtoken) {
                        //         axios.defaults.headers.common['Authorization'] = "Bearer " + response.headers.renewtoken;
                        //         this.props.dispatch({
                        //             type: "UPDATE_USER", payload: {
                        //                 jwt: response.headers.renewtoken,
                        //             }
                        //         });
                        //     }
                        //     return response;
                        // }, function (error) {
                        //     return Promise.reject(error);
                        // });
                        if (user.roleId === 3) {
                            this.props.history.push('/signin');
                        } else {
                            console.log("alo?");
                            setCookie("authenticated", "true", 1);
                            if (this.props.checkAuthen) {
                                this.props.checkAuthen();
                            }
                            this.props.history.push('/home');
                        }
                    } else {
                        alert("Bạn đang bị ban!");
                    }
                }
                // this.redirect();
            })
        }

        return (
            <div className="row">
                < GoogleLogin
                    clientId="1072039829865-jc2jf9cv96ifoph4ptpg1840s8n5gg5b.apps.googleusercontent.com"
                    scope='https://www.googleapis.com/auth/userinfo.profile'
                    render={renderProps => (
                        <Link onClick={renderProps.onClick} disabled={renderProps.disabled} className='flex-row' style={{ position: "sticky", top: "7vh", paddingLeft: "80vw", marginTop: "-8vh", zIndex: "10" }}>
                            <i className="material-icons left padding-vertical-10 md-36" style={{ color: "#086bd1", fontSize: "30px" }}>account_circle</i>
                            <span style={{ color: "#086bd1", fontSize: "20px" }}>Đăng nhập với Google</span>
                        </Link>
                    )}
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                />
                <div id="slide0" style={{ maxWidth: "100vw", minHeight: "100vh", backgroundImage: `url(${BackGroundIMG})`, backgroundSize: "cover" }}>
                    <img onClick={() => { this.props.history.push('/signup'); }} src={Logo} alt="Logo" style={{ width: "8vw", position: "absolute", top: "5vh", left: "5vw" }} />
                    {/* {!this.props.isAuthenticated && */}

                    {/* } */}
                    <div className="flex-column" style={{ width: "60vw", position: "absolute", top: "35vh", left: "20vw", color: "#ffffff", fontSize: "43px" }}>
                        <p align="center" className="font-montserrat" style={{ margin: "0", padding: "0", color: "#086bd1", fontSize: "43px" }}>MÔI TRƯỜNG LINH HOẠT</p>
                        <p align="center" className="font-montserrat" style={{ margin: "0", padding: "0", color: "#086bd1", fontSize: "43px" }}>KHƠI NGUỒN SÁNG TẠO</p>
                        <p align="center" style={{ color: "#086bd1", fontSize: "30px" }}>Nền tảng giáo dục kết nối giáo viên, học sinh và phụ huynh không giới hạn!</p>
                    </div>
                    <a href="" onClick={e => { this.goTo(e, "slide1") }}>
                        <i className="material-icons" style={{ position: "relative", top: "90vh", left: "47vw", color: "#086bd1", fontSize: "50px" }}>arrow_drop_down_circle</i>
                    </a>
                </div>

                {/* <div id="news" className="container row" style={{ minHeight: "100vh" }}>
                    <div className="col s12 container row">
                        <h5 className="blue-text text-darken-2 bold font-montserrat" style={{ margin: "50px 0 30px 0" }}>Tin tức</h5>
                        {
                            this.state.newsList.length !== 0 &&
                            <Carousel options={{ dist: 0, padding: 0 }} className="white-text center">
                                {this.state.newsList.map((post) =>
                                    <div className="col s4 carousel-item">
                                        <SubPost imgSrc={serverUrl + post.thumbnail}
                                            post={post}
                                            title={post.title}
                                            body={post.description}
                                            view='FULL' />
                                    </div>
                                )}
                            </Carousel>
                        }
                    </div>
                </div> */}

                <div id="slide1" style={{ maxWidth: "100vw", minHeight: "100vh", backgroundImage: `url(${Landing_1})`, backgroundSize: "cover" }}>
                    <a href="" onClick={e => { this.goTo(e, "slide2") }}>
                        <i className="material-icons" style={{ position: "relative", top: "90vh", left: "47vw", color: "#ffffff", fontSize: "50px" }}>arrow_drop_down_circle</i>
                    </a>
                </div>
                <div id="slide2" style={{ maxWidth: "100vw", minHeight: "100vh", backgroundImage: `url(${Landing_2})`, backgroundSize: "cover" }}>
                    <a href="" onClick={e => { this.goTo(e, "slide3") }}>
                        <i className="material-icons" style={{ position: "relative", top: "90vh", left: "47vw", color: "#086bd1", fontSize: "50px" }}>arrow_drop_down_circle</i>
                    </a>
                </div>
                <div id="slide3" style={{ maxWidth: "100vw", minHeight: "100vh", backgroundImage: `url(${Landing_3})`, backgroundSize: "cover" }}>
                    <a href="" onClick={e => { this.goTo(e, "slide4") }}>
                        <i className="material-icons" style={{ position: "relative", top: "90vh", left: "47vw", color: "#086bd1", fontSize: "50px" }}>arrow_drop_down_circle</i>
                    </a>
                </div>
                <div id="slide4" style={{ maxWidth: "100vw", minHeight: "100vh", backgroundImage: `url(${Landing_4})`, backgroundSize: "cover" }}>
                    <a href="" onClick={e => { this.goTo(e, "slide5") }}>
                        <i className="material-icons" style={{ position: "relative", top: "90vh", left: "47vw", color: "#086bd1", fontSize: "50px" }}>arrow_drop_down_circle</i>
                    </a>
                </div>
                <div id="slide5" style={{ maxWidth: "100vw", minHeight: "100vh", backgroundImage: `url(${Landing_5})`, backgroundSize: "cover" }}>
                    {/* <a href="" onClick={e => { this.goTo(e, "slide6") }}>
                        <i className="material-icons" style={{ position: "relative", top: "90vh", left: "47vw", color: "#086bd1", fontSize: "50px" }}>arrow_drop_down_circle</i>
                    </a> */}
                    <a href="" onClick={e => { this.goTo(e, "slide0") }}>
                        <i className="material-icons" style={{ position: "relative", top: "90vh", left: "47vw", color: "#086bd1", fontSize: "50px" }}>arrow_drop_up_circle</i>
                    </a>
                </div>
                {/* <div id="slide6" style={{ maxWidth: "100vw", minHeight: "100vh" }}>
                    <div style={{ margin: "5vh 0 12.5vh 0" }}>
                        <a href="" onClick={e => { this.goTo(e, "slide0") }}>
                            <img src={Logo} alt="Logo" style={{ width: "8vw", position: "relative", top: "5vh", left: "5vw" }} />
                        </a>
                    </div>
                    <div className="row">
                        <div className="col s3 center">
                            Chức năng
                        </div>
                        <div className="col s3 center">
                            Hỗ trợ
                        </div>
                        <div className="col s3 center">
                            Giới thiệu
                        </div>
                        <div className="col s3 center">
                            Theo dõi chúng tôi
                        </div>
                    </div>
                    <a href="" onClick={e => { this.goTo(e, "slide0") }}>
                        <i className="material-icons" style={{ position: "relative", left: "47vw", color: "#086bd1", fontSize: "50px" }}>arrow_drop_up_circle</i>
                    </a>
                </div> */}

            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
})

export default connect(mapStateToProps)(withRouter(LandingPage));