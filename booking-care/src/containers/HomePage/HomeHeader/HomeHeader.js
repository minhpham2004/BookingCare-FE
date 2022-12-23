import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './HomeHeader.scss'
import { FormattedMessage } from 'react-intl'
import { LANGUAGES } from '../../../utils/constant'
import { changeLanguageApp } from '../../../store/actions'

class HomeHeader extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language)
    }

    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/home`)
        }
    }

    render() {
        const language = this.props.language

        const placeholderArrayVi = ['Tìm kiếm', 'Tìm bác sĩ', 'Tìm Phòng Khám', 'Tìm lý do khám', 'Tìm gói khám']
        const placeholderArrayEn = ['Search', 'Search doctors', 'Search clinics', 'Search diseases', 'Search examination packages']

        return (
            <div>
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <i className="fas fa-bars"></i>
                            <div className='header-logo' onClick={this.returnToHome}></div>
                        </div>
                        <div className='center-content'>
                            <div className='child-container'>
                                <div><b><FormattedMessage id="homeheader.specialty" /></b></div>
                                <div className='sub-title'><FormattedMessage id="homeheader.find-doctor" /></div>
                            </div>
                            <div className='child-container'>
                                <div><b><FormattedMessage id="homeheader.hospital-institutions" /></b></div>
                                <div className='sub-title'><FormattedMessage id="homeheader.choose-hospital" /></div>
                            </div>
                            <div className='child-container'>
                                <div><b><FormattedMessage id="homeheader.doctor" /></b></div>
                                <div className='sub-title'><FormattedMessage id="homeheader.choose-good-doctor" /></div>
                            </div>
                            <div className='child-container'>
                                <div><b><FormattedMessage id="homeheader.medication-fee" /></b></div>
                                <div className='sub-title'><FormattedMessage id="homeheader.overall-check" /></div>
                            </div>
                        </div>
                        <div className='right-content'>
                            <div className='support'>
                                <a href='https://www.google.com/' target='_blank'>
                                    <i className="far fa-question-circle"></i> <FormattedMessage id="homeheader.support" />
                                </a>
                            </div>
                            <div className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}><span onClick={() => this.changeLanguage(LANGUAGES.VI)}>VI</span></div>
                            <div className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}><span onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</span></div>
                        </div>
                    </div>
                </div>
                {this.props.isShowBanner &&
                    <div className='home-header-banner'>
                        <div className='content-up'>
                            <div className='title1'><FormattedMessage id="homebanner.homebanner-title.medical-base" /></div>
                            <div className='title2'><FormattedMessage id="homebanner.homebanner-title.medical-overall-care" /></div>
                            <div className='search'>
                                <i className="fas fa-search"></i>
                                <input type='text' placeholder={language === LANGUAGES.VI ? placeholderArrayVi[0] : placeholderArrayEn[0]} />
                            </div>
                        </div>
                        <div className='content-down'>
                            <div className='options'>
                                <div className='option-child'>
                                    <div className='icon-child'><i className="far fa-hospital"></i></div>
                                    <div className='text-child'><FormattedMessage id="homebanner.homebanner-options.specialized-medication" /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className="fas fa-mobile"></i></div>
                                    <div className='text-child'><FormattedMessage id="homebanner.homebanner-options.remote-checkup" /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className="fas fa-procedures"></i></div>
                                    <div className='text-child'><FormattedMessage id="homebanner.homebanner-options.general-medication" /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className="fas fa-flask"></i></div>
                                    <div className='text-child'><FormattedMessage id="homebanner.homebanner-options.medical-test" /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className="fas fa fa-user-md"></i></div>
                                    <div className='text-child'><FormattedMessage id="homebanner.homebanner-options.mental-healthcare" /></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i className="fas fa-briefcase-medical"></i></div>
                                    <div className='text-child'><FormattedMessage id="homebanner.homebanner-options.dentist-check" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
