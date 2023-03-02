import { useCallback } from 'react';
import { useAppDispatch } from '../../../redux/hooks';
import { resetTooltip, tooltipChanged } from '../tooltip-slice';
import { TooltipKey } from '../tooltip.enum';

let timeoutId: NodeJS.Timeout | undefined;

export const useTimeoutTooltip = () => {
  const dispatch = useAppDispatch();

  const setTooltip = useCallback(
    (tooltipKey: TooltipKey, timeout = 5000) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      dispatch(tooltipChanged(tooltipKey));

      timeoutId = setTimeout(() => dispatch(resetTooltip()), timeout);
    },
    [dispatch],
  );

  return setTooltip;
};
