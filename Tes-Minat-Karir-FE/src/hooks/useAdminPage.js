import { createContext, useContext } from "react";

export const AdminPageContext = createContext(null);

export function useAdminPage() {
  return useContext(AdminPageContext);
}