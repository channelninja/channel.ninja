import { QRCodeSVG } from 'qrcode.react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { invoicePaid, selectFee, selectIsMaintenanceMode } from '../../redux/global-slice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { CHANNEL_NINJA_PUB_KEY } from '../../utils/global-constants';
import { useTimeoutTooltip } from './hooks/use-timeout-tooltip';
import { NinjaText } from './ninja-text.enum';
import { selectNinjaText } from './ninja-text.selector';
import { TooltipKey } from './tooltip.enum';

const SpeechBubble = () => {
  const ninjaTextKey = useAppSelector(selectNinjaText);
  const nodeCount = useAppSelector((state) => state.global.nodes?.length || 0);
  const invoice = useAppSelector((state) => state.global.invoice);
  const dispatch = useAppDispatch();
  const tooltipKey = useAppSelector((state) => state.tooltip.key);
  const [useWebLN, setUseWebLN] = useState(true);
  const isMaintenanceMode = useAppSelector(selectIsMaintenanceMode);
  const fee = useAppSelector(selectFee);
  const setTooltip = useTimeoutTooltip();

  useEffect(() => {
    (async () => {
      if (window.webln) {
        if (invoice?.request && nodeCount > 0) {
          try {
            await window.webln.enable();
            await window.webln.sendPayment(invoice.request);
          } catch (error) {
            console.error('Failed to use webln to send payment', error);
            setUseWebLN(false);
          }
        }
      } else {
        setUseWebLN(false);
      }
    })();
  }, [invoice?.request, nodeCount]);

  const handleQRCodeClick = useCallback(async () => {
    await navigator.clipboard.writeText(invoice?.request || '');

    setTooltip(TooltipKey.QR_CODE_CLICKED);

    if (process.env.NODE_ENV !== 'production') {
      setTimeout(() => dispatch(invoicePaid()), 5000);
    }
  }, [dispatch, invoice, setTooltip]);

  const tooltip = useMemo(() => {
    switch (tooltipKey) {
      case TooltipKey.INVALID_PUB_KEY:
        return (
          <p>
            Node could not be found.
            <br />
            <br />
            Make sure you entered a valid public key and your node has at least one public channel.
          </p>
        );
      case TooltipKey.NINJA_CLICKED:
        return <p>Node public key copied!</p>;
      case TooltipKey.NINJA_HOVERED:
        return (
          <p>
            Connect to my node!
            <br />
            <br />
            {CHANNEL_NINJA_PUB_KEY}
            <br />
            <br />
            Click to copy pubkey.
          </p>
        );
      case TooltipKey.QR_CODE_CLICKED:
        return <p>Invoice copied!</p>;
      case TooltipKey.CONNECTIONS_HOVERED:
        return <p>Number of channels this node has to other suggested nodes in this list.</p>;
      case TooltipKey.ADDRESS_CLICKED:
        return <p>Address copied to clipboard.</p>;
      case TooltipKey.GRAPH_NOT_READY:
        return <p>I'm updating my network graph at the moment. Please try again in a few minutes.</p>;
      case TooltipKey.CHANNEL_OPENED:
        return <p>Channel opened successfully.</p>;
      case TooltipKey.CHANNEL_OPENED_FAIL:
        return <p>Could not open channel.</p>;
      case TooltipKey.NO_WEBLN_PUBKEY:
        return <p>Your selected WebLN account doesn't have a pubkey.</p>;
      case TooltipKey.NO_WEBLN_EXTENSION:
        return (
          <p>
            You don't have a Lightning extension yet. For a better experience on channel.ninja download Alby at{' '}
            <a
              className="underline hover:no-underline"
              href="https://getalby.com/"
              target="_blank"
              rel="noreferrer"
            >
              https://getalby.com
            </a>
          </p>
        );
      default:
        return undefined;
    }
  }, [tooltipKey]);

  const ninjaText = useMemo(() => {
    switch (ninjaTextKey) {
      case NinjaText.CONNECTING:
        return <p>connecting...</p>;
      case NinjaText.CONNECTED:
        return <p>Enter your lightning ⚡️ node's pubkey to find recommended channel partners.</p>;
      case NinjaText.LOADING:
        return <p>Loading suggestions...</p>;
      case NinjaText.QR_CODE:
        return (
          <p>
            Found {nodeCount} nodes. Pay the invoice ({fee}sats) to continue.
            <br />
            <br />
            {invoice &&
              (useWebLN ? (
                <>Waiting for payment...</>
              ) : (
                <QRCodeSVG
                  onClick={handleQRCodeClick}
                  value={`lightning:${invoice.request}`}
                  size={260}
                />
              ))}
          </p>
        );
      case NinjaText.RECOMMENDATION_LIST:
        return (
          <p>
            This is a opinionated list of nodes that might be good candidates to open channels to.
            <br />
            <br />
            They have a moderate amount of channels, but not too much so that the decentralized nature of the network
            stays intact.
          </p>
        );
      case NinjaText.NO_NODES_FOUND:
        return <p>No nodes found. Try again later.</p>;
      case NinjaText.OPEN_CHANNEL:
        return <p>Set the desired channel capacity and the fee of the funding transaction to open a channel.</p>;
      default:
        return <p>Enter your ⚡️ node's pubkey to find recommended channel partners.</p>;
    }
  }, [ninjaTextKey, nodeCount, invoice, useWebLN, handleQRCodeClick, fee]);

  const maintenance = isMaintenanceMode ? <p>I'm doing some maintenance. Try again later</p> : undefined;

  return <div className="ninja__speech-bubble">{maintenance || tooltip || ninjaText}</div>;
};

export default SpeechBubble;
