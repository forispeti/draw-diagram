import { useEffect, useState } from "react";

export const useBeforeRender = (callback, deps) => {
  const [isRun, setIsRun] = useState(false);

  if (!isRun) {
    callback();
    setIsRun(true);
  }

  useEffect(() => () => setIsRun(false), []);
};