import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES } from '../../../utils/constant'
import * as actions from '../../../store/actions'
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import TableManageUser from './TableManageUser';
import _ from 'lodash'
import CommonUtils from '../../../utils/CommonUtils';

class UserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgUrl: '',
            isOpen: false,

            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avatar: '',

            action: 'CREATE',
            userEditId: ''
        }
    }

    async componentDidMount() {
        try {
            this.props.fetchGenderStart()
            this.props.fetchPositionStart()
            this.props.fetchRoleStart()
        } catch (e) {
            console.log(e)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const genderArray = this.props.genderRedux
        const positionArray = this.props.positionRedux
        const roleArray = this.props.roleRedux

        if (prevProps.genderRedux !== this.props.genderRedux) {
            this.setState({
                genderArr: genderArray,
                gender: genderArray && genderArray.length > 0 ? genderArray[0].keyMap : ''
            })
        }

        if (prevProps.positionRedux !== this.props.positionRedux) {
            this.setState({
                positionArr: this.props.positionRedux,
                position: positionArray && positionArray.length > 0 ? positionArray[0].keyMap : ''
            })
        }

        if (prevProps.roleRedux !== this.props.roleRedux) {
            this.setState({
                roleArr: roleArray,
                role: roleArray && roleArray.length > 0 ? roleArray[0].keyMap : ''
            })
        }

        if (!_.isEqual(prevProps.listUsers, this.props.listUsers)) {
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                gender: genderArray && genderArray.length > 0 ? genderArray[0].keyMap : '',
                position: positionArray && positionArray.length > 0 ? positionArray[0].keyMap : '',
                role: roleArray && roleArray.length > 0 ? roleArray[0].keyMap : ''
            })
        }

        if (prevState.action === 'EDIT') {
            if (prevState.action !== this.state.action) {
                this.setState({
                    email: '',
                    password: '',
                    firstName: '',
                    lastName: '',
                    phoneNumber: '',
                    address: '',
                    gender: genderArray && genderArray.length > 0 ? genderArray[0].keyMap : '',
                    position: positionArray && positionArray.length > 0 ? positionArray[0].keyMap : '',
                    role: roleArray && roleArray.length > 0 ? roleArray[0].keyMap : ''
                })
            }
        }
    }

    handleChangeImage = async (e) => {
        const fileData = e.target.files
        const file = fileData[0]
        if (file) {
            const base64 = await CommonUtils.getBase64(file)

            const objectURL = URL.createObjectURL(file)
            this.setState({
                previewImgUrl: objectURL,
                avatar: base64
            })
        }
    }

    openPreviewImage = () => {
        if (!this.state.previewImgUrl) {
            return ''
        }
        this.setState({
            isOpen: true
        })
    }

    handleSaveUser = async () => {
        const isValid = this.checkValidateInput()
        if (isValid) {
            //fire action redux
            await this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phonenumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar
            })

            this.props.fetchAllUser()
        }
    }

    checkValidateInput = () => {
        let isValid = true
        const arrCheck = ['email', 'password', 'firstName', 'lastName', 'phoneNumber', 'address']
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false
                alert(`${arrCheck[i]} is required`)
                break;
            }
        }
        return isValid
    }

    onChangeInput = (e, id) => {
        const copyState = { ...this.state }
        copyState[id] = e.target.value
        this.setState({
            ...copyState
        })
    }

    handleEditUser = (user) => {
        let imageBase64 = ''
        if (user.image) {
            imageBase64 = new Buffer(user.image, 'base64').toString('binary')
        }
        this.setState({
            action: 'EDIT',
            email: user.email,
            password: 'HARDCODE',
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phonenumber,
            address: user.address,
            gender: user.gender,
            position: user.positionId,
            role: user.roleId,
            userEditId: user.id,
            previewImgUrl: imageBase64,
            avatar: user.avatar
        })
    }

    handleSaveEditInfo = async () => {
        if (this.state.action === 'EDIT') {
            await this.props.editUser({
                id: this.state.userEditId,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                gender: this.state.gender,
                positionId: this.state.position,
                roleId: this.state.role,
                userEditId: this.state.id,
                avatar: this.state.avatar
            })

            this.setState({
                action: 'CREATE',
            })
        }
    }

    render() {
        const genders = this.state.genderArr
        const isLoadingGender = this.props.isLoadingGender
        const positions = this.state.positionArr
        const roles = this.state.roleArr
        const language = this.props.language

        const { email, password, firstName, lastName, phoneNumber, address, gender, position, role, action, previewImgUrl } = this.state

        return (
            <div className='user-redux-container'>
                <div>
                    {isLoadingGender ? 'Loading' : ''}
                </div>
                <div className='title'><div className="text-center"><FormattedMessage id='menu.system.system-administrator.user-redux' /></div>
                </div>
                <div className='user-redux-body'>
                    <div className='container'>
                        <div className='row px-2 py-4'>
                            <div className='col-12 display-4 pb-3'>
                                {action === 'CREATE'
                                    ? <FormattedMessage id='manage-user.add' />
                                    : <FormattedMessage id='manage-user.edit-title' />
                                }
                            </div>
                            <div className='col-3 py-2'>
                                <label><FormattedMessage id="manage-user.email" /></label>
                                <input type='email' className='form-control' value={email} onChange={(e) => this.onChangeInput(e, 'email')}
                                    disabled={action === 'EDIT' ? true : false} />
                            </div>
                            <div className='col-3 py-2'>
                                <label><FormattedMessage id="manage-user.password" /></label>
                                <input type='password' className='form-control' value={password} onChange={(e) => this.onChangeInput(e, 'password')}
                                    disabled={action === 'EDIT' ? true : false}
                                />
                            </div>
                            <div className='col-3 py-2'>
                                <label><FormattedMessage id="manage-user.first-name" /></label>
                                <input type='text' className='form-control' value={firstName} onChange={(e) => this.onChangeInput(e, 'firstName')} />
                            </div>
                            <div className='col-3 py-2'>
                                <label><FormattedMessage id="manage-user.last-name" /></label>
                                <input type='text' className='form-control' value={lastName} onChange={(e) => this.onChangeInput(e, 'lastName')} />
                            </div>
                            <div className='col-3 py-2'>
                                <label><FormattedMessage id="manage-user.phone-number" /></label>
                                <input type='text' className='form-control' value={phoneNumber} onChange={(e) => this.onChangeInput(e, 'phoneNumber')}
                                    disabled={action === 'EDIT' ? true : false}
                                />
                            </div>
                            <div className='col-9 py-2'>
                                <label><FormattedMessage id="manage-user.address" /></label>
                                <input type='text' className='form-control' value={address} onChange={(e) => this.onChangeInput(e, 'address')} />
                            </div>
                            <div className='col-3 py-2'>
                                <label><FormattedMessage id="manage-user.gender" /></label>
                                <select type='text' className='form-control' value={gender} onChange={(e) => this.onChangeInput(e, 'gender')}>
                                    {genders && genders.length > 0 &&
                                        genders.map((gender, index) => {
                                            return (
                                                <option key={index} value={gender.keyMap}>
                                                    {language === LANGUAGES.VI ? gender.valueVi : gender.valueEn}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className='col-3 py-2'>
                                <label><FormattedMessage id="manage-user.position" /></label>
                                <select type='text' className='form-control' value={position} onChange={(e) => this.onChangeInput(e, 'position')}>
                                    {positions && positions.length > 0 &&
                                        positions.map((position, index) => {
                                            return (
                                                <option key={index} value={position.keyMap}>
                                                    {language === LANGUAGES.VI ? position.valueVi : position.valueEn}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className='col-3 py-2'>
                                <label><FormattedMessage id="manage-user.role" /></label>
                                <select type='text' className='form-control' value={role} onChange={(e) => this.onChangeInput(e, 'role')}>
                                    {roles && roles.length > 0 &&
                                        roles.map((role, index) => {
                                            return (
                                                <option key={index} value={role.keyMap}>
                                                    {language === LANGUAGES.VI ? role.valueVi : role.valueEn}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className='col-3 py-2'>
                                <label><FormattedMessage id="manage-user.image" /></label>
                                <input
                                    type='file'
                                    style={{ border: '1px solid #ced4da' }}
                                    onChange={(e) => this.handleChangeImage(e)}
                                    id='preview'
                                />
                                <div
                                    className='preview-image col-6 mt-3'
                                    style={this.state.previewImgUrl ?
                                        { border: '1px solid #ced4da', height: '100px', backgroundImage: `url(${previewImgUrl})`, background: 'center center no-repeat', backgroundSize: 'contain' }
                                        : { border: '1px solid #ced4da', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }
                                    }
                                    onClick={() => this.openPreviewImage()}
                                >
                                    {this.state.previewImgUrl ? '' : <FormattedMessage id='manage-user.preview' />}

                                </div>
                            </div>
                            {action === 'CREATE'
                                ? <button
                                    className='btn btn-primary px-4 mt-3 ml-3'
                                    onClick={this.handleSaveUser}>
                                    <FormattedMessage id='manage-user.save' />
                                </button>
                                : <button
                                    className='btn btn-warning px-4 mt-3 ml-3'
                                    onClick={this.handleSaveEditInfo}
                                >
                                    <FormattedMessage id='manage-user.edit' />
                                </button>
                            }

                        </div>
                    </div>
                </div>
                {this.state.isOpen &&
                    <Lightbox
                        mainSrc={this.state.previewImgUrl}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />}
                <div className='col-12'>
                    <TableManageUser
                        handleEditUser={this.handleEditUser}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        isLoadingGender: state.admin.isLoadingGender,
        positionRedux: state.admin.positions,
        roleRedux: state.admin.roles,
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchGenderStart: () => dispatch(actions.fetchGenderStart()),
        fetchPositionStart: () => dispatch(actions.fetchPositionStart()),
        fetchRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchAllUser: () => dispatch(actions.fetchAllUserStart()),
        editUser: (user) => dispatch(actions.editUserStart(user))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
