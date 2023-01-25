import { createSlice } from '@reduxjs/toolkit';

export const initialStates = {
  isLogin: false,
  isSignUp: false,
  favoritesFood: [],
  USER: null,
  USER_PERSISTED: null,
  currentUser: null,
  profile: null,
  userEmail: null,
  startScene: '',
  passwordReset: false,
  tempPass: null,
  tempName: null,
};

export const userSlicer = createSlice({
  name: 'userSlice',
  initialState: initialStates,
  reducers: {
    loginAccount: (state, action) => {
      const { USER } = action.payload;
      return { ...state, isLogin: true, USER };
    },
    logoutAccount: (state) => {
      Object.assign(state, {
        USER: null,
        profile: null,
        isLogin: false,
        userEmail: null,
      });
    },
    initSignUp: (state) => {
      return { ...state, isSignUp: false };
    },
    signUpAccount: (state, action) => {
      return { ...state, isSignUp: true };
    },
    initResetAccount: (state) => {
      return { ...state, passwordReset: false };
    },
    resetAccount: (state, action) => {
      return { ...state, passwordReset: true };
    },
    getCurrentUser: (state, action) => {
      const { currentUser } = action.payload;
      return {
        ...state,
        currentUser,
        USER: currentUser,
      };
    },
    updateProfile: (state, action) => {
      const { profile } = action.payload;
      const prevProfile = state.profile || {};
      const nProfile = { ...prevProfile, ...profile };
      return {
        ...state,
        profile: nProfile,
      };
    },
    addFavorites: (state, action) => {
      const { restaurant } = action.payload;
      const find = state.favoritesFood.find(
        (item) => item.id === restaurant.id
      );
      if (!find) {
        const newList = [...state.favoritesFood, restaurant];
        Object.assign(state, { favoritesFood: newList });
        // showMessage({
        //   message: 'Eestaurant added to favorites',
        //   type: 'success'
        // });
      } else {
        // showMessage({
        //   message: 'Restaurant available in favorites',
        //   type: 'warning'
        // });
      }
    },
    removeFavorites: (state, action) => {
      const { id } = action.payload;
      const filterList = state.favoritesFood.filter((item) => item.id !== id);
      Object.assign(state, { favoritesFood: filterList });
    },
    resetUserStates: (state) => {
      return initialStates;
    },
  },
});

export const {
  loginAccount,
  logoutAccount,
  initSignUp,
  signUpAccount,
  initResetAccount,
  resetAccount,
  addFavorites,
  removeFavorites,
  resetUserStates,
  getCurrentUser,
  updateProfile,
} = userSlicer.actions;

export default userSlicer.reducer;
