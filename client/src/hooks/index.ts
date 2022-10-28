import { DependencyList, useEffect } from "react";

export const useLoadingPeriod = (
  callback: () => void,
  dependencies: DependencyList
) => {
  useEffect(() => {
    setTimeout(() => {
      callback();
    }, 4000);
  }, dependencies);
};
