import React, { Component } from 'react';
import { gapi } from "gapi-script";
import axios from "axios";
import { GoogleLogin } from 'react-google-login';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { serverUrl } from './common/common';
import auth from './common/Auth';
import { Loading } from './common/Loading';
import Logo from '../resources/logo_transparent.png';
import BackGroundIMG from '../resources/landing_page.jpg';
import SubPost from './SubPost';
import { Carousel } from 'react-materialize';

class LandingPage extends Component {

    state = {
        isLoading: false,
        newsList: [],
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

    render() {
        const responseGoogle = (res) => {
            var token = res.tokenObj.id_token;
            // let googleToken = this.decodeToken(token);
            axios.post(serverUrl + 'api/authen', {
                token
            }).then(res => {
                if (res.data.message == "SignUp") {
                    console.log("signup");

                    let user = {
                        email: res.data.email,
                        name: res.data.name,
                        picture: res.data.picture,
                    }
                    this.props.dispatch({ type: "UPDATE_USER", payload: user });
                    this.props.dispatch({ type: "UPDATE_USER", payload: {googleJwt: token} });
                    this.props.history.push('/signup');
                } else {
                    let user = res.data.user;
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
                        this.props.dispatch({ type: "UPDATE_USER", payload: user });
                    })
                    this.props.dispatch({
                        type: "UPDATE_USER", payload: {
                            uid: user.userId,
                            phone: user.phoneNumber,
                            gender: user.gender,
                            // role: user.roleId,
                            role: 3,
                        }
                    });
                    this.props.dispatch({ type: "UPDATE_JWT", payload: jwt });
                    this.redirect();
                }
                // this.redirect();
            })
        }

        return (
            <div className="row">
                <div style={{ maxWidth: "100vw", minHeight: "100vh", backgroundImage: `url(${BackGroundIMG})`, backgroundSize: "cover" }}>
                    <img onClick={() => { this.props.history.push('/signup'); }} src={Logo} alt="Logo" style={{ width: "8vw", position: "absolute", top: "5vh", left: "5vw" }} />
                    <GoogleLogin
                        clientId="1072039829865-jc2jf9cv96ifoph4ptpg1840s8n5gg5b.apps.googleusercontent.com"
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
                <div id="news" className="container row">
                    <div className="col s11 offset-s1 container row">
                        <h5 className="blue-text text-darken-2 bold font-montserrat">Tin tức</h5>
                        {
                            this.state.newsList.length !== 0 &&
                            <Carousel options={{ dist: 0, padding: 0 }} className="white-text center">
                                {this.state.newsList.map((post) =>
                                    <div className="col s4 carousel-item">
                                        <SubPost imgSrc={'http://localhost:8084/' + post.thumbnail}
                                            post={post}
                                            title={post.title}
                                            body={post.description} />
                                    </div>
                                )}
                            </Carousel>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
})

export default connect(mapStateToProps)(LandingPage);