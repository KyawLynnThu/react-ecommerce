import { configureStore } from "@reduxjs/toolkit";
import { loadState, saveState } from "./session";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./config/api";
import { errorHandler } from "./config/api/error-handler";
import collapsedReducer from "./features/collapsedSlice";
import localeReducer from "./features/localeSlice";
import themeReducer from "./features/themeSlice";
import responsiveReducer from "./features/responsiveSlice";
import userReducer from "./features/userSlice";
import updateReducer from "./features/updateSlice";
import rolesReducer from "./features/rolesSlice";
import categoryReducer from "./features/categorySlice";

// Load the persisted state from local storage
const persistedState = loadState();

// Define reducers to exclude from storing in local storage
const slicesToExclude = ["api", "update", "roles", "category"];

// Create the Redux store
const store = configureStore({
    reducer: {
        // Reducers for managing various aspects of the application state
        collapsed: collapsedReducer, // Reducer for managing the "collapsed" state
        locale: localeReducer, // Reducer for managing the "locale" state
        darkMode: themeReducer, // Reducer for managing the "darkMode" theme
        breakpoint: responsiveReducer, // Reducer for managing the "breakpoint" state
        user: userReducer, // Add the user slice to the store
        update: updateReducer, // Add the desired updated data to the store
        roles: rolesReducer, // Add selected checkbox role data to the store
        category: categoryReducer, // Add edited category data to the store
        [api.reducerPath]: api.reducer, // Reducer for common API state
    },
    preloadedState: persistedState, // Initialize the store with persisted state
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            // Disable immutable state invariant middleware for performance
            immutableCheck: false,
        })
            // Add custom error handling middleware
            .concat(errorHandler)
            // Add common API middleware
            .concat(api.middleware),
});

// Subscribe to store changes to save state to local storage
store.subscribe(() => {
    saveState(store.getState(), slicesToExclude);
});

// Set up listeners for API actions
setupListeners(store.dispatch);

export default store;
