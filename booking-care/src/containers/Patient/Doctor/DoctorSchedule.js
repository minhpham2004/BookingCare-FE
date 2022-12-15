import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './DoctorSchedule.scss'
import { LANGUAGES } from '../../../utils/constant';
import moment from 'moment'
import localization from 'moment/locale/vi' // set timezone to vn
import { getScheduleDoctorByDate } from '../../../services/userService';
import BookingModal from './Modal/BookingModal';


class DoctorSchedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allDays: [],
            allAvailabelTime: [],
            isOpenModalBooking: false,
            dataScheduleTimeModal: {}
        }
    }

    getArrayDays = (language) => {
        let arrDays = []
        for (let i = 0; i < 8; i++) {
            let dateObj = {}
            if (language === LANGUAGES.VI) {
                if (i === 0) {
                    const ddMM = moment(new Date()).format('DD/MM')
                    const todayVi = `Hôm nay - ${ddMM}`
                    dateObj.label = todayVi
                } else {
                    const labelVi = moment(new Date()).add(i, 'days').format('dddd - DD/MM')
                    dateObj.label = this.capitalizeFirstLetter(labelVi)
                }
            } else {
                if (i === 0) {
                    const ddMM2 = moment(new Date()).format('DD/MM')
                    const todayEn = `Today - ${ddMM2}`
                    dateObj.label = todayEn
                } else {
                    dateObj.label = moment(new Date()).locale('en').add(i, 'days').format('ddd - DD/MM')
                }
            }
            dateObj.value = moment(new Date()).add(i, 'days').startOf('day').valueOf()
            arrDays.push(dateObj)
        }

        return arrDays
    }

    async componentDidMount() {
        const allDays = this.getArrayDays(this.props.language)
        if (allDays && allDays.length > 0) {
            this.setState({
                allDays: allDays,
            })
        }

        if (this.props.doctorIdFromParent) {
            const res = await getScheduleDoctorByDate(this.props.doctorIdFromParent, allDays[0].value)
            this.setState({
                allAvailabelTime: res.data ? res.data : []
            })
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.language !== this.props.language) {
            const allDays = this.getArrayDays(this.props.language)
            this.setState({
                allDays: allDays
            })
        }

        if (prevProps.doctorIdFromParent !== this.props.doctorIdFromParent) {
            const allDays = this.getArrayDays(this.props.language)
            const res = await getScheduleDoctorByDate(this.props.doctorIdFromParent, allDays[0].value)
            this.setState({
                allAvailabelTime: res.data ? res.data : []
            })
        }
    }

    handleChangeSelect = async (e) => {
        if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
            const doctorId = this.props.doctorIdFromParent
            const date = e.target.value

            const response = await getScheduleDoctorByDate(doctorId, date)
            if (response && response.errCode === 0) {
                const doctorScheduleData = response.data
                this.setState({
                    allAvailabelTime: doctorScheduleData ? doctorScheduleData : []
                })
            }
        }
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    handleClickScheduleTime = (schedule) => {
        this.setState({
            isOpenModalBooking: true,
            dataScheduleTimeModal: schedule
        })
    }

    closeBookingModal = () => {
        this.setState({
            isOpenModalBooking: false,
        })
    }

    render() {
        const { allDays, allAvailabelTime, isOpenModalBooking, dataScheduleTimeModal } = this.state
        const { language } = this.props

        return (
            <>
                <div className='doctor-schedule-container'>
                    <div className='all-schedule'>
                        <select onChange={(e) => this.handleChangeSelect(e)}>
                            {allDays && allDays.length > 0 &&
                                allDays.map((day, index) => {
                                    return (
                                        <option value={day.value} key={index}>{day.label}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className='all-available-time'>
                        <div className='calendar-text'>
                            <span><i className='fas fa-calendar-alt'></i><FormattedMessage id="patient.detail-doctor.schedule" /></span>
                        </div>
                        <div className='time-content'>
                            {allAvailabelTime && allAvailabelTime.length > 0 ?
                                allAvailabelTime.map((item, index) => {
                                    const timeDisplay = language === LANGUAGES.VI ? item.timeTypeData.valueVi : item.timeTypeData.valueEn
                                    return (
                                        <button
                                            className={language === LANGUAGES.VI ? 'btn-vi' : 'btn-en'}
                                            key={index}
                                            onClick={() => this.handleClickScheduleTime(item)}
                                        >
                                            {timeDisplay}
                                        </button>
                                    )
                                })
                                :
                                <div className='no-schedule'><FormattedMessage id="patient.detail-doctor.no-schedule" /></div>
                            }
                        </div>
                    </div>
                </div>
                <BookingModal
                    isOpenModalBooking={isOpenModalBooking}
                    closeBookingModal={this.closeBookingModal}
                    dataScheduleTimeModal={dataScheduleTimeModal}
                />
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
