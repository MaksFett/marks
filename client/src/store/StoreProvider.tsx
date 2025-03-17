import { createContext, ReactNode, useContext } from "react";
import UserStore from "./UserStore";

const StoreContext = createContext({ userStore: UserStore });

export const StoreProvider = ({ children }: { children: ReactNode }) => (
  <StoreContext.Provider value={{ userStore: UserStore }}>
    {children}
  </StoreContext.Provider>
);

export const useStore = () => useContext(StoreContext);
