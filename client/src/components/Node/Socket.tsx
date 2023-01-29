import { useAppDispatch } from "../../redux/hooks";
import { addressClicked, resetTooltip } from "../Ninja/tooltip-slice";

const Socket = ({ pubkey, socket }: { pubkey: string; socket: string }) => {
  const dispatch = useAppDispatch();

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

    dispatch(addressClicked());
    setTimeout(() => dispatch(resetTooltip()), 3000);
  };

  return (
    <button className="socket__button" onClick={handleClick}>
      {text}
    </button>
  );
};

export default Socket;
