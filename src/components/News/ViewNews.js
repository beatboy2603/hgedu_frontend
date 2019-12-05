import React, { Component } from 'react';
import axios from 'axios';
import Divider from '@material-ui/core/Divider';
import Quill from 'quill';

export default class ViewNews extends Component {

    constructor(props) {
        super(props);

        this.state = {
            news: {},
            title: '',
            htmlContent: null,
            isLoading: true
        }

        this.getHtmlContent = this.getHtmlContent.bind(this);
        this.convertDeltaToHtml = this.convertDeltaToHtml.bind(this);
    }

    componentDidMount() {
        let newsId = this.props.location.state.id;
        axios.get('http://localhost:8084/news/' + newsId)
        .then(res => {
            if(res.data) {
                this.setState({news: res.data})
            } else { 
                //push to error page
            }
        }).catch(error => {
            //push to error page
        })
    }

    componentDidUpdate() {
        if(this.state.news && this.state.isLoading) {
            console.log("loading")
            let newsContent = this.state.news.content;
            this.getHtmlContent(newsContent);
            this.setState({title: this.state.news.title, isLoading: false});
        }
    }

    componentWillUnmount() {
        this.setState({isLoading: true});
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
        return(
            <div className="padding-filler-nav">
                <h5 style={{textAlign: 'center'}}>{this.state.title}</h5>
                <Divider />
                <div style={{
                        width: 'fit-content',
                        margin: '0 auto'
                        }} 
                    dangerouslySetInnerHTML={{__html: this.state.htmlContent}} />
            </div>
        )
    }
}