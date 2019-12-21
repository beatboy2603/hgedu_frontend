import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'react-materialize';
import  Quill  from 'quill';

class MainPost extends Component {

    constructor(props) {
        super(props);

        this.state = {
            htmlContent: null
        }
    }

    getHtmlContent = (content) => {
        let htmlContent = this.convertDeltaToHtml(JSON.parse(content.replace(/\n/g, "\\n")));
        this.setState({htmlContent})
    }

    convertDeltaToHtml = (delta) => {
        var tempCont = document.createElement("div");
        var AlignStyle = Quill.import('attributors/style/align');
        //Quill.register(ImageFormat, true);
        Quill.register(AlignStyle, true)
        var SizeStyle = Quill.import('attributors/style/size');
        // delete SizeStyle.whitelist;  // accept all
        SizeStyle.whitelist = ['10px', '20px', '40px'];
        Quill.register(SizeStyle, true);
        var FontStyle = Quill.import('attributors/style/font');
        Quill.register(FontStyle,true);
        (new Quill(tempCont)).setContents(delta);
        return tempCont.getElementsByClassName("ql-editor")[0].innerHTML;
        //return this.htmlContent(delta)
    }

    render() {
        const { imgSrc, title, body, post, view } = this.props;
        return (
            <div className="main-post white row z-depth-1 border-20" style={{margin: "1.5%"}}>
                { !view && 
                    <>
                        <div className="col s8 modal-trigger clickable" href={"#viewNews" + post.id} onClick={() => this.getHtmlContent(post.content)} style={{paddingLeft:"0", height:"100%"}}><img className='responsive-img' src={imgSrc} alt="Main Image" /></div>
                        
                        <div className="col s4 flex-column container modal-trigger clickable" onClick={() => this.getHtmlContent(post.content)} href={"#viewNews" + post.id}>
                            <h6 className="blue-text bold">{title}</h6>
                            <div>{body}</div>
                            <a href={"#viewNews" + post.id} onClick={() => this.getHtmlContent(post.content)} className="modal-trigger">Đọc tiếp</a>
                        </div>

                        <div>
                            <Modal id={"viewNews" + post.id} fixedFooter options={{ preventScrolling: true, dismissible: false }} style={{ width: "40vw", minHeight: "50vh", overflow: "hidden" }}>
                                <div className="modal-content" style={{
                                                position: "absolute",
                                                top: "0",
                                                bottom: "0",
                                                left: "0",
                                                right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                                                overflowY: "scroll"
                                            }}>
                                    <h4>{post.title}</h4>
                                    <hr></hr>
                                    <div dangerouslySetInnerHTML={{__html: this.state.htmlContent}} />
                                </div>
                            </Modal>
                        </div>
                    </>
                }
                { view && 
                    <>
                        <Link to={{pathname: '/news/view/' + post.title.replace(/\s/g,'-'), state: {id: post.id}}}>
                            <div className="col s8" style={{paddingLeft:"0", height:"100%", width: 'fit-content'}}>
                                <img className='responsive-img' src={imgSrc} alt="Main Image" />
                            </div>      
                        </Link>
                        <div className="col s4 flex-column container">
                            <Link to={{pathname: '/news/view/' + post.title.replace(/\s/g,'-'), state: {id: post.id}}}><h6 className="blue-text bold">{title}</h6></Link>
                            <p>{body}</p>
                            <Link to={{pathname: '/news/view/' + post.title.replace(/\s/g,'-'), state: {id: post.id}}}>Đọc tiếp</Link>
                        </div>
                    </>
                }
            </div>
        )
    }
}

export default MainPost;
