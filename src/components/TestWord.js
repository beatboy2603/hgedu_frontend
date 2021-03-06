import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { serverUrl } from "./common/common";

export default class TestWord extends Component {
  state = {
    file: "",
    error: "",
    msg: ""
  };

  onFileChange = event => {
    this.setState({
      file: event.target.files[0]
    });
  };

  uploadFile = event => {};

  importFile = event => {
    event.preventDefault();
    this.setState({ error: "", msg: "" });

    if (!this.state.file) {
      this.setState({ error: "Please upload a file." });
      return;
    }

    if (this.state.file.size >= 2000000) {
      this.setState({ error: "File size exceeds limit of 2MB." });
      return;
    }

    let data = new FormData();
    data.append("file", this.state.file);
    data.append("name", this.state.file.name);

    fetch(serverUrl + "testimportexport/upload", {
      method: "POST",
      body: data
    })
      .then(response => {
        this.setState({ error: "", msg: "Sucessfully uploaded file" });
        console.log("Upload file OK");
      })
      .catch(err => {
        this.setState({ error: err });
      });
    axios.get(serverUrl + "testimportexport/import/1118/344").then(res => {
      console.log("import OK");
    });
  };

  render() {
    return (
      <div className="container center-align" style={{width: "400px"}}>
        <h4 style={{ color: "red" }}>{this.state.error}</h4>
        <h4 style={{ color: "green" }}>{this.state.msg}</h4>
        <input onChange={this.onFileChange} type="file" accept=".xlsx"></input>
        <div className="row"></div>
        <Button className="col s6" variant="outlined" color="primary" onClick={this.importFile}>
          Import
        </Button>
        <Button className="col s6"
          href={serverUrl + "testimportexport/download/10"}
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
