import React, { Component } from 'react';
import { getAuthenCookie } from './common/common';
import { withRouter } from 'react-router-dom';

class NotFoundPage extends Component {
    state = {
        isAuthen: false,
    }

    componentDidMount() {
        let isAuthen = getAuthenCookie();
        this.setState({
            isAuthen,
        })
    }
    render() {
        return (
            <div className='row'>
                <div className="col s12 no-padding flex-column center" style={{ height: "100vh", width: "100vw" }}>
                    <div>
                        {this.state.isAuthen ? (
                            <div>
                                <i className="material-icons large grey-text">warning</i>
                                <h3 className="grey-text">404</h3>
                                <h6 className="grey-text">Hình như bạn đi hơi xa, <br /> hãy sử dụng menu để quay về!</h6>
                            </div>
                        ) : (
                                <div>
                                    <i style={{cursor:"pointer"}} onClick={()=>{
                                        this.props.history.push("/");
                                    }} className="material-icons large grey-text">warning</i>
                                    <h3 className="grey-text">404</h3>
                                    <h6 className="grey-text">Hình như bạn đi hơi xa, <br /> hãy click vào icon đề quay về trang chủ!</h6>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(NotFoundPage);