import React, { Component } from 'react';
import Button from 'react-materialize/lib/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Link from '@material-ui/core/Link';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { CustomCheckbox } from '../common/CustomCheckbox';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getTestsRootFolder, getTestsAndFolders} from '../../actions/examTestAction';

class TestSelector extends Component {

    constructor(props) {
        super(props);

        this.state = {
            testRoot: {},
            prevFolderId: -1,
            isUpdated: false,
            currentFolderId: -1,
            testList: [],
            folderList: [],
            path: [],
            originalFolderTest: {},
            selectedTestList: [],
            iconColor: {color: "#3A3A3A"}
        }

        this.handleBack = this.handleBack.bind(this);
        this.handleFolderClick = this.handleFolderClick.bind(this);
        this.handlePathClick = this.handlePathClick.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateSelectedTestList = this.updateSelectedTestList.bind(this);
    }

    updateSelectedTestList = (selectedTestList) => {
        this.setState({selectedTestList});
    }

    handleSubmit = () => {
        //update
        //this.props.updateSelectedTests(this.state.selectedTestList);
        this.props.updateSelectedTests(this.state.selectedTestList);
        console.log("origin folder test", this.state.originalFolderTest)
        let testRoot = this.state.testRoot;
        this.setState({path: [{id: Number(testRoot.folderId), name: testRoot.folderName}],
                                currentFolderId: Number(testRoot.folderId)});
        let originalFolderTest = this.state.originalFolderTest;
        this.setState({folderList: originalFolderTest.childFolderList, testList: originalFolderTest.testList});
        this.props.getTestsAndFolders(this.state.testRoot.folderId, this.props.user.uid);
        // this.setState({isUpdated: false});
    }

    handleCheck = (e) => {
        if(e.target) {
            let testIndex = Number(e.target.value);
            let test = null;
            let testList = this.state.testList;
            let selectedTestList = this.state.selectedTestList;
            if(testList && testList.length > 0) {
                test = testList[testIndex];
                if(test) {
                    let isPresent = selectedTestList.findIndex(item => item ? item.id === test.id : false);
                    if(isPresent === -1) {
                        selectedTestList.push(test);
                        e.target.checked = true;
                        this.setState({selectedTestList});
                    } else {
                        e.target.checked = false;
                        this.setState({selectedTestList: this.state.selectedTestList.filter(item => item ? item.id !== test.id : false)});
                    }
                    console.log("update", selectedTestList);
                }
            } 
        }
    }

    handleBack = () => {
        let path = this.state.path;
        if(path && path.length === 1) {
            this.props.getTestsAndFolders(this.state.testRoot.folderId, this.props.user.uid);
            this.setState({path: []})
            this.setState({currentFolderId: this.state.testRoot.folderId});
        } else if (path && path.length > 1){
            let currentFolder = null;
            //get current folder
            let pathFolderArray = this.getPathFolder(this.state.currentFolderId);
            if(pathFolderArray.length > 0) {
                currentFolder = pathFolderArray[0];
            } 
            if(currentFolder) {
                //get new path
                path = path.slice(0, path.findIndex(item => item ? item.id === currentFolder.id : false));
                //get next folder
                let nextCurrentFolder = path[path.length - 1];
                if(nextCurrentFolder) {
                    this.setState({currentFolderId: nextCurrentFolder.id})
                    this.setState({path});
                    this.props.getTestsAndFolders(nextCurrentFolder.id, this.props.user.uid);
                }
            }
        }
    }

    getPathFolder = (folderId) => {
        return this.state.path.filter(item => item.id === folderId);
    }

    handlePathClick = (e) => {
        if(e.target) {
            let folderId = Number(e.target.value);
            let folderName = e.target.name;
            let currentFolder = {id: folderId, name: folderName};
            let path = this.state.path;
            let indexOfCurrentFolder = path.findIndex(item => item ? item.id === folderId : false);
            if(indexOfCurrentFolder !== path.length - 1) {
                path = path.slice(0, indexOfCurrentFolder + 1);
                this.setState({path});
                this.setState({currentFolderId: folderId});
                this.props.getTestsAndFolders(folderId, this.props.user.uid);
            }
        }
    }

    handleFolderClick = (e) => {
        if(e.target) {
            let folderId = Number(e.target.value);
            let folderName = e.target.name;
            let currentFolder = {id: folderId, name: folderName};
            let path = this.state.path;
            this.setState({prevFolderId: this.state.currentFolderId});
            this.setState({currentFolderId: folderId})
            path.push(currentFolder);
            this.setState({path});
            this.props.getTestsAndFolders(folderId, this.props.user.uid);
        }
    }

    isTestEqual =(array1, array2) => {
        if(array1 && array2) {
            if(array1.length > 0 &&  array1.length === array2.length) {
                let result = array1.filter(item1 => array2.findIndex(item2 => item2.id === item1.id) === -1);
                if(result.length === 0)
                    return true;
            }
        }
        return false;
    }

    isFolderEqual =(array1, array2) => {
        if(array1 && array2) {
            if(array1.length > 0 && array1.length === array2.length) {
                let result = array1.filter(item1 => array2.findIndex(item2 => item2.folderId === item1.id) === -1);
                if(result.length === 0)
                    return true;
            }
        }
        return false;
    }

