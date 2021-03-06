import React, { Component } from 'react'

export default class Toggle extends Component {

    render() {
        let {label, handleToggleChange, customStyle, checked} = this.props;

        return (
            <div className="switch valign-wrapper" style={customStyle}>
                <label>
                    <input type="checkbox" onChange={handleToggleChange} checked={checked}/>
                    <span className="lever"></span>
                    <span style={{ color: "#333333", fontSize: "15px" }}>{label}</span>
                </label>
            </div>
        )
    }
}
