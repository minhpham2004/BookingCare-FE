import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom"
import '../../Section/Section.scss'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { getAllSpecialty } from '../../../../services/userService';


class Specialty extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allSpecialties: []
        }
    }

    async componentDidMount() {
        const res = await getAllSpecialty()
        if (res && res.errCode === 0) {
            this.setState({
                allSpecialties: res.data
            })
        }
    }

    handleViewDetailSpecialty = (specialty) => {
        if(this.props.history) {
            this.props.history.push(`/detail-specialty/${specialty.id}`)
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

        const { allSpecialties } = this.state

        console.log(allSpecialties)
        return (
            <div className='section-section' style={{ marginTop: "60px" }}>
                <div className='section-content'>
                    <div className='section-header'>
                        <span className='title-section'><FormattedMessage id='homepage.popular-specialties' /></span>
                        <button className='btn-section'><FormattedMessage id='homepage.search' /></button>
                    </div>
                    <div className='section-body'>
                        <Slider {...settings}>
                            {allSpecialties && allSpecialties.length > 0
                                && allSpecialties.map((specialty, index) => (
                                    <div
                                        className='section-customize'
                                        key={index}
                                        onClick={() => this.handleViewDetailSpecialty(specialty)}
                                            >
                                        <div
                                            className='bg-img-specialty'
                                            style={{ background: `url(${specialty.image})` }}
                                        ></div>
                                        <h3>{specialty.name}</h3>
                                    </div>
                    ))
                            }
                </Slider>
            </div>
                </div >
            </div >
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
