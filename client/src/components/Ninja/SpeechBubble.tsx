import { QRCodeSVG } from "qrcode.react";
import { useCallback, useMemo } from "react";
import { invoicePaid } from "../../redux/global-slice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { NinjaText } from "./ninja-text.enum";
import { selectNinjaText } from "./ninja-text.selector";
import { qrCodeClicked, resetTooltip } from "./tooltip-slice";
import { TooltipKey } from "./tooltip.enum";

const SpeechBubble = () => {
  const ninjaTextKey = useAppSelector(selectNinjaText);
  const nodeCount = useAppSelector((state) => state.global.nodes?.length || 0);
  const invoice = useAppSelector((state) => state.global.invoice);
  const dispatch = useAppDispatch();
  const tooltipKey = useAppSelector((state) => state.tooltip.key);

  const handleQRCodeClick = useCallback(async () => {
    await navigator.clipboard.writeText(invoice?.request || "");

    dispatch(qrCodeClicked());
    setTimeout(() => dispatch(resetTooltip()), 3000);

    if (process.env.NODE_ENV !== "production") {
      setTimeout(() => dispatch(invoicePaid()), 5000);
    }
  }, [dispatch, invoice]);

  const tooltip = useMemo(() => {
    switch (tooltipKey) {
      case TooltipKey.INVALID_PUB_KEY:
        return <p>Node could not be found. Try again.</p>;
      case TooltipKey.NINJA_CLICKED:
        return <p>Node public key copied!</p>;
      case TooltipKey.NINJA_HOVERED:
        return (
          <p>
            Connect to my node!
            <br />
            <br />
            03a5f0c532cd4cc7a4d91956e6f66e1e80daee114e0be9244055168b005726d80c
            <br />
            <br />
            Click to copy pubkey.
          </p>
        );
      case TooltipKey.QR_CODE_CLICKED:
        return <p>Invoice copied!</p>;
      default:
        return undefined;
    }
  }, [tooltipKey]);

  const ninjaText = useMemo(() => {
    switch (ninjaTextKey) {
      case NinjaText.CONNECTING:
        return <p>connecting...</p>;
      case NinjaText.CONNECTED:
        return (
          <p>
            Enter your ⚡️ node's pubkey to find recommended channel partners.
          </p>
        );
      case NinjaText.QR_CODE:
        return (
          <p>
            Found {nodeCount} nodes. Pay the invoice (1000sats) to continue.
            <br />
            <br />
            {invoice && (
              <QRCodeSVG
                onClick={handleQRCodeClick}
                value={`lightning:${invoice.request}`}
                size={260}
              />
            )}
          </p>
        );
      case NinjaText.RECOMMENDATION_LIST:
        return (
          <p>
            This is a opinionated list of nodes that might be good candidates to
            open channels to.
            <br />
            <br />
            They have a moderate amount of channels, but not too much so that
            the decentralized nature of the network stays intact.
          </p>
        );
      case NinjaText.NO_NODES_FOUND:
        return <p>No nodes found. Try again later.</p>;
      default:
        return (
          <p>
            Enter your ⚡️ node's pubkey to find recommended channel partners.
          </p>
        );
    }
  }, [ninjaTextKey, nodeCount, invoice, handleQRCodeClick]);

  return <div className="ninja__speech-bubble">{tooltip || ninjaText}</div>;
};

export default SpeechBubble;
