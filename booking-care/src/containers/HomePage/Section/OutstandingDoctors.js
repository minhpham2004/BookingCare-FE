import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl'
import { withRouter } from "react-router-dom"
import { connect } from 'react-redux';
import './Section.scss'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import * as actions from '../../../store/actions'
import { LANGUAGES } from '../../../utils/constant';

class MedicalFacility extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrDoctors: []
        }
    }

    componentDidMount() {
        this.props.loadTopDoctors()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.topDoctorRedux !== this.props.topDoctorRedux) {
            this.setState({
                arrDoctors: this.props.topDoctorRedux
            })
        }
    }

    handleViewDetailDoctor = (doctor) => {
        this.props.history.push(`/detail-doctor/${doctor.id}`)
    }

    render() {
        const settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1
        };

        const arrDoctors = this.state.arrDoctors
        const { language } = this.props

        return (
            <div className='section-section'>
                <div className='section-content'>
                    <div className='section-header section-header-doctor'>
                        <span className='title-section'><FormattedMessage id='homepage.outstanding-doctor' /></span>
                        <button className='btn-section'><FormattedMessage id='homepage.search' /></button>
                    </div>
                    <div className='section-body'>
                        <Slider {...settings}>
                            {arrDoctors && arrDoctors.length > 0
                                && arrDoctors.map((doctor, index) => {
                                    const nameVi = `${doctor.positionData.valueVi}, ${doctor.firstName} ${doctor.lastName}`
                                    const nameEn = `${doctor.positionData.valueEn}, ${doctor.firstName} ${doctor.lastName}`
                                    let imageBase64 = ''
                                    if (doctor.image) {
                                        imageBase64 = new Buffer(doctor.image, 'base64').toString('binary')
                                    }

                                    return (
                                        <div className='section-customize doctor-section' key={index}>
                                            <div className='outer-bg'>
                                                <div className='doctor-img-border'>
                                                    <div
                                                        className='doctor-bg-img'
                                                        style={{ backgroundImage: `url(${imageBase64})` }}
                                                        onClick={() => this.handleViewDetailDoctor(doctor)}
                                                    ></div>
                                                </div>
                                                <div className='position text-center'>
                                                    <div className='doctor-title' onClick={() => this.handleViewDetailDoctor(doctor)}>{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                                                    <div className='doctor-specialty-title'>Cơ xương khớp</div>
                                                </div>
                                            </div>
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
        isLoggedIn: state.user.isLoggedIn,
        topDoctorRedux: state.admin.topDoctors,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
