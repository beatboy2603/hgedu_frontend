import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { serverUrl } from "../common/common";
import axios from 'axios';
import Toggle from "../common/Toggle";
import { InlineMath } from 'react-katex';

class AbbreviationLibrary extends Component {

    state = {
        abbreviation: {
            teacherId: this.props.user.uid,
            shortenForm: "",
            originalForm: "",
            isKatex: false,
        },
        testRenderInput: "",
        abbreviationList: [],
    }

    over = (e, id) => {
        e.stopPropagation();
        document.getElementById("abbreviation" + id).querySelector(".deleteBtn").style.display = "block";
        document.getElementById("abbreviation" + id).querySelector(".editBtn").style.display = "block";
        document.getElementById("abbreviation" + id).querySelector(".shortenForm").style.display = "none";
        document.getElementById("abbreviation" + id).querySelector(".originalForm").style.display = "none";
    }

    out = (e, id) => {
        e.stopPropagation();
        document.getElementById("abbreviation" + id).querySelector(".deleteBtn").style.display = "none";
        document.getElementById("abbreviation" + id).querySelector(".editBtn").style.display = "none";
        document.getElementById("abbreviation" + id).querySelector(".shortenForm").style.display = "block";
        document.getElementById("abbreviation" + id).querySelector(".originalForm").style.display = "block";
    }

    renderAbbreviationList = () => {
        let renderedList = this.state.abbreviationList.map((el, i) => {
            return (
                <tr key={el.abbreviationId} id={"abbreviation" + el.abbreviationId} onMouseOver={(e) => { this.over(e, el.abbreviationId) }} onMouseOut={(e) => { this.out(e, el.abbreviationId) }} style={{ cursor: "pointer" }}>
                    <th className="z-depth-1 white" style={{ width: "47%", padding: "20px 20px", fontSize: "18px", wordWrap: "break-word" }} onClick={() => { this.editAbbreviation(el) }}>
                        <span className="shortenForm" style={{ display: "block", color: "#444444" }}>{el.shortenForm}</span>
                        <span className="blue-text editBtn" style={{ display: "none", fontSize: "18px" }}>
                            Sửa
                            <span className="white-text">{el.shortenForm}</span>
                        </span>
                    </th>
                    <th className="z-depth-1 grey lighten-3" style={{ width: "47%", padding: "20px 20px", fontSize: "18px", wordWrap: "break-word" }} onClick={() => { this.deleteAbbreviation(el) }}>
                        <span className="originalForm" style={{ display: "block", color: "#444444" }}>
                            {el.isKatex && <InlineMath math={el.originalForm} />}
                            {!el.isKatex && <span>{el.originalForm}</span>}
                        </span>
                        <span className="red-text deleteBtn" style={{ display: "none", fontSize: "18px" }}>
                            Xóa
                        <span className="grey-text text-lighten-3">
                                {el.isKatex && <InlineMath math={el.originalForm} />}
                                {!el.isKatex && <span>{el.originalForm}</span>}
                            </span>
                        </span>
                    </th>
                </tr>
            )
        })
        return renderedList;
    }

    handleToggleChange = () => {
        this.setState(prevState => ({
            abbreviation: {
                ...prevState.abbreviation,
                isKatex: !prevState.abbreviation.isKatex,
            },
        }))
    }

    handleInputChange = (source, e) => {
        let value = e.target.value;
        if (source == "shortenForm") {
            this.setState(prevState => ({
                ...prevState,
                abbreviation: {
                    ...prevState.abbreviation,
                    shortenForm: value,
                },
            }))
        }
        if (source == "originalForm") {
            this.setState(prevState => ({
                ...prevState,
                abbreviation: {
                    ...prevState.abbreviation,
                    originalForm: value,
                },
            }))
        }
        if (source == "testRenderInput") {
            this.setState({
                testRenderInput: value
            })
        }
    }

    addAbbreviation = () => {
        if (this.state.abbreviation.shortenForm && this.state.abbreviation.originalForm) {
            const checkShortenForm = this.state.abbreviationList.filter((el, i) => {
                return el.shortenForm == this.state.abbreviation.shortenForm;
            })
            if (checkShortenForm.length > 0) {
                alert("Từ khóa đã tồn tại!");
                return;
            }
            const abbreviationList = [this.state.abbreviation, ...this.state.abbreviationList];
            let abbreviation= this.state.abbreviation;
            axios.post(serverUrl + "api/abbreviation/addAbbreviation", abbreviation).then(res => {
                axios.get(serverUrl + "api/abbreviation/" + this.props.user.uid).then(res => {
                    this.setState({
                        abbreviationList: res.data,
                    })
                })
            })
            this.setState({
                abbreviation: {
                    teacherId: this.props.user.uid,
                    shortenForm: "",
                    originalForm: "",
                    isKatex: false,
                },
                abbreviationList
            })
        }
    }

