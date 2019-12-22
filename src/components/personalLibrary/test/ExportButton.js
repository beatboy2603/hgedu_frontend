import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import axios from "axios";
import {serverUrl} from '../../common/common';

export default class TestWord extends Component {
  

  render() {
    return (
      <div className="container center-align" style={{width: "400px"}}>
        <Button className="col s6"
          href={serverUrl + "testimportexport/download/14"}
          variant="outlined"
          color="primary"
          download
        >
          Export
        </Button>
      </div>
    );
  }
}
