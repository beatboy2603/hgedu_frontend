import React, { Component } from 'react';
import { gapi } from "gapi-script";
import { axiosPost } from "../common/common";
import { GoogleLogin } from 'react-google-login';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class LandingPage extends Component {
    onSignIn = (googleUser) => {
        // console.log("signIn");
        // var id_token = googleUser.getAuthResponse().id_token;
        // console.log(id_token);
        // this.props.dispatch({ type: "changeRole", payload: "admin" });
    }

    signOut = () => {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
        });
        this.props.dispatch({ type: "changeRole", payload: null });
    }

    redirect = () => {
        console.log("a")
        console.log(this.props.user.role);
        if (this.props.user.role) {
            this.props.history.push('/home');
        }
    }

    render() {
        const responseGoogle = (res) => {
            console.log("wtf")
            var id_token = res.tokenObj.id_token;
            var config = {
                api: "SignIn",
                data: {
                    id_token,
                }
            }
            console.log(id_token);
            this.props.dispatch({ type: "changeRole", payload: "admin" });
            this.redirect();
            // this.props.history.push("/home");
            // browserHistory.push("/home");
            // this.context.router.history.push('/home');
            // console.log(this.props.user);
            // axiosPost(config).then(res => {
            //     console.log("sent");
            // });
        }
        const iconColor = {
            color: "#3A3A3A"
        }
        return (
            <div className="container">
                <GoogleLogin
                    clientId="1072039829865-jc2jf9cv96ifoph4ptpg1840s8n5gg5b.apps.googleusercontent.com"
                    render={renderProps => (
                        <Link onClick={renderProps.onClick} disabled={renderProps.disabled} className='flex-row'>
                            <i className="material-icons left padding-vertical-10" style={iconColor}>account_circle</i>
                            <span style={iconColor}>Người dùng</span>
                        </Link>
                    )}
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                />
                <div className="g-signin2" onSuccess={() => this.onSignIn()}></div>
                <a href="#" onClick={() => this.signOut()}>Sign out</a>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
})

export default connect(mapStateToProps)(LandingPage);