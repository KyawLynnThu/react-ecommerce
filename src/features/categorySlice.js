import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
    name: "category",
    initialState: {
        editData: null,
    },
    reducers: {
        setEditData: (state, action) => {
            state.editData = action.payload;
        },
        clearEditData: (state) => {
            state.editData = null;
        },
    },
});

export const { setEditData, clearEditData } = categorySlice.actions;

export default categorySlice.reducer;
