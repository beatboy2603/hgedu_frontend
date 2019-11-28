import React, { Component } from 'react'
import Logo from '../../resources/logo.png';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { serverUrl, setCookie } from './common';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux'

const styles = () => ({
    rolePicker: {
        color: "#3a3a3a",
        cursor: "pointer",
        "&:hover p": {
            color: "#086bd1",
        },
        "&:hover div": {
            backgroundColor: "#086bd1",
        },
        "&:hover i": {
            color: "#ffffff",
        }
    },
});

class SignIn extends Component {

    signin = (userRoleId) => {
        if (this.props.user.jwt) {
            setCookie("authenticated", "true", 1);
            this.props.dispatch({ type: "UPDATE_USER", payload: { userRoleId } });
            this.props.history.push('/home');
        }
    }

    componentDidMount() {
        if(!this.props.user.jwt){
            this.props.history.push("/");
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className="signup row flex-column" style={{ minHeight: "100vh", margin: "0" }}>
                <div className="col s2">
                    {/* <Link to='/home'>
                        <i className="material-icons" style={{ margin: "10vh", color: "#3a3a3a", fontSize: "50px" }}>arrow_back</i>
                    </Link> */}
                </div>
                <div className="col s8 container flex-column center">
                    <div style={{ margin: "5vh 0" }}>
                        <Link to='/'>
                            <img className="center-align" style={{ width: "7vw" }} src={Logo} alt="Logo" />
                        </Link>
                    </div>
                    <div>
                        <h5 className="blue-text text-darken-2 bold font-montserrat" style={{ marginTop: "0" }}>Chỉ một bước nữa thôi</h5>
                        <p style={{ fontSize: "19px" }}>Hãy chọn chức năng bạn muốn sử dụng.</p>
                        <div className="row">
                            <div className="col s2"></div>
                            <div className="row col s8">
                                <div className="col s4">
                                    <div className={classes.rolePicker} style={{ margin: "25px 0" }} onClick={() => { this.signin(1) }} >
                                        <div className="flex-column" style={{ height: "125px", width: "125px", borderRadius: "50%", margin: "auto" }}>
                                            <i className="material-icons" style={{ fontSize: "60px" }} >import_contacts</i>
                                        </div>
                                        <p style={{ fontSize: "18px" }}>Giáo viên</p>
                                    </div>
                                </div>
                                <div className="col s4">
                                    <div className={classes.rolePicker} style={{ margin: "25px 0" }} onClick={() => { this.signin(2) }}>
                                        <div className="flex-column" style={{ height: "125px", width: "125px", borderRadius: "50%", margin: "auto" }}>
                                            <i className="material-icons" style={{ fontSize: "60px" }} >school</i>
                                        </div>
                                        <p style={{ fontSize: "18px" }}>Học sinh</p>
                                    </div>
                                </div>
                                <div className="col s4">
                                    <div className={classes.rolePicker} style={{ margin: "25px 0" }} onClick={() => { this.signin(3) }} >
                                        <div className="flex-column" style={{ height: "125px", width: "125px", borderRadius: "50%", margin: "auto" }}>
                                            <i className="material-icons" style={{ fontSize: "60px" }} >people</i>
                                        </div>
                                        <p style={{ fontSize: "18px" }}>Phụ huynh</p>
                                    </div>
                                </div>
                            </div>

                            <div className="row col s2"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
SignIn.propTypes = {
    classes: PropTypes.object.isRequired,
};

// export default withStyles(styles)(SignIn);

const mapStateToProps = state => ({
    user: state.user,
})

export default compose(
    connect(mapStateToProps),
    withStyles(styles),
    withRouter,
)(SignIn)
