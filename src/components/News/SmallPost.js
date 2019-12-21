import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { display } from '@material-ui/system';
import { Modal } from 'react-materialize';
import Quill from 'quill';

import EditNews from './EditNews';
import axios, {post} from 'axios';
import ContentEditor from './ContentEditor'
import Button from 'react-materialize/lib/Button';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'; 
import {serverUrl} from '../common/common'
import Divider from '@material-ui/core/Divider';

class SmallPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: -1,
            content: {},
            originalContent: {},
            title: '',
            originalTitle: '',
            originalDescription: '',
            thumbnail: '',
            originalThumbnail: '',
            shortDescription: '',
            modId: -1,
            imgSrc: '',
            body: '',
            contentHeight: -1,
            htmlContent: null
        }

        this.handlePost = this.handlePost.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.contentEditor = React.createRef();
        this.getHtmlContent = this.getHtmlContent.bind(this);
        this.handleEditButton = this.handleEditButton.bind(this);
        this.updateShortDescription = this.updateShortDescription.bind(this);
    }

    checkValidSubmit = () => {
        if(this.state.title && this.state.content && this.state.thumbnail) {
            return true;
        }
        return false;
    }

    updateShortDescription(e) {
        this.setState({shortDescription: e.target.value})
    }

    handleEditButton = (e) => {
        e.preventDefault();
 //       if(this.state.post) {
             axios.get(serverUrl+'api/news/' + this.state.id)
            .then(res => {
                this.setState({id: res.data.id,
                    content: res.data.content,
                    title: res.data.title,
                    thumbnail: res.data.thumbnail,
                    shortDescription: res.data.description,
                    modId: res.data.modId,})
                console.log("first",this.state.title)
            })
            
            if(this.state.title !== '' && this.state.title !== null) {
                console.log("second:",this.state.title)
                this.setState({openModal: true})
            }
        // } else {
        //     console.log(">>here:", this.state.post)
        // }
    }

    componentDidMount() {
        //this.state.id = this.props.id
        axios.get(serverUrl+'api/news/' + this.props.id)
            .then(res => {
                this.setState({id: res.data.id,
                    content: JSON.parse(res.data.content.replace(/\n/g, "\\n")),
                    originalContent: JSON.parse(res.data.content.replace(/\n/g, "\\n")),
                    title: res.data.title,
                    originalTitle: res.data.title,
                    originalDescription: res.data.description,
                    thumbnail: res.data.thumbnail,
                    originalThumbnail: res.data.thumbnail,
                    shortDescription: res.data.description,
                    modId: res.data.modId,
                    openModal: true})
               console.log("first",this.state.content)
            })
            //console.log("first",this.state.title)
        // this.setState({
        //     id: this.props.post.id,
        //     content: this.props.post.content,
        //     title: this.props.post.title,
        //     thumbnail: this.props.post.thumbnail,
        //     shortDescription: this.props.post.description,
        //     modId: this.props.post.modId,
        // })
    }

    handlePost (postContent) {
        console.log("oldCon", this.state.content)
        console.log("newCon", JSON.parse(JSON.stringify(postContent)))
        this.setState({content: postContent})
    }

    updateTitle(e) {
        this.setState({title: e.target.value})
    }

    uploadThumbnail(e) {
        const file = e.target.files[0];
        if (/^image\//.test(file.type)) {
            const oldThumbnail = this.state.thumbnail;
            if(oldThumbnail !== this.state.originalThumbnail) {
                this.deleteThumbnail(oldThumbnail);
            }
            const host = serverUrl
            const URL = host + 'file-upload'
            const form = new FormData()
            form.append('image', file);
            form.append('dateCreated', new Date().toJSON().slice(0, 19).replace(/T|-|:/g, ''));
            form.append('userId', this.state.modId);

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

    deleteThumbnail = async (oldThumbnail) => {
        const host = serverUrl
        await axios.delete(host + oldThumbnail)
            .then(res => {
              if(res != null){
                  
              }else {
                console.error(res.data);
              }
            })
            .catch(e => {
              console.error(e);
            });
      }

    handleSubmit (e) {
        e.preventDefault();
        console.log("here content", this.state.content)
        const host = serverUrl
        const URL = host + 'api/news/' + this.state.id
        const post = {
            id: this.state.id,
            title: this.state.title, 
            shortDescription: this.state.shortDescription,
            content: JSON.stringify(this.state.content), 
            thumbnail: this.state.thumbnail,
            dateCreated: new Date().toJSON().slice(0, 19).replace('T', ' '),
            modId: this.state.modId}

        //this.resetCreateNews(e);
        this.resetEditNewsOnUpdate();
        //use axios to upload
        axios.post(URL, post)
        .then(res => {
          if(res != null){
            this.props.updateList(res.data, "UPDATE")
          }else {
            console.error(res.data);
          }
        })
        .catch(e => {
          console.error(e);
        });
    }

    async handleDelete (e) {
        e.preventDefault();
        console.log("id", this.state.id)
        const host = serverUrl
        const URL = host + "api/news/" + this.state.id

        this.updateOnDelete();
        //this.resetCreateNews(e);
        //use axios to upload
        await axios.delete(URL)
        .then(res => {
          if(res != null){
            console.log("Deleted");
          }else {
            console.error(res.data);
          }
        })
        .catch(e => {
          console.error(e);
        });
        this.props.updateList(this.state.id, "DELETE")
    }

    resetEditor = () => {
        this.contentEditor.current.resetEditor();
    }

    /**
     * When user clicks on save button for editting
     */
    resetEditorOnUpdate = () => {
        this.contentEditor.current.resetEditorOnUpdate();
    }

    /**
     * When user clicks on save button for editting,
     * remove the updated thumbnail and update the orginal states
     */
    resetEditNewsOnUpdate = () => {
        document.getElementById('thumbFile').value = '';
        const currentThumbnail = this.state.thumbnail;
        if(currentThumbnail !== this.state.originalThumbnail) {
          this.deleteThumbnail(this.state.originalThumbnail);
        }
        this.setState({originalTitle: this.state.title})
        this.setState({originalThumbnail: this.state.thumbnail})
        this.resetEditorOnUpdate();
    }

    /**
     * When user clicks on delete button,
     * remove all images and thumbnail from server
     */
    updateOnDelete = () => {
        document.getElementById('thumbFile').value = '';
        const imageData = this.contentEditor.current.getImageData(this.state.content);
        this.contentEditor.current.deleteImage(imageData);
        this.deleteThumbnail(this.state.thumbnail);
    }

    /**
     * When user clicks on cancel button for editting,
     * remove the updated thumbnail,
     * restore the original states and thumbnail
     */
    resetEditNews = () => {
        document.getElementById('thumbFile').value = '';
        const currentThumbnail = this.state.thumbnail;
        if(currentThumbnail !== this.state.originalThumbnail) {
          this.deleteThumbnail(currentThumbnail);
        }
        this.setState({title: this.state.originalTitle})
        this.setState({shortDescription: this.state.originalDescription})
        this.setState({content: this.state.originalContent})
        this.setState({thumbnail: this.state.originalThumbnail})
        this.resetEditor();
    }

    resetForm = () => {
      document.getElementById('inputTitle').value = '';
      document.getElementById('inputShortDescription').value = '';
      document.getElementById('thumbFile').value = '';
      document.getElementById('previewThumb').src = '';
      this.contentEditor.current.resetForm();
    }


    getHtmlContent = () => {
        let htmlContent = this.convertDeltaToHtml(this.state.content);
        console.log("con:",this.state.content)
        console.log("html",htmlContent)
        this.setState({htmlContent});
    }

    convertDeltaToHtml = (delta) => {
        var tempCont = document.createElement("div");
        (new Quill(tempCont)).setContents(delta);
        return tempCont.getElementsByClassName("ql-editor")[0].innerHTML;
        //return this.htmlContent(delta)
    }

    htmlContent = (delta) => {
        var QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;

        // TypeScript / ES6:
        // import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'; 
        var cfg = {inlineStyles: true};

        var converter = new QuillDeltaToHtmlConverter(delta[Object.keys(delta)[0]], cfg);

        var html = converter.convert(); 

        return html;
    }

    stringToHtml = (htmlString) => {
        var htmlContent = document.createElement("div");
        htmlContent.innerHTML = htmlString;
        return htmlContent.firstChild;
    }

    render() {

        const { imgSrc, title, body} = this.props;
        return (
            <div className="sub-post post-margin white z-depth-1 border-20 center">
                <div href={"#viewNews" + this.state.id} onClick={this.getHtmlContent} className="clickable center modal-trigger small-post-img">
                    <img className='responsive-img' src={imgSrc} alt="" style={{maxHeight: '30vh'}} />
                </div>

                <div className="container flex-column width-flex">
                    <p href={"#viewNews" + this.state.id} onClick={this.getHtmlContent} className="clickable blue-text bold small-post-title modal-trigger truncate">{title}</p>
                    <p className={body ? 'truncate' : 'hidden-text'}>{body ? body : "something"}</p>
                    <div className="post-buttons">
                        <div className="edit-post">
                            {/* <a href={"#editNews" + this.state.id} 
                           // onClick={this.handleEditButton} 
                            tooltip={"Click to edit post"}
                            className=" left modal-trigger" >
                                Sửa
                            </a> */}
                            <Modal id={"editNews" + this.state.id} 
                            className="modal-no-footer-header" 
                            actions={<Button style={{display: 'none'}}></Button>}
                             options={{ preventScrolling: false }} trigger={<a 
                           // onClick={this.handleEditButton} 
                            className=" left clickable" >
                                Sửa
                            </a>}>
                                <div>
                                    <h5 className="center" style={{marginTop: 0}}>Sửa bài đăng</h5>
                                    <Divider style={{marginBottom: "1vw"}}/>
                                    {/* //<EditNews post={post} /> */}
                                    <div className="create-news no-border">
                                        <form onSubmit={this.handleSubmit}>
                                            <div className="row required" style={{marginTop: "20px"}}>
                                                <label htmlFor="title" className="col s2 inputLabel" style={{paddingLeft: 0}}>
                                                    Tiêu đề:
                                                </label>
                                                <input type="text" id="inputTitle" className="col s10" style={{height: 'fit-content', marginBottom: 0}} value={this.state.title} onChange={this.updateTitle.bind(this)}/>
                                            </div>
                                            <div className="row" style={{marginTop: "20px"}}>
                                                <label htmlFor="title" className="col s2 inputLabel" style={{paddingLeft: 0}}>
                                                    Mô tả ngắn:
                                                </label>
                                                <input type="text" id="inputShortDescription" className="col s10" style={{height: 'fit-content', marginBottom: 0}} value={this.state.shortDescription} onChange={this.updateShortDescription}/>
                                            </div>
                                            <div className="row" style={{marginTop: "20px"}}>
                                                <ContentEditor ref={this.contentEditor} updateContent={this.handlePost} content={this.state.content} id={this.state.id} /> 
                                            </div>
                                            <div className="row required" style={{marginTop: "20px"}}>
                                                <label htmlFor="title" className="col s2 inputLabel" style={{paddingLeft: 0}}>
                                                    Thumbnail:
                                                </label>
                                                <div className="col s10">
                                                    <div><input type="file" id="thumbFile" onChange={this.uploadThumbnail.bind(this)} /></div>
                                                    <div className="thumbnail-preview"><img id="previewThumb" src={serverUrl + this.state.thumbnail} alt="Preview Thumbnail" /></div>
                                                </div>
                                            </div>
                                            <Divider/>
                                            <a onClick={this.resetEditNews.bind(this)} className=" modal-action modal-close black-text lighten-1" style={{ marginTop: "1vw", marginBottom: "1vw", float: "left", fontSize: "1vw" }}>Hủy thao tác</a>
                                            {this.checkValidSubmit() &&
                                                <button type="submit" className=" modal-action modal-close blue-text lighten-1" 
                                                style={{ marginTop: "1vw", marginBottom: "1vw", float: "right", background: "none", border: "none", padding: "0", cursor: "pointer", fontSize: "1vw" }}>Hoàn tất</button>
                                            }
                                        </form>
                                    </div>
                                </div>
                            </Modal>
                        </div>
                        <div className="delete-post">
                            {/* <a href={"#deleteNews" + this.state.id}  className="right red-text modal-trigger">
                                Xóa
                            </a> */}
                            <Modal id={"deleteNews" + this.state.id} className="modal-no-footer-header" options={{ preventScrolling: true }} style={{ width: "40vw", overflow: "hidden" }}
                             trigger={<a className="right red-text clickable">
                                Xóa
                            </a>}>
                                <div>
                                    <h5 className="center" style={{marginTop: 0}}>Xóa bài đăng</h5>
                                    <Divider/>
                                    <div>
                                        <form onSubmit={this.handleDelete}>
                                            <a 
                                                className=" modal-action modal-close black-text lighten-1" 
                                                style={{ marginTop: "1vw", marginBottom: "1vw", float: "left", fontSize: "1vw" }}>Hủy thao tác</a>
                                            <button type="submit" className=" modal-action modal-close blue-text lighten-1" 
                                            style={{ marginTop: "1vw", marginBottom: "1vw", float: "right", background: "none", border: "none", padding: "0", cursor: "pointer", fontSize: "1vw" }}>Đồng ý</button>
                                        </form>
                                    </div>
                                </div>
                            </Modal>
                        </div>
                        <div>
                            <Modal id={"viewNews" + this.state.id} fixedFooter options={{ preventScrolling: false}} >
                                <div>
                                    <h5 className="center" style={{marginTop: 0}}>{this.state.title}</h5>
                                    <Divider/>
                                    <div dangerouslySetInnerHTML={{__html: this.state.htmlContent}} />
                                </div>
                            </Modal>
                        </div>
                        {/* <div className="delete-post">
                            <a href="#deleteNews" onClick={this.h} className="right red-text modal-trigger">
                                Xóa
                            </a>
                            <Modal id="deleteNews" options={{ preventScrolling: true }}>
                                <div className="modal-content">
                                    <h5 className="center">{this.state.title}</h5>
                                    <div className="line">
                                    </div>
                                    <div>{this.state.content}</div>
                                </div>
                            </Modal>
                        </div> */}
                    </div>
                </div>
            </div>
        )
    }
}

export default SmallPost;
