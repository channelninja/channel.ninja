/// <reference types="@webbtc/webln-types" />
import "./webln.css";

type GetPubKeyFromExtensionButtonProps = {
  setPubKey(pubKey: string): void;
};

function GetPubKeyFromExtensionButton({
  setPubKey,
}: GetPubKeyFromExtensionButtonProps) {
  return (
    <button
      className="webln__button"
      onClick={(e) => {
        (async () => {
          if (window.webln) {
            try {
              await window.webln.enable();
              try {
                const info = await window.webln.getInfo();
                if (info.node.pubkey) {
                  setPubKey(info.node.pubkey);
                } else {
                  alert("Your current account does not have a public key");
                }
              } catch (error) {
                console.error("Failed to get node info", error);
                alert("Failed to request node info");
              }
            } catch (error) {
              console.error("Failed to enable webln", error);
              alert((error as Error).message);
            }
          } else {
            alert(
              "You don't have a Lightning extension yet. Try Alby at https://getalby.com/"
            );
          }
        })();
        e.preventDefault();
      }}
    >
      Get from extension
    </button>
  );
}

export default GetPubKeyFromExtensionButton;