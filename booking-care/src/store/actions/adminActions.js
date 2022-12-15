import actionTypes from './actionTypes';
import {
    getAllCodeService, createNewUserService, getAllUsers, deleteUserService, editUserService,
    getTopDoctorHomeService, getAllDoctors, saveDetailDoctorService,
    getAllSpecialty
} from '../../services/userService';
import { toast } from 'react-toastify'

export const fetchGenderStart = () => {
    return async function (dispatch, getState) {
        try {
            dispatch({ type: actionTypes.FETCH_GENDER_START })

            const response = await getAllCodeService('GENDER')
            if (response && response.errCode === 0) {
                setTimeout(() => {
                    dispatch(fetchGenderSuccess(response.data))
                }, 3000)
            } else {
                dispatch(fetchGenderFail())
            }

        } catch (e) {
            dispatch(fetchGenderFail())
            console.log('gender start error', e)
        }
    }
}

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})

export const fetchGenderFail = () => ({
    type: actionTypes.FETCH_GENDER_FAIL
})

//position
export const fetchPositionStart = () => {
    return async function (dispatch) {
        try {
            const response = await getAllCodeService('POSITION')

            if (response && response.errCode === 0) {
                dispatch(fetchPositionSuccess(response.data))
            } else {
                dispatch(fetchPositionFail())
            }

        } catch (e) {
            dispatch(fetchPositionFail())
            console.log('position start error', e)
        }
    }
}

export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})

export const fetchPositionFail = () => ({
    type: actionTypes.FETCH_POSITION_FAIL
})

//role
export const fetchRoleStart = () => {
    return async function (dispatch) {
        try {
            const response = await getAllCodeService('ROLE')

            if (response && response.errCode === 0) {
                dispatch(fetchRoleSuccess(response.data))
            } else {
                dispatch(fetchRoleFail())
            }

        } catch (e) {
            console.log('role start error', e)
            dispatch(fetchRoleFail())
        }
    }
}

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})

export const fetchRoleFail = () => ({
    type: actionTypes.FETCH_ROLE_FAIL
})


export const createNewUser = (data) => {
    return async function (dispatch) {
        try {
            const response = await createNewUserService(data)

            if (response && response.errCode === 0) {
                dispatch(saveUserSuccess())
                toast.success('Create a new user succeed!')
            } else {
                dispatch(saveUserFail())
                toast.warn(response.errMessage)
            }

        } catch (e) {
            console.log('role start error', e)
            dispatch(saveUserFail())
        }
    }
}

export const saveUserSuccess = () => ({
    type: actionTypes.SAVE_USER_SUCCESS
})

export const saveUserFail = () => ({
    type: actionTypes.SAVE_USER_FAIL
})


export const fetchAllUserStart = () => {
    return async function (dispatch) {
        try {
            const response = await getAllUsers("ALL")
            if (response && response.errCode === 0) {
                dispatch(fetchAllUserSuccess(response.users.reverse()))
            } else {
                dispatch(fetchAllUserFail())
                toast.error('Server error')
            }
        } catch {
            dispatch(fetchAllUserFail())
        }
    }
}

export const fetchAllUserSuccess = (data) => ({
    type: actionTypes.GET_ALL_USER_SUCCESS,
    data: data
})

export const fetchAllUserFail = () => ({
    type: actionTypes.GET_ALL_USER_FAIL
})

export const deleteUser = (id) => {
    return async function (dispatch) {
        try {
            const response = await deleteUserService(id)
            if (response && response.errCode === 0) {
                dispatch(fetchAllUserStart())
                dispatch(deleteUserSuccess())
                toast.success('Delete an user successfully!')
            } else {
                dispatch(deleteUserFail())
                toast.error(response.errMessage)
            }
        } catch (e) {
            dispatch(deleteUserFail())
            console.log('save user fail error: ', e)
            toast.error('Delete failed!')
        }
    }
}

export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS,
})

