import React from 'react';
import { useTimeoutTooltip } from '../Ninja/hooks/use-timeout-tooltip';
import { TooltipType } from '../Ninja/tooltip-slice';
import { TooltipKey } from '../Ninja/tooltip.enum';
import './webln.css';

type GetPubKeyFromExtensionButtonProps = {
  setPubKey(pubKey: string): void;
};

function GetPubKeyFromExtensionButton({ setPubKey }: GetPubKeyFromExtensionButtonProps) {
  const setTooltip = useTimeoutTooltip();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (window.webln) {
      try {
        await window.webln.enable();

        try {
          const info = await window.webln.getInfo();

          if (info.node.pubkey) {
            setPubKey(info.node.pubkey);
          } else {
            setTooltip(TooltipKey.NO_WEBLN_PUBKEY, 7_000, TooltipType.ERROR);
          }
        } catch (error) {
          console.error('Failed to get node info', error);
          alert('Failed to request node info');
        }
      } catch (error) {
        console.error('Failed to enable webln', error);
        alert((error as Error).message);
      }
    } else {
      setTooltip(TooltipKey.NO_WEBLN_EXTENSION, 7_000, TooltipType.ERROR);
    }
  };

  return (
    <button
      className="webln__button"
      onClick={handleClick}
    >
      Get from extension
    </button>
  );
}

export default GetPubKeyFromExtensionButton;
