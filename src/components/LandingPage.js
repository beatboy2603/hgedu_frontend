import React, { Component } from 'react';
import axios from "axios";
import { GoogleLogin } from 'react-google-login';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { serverUrl, setCookie } from './common/common';
import Logo from '../resources/logo_transparent.png';
import BackGroundIMG from '../resources/landing_page.jpg';
import SubPost from './SubPost';
import { Carousel } from 'react-materialize';

class LandingPage extends Component {

    state = {
        isLoading: false,
        newsList: [],
        inputVal: "0",
        width:"0px",
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

    goToNews = (e) => {
        e.preventDefault();
        window.scroll({ top: document.getElementById("news").offsetTop, left: 0, behavior: 'smooth' })
    }

    componentDidMount() {
        axios.get(serverUrl + 'news')
            .then(res => {
                this.setState({ newsList: res.data })
            })
    }

    handleOnChange = (e)=>{
        let value = e.target.value;
        let width = value+"px"
        this.setState({
            input: value,
            width:width,
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
                    if (!user.isBan || (user.isBan && dateDifference > 0)) {
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
                <div style={{ maxWidth: "100vw", minHeight: "100vh", backgroundImage: `url(${BackGroundIMG})`, backgroundSize: "cover" }}>
                    <img onClick={() => { this.props.history.push('/signup'); }} src={Logo} alt="Logo" style={{ width: "8vw", position: "absolute", top: "5vh", left: "5vw" }} />
                    {/* {!this.props.isAuthenticated && */}
                    < GoogleLogin
                        clientId="1072039829865-jc2jf9cv96ifoph4ptpg1840s8n5gg5b.apps.googleusercontent.com"
                        scope='https://www.googleapis.com/auth/userinfo.profile'
                        render={renderProps => (
                            <Link onClick={renderProps.onClick} disabled={renderProps.disabled} className='flex-row' style={{ position: "absolute", top: "7vh", left: "80vw" }}>
                                <i className="material-icons left padding-vertical-10 md-36" style={{ color: "#ffffff", fontSize: "30px" }}>account_circle</i>
                                <span style={{ color: "#ffffff", fontSize: "20px" }}>Đăng nhập với Google</span>
                            </Link>
                        )}
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
                    {/* } */}
                    <div className="flex-column" style={{ width: "60vw", position: "absolute", top: "35vh", left: "20vw", color: "#ffffff", fontSize: "43px" }}>
                        <p align="center" className="font-montserrat" style={{ margin: "0", padding: "0", color: "#ffffff", fontSize: "43px" }}>MỘT NỀN GIÁO DỤC THÔNG MINH</p>
                        <p align="center" className="font-montserrat" style={{ margin: "0", padding: "0", color: "#ffffff", fontSize: "43px" }}>LÀ MỘT NỀN GIÁO DỤC LINH HOẠT</p>
                        <p align="center" style={{ color: "#ffffff", fontSize: "30px" }}>Cùng nhau tham gia vào cuộc cách mạng giáo dục Việt Nam!</p>
                    </div>
                    <a href="" onClick={this.goToNews}>
                        <i className="material-icons" style={{ position: "absolute", top: "90vh", left: "47vw", color: "#ffffff", fontSize: "50px" }}>arrow_drop_down_circle</i>
                    </a>
                </div>
                {/* <div className="g-signin2" onSuccess={() => this.onSignIn()}></div> */}
                {/* <a href="#" onClick={() => this.signOut()}>Sign out</a> */}
                {/* <button onClick={() => { this.handleLoading() }}>loading</button>
                {this.state.isLoading && <Loading type={"spokes"} color={"#999999"} />}
                <button onClick={() => { console.log(auth.getAuth()) }}>test</button>
                <button onClick={() => { this.token() }}>test Token</button> */}
                <div id="news" className="container row" style={{ minHeight: "100vh" }}>
                    <div className="col s12 container row">
                        <h5 className="blue-text text-darken-2 bold font-montserrat" style={{ margin: "50px 0 30px 0" }}>Tin tức</h5>
                        {
                            this.state.newsList.length !== 0 &&
                            <Carousel options={{ dist: 0, padding: 0 }} className="white-text center">
                                {this.state.newsList.slice(1).map((post) =>
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
                </div>
                <div style={{width:this.state.width, height:"100px", backgroundColor:"red"}}></div>
                <div className="input-field inline" style={{ width: '80px', marginLeft: '7vw' }}>
                    <input type="number" className="validate font-montserrat" style={{fontSize:"50px", color:"orange", textAlign:"center"}} onChange={this.handleOnChange} value={this.state.input} min="0" max="99" step="1"/>
                    <span class="helper-text" data-error="*0-99"></span>
                </div>
                {/* <button onClick={()=>{
                    axios.post(serverUrl+"api/folder/testFolder", [
                        {folderId: 100},
                        {folderId: 2},
                    ]).then(res=>{
                        console.log(res);
                    })
                }}> Click </button> */}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
})

export default connect(mapStateToProps)(withRouter(LandingPage));