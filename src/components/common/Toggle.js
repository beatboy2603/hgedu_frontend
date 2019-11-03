import React, { Component } from 'react'

export default class Toggle extends Component {

    render() {
        let {label, handleToggleChange} = this.props;

        return (
            <div className="switch valign-wrapper" style={{ position: "relative", left: "-20px" }}>
                <label>
                    <input type="checkbox" onChange={handleToggleChange} />
                    <span className="lever"></span>
                    <span style={{ color: "#333333", fontSize: "15px" }}>{label}</span>
                </label>
            </div>
        )
    }
}
