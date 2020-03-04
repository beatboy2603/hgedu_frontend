import React, { Component } from 'react'
import { Modal } from 'react-materialize';

export default class ModalGroup extends Component {
    render() {
        return (
            <div>
                <Modal id="addGroup" options={{ preventScrolling: true }} style={{ width: "40vw", maxHeight: "25vw", height: "25vw", marginTop:"10vh", overflow: "hidden", borderRadius: "25px"}} actions={[]}>
                    <div style={{ paddingTop: "52.5vh" }}></div>
                    <div className="modal-content" style={{
                        position: "absolute",
                        top: "0",
                        bottom: "0",
                        left: "0",
                        right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                        overflowY: "scroll"
                    }}>

                        <h5 className="center">Thêm Nhóm</h5>

                        <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>
                        <a className="modal-action modal-close black-text lighten-1" style={{ margin: "0 1.5vw", float: "left" }}>Hủy thao tác</a>
                        <a className="modal-action modal-close blue-text lighten-1" style={{ margin: "0 1.5vw", float: "right" }} onClick={this.addQuestion}>Hoàn tất</a>
                    </div>
                </Modal>
            </div>
        )
    }
}
