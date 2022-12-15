import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './DoctorExtraInfo.scss'
import { getExtraInfoDoctorById } from '../../../services/userService'
import { LANGUAGES } from '../../../utils/constant';
import NumberFormat from 'react-number-format';

class DoctorExtraInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isShowDetailInfo: false,
            extraInfo: {}
        }
    }

    async componentDidMount() {
            const res = await getExtraInfoDoctorById(this.props.doctorIdFromParent)
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfo: res.data
                })
            }
    }

    async componentDidUpdate(prevProps, prevState) {
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            const res = await getExtraInfoDoctorById(this.props.doctorIdFromParent)
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfo: res.data
                })
            }
        }
    }

    showHideDetailInfo = (status) => {
        this.setState({
            isShowDetailInfo: status
        })
    }

    render() {
        const { isShowDetailInfo, extraInfo } = this.state
        const { language } = this.props
        return (
            <div className='doctor-extra-info-container'>
                <div className='content-up'>
                    <div className='text-title'><FormattedMessage id="patient.detail-doctor.address" /></div>
                    <div className='name-clinic'>
                        {extraInfo && extraInfo.nameClinic ? extraInfo.nameClinic : ''}
                    </div>
                    <div className='detail-address'>
                        {extraInfo && extraInfo.addressClinic ? extraInfo.addressClinic : ''}
                    </div>
                </div>
                <div className='content-down'>

                    {!isShowDetailInfo
                        ? <div>
                            <span className='text-title'><FormattedMessage id="patient.detail-doctor.examination-fee" />: </span>
                            <span className='booking-price'>
                                {extraInfo && extraInfo.priceTypeData && language === LANGUAGES.VI
                                    && <NumberFormat
                                        value={extraInfo.priceTypeData.valueVi}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        suffix={'VND'}
                                        style={{ paddingRight: '5px' }}
                                    />
                                }
                                {extraInfo && extraInfo.priceTypeData && language === LANGUAGES.EN
                                    && <NumberFormat
                                        value={extraInfo.priceTypeData.valueEn}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'$'}
                                        style={{ paddingRight: '5px' }}
                                    />
                                }
                            </span>
                            <span className='show-hide' onClick={() => this.showHideDetailInfo(true)}>
                                <FormattedMessage id="patient.detail-doctor.view-detail" />
                            </span>
                        </div>
                        :
                        <div>
                            <span className='text-title'><FormattedMessage id="patient.detail-doctor.examination-fee" />: </span>
                            <div className='info-box'>
                                <div className='detail-info'>
                                    <div className='price-info'>
                                        <h3 className='left'><FormattedMessage id="patient.detail-doctor.examination-fee" /></h3>
                                        <h3 className='right'>
                                            {extraInfo && extraInfo.priceTypeData && language === LANGUAGES.VI
                                                && <NumberFormat
                                                    value={extraInfo.priceTypeData.valueVi}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    suffix={'VND'}
                                                />
                                            }
                                            {extraInfo && extraInfo.priceTypeData && language === LANGUAGES.EN
                                                && <NumberFormat
                                                    value={extraInfo.priceTypeData.valueEn}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    prefix={'$'}
                                                />
                                            }
                                        </h3>
                                    </div>
                                    <div className='note'>
                                        {extraInfo && extraInfo.note ? extraInfo.note : ''}
                                    </div>
                                </div>
                                <div className='payment-method'>
                                    <FormattedMessage id="patient.detail-doctor.payment"/>
                                    <strong>{extraInfo && extraInfo.paymentTypeData ? extraInfo.paymentTypeData.valueVi : ''}</strong>
                                </div>
                            </div>
                            <div>
                                <span className='show-hide' onClick={() => this.showHideDetailInfo(false)}><FormattedMessage id="patient.detail-doctor.hide" /></span>
                            </div>
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfo);
