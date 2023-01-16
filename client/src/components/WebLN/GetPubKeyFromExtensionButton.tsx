import { useEffect, useState } from "react";
import { requestProvider, WebLNProvider } from "webln";
import "./webln.css"

type GetPubKeyFromExtensionButtonProps = {
  setPubKey(pubKey: string): void;
}

function GetPubKeyFromExtensionButton({setPubKey}: GetPubKeyFromExtensionButtonProps) {
  const [webln, setWebln] = useState<WebLNProvider | undefined>();

  useEffect(() => {
    (async () => {
      try {
        setWebln(await requestProvider());
      }
      catch (error) {
        console.error("Failed to request webln", error);
      }
    })();
  })


  return webln ? <button className="webln__button" onClick={(e) => {
    (async () => {
      const info = await webln.getInfo();
      setPubKey(info.node.pubkey);
    })();
    e.preventDefault();
  }}>Get from extension</button> : null;
}

export default GetPubKeyFromExtensionButton;