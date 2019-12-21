import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ContentEditor from './ContentEditor';
import PropTypes from 'prop-types';
import axios, {post} from 'axios';
import {serverUrl} from '../common/common'
import Divider from '@material-ui/core/Divider';
import classnames from 'classnames';

class CreateNews extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            title: '',
            errors: {title: '', code: '', content: '', thumbnail: ''},
            shortDescription: '',
            thumbnail: ''
        }
        this.handlePost = this.handlePost.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.updateShortDescription = this.updateShortDescription.bind(this);
        this.contentEditor = React.createRef();
        this.resetForm = this.resetForm.bind(this);
    }

    checkValidSubmit = () => {
      if(this.state.title && this.state.content && this.state.thumbnail) {
          return true;
      }
      return false;
  }

    handlePost (postContent) {
        this.setState({content: postContent})
    }

    updateTitle(e) {
      if(e.target) {
        let errors = this.state.errors;
        if(e.target.value.trim()) {
            errors.title = ''
        } else {
            errors.title = 'Chủ đề không được bỏ trống'
        }
        this.setState({
            title: e.target.value,
            errors
        })
      }
    }

    updateShortDescription(e) {
        this.setState({shortDescription: e.target.value})
    }

    uploadThumbnail(e) {
      const file = e.target.files[0];
      if (/^image\//.test(file.type)) {
          const oldThumbnail = this.state.thumbnail;
          if(oldThumbnail !== '') {
            this.deleteThumbnail(oldThumbnail);
          }
          const host = serverUrl
          const URL = host + 'file-upload'
          const form = new FormData()
          form.append('image', file)
          form.append('dateCreated', new Date().toJSON().slice(0, 19).replace(/T|-|:/g, ''))
          form.append('userId', this.props.user.uid)
  
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
        const host = serverUrl
        const URL = host + 'api/news'
        const post = {title: this.state.title, 
            content: JSON.stringify(this.state.content), 
            thumbnail: this.state.thumbnail,
            description: this.state.shortDescription,
            dateCreated: new Date().toJSON().slice(0, 19).replace('T', ' '),
            modId: '' + this.props.user.uid}

        this.resetForm();
        //use axios to upload
        axios.post(URL, post)
        .then(res => {
          if(res != null){
            console.log(res.data);
            this.props.updateList(res.data, "CREATE")
          }else {
            console.error(res.data);
          }
        })
        .catch(e => {
          console.error(e);
        });
    }

    resetEditor = () => {
        this.contentEditor.current.resetEditor();
    }

    /**
     * When user clicks on cancel button
     */
    resetCreateNews = () => {
        document.getElementById('inputTitle').value = '';
        document.getElementById('inputShortDescription').value = '';
        document.getElementById('thumbFile').value = '';
        document.getElementById('previewThumb').src = '';
        const currentThumbnail = this.state.thumbnail;
        if(currentThumbnail !== '') {
          this.deleteThumbnail(currentThumbnail);
        }
        this.setState({
          title: '',
          thumbnail: '',
          shortDescription: '',
          content: ''
        })
        this.resetEditor();
    }

    /**
     * Reset form value when user clicks on save button
     */
    resetForm = () => {
      console.log( this.contentEditor.current)
      document.getElementById('inputTitle').value = '';
      document.getElementById('inputShortDescription').value = '';
      document.getElementById('thumbFile').value = '';
      document.getElementById('previewThumb').src = '';
      this.setState({title: '', thumbnail: '', shortDescription: '', content: ''}, this.contentEditor.current.resetForm())
      //this.contentEditor.current.resetForm();
    }

    render() {
        return (
            <div className="create-news no-border">
                <form onSubmit={this.handleSubmit}>
                    <div className="row required" style={{marginTop: "20px"}}>
                      <label htmlFor="inputTitle" className="col s2 inputLabel" style={{paddingLeft: 0}}>
                          Tiêu đề:
                      </label>
                      <input 
                          type="text" 
                          id="inputTitle" 
                          name="title"
                          className={classnames("form-control form-control-lg col s10",{
                              "is-invalid": this.state.errors.title
                          })}
                          style={{height: 'fit-content', marginBottom: 0}} 
                          value={this.state.title} onChange={this.updateTitle.bind(this)}/>
                      {this.state.errors.title && (
                                <div className="invalid-feedback col s10" style={{padding: 0}}>
                                    {this.state.errors.title}
                                </div>
                            )}
                    </div>
                    <div className="row" style={{marginTop: "20px"}}>
                      <label htmlFor="title" className="col s2 inputLabel" style={{paddingLeft: 0}}>
                          Mô tả ngắn:
                      </label>
                      <input type="text" id="inputShortDescription" className="col s10" style={{height: 'fit-content', marginBottom: 0}} value={this.state.shortDescription} onChange={this.updateShortDescription}/>
                    </div>
                    <div className="row" style={{marginTop: "20px"}}>
                      <ContentEditor ref={this.contentEditor} updateContent={this.handlePost}/> 
                    </div>
                    <div className="row required" style={{marginTop: "20px"}}>
                      <label htmlFor="title" className="col s2 inputLabel" style={{paddingLeft: 0}}>
                          Thumbnail:
                      </label>
                      <div className="col s10">
                        <div><input type="file" id="thumbFile" onChange={this.uploadThumbnail.bind(this)} /></div>
                        <div><img id="previewThumb" src={serverUrl+ this.state.thumbnail} alt="Preview Thumbnail" /></div>
                      </div>
                    </div>
                    <Divider/>
                    <a onClick={this.resetCreateNews.bind(this)} className=" modal-action modal-close black-text lighten-1" style={{ marginTop: "1vw", marginBottom: "1vw", float: "left", fontSize: "1vw" }}>Hủy thao tác</a>
                    {this.checkValidSubmit() &&
                    <button type="submit" className=" modal-action modal-close blue-text lighten-1" 
                    style={{ marginTop: "1vw", float: "right", background: "none", border: "none", padding: "0", cursor: "pointer", marginBottom: "1vw", fontSize: "1vw" }}>Hoàn tất</button>
                    }
                </form>
            </div>
        )
    }
}

CreateNews.propTypes = {
  user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  user: state.user,
})

export default connect(mapStateToProps)(CreateNews);

