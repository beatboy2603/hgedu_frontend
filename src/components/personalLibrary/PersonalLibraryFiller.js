import React from 'react';
import Advertisement from '../common/Advertisement';
import HorizontalAd1 from '../../resources/horizontalAd1.png';

const PersonalLibraryFiller = () => {
    return (
        <div className='row'>
            <div className="col s3 container min-height-60">
            </div>
            <div className="col s9 container">
                <Advertisement imgSrc={HorizontalAd1} />
            </div>
            <div className="col s12 no-padding flex-column center min-height-400">
                <div>
                    <i className="material-icons large grey-text">description</i>
                    <h6 className="grey-text">Sau khi chọn thư viện, <br /> các câu hỏi sẽ được hiển thị ở đây</h6>
                </div>
            </div>
        </div>
    )
}

export default PersonalLibraryFiller;