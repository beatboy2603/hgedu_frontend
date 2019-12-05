import React, { Component } from 'react'
import { Modal, Button, Collapsible, CollapsibleItem } from 'react-materialize';
import CustomizedSelect from '../../common/CustomizedSelect';
import ContentEditor from "../../common/ContentEditor";
import Select from '@material-ui/core/Select';
import Toggle from "../../common/Toggle";
import CustomizedEditableSelect from '../../common/CustomizedEditableSelect';

export default class ModalQuestion extends Component {

    state = {
        currentFolder: null,
        questionDetail: {
            questionCode: "",
            content: "",
            questionSeries: false,
            folderId: null,
            knowledgeGroup: null,
        },
        questionList: [
            {
                question: {
                    questionCode: "",
                    content: {ops:[{insert:"what"}]},
                    specialKnowledge: null,
                    explaination: null,
                    difficulty: null,
                    description: null,
                    gradeLevel: null,
                    type: null,
                },
                answer1: {
                    content: "",
                    isCorrect: false,
                    linkedAnswers: null
                },
                answer2: {
                    content: "",
                    isCorrect: false,
                    linkedAnswers: null
                },
                answer3: {
                    content: "",
                    isCorrect: false,
                    linkedAnswers: null
                },
                answer4: {
                    content: "",
                    isCorrect: false,
                    linkedAnswers: null
                },
            }
        ],
    }

    contentEditor = React.createRef();

    handleQuillChange = (value) => {
        this.setState(prevState => ({
            ...prevState,
            questionDetail: {
                ...prevState.questionDetail,
                content: value,
            }
        }))
    }

