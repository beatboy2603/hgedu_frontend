import React, { Component } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import ImageResize from '@capaj/quill-image-resize-module-react';
import axios from 'axios';
import { connect } from 'react-redux';
import {serverUrl} from './common';

// BEGIN allow image alignment styles
const ImageFormatAttributesList = [
    'alt',
    'height',
    'width',
    'style'
];

const BaseImageFormat = Quill.import('formats/image');
class ImageFormat extends BaseImageFormat {
    static formats(domNode) {
        return ImageFormatAttributesList.reduce(function (formats, attribute) {
            if (domNode.hasAttribute(attribute)) {
                formats[attribute] = domNode.getAttribute(attribute);
            }
            return formats;
        }, {});
    }
    format(name, value) {
        if (ImageFormatAttributesList.indexOf(name) > -1) {
            if (value) {
                this.domNode.setAttribute(name, value);
            } else {
                this.domNode.removeAttribute(name);
            }
        } else {
            super.format(name, value);
        }
    }
}
// END allow image alignment styles

class ContentEditor extends Component {
    constructor(props) {
        super(props);

        var AlignStyle = Quill.import('attributors/style/align');
        Quill.register('modules/imageResize', ImageResize);
        Quill.register(ImageFormat, true);
        Quill.register(AlignStyle, true)
        var SizeStyle = Quill.import('attributors/style/size');
        // delete SizeStyle.whitelist;  // accept all
        SizeStyle.whitelist = ['10px', '20px', '40px'];
        Quill.register(SizeStyle, true);
        var FontStyle = Quill.import('attributors/style/font');
        Quill.register(FontStyle, true)

        this.modules = {
            toolbar: {
                container: this.props.toolbarModules,
                handlers: {
                    image: this.imageHandler
                }
            },
            imageResize: {
                handleStyles: {
                    backgroundColor: 'black',
                    border: 'none',
                    color: 'white',
                },
                parchment: Quill.import('parchment')
            }
        };

        this.formats = [
            'font',
            'size',
            'header',
            'width',
            'style',
            'bold', 'italic', 'underline',
            'list', 'bullet',
            'align',
            'color', 'background', 'formula',
            'image'
        ];

        this.state = {
            comments: '',
            content: '',
            originalContent: '',
            //images: [],
            imageData: [],
            originalImageData: [],
            imageFileMap: {}
        }

        this.rteChange = this.rteChange.bind(this);
        this.handleQuillChange = props.handleQuillChange;
        //this.handleQuillBlur = this.handleQuillBlur.bind(this)
        this.quillSource = props.quillSource;
        this.reactEditor = React.createRef();
        this.uploadImage = this.uploadImage.bind(this);
        this.imageHandler = this.imageHandler.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
        this.handleDeleteImage = this.handleDeleteImage.bind(this);
        this.getImageData = this.getImageData.bind(this);
    }

    quillSource = null;
    editor = null;
    handleQuillChange = () => { };

    if(editor) {
        editor.on("text-change", (delta, oldDelta, source) => {
            if (source === "api") {
                console.log("api changes")
            } else if (source === "user") {
                let diffObj = oldDelta.diff(editor.getContents);
                console.log(diffObj)
            }
        })
    }

    imageHandler = () => {
        const input = document.getElementById('imgFile')
        input.click()
        input.onchange = this.uploadImage
    }

    uploadImage() {
        const input = document.getElementById('imgFile');
        const file = input.files[0];
        if (/^image\//.test(file.type)) {
            this.saveImageToServer(file)
        } else {
            console.warn('You could upload images only.');
        }

        document.getElementById('imgFile').value = "";
    }

    saveImageToServer = (file) => {
        const host = serverUrl;
        const URL = host + 'file-upload'
        const form = new FormData()
        form.append('image', file)
        form.append('dateCreated', new Date().toJSON().slice(0, 19).replace(/T|-|:/g, ''))
        form.append('userId', this.props.user.uid)
        // form.append('userId', 1)
        //use axios to upload
        axios.post(URL, form)
            .then(res => {
                if (res != null) {
                    let range = this.editor.getSelection();
                    this.editor.insertEmbed(range.index, 'image',
                        host + res.data, "user");
                    //console.log(res.data);
                    this.setState({ imageData: [...this.state.imageData, host + res.data] })
                    //alert("File uploaded successfully.")
                } else {
                    console.error(res.data);
                }
            })
            .catch(e => {
                console.error(e);
            });
    }

