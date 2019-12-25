import React, { Component } from 'react'
import Advertisement from '../common/Advertisement';
import HorizontalAd1 from '../../resources/horizontalAd1.png';
export default class Setting extends Component {
    render() {
        return (
            <div className='row'>
                <div className="col s3 container min-height-60">
                </div>
                <div className="col s9 container">
                    <Advertisement imgSrc={HorizontalAd1} />
                </div>
                <div className="col s12 no-padding flex-column center min-height-400">
                    <div>
                        <i className="material-icons large grey-text">emoji_food_beverage</i>
                        <h6 className="grey-text">Chức năng đang trong quá trình xây dựng <br />Mong bạn quay lại sau</h6>
                    </div>
                </div>
            </div>
        )
    }
}
