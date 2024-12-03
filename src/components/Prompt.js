import React, { useEffect } from "react";
import { useNavigate, useBlocker } from "react-router-dom";

const Prompt = ({ when, message }) => {
  const navigate = useNavigate();

  useEffect(() => {
    let unblock;

    if (when) {
      unblock = navigate.block((transition) => {
        if (window.confirm(message)) {
          unblock();
          transition.retry();
        }
      });
    }

    return () => {
      if (unblock) unblock();
    };
  }, [when, message, navigate]);

  return null;
};

export default Prompt;
