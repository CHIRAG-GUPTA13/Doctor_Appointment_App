import { createContext } from "react";
import { doctors } from "../assets/assets";

// Create the context
export const AppContext = createContext();

// Create the provider component
export const AppContextProvider = ({ children }) => {

  const currencySymbol = '₹'

  const value = {
    doctors,
    currencySymbol
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};


export default AppContextProvider;