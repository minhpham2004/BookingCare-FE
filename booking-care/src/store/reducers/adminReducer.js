import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoadingGender: false,
    genders: [],
    positions: [],
    roles: [],
    users: [],
    topDoctors: [],
    allDoctors: [],
    allScheduleTime: [],

    allRequiredDoctorInfo: [],
}

const adminReducer = (state = initialState, action) => {
    const copyState = { ...state }

    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            copyState.isLoadingGender = true
            return {
                ...copyState,
            }
        case actionTypes.FETCH_GENDER_SUCCESS:
            copyState.genders = action.data
            copyState.isLoadingGender = false

            return {
                ...copyState,
            }
        case actionTypes.FETCH_GENDER_FAIL:
            copyState.isLoadingGender = false
            copyState.gender = []

            return {
                ...copyState,
            }

        case actionTypes.FETCH_POSITION_SUCCESS:
            copyState.positions = action.data
            return {
                ...copyState
            }

        case actionTypes.FETCH_POSITION_FAIL:
            copyState.positions = []
            return {
                ...copyState
            }

        case actionTypes.FETCH_ROLE_SUCCESS:
            copyState.roles = action.data
            return {
                ...copyState
            }

        case actionTypes.FETCH_ROLE_FAIL:
            copyState.roles = []
            return {
                ...copyState
            }

        case actionTypes.GET_ALL_USER_SUCCESS:
            state.users = action.data
            return {
                ...state
            }

        case actionTypes.GET_ALL_USER_FAIL:
            state.users = []
            return {
                ...state
            }

        case actionTypes.FETCH_TOP_DOCTORS_SUCCESS:
            state.topDoctors = action.dataDoctors
            return {
                ...state
            }

        case actionTypes.FETCH_TOP_DOCTORS_FAIL:
            state.topDoctors = []
            return {
                ...state
            }

        case actionTypes.FETCH_ALL_DOCTORS_SUCCESS:
            state.allDoctors = action.data
            return {
                ...state
            }

        case actionTypes.FETCH_ALL_DOCTORS_FAIL:
            state.allDoctors = []
            return {
                ...state
            }

        case actionTypes.FETCH_ALLCODE_SCHEDULE_HOURS_SUCCESS:
            state.allScheduleTime = action.dataTime
            return {
                ...state
            }

        case actionTypes.FETCH_ALLCODE_SCHEDULE_HOURS_FAIL:
            state.allScheduleTime = []
            return {
                ...state
            }

        case actionTypes.FETCH_REQUIRE_DOCTOR_INFO_SUCCESS:
            state.allRequiredDoctorInfo = action.data
            return {
                ...state
            }

            case actionTypes.FETCH_REQUIRE_DOCTOR_INFO_SUCCESS:
                state.allRequiredDoctorInfo = []
                return {
                    ...state
                }
    
        default:
            return state;
    }
}

export default adminReducer;