export const deleteUserFail = () => ({
    type: actionTypes.DELETE_USER_FAIL
})

export const editUserStart = (user) => {
    return async function (dispatch) {
        try {
            const response = await editUserService(user)
            console.log(response)
            if (response && response.errCode === 0) {
                dispatch(fetchAllUserStart())
                dispatch(deleteUserSuccess())
                toast.success('Edit an user successfully!')
            } else {
                dispatch(deleteUserFail())
                toast.error(response.errMessage)
            }
        } catch (e) {
            dispatch(deleteUserFail())
            console.log('save user fail error: ', e)
            toast.error('Edit failed!')
        }
    }
}

export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS,
})

export const editUserFail = () => ({
    type: actionTypes.EDIT_USER_FAIL
})

export const fetchTopDoctor = () => {
    return async function (dispatch) {
        try {
            const res = await getTopDoctorHomeService('')
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
                    dataDoctors: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_FAIL
                })
            }
        } catch (e) {
            dispatch({
                type: actionTypes.FETCH_TOP_DOCTORS_FAIL
            })
        }
    }
}

export const fetchAllDoctor = () => {
    return async function (dispatch) {
        try {
            const res = await getAllDoctors()
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
                    data: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_FAIL
                })
            }
        } catch (e) {
            console.log(e)
            dispatch({
                type: actionTypes.FETCH_ALL_DOCTORS_FAIL
            })
        }
    }
}

export const saveDetailDoctor = (data) => {
    return async function (dispatch) {
        try {
            const res = await saveDetailDoctorService(data)
            if (res && res.errCode === 0) {
                toast.success("Save doctor information details succeed!")
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTORS_SUCCESS,
                })
            } else {
                if (res.errCode === 1) {
                    toast.error('Missing required params')
                } else {
                    toast.error('Saving doctor info error!')
                }
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTORS_FAIL
                })
            }
        } catch (e) {
            console.log(e)
            toast.error('Error saving doctor info!')
            dispatch({
                type: actionTypes.SAVE_DETAIL_DOCTORS_FAIL
            })
        }
    }
}

export const fetchAllScheduleTime = () => {
    return async function (dispatch) {
        try {
            const res = await getAllCodeService("TIME")
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_HOURS_SUCCESS,
                    dataTime: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_HOURS_FAIL
                })
            }
        } catch (e) {
            console.log(e)
            dispatch({
                type: actionTypes.FETCH_ALLCODE_SCHEDULE_HOURS_FAIL
            })
        }
    }
}

export const fetchRequiredDoctorInfo = () => {
    return async function (dispatch, getState) {
        try {
            dispatch({ type: actionTypes.FETCH_REQUIRE_DOCTOR_INFO_START })

            const resPrice = await getAllCodeService('PRICE')
            const resPayment = await getAllCodeService('PAYMENT')
            const resProvince = await getAllCodeService('PROVINCE')
            const resSpecialty = await getAllSpecialty()

            if (resPrice && resPrice.errCode === 0
                && resPayment && resPayment.errCode === 0
                && resProvince && resProvince.errCode === 0
                && resSpecialty && resSpecialty.errCode === 0
            ) {
                const data = {
                    resPrice: resPrice,
                    resPayment: resPayment,
                    resProvince: resProvince,
                    resSpecialty: resSpecialty
                }
                dispatch(fetchDoctorRequiredInfoSuccess(data))
            } else {
                dispatch(fetchDoctorRequiredInfoFail())
            }

        } catch (e) {
            dispatch(fetchDoctorRequiredInfoFail())
            console.log('fetch required doctor info error', e)
        }
    }
}

export const fetchDoctorRequiredInfoSuccess = (data) => ({
    type: actionTypes.FETCH_REQUIRE_DOCTOR_INFO_SUCCESS,
    data: data
})

export const fetchDoctorRequiredInfoFail = () => ({
    type: actionTypes.FETCH_REQUIRE_DOCTOR_INFO_FAIL
})

