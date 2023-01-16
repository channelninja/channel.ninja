import { useEffect, useState } from "react";
import { requestProvider, WebLNProvider } from "webln";
import "./webln.css"

type GetPubKeyFromExtensionButtonProps = {
  setPubKey(pubKey: string): void;
}

function GetPubKeyFromExtensionButton({setPubKey}: GetPubKeyFromExtensionButtonProps) {
  return <button className="webln__button" onClick={(e) => {
    (async () => {
      let webln;
      try {
        webln = await requestProvider();
      }
      catch (error) {
        console.error("Failed to request webln", error);
        alert((error as Error).message);
      }
      if (webln) {
        try {
          const info = await webln.getInfo();
          setPubKey(info.node.pubkey);
        }
        catch(error) {
          console.error("Failed to get node info", error);
          alert("Failed to request node info");
        }
      }
    })();
    e.preventDefault();
  }}>Get from extension</button>;
}

export default GetPubKeyFromExtensionButton;