    isEmpty = (obj) => {
        if(Object.entries(obj).length === 0 && obj.constructor === Object) {
            return true;
        }
        return false;
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.testRoot
            // && this.isEmpty(this.state.testRoot)
            ) {
            console.log("Root",nextProps.testRoot)
            if(JSON.stringify(nextProps.testRoot) !== JSON.stringify(this.state.testRoot))
                this.setState({path: [{id: Number(nextProps.testRoot.folderId), name: nextProps.testRoot.folderName}],
                                testRoot: nextProps.testRoot,
                                currentFolderId: Number(nextProps.testRoot.folderId)});
        }
        if(nextProps.folderTest) {
            let folderTest = nextProps.folderTest;
            if(this.state.currentFolderId === this.state.testRoot.folderId) {
                this.setState({originalFolderTest: folderTest});
            }
            if(JSON.stringify(this.state.testList) !==  JSON.stringify(folderTest.testList)) {
                this.setState({testList: folderTest.testList});
            } 
            if(JSON.stringify(this.state.folderList) !== JSON.stringify(folderTest.childFolderList)) {
                console.log("reset folder list")
                this.setState({folderList: folderTest.childFolderList});
            } 
        }
        if(nextProps.selectedTests !== this.props.selectedTests) {
            if(JSON.stringify(nextProps.selectedTests) !== JSON.stringify(this.state.selectedTestList))
                this.setState({selectedTestList: nextProps.selectedTests});
        }
    }

    componentDidMount() {
        if(this.isEmpty(this.state.testRoot)) {
            this.props.getTestsRootFolder(this.props.user.uid);
        } 
    }

    // isUpdate
    componentDidUpdate() {
        console.log("reset test")
        if(!this.isEmpty(this.state.testRoot) 
            && this.state.testRoot.folderId === this.state.currentFolderId
            && this.state.isUpdated === false) {
            console.log("update root")
            this.props.getTestsAndFolders(this.state.testRoot.folderId, this.props.user.uid);
            this.setState({isUpdated: true});
        }
        // if(!this.isTestEqual(this.props.selectedTests, this.state.selectedTestList)) {
        //     this.setState({selectedTestList: this.props.selectedTests});
        // }
    }

    render() {
        return (
            <div>

                <div className="row center-content" style={{justifyContent: 'left'}}>
                    {this.state.path && this.state.path.length !== 0 &&
                        <>  
                            {Number(this.state.testRoot.folderId) !== this.state.currentFolderId &&
                                <Link
                                    underline='none'
                                    component="button"
                                    variant="body2"
                                    className="blue-text no-background"
                                    onClick={this.handleBack}
                                    style={{display: 'flex'}}
                                    >
                                    <ArrowBackIcon/>
                                </Link>
                            }
                            { this.state.path.map((item, index) => 
                                index === this.state.path.length - 1 ?
                                <Link
                                    key={item.id}
                                    component="button"
                                    value={item.id}
                                    name={item.name}
                                    variant="body2"
                                    className="blue-text no-background"
                                    onClick={this.handlePathClick}
                                    >
                                    {item.name}
                                </Link>
                                :
                                <Link
                                    key={item.id}
                                    component="button"
                                    value={item.id}
                                    name={item.name}
                                    variant="body2"
                                    className="blue-text no-background"
                                    onClick={this.handlePathClick}
                                    >
                                    {item.name}\
                                </Link>
                            )}
                        </>
                    }
                </div>
                <div>
                    <FormControl>
                        <FormGroup>
                            { this.state.folderList && this.state.folderList.map(item => 
                                <Link href="#" underline='none' key={item.folderId}>
                                    <FormControlLabel
                                        className="icon-center-text"
                                        control={<Checkbox value={item.folderId} name={item.folderName} onClick={this.handleFolderClick} style={{visibility: 'hidden'}} />}
                                        label={
                                            <>
                                                <i className="material-icons icon-space" style={this.state.iconColor}>folder</i>
                                                <span style={this.state.iconColor}>{item.folderName}</span>
                                            </>}
                                    />
                                </Link>
                            )}
                            { this.state.testList && this.state.testList.map((item, index) =>
                                <FormControlLabel
                                    key={item.id}
                                    checked={this.state.selectedTestList.findIndex(test => test.id === item.id ? true : false) === -1 ? false : true}
                                    control={
                                        <CustomCheckbox 
                                            value={index} 
                                            name={item.testCode} 
                                            onChange={this.handleCheck} />}
                                    className="icon-center-text"
                                    label={
                                        <>
                                            <i className="material-icons icon-space" style={this.state.iconColor}>description</i>
                                            <span style={this.state.iconColor}>{item.testCode}</span>
                                        </>}
                                />
                            )}
                        </FormGroup>
                    </FormControl>
                </div>
                <div>
                    <Divider/>
                    <a className=" modal-action modal-close black-text lighten-1" style={{ marginTop: "1vw",marginBottom: "1vw", float: "left", fontSize: "1vw" }}>Hủy thao tác</a>
                    <button type="submit" 
                    onClick={this.handleSubmit}
                    className=" modal-action modal-close blue-text lighten-1" 
                    style={{ marginTop: "1vw",marginBottom: "1vw", float: "right", background: "none", border: "none", padding: "0", cursor: "pointer", fontSize: "1vw" }}>Hoàn tất</button>
                </div>
            </div>
        )
    }
}

TestSelector.propTypes = {
    getTestsRootFolder: PropTypes.func.isRequired,
    getTestsAndFolders: PropTypes.func.isRequired,
    folderTest: PropTypes.object.isRequired,
    testRoot: PropTypes.object.isRequired,
    selectedTestList: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    testRoot: state.examTest.testRoot,
    folderTest: state.examTest.folderTest,
    selectedTestList: state.examTest.selectedTestList,
    user: state.user
})

export default connect(
    mapStateToProps,
    { getTestsRootFolder, getTestsAndFolders}
)(TestSelector);