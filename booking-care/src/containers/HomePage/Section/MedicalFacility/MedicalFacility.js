import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux';
import '../../Section/Section.scss'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { getAllClinic } from '../../../../services/userService';
import { withRouter } from 'react-router'

class MedicalFacility extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataClinic: []
        }
    }

    async componentDidMount() {
        const res = await getAllClinic()
        if (res && res.errCode === 0) {
            this.setState({
                dataClinic: res.data ? res.data : []
            })
        }
    }

    handleViewDetailClinic = (clinic) => {
        if(this.props.history) {
            this.props.history.push(`/detail-clinic/${clinic.id}`)
        }
    }

    render() {
        const settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1
        };

        const { dataClinic } = this.state

        return (
            <div className='section-section hospital-section'>
                <div className='section-content'>
                    <div className='section-header'>
                        <span className='title-section'><FormattedMessage id='homepage.top-clinics' /></span>
                        <button className='btn-section'><FormattedMessage id='homepage.search' /></button>
                    </div>
                    <div className='section-body'>
                        <Slider {...settings}>
                            {dataClinic && dataClinic.length > 0 &&
                                dataClinic.map((clinic, index) => {
                                    return (
                                        <div className='section-customize' key={index}>
                                            <div
                                                className='bg-img-clinic'
                                                style={{ background: `url(${clinic.image})` }}
                                                onClick={() => this.handleViewDetailClinic(clinic)}
                                            ></div>
                                            <h3>{clinic.name}</h3>
                                        </div>
                                    )
                                })
                            }
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
