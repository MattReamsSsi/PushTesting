import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SsiApiClient from './SsiApiClient';

const initialState = {
  furnaces: {},//Record
  instrumentationTypes: {},//Record
  furnaceClasses: {},//Record
  instrumentModels: {},//Record
  instruments: {},//Record
  controlSystems: {},//Record
  controlSystemsTypes: {},//Record
  specifications: {},//Record
  timeIntervals: {},//Record
  thermocouples: {},//Record
  baseMetalTypes: {},//Record
  options: {},//Object
  status: 'not tried yet'
};

export const fetchFurnaces = createAsyncThunk('furnaces/fetchFurnaces', async () => {
  return await SsiApiClient.getFurnaces();
});

export const fetchInstrumentationTypes = createAsyncThunk('furnaces/fetchInstrumentationTypes', async () => {
  return await SsiApiClient.getInstrumentationTypes();
});

export const fetchFurnaceClasses = createAsyncThunk('furnaces/fetchFurnaceClasses', async () => {
  return await SsiApiClient.getFurnaceClasses();
});

export const fetchOptions = createAsyncThunk('furnaces/fetchOptions', async () => {
  return await SsiApiClient.getOptions();
});

export const fetchInstrumentModels = createAsyncThunk('furnaces/fetchInstrumentModels', async () => {
  return await SsiApiClient.getInstrumentModels();
});

export const fetchControlSystems = createAsyncThunk('furnaces/fetchControlSystems', async () => {
  return await SsiApiClient.getControlSystems();
});

export const fetchControlSystemTypes = createAsyncThunk('furnaces/fetchControlSystemTypes', async () => {
  return await SsiApiClient.getControlSystemTypes();
});

export const fetchInstruments = createAsyncThunk('furnaces/fetchInstruments', async () => {
  return await SsiApiClient.getInstruments();
});

export const fetchSpecifications = createAsyncThunk('furnaces/fetchSpecifications', async () => {
  return await SsiApiClient.getSpecifications();
});

export const fetchTimeIntervals = createAsyncThunk('furnaces/fetchTimeIntervals', async () => {
  return await SsiApiClient.getTimeIntervals();
});

export const fetchThermocouples = createAsyncThunk('furnaces/fetchThermocouples', async () => {
  return await SsiApiClient.getThermocouples();
});

export const fetchBaseMetalTypes = createAsyncThunk('furnaces/fetchBaseMetalTypes', async () => {
  return await SsiApiClient.getBaseMetalTypes();
});

export const fetchFurnacesAndStuff = () => dispatch => {
  dispatch(fetchFurnaces());
  dispatch(fetchInstrumentationTypes());
  dispatch(fetchFurnaceClasses());
  dispatch(fetchOptions());
  dispatch(fetchInstrumentModels());
  dispatch(fetchControlSystems());
  dispatch(fetchControlSystemTypes());
  dispatch(fetchInstruments());
  dispatch(fetchSpecifications());
  dispatch(fetchTimeIntervals());
  dispatch(fetchThermocouples());
  dispatch(fetchBaseMetalTypes());
};

export const furnacesSlice = createSlice({
  name: 'furnaces',
  initialState : initialState,
  reducers: {
    // omit reducer cases
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFurnaces.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchFurnaces.fulfilled, (state, action) => {
        const o = {};
        action.payload.forEach(v => {
          o[v.id] = v;
        });
        state.furnaces = o;
        state.status = 'idle';
      })
      .addCase(fetchFurnaces.rejected, (state, action) => {
        state.status = 'rejected: ' + JSON.stringify(action.error) 
      })
      .addCase(fetchInstrumentationTypes.fulfilled, (state, action) => {
        const o = {};
        action.payload.forEach(v => {
          o[v.instrumentationTypeId.toString()] = v;
        });
        state.instrumentationTypes = o;
        state.status = 'idle';
      })
      .addCase(fetchFurnaceClasses.fulfilled, (state, action) => {
        const o = {};
        action.payload.forEach(v => {
          o[v.furnaceClassId.toString()] = v;
        });
        state.furnaceClasses = o;
        state.status = 'idle';
      })
      .addCase(fetchOptions.fulfilled, (state, action) => {
        state.options = action.payload;
        state.status = 'idle';
      })
      .addCase(fetchInstrumentModels.fulfilled, (state, action) => {
        const o = {};
        action.payload.forEach(v => {
          o[v.instrumentModelId.toString()] = v;
        });
        state.instrumentModels = o;
        state.status = 'idle';
      })
      .addCase(fetchControlSystems.fulfilled, (state, action) => {
        const o = {};
        action.payload.forEach(v => {
          o[v.controlSystemId.toString()] = v;
        });
        state.controlSystems = o;
        state.status = 'idle';
      })
      .addCase(fetchControlSystemTypes.fulfilled, (state, action) => {
        const o = {};
        action.payload.forEach(v => {
          o[v.controlSystemTypeId.toString()] = v;
        });
        state.controlSystemTypes = o;
        state.status = 'idle';
      })
      .addCase(fetchInstruments.fulfilled, (state, action) => {
        const o = {};
        action.payload.forEach(v => {
          o[v.instrumentId.toString()] = v;
        });
        state.instruments = o;
        state.status = 'idle';
      })
      .addCase(fetchSpecifications.fulfilled, (state, action) => {
        const o = {};
        action.payload.forEach(v => {
          o[v.specificationId.toString()] = v;
        });
        state.specifications = o;
        state.status = 'idle';
      })
      .addCase(fetchTimeIntervals.fulfilled, (state, action) => {
        const o = {};
        action.payload.forEach(v => {
          o[v.timeIntervalId.toString()] = v;
        });
        state.timeIntervals = o;
        state.status = 'idle';
      })
      .addCase(fetchThermocouples.fulfilled, (state, action) => {
        const o = {};
        action.payload.forEach(v => {
          o[v.thermocoupleId.toString()] = v;
        });
        state.thermocouples = o;
        state.status = 'idle';
      })
      .addCase(fetchBaseMetalTypes.fulfilled, (state, action) => {
        const o = {};
        action.payload.forEach(v => {
          o[v.baseMetalTypeId.toString()] = v;
        });
        state.baseMetalTypes = o;
        state.status = 'idle';
      })
  }
});

export const selectFurnaces = state => state.furnaces.furnaces;
export const selectInstrumentationTypes = state => state.furnaces.instrumentationTypes;
export const selectFurnaceClasses = state => state.furnaces.furnaceClasses;
export const selectInstrumentModels = state => state.furnaces.instrumentModels;
export const selectInstruments = state => state.furnaces.instruments;
export const selectControlSystems = state => state.furnaces.controlSystems;
export const selectControlSystemTypes = state => state.furnaces.controlSystemTypes;
export const selectSpecifications = state => state.furnaces.specifications;
export const selectTimeIntervals = state => state.furnaces.timeIntervals;
export const selectThermocouples = state => state.furnaces.thermocouples;
export const selectBaseMetalTypes = state => state.furnaces.baseMetalTypes;
export const selectOptions = state => state.furnaces.options;
export const selectStatus = state => state.furnaces.status;

export default furnacesSlice.reducer;