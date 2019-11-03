import React, { Component } from 'react';
import { gapi } from "gapi-script";
import axios from "axios";
import { GoogleLogin } from 'react-google-login';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { serverUrl } from './common/common';
import auth from './common/Auth';

class LandingPage extends Component {
    onSignIn = (googleUser) => {}

    signOut = () => {
        let props = this.props;
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(() => {
            console.log('User signed out.');
            props.dispatch({ type: "SIGN_OUT", payload: null });
            this.redirect();
        });
    }

    redirect = () => {
        if (this.props.user.role) {
            this.props.history.push('/home');
        }else{
            this.props.history.push('/');
        }
    }

    token = (token) => {
        axios.get("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token="+token).then(res=>{
            console.log(res);
        })
    }

    render() {
        const responseGoogle = (res) => {
            var token = res.tokenObj.id_token;
            this.token(token);
            axios.post(serverUrl + 'api/authen', {
                token
            }).then(res => {
                if(res.data.message=="SignUp"){
                    console.log(res.data);
                    this.signOut();
                }else{
                    let user = res.data.user;
                    this.props.dispatch({ type: "CHANGE_ROLE", payload: user.roleId });
                }
                this.redirect();
            })
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
                <button onClick={() => { console.log(auth.getAuth()) }}>test</button>
                <button onClick={() => { this.token() }}>test Token</button>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
})

export default connect(mapStateToProps)(LandingPage);