import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
// import { throwStatement } from '@babel/types';
import { debounce } from 'lodash';

export default class Editor extends Component {
    constructor(props) {
        super(props);

        this.modules = {
            toolbar: [
                [{ 'font': [] }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],
                [{ 'color': [] }, { 'background': [] }],
                ['clean'],
                ['formula']
            ]
        };

        this.formats = [
            'font',
            'size',
            'bold', 'italic', 'underline',
            'list', 'bullet',
            'align',
            'color', 'background', 'formula'
        ];

        this.state = {
            comments: '',
            normalText: '',
            katexText: '',
        }

        this.rteChange = this.rteChange.bind(this);
        this.getData = this.getData.bind(this);
        this.handleQuillChange = props.handleQuillChange;
        this.quillSource = props.quillSource;
    }

    quillSource = null;
    editor = null;
    handleQuillChange = () => { };

    getData = () => {
        let delta = this.editor.getContents();
        console.log(delta);

        let normalText = '';
        let katexText = '';

        delta.map((deltaPart) => {
            if (deltaPart.insert.formula) {
                // console.log("formula "+deltaPart.insert.formula);
                normalText = normalText + "{ktx}";
                katexText = katexText + deltaPart.insert.formula + "{smlSpr}";
                // this.setState(prevState => ({
                //     ...prevState,
                //     normalText: prevState.normalText + "{ktx}",
                //     katexText: prevState.katexText+deltaPart.insert.formula+"{smlSpr}",
                // }));
            } else {
                // console.log("no formula " + deltaPart.insert);
                normalText = normalText + deltaPart.insert;
                // this.setState(prevState => ({
                //     ...prevState,
                //     normalText: prevState.normalText + deltaPart.insert,
                // }));
            }
        });
        // console.log(this.state);
        return {normalText, katexText};
    }

    rteChange = (content, delta, source, editor) => {
        this.editor = editor;
        // this.handleQuillChange(editor.getContents(), this.props.quillSource)
        // console.log(editor.getContents());
        // console.log(editor.getHTML()); // rich text
        // console.log(editor.getText()); // plain text
        // console.log(editor.getLength()); // number of characters
    }

    render() {
        // if (!content || content.length === 0 || (content.constructor === Object && Object.entries(content).length === 0)) {
        //     content = { ops: [] }
        // }

        return (
            <div>
                <ReactQuill theme="snow" modules={this.modules}
                    formats={this.formats} onChange={this.rteChange}
                    value={this.state.comments || ''} />
            </div>
        );
    }

}
