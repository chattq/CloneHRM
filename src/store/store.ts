import {configureStore} from '@reduxjs/toolkit';

import {authSlice} from 'store/reducers/auth';
import {uiSlice} from 'store/reducers/ui';
import {orgInfoSlice} from 'store/reducers/orgInfo';
import {generalDataSlice} from 'store/reducers/generalData';
import {createLogger} from 'redux-logger';
import { localizationSlice } from './reducers/localization';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    orgInfo: orgInfoSlice.reducer,
    generalData: generalDataSlice.reducer,
    localizationData: localizationSlice.reducer
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware().concat(createLogger())
  ]
});

export default store;
