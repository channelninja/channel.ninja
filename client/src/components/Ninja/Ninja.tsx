import { useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import "./ninja.css";
import SpeechBubble from "./SpeechBubble";
import { ninjaClicked, ninjaMouseEntered, resetTooltip } from "./tooltip-slice";

const Ninja = () => {
  const dispatch = useAppDispatch();
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

  return (
    <div className="ninja">
      {!isHidden ? <SpeechBubble /> : null}

      <img
        className="ninja__image"
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
