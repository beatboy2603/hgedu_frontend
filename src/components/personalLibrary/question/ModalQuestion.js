import React, { Component } from 'react'
import { Modal, Button } from 'react-materialize';
import CustomizedSelect from '../../common/CustomizedSelect';
import Editor from "../../common/Editor";
import Select from '@material-ui/core/Select';
import Toggle from "../../common/Toggle";

export default class ModalQuestion extends Component {

    state = {
        questionDetail: {
            questionCode: null,
            questionSeries: false,
            folderId: null,
            question: null,
            description: null,
            difficulty: null,
            gradeLevel: null,
            type: null,
            knowledgeGroup: null,
            specialKnowledge: null,
            explaination: null,
            questionKatex: null,
            questionImages: null,
        },
        answer1: {
            content: null,
            images: null,
            isCorrect: false,
            answerKatex: null,
            linkedAnswers: null
        },
        answer2: {
            content: null,
            images: null,
            isCorrect: false,
            answerKatex: null,
            linkedAnswers: null
        },
        answer3: {
            content: null,
            images: null,
            isCorrect: false,
            answerKatex: null,
            linkedAnswers: null
        },
        answer4: {
            content: null,
            images: null,
            isCorrect: false,
            answerKatex: null,
            linkedAnswers: null
        },
    }

    handleToggleChange = (e) => {
        this.setState({
            questionDetail: {
                questionSeries: e.target.checked,
            },
        })
    }

    handleInputChange = (source) => (e) => {
        if (source == "folderName") {
            this.setState({
                addFolderName: e.target.value,
            })
        }
        if (source == "questionCode") {
            this.setState({
                questionDetail: {
                    questionCode: e.target.value,
                }
            })
        }
    }

