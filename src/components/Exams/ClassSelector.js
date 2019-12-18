import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import {CustomCheckbox} from '../common/CustomCheckbox'
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getClasses } from '../../actions/classAction';

class ClassSelector extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedClassList: [],
            iconColor: {color: "#3A3A3A"}
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    handleCancel = () => {
        this.setState({selectedClassList: []})
    }

    handleChange = (e) => {
        var selectedClassList = this.state.selectedClassList;
        if(e.target !== null) {
            var itemId = Number(e.target.value);
            var itemName = e.target.name;
            var item = {id: itemId, name: itemName}
            if(selectedClassList.findIndex(cls => cls ? cls.id === itemId : false) === -1) {
                //e.target.checked = true
                selectedClassList.push(item)
            } else {
                //e.target.checked = false
                selectedClassList = selectedClassList.filter(cls => cls ? cls.id !== itemId : false);
            }
            this.setState({selectedClassList});
        }
    }

    handleSubmit = (e) => {
        this.props.updateSelectedClass(this.state.selectedClassList);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.selectedClasses !== this.props.selectedClasses) {
            if(JSON.stringify(nextProps.selectedClasses) !== JSON.stringify(this.state.selectedClassList)) {
                this.setState({selectedClassList: nextProps.selectedClasses})
            }
        }
    }

    componentDidMount() {console.log("hereaaaaaaaaaaaaaaaaa")
        this.props.getClasses(this.props.user.uid);
        
    }

    render() {
        const { classList} = this.props
        return (
            <div>
                <FormControl>
                    <FormGroup>
                        { classList.map( (item, index) => 
                            <FormControlLabel
                                key={item.id}
                                checked={this.state.selectedClassList.findIndex(cls => cls.id === item.id ? true : false) !== -1 ? true : false}
                                control={<CustomCheckbox value={item.id} name={item.name} onChange={this.handleChange} />}
                                style={this.state.iconColor}
                                label={item.name}
                            />
                        )}
                    </FormGroup>
                    {/* <FormHelperText></FormHelperText> */}
                </FormControl>
                    {/* <FormHelperText></FormHelperText> */}
                <div>
                    <Divider/>
                    <a className=" modal-action modal-close black-text lighten-1" style={{ marginTop: "1vw", float: "left", fontSize: "1vw" }} onClick={this.handleCancel}>Hủy thao tác</a>
                    <button type="submit" className=" modal-action modal-close blue-text lighten-1" 
                    onClick={this.handleSubmit}
                    style={{ marginTop: "1vw", float: "right", background: "none", border: "none", padding: "0", cursor: "pointer", fontSize: "1vw" }}>Tiếp theo</button>
                </div>       
            </div>
        )
    }
}

ClassSelector.propTypes = {
    getClasses: PropTypes.func.isRequired,
    classList: PropTypes.array.isRequired,
    selectedClassList: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    classList: state.class._classList,
    user: state.user,
    selectedClassList: state.exam.selectedClassList
})

export default connect(
    mapStateToProps,
    { getClasses }
)(ClassSelector);