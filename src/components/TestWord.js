import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import axios, { post } from "axios";

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

  uploadFile = event => {
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

    fetch("http://localhost:8080/api/upload", {
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
  };

  importFile = event => {
    axios.get("http://localhost:8080/api/test2/import").then(res => {
      console.log("import OK")
    })
  }

  exportFile = event => {
    axios.get("http://localhost:8080/api/test2/export").then(res => {
      console.log("Export ok")
    })
  }


  render() {
    return (
      <div className="container center-align">
        <h4 style={{ color: "red" }}>{this.state.error}</h4>
        <h4 style={{ color: "green" }}>{this.state.msg}</h4>
        <input onChange={this.onFileChange} type="file"></input>
        <Button variant="outlined" color="primary" onClick={this.uploadFile}>Upload</Button>
        <Button variant="outlined" color="primary" onClick={this.importFile}>Import</Button>
        <Button variant="outlined" color="primary" onClick={this.exportFile}>Export</Button>    
      </div>
    );
  }
}