    render() {
        const lineSpacing = {
            marginTop: "25px",
        }

        return (
            < div >
                <a href="#addQuestion" className="btn-floating btn-large blue my-floating-btn modal-trigger">
                    <i className="material-icons" onClick={() => { console.log(this.state) }}>add</i>
                </a>
                <Modal id="addQuestion" options={{ preventScrolling: true }} style={{ width: "80vw", height: "80vh", overflow: "hidden", borderRadius: "25px" }} actions={[]}>
                    <div style={{ paddingTop: "52.5vh" }}></div>
                    <div className="modal-content" style={{
                        position: "absolute",
                        top: "0",
                        bottom: "0",
                        left: "0",
                        right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                        overflowY: "scroll"
                    }}>

                        <h5 className="center">Thêm câu hỏi</h5>
                        <div className="line" style={{ width: "96%", marginLeft: "2%", marginTop: "30px" }}></div>

                        <div className="row">
                            <form className="row col s12">
                                <div className="col s12">
                                    Mã câu hỏi<span className='red-text'>*</span>:
                                <div className="input-field inline" style={{ width: '30vw', marginLeft: '7vw' }}>
                                        <input id='questionCode' type="text" className="validate" value={this.state.questionDetail.questionCode} onChange={this.handleInputChange("questionCode")} />
                                    </div>
                                </div>
                                <div className="col s2">Câu hỏi<span className='red-text'>*</span>:</div>
                                <div className="col s10">
                                    {/* <Quill/> */}
                                    <Editor handleQuillChange={this.handleQuillChange} quillSource="question" />
                                </div>
                                <div className="col s12" style={lineSpacing}>
                                    {/* <div className="switch valign-wrapper" style={{ position: "relative", left: "-20px" }}>
                                    <label>
                                        <input type="checkbox" onChange={this.handleToggleChange} />
                                        <span className="lever"></span>
                                        <span style={{ color: "#333333", fontSize: "15px" }}>Chế độ câu hỏi chùm</span>
                                    </label>
                                </div> */}
                                    <Toggle label="Chế độ câu hỏi chùm" handleToggleChange={this.handleToggleChange} />
                                </div>
                                {!this.state.questionDetail.questionSeries && <div>
                                    <div className="col s2" style={lineSpacing}>Đáp án<span className='red-text'>*</span>:</div>
                                    <div className="col s10" style={lineSpacing}>

                                        <Editor handleQuillChange={this.handleQuillChange} quillSource="answer" ref={(answerQuill) => { window.answerQuill = answerQuill }} />
                                        <div className="blue" onClick={() => {
                                            console.log(window.answerQuill.getData());
                                        }}>shit</div>
                                    </div>
                                    <div className="col s2" style={lineSpacing}>Mức khó<span className='red-text'>*</span>:</div>
                                    <div className="col s4" style={lineSpacing}>
                                        {/* <Select value="0">
                                        <option value="0" disabled selected>Choose your option</option>
                                        <option value="1">Nhận biết</option>
                                        <option value="2">Thông hiểu</option>
                                        <option value="3">Vận dụng</option>
                                        <option value="4">Vận dụng cao</option>
                                    </Select> */}
                                        <CustomizedSelect items={[{ value: 1, text: "Nhận biết", },
                                        { value: 2, text: "Thông hiểu", },
                                        { value: 3, text: "Vận dụng", },
                                        { value: 4, text: "Vận dụng cao", },
                                        ]} />
                                    </div>

                                    <div className="col s3" style={lineSpacing}>Câu hỏi cùng form:</div>
                                    <div className="col s3" style={lineSpacing}>
                                        <Select value="">
                                            <option value="" disabled>Choose your option</option>
                                            <option value="1">Option 1</option>
                                            <option value="2">Option 2</option>
                                            <option value="3">Option 3</option>
                                        </Select>
                                    </div>
                                    <div className="col s2">Trình độ<span className='red-text'>*</span>:</div>
                                    <div className="col s4">
                                        <Select value="">
                                            <option value="" disabled>Choose your option</option>
                                            <option value="1">Option 1</option>
                                            <option value="2">Option 2</option>
                                            <option value="3">Option 3</option>
                                        </Select>
                                    </div>
                                    <div className="col s3">Mô tả:</div>
                                    <div className="col s3">
                                        <Select value="">
                                            <option value="" disabled>Choose your option</option>
                                            <option value="1">Option 1</option>
                                            <option value="2">Option 2</option>
                                            <option value="3">Option 3</option>
                                        </Select>
                                    </div>
                                    <div className="col s2">Thuộc tính<span className='red-text'>*</span>:</div>
                                    <div className="col s4">
                                        <Select value="">
                                            <option value="" disabled>Choose your option</option>
                                            <option value="1">Option 1</option>
                                            <option value="2">Option 2</option>
                                            <option value="3">Option 3</option>
                                        </Select>
                                    </div>
                                    <div className="col s3">Kiến thức đặc thù:</div>
                                    <div className="col s3">
                                        <Select value="">
                                            <option value="" disabled>Choose your option</option>
                                            <option value="1">Option 1</option>
                                            <option value="2">Option 2</option>
                                            <option value="3">Option 3</option>
                                        </Select>
                                    </div>
                                    <div className="col s2" style={lineSpacing}>Hướng dẫn giải<span className='red-text'>*</span>:</div>
                                    <div className="col s10" style={lineSpacing}>
                                        {/* <Quill/> */}
                                        <Editor handleQuillChange={this.handleQuillChange} quillSource="explaination" />
                                    </div>
                                </div>}

                            </form>
                        </div>
                        <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>
                        <a className="modal-action modal-close black-text lighten-1" style={{ margin: "0 1.5vw", float: "left" }}>Hủy thao tác</a>
                        <a className="modal-action modal-close blue-text lighten-1" style={{ margin: "0 1.5vw", float: "right" }} onClick={this.addQuestion}>Hoàn tất</a>
                    </div>
                </Modal>
            </div >
        )
    }
}
