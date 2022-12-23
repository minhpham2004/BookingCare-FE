import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManagePatient.scss'
import DatePicker from '../../../components/Input/DatePicker'
import { getAllPatientsForDoctor, postSendRemedy } from '../../../services/userService';
import moment from 'moment';
import { LANGUAGES } from '../../../utils';
import RemedyModal from './RemedyModal/RemedyModal';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay'

class ManagePatient extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: {},
            isOpenRemedyModal: false,
            dataModal: {},
            isShowLoading: false
        }
    }

    async componentDidMount() {
        const { user } = this.props
        const { currentDate } = this.state
        const formattedDate = new Date(currentDate).getTime()

        this.getDataPatient(user, formattedDate)
    }

    getDataPatient = async (user, formattedDate) => {
        const res = await getAllPatientsForDoctor(user.id, formattedDate)

        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.dataPatient !== this.state.dataPatient) {
            this.setState({

            })
        }
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, () => {
            const { user } = this.props
            const { currentDate } = this.state
            const formattedDate = new Date(currentDate).getTime()

            this.getDataPatient(user, formattedDate)
        })
    }

    handleBtnConfirm = (patient) => {
        const data = {
            doctorId: patient.doctorId,
            patientId: patient.patientId,
            email: patient.patientData.email,
            timeType: patient.timeType,
            patientName: patient.patientData.firstName
        }

        this.setState({
            isOpenRemedyModal: true,
            dataModal: data
        })
    }

    isCloseRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false
        })
    }

    sendRemedy = async (dataChildFromModal) => {
        const { dataModal } = this.state
        this.setState({
            isShowLoading: true
        })

        const res = await postSendRemedy({
            email: dataChildFromModal.email,
            imgBase64: dataChildFromModal.imgBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            language: this.props.language,
            patientName: dataModal.patientName
        })

        if (res && res.errCode === 0) {
            toast.success('Sending remedy success')
            this.setState({
                isOpenRemedyModal: false,
                isShowLoading: false
            })

            const { user } = this.props
            const { currentDate } = this.state
            const formattedDate = new Date(currentDate).getTime()

            this.getDataPatient(user, formattedDate)

        } else {
            toast.error('Sending remedy error')
            this.setState({
                isShowLoading: false
            })
        }



    }

    render() {
        const { currentDate, dataPatient, isOpenRemedyModal, dataModal } = this.state
        const { language } = this.props

        return (
            <>
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Loading...'
                >
                    <div className='manage-patient-container'>
                        <div className='m-p-title'>
                            Quan li benh nhan kham benh
                        </div>
                        <div className='manage-patient-body row'>
                            <div className='col-4 form-group'>
                                <label>Chon ngay kham</label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className='form-control'
                                    value={currentDate}
                                />
                            </div>
                            <div className='col-12'>
                                <table className='table-manage-patient'>
                                    <tbody>
                                        <tr>
                                            <th>STT</th>
                                            <th>Thoi gian</th>
                                            <th>Ho va ten</th>
                                            <th>Dia chi</th>
                                            <th>Gioi tinh</th>
                                            <th>Actions</th>
                                        </tr>
                                        {dataPatient && dataPatient.length > 0 ?
                                            dataPatient.map((patient, index) => {
                                                const time = language === LANGUAGES.VI ? patient.timeTypeDataPatient.valueVi : patient.timeTypeDataPatient.valueEn
                                                const gender = language === LANGUAGES.VI ? patient.patientData.genderData.valueVi : patient.patientData.genderData.valueEn
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{time}</td>
                                                        <td>{patient.patientData.firstName}</td>
                                                        <td>{patient.patientData.address}</td>
                                                        <td>{gender}</td>
                                                        <td>
                                                            <button className='mp-btn-confirm' onClick={() => this.handleBtnConfirm(patient)}>Xac nhan</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            :
                                            <tr>
                                                <td colSpan={6}>No Data found</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <RemedyModal
                        isOpenRemedyModal={isOpenRemedyModal}
                        dataModal={dataModal}
                        isCloseRemedyModal={this.isCloseRemedyModal}
                        sendRemedy={this.sendRemedy}
                    />
                </LoadingOverlay>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
