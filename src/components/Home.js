import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import MainPost from './MainPost';
import SubPost from './SubPost';
import Advertisement from './common/Advertisement';
import { Carousel } from 'react-materialize';
import { serverUrl } from "./common/common";
import { axiosPost } from "../common/common";
import { Modal } from 'react-materialize';
import axios from 'axios';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newsList: []
        }
    }

    componentWillMount() {
        axios.get('http://localhost:8084/news')
            .then(res => {
                console.log(res);
                this.setState({newsList: res.data})
            })
    }


    render() {
        return (
            <div className="home row">
                <div className="col s1"></div>
                <div className="col s7 container row">
                    <button onClick={()=>{console.log(this.props.user)}}>click me</button>
                    <h5 className="blue-text text-darken-2 bold font-montserrat">Tin tức</h5>
                    {this.state.newsList.length !== 0 && 
    
                        <MainPost imgSrc={'http://localhost:8084/' + this.state.newsList[0].thumbnail} 
                        title={this.state.newsList[0].title} 
                        body={this.state.newsList[0].description}
                        post={this.state.newsList[0]} />

                    }
                    {
                        this.state.newsList.length !== 0 && 
                        <Carousel options={{ dist: 0, padding: 0 }} className="white-text center">
                            {this.state.newsList.slice(1).map((post) => 
                                <div className="col s4 carousel-item">
                                    <SubPost imgSrc={'http://localhost:8084/' + post.thumbnail} 
                                        post={post}
                                        title={post.title}
                                        body={post.description} />
                                </div>    
                            )}
                        </Carousel> 
                    }
                </div>
                <div className="col s3 flex-column">
                    <Advertisement />
                    <Advertisement />
                </div>
            </div >
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps)(withRouter(Home));