    handleToggleChange = () => {
        this.setState(prevState => ({
            questionDetail: {
                ...prevState.questionDetail,
                // content: null,
                questionSeries: !prevState.questionDetail.questionSeries,
            },
            // questionList: [
            //     ...prevState.questionList,
            //     questionList[0].question.content = prevState.questionDetail.content,
            // ]
        }))
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

    handleSelectChange = (source, value) => {
        // if (source == "folderName") {
        //     this.setState({
        //         addFolderName: e.target.value,
        //     })
        // }
        if (source == "difficulty") {
            this.setState(prevState => ({
                ...prevState,
                questionDetail: {
                    ...prevState.questionDetail,
                    difficulty: value,
                }
            }))
        }
        if (source == "specialKnowledge") {
            this.setState(prevState => ({
                ...prevState,
                questionDetail: {
                    ...prevState.questionDetail,
                    knowledgeGroup: value,
                }
            }))
        }
    }

    addQuestionToSeries = (e) => {
        e.preventDefault();
        this.setState(prevState => ({
            questionList: [...prevState.questionList, {
                question: {
                    questionCode: "",
                    content: "",
                    specialKnowledge: null,
                    explaination: null,
                    difficulty: null,
                    description: null,
                    gradeLevel: null,
                    type: null,
                },
                answer1: {
                    content: "",
                    isCorrect: false,
                    linkedAnswers: null
                },
                answer2: {
                    content: "",
                    isCorrect: false,
                    linkedAnswers: null
                },
                answer3: {
                    content: "",
                    isCorrect: false,
                    linkedAnswers: null
                },
                answer4: {
                    content: "",
                    isCorrect: false,
                    linkedAnswers: null
                },
            }]
        }))
    }

    componentDidUpdate() {
        let { currentFolder } = this.props;
        if (currentFolder !== this.state.currentFolder) {
            this.setState({
                currentFolder,
            })
        }
    }

    componentDidMount() {
        let { currentFolder } = this.props;
        this.setState({
            currentFolder,
        })
    }

    render() {
        const lineSpacing = {
            marginTop: "25px",
        }
        const selectSpacing = {
            marginTop: "10px",
        }

        const questionList = this.state.questionList.map((questionDetail, i) => {
            return (
                <div>
                    <Collapsible className="z-depth-0" style={{ border: "none" }}>
                        <CollapsibleItem header={"Câu hỏi " + (i + 1)} icon={<i className="material-icons">code</i>}>
                            <div className="row">
                                <div className="col s12">
                                    Mã câu hỏi<span className='red-text'>*</span>:
                                    <div className="input-field inline" style={{ width: '30vw', marginLeft: '7vw' }}>
                                        <input id='questionCode' type="text" className="validate" value={this.state.questionDetail.questionCode} onChange={this.handleInputChange("questionCode")} />
                                    </div>
                                </div>
                                <div className="col s2">Câu hỏi<span className='red-text'>*</span>:</div>
                                <div className="col s10">
                                    <ContentEditor customStyle={{ height: "150px", paddingBottom: "30px" }} handleQuillChange={this.handleQuillChange} content={this.state.questionList[i].question.content} quillSource="question" toolbarModules={[['image'],
                                    ['formula'],]} />
                                </div>
                                <div className="col s2" style={lineSpacing}>Đáp án<span className='red-text'>*</span>:</div>
                                <div className="col s10" style={lineSpacing}>
                                    <ContentEditor customStyle={{ height: "150px", paddingBottom: "30px" }} handleQuillChange={this.handleQuillChange} quillSource="question" toolbarModules={[['image'],
                                    ['formula'],]} />
                                </div>
                                <div className="col s2" style={lineSpacing}>Mức khó<span className='red-text'>*</span>:</div>
                                <div className="col s4" style={selectSpacing}>
                                    {/* <Select value="0">
                                        <option value="0" disabled selected>Choose your option</option>
                                        <option value="1">Nhận biết</option>
                                        <option value="2">Thông hiểu</option>
                                        <option value="3">Vận dụng</option>
                                        <option value="4">Vận dụng cao</option>
                                    </Select> */}
                                    <CustomizedSelect
                                        source="difficulty"
                                        handleParentSelect={this.handleSelectChange}
                                        items={[
                                            { value: 1, text: "Nhận biết", },
                                            { value: 2, text: "Thông hiểu", },
                                            { value: 3, text: "Vận dụng", },
                                            { value: 4, text: "Vận dụng cao", },
                                        ]} />
                                </div>

                                <div className="col s3" style={lineSpacing}>Câu hỏi cùng form:</div>
                                <div className="col s3" style={selectSpacing}>
                                    <CustomizedSelect
                                        // source="difficulty"
                                        // handleParentSelect={this.handleSelectChange}
                                        items={[{ value: 1, text: "TBD", },
                                        ]} />
                                </div>
                                <div className="col s2" style={lineSpacing}>Trình độ<span className='red-text'>*</span>:</div>
                                <div className="col s4" style={selectSpacing}>
                                    <CustomizedSelect
                                        // source="difficulty"
                                        // handleParentSelect={this.handleSelectChange}
                                        items={[
                                            { value: 1, text: "Lớp 1", },
                                            { value: 2, text: "Lớp 2", },
                                            { value: 3, text: "Lớp 3", },
                                            { value: 4, text: "Lớp 4", },
                                            { value: 5, text: "Lớp 5", },
                                            { value: 6, text: "Lớp 6", },
                                            { value: 7, text: "Lớp 7", },
                                            { value: 8, text: "Lớp 8", },
                                            { value: 9, text: "Lớp 9", },
                                            { value: 10, text: "Lớp 10", },
                                            { value: 11, text: "Lớp 11", },
                                            { value: 12, text: "Lớp 12", },
                                            { value: 0, text: "Khác", },
                                        ]} />
                                </div>
                                <div className="col s3" style={lineSpacing}>Mô tả:</div>
                                <div className="col s3" style={selectSpacing}>
                                    <input id='description' type="text" className="validate" />
                                </div>
                                <div className="col s2" style={lineSpacing}>Thuộc tính<span className='red-text'>*</span>:</div>
                                <div className="col s4" style={selectSpacing}>
                                    <CustomizedSelect
                                        // source="difficulty"
                                        // handleParentSelect={this.handleSelectChange}
                                        items={[
                                            { value: 1, text: "Lý thuyết", },
                                            { value: 2, text: "Bài tập", },
                                        ]} />
                                </div>
                                <div className="col s3" style={lineSpacing}>Kiến thức đặc thù:</div>
                                <div className="col s3" style={selectSpacing}>
                                    <CustomizedEditableSelect items={[
                                        { value: 1, text: "Lý thuyết", },
                                        { value: 2, text: "Bài tập", },
                                    ]}
                                        handleParentSelect={this.handleSelectChange}
                                        source="specialKnowledge"
                                    />
                                </div>
                                <div className="col s2" style={lineSpacing}>Hướng dẫn giải<span className='red-text'>*</span>:</div>
                                <div className="col s10" style={lineSpacing}>
                                    <ContentEditor customStyle={{ height: "150px", paddingBottom: "30px" }} handleQuillChange={this.handleQuillChange} quillSource="question" toolbarModules={[['image'],
                                    ['formula'],]} />
                                </div>
                            </div>
                        </CollapsibleItem>
                    </Collapsible>
                </div>
            )
        })

        return (
            <div>
                <a href="#addQuestion" style={{ position: "fixed" }} className="btn-floating btn-large my-floating-btn blue modal-trigger">
                    <i className="material-icons" onClick={() => { console.log(this.state) }}>add</i>
                </a>
                <button onClick={() => { console.log(this.state) }}>Click me yo</button>
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

                                {this.state.questionDetail.questionSeries ? (
                                    <div className="col s12">
                                        Mã chùm câu hỏi<span className='red-text'>*</span>:
                                        <div className="input-field inline" style={{ width: '30vw', marginLeft: '4vw' }}>
                                            <input id='questionCode' type="text" className="validate" value={this.state.questionDetail.questionCode} onChange={this.handleInputChange("questionCode")} />
                                        </div>
                                    </div>
                                ) : (
                                        <div className="col s12">
                                            Mã câu hỏi<span className='red-text'>*</span>:
                                    <div className="input-field inline" style={{ width: '30vw', marginLeft: '7vw' }}>
                                                <input id='questionCode' type="text" className="validate" value={this.state.questionDetail.questionCode} onChange={this.handleInputChange("questionCode")} />
                                            </div>
                                        </div>
                                    )}

                                <div className="col s2">Câu hỏi<span className='red-text'>*</span>:</div>
                                <div className="col s10">
                                    <ContentEditor customStyle={{ height: "150px", paddingBottom: "30px" }}
                                        updateContent={this.handleQuillChange} ref={this.contentEditor} quillSource="question" toolbarModules={[['image'],
                                        ['formula'],]} />
                                </div>
                                <div className="col s12" style={lineSpacing}>
                                    <Toggle label="Chế độ câu hỏi chùm" handleToggleChange={this.handleToggleChange} />
                                </div>
                                {!this.state.questionDetail.questionSeries ? (
                                    <div>
                                        <div className="col s2" style={lineSpacing}>Đáp án<span className='red-text'>*</span>:</div>
                                        <div className="col s10" style={lineSpacing}>
                                            <ContentEditor customStyle={{ height: "150px", paddingBottom: "30px" }} handleQuillChange={this.handleQuillChange} quillSource="question" toolbarModules={[['image'],
                                            ['formula'],]} />
                                            {/* <Editor handleQuillChange={this.handleQuillChange} quillSource="answer" ref={(answerQuill) => { window.answerQuill = answerQuill }} />
                                            <div className="blue" onClick={() => {
                                                console.log(window.answerQuill.getData());
                                            }}>shit</div> */}
                                        </div>
                                        <div className="col s2" style={lineSpacing}>Mức khó<span className='red-text'>*</span>:</div>
                                        <div className="col s4" style={selectSpacing}>
                                            {/* <Select value="0">
                                        <option value="0" disabled selected>Choose your option</option>
                                        <option value="1">Nhận biết</option>
                                        <option value="2">Thông hiểu</option>
                                        <option value="3">Vận dụng</option>
                                        <option value="4">Vận dụng cao</option>
                                    </Select> */}
                                            <CustomizedSelect
                                                source="difficulty"
                                                handleParentSelect={this.handleSelectChange}
                                                items={[
                                                    { value: 1, text: "Nhận biết", },
                                                    { value: 2, text: "Thông hiểu", },
                                                    { value: 3, text: "Vận dụng", },
                                                    { value: 4, text: "Vận dụng cao", },
                                                ]} />
                                        </div>

                                        <div className="col s3" style={lineSpacing}>Câu hỏi cùng form:</div>
                                        <div className="col s3" style={selectSpacing}>
                                            <CustomizedSelect
                                                // source="difficulty"
                                                // handleParentSelect={this.handleSelectChange}
                                                items={[{ value: 1, text: "TBD", },
                                                ]} />
                                        </div>
                                        <div className="col s2" style={lineSpacing}>Trình độ<span className='red-text'>*</span>:</div>
                                        <div className="col s4" style={selectSpacing}>
                                            <CustomizedSelect
                                                // source="difficulty"
                                                // handleParentSelect={this.handleSelectChange}
                                                items={[
                                                    { value: 1, text: "Lớp 1", },
                                                    { value: 2, text: "Lớp 2", },
                                                    { value: 3, text: "Lớp 3", },
                                                    { value: 4, text: "Lớp 4", },
                                                    { value: 5, text: "Lớp 5", },
                                                    { value: 6, text: "Lớp 6", },
                                                    { value: 7, text: "Lớp 7", },
                                                    { value: 8, text: "Lớp 8", },
                                                    { value: 9, text: "Lớp 9", },
                                                    { value: 10, text: "Lớp 10", },
                                                    { value: 11, text: "Lớp 11", },
                                                    { value: 12, text: "Lớp 12", },
                                                    { value: 0, text: "Khác", },
                                                ]} />
                                        </div>
                                        <div className="col s3" style={lineSpacing}>Mô tả:</div>
                                        <div className="col s3" style={selectSpacing}>
                                            <input id='description' type="text" className="validate" />
                                        </div>
                                        <div className="col s2" style={lineSpacing}>Thuộc tính<span className='red-text'>*</span>:</div>
                                        <div className="col s4" style={selectSpacing}>
                                            <CustomizedSelect
                                                // source="difficulty"
                                                // handleParentSelect={this.handleSelectChange}
                                                items={[
                                                    { value: 1, text: "Lý thuyết", },
                                                    { value: 2, text: "Bài tập", },
                                                ]} />
                                        </div>
                                        <div className="col s3" style={lineSpacing}>Kiến thức đặc thù:</div>
                                        <div className="col s3" style={selectSpacing}>
                                            <CustomizedEditableSelect items={[
                                                { value: 1, text: "Lý thuyết", },
                                                { value: 2, text: "Bài tập", },
                                            ]}
                                                handleParentSelect={this.handleSelectChange}
                                                source="specialKnowledge"
                                            />
                                        </div>
                                        <div className="col s2" style={lineSpacing}>Hướng dẫn giải<span className='red-text'>*</span>:</div>
                                        <div className="col s10" style={lineSpacing}>
                                            <ContentEditor customStyle={{ height: "150px", paddingBottom: "30px" }} handleQuillChange={this.handleQuillChange} quillSource="question" toolbarModules={[['image'],
                                            ['formula'],]} />
                                        </div>
                                    </div>) : (
                                        <div>
                                            {questionList}
                                            <div className="flex-row" >
                                                <i className="material-icons" style={{ fontSize: "15px" }}>add</i>
                                                <span style={{ cursor: "pointer", fontSize: "25px" }} onClick={(e) => { this.addQuestionToSeries(e) }}>Thêm câu hỏi</span>
                                            </div>
                                        </div>
                                    )}

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