    updateImagesArray = (image) => {
        //this.setState({images: [...this.state.images, image]});
    }


    uploadImg = (e) => {
        const file = e.target.files[0];
        console.log("hehe", this.editor)
        //this.updateImagesArray(file)
        // if(this.editor) 
        //     this.editor.insertEmbed(this.editor.getSelection(), 'image',reader.result, "user")
        // let reader = new FileReader();
        // reader.onload = (e) => {
        //         let range = this.editor.getSelection();
        //         this.editor.insertEmbed(range.index ,'image', e.target.result, "user");
        // }
        // reader.readAsDataURL(file);
        // file type is only image.
        if (/^image\//.test(file.type)) {
            this.saveImageToServer(file);
        } else {
            console.warn('You could upload images only.');
        }

        document.getElementById('imgFile').value = "";
    }

    /**
     * Get an array of images from content
     */
    getImageData = (delta) => {
        var imageData = []
        if (delta !== undefined) {
            delta.ops.map((deltaPart) => {
                if (deltaPart.insert !== undefined && deltaPart.insert.image) {
                    imageData.push(deltaPart.insert.image)
                }
            })
        }
        return imageData
    }

    // getImageFileMap = (images, data) => {
    //     var imageFileMap = {}
    //     images.map((i, img) => {
    //          imageFileMap[img] = data[i];
    //     });
    //     return imageFileMap
    // }

    // updateFileMap = (data) => {
    //     var imageFileMap = this.state.imageFileMap;
    //     var oldData = this.state.imageData;
    //     var newImageFileMap = {}
    //     var newImages = []
    //     var removedImages = Object.keys(imageFileMap).filter(key => data.includes(imageFileMap.key));
    //     removedImages.forEach(key => {
    //         newImageFileMap[key] = imageFileMap[key]
    //         newImages.push(key)
    //     })
    //     this.setState({images: newImages, imageFileMap: newImageFileMap})
    // }

    /**
     * When user clicks on the save button on editting
     * then remove all the images which do not belong to the new content images
     * and set the state of orginal states to current 
     */
    resetEditorOnUpdate = () => {
        const currentImageData = this.state.imageData;
        // console.log("original:", this.state.originalImageData);
        if (currentImageData !== this.state.originalImageData) {
            let removedImageFromOriginal = this.state.originalImageData.filter(item => currentImageData.includes(item) === false);
            console.log("removed:", removedImageFromOriginal)
            this.deleteImage(removedImageFromOriginal);
        }
        this.setState({
            comments: '',
            originalContent: this.state.content,
            //images: [],
            originalImageData: this.state.imageData,
            imageFileMap: {}
        });
        console.log(">>>>here")
    }

    /**
     * When user clicks on the cancel button on editting and creating
     * then remove all the images which do not belong to the original images
     * and set the state of current states to original
     */
    resetEditor = () => {
        const originalImageData = this.state.originalImageData;
        if (originalImageData !== this.state.currentImageData) {
            let removedImageNotOriginal = this.state.currentImageData.filter(item => originalImageData.includes(item) === false);
            this.deleteImage(removedImageNotOriginal);
        }
        this.setState({
            comments: '',
            content: this.state.originalContent,
            //images: [],
            imageData: this.state.originalImageData,
            imageFileMap: {}
        });
        console.log(">>>>here")
    }

    /**
     * When user clicks on the save button on creating
     * and set the state of current states to original
     */
    resetForm = () => {
        this.setState({
            comments: '',
            content: '',
            //images: [],
            imageData: [],
            imageFileMap: {}
        });
    }

