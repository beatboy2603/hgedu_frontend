import React, { Component } from 'react';
import SwitchUI from '@material-ui/core/Switch';

class AbbreviationLibrary extends Component {
    handleChange = (e) => {
        console.log(e.target.checked);
    }

    render() {
        return (
            <div className="abbreviationLibrary row">
                <div className="row col s9 z-depth-2 grey lighten-4 padding-filler-nav min-height-100vh">
                    <div className="col s12 container padding-filler-nav abbreviationLibrary-header">
                        <h5 className="blue-text text-darken-3 bold font-montserrat">Thư viện viết tắt</h5>
                        <p className='grey-text text-darken-1'>03 tổ hợp</p>
                    </div>
                    <div className="row col s12 white z-depth-1">
                        <p className='col s6 blue-text text-darken-3 bold font-montserrat' style={{ fontSize: "17px", paddingLeft: "60px", marginTop: "4px", marginBottom: "2px" }}>Từ khóa</p>
                        <p className='col s6 blue-text text-darken-3 bold font-montserrat' style={{ fontSize: "17px", marginTop: "4px", marginBottom: "2px" }}>Chuyển đổi</p>

                        <div className="line col s12" style={{ borderColor: "#F1F1F1" }}></div>
                        <form action="">
                            <div className="col s6" style={{ paddingLeft: "60px", marginTop: "10px", marginBottom: "10px", borderRight: "1px solid #BDBDBD" }}>
                                <input type="text" id="fname" name="firstname" placeholder="+ Nhập từ khóa" style={{ borderBottom: "none", width: "85%" }} />
                            </div>
                            <div className="col s5" style={{ marginTop: "10px", marginBottom: "10px" }}>
                                <input type="text" id="fname" name="firstname" placeholder="+ Nhập chuyển đổi" style={{ borderBottom: "none" }} />
                            </div>
                            <div className="col s1">
                                <a href="#" style={{ fontSize: "17px", position: "relative", top: "3.5vh" }}>Thêm</a>
                            </div>                                                                              
                        </form>

                        <div className="line col s12" style={{ borderColor: "#F1F1F1" }}></div>
                        <div className="col s12" style={{ paddingLeft: "40px", }}>
                            <div className="switch valign-wrapper" style={{ minHeight: "60px" }}>
                                <label>
                                    <input type="checkbox" onChange={this.handleChange} />
                                    <span className="lever"></span>
                                    <span style={{ color: "#333333", fontSize: "15px" }}>Công cụ toán học</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="col s12 container padding-filler-nav">
                        <p className="blue-text text-darken-2">Tổ hợp của bạn</p>
                    </div>
                </div>
                <div className="row col s3">
                    <div className="col s12 container abbreviationLibrary-header">
                        <h5 className="blue-text text-darken-3 bold font-montserrat">Nhập thử nhé!</h5>
                        <p>Trải nghiệm tính năng viết tắt bằng cách nhập một từ khóa bất kì</p>
                    </div>
                    <div className="col s12 line"></div>
                    <div className="col s12 z-depth-1 white">
                        <textarea id="textarea1" className="materialize-textarea" placeholder="Nhập từ khóa" style={{ borderBottom: "none" }}></textarea>
                        {/* <p className="grey-text text-lighten-1">Nhập từ khóa</p> */}
                    </div>
                    <div className="col s12 container abbreviationLibrary-header">
                        <p>Chuyển đổi tương ứng</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default AbbreviationLibrary;