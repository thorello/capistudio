import { createContext, useContext, type ReactNode } from "react";
import type { AppServices } from "./AppServices";

const ServicesContext = createContext<AppServices | null>(null);

type ServicesProviderProps = {
  services: AppServices;
  children: ReactNode;
};

export function ServicesProvider({ services, children }: ServicesProviderProps) {
  return (
    <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>
  );
}

export function useServices(): AppServices {
  const services = useContext(ServicesContext);
  if (!services) {
    throw new Error("useServices deve ser usado dentro de ServicesProvider.");
  }
  return services;
}
