import React, { Component, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import ImageResize from 'quill-image-resize-module-react';
import axios, {post} from 'axios';
// import { throwStatement } from '@babel/types';
import { debounce } from 'lodash';
import { throwStatement } from '@babel/types';
import { connect } from 'net';

 export default class ContentEditor extends Component {
    constructor(props) {
        super(props);

        Quill.register('modules/imageResize', ImageResize);

        this.modules = {
            toolbar: {
                container: [[{ 'font': [] }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': ['','center', 'right', 'justify'] }],
                [{ 'color': [] }, { 'background': [] }],
                ['clean'],
                ['formula'],
                ['image']],
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
                modules: ['Resize', 'DisplaySize', 'Toolbar'],
            }
        };

        this.formats = [
            'font',
            'size',
            'header',
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
            if(source === "api") {
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
        const host = 'http://localhost:8084/'
        const URL = host + 'file-upload'
        const form = new FormData()
        form.append('image', file)
        form.append('dateCreated', new Date().toJSON().slice(0, 19).replace(/T|-|:/g, ''))
        form.append('userId', 1)
        //use axios to upload
        axios.post(URL, form)
        .then(res => {
          if(res != null){
            let range = this.editor.getSelection();
            this.editor.insertEmbed(range.index, 'image', 
            host + res.data, "user");
            //console.log(res.data);
            this.setState({imageData: [...this.state.imageData, host + res.data]})
            alert("File uploaded successfully.")
          }else {
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
        delta.ops.map((deltaPart) => {
            if(deltaPart.insert !== undefined && deltaPart.insert.image) {
                imageData.push(deltaPart.insert.image)
            }
        })
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
        if(currentImageData !== this.state.originalImageData) {
            let removedImageFromOriginal = this.state.originalImageData.filter(item => currentImageData.includes(item) === false);
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
        const currentImageData = this.state.imageData;
        if(currentImageData !== this.state.originalImageData) {
            this.deleteImage(currentImageData);
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
        this.setState({imageData})
    }

    deleteImage = (removedImages) => {
        removedImages.map(async item => {
            await axios.delete(item)
            .then(res => console.log("OK"))
            .catch(e => console.log(e))
        });
    }

    rteChange = (content, delta, source, editor) => {
        if(source === "api" && this.editor.getSelection() === null) {
            console.log("Triggered");
            let length = this.editor.getLength();
            this.editor.setSelection(length - 1, length, "user");
        } 
        this.setState({content: content})
        var oldImageData = this.state.imageData;
        var imageData = this.getImageData(editor.getContents());
        //console.log("images:", this.state.images);
        //console.log("data: ", imageData)

        //console.log("current-delta: ", this.editor.getContents())
        this.props.updateContent(this.editor.getContents());
        // var imageFileMap
        
        //Handle image change when delete
        if(oldImageData.length !== 0 &&  
            oldImageData.length > imageData.length) {
            //imageFileMap = this.updateFileMap(imageData)
            console.log(oldImageData)
            this.handleDeleteImage(imageData);
        }
        // else {
        //     imageFileMap = this.getImageFileMap(this.state.images, imageData);
        // }
        // this.setState({imageData, imageFileMap})
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
        if(this.state.content === '' && this.state.originalContent === '' && this.props.content !== undefined) {
            const html = this.htmlContent(this.props.content);
            this.editor.setContents(this.props.content);
            this.setState({originalContent: this.editor.getContents()});
            this.setState({content: this.editor.getContents()});
            let data = this.getImageData(this.editor.getContents());
            this.setState({originalImageData: data});
        }
    }

    render() {
        return (
            <div>
                <ReactQuill ref={this.reactEditor} theme="snow" modules={this.modules}
                    formats={this.formats} 
                    onBlur={this.handleQuillBlur}
                    onChange={this.rteChange} 
                    value={this.state.content || ''}
                    defaultValue={''} />
                <input type="file" id="imgFile" hidden/>
            </div>
        );
    }

}