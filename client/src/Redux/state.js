import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Thông tin người dùng
  token: null, // Token đăng nhập
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Đăng nhập thành công, lưu thông tin người dùng và token
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    // Đăng xuất, xóa thông tin người dùng và token
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    // Cập nhật thông tin người dùng
    setUserDetails: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    // Cập nhật danh sách properties
    setListings: (state, action) => {
      state.listings = action.payload.listings;
    },
    setTripList: (state, action) => {
      state.user.tripList = action.payload;
    },
    setWishList: (state, action) => {
      state.user.wishList = action.payload;
    },
    setPropertyList: (state, action) => {
      state.user.propertyList = action.payload;
    },
    setReservationList: (state, action) => {
      state.user.reservationList = action.payload;
    },
  },
});

// Export các action để sử dụng
export const {
  setLogin,
  setLogout,
  setUserDetails,
  setListings,
  setTripList,
  setWishList,
  setPropertyList,
  setReservationList,
} = userSlice.actions;

// Export reducer để thêm vào store
export default userSlice.reducer;
