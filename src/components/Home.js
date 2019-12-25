import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import MainPost from './MainPost';
import SubPost from './SubPost';
import Advertisement from './common/Advertisement';
import { Carousel } from 'react-materialize';
import axios from 'axios';
import SquareAd1 from '../resources/squareAd1.png';
import SquareAd2 from '../resources/squareAd2.png';
import {serverUrl} from './common/common'

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newsList: []
        }
    }

    componentWillMount() {
        axios.get(serverUrl+'api/news')
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
                    <h5 className="blue-text text-darken-2 bold font-montserrat">Tin tức</h5>
                    {this.state.newsList.length !== 0 && 
    
                        <MainPost imgSrc={serverUrl + this.state.newsList[0].thumbnail} 
                        title={this.state.newsList[0].title} 
                        body={this.state.newsList[0].description}
                        post={this.state.newsList[0]}
                        view='FULL' />

                    }
                    {
                        this.state.newsList.length >1 && 
                        <Carousel options={{ dist: 0, padding: 0 }} className="white-text center">
                            {this.state.newsList.slice(1).map((post) => 
                                <div className="col s4 carousel-item">
                                    <SubPost imgSrc={serverUrl + post.thumbnail} 
                                        post={post}
                                        title={post.title}
                                        body={post.description}
                                        view='FULL' />
                                </div>    
                            )}
                        </Carousel> 
                    }
                </div>
                <div className="col s3 flex-column">
                    <Advertisement imgSrc={SquareAd1} customStyle={{margin:"50px auto"}}/>
                    <Advertisement imgSrc={SquareAd2} customStyle={{margin:"50px auto"}}/>
                </div>
            </div >
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps)(withRouter(Home));
