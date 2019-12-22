import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../../common/common'
import Advertisement from '../../common/Advertisement';
import HorizontalAd1 from '../../../resources/horizontalAd1.png';
import CustomizedTestListTable from "./CustomizedTestListTable"

class TestList extends Component {
    state = {
        allQuestions: [],
        allKnowledgeGroups: [],
        linkedQuestionList: [],
        allTests: [],
        allTestQuestions: [],
        testQualities: []
    }

    updateTestQuality = () => {
        this.state.allTests.map((testEl, i)=>{
            let testQuality = {
                noOfQuestions: 0,
                testCoverage: "-",
                meanDifficulty: 0,
                typeRatio: "-:-",
                difficultyDistribution: "-:-:-:-",
            }
            let knowledgeGroups = [];
            let questionType1 = 0;
            let difficulties = [0, 0, 0, 0];
            let questionIdList = this.state.allTestQuestions.filter((el,i)=>{
                return el.testQuestionIdentity.testId == testEl.id;
            })
            // console.log(questionIdList);
            let questionList = this.state.allQuestions.filter((el,i)=>{
                let found = false;
                questionIdList.map((subEl, k)=>{
                    if(el.questionId == subEl.testQuestionIdentity.questionId){
                        found = true;
                    }
                })
                if(found){
                    return el;
                }
            })

            let linkedQuestionList = questionList.map((el, i) => {
                if (el.questionTypeId == 3) {
                    let childQuestions = questionList.filter((child, i) => el.questionId == child.questionParentId);
                    el.childQuestions = childQuestions;
                    let meanDifficulty = 0;
                    childQuestions.map((child, i) => {
                        meanDifficulty += child.difficultyId;
                    })
                    meanDifficulty = meanDifficulty / childQuestions.length;
                    el.difficultyId = meanDifficulty;
                }
                if (el.questionParentId == 0) {
                    return el;
                }
            })

            linkedQuestionList = linkedQuestionList.filter(el => el);

            linkedQuestionList.map((el, i) => {
                if (el.childQuestions) {
                    el.childQuestions.map((subEl, j) => {
                        testQuality.noOfQuestions += 1;
                        testQuality.meanDifficulty += subEl.difficultyId;
                        if (knowledgeGroups.indexOf(subEl.folderId) == -1) {
                            knowledgeGroups.push(subEl.folderId);
                        }
                        if (subEl.questionTypeId == 1) {
                            questionType1 += 1;
                        }
                        if (subEl.difficultyId == 1) {
                            difficulties[0] += 1;
                        }
                        if (subEl.difficultyId == 2) {
                            difficulties[1] += 1;
                        }
                        if (subEl.difficultyId == 3) {
                            difficulties[2] += 1;
                        }
                        if (subEl.difficultyId == 4) {
                            difficulties[3] += 1;
                        }
                    })
                } else {
                    testQuality.noOfQuestions += 1;
                    testQuality.meanDifficulty += el.difficultyId;
                    if (knowledgeGroups.indexOf(el.folderId) == -1) {
                        knowledgeGroups.push(el.folderId);
                    }
                    if (el.questionTypeId == 1) {
                        questionType1 += 1;
                    }
                    if (el.difficultyId == 1) {
                        difficulties[0] += 1;
                    }
                    if (el.difficultyId == 2) {
                        difficulties[1] += 1;
                    }
                    if (el.difficultyId == 3) {
                        difficulties[2] += 1;
                    }
                    if (el.difficultyId == 4) {
                        difficulties[3] += 1;
                    }
                }
            })
            if (testQuality.noOfQuestions != 0) {
                testQuality.meanDifficulty = testQuality.meanDifficulty / testQuality.noOfQuestions;
                testQuality.meanDifficulty = testQuality.meanDifficulty.toFixed(2);
            } else {
                testQuality.meanDifficulty = 0;
            }
            testQuality.testCoverage = ((knowledgeGroups.length / this.state.allKnowledgeGroups.length) * 100).toFixed(2) + "%";
            testQuality.typeRatio = questionType1 + ":" + (testQuality.noOfQuestions - questionType1);
            testQuality.difficultyDistribution = difficulties[0] + ":" + difficulties[1] + ":" + difficulties[2] + ":" + difficulties[3];
            testQuality.testId = testEl.id;
            testQuality.folderId = testEl.folderId;
            testQuality.title = testEl.title;
            this.setState(prevState => ({
                ...prevState,
                testQualities: [...prevState.testQualities, testQuality],
            }));
        })
    }

