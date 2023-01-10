import React, { useState } from "react";
import {
  invoicePaid,
  ninjaClicked,
  ninjaMouseEntered,
  qrCodeClicked,
  resetTooltip,
} from "../../redux/global-slice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { tooltips, TooltipState } from "../../utils/tooltips";
import "./ninja.css";

const Ninja = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.global);
  const [isHidden, setIsHidden] = useState(false);

  const handleNinjaMouseEnter = () => {
    if (window.innerWidth > 768) {
      dispatch(ninjaMouseEntered());
    }
  };

  const handleNinjaMouseLeave = () => {
    if (window.innerWidth > 768) {
      dispatch(resetTooltip());
    }
  };

  const handleNinjaClick = async () => {
    if (window.innerWidth <= 768) {
      setIsHidden((prev) => !prev);
    } else {
      await navigator.clipboard.writeText(
        "03a5f0c532cd4cc7a4d91956e6f66e1e80daee114e0be9244055168b005726d80c"
      );

      dispatch(ninjaClicked());
      setTimeout(() => dispatch(resetTooltip()), 3000);
    }
  };

  const handleQRCodeClick = async () => {
    await navigator.clipboard.writeText(state.invoice?.request || "");

    dispatch(qrCodeClicked());
    setTimeout(() => dispatch(resetTooltip()), 3000);

    if (process.env.NODE_ENV !== "production") {
      setTimeout(() => dispatch(invoicePaid()), 5000);
    }
  };

  let tooltip = state.tooltip && (tooltips[state.tooltip] as React.ReactNode);

  if (state.tooltip === TooltipState.QR_CODE && state.nodes && state.invoice) {
    tooltip = tooltips[state.tooltip](
      state.nodes.length,
      state.invoice,
      handleQRCodeClick
    );
  }

  return (
    <div className="ninja">
      {tooltip && !isHidden ? (
        <div className="ninja__tooltip">{tooltip}</div>
      ) : null}

      <img
        src="/logo192.png"
        alt="logo"
        width={100}
        height={100}
        onMouseEnter={handleNinjaMouseEnter}
        onMouseLeave={handleNinjaMouseLeave}
        onClick={handleNinjaClick}
      />
    </div>
  );
};

export default Ninja;
