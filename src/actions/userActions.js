import Axios from "axios";
import Cookie from 'js-cookie';

const logout = () => (dispatch) => {
  Cookie.remove("userInfo");
  dispatch({ })
}

 const loginSuccess = (userData) => {
  return {
    type: 'LOGIN_SUCCESS',
    payload: userData // Potrebbe includere l'ID dell'utente insieme ad altri dati
  };
};

export { logout, loginSuccess };