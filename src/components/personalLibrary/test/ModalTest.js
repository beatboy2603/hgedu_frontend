import React, { Component } from 'react';
import { Modal, Button, Collapsible, CollapsibleItem } from 'react-materialize';
import CustomizedSlider from '../../common/CustomizedSlider';

export default class ModalTest extends Component {
    render() {
        return (
            <div>
                <div style={{ zIndex: "100" }}>
                    <a href="#addTest" className="btn-floating btn-large blue modal-trigger">
                        <i className="material-icons" onClick={() => { console.log(this.state) }}>add</i>
                    </a>
                    <Modal id="addTest" options={{ preventScrolling: true }} style={{ width: "60vw", height: "80vh", overflow: "hidden" }} actions={[]}>
                        <div style={{ paddingTop: "52.5vh" }}></div>
                        <div className="modal-content" style={{
                            position: "absolute",
                            top: "0",
                            bottom: "0",
                            left: "0",
                            right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                            overflowY: "scroll"
                        }}>

                            <h5 className="center">Chọn phương pháp xây dựng bộ đề</h5>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginTop: "30px" }}></div>

                            <div className="row" >
                                <div className="row col s6 container">
                                    <div href="#autoGen" className="modal-action modal-close col s11 grey lighten-4 valign-wrapper modal-trigger" style={{ height: "30vh", borderRadius: "10px" }}>
                                        <i className="material-icons medium blue-text text-darken-3" style={{ margin: "20px" }}>near_me</i>
                                        <div className="flex-column" style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                                            <h6 className="blue-text text-darken-3 font-montserrat">Tự động</h6>
                                            <p style={{ fontSize: "12px" }}>Tự động soạn đề trên cơ sở theo tiêu chí, yêu cầu của bạn như: độ khó, độ bao quát, tỉ lệ phân phối kiến thức, ...</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row col s6 container center">
                                    <div className="col s1"></div>
                                    <div href="#customGen" className="modal-action modal-close col s11 grey lighten-4 valign-wrapper modal-trigger" style={{ height: "30vh", borderRadius: "10px" }}>
                                        <i className="material-icons medium blue-text text-darken-3" style={{ margin: "20px" }}>touch_app</i>
                                        <div className="flex-column" style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                                            <h6 className="blue-text text-darken-3 font-montserrat">Thủ công</h6>
                                            <p style={{ fontSize: "12px" }}>Tự chọn câu hỏi theo ý của bạn,
                                            tiêu chuẩn của đề thi sẽ được tính tự động liên tục mỗi khi thêm câu hỏi</p>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>
                            <a className="modal-action modal-close black-text lighten-1" style={{ margin: "0 1.5vw", float: "left" }}>Hủy thao tác</a>
                        </div>
                    </Modal>
                    <Modal id="autoGen" options={{ preventScrolling: true }} style={{ width: "60vw", height: "80vh", overflow: "hidden" }} actions={[]}>
                        <div style={{ paddingTop: "52.5vh" }}></div>
                        <div className="modal-content" style={{
                            position: "absolute",
                            top: "0",
                            bottom: "0",
                            left: "0",
                            right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                            overflowY: "scroll"
                        }}>
                            <h5 className="center">Thêm đề thi bằng phương pháp tự động</h5>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginTop: "30px" }}></div>

                            <div className="row">
                                <form className="row col s12">
                                    <div className="col s12">
                                        <p className="blue-text lighten-3">Thông tin cơ bản</p>
                                    </div>
                                    <div className="col s12">
                                        Mã đề thi<span className='red-text'>*</span>:
                                        <div className="input-field inline" style={{ width: '5vw', marginLeft: '5vw' }}>
                                            <input id='testCode' type="text" className="validate" />
                                        </div>
                                    </div>
                                    <div className="col s12">
                                        Tên đề thi<span className='red-text'>*</span>:
                                        <div className="input-field inline" style={{ width: '30vw', marginLeft: '5vw' }}>
                                            <input id='testName' type="text" className="validate" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>
                            <div className="row">
                                <div className="col s12">
                                    <p className="blue-text lighten-3">Soạn câu hỏi</p>
                                </div>
                                <div className="col s12">
                                    <h3 className="blue-text darken-4 font-montserrat center">0</h3>
                                    <p className="center">Tổng số câu hỏi</p>
                                </div>

                                <div className="col s12">
                                    <Collapsible className="z-depth-0" style={{ border: "none" }}>
                                        <CollapsibleItem header="Phân phối nhóm chia theo mảng kiến thức" icon={<i className="material-icons">code</i>}>
                                            <table>
                                                <thead className="blue-text text-darken-3 font-montserrat">
                                                    <tr>
                                                        <th>Mảng kiến thức</th>
                                                        <th>Mức khó</th>
                                                        <th>Thuộc tính</th>
                                                        <th>Kiến thức đặc thù</th>
                                                        <th>Số câu hỏi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <th>
                                                            <a href="#knowledgeGroupFilter" className="black-text lighten-1 modal-trigger">+ Thêm mảng kiến thức</a>
                                                        </th>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </CollapsibleItem>
                                        <CollapsibleItem header="Phân phối nhóm chia ngoài mảng kiến thức" icon={<i className="material-icons">code</i>}>
                                            <table>
                                                <thead className="blue-text text-darken-3 font-montserrat">
                                                    <tr>
                                                        <th>Nhóm</th>
                                                        <th>Số lượng</th>
                                                        <th>Ghi chú</th>
                                                        <th>Phân chia trên một đề</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <th>
                                                            <a href="#nonKnowledgeGroupFilter" className="black-text lighten-1 modal-trigger">+ Thêm nhóm chia (tối đa 5)</a>
                                                        </th>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </CollapsibleItem>
                                        <CollapsibleItem header="Loại trừ câu hỏi trong đề thi khác" icon={<i className="material-icons">code</i>}>
                                            <table>
                                                <thead className="blue-text text-darken-3 font-montserrat">
                                                    <tr>
                                                        <th>Đề thi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <th>
                                                            <a href="#testFilter" className="black-text lighten-1 modal-trigger">+ Thêm đề loại trừ</a>
                                                        </th>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </CollapsibleItem>
                                    </Collapsible>
                                </div>
                            </div>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>
                            <div className="row">
                                <form className="row col s12">
                                    <div className="col s12">
                                        <p className="blue-text lighten-3">Biến thể/Hoán vị</p>
                                    </div>
                                    <div className="col s12">
                                        Số lượng biến thể<span className='red-text'>*</span>:
                                        <div className="input-field inline" style={{ width: '5vw', marginLeft: '5vw' }}>
                                            <input id='noOfPermutations' type="text" className="validate" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>
                            <a className="modal-action modal-close black-text lighten-1" style={{ margin: "0 1.5vw", float: "left" }}>Hủy thao tác</a>
                            <a className="modal-action modal-close blue-text lighten-1" style={{ margin: "0 1.5vw", float: "right" }}>Hoàn tất</a>
                            <a href="#addTest" className="modal-action modal-close black-text lighten-1 modal-trigger" style={{ margin: "0 1.5vw", float: "right" }}>Quay lại</a>
                        </div>
                    </Modal>
                    <Modal id="customGen" options={{ preventScrolling: true }} style={{ width: "60vw", height: "80vh", overflow: "hidden" }} actions={[]}>
                        <div style={{ paddingTop: "52.5vh" }}></div>
                        <div className="modal-content" style={{
                            position: "absolute",
                            top: "0",
                            bottom: "0",
                            left: "0",
                            right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                            overflowY: "scroll"
                        }}>
                            <h5 className="center">Thêm đề thi bằng phương pháp thủ công</h5>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginTop: "30px" }}></div>

                            <div className="row">
                                <form className="row col s12">
                                    <div className="col s12">
                                        <p className="blue-text lighten-3">Thông tin cơ bản</p>
                                    </div>
                                    <div className="col s12">
                                        Mã đề thi<span className='red-text'>*</span>:
                                        <div className="input-field inline" style={{ width: '5vw', marginLeft: '5vw' }}>
                                            <input id='testCode' type="text" className="validate" />
                                        </div>
                                    </div>
                                    <div className="col s12">
                                        Tên đề thi<span className='red-text'>*</span>:
                                        <div className="input-field inline" style={{ width: '30vw', marginLeft: '5vw' }}>
                                            <input id='testName' type="text" className="validate" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>

                            <div className="row">
                                <div className='col s12'>
                                    <p className="blue-text lighten-3">Chất lượng đề</p>
                                </div>
                                <div className="col s3">
                                    <h3 className="blue-text text-darken-2 font-montserrat center">0</h3>
                                    <p className="center">Tổng số câu hỏi</p>
                                </div>
                                <div className="col s3">
                                    <h3 className="green-text text-darken-2 font-montserrat center">-:-</h3>
                                    <p className="center">Lý thuyết:Bài tập</p>
                                </div>
                                <div className="col s3">
                                    <h3 className="purple-text text-darken-2 font-montserrat center">-</h3>
                                    <p className="center">Độ khó trung bình</p>
                                </div>
                                <div className="col s3">
                                    <h3 className="orange-text text-darken-2 font-montserrat center">-</h3>
                                    <p className="center">Độ toàn diện</p>
                                </div>
                                <div className="col s6">
                                    <h3 className="pink-text text-darken-2 font-montserrat center">-:-:-:-</h3>
                                    <p className="center">Phân phối mức khó</p>
                                </div>
                                <div className="col s6">
                                    <h3 className="teal-text text-darken-2 font-montserrat center">-</h3>
                                    <p className="center">Kiến thức đặc thù</p>
                                </div>
                            </div>

                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>

                            <div className="row">
                                <div className='col s12'>
                                    <p className="blue-text lighten-3">Soạn câu hỏi</p>
                                </div>
                                <Collapsible className="z-depth-0" style={{ border: "none" }}>
                                    <CollapsibleItem header="Danh sách câu hỏi" icon={<i className="material-icons">code</i>}>
                                        <div className="row">
                                            <div className="col s12">
                                                <p className="blue-text lighten-3">Bộ lọc</p>
                                            </div>
                                            <div className="row col s12">
                                                <div className="col s3">
                                                    <p>Thuộc tính:</p>
                                                </div>
                                                <div className="col s3">
                                                    <p>Độ khó:</p>
                                                </div>
                                                <div className="col s6">
                                                    <p>Kiến thức đặc thù:</p>
                                                </div>
                                            </div>
                                            <div className="col s12">
                                                <p className="blue-text lighten-3">Chọn câu hỏi</p>
                                            </div>
                                        </div>
                                        <div className="row" style={{ marginBottom: "0" }}>
                                            <div className="row col s4" style={{ height: "100%", borderRight: "2px solid #BDBDBD" }}>
                                                <p className="blue-text lighten-3">Thư viện câu hỏi</p>
                                            </div>
                                            <div className="row col s8" style={{ height: "100%", borderLeft: "2px solid #BDBDBD" }}>
                                                <div className='col s12'>
                                                    <h5 className="blue-text text-darken-3 font-montserrat">Phản ứng hóa học</h5>
                                                    <table>
                                                        <thead className="blue-text text-darken-3 font-montserrat">
                                                            <tr>
                                                                <th></th>
                                                                <th>Mã câu</th>
                                                                <th>Câu hỏi</th>
                                                            </tr>
                                                        </thead>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </CollapsibleItem>
                                    <CollapsibleItem header="Loại trừ câu hỏi trong đề thi khác" icon={<i className="material-icons">code</i>}>
                                        <table>
                                            <thead className="blue-text text-darken-3 font-montserrat">
                                                <tr>
                                                    <th>Đề thi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <th>
                                                        <a href="#testFilter" className="black-text lighten-1 modal-trigger">+ Thêm đề loại trừ</a>
                                                    </th>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </CollapsibleItem>
                                </Collapsible>
                            </div>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>
                            <a className="modal-action modal-close black-text lighten-1" style={{ margin: "0 1.5vw", float: "left" }}>Hủy thao tác</a>
                            <a className="modal-action modal-close blue-text lighten-1" style={{ margin: "0 1.5vw", float: "right" }}>Hoàn tất</a>
                            <a href="#addTest" className="modal-action modal-close black-text lighten-1 modal-trigger" style={{ margin: "0 1.5vw", float: "right" }}>Quay lại</a>
                        </div>
                    </Modal>
                    <Modal id="knowledgeGroupFilter" options={{ preventScrolling: true }} style={{ width: "40vw", height: "80vh", overflow: "hidden" }} actions={[]}>
                        <div style={{ paddingTop: "52.5vh" }}></div>
                        <div className="modal-content" style={{
                            position: "absolute",
                            top: "0",
                            bottom: "0",
                            left: "0",
                            right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                            overflowY: "scroll"
                        }}>
                            <h5 className="center">Chọn mảng kiến thức</h5>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginTop: "30px" }}></div>
                            <div className="row">
                                <div className='col s12'>
                                    <p className="blue-text lighten-3">Thư viện câu hỏi</p>
                                </div>
                            </div>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>
                            <a className="modal-action modal-close black-text lighten-1" style={{ margin: "0 1.5vw", float: "left" }}>Hủy thao tác</a>
                            <a href="#knowledgeGroupCustomize" className="modal-action modal-close blue-text lighten-1 modal-trigger" style={{ margin: "0 1.5vw", float: "right" }}>Tiếp theo</a>
                        </div>
                    </Modal>
                    <Modal id="knowledgeGroupCustomize" options={{ preventScrolling: true }} style={{ width: "60vw", height: "80vh", overflow: "hidden" }} actions={[]}>
                        <div style={{ paddingTop: "52.5vh" }}></div>
                        <div className="modal-content" style={{
                            position: "absolute",
                            top: "0",
                            bottom: "0",
                            left: "0",
                            right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                            overflowY: "scroll"
                        }}>
                            <h5 className="center">Cấu hình nhóm chia mảng kiến thức</h5>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginTop: "30px" }}></div>
                            <div className="row" style={{ marginBottom: "0" }}>
                                <div className="row col s4" style={{ height: "100%", borderRight: "2px solid #BDBDBD" }}>
                                    <div className="col s12 valign-wrapper">
                                        <i className="material-icons blue-text text-darken-3 small" style={{ margin: "10px" }}>description</i>
                                        <h5 className="blue-text text-darken-3">Phản ứng hóa học</h5>
                                    </div>
                                    <div className="col s12" style={{ marginTop: "10px", marginBottom: "10px" }}>
                                        <h3 className="blue-text text-darken-2 font-montserrat center">32</h3>
                                        <p className="center">Tổng số câu hỏi</p>
                                    </div>
                                    <div className="col s12" style={{ marginTop: "10px", marginBottom: "10px" }}>
                                        <h3 className="green-text text-darken-2 font-montserrat center">1:1</h3>
                                        <p className="center">Lý thuyết:Bài tập</p>
                                    </div>
                                    <div className="col s12" style={{ marginTop: "10px", marginBottom: "10px" }}>
                                        <h3 className="orange-text text-darken-2 font-montserrat center">64%</h3>
                                        <p className="center">Độ toàn diện</p>
                                    </div>
                                </div>
                                <div className="row col s8">
                                    <div className="col s1"></div>
                                    <div className='col s10'>
                                        <p className="blue-text lighten-3">Độ khó</p>
                                        <CustomizedSlider />
                                    </div>
                                    <div className="col s1"></div>
                                    <div className="line col s12" style={{ width: "96%", marginLeft: "2%", marginTop: "30px" }}></div>
                                    <div className="col s1"></div>
                                    <div className='col s10'>
                                        <p className="blue-text lighten-3">Thuộc tính</p>
                                    </div>
                                    <div className="col s1"></div>
                                    <div className="line col s12" style={{ width: "96%", marginLeft: "2%", marginTop: "30px" }}></div>
                                    <div className="col s1"></div>
                                    <div className='col s10'>
                                        <p className="blue-text lighten-3">Kiến thức đặc thù</p>
                                    </div>
                                    <div className="col s1"></div>
                                </div>
                            </div>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>
                            <a className="modal-action modal-close black-text lighten-1" style={{ margin: "0 1.5vw", float: "left" }}>Hủy thao tác</a>
                            <a className="modal-action modal-close blue-text lighten-1" style={{ margin: "0 1.5vw", float: "right" }}>Tạo mảng</a>
                            <a href="#knowledgeGroupFilter" className="modal-action modal-close black-text lighten-1 modal-trigger" style={{ margin: "0 1.5vw", float: "right" }}>Quay lại</a>
                        </div>
                    </Modal>
                    <Modal id="nonKnowledgeGroupFilter" options={{ preventScrolling: true }} style={{ width: "60vw", height: "80vh", overflow: "hidden" }} actions={[]}>
                        <div style={{ paddingTop: "52.5vh" }}></div>
                        <div className="modal-content" style={{
                            position: "absolute",
                            top: "0",
                            bottom: "0",
                            left: "0",
                            right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                            overflowY: "scroll"
                        }}>
                            <h5 className="center">Cấu hình nhóm chia ngoài mảng kiến thức</h5>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginTop: "30px" }}></div>
                            <div className="row">
                                <div className="col s12">
                                    <p className="blue-text lighten-3">Bộ lọc</p>
                                </div>
                                <div className="row col s10">
                                    <div className="col s3">
                                        <p>Thuộc tính:</p>
                                    </div>
                                    <div className="col s3">
                                        <p>Độ khó:</p>
                                    </div>
                                    <div className="col s6">
                                        <p>Kiến thức đặc thù:</p>
                                    </div>
                                </div>
                                <div className="col s2">
                                    <h3 className="blue-text text-darken-2 font-montserrat center">25</h3>
                                    <p className="center">Tổng số câu hỏi</p>
                                </div>
                                <div className="col s12">
                                    <p className="blue-text lighten-3">Chọn câu hỏi</p>
                                </div>
                            </div>
                            <div className="row" style={{ marginBottom: "0" }}>
                                <div className="row col s4" style={{ height: "100%", borderRight: "2px solid #BDBDBD" }}>
                                    <p className="blue-text lighten-3">Thư viện câu hỏi</p>
                                </div>
                                <div className="row col s8" style={{ height: "100%", borderLeft: "2px solid #BDBDBD" }}>
                                    <div className='col s12'>
                                        <h5 className="blue-text text-darken-3 font-montserrat">Phản ứng hóa học</h5>
                                        <table>
                                            <thead className="blue-text text-darken-3 font-montserrat">
                                                <tr>
                                                    <th></th>
                                                    <th>Mã câu</th>
                                                    <th>Câu hỏi</th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>

                                </div>
                            </div>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>
                            <a className="modal-action modal-close black-text lighten-1" style={{ margin: "0 1.5vw", float: "left" }}>Hủy thao tác</a>
                            <a className="modal-action modal-close blue-text lighten-1" style={{ margin: "0 1.5vw", float: "right" }}>Tạo nhóm chia</a>
                        </div>
                    </Modal>
                    <Modal id="testFilter" options={{ preventScrolling: true }} style={{ width: "40vw", height: "80vh", overflow: "hidden" }} actions={[]}>
                        <div style={{ paddingTop: "52.5vh" }}></div>
                        <div className="modal-content" style={{
                            position: "absolute",
                            top: "0",
                            bottom: "0",
                            left: "0",
                            right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                            overflowY: "scroll"
                        }}>
                            <h5 className="center">Chọn đề cần loại trừ</h5>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginTop: "30px" }}></div>
                            <div className="row">
                                <div className='col s12'>
                                    <p className="blue-text lighten-3">Thư viện đề thi</p>
                                </div>
                            </div>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>
                            <a className="modal-action modal-close black-text lighten-1" style={{ margin: "0 1.5vw", float: "left" }}>Hủy thao tác</a>
                        </div>
                    </Modal>
                </div>
            </div>
        )
    }
}
