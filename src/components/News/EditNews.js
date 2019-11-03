import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import NewsEditor from './ContentEditor';
import axios, {post} from 'axios';
import { throwStatement } from '@babel/types';

class EditNews extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: -1,
            content: '',
            title: '',
            thumbnail: '',
            shortDescription: '',
            modId: -1,
            updated: false
        }
        this.handlePost = this.handlePost.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.newsEditor = React.createRef();
    }

    handlePost (postContent) {
        this.setState({content: postContent})
    }

    updateTitle(e) {
        this.setState({title: e.target.value})
    }

    uploadThumbnail(e) {
        const file = e.target.files[0];
        if (/^image\//.test(file.type)) {
            const host = 'http://localhost:8084/'
            const URL = host + 'file-upload'
            const form = new FormData()
            form.append('image', file)
    
            //use axios to upload
            axios.post(URL, form)
            .then(res => {
              if(res != null){
                  this.setState({thumbnail: res.data})
              }else {
                console.error(res.data);
              }
            })
            .catch(e => {
              console.error(e);
            });
        } else {
          console.warn('You could upload images only.');
        }

        document.getElementById('thumbFile').value = "";
    }

    handleSubmit (e) {
        e.preventDefault();
        const host = 'http://localhost:8084/'
        const URL = host + 'update-news'
        const post = {title: this.state.title, 
            content: JSON.stringify(this.state.content), 
            thumbnail: this.state.thumbnail,
            dateCreated: new Date().toJSON().slice(0, 19).replace('T', ' '),
            modId: '1'}

        //this.resetCreateNews(e);
        //use axios to upload
        axios.post(URL, post)
        .then(res => {
          if(res != null){
            console.log("OK");
          }else {
            console.error(res.data);
          }
        })
        .catch(e => {
          console.error(e);
        });
    }

    resetEditor = () => {
        this.newsEditor.current.resetEditor();
    }

    resetCreateNews = () => {
        document.getElementById('inputTitle').value = '';
        document.getElementById('thumbFile').value = '';
        document.getElementById('previewThumb').src = '';
        this.resetEditor();
    }

    componentDidMount() {
       
        // this.setState({
        //     id: this.props.post.id,
        //     content: this.props.post.content,
        //     thumbnail: this.props.post.thumbnail,
        //     shortDescription: this.props.post.description,
        //     modId: this.props.post.modId,
        //     title: this.props.post.title
        // })
    }

    componentWillReceiveProps(nextProps) {
        //console.log("Toi lay:",nextProps.post)
        // if(nextProps.post !== this.props.post) 
        //     this.setState({
        //         id: nextProps.post.id,
        //         content: nextProps.post.content,
        //         thumbnail: nextProps.post.thumbnail,
        //         shortDescription: nextProps.post.description,
        //         modId: nextProps.post.modId,
        //         title: nextProps.post.title
        //     })
    }
    
    componentDidUpdate() {
        //console.log("Toi lay:",this.props.post)
        if(this.state.updated === false) {
            this.setState({updated: true})
        }
        // if(prevProps.post !== this.props.post) {
        //     this.setState({
        //         id: this.props.post.id,
        //         content: this.props.post.content,
        //         thumbnail: this.props.post.thumbnail,
        //         shortDescription: this.props.post.description,
        //         modId: this.props.post.modId,
        //         title: this.props.post.title
        //     })
        // }
    }

    render() {
        return (
            <div className="create-news no-border">
                <form onSubmit={this.handleSubmit}>
                    <div><input type="text" value={this.state.title} id="inputTitle" onChange={this.updateTitle.bind(this)} placeholder="Title"/></div>
                    <NewsEditor ref={this.newsEditor} updateContent={this.handlePost} content={this.state.content} /> 
                    <div><input type="file" id="thumbFile" onChange={this.uploadThumbnail.bind(this)} /></div>
                    <div><img id="previewThumb" src={'http://localhost:8084/' + this.state.thumbnail} alt="Preview Thumbnail" /></div>
                    <div className="line"></div>
                    <a onClick={this.resetCreateNews.bind(this)} className=" modal-action modal-close black-text lighten-1" style={{ marginTop: "1vw", float: "left", fontSize: "1vw" }}>Hủy thao tác</a>
                    <button type="submit" className=" modal-action modal-close blue-text lighten-1" 
                    style={{ marginTop: "1vw", float: "right", background: "none", border: "none", padding: "0", cursor: "pointer", fontSize: "1vw" }}>Hoàn tất</button>
                </form>
            </div>
        )
    }
}

export default EditNews;