    updateAbbreviation = () => {
        if (this.state.abbreviation.abbreviationId && this.state.abbreviation.shortenForm && this.state.abbreviation.originalForm) {
            const checkShortenForm = this.state.abbreviationList.filter((el, i) => {
                return el.shortenForm == this.state.abbreviation.shortenForm && el.abbreviationId != this.state.abbreviation.abbreviationId;
            })
            if (checkShortenForm.length > 0) {
                alert("Từ khóa đã tồn tại!");
                return;
            }
            const abbreviationList = this.state.abbreviationList.map((el, i) => {
                if (el.abbreviationId == this.state.abbreviation.abbreviationId) {
                    el.shortenForm = this.state.abbreviation.shortenForm;
                    el.originalForm = this.state.abbreviation.originalForm;
                    el.isKatex = this.state.abbreviation.isKatex;
                }
                return el;
            })
            let abbreviation= this.state.abbreviation;
            axios.post(serverUrl + "api/abbreviation/updateAbbreviation", abbreviation).then(res => {
                axios.get(serverUrl + "api/abbreviation/" + this.props.user.uid).then(res => {
                    this.setState({
                        abbreviationList: res.data,
                    })
                })
            })
            this.setState({
                abbreviation: {
                    teacherId: this.props.user.uid,
                    shortenForm: "",
                    originalForm: "",
                    isKatex: false,
                },
                abbreviationList
            })
        }
    }

    editAbbreviation = (abbreviation) => {
        this.setState({
            abbreviation
        })
    }

    deleteAbbreviation = (abbreviation) => {
        const abbreviationList = this.state.abbreviationList.filter((el, i) => el.abbreviationId != abbreviation.abbreviationId)
        if (this.state.abbreviation.abbreviationId) {
            this.setState({
                abbreviation: {
                    teacherId: this.props.user.uid,
                    shortenForm: "",
                    originalForm: "",
                    isKatex: false,
                },
                abbreviationList
            })
        } else {
            this.setState({
                abbreviationList
            })
        }
        axios.post(serverUrl + "api/abbreviation/deleteAbbreviation/"+abbreviation.abbreviationId).then(res => {
            axios.get(serverUrl + "api/abbreviation/" + this.props.user.uid).then(res => {
                this.setState({
                    abbreviationList: res.data,
                })
            })
        })
    }

    componentDidMount() {
        axios.get(serverUrl + "api/abbreviation/" + this.props.user.uid).then(res => {
            this.setState({
                abbreviationList: res.data,
            })
        })
    }


