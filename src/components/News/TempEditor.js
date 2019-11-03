import React, { Component, useRef } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { display } from '@material-ui/system';
import { Modal } from 'react-materialize';
//import NewsEditor from './ContentEditor';
import axios, {post} from 'axios';

const TempEditor = (props) => { 

    return (
        <div></div>//<NewsEditor ref={props.editorRef} {...props} />
    )
}

const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps)(TempEditor)