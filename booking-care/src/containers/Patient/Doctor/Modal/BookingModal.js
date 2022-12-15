import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './BookingModal.scss'
import { Modal } from 'reactstrap';
import ProfileDoctor from './ProfileDoctor';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import * as actions from '../../../../store/actions'
import { LANGUAGES } from '../../../../utils/constant';
import Select from 'react-select'
import { postPatientBookAppointment } from '../../../../services/userService';
import { toast } from 'react-toastify';
import moment from 'moment';

class DefaultClass extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            gender: '',
            doctorId: '',
            value: null, //birthday

            selectedGender: '',
            timeType: ''
        }
    }

    async componentDidMount() {
        this.props.fetchGender()
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.genderRedux !== prevProps.genderRedux) {
            this.setState({
                gender: this.buildDataGender(this.props.genderRedux)
            })
        }
        if (this.props.language !== prevProps.language) {
            this.setState({
                gender: this.buildDataGender(this.props.genderRedux)
            })
        }
        if (this.props.dataScheduleTimeModal !== prevProps.dataScheduleTimeModal) {


            if (this.props.dataScheduleTimeModal && Object.keys(this.props.dataScheduleTimeModal).length > 0) {
                const { doctorId, timeType } = this.props.dataScheduleTimeModal
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType
                })
            }
        }
    }

    buildDataGender = (data) => {
        let result = []
        const language = this.props.language

        if (data && data.length > 0) {
            data.map(item => {
                let obj = {}
                obj.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn
                obj.value = item.keyMap
                result.push(obj)
            })
        }
        return result
    }

    handleOnChangeInput = (e, category) => {
        let cloneState = { ...this.state }
        cloneState[category] = e.target.value
        this.setState({
            ...cloneState
        })
    }

    handleChange = (newValue) => {
        this.setState({
            value: newValue
        })
    };

    handleChangeSelect = (selectedOptions) => {
        this.setState({
            selectedGender: selectedOptions
        })
    }

    handleConfirmBooking = async () => {
        const dateOfBirth = new Date(this.state.value).getTime()
        const bookingDate = this.props.dataScheduleTimeModal.date
        const timeString = this.buildTimeBooking(this.props.dataScheduleTimeModal)

        const res = await postPatientBookAppointment({
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            selectedGender: this.state.selectedGender.value,
            doctorId: this.state.doctorId,
            timeType: this.state.timeType,
            value: dateOfBirth, //birthday
            date: bookingDate,
            language: this.props.language,
            timeString: timeString,
            doctorName: this.buildDoctorName()
        })

        if (res && res.errCode === 0) {
            toast.success('Booking successfully')
            this.props.closeBookingModal()
            this.setState({
                fullName: '',
                phoneNumber: '',
                email: '',
                address: '',
                reason: '',
                gender: '',
                value: null, //birthday

                selectedGender: '',
                timeType: ''
            })
        } else {
            toast.error('Booking a new appointment error')
        }
    }

    buildTimeBooking = (dataTime) => {
        const { language } = this.props
        if (dataTime && Object.keys(dataTime).length !== 0) {
            const date = language === LANGUAGES.VI
                ? this.capitalizeFirstLetter(moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY'))
                : moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY')

            const time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn
            return `${time} - ${date}`
        }
        return ''
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    buildDoctorName = () => {
        const { language, dataScheduleTimeModal } = this.props
        if (dataScheduleTimeModal && Object.keys(dataScheduleTimeModal).length !== 0) {
            const name = language === LANGUAGES.VI
                ? `${dataScheduleTimeModal.doctorNameData.firstName} ${dataScheduleTimeModal.doctorNameData.lastName}`
                : `${dataScheduleTimeModal.doctorNameData.lastName} ${dataScheduleTimeModal.doctorNameData.firstName}`
            return name
        }
        return ''
    }

    render() {
        const { language, isOpenModalBooking, closeBookingModal, dataScheduleTimeModal } = this.props
        const { fullName, phoneNumber, email, address, reason } = this.state

        return (
            <Modal
                toggle={this.props.closeBookingModal}
                isOpen={isOpenModalBooking}
                className='booking-modal-container'
                size='lg'
                centered
            >
                <div className='modal-booking-content'>
                    <div className='booking-modal-header'>
                        <span className='left'>
                            <FormattedMessage id="patient.booking-modal.booking-info-title" />
                        </span>
                        <span
                            className='right'
                            onClick={closeBookingModal}
                        ><i className='fas fa-times'></i>
                        </span>
                    </div>
                    <div className='booking-modal-body'>
                        <div className='doctor-info'>
                            <ProfileDoctor
                                doctorId={dataScheduleTimeModal && Object.keys(dataScheduleTimeModal).length !== 0 ? dataScheduleTimeModal.doctorId : ''}
                                dataTime={dataScheduleTimeModal}
                                isShownProfileDoctor={false}
                            />
                        </div>
                        <div className='row'>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.name" /></label>
                                <input
                                    className='form-control'
                                    value={fullName}
                                    onChange={(e) => this.handleOnChangeInput(e, 'fullName')}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.phone" /></label>
                                <input
                                    className='form-control'
                                    value={phoneNumber}
                                    onChange={(e) => this.handleOnChangeInput(e, 'phoneNumber')}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.gender" /></label>
                                <Select
                                    value={this.state.selectedGender}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.gender}
                                    placeholder={<FormattedMessage id="patient.booking-modal.choose-gender" />}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.address" /></label>
                                <input
                                    className='form-control'
                                    value={address}
                                    onChange={(e) => this.handleOnChangeInput(e, 'address')}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.email" /></label>
                                <input
                                    className='form-control'
                                    value={email}
                                    onChange={(e) => this.handleOnChangeInput(e, 'email')}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.DOB" /></label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Stack spacing={3}>
                                        <DesktopDatePicker
                                            style={{ padding: 'none' }}
                                            inputFormat="MM/DD/YYYY"
                                            value={this.state.value}
                                            onChange={this.handleChange}
                                            renderInput={(params) =>
                                                <TextField
                                                    {...params}
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        placeholder: language === LANGUAGES.VI ? "Ngày sinh" : "Date of birth"
                                                    }}
                                                    style={{ border: 'none' }}
                                                />
                                            }
                                        />
                                    </Stack>
                                </LocalizationProvider>
                            </div>
                            <div className='col-12 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.reason" /></label>
                                <input
                                    className='form-control'
                                    value={reason}
                                    onChange={(e) => this.handleOnChangeInput(e, 'reason')}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='booking-modal-footer'>
                        <button className='btn-booking-confirm' onClick={() => this.handleConfirmBooking()}>Confirm</button>
                        <button className='btn-booking-cancel' onClick={closeBookingModal}>Cancel</button>
                    </div>
                </div>
            </Modal>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchGender: () => dispatch(actions.fetchGenderStart())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultClass);
