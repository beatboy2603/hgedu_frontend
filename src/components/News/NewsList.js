import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal } from 'react-materialize';
import axios from 'axios';
import SmallPost from './SmallPost';
import CreateNews from './CreateNews';
import SideNav from 'react-materialize/lib/SideNav';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import Search from './Search'
import {serverUrl} from '../common/common'

class NewsList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newsList: []
        }
        this.handleUpdateList = this.handleUpdateList.bind(this);
    }

    handleUpdateList(object, type) {
        let updatedList = []
        switch (type) {
            case "CREATE":
                updatedList = [object, ...this.state.newsList]
                this.setState({ newsList: updatedList })
                break;
            case "UPDATE":
                updatedList = this.state.newsList.map(news => {
                    if (news.id === object.id) {
                        return object
                    }
                    return news
                })
                this.setState({ newsList: updatedList })
                break;
            case "DELETE":
                updatedList = this.state.newsList.filter(news => news.id !== object)
                this.setState({ newsList: updatedList })
                break;
            default:
        }
    }

    componentWillMount() {
        axios.get(serverUrl + this.props.user.uid + "/all")
            .then(res => {
                console.log(res);
                this.setState({ newsList: res.data })
            })
    }

    render() {
        return (
            <div className="newsManagement row">
                {/* main content */}
                <div className="row padding-flex padding-filler-nav">
                    <div className="col s12 container padding-filler-nav abbreviationLibrary-header">
                        <h5 className="blue-text text-darken-3 bold font-montserrat">Bài đăng</h5>
                        <h6 className='grey-text text-darken-1'>
                            {(this.state.newsList.length > 0 && this.state.newsList.length < 10) ? "0" + this.state.newsList.length : this.state.newsList.length} bài đăng
                        </h6>
                    </div>
                    <div className="col s12 container-fluid">
                        <div className="row" >
                            <div className="col s6">
                                <div style={{ paddingLeft: "62px" }}>Thể loại</div>
                            </div>
                            {/* <Divider orientation="vertical"/> */}
                            <div className="col s6" >
                                <Search />
                            </div>
                        </div>
                    </div>
                    <div className="col s12 center padding-filler-nav posts">
                        {
                            this.state.newsList.map(post =>
                                <div key={post.id} className="col s4 small-post">
                                    <SmallPost
                                        id={post.id}
                                        body={post.description}
                                        post={post}
                                        title={post.title}
                                        updateList={this.handleUpdateList}
                                        imgSrc={serverUrl + post.thumbnail} />
                                </div>
                            )}
                    </div>
                </div>

                <div>
                    <a href="#addNews" className="btn-floating btn-large blue my-floating-btn modal-trigger">
                        <i className="material-icons">add</i>
                    </a>
                    <Modal id="addNews" fixedFooter style={{ width: "40vw", minHeight: "50vh", overflow: "hidden" }}
                        options={{ preventScrolling: true, dismissible: false }}>
                        <div className="modal-content"
                            style={{
                                position: "absolute",
                                top: "0",
                                bottom: "0",
                                left: "0",
                                right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                                overflowY: "scroll"
                            }}>
                            <h4 >Thêm bài đăng</h4>
                            <div className="line"></div>
                            <CreateNews updateList={this.handleUpdateList} />
                        </div>
                    </Modal>
                </div>
            </div>

        )
    }
}

NewsList.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    user: state.user,
})

export default connect(mapStateToProps)(NewsList);
