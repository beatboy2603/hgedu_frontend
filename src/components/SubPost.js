import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class SubPost extends Component {
    render() {
        const { imgSrc, title, body } = this.props;
        return (
            <div className="sub-post white z-depth-1 border-20 center">
                <div className="center">
                    <img className='responsive-img' src={imgSrc} alt="Main Image" />
                </div>

                <div className="container flex-column">
                    <h6 className="blue-text bold">{title}</h6>
                    <p className='truncate'>{body}</p>
                    <a href="">Đọc tiếp</a>
                </div>
            </div>
        )
    }
}

export default SubPost;
