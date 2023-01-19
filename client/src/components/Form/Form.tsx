import { useEffect, useState } from "react";
import GetPubKeyFromExtensionButton from "../WebLN";
import "./form.css";

const Form = ({
  onSubmit,
}: {
  onSubmit: ({ pubKey }: { pubKey: string }) => void;
}) => {
  const [pubKey, setPubKey] = useState("");

  useEffect(() => {
    if (pubKey) {
      onSubmit({ pubKey });
    }
  }, [pubKey, onSubmit]);

  return (
    <div className="form">
      <form className="form__form">
        <label htmlFor="pubKey" className="form__label">
          pubkey
        </label>

        <input
          disabled={process.env.REACT_APP_MAINTENANCE === "true"}
          className="form__input"
          id="pubKey"
          placeholder="pubKey"
          value={pubKey}
          onChange={(e) => {
            setPubKey(e.target.value);
          }}
          type="text"
        />
      </form>

      {window.webln ? (
        <div className="form__webln-button-wrap">
          <GetPubKeyFromExtensionButton setPubKey={setPubKey} />
        </div>
      ) : null}
    </div>
  );
};

export default Form;
