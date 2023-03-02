import { useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { CHANNEL_NINJA_PUB_KEY } from '../../utils/global-constants';
import { useTimeoutTooltip } from './hooks/use-timeout-tooltip';
import './ninja.css';
import SpeechBubble from './SpeechBubble';
import { ninjaMouseEntered, resetTooltip } from './tooltip-slice';
import { TooltipKey } from './tooltip.enum';

const Ninja = () => {
  const dispatch = useAppDispatch();
  const [isHidden, setIsHidden] = useState(false);
  const setTooltip = useTimeoutTooltip();

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
      await navigator.clipboard.writeText(CHANNEL_NINJA_PUB_KEY);

      setTooltip(TooltipKey.NINJA_CLICKED);
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
