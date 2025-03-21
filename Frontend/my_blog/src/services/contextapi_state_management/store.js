// store.js
import React, { createContext, useReducer } from "react";
import reducer from "./reducer/reducer";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, {
        isLoading: false,
        data: null,
        isError: false,
        errorMessage: '',
    });

    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
};
