import React, { Component } from 'react'
import { Modal, Collapsible, CollapsibleItem } from 'react-materialize';
import CustomizedSelect from '../../common/CustomizedSelect';
import ContentEditor from "./ContentEditor";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CustomizedEditableSelect from '../../common/CustomizedEditableSelect';
import { InlineMath } from 'react-katex';
import axios from 'axios';
import FormControl from '@material-ui/core/FormControl';
import { serverUrl } from '../../common/common';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class ModalQuestion extends Component {

    state = {
        currentFolder: null,
        resetAll: [],
        formIdentifiers: [],
        allSpecialKnowledge: [],
        currentQuestion: null,
        questionDetail: {
            questionCode: "",
            content: "",
            questionSeries: false,
            folderId: null,
            knowledgeGroup: null,
        },
        questionList: [
            {
                resetContentEditor: null,
                question: {
                    questionCode: "",
                    content: "",
                    specialKnowledge: null,
                    formIdentifier: null,
                    explanation: null,
                    difficultyId: null,
                    description: null,
                    gradeLevelId: null,
                    questionTypeId: null,
                },
                tempAnswer: {
                    content: "",
                    isCorrect: false,
                    linkedAnswers: null
                },
                answers: []
            }
        ],
        valid: false,
        isOpen: false,
    }

    checkValid = () => {
        let valid = true;
        if (this.state.questionDetail.questionSeries) {

        }
        this.state.questionList.map((el, i) => {
            if (this.isQuillEmpty(el.question.content)) {
                valid = false;
            }
            el.answers.map((el, i) => {
                if (this.isQuillEmpty(el.content)) {
                    valid = false;
                }
            })
        })
    }

    isQuillEmpty = (value) => {
        let isEmpty = true;
        if (value && value.ops && value.ops.length > 0) {
            value.ops.map(el => {
                if (el.insert.image) {
                    isEmpty = false;
                }
                if (el.insert.formula && el.insert.formula.trim() != '') {
                    isEmpty = false;
                }
                if (!el.insert.image && !el.insert.formula && el.insert.trim() != '') {
                    isEmpty = false;
                }
            })
        }
        return isEmpty
    }

    resetAllEditors = () => {
        if (this.state.resetAll) {
            this.state.resetAll.map(reset => {
                reset();
            })
        }
        this.setState({
            isOpen: false
        })
    }

    handleQuillChange = (value, source, index) => {
        // console.log(source + " " + index + " " + value)
        if (source == "questionSeries") {
            console.log("yes?");
            this.setState(prevState => ({
                ...prevState,
                questionDetail: {
                    // ...prevState.questionDetail,
                    content: value,
                },
            }))
        } else {
            const questionList = this.state.questionList.map((questionDetail, i) => {
                if (source == "question") {
                    if (i == index) {
                        questionDetail.question.content = value;
                    }
                }
                if (source == "answer") {
                    if (i == index) {
                        questionDetail.tempAnswer.content = value;
                    }
                }
                if (source == "explanation") {
                    if (i == index) {
                        questionDetail.question.explanation = value;
                    }
                }
                return questionDetail;
            })
            this.setState(prevState => ({
                ...prevState,
                questionDetail: {
                    ...prevState.questionDetail,
                },
                questionList
            }))
        }

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

    handleQuestionSeriesCode = (e) => {
        const value = e.target.value;
        this.setState(prevState => ({
            questionDetail: {
                ...prevState.questionDetail,
                questionCode: value,
            }
        }))
    }

    handleQuestionSeriesContent = (value, source, index) => {
        this.setState(prevState => ({
            questionDetail: {
                ...prevState.questionDetail,
                content: value,
            }
        }))
        // console.log(this.state.questionDetail && this.state.questionDetail.content && this.state.questionDetail.content.ops && this.state.questionDetail.content.ops[0] && this.state.questionDetail.content.ops[0].insert.trim() ? "valid" : "invalid");
    }

    handleListInputChange = (source, index) => (e) => {
        const questionList = this.state.questionList.map((questionDetail, i) => {
            if (i == index) {
                if (source == "description") {
                    questionDetail.question.description = e.target.value;
                }
                if (source == "questionCode") {
                    questionDetail.question.questionCode = e.target.value;
                }
            }
            // if (source == "description") {
            //     if (i == index) {
            //         questionDetail.question.description = e.target.value;
            //     }
            // }
            // if (source == "questionCode") {
            //     if (i == index) {
            //         questionDetail.question.questionCode = e.target.value;
            //     }
            // }
            return questionDetail;
        })
        this.setState(prevState => ({
            ...prevState,
            questionDetail: {
                ...prevState.questionDetail,
            },
            questionList
        }))
    }

    handleSelectChange = (source, value) => {
        const questionList = this.state.questionList.map((questionDetail, i) => {
            if (i == source.index) {
                if (source.name == "difficultyId") {
                    questionDetail.question.difficultyId = value
                }
                if (source.name == "specialKnowledge") {
                    questionDetail.question.specialKnowledge = value
                }
                if (source.name == "formIdentifier") {
                    questionDetail.question.formIdentifier = value
                }
                if (source.name == "gradeLevelId") {
                    questionDetail.question.gradeLevelId = value
                }
                if (source.name == "questionTypeId") {
                    questionDetail.question.questionTypeId = value
                }
            }
            return questionDetail;
        })
        this.setState(prevState => ({
            ...prevState,
            questionDetail: {
                ...prevState.questionDetail,
            },
            questionList
        }))
    }

    addAnswerOption = (index) => {
        // if (!this.state.questionList[index].tempAnswer.content) {
        //     alert("Bạn cần điền câu trả lời!");
        //     return;
        // }
        if (this.isQuillEmpty(this.state.questionList[index].tempAnswer.content)) {
            alert("Bạn cần điền câu trả lời!");
            return;
        }
        const questionList = this.state.questionList.map((questionDetail, i) => {
            if (i == index) {
                let isEdit = false;
                questionDetail.answers.map((answer, i) => {
                    if (!isEdit && !answer.content) {
                        questionDetail.answers[i] = questionDetail.tempAnswer;
                        questionDetail.tempAnswer = {
                            content: "",
                            isCorrect: false,
                            linkedAnswers: null
                        };
                        isEdit = true;
                    }
                })
                if (!isEdit) {
                    questionDetail.answers = [...this.state.questionList[i].answers, this.state.questionList[i].tempAnswer];
                    questionDetail.tempAnswer = {
                        content: "",
                        isCorrect: false,
                        linkedAnswers: null
                    };
                }
            }
            return questionDetail;
        })
        questionList[index].resetContentEditor();
        this.setState(prevState => ({
            ...prevState,
            questionDetail: {
                ...prevState.questionDetail,
            },
            questionList
        }))
    }

    editAnswerOption = (e, index, answerIndex) => {
        e.preventDefault();
        console.log(index + " " + answerIndex);
        const questionList = this.state.questionList.map((questionDetail, i) => {
            if (i == index) {
                questionDetail.tempAnswer = questionDetail.answers[answerIndex];
                questionDetail.answers[answerIndex] = {
                    content: "",
                    isCorrect: false,
                    linkedAnswers: null
                };
                console.log(questionDetail);
            }
            return questionDetail;
        })
        this.setState(prevState => ({
            ...prevState,
            questionDetail: {
                ...prevState.questionDetail,
            },
            questionList
        }))
    }
    deleteAnswerOption = (e, index, answerIndex) => {
        e.preventDefault();
        const questionList = this.state.questionList.map((questionDetail, i) => {
            if (i == index) {
                const newAnswers = questionDetail.answers.filter((item, j) => answerIndex != j);

                questionDetail.answers = newAnswers;
            }
            return questionDetail;
        })
        this.setState(prevState => ({
            ...prevState,
            questionDetail: {
                ...prevState.questionDetail,
            },
            questionList
        }))
    }

    chooseRightAnswer = (questionIndex, answerIndex) => {
        const questionList = this.state.questionList.map((questionDetail, i) => {
            if (i == questionIndex) {
                questionDetail.answers.map((answer, j) => {
                    answer.isCorrect = false;
                    if (j == answerIndex) {
                        answer.isCorrect = true;
                    }
                })
            }
            return questionDetail;
        })
        this.setState(prevState => ({
            ...prevState,
            questionDetail: {
                ...prevState.questionDetail,
            },
            questionList
        }))
    }

    renderAnswerOptions = (index) => {
        const renderedAnswers = this.state.questionList[index].answers.map((answer, i) => {
            return (
                <div >
                    {/* <div>
                        {i == 0 && "A:"}
                        {answer.content.map(
                            obj => obj.insert.formula ? (<InlineMath math={obj.insert.formula} />) : (<span> {obj.insert} </span>))}
                    </div> */}
                    {answer.content &&
                        <div className="flex-row" style={{ justifyContent: "space-between" }}>
                            <div style={{ maxWidth: "50vw", wordBreak: "break-all" }}>
                                <label>
                                    <input name={"group" + index} type="radio" onClick={() => { this.chooseRightAnswer(index, i); console.log(answer) }} />

                                    {answer.isCorrect ? (
                                        <span style={{ color: "#086bd1" }}>
                                            {i == 0 && "A: "}
                                            {i == 1 && "B: "}
                                            {i == 2 && "C: "}
                                            {i == 3 && "D: "}
                                            {answer.content && answer.content.ops && answer.content.ops.map(
                                                obj => obj.insert.formula ? (<InlineMath math={obj.insert.formula} />) : (obj.insert.image ? (<img src={obj.insert.image} alt="image" width={obj.attributes && obj.attributes.width} />) : (<span> {obj.insert} </span>)))}
                                        </span>
                                    ) : (
                                            <span style={{ color: "rgba(0,0,0,0.87)" }}>
                                                {i == 0 && "A: "}
                                                {i == 1 && "B: "}
                                                {i == 2 && "C: "}
                                                {i == 3 && "D: "}
                                                {answer.content && answer.content.ops && answer.content.ops.map(
                                                    obj => obj.insert.formula ? (<InlineMath math={obj.insert.formula} />) : (obj.insert.image ? (<img src={obj.insert.image} alt="image" width={obj.attributes && obj.attributes.width} />) : (<span> {obj.insert} </span>)))}
                                            </span>
                                        )}
                                </label>
                            </div>

                            <div>
                                <span style={{ cursor: "pointer" }} className="red-text lighten-1" onClick={(e) => { this.deleteAnswerOption(e, index, i) }}>Xóa</span>
                                <span style={{ margin: "0 5px" }}></span>
                                <span style={{ cursor: "pointer" }} className="blue-text lighten-1" onClick={(e) => { this.editAnswerOption(e, index, i) }}>Sửa</span>
                                {/* <button onClick={(e) => { this.editAnswerOption(e, index, i) }}>edit</button>
                                <button onClick={(e) => { this.deleteAnswerOption(e, index, i) }}>delete</button> */}
                            </div>
                        </div>
                    }
                </div>
            )
        });
        return renderedAnswers;
    }

    addQuestionToSeries = (e) => {
        e.preventDefault();
        this.setState(prevState => ({
            questionList: [...prevState.questionList, {
                resetContentEditor: null,
                question: {
                    questionCode: "",
                    content: "",
                    specialKnowledge: null,
                    formIdentifier: null,
                    explanation: null,
                    difficultyId: null,
                    description: null,
                    gradeLevelId: null,
                    questionTypeId: null,
                },
                tempAnswer: {
                    content: "",
                    isCorrect: false,
                    linkedAnswers: null
                },
                answers: [],
            }]
        }))
    }

    deleteQuestionFromSeries = (e, index) => {
        e.preventDefault();
        const questionList = this.state.questionList.filter((questionDetail, i) => index != i);
        this.setState(prevState => ({
            ...prevState,
            questionDetail: {
                ...prevState.questionDetail,
            },
            questionList
        }))
    }


    setCurrentQuestion = () => {
        if (this.props.currentQuestion) {
            let currentQuestion = this.props.currentQuestion;
            axios.get(serverUrl + "api/question/getFullQuestionAndAnswers/" + currentQuestion.questionId).then(res => {
                let questionList = res.data;
                console.log("before", res);
                let questionDetail = {
                    questionCode: "",
                    content: null,
                    questionSeries: false,
                    folderId: null,
                    knowledgeGroup: null,
                };
                if (questionList.length > 1) {
                    questionDetail = questionList[0].question;
                    // questionList = questionList.filter((el,i)=>{return i!=0});
                    console.log("before", questionList);
                    questionList.splice(0,1);
                    console.log("after" ,questionList);
                    // questionDetail.content = questionDetail.content.slice(0, questionDetail.content.length - 2) + "]";
                    questionDetail.content = JSON.parse(questionDetail.content);
                    questionDetail.questionSeries = true;
                    
                }
                questionList.map((el, i) => {
                    console.log(el);
                    // el.question.content = el.question.content.slice(0, el.question.content.length - 2) + "]";
                    el.question.content = JSON.parse(el.question.content);
                    el.tempAnswer = {
                        content: "",
                        isCorrect: false,
                        linkedAnswers: null
                    }
                    el.answers && el.answers.map((answer,i)=>{
                        // answer.content = answer.content.slice(0, answer.content.length - 2) + "]";
                        answer.content = JSON.parse(answer.content);
                        return answer;
                    })
                    el.question.explanation = JSON.parse(el.question.explanation);
                    return el;
                })
                this.setState(prevState => ({
                    ...prevState,
                    questionDetail,
                    currentQuestion,
                    questionList: questionList,
                    isOpen: true,
                }), () => {
                    console.log(this.state);
                    setTimeout(() => {
                        this.modalTop.scrollIntoView(false);
                    }, 1);
                })
                console.log(res.data);
            })
            // axios.get(serverUrl + "api/question/getFullQuestionAndAnswers/" + currentQuestion.questionId).then(res => {
            //     console.log(res.data);
            // })
            // let a = this.state.questionList;
            // a[0].question = currentQuestion
            // this.setState(prevState => ({
            //     ...prevState,
            //     questionDetail: {
            //         ...prevState.questionDetail,
            //     },
            //     currentQuestion,
            //     questionList: a,
            //     isOpen: true,
            // }), () => {
            //     setTimeout(() => {
            //         this.modalTop.scrollIntoView(false);
            //     }, 1);
            // })
        }
    }

    waitUpdate = false;

    componentDidUpdate() {
        let folderId = this.props.match.params.folderId;
        if (this.state.currentFolder && folderId !== this.state.currentFolder.folderId && !this.waitUpdate) {
            if (this.props.folder.folders) {
                this.waitUpdate = true;
                this.props.folder.folders.map((folder, index) => {
                    if (folder.folderId == folderId) {
                        let currentFolder = folder;
                        if (currentFolder !== this.state.currentFolder) {
                            this.setState(prevState => ({
                                ...prevState,
                                currentFolder,
                                questionDetail: {
                                    ...prevState.questionDetail,
                                    folderId: currentFolder.folderId,
                                }
                            }), () => {
                                this.waitUpdate = false;
                            })
                        } else {
                            this.waitUpdate = false;
                        }
                    }
                })
            }
        }
    }

    componentDidMount() {
        let folderId = this.props.match.params.folderId;
        axios.get(serverUrl + "api/folder/" + folderId).then(res => {
            this.setState(prevState => ({
                ...prevState,
                currentFolder: res.data,
                questionDetail: {
                    ...prevState.questionDetail,
                    folderId: res.data.folderId,
                }
            }))
        })
        axios.get(serverUrl + "api/question/getFormIdentifiers/" + this.props.user.uid).then(res => {
            const formIdentifiers = res.data.map(el => {
                return { value: el, text: el }
            })
            this.setState(prevState => ({
                ...prevState,
                formIdentifiers,
                questionDetail: {
                    ...prevState.questionDetail,
                    folderId: res.data.folderId,
                }
            }))
        })
        axios.get(serverUrl + "api/question/getAllSpecialKnowledge/" + this.props.user.uid).then(res => {
            const allSpecialKnowledge = res.data.map(el => {
                return { value: el, text: el }
            })
            this.setState(prevState => ({
                ...prevState,
                allSpecialKnowledge,
                questionDetail: {
                    ...prevState.questionDetail,
                    folderId: res.data.folderId,
                }
            }))
        })
    }

    modalTop = null;

    testSend = () => {
        let data = [this.state.questionDetail, ...this.state.questionList];
        axios.post(serverUrl + 'api/question/addQuestion', data).then(res => {
            console.log(res);
        })
        axios.post(serverUrl + 'api/question/wew').then(res => {
            console.log(res);
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
                                        <input type="text" className="validate" value={this.state.questionList[i].question.questionCode} onChange={this.handleListInputChange("questionCode", i)} />
                                    </div>
                                </div>
                                <div className="col s2">Câu hỏi<span className='red-text'>*</span>:</div>
                                <div className="col s10">
                                    <ContentEditor customStyle={{ height: "150px", marginBottom: "50px" }} content={this.state.questionList[i].question.content} updateContent={this.handleQuillChange} quillSource="question" index={i} toolbarModules={[['image'],
                                    ['formula'],]} setResetAll={resetForm => {
                                        this.setState(prevState => ({
                                            resetAll: [...prevState.resetAll, resetForm],
                                        }))
                                    }} />
                                </div>
                                <div className="col s2" style={lineSpacing}>Đáp án<span className='red-text'>*</span>:</div>
                                <div className="col s10" style={lineSpacing}>
                                    <ContentEditor customStyle={{ height: "150px", marginBottom: "50px" }} content={this.state.questionList[i].tempAnswer.content} updateContent={this.handleQuillChange} quillSource="answer" index={i} toolbarModules={[['image'],
                                    ['formula'],]} setClick={click => this.state.questionList[i].resetContentEditor = click} setResetAll={resetForm => {
                                        this.setState(prevState => ({
                                            resetAll: [...prevState.resetAll, resetForm],
                                        }))
                                    }} />
                                    {(this.state.questionList[i].answers.length < 4 ||
                                        !this.state.questionList[i].answers[0].content ||
                                        !this.state.questionList[i].answers[1].content ||
                                        !this.state.questionList[i].answers[2].content ||
                                        !this.state.questionList[i].answers[3].content) &&
                                        <div>
                                            <span onClick={() => { this.addAnswerOption(i) }} style={{ cursor: "pointer" }}>Thêm câu trả lời</span>
                                        </div>
                                    }
                                    {this.state.questionList[i].answers.length > 0 &&
                                        <form>
                                            {this.renderAnswerOptions(i)}
                                        </form>}
                                </div>
                                <div className="col s2" style={lineSpacing}>Mức khó<span className='red-text'>*</span>:</div>
                                <div className="col s4" style={selectSpacing}>
                                    <CustomizedSelect
                                        defaultValue={this.state.questionList[i].question.difficultyId}
                                        source={{ name: "difficultyId", index: i }}
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
                                    <CustomizedEditableSelect
                                        defaultValue={this.state.questionList[i].question.formIdentifier}
                                        items={this.state.formIdentifiers}
                                        handleParentSelect={this.handleSelectChange}
                                        source={{ name: "formIdentifier", index: i }}
                                    />
                                </div>
                                <div className="col s2" style={lineSpacing}>Trình độ<span className='red-text'>*</span>:</div>
                                <div className="col s4" style={selectSpacing}>
                                    {i == 0 ?
                                        (<CustomizedSelect
                                            defaultValue={this.state.questionList[i].question.gradeLevelId}
                                            source={{ name: "gradeLevelId", index: i }}
                                            handleParentSelect={this.handleSelectChange}
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
                                            ]} />) : (
                                            <FormControl style={{ minWidth: "120px", margin: "8px" }}>
                                                <Select
                                                    disabled
                                                    value={this.state.questionList[0].question.gradeLevelId ? this.state.questionList[0].question.gradeLevelId : "default"}
                                                >
                                                    <MenuItem value={"default"} disabled={true}>Chọn</MenuItem>
                                                    <MenuItem value={"1"} disabled={true}>Lớp 1</MenuItem>
                                                    <MenuItem value={"2"} disabled={true}>Lớp 2</MenuItem>
                                                    <MenuItem value={"3"} disabled={true}>Lớp 3</MenuItem>
                                                    <MenuItem value={"4"} disabled={true}>Lớp 4</MenuItem>
                                                    <MenuItem value={"5"} disabled={true}>Lớp 5</MenuItem>
                                                    <MenuItem value={"6"} disabled={true}>Lớp 6</MenuItem>
                                                    <MenuItem value={"7"} disabled={true}>Lớp 7</MenuItem>
                                                    <MenuItem value={"8"} disabled={true}>Lớp 8</MenuItem>
                                                    <MenuItem value={"9"} disabled={true}>Lớp 9</MenuItem>
                                                    <MenuItem value={"10"} disabled={true}>Lớp 10</MenuItem>
                                                    <MenuItem value={"11"} disabled={true}>Lớp 11</MenuItem>
                                                    <MenuItem value={"12"} disabled={true}>Lớp 12</MenuItem>
                                                    <MenuItem value={"0"} disabled={true}>Khác</MenuItem>
                                                </Select>
                                            </FormControl>
                                        )}
                                </div>
                                <div className="col s3" style={lineSpacing}>Mô tả:</div>
                                <div className="col s3 input-field" style={selectSpacing}>
                                    <input id='description' type="text" className="validate" value={this.state.questionList[i].question.description} onChange={this.handleListInputChange("description", i)} />
                                </div>
                                <div className="col s2" style={lineSpacing}>Thuộc tính<span className='red-text'>*</span>:</div>
                                <div className="col s4" style={selectSpacing}>
                                    <CustomizedSelect
                                        defaultValue={this.state.questionList[i].question.questionTypeId}
                                        source={{ name: "questionTypeId", index: i }}
                                        handleParentSelect={this.handleSelectChange}
                                        items={[
                                            { value: 1, text: "Lý thuyết", },
                                            { value: 2, text: "Bài tập", },
                                        ]} />
                                </div>
                                <div className="col s3" style={lineSpacing}>Kiến thức đặc thù:</div>
                                <div className="col s3" style={selectSpacing}>
                                    <CustomizedEditableSelect
                                        defaultValue={this.state.questionList[0].question.specialKnowledge}
                                        items={this.state.allSpecialKnowledge}
                                        handleParentSelect={this.handleSelectChange}
                                        source={{ name: "specialKnowledge", index: i }}
                                    />
                                </div>
                                <div className="col s2" style={lineSpacing}>Hướng dẫn giải<span className='red-text'>*</span>:</div>
                                <div className="col s10" style={lineSpacing}>
                                    <ContentEditor customStyle={{ height: "150px", marginBottom: "50px" }} content={this.state.questionList[i].question.explanation} updateContent={this.handleQuillChange} quillSource="explanation" index={i} toolbarModules={[['image'],
                                    ['formula'],]} setResetAll={resetForm => {
                                        this.setState(prevState => ({
                                            resetAll: [...prevState.resetAll, resetForm],
                                        }))
                                    }} />
                                </div>
                                {this.state.questionList.length>1 != 0 &&
                                    <div className="col s12">
                                        <span style={{ cursor: "pointer" }} className="red-text lighten-1" onClick={(e) => { this.deleteQuestionFromSeries(e, i) }}>Xóa</span>
                                    </div>
                                }
                            </div>
                        </CollapsibleItem>
                    </Collapsible>
                </div>
            )
        })

        return (
            <div>
                <Modal id="editQuestion" options={{ preventScrolling: true, onOpenEnd: this.setCurrentQuestion, onCloseEnd: this.resetAllEditors }} style={{ width: "70vw", maxHeight: "80vh", height: "80vh", overflow: "hidden", borderRadius: "25px", border: "4px solid #086bd1" }} actions={[]}>
                    <div style={{ paddingTop: "52.5vh" }}></div>
                    <div className="modal-content" style={{
                        position: "absolute",
                        top: "0",
                        bottom: "0",
                        left: "0",
                        right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                        overflowY: "scroll"
                    }}>
                        {this.state.isOpen &&
                            <div>
                                <h5 ref={node => { this.modalTop = node }} className="center">Sửa câu hỏi {this.state.currentQuestion && this.state.currentQuestion.questionCode}</h5>
                                <div className="line" style={{ width: "96%", marginLeft: "2%", marginTop: "30px" }}></div>

                                <div className="row">
                                    <form className="row col s12">

                                        {this.state.questionDetail.questionSeries ? (
                                            <div>
                                                <div className="col s12">
                                                    Mã chùm câu hỏi<span className='red-text'>*</span>:
                                        <div className="input-field inline" style={{ width: '30vw', marginLeft: '4vw' }}>
                                                        <input type="text" className="validate" value={this.state.questionDetail.questionCode} onChange={(e) => { this.handleQuestionSeriesCode(e) }} />
                                                    </div>
                                                </div>
                                                <div className="col s2">Câu hỏi chùm<span className='red-text'>*</span>:</div>
                                                <div className="col s10">
                                                    <ContentEditor customStyle={{ height: "150px", marginBottom: "50px" }} content={this.state.questionDetail.content} updateContent={this.handleQuestionSeriesContent} quillSource="questionSeries" index={0} toolbarModules={[['image'],
                                                    ['formula'],]} setResetAll={resetForm => {
                                                        this.setState(prevState => ({
                                                            resetAll: [...prevState.resetAll, resetForm],
                                                        }))
                                                    }} />
                                                </div>
                                            </div>
                                        ) : (
                                                <div>
                                                    <div className="col s12">
                                                        Mã câu hỏi<span className='red-text'>*</span>:
                                    <div className="input-field inline" style={{ width: '30vw', marginLeft: '7vw' }}>
                                                            <input type="text" className="validate" value={this.state.questionList[0].question.questionCode} onChange={this.handleListInputChange("questionCode", 0)} />
                                                        </div>
                                                    </div>
                                                    <div className="col s2">Câu hỏi<span className='red-text'>*</span>:</div>
                                                    <div className="col s10">
                                                        <ContentEditor customStyle={{ height: "150px", marginBottom: "50px" }} content={this.state.questionList[0].question.content} updateContent={this.handleQuillChange} quillSource="question" index={0} toolbarModules={[['image'],
                                                        ['formula'],]} setResetAll={resetForm => {
                                                            this.setState(prevState => ({
                                                                resetAll: [...prevState.resetAll, resetForm],
                                                            }))
                                                        }} />
                                                    </div>
                                                </div>
                                            )}

                                        {!this.state.questionDetail.questionSeries ? (
                                            <div>
                                                <div className="col s2" style={lineSpacing}>Đáp án<span className='red-text'>*</span>:</div>
                                                <div className="col s10" style={lineSpacing}>
                                                    <ContentEditor customStyle={{ height: "150px", marginBottom: "50px" }} content={this.state.questionList[0].tempAnswer.content} updateContent={this.handleQuillChange} quillSource="answer" index={0} toolbarModules={[['image'],
                                                    ['formula'],]} setClick={click => this.state.questionList[0].resetContentEditor = click} setResetAll={resetForm => {
                                                        this.setState(prevState => ({
                                                            resetAll: [...prevState.resetAll, resetForm],
                                                        }))
                                                    }} />
                                                    {(this.state.questionList[0].answers.length < 4 ||
                                                        !this.state.questionList[0].answers[0].content ||
                                                        !this.state.questionList[0].answers[1].content ||
                                                        !this.state.questionList[0].answers[2].content ||
                                                        !this.state.questionList[0].answers[3].content) &&
                                                        <div>
                                                            <span onClick={() => { this.addAnswerOption(0) }} style={{ cursor: "pointer" }}>Thêm câu trả lời</span>
                                                        </div>
                                                    }
                                                    {this.state.questionList[0].answers.length > 0 &&
                                                        <form>
                                                            {this.renderAnswerOptions(0)}
                                                        </form>}
                                                </div>
                                                <div className="col s2" style={lineSpacing}>Mức khó<span className='red-text'>*</span>:</div>
                                                <div className="col s4" style={selectSpacing}>
                                                    <CustomizedSelect
                                                        defaultValue={this.state.questionList[0].question.difficultyId}
                                                        source={{ name: "difficultyId", index: 0 }}
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
                                                    <CustomizedEditableSelect
                                                        defaultValue={this.state.questionList[0].question.formIdentifier}
                                                        items={this.state.formIdentifiers}
                                                        handleParentSelect={this.handleSelectChange}
                                                        source={{ name: "formIdentifier", index: 0 }}
                                                    />
                                                </div>
                                                <div className="col s2" style={lineSpacing}>Trình độ<span className='red-text'>*</span>:</div>
                                                <div className="col s4" style={selectSpacing}>
                                                    <CustomizedSelect
                                                        defaultValue={this.state.questionList[0].question.gradeLevelId}
                                                        source={{ name: "gradeLevelId", index: 0 }}
                                                        handleParentSelect={this.handleSelectChange}
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
                                                <div className="col s3 input-field" style={selectSpacing}>
                                                    <input id='description' type="text" className="validate" value={this.state.questionList[0].question.description} onChange={this.handleListInputChange("description", 0)} />
                                                </div>
                                                <div className="col s2" style={lineSpacing}>Thuộc tính<span className='red-text'>*</span>:</div>
                                                <div className="col s4" style={selectSpacing}>
                                                    <CustomizedSelect
                                                        defaultValue={this.state.questionList[0].question.questionTypeId}
                                                        source={{ name: "questionTypeId", index: 0 }}
                                                        handleParentSelect={this.handleSelectChange}
                                                        items={[
                                                            { value: 1, text: "Lý thuyết", },
                                                            { value: 2, text: "Bài tập", },
                                                        ]} />
                                                </div>
                                                <div className="col s3" style={lineSpacing}>Kiến thức đặc thù:</div>
                                                <div className="col s3" style={selectSpacing}>
                                                    <CustomizedEditableSelect
                                                        defaultValue={this.state.questionList[0].question.specialKnowledge}
                                                        items={this.state.allSpecialKnowledge}
                                                        handleParentSelect={this.handleSelectChange}
                                                        source={{ name: "specialKnowledge", index: 0 }}
                                                    />
                                                </div>
                                                <div className="col s2" style={lineSpacing}>Hướng dẫn giải<span className='red-text'>*</span>:</div>
                                                <div className="col s10" style={lineSpacing}>
                                                    <ContentEditor customStyle={{ height: "150px", marginBottom: "50px" }} content={this.state.questionList[0].question.explanation} updateContent={this.handleQuillChange} quillSource="explanation" index={0} toolbarModules={[['image'],
                                                    ['formula'],]} setResetAll={resetForm => {
                                                        this.setState(prevState => ({
                                                            resetAll: [...prevState.resetAll, resetForm],
                                                        }))
                                                    }} />
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
                            </div>}
                    </div>
                </Modal>
            </div >
        )
    }
}


const mapStateToProps = state => ({
    user: state.user,
    folder: state.folder,
})

export default connect(mapStateToProps)(withRouter(ModalQuestion));