import React, { Component } from 'react';
import { connect } from "react-redux";
import { getProfileDoctorById } from '../../../../services/userService';
import './ProfileDoctor.scss'
import NumberFormat from 'react-number-format';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../../utils/constant'
import moment from 'moment';
import { Link } from 'react-router-dom'

class ProfileDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataProfile: {}
        }
    }

    async componentDidMount() {
        const data = await this.getInfoDoctor(this.props.doctorId)
        this.setState({
            dataProfile: data
        })
    }

    getInfoDoctor = async (id) => {
        let result = {}
        if (id) {
            const res = await getProfileDoctorById(id)
            if (res && res.errCode === 0) {
                result = res.data
            }
        }
        return result
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.doctorId !== this.props.doctorId) {
            const data = await this.getInfoDoctor(this.props.doctorId)
            this.setState({
                dataProfile: data
            })
        }
    }

    renderTimeBooking = (dataTime) => {
        const { language } = this.props
        if (dataTime && Object.keys(dataTime).length !== 0) {
            const date = language === LANGUAGES.VI
                ? this.capitalizeFirstLetter(moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY'))
                : moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY')

            const time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn
            return (
                <>
                    <div>{time}</div>
                    <div>{date}</div>
                </>
            )
        }
        return <></>
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    render() {
        const { dataProfile } = this.state
        const { language, isShownProfileDoctor, dataTime, isShowLinkDetail, doctorId } = this.props

        let positionNameVi = '', positionNameEn = ''
        if (dataProfile && dataProfile.positionData) {
            positionNameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.firstName} ${dataProfile.lastName}`
            positionNameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`
        }

        return (
            <div className='profile-doctor-container'>
                <div className='intro-doctor'>
                    <div
                        className='content-left'
                        style={{ backgroundImage: `url(${dataProfile.image ? dataProfile.image : 'https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg'})` }}
                    >
                    </div>
                    <div className='content-right'>
                        <div className='up'>
                            {language === LANGUAGES.VI ? positionNameVi : positionNameEn}
                        </div>
                        <div className='down'>
                            {isShownProfileDoctor ?
                                <>
                                    {dataProfile && dataProfile.markdownData && dataProfile.markdownData.description &&
                                        <span>
                                            {dataProfile.markdownData.description}
                                        </span>
                                    }
                                </>
                                :
                                <>
                                    {this.renderTimeBooking(dataTime)}
                                </>
                            }
                        </div>
                    </div>
                </div>
                {isShowLinkDetail && <Link to={`/detail-doctor/${doctorId}`}>Xem them</Link>}
                <div className='price'>
                    <span className='price-title'><FormattedMessage id='patient.detail-doctor.examination-fee' />: </span>
                    {dataProfile && dataProfile.doctorInfoData && language === LANGUAGES.VI
                        ? <NumberFormat
                            value={dataProfile.doctorInfoData.priceTypeData.valueVi}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={'VND'}
                            className='price-title'
                        />
                        : ''
                    }
                    {dataProfile && dataProfile.doctorInfoData && language === LANGUAGES.EN
                        ? <NumberFormat
                            value={dataProfile.doctorInfoData.priceTypeData.valueEn}
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={'$'}
                            className='price-title'
                        />
                        : ''
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
