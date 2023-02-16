import Button from "../Button/Button";
import { useTimeoutTooltip } from "../Ninja/hooks/use-timeout-tooltip";
import { TooltipKey } from "../Ninja/tooltip.enum";

const Socket = ({ pubkey, socket }: { pubkey: string; socket: string }) => {
  const setTooltip = useTimeoutTooltip();

  const ipAndPortRegex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?):(6553[0-5]|655[0-2][0-9]|65[0-4][0-9][0-9]|6[0-4][0-9][0-9][0-9][0-9]|[1-5](\d){4}|[1-9](\d){0,3})$/;

  if (!socket.includes("onion") && !socket.match(ipAndPortRegex)) {
    return null;
  }

  const text = socket.includes("onion")
    ? "copy TOR address"
    : "copy clearnet address";

  const address = `${pubkey}@${socket}`;

  const handleClick = async () => {
    await navigator.clipboard.writeText(address);

    setTooltip(TooltipKey.ADDRESS_CLICKED);
  };

  return <Button onPress={handleClick}>{text}</Button>;
};

export default Socket;
