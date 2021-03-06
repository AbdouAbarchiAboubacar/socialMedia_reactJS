import { SET_USER, SET_ERRORS, LOADING_UI, CLEAR_ERRORS, SET_UNAUTHENTICATED, LOADING_USER, MARK_NOTIFICATIONS_READ } from '../types';
import axios from 'axios';

export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });

    axios.post('/login', userData).then((res) => {
        setAuthorizationHeader(res.data.token);
        dispatch(getUserData());
        dispatch({ type: CLEAR_ERRORS });
        history.push('/');
    }).catch((error) => {
        dispatch({
            type: SET_ERRORS,
            payload: error.response.data
        });
    });
}

export const signupUser = (newUserData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });

    axios.post('/signup', newUserData).then((res) => {
        setAuthorizationHeader(res.data.token);
        dispatch(getUserData());
        dispatch({ type: CLEAR_ERRORS });
        history.push('/');
    }).catch((error) => {
        dispatch({
            type: SET_ERRORS,
            payload: error.response.data
        });
    });
};

export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('FBIdToken');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: SET_UNAUTHENTICATED });
};
export const getUserData = () => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.get('/user').then(res => {
        dispatch({
            type: SET_USER,
            payload: res.data
        });
    }).catch(error => {
        console.log(error);
    });
};

export const uploadImage = (formData) => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.post('/user/image', formData).then(() => {
        dispatch(getUserData());
    }).catch(error => { console.log(error); });
};

export const editUserDetails = (userDetails) => (dispatch) => {
    dispatch({ type: LOADING_USER });
    axios.post('/user', userDetails).then(() => {
        dispatch(getUserData());
    }).catch(error => {
        console.log(error);
    });
};
export const markNotificationsRead  = (notificationIds) => dispatch => {
    axios.post('/notifications', notificationIds).then(res => {
        dispatch({
            type: MARK_NOTIFICATIONS_READ
        });
    }).catch(error => {
        console.log(error);
    });
};
const setAuthorizationHeader = (token) => {
    const FBIdToken = `Bearer ${token}`;
    localStorage.setItem('FBIdToken', FBIdToken);
    axios.defaults.headers.common['Authorization'] = FBIdToken;
};