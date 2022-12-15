import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSchedule.scss'
import { FormattedMessage } from 'react-intl'
import Select from 'react-select'
import * as actions from '../../../store/actions'
import DatePicker from '../../../components/Input/DatePicker';
import { LANGUAGES } from '../../../utils';
import { toast } from 'react-toastify'
import _ from 'lodash'
import { saveBulkScheduleDoctor } from '../../../services/userService';


class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDoctors: [],
            selectedDoctor: {},
            currentDate: new Date(),
            rangeTime: []
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors()
        this.props.fetchAllScheduleTime()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            const dataSelect = this.buildDataSelection(this.props.allDoctors)
            this.setState({
                allDoctors: dataSelect
            })
        }
        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime
            if (data && data.length > 0) {
                data = data.map(schedule => ({ ...schedule, isSelected: false }))
                this.setState({
                    rangeTime: data
                })
            }
        }
    }

    handleDoctorChange = async (selectedDoctor) => {
        this.setState({ selectedDoctor: selectedDoctor });
    }

    buildDataSelection = (inputData) => {
        const results = []
        if (inputData && inputData.length > 0) {
            inputData.map(doctor => {
                let obj = {}
                const value = doctor.firstName + ' ' + doctor.lastName
                obj.value = doctor.id
                obj.label = value
                results.push(obj)
            })
        }
        return results
    }

    handleDateChange = (date) => {
        if (date) {
            this.setState({
                currentDate: date
            })
        } else {
            toast.error('Invalid date')
        }
    }

    handleClickBtnTime = (time) => {
        let { rangeTime } = this.state
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if (item.id === time.id) {
                    item.isSelected = !item.isSelected
                }
                return item
            })
        }
        this.setState({
            rangeTime: rangeTime
        })
    }

    handleSaveSchedule = async () => {
        const { rangeTime, selectedDoctor, currentDate } = this.state
        const result = []
        if (!currentDate) {
            toast.error('Invalid date')
            return;
        }
        if (selectedDoctor && _.isEmpty(selectedDoctor)) {
            toast.error('Invalid selected doctor')
            return;
        }

        const dateFormat = new Date(currentDate[0]).getTime()

        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(time => time.isSelected === true)
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map(time => {
                    let object = {}
                    object.doctorId = selectedDoctor.value
                    object.date = dateFormat
                    object.timeType = time.keyMap
                    result.push(object)
                })

                const response = await saveBulkScheduleDoctor({
                    arrSchedule: result,
                    doctorId: selectedDoctor.value,
                    formattedDate: dateFormat
                })
                if (response.errCode === 0) {
                    toast.success("Done booking schedule")
                } else if (response.errCode === 2) {
                    toast.warn('All chosen times have been booked')
                }
            } else {
                toast.error('Please choose time')
            }
        }
    }

    render() {
        const { rangeTime } = this.state
        const { language } = this.props

        return (
            <div className='manage-schedule-container'>
                <div className='ms-title'>
                    <FormattedMessage id='manage-schedule.title' />
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id='manage-schedule.choose-doctor' /></label>
                            <Select
                                value={this.state.selectedDoctor}
                                onChange={this.handleDoctorChange}
                                options={this.state.allDoctors}
                            />
                        </div>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id='manage-schedule.choose-date' /></label>
                            <DatePicker
                                className="form-control"
                                onChange={this.handleDateChange}
                                value={this.state.currentDate}
                                minDate={new Date()}
                            />
                        </div>
                        <div className='col-12 pick-hour-container'>
                            {rangeTime && rangeTime.length > 0 &&
                                rangeTime.map((time, index) => {
                                    return (
                                        <button
                                            className={time.isSelected ? 'btn btn-schedule active' : 'btn btn-schedule'}
                                            key={index}
                                            onClick={() => this.handleClickBtnTime(time)}

                                        >
                                            {language === LANGUAGES.VI ? time.valueVi : time.valueEn}
                                        </button>
                                    )
                                })
                            }
                        </div>
                        <button className='btn-save' onClick={() => this.handleSaveSchedule()}><FormattedMessage id='manage-schedule.save-info' /></button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        allScheduleTime: state.admin.allScheduleTime
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctor()),
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