    isQuestionsDone = false;
    isTestsDone = false;
    isTestQuestionsDone = false;
    isKnowledgeGroupDone = false;

    componentDidMount() {
        axios.get(serverUrl + "api/folder/getAllKnowledgeGroupsId/" + this.props.user.uid).then(res => {
            const allKnowledgeGroups = res.data;
            this.setState(prevState => ({
                ...prevState,
                allKnowledgeGroups,
                questionDetail: {
                    ...prevState.questionDetail,
                    folderId: res.data.folderId,
                }
            }), ()=>{
                this.isKnowledgeGroupDone = true;
                if(this.isKnowledgeGroupDone&&this.isQuestionsDone&&this.isTestQuestionsDone&&this.isTestsDone){
                    this.updateTestQuality();
                }
            })
        })
        axios.get(serverUrl + "api/question/" + this.props.user.uid).then(res => {
            let allQuestions = res.data.map(question => {
                // question.content = question.content.slice(0, question.content.length - 2) + "]";
                question.content = JSON.parse(question.content);
                return question;
            });

            this.setState({
                allQuestions,
            }, () => {
                this.isQuestionsDone = true;
                if(this.isKnowledgeGroupDone&&this.isQuestionsDone&&this.isTestQuestionsDone&&this.isTestsDone){
                    this.updateTestQuality();
                }
            })
        })
        axios.get(serverUrl + "api/test/getAllTestQuestions/" + this.props.user.uid).then(res => {
            this.setState({
                allTestQuestions: res.data
            }, ()=>{
                this.isTestQuestionsDone = true;
                if(this.isKnowledgeGroupDone&&this.isQuestionsDone&&this.isTestQuestionsDone&&this.isTestsDone){
                    this.updateTestQuality();
                }
            })
        })
        axios.get(serverUrl + "api/test/getAllTests/" + this.props.user.uid).then(res => {
            this.setState({
                allTests: res.data
            }, ()=>{
                this.isTestsDone = true;
                if(this.isKnowledgeGroupDone&&this.isQuestionsDone&&this.isTestQuestionsDone&&this.isTestsDone){
                    this.updateTestQuality();
                }
            })
        })
    }


    render() {
        return (
            <div id="knowledgeGroup" className="knowledgeGroup row">
                <div className="col s4 container min-height-60 knowledgeGroup-header" >
                    <h5 className="blue-text text-darken-3 bold font-montserrat" style={{ paddingLeft: "10px" }}>Thư viện đề thi</h5>
                    <p className='grey-text text-darken-3' style={{ position: "relative", top: "-15px", paddingLeft: "10px" }}>
                        {/* {this.state.questionList.length} câu hỏi */}
                        {this.state.allTests && this.state.allTests.length} đề thi
                    </p>
                </div>
                <div className="col s8 container ">
                    <Advertisement imgSrc={HorizontalAd1} />
                </div>
                <div className="col s12 no-padding center">
                    {/* <SimpleTable /> */}
                    <button onClick={()=>{console.log(this.state)}}>click me</button>
                    <CustomizedTestListTable
                        headCells={[
                            { id: 'title', numeric: false, disablePadding: false, label: 'Đề' },
                            { id: 'noOfQuestions', numeric: false, disablePadding: false, label: 'Tổng số câu' },
                            { id: 'meanDifficulty', numeric: false, disablePadding: false, label: 'Độ khó trung bình' },
                            { id: 'testCoverage', numeric: false, disablePadding: false, label: 'Độ toàn diện' },
                            { id: 'typeRatio', numeric: false, disablePadding: false, label: 'Lý thuyết:Bài tập' },
                        ]}
                        rows={this.state.testQualities}/>
                </div>


            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    folder: state.folder,
})

export default connect(mapStateToProps)(withRouter(TestList));