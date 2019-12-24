import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { serverUrl } from '../../common/common';

export default class TestWord extends Component {


  render() {
    return (
      <a href={this.props.url}>Export</a>
    );
  }
}
