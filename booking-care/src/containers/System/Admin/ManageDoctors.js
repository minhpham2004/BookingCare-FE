import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions'
import './ManageDoctors.scss'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select'
import { getDetailInfoDoctorById } from '../../../services/userService'
import { LANGUAGES } from '../../../utils/constant';
import { ClickAwayListener } from '@mui/material';

const mdParser = new MarkdownIt;

class ManageDoctors extends Component {

    constructor(props) {
        super(props)
        this.state = {
            //save to markdown table
            contentMarkdown: '',
            contentHTML: '',
            description: '',
            allDoctors: [],
            selectedOption: '',
            hasOldData: false,

            //save to doctor_infor table
            listPrice: [],
            listPayment: [],
            listProvince: [],
            listSpecialty: [],
            listClinic: [],

            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            selectedClinic: '',
            selectedSpecialty: '',

            nameClinic: '',
            addressClinic: '',
            note: '',
            clinicId: '',
            specialtyId: ''
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.getAllDoctorRequiredInfo();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            const dataSelect = this.buildDataSelection(this.props.allDoctors, 'DOCTOR')
            this.setState({
                allDoctors: dataSelect
            })
        }

        if (prevProps.allDoctorRequiredInfo !== this.props.allDoctorRequiredInfo) {
            const { resPrice, resPayment, resProvince, resSpecialty, resClinic } = this.props.allDoctorRequiredInfo
            const dataSelectPrice = this.buildDataSelection(resPrice.data, 'PRICE')
            const dataSelectPayment = this.buildDataSelection(resPayment.data, 'PAYMENT')
            const dataSelectProvince = this.buildDataSelection(resProvince.data, 'PROVINCE')
            const dataSelectSpecialty = this.buildDataSelection(resSpecialty.data, 'SPECIALTY')
            const dataSelectClinic = this.buildDataSelection(resClinic.data, 'CLINIC')

            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectSpecialty,
                listClinic: dataSelectClinic
            })
        }

        if (prevProps.language !== this.props.language) {
            const dataSelect = this.buildDataSelection(this.props.allDoctors, 'DOCTOR')
            this.setState({
                allDoctors: dataSelect,
            })

            const { resPrice, resPayment, resProvince } = this.props.allDoctorRequiredInfo
            if (resPrice && resPrice.data && resPrice.data.length > 0
                && resPayment && resPayment.data && resPayment.data.length > 0
                && resProvince && resProvince.data && resProvince.data.length > 0) {
                const dataSelectPrice = this.buildDataSelection(resPrice.data, 'PRICE')
                const dataSelectPayment = this.buildDataSelection(resPayment.data, 'PAYMENT')
                const dataSelectProvince = this.buildDataSelection(resProvince.data, 'PROVINCE')

                this.setState({
                    listPrice: dataSelectPrice,
                    listPayment: dataSelectPayment,
                    listProvince: dataSelectProvince
                })
            }
        }
    }

    handleEditorChange({ html, text }) {
        this.setState({
            contentMarkdown: text,
            contentHTML: html
        })
    }

    buildDataSelection = (inputData, type) => {
        const results = []
        if (inputData && inputData.length > 0) {
            inputData.map(item => {
                if (type === 'DOCTOR') {
                    let obj = {}
                    const labelVi = item.lastName + ' ' + item.firstName
                    const labelEn = item.firstName + ' ' + item.lastName
                    obj.value = item.id
                    obj.label = this.props.language === LANGUAGES.VI ? labelVi : labelEn
                    results.push(obj)
                }
                if (type === 'PRICE') {
                    let obj = {}
                    const labelVi = item.valueVi + ' VND'
                    const labelEn = '$' + item.valueEn
                    obj.value = item.keyMap
                    obj.label = this.props.language === LANGUAGES.VI ? labelVi : labelEn
                    results.push(obj)
                }
                if (type === 'PROVINCE' || type === 'PAYMENT') {
                    let obj = {}
                    const labelVi = item.valueVi
                    const labelEn = item.valueEn
                    obj.value = item.keyMap
                    obj.label = this.props.language === LANGUAGES.VI ? labelVi : labelEn
                    results.push(obj)
                }
                if (type === 'SPECIALTY') {
                    let obj = {}
                    obj.label = item.name
                    obj.value = item.id
                    results.push(obj)
                }
                if (type === 'CLINIC') {
                    let obj = {}
                    obj.label = item.name
                    obj.value = item.id
                    results.push(obj)
                }
            })
        }

        return results
    }

    handleDoctorChange = async (selectedDoctor) => {
        this.setState({ 
            selectedOption: selectedDoctor 
        });

        const res = await getDetailInfoDoctorById(selectedDoctor.value)
        if (res && res.errCode === 0 && res.data && res.data.markdownData) {
            const markdownData = res.data.markdownData
            if (markdownData.description == null) {
                this.setState({
                    description: '',
                })
            }
            if (markdownData.contentHTML == null) {
                this.setState({
                    contentHTML: '',
                })
            }
            if (markdownData.contentMarkdown == null) {
                this.setState({
                    contentMarkdown: '',
                })
            }

            if (markdownData.description && markdownData.contentHTML && markdownData.contentMarkdown) {
                this.setState({
                    contentHTML: markdownData.contentHTML,
                    contentMarkdown: markdownData.contentMarkdown,
                    description: markdownData.description,
                    hasOldData: true
                })
            }

            let addressClinic = '', nameClinic = '', note = '', paymentId = '', priceId = '', provinceId = '', specialtyId = '', clinicId = ''
            if (res.data && res.data.doctorInfoData) {
                const doctorInfoData = res.data.doctorInfoData
                if (!doctorInfoData.addressClinic) {
                    this.setState({
                        addressClinic: ''
                    })
                }
                if (!doctorInfoData.nameClinic) {
                    this.setState({
                        nameClinic: ''
                    })
                }
                if (!doctorInfoData.note) {
                    this.setState({
                        note: ''
                    })
                }
                if (!doctorInfoData.priceId) {
                    this.setState({
                        selectedPrice: ''
                    })
                }
                if (!doctorInfoData.paymentId) {
                    this.setState({
                        selectedPayment: ''
                    })
                }
                if (!doctorInfoData.provinceId) {
                    this.setState({
                        selectedProvince: ''
                    })
                }
                if (!doctorInfoData.specialtyId) {
                    this.setState({
                        selectedSpecialty: ''
                    })
                }
                if (!doctorInfoData.clinicId) {
                    this.setState({
                        selectedClinic: ''
                    })
                }

                addressClinic = doctorInfoData.addressClinic
                nameClinic = doctorInfoData.nameClinic
                note = doctorInfoData.note
                paymentId = doctorInfoData.paymentId
                priceId = doctorInfoData.priceId
                provinceId = doctorInfoData.provinceId
                specialtyId = doctorInfoData.specialtyId
                clinicId = doctorInfoData.clinicId

                const { listPayment, listPrice, listProvince, listSpecialty, listClinic } = this.state
                if (doctorInfoData.addressClinic && doctorInfoData.nameClinic && doctorInfoData.note
                    && doctorInfoData.paymentId && doctorInfoData.priceId && doctorInfoData.provinceId) {
                    const selectedPrice = listPrice.find(item => {
                        return item && item.value === priceId
                    })

                    const selectedPayment = listPayment.find(item => {
                        return item && item.value === paymentId
                    })

                    const selectedProvince = listProvince.find(item => {
                        return item && item.value === provinceId
                    })

                    const selectedSpecialty = listSpecialty.find(item => {
                        return item && item.value === specialtyId
                    })

                    const selectedClinic = listClinic.find(item => {
                        return item && item.value === clinicId
                    })

                    this.setState({
                        nameClinic: nameClinic,
                        addressClinic: addressClinic,
                        note: note,
                        selectedPayment: selectedPayment,
                        selectedPrice: selectedPrice,
                        selectedProvince: selectedProvince,
                        selectedSpecialty: selectedSpecialty,
                        selectedClinic: selectedClinic
                    })
                }

                if (doctorInfoData.addressClinic || doctorInfoData.nameClinic || doctorInfoData.note
                    || doctorInfoData.paymentId || doctorInfoData.priceId || doctorInfoData.provinceId
                    || doctorInfoData.clinicId || doctorInfoData.specialtyId
                ) {
                    this.setState({
                        hasOldData: true
                    })
                } else {
                    this.setState({
                        hasOldData: false
                    })
                }
            }

        } else {
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                addressClinic: '',
                nameClinic: '',
                note: ''
            })
        }
    };

    handleChangeSelectDoctorInfo = (selectedOption, name) => {
        const stateName = name.name
        let copyState = { ...this.state }
        copyState[stateName] = selectedOption
        this.setState({
            ...copyState
        })
    }

    handleOnChangeText = (e, category) => {
        const copyState = { ...this.state }
        copyState[category] = e.target.value
        this.setState({
            ...copyState
        })
    }

    handleSaveContentMarkdown = async () => {
        const { hasOldData } = this.state

        await this.props.saveDetailDoctor({
            doctorId: this.state.selectedOption.value,
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            action: hasOldData ? 'EDIT' : 'CREATE',

            selectedPrice: this.state.selectedPrice.value,
            selectedPayment: this.state.selectedPayment.value,
            selectedProvince: this.state.selectedProvince.value,
            specialtyId: this.state.selectedSpecialty.value,
            clinicId: this.state.selectedClinic.value,
            nameClinic: this.state.nameClinic,
            addressClinic: this.state.addressClinic,
            note: this.state.note,
        })
    }

    render() {
        const { hasOldData, listSpecialty, listClinic } = this.state

        return (
            <div className='manage-doctor-container'>
                <div className='manage-doctor-title'><FormattedMessage id="admin.manage-doctor.title" /></div>
                <div className='more-info'>
                    <div className='content-left form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.choose-doctor" /></label>
                        <Select
                            value={this.state.allDoctors.value}
                            onChange={this.handleDoctorChange}
                            options={this.state.allDoctors}
                            placeholder={<FormattedMessage id="admin.manage-doctor.choose-doctor" />}
                        />
                    </div>
                    <div className='content-right'>
                        <label><FormattedMessage id="admin.manage-doctor.introduction" /></label>
                        <textarea
                            className='form-control'
                            rows='4'
                            value={this.state.description}
                            onChange={(e) => this.handleOnChangeText(e, 'description')}
                        >
                        </textarea>
                    </div>
                </div>
                <div className='doctor-extra-info row'>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.choose-price" /></label>
                        <Select
                            value={this.state.selectedPrice}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={this.state.listPrice}
                            placeholder={<FormattedMessage id="admin.manage-doctor.choose-price" />}
                            name="selectedPrice"
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.choose-payment" /></label>
                        <Select
                            value={this.state.selectedPayment}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={this.state.listPayment}
                            placeholder={<FormattedMessage id="admin.manage-doctor.choose-payment" />}
                            name="selectedPayment"
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.choose-province" /></label>
                        <Select
                            value={this.state.selectedProvince}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={this.state.listProvince}
                            placeholder={<FormattedMessage id="admin.manage-doctor.choose-province" />}
                            name="selectedProvince"
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.name-clinic" /></label>
                        <input
                            className='form-control'
                            onChange={(e) => this.handleOnChangeText(e, 'nameClinic')}
                            value={this.state.nameClinic}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.address-clinic" /></label>
                        <input
                            className='form-control'
                            onChange={(e) => this.handleOnChangeText(e, 'addressClinic')}
                            value={this.state.addressClinic}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.note" /></label>
                        <input
                            className='form-control'
                            onChange={(e) => this.handleOnChangeText(e, 'note')}
                            value={this.state.note}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-4 form-group'>
                        <label>Chon chuyen khoa</label>
                        <Select
                            value={this.state.selectedSpecialty}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={listSpecialty}
                            placeholder={<FormattedMessage id="admin.manage-doctor.choose-specialty" />}
                            name="selectedSpecialty"
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label>Chon phong kham</label>
                        <Select
                            value={this.state.selectedClinic}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={listClinic}
                            placeholder={<FormattedMessage id="admin.manage-doctor.choose-specialty" />}
                            name="selectedClinic"
                        />
                    </div>
                </div>
                <div className='manage-doctor-editor'>
                    <MdEditor
                        style={{ height: '500px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={({ html, text }) => this.handleEditorChange({ html, text })}
                        value={this.state.contentMarkdown}
                    />
                </div>
                <button
                    className={hasOldData ? "save-content-doctor" : "create-content-doctor"}
                    onClick={() => this.handleSaveContentMarkdown()}
                >
                    {hasOldData ? <span><FormattedMessage id="admin.manage-doctor.save-info" /></span> : <span><FormattedMessage id="admin.manage-doctor.create-info" /></span>}
                </button>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allDoctorRequiredInfo: state.admin.allRequiredDoctorInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctor()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
        getAllDoctorRequiredInfo: () => dispatch(actions.fetchRequiredDoctorInfo())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctors);
