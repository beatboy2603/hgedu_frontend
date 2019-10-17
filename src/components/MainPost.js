import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class MainPost extends Component {
    render() {
        const { imgSrc, title, body } = this.props;
        return (
            <div className="main-post white row z-depth-1 border-20" style={{margin: "1.5%"}}>
                <div className="col s8" style={{paddingLeft:"0", height:"322.5px"}}><img className='responsive-img' src={imgSrc} alt="Main Image" /></div>
                
                <div className="col s4 flex-column container">
                    <h6 className="blue-text bold">{title}</h6>
                    <p>{body}</p>
                    <a href="">Đọc tiếp</a>
                </div>
            </div>
        )
    }
}

export default MainPost;
