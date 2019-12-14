import React, { Component } from 'react';

class Advertisement extends Component {
    render() {
        const { imgSrc, customStyle } = this.props;
        return (
            <div className="advertisement" style={customStyle}>
                <img src={imgSrc}/>
            </div>
        )
    }
}

export default Advertisement;