    /**
     * Function to handle the delete event of the editor
     * by getting all the images which belong to the old data but
     * not belong to the orginal data (for editting when we do not want to
     * delete the original data if user does not click on the save button)
     * then delete the data from server 
     */
    handleDeleteImage = (imageData) => {
        var oldImageData = this.state.imageData;
        var removedImages = oldImageData.filter(item => imageData.includes(item) === false);
        var removedImagesNotOriginal = removedImages.filter(item => this.state.originalImageData.includes(item) === false);
        this.deleteImage(removedImagesNotOriginal);
        this.setState({ imageData })
    }

    deleteImage = (removedImages) => {
        removedImages.map(async item => {
            await axios.delete(item)
                .then(res => console.log("OK"))
                .catch(e => console.log(e))
        });
    }

    rteChange = (content, delta, source, editor) => {
        if (source === "api" && this.editor.getSelection() === null) {
            let length = this.editor.getLength();
            this.editor.setSelection(length - 1, length, "user");
        } else {
            this.setState({ content: editor.getContents() })
            var oldImageData = this.state.imageData;
            var imageData = this.getImageData(editor.getContents());
            this.setState({ imageData })
            //console.log("images:", this.state.images);
            //console.log("data: ", imageData)

            //console.log("current-delta: ", this.editor.getContents())
            this.props.updateContent(this.editor.getContents());
            // var imageFileMap

            //Handle image change when delete
            if (oldImageData.length !== 0 &&
                oldImageData.length > imageData.length) {
                //imageFileMap = this.updateFileMap(imageData)
                console.log(oldImageData)
                this.handleDeleteImage(imageData);
            }
        }
        // else {
        //     imageFileMap = this.getImageFileMap(this.state.images, imageData);
        // }
        // this.setState({imageData, imageFileMap})
    }

    convertDeltaToHtml = (delta) => {
        var tempCont = document.createElement("div");
        (new Quill(tempCont)).setContents(delta);
        return tempCont.getElementsByClassName("ql-editor")[0].innerHTML;
    }

    htmlContent = (delta) => {
        var QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;

        // TypeScript / ES6:
        // import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'; 
        var cfg = {};

        var converter = new QuillDeltaToHtmlConverter(delta[Object.keys(delta)[0]], cfg);

        var html = converter.convert();

        return html;
    }

    // handleQuillBlur = (range, source, editor) => {
    //     setTimeout(() => {
    //       let fixRange = editor.getSelection();
    //       if (fixRange) {
    //         // get the editor instance.
    //         this.editor = this.refs.editor.getEditor();
    //         this.editor.setContents(this.editor.getContents());
    //         this.editor.setSelection(fixRange);
    //         //editorInstance.focus();
    //       }
    //       // it's true blur.
    //       else {
    //         // do something.
    //       }
    //     }, 100); // 100ms is random...
    //   }

    componentDidMount() {
        this.editor = this.reactEditor.current.getEditor();
        //console.log("user:", this.props.user.role)
    }

    /**
     * Set the states when editting
     */
    componentDidUpdate() {
        if (this.state.content === '' && this.state.originalContent === '' && this.props.content) {
            const html = this.convertDeltaToHtml(this.props.content);
            //document.getElementsByClassName("ql-editor")[0].innerHTML = html;
            console.log(html)
            this.editor.setContents([]);
            this.setState({ originalContent: this.props.content });
            this.editor.clipboard.dangerouslyPasteHTML(0, html);
            this.setState({ content: this.props.content });
            let data = this.getImageData(this.props.content);
            console.log("preset_data:", data);
            this.setState({ originalImageData: data });
            this.setState({ currentImageData: data });
        } else {
            //console.log("content:",this.state.content)
        }
    }

    render() {
        return (
            <div>
                <ReactQuill
                    style={this.props.customStyle}
                    ref={this.reactEditor} theme="snow" modules={this.modules}
                    formats={this.formats}
                    onBlur={this.handleQuillBlur}
                    onChange={this.rteChange}
                    defaultValue={this.state.content || ''} />
                <input type="file" id="imgFile" hidden />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
})

export default connect(mapStateToProps)(ContentEditor);
// export default ContentEditor;
