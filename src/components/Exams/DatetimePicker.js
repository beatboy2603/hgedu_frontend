import React, { Component, useState } from 'react';
import { DatePicker } from "@material-ui/pickers";
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

  
class DatetimePicker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedDate: new Date(),
            hour: '00',
            minute: '00',
            startTime: new Date(),
            type: '',
            error: '',
            isClose: false
        }

        this.handleDownClick = this.handleDownClick.bind(this);
        this.handleUpClick = this.handleUpClick.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);

        this.updateState = this.updateState.bind(this);

        this.maxHour = 23;
        this.minHour = 0;
        this.maxMinute = 59;
        this.minMinute = 0;
    }

    updateState = (startTime) => {
        this.setState({startTime});
    }

    getStandardNumberString = (number) => {
        if(number < 10) {
            return '0' + number;
        } 
        return '' + number;
    }

    getFormatedDateTimeString = (date, hour, minute, second = '00') => {
        if(date instanceof Date) 
            return date.toJSON().split('T')[0] + " " +
                hour + ":" +
                minute + ":" +
                second;
    }

    handleDateChange = (date) => {
        console.log("startTime", this.state.startTime)
        if(date < this.state.startTime && this.state.type === 'END') {
            console.log("here")
            this.setState({error: 'Hãy chọn thời gian kết thúc xa hơn thời gian bắt đầu ' + this.state.startTime.toLocaleString("vi-VN"),
                isClose: false})
        } else if (date >= this.state.startTime && this.state.type === 'END') {
            this.setState({error: ''});
        }
        console.log("date", date)
        this.setState({selectedDate: date})
    }

    handleUpClick = (type) => {
        switch(type) {
            case "HOUR":
                let currentHour = Number(this.state.hour);
                let nextHour = '';
                if(currentHour === this.maxHour) {
                    nextHour = '00';
                } else {
                    nextHour = this.getStandardNumberString(currentHour + 1);
                }
                this.setState({hour: nextHour});
                break;
            case "MINUTE":
                let currentMinute = Number(this.state.minute);
                let nextMinute = '';
                if(currentMinute === this.maxMinute) {
                    nextMinute = '00';
                } else {
                    nextMinute = this.getStandardNumberString(currentMinute + 1);
                }
                this.setState({minute: nextMinute});
                break;
            default:
                return;
        }
    }

    handleDownClick = (type) => {
        switch(type) {
            case "HOUR":
                let currentHour = Number(this.state.hour);
                let nextHour = '';
                if(currentHour === this.minHour) {
                    nextHour = '23';
                } else {
                    nextHour = this.getStandardNumberString(currentHour - 1);
                }
                this.setState({hour: nextHour});
                break;
            case "MINUTE":
                let currentMinute = Number(this.state.minute);
                let nextMinute = '';
                if(currentMinute === this.minMinute) {
                    nextMinute = '59';
                } else {
                    nextMinute = this.getStandardNumberString(currentMinute - 1);
                }
                this.setState({minute: nextMinute});
                break;
            default:
                return;
        }
    }

    handleScroll = (type) => {
        switch(type) {
            case "HOUR":
                console.log("scrolling")
                break;
            case "MINUTE":
                break;
            default:
                return;
        }
    }

    handleSubmit = () => {
        switch(this.state.type) {
            case "START":
                let startTime = this.getFormatedDateTimeString(this.state.selectedDate, this.state.hour, this.state.minute);
                this.props.updateSelectedStartEntryTime(startTime);
                break;
            case "END":
                let endTime = this.getFormatedDateTimeString(this.state.selectedDate, this.state.hour, this.state.minute);
                if(new Date(endTime) <= this.state.startTime) {
                    this.setState({error: 'Hãy chọn thời gian kết thúc xa hơn thời gian bắt đầu ' + this.state.startTime.toLocaleString("vi-VN"), 
                        isClose: false});
                    return;
                }
                this.props.updateSelectedEndEntryTime(endTime);
                break;
            default:
                return;
        }
        this.setState({error: '', isClose: true});
    }

    componentDidMount() {
        window.addEventListener('scroll', this.listenScrollEvent);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.startTime !== this.props.startTime) {
            if(new Date(nextProps.startTime) !== this.state.startTime) {
                let startEntryTime = new Date(nextProps.startTime);
                this.setState({startTime: startEntryTime})
            }
        }
        if(nextProps.type) {
            if(nextProps.type !== this.state.type) {
                this.setState({type: nextProps.type})
            }
        }
        if(nextProps.selectedDate !== this.props.selectedDate) {
            let selectedDate = new Date(nextProps.selectedDate);
            if(selectedDate !== 'Invalid Date') {
                this.setState({selectedDate: selectedDate,
                    hour: this.getStandardNumberString(selectedDate.getHours()),
                    minute: this.getStandardNumberString(selectedDate.getMinutes())})
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.listenScrollEvent);
    }

    render() {
        return(
            <div>
                <div className="container-fluid">
                    <div className="row" style={{display: 'flex', marginBottom: 0}}>
                        <div className="col s6 col-lg" style={{flex: 1, borderRight: '1px solid #e6e6e6', paddingTop: '20px', paddingRight: 0, paddingLeft: 0, paddingBottom: 0}}>
                            <label className="blue-text" style={{fontSize: "1vw",  marginLeft: '24px'}}>Ngày</label>
                            <div className="space-top">
                                <DatePicker
                                    autoOk
                                    rightArrowIcon={<i className="material-icons" style={{color: "#3A3A3A", display: 'block', fontSize: "2vw"}}>keyboard_arrow_right</i>}
                                    leftArrowIcon={<i className="material-icons" style={{color: "#3A3A3A", display: 'block', fontSize: "2vw"}}>keyboard_arrow_left</i>}
                                    disableToolbar={true}
                                    orientation="landscape"
                                    variant="static"
                                    openTo="date"
                                    disablePast
                                    value={this.state.selectedDate}
                                    onChange={(date) => this.handleDateChange(date)}
                                />
                            </div>
                        </div>
                        <div className="col s6 col-lg fill-height-container" style={{flex: 1, paddingTop: '20px', paddingRight: 0, paddingLeft: 0, paddingBottom: 0}}>
                            <div className=".fill-height-item"><label className="blue-text" style={{fontSize: "1vw", marginLeft: '24px'}}>Giờ</label></div>
                            <div className="space-top time-picker fill-height-item" style={{padding: '40px'}}>
                                <div className="time-picker-item align-flex-item-center">
                                    <div className="full-width-flex-item clickable" onClick={() => this.handleUpClick("HOUR")}>
                                        <i className="material-icons " style={{color: "#3A3A3A", display: 'block', fontSize: "2vw"}}>keyboard_arrow_up</i>
                                    </div>
                                    <div className="full-width-flex-item" onScroll={() => this.handleScroll("HOUR")}>
                                        <input className="blue-text text-darken-2" type="text" value={this.state.hour} style={{fontSize: "2.5vw", display: 'block', textAlign: 'center', fontWeight: 'bold', borderBottom: '1px solid #3A3A3A'}} readOnly={true}/>
                                    </div>
                                    <div className="full-width-flex-item clickable" onClick={() => this.handleDownClick("HOUR")}>
                                        <i className="material-icons" style={{color: "#3A3A3A", display: 'block', fontSize: "2vw", paddingTop: '5px'}}>keyboard_arrow_down</i>
                                    </div>
                                </div>
                                <div className="time-picker-item align-flex-item-center">
                                    <div className="full-width-flex-item">
                                        <i className="material-icons  " style={{color: "#3A3A3A", display: 'block', visibility: 'hidden', fontSize: "2vw"}}>keyboard_arrow_up</i>
                                    </div>
                                    <div className="full-width-flex-item">
                                        <input className="blue-text text-darken-2" type="text" style={{textDecorationColor: "#3A3A3A",fontSize: "2.5vw", display: 'block', textAlign: 'center', fontWeight: 'bold', borderBottom: 0}} defaultValue=":" readOnly={true}/>
                                    </div>
                                    <div className="full-width-flex-item">
                                        <i className="material-icons " style={{color: "#3A3A3A", display: 'block', visibility: 'hidden', fontSize: "2vw",  paddingTop: '5px'}}>keyboard_arrow_down</i>
                                    </div>
                                </div>
                                <div className="time-picker-item align-flex-item-center">
                                    <div className="full-width-flex-item clickable" onClick={() => this.handleUpClick("MINUTE")}>
                                        <i className="material-icons " style={{color: "#3A3A3A", display: 'block', fontSize: "2vw"}}>keyboard_arrow_up</i>
                                    </div>
                                    <div className="full-width-flex-item" onScroll={() => this.handleScroll("MINUTE")}>
                                        <input className="blue-text text-darken-2" type="text" value={this.state.minute} style={{fontSize: "2.5vw", display: 'block', textAlign: 'center', fontWeight: 'bold', borderBottom: '1px solid #3A3A3A'}} readOnly={true}/>
                                    </div>
                                    <div className="full-width-flex-item clickable" onClick={() => this.handleDownClick("MINUTE")}>
                                        <i className="material-icons " style={{color: "#3A3A3A", display: 'block', fontSize: "2vw",  paddingTop: '5px'}}>keyboard_arrow_down</i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{color: 'red', fontStyle: 'italic'}}>{this.state.error}</div>
                <div style={{paddingBottom:  '25px'}}>
                    <Divider style={{margin: 0}}/>
                    <a className=" modal-action modal-close black-text lighten-1" style={{ marginTop: "1vw", marginBottom: "1vw", float: "left", fontSize: "1vw" }}>Hủy thao tác</a>
                    <button type="submit" className={"blue-text lighten-1 " + this.state.isClose ? " modal-action modal-close " : ''  }
                    onClick={this.handleSubmit}
                    style={{ marginTop: "1vw", marginBottom: "1vw", float: "right", background: "none", border: "none", padding: "0", cursor: "pointer", fontSize: "1vw" }}>Hoàn tất</button>
                </div>
            </div>
        )
    }
}

export default DatetimePicker;