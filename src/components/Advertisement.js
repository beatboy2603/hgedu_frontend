import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Advertisement extends Component {
    render() {
        const { imgSrc, title, body } = this.props;
        return (
            <div className="advertisement z-depth-1 white">
                
            </div>
        )
    }
}

export default Advertisement;