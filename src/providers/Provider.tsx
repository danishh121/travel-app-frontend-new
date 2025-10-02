// src/redux/Provider.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "../redux/store";
// import { PersistGate } from "redux-persist/integration/react";
// import { store, persistor } from "@/redux/store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>
          
             {children}
          
         </Provider>;
}