    render() {
        return (
            <div className="abbreviationLibrary row" style={{ margin: "0" }}>
                <button onClick={() => { console.log(this.state) }}>click me</button>
                <div className="row col s8 z-depth-2 grey lighten-4 padding-filler-nav min-height-100vh" style={{ margin: "0", minHeight: "100vh" }}>
                    <div className="col s12 container padding-filler-nav abbreviationLibrary-header">
                        <h5 className="blue-text text-darken-3 bold font-montserrat" style={{ marginTop: "30px" }}>Thư viện viết tắt</h5>
                        <p className='grey-text text-darken-1'>{this.state.abbreviationList.length} tổ hợp</p>
                    </div>
                    <div className="row col s12 white z-depth-1">
                        <p className='col s6 blue-text text-darken-3 bold font-montserrat' style={{ fontSize: "17px", paddingLeft: "60px", marginTop: "4px", marginBottom: "2px" }}>Từ khóa</p>
                        <p className='col s6 blue-text text-darken-3 bold font-montserrat' style={{ fontSize: "17px", marginTop: "4px", marginBottom: "2px" }}>Chuyển đổi</p>

                        <div className="line col s12" style={{ borderColor: "#F1F1F1" }}></div>
                        <form action="">
                            <div className="col s6" style={{ paddingLeft: "60px", marginTop: "10px", marginBottom: "10px", borderRight: "1px solid #BDBDBD" }}>
                                <input type="text" placeholder="+ Nhập từ khóa" style={{ borderBottom: "none", width: "85%" }} value={this.state.abbreviation.shortenForm} onChange={(e) => { this.handleInputChange("shortenForm", e) }} />
                            </div>
                            <div className="col s5" style={{ marginTop: "10px", marginBottom: "10px" }}>
                                <input type="text" placeholder="+ Nhập chuyển đổi" style={{ borderBottom: "none" }} value={this.state.abbreviation.originalForm} onChange={(e) => { this.handleInputChange("originalForm", e) }} />
                            </div>
                            <div className="col s1">
                                {this.state.abbreviation.shortenForm && this.state.abbreviation.originalForm &&
                                    !this.state.abbreviation.abbreviationId &&
                                    <span onClick={() => { this.addAbbreviation() }} style={{ fontSize: "17px", position: "relative", top: "3.5vh", color: "#086bd1", cursor: "pointer" }}>Thêm</span>
                                }
                                {this.state.abbreviation.shortenForm && this.state.abbreviation.originalForm &&
                                    this.state.abbreviation.abbreviationId &&
                                    <span onClick={() => { this.updateAbbreviation() }} style={{ fontSize: "17px", position: "relative", top: "3.5vh", color: "#086bd1", cursor: "pointer" }}>Sửa</span>
                                }
                            </div>
                        </form>
                        <div className="line col s12" style={{ borderColor: "#F1F1F1" }}></div>
                        <div className="col s12" style={{ paddingLeft: "40px" }}>
                            <Toggle customStyle={{ minHeight: "45px" }} label="Công cụ toán học" handleToggleChange={this.handleToggleChange} checked={this.state.abbreviation.isKatex} />
                        </div>
                    </div>
                    <div className="col s12 container padding-filler-nav" style={{ minHeight: "70vh" }}>
                        <p className="blue-text text-darken-2" style={{ fontSize: "18px" }}>Tổ hợp của bạn</p>
                        {this.state.abbreviationList.length > 0 ? (
                            <table style={{ width: "94%", tableLayout: "fixed", marginBottom: "5vh" }}>
                                {this.renderAbbreviationList()}
                            </table>
                        ) : (
                                <div className="col s12 no-padding flex-column center" style={{ minHeight: "50vh" }}>
                                    <div>
                                        <i className="material-icons large grey-text">description</i>
                                        <h6 className="grey-text">Tổ hợp giúp bạn gõ nhanh hơn <br /> những cụm từ hoặc công thức bạn hay sử dụng!</h6>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
                <div className="row col s4 no-padding" style={{ maxHeight: "100vh", position: "sticky", top: "0", margin: "0", overflow: "hidden" }}>
                    <div style={{ minHeight: "50vh" }}>
                        <div className="col s12 container abbreviationLibrary-header">
                            <h5 className="blue-text text-darken-3 bold font-montserrat" style={{ margin: "30px 5% 0 5%" }}>Nhập thử nhé!</h5>
                            <p style={{ fontSize: "18px", margin: "20px 5% ", color: "#444444" }}>Hãy nhập một công thức bất kì theo mã LaTeX để xem trước chuyển đổi tương ứng!</p>
                        </div>
                        <div className="col s12 line" style={{ width: "86%", margin: "0 7% 20px 7%" }}></div>
                        <div className="col s12 z-depth-1 white" style={{ width: "86%", margin: "0 7%", minHeight: "100px", }}>
                            <textarea className="materialize-textarea" placeholder="Nhập từ khóa. ie: f(x)=\frac{a}{b}" style={{ borderBottom: "none" }} value={this.state.testRenderInput} onChange={(e) => { this.handleInputChange("testRenderInput", e) }}></textarea>
                            {/* <p className="grey-text text-lighten-1">Nhập từ khóa</p> */}
                        </div>
                    </div>
                    <div className="col s12 container abbreviationLibrary-header" style={{ position: "relative", marginTop: "-80px", paddingTop: "80px", backgroundColor: "#086bd1", zIndex: "-1", height: "100vh" }}>
                        <p style={{ fontSize: "18px", margin: "20px 5% ", color: "#FFFFFF" }}>Chuyển đổi tương ứng</p>
                        <div style={{ width: "100%", overflow: "auto" }}>
                            <p style={{ fontSize: "25px", margin: "20px 5% ", color: "#FFFFFF" }}>
                                {this.state.testRenderInput && <InlineMath math={this.state.testRenderInput} />}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
})

export default connect(mapStateToProps)(withRouter(AbbreviationLibrary));