// src/common/slice/accountSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HAxiosService } from "@helix/component-library";
import { OverviewAPI } from "@earlycollection/apiEndpoints";
// Async thunk for fetching header data from API
export const fetchHeaderData = createAsyncThunk(
  "account/fetchHeaderData",
  async (rowData, { rejectWithValue }) => {
    console.log("Inside Header Data");
    try {
      const response = await HAxiosService.GET(OverviewAPI.fetchOverviewHeader);
      return response.data.data; // backend returns data under data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const accountSlice = createSlice({
  name: "account",
  initialState: {
    selectedRow: null,
    headerData: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedRow: (state, action) => {
      state.selectedRow = action.payload;
    },
    clearAccount: (state) => {
      state.selectedRow = null;
      state.headerData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeaderData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHeaderData.fulfilled, (state, action) => {
        state.loading = false;
        state.headerData = action.payload;
      })
      .addCase(fetchHeaderData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedRow, clearAccount } = accountSlice.actions;
export default accountSlice.reducer;
