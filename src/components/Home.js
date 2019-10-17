import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import MainPost from './MainPost';
import SubPost from './SubPost';
import Advertisement from './Advertisement';
import { Carousel } from 'react-materialize';
import { axiosPost } from "../common/common";
import axios from 'axios';

class Home extends Component {

    componentDidMount() {
        axios.get('http://localhost:8080/api/hello')
            .then(res => {
                console.log(res);
            })
    }


    render() {
        return (
            <div className="home row">
                <div className="col s1"></div>
                <div className="col s7 container row">
                    <h5 className="blue-text text-darken-2 bold font-montserrat">Tin tức</h5>
                    <MainPost imgSrc='https://znews-photo.zadn.vn/w1024/Uploaded/qhj_yvobvhfwbv/2018_07_18/Nguyen_Huy_Binh1.jpg' title='Với chúng tôi, sự kết nối là tất cả' body='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas alias sint libero veritatis exercitationem. Ipsam vitae accusantium odio? Laborum possimus dolorum molestias, reprehenderit eius maxime iure unde at autem exercitationem?' />
                    <Carousel options={{ dist: 0, padding: 0 }} className="white-text center">
                        <div className="col s4 carousel-item">
                            <SubPost imgSrc='https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fspecials-images.forbesimg.com%2Fdam%2Fimageserve%2F1040138812%2F960x0.jpg%3Ffit%3Dscale' title='Với chúng tôi, sự kết nối là tất cả' body='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas alias sint libero veritatis exercitationem. Ipsam vitae accusantium odio? Laborum possimus dolorum molestias, reprehenderit eius maxime iure unde at autem exercitationem?' />
                        </div>
                        <div className="col s4 carousel-item">
                            <SubPost imgSrc='https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fspecials-images.forbesimg.com%2Fdam%2Fimageserve%2F1040138812%2F960x0.jpg%3Ffit%3Dscale' title='Với chúng tôi, sự kết nối là tất cả' body='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas alias sint libero veritatis exercitationem. Ipsam vitae accusantium odio? Laborum possimus dolorum molestias, reprehenderit eius maxime iure unde at autem exercitationem?' />
                        </div>
                        <div className="col s4 carousel-item">
                            <SubPost imgSrc='https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fspecials-images.forbesimg.com%2Fdam%2Fimageserve%2F1040138812%2F960x0.jpg%3Ffit%3Dscale' title='Với chúng tôi, sự kết nối là tất cả' body='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas alias sint libero veritatis exercitationem. Ipsam vitae accusantium odio? Laborum possimus dolorum molestias, reprehenderit eius maxime iure unde at autem exercitationem?' />
                        </div>
                        <div className="col s4 carousel-item">
                            <SubPost imgSrc='https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fspecials-images.forbesimg.com%2Fdam%2Fimageserve%2F1040138812%2F960x0.jpg%3Ffit%3Dscale' title='Với chúng tôi, sự kết nối là tất cả' body='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas alias sint libero veritatis exercitationem. Ipsam vitae accusantium odio? Laborum possimus dolorum molestias, reprehenderit eius maxime iure unde at autem exercitationem?' />
                        </div>
                        <div className="col s4 carousel-item">
                            <SubPost imgSrc='https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fspecials-images.forbesimg.com%2Fdam%2Fimageserve%2F1040138812%2F960x0.jpg%3Ffit%3Dscale' title='Với chúng tôi, sự kết nối là tất cả' body='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas alias sint libero veritatis exercitationem. Ipsam vitae accusantium odio? Laborum possimus dolorum molestias, reprehenderit eius maxime iure unde at autem exercitationem?' />
                        </div>
                    </Carousel>
                </div>
                <div className="col s3 flex-column">
                    <Advertisement />
                    <Advertisement />
                </div>
            </div >
        )
    }
}

export default Home;
