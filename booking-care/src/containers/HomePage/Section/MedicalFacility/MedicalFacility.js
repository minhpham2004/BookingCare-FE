import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux';
import '../../Section/Section.scss'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

class MedicalFacility extends Component {

    render() {
        const settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1
        };
        return (
            <div className='section-section hospital-section'>
                <div className='section-content'>
                    <div className='section-header'>
                        <span className='title-section'><FormattedMessage id='homepage.top-clinics'/></span>
                        <button className='btn-section'><FormattedMessage id='homepage.search'/></button>
                    </div>
                    <div className='section-body'>
                        <Slider {...settings}>
                            <div className='section-customize'>
                                <div className='bg-img'></div>
                                <h3>Bệnh viện hữu nghị Việt Đức</h3>    
                            </div>
                            <div className='section-customize'>
                                <div className='bg-img'></div>
                                <h3>Bệnh viện Chợ Rẫy</h3>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-img'></div>
                                <h3>Bệnh viện ĐH Y Dược 1</h3>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-img'></div>
                                <h3>Bệnh viện K</h3>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-img'></div>
                                <h3>Bệnh viện E</h3>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-img'></div>
                                <h3>Bệnh viện Thu Cúc</h3>
                            </div>
                        </Slider>

                    </div>
                </div>
            </div>

        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MedicalFacility);
