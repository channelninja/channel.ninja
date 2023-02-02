import { useEffect, useState } from "react";
import { selectIsMaintenanceMode } from "../../redux/global-slice";
import { useAppSelector } from "../../redux/hooks";
import GetPubKeyFromExtensionButton from "../WebLN";
import "./form.css";

const Form = ({
  onSubmit,
}: {
  onSubmit: ({ pubKey }: { pubKey: string }) => void;
}) => {
  const [pubKey, setPubKey] = useState("");
  const isMaintenanceMode = useAppSelector(selectIsMaintenanceMode);

  useEffect(() => {
    if (pubKey) {
      onSubmit({ pubKey });
    }
  }, [pubKey, onSubmit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPubKey(e.target.value);
  };

  return (
    <div className="form">
      <form className="form__form">
        <label htmlFor="pubKey" className="form__label">
          pubkey
        </label>

        <input
          disabled={isMaintenanceMode}
          className="form__input"
          id="pubKey"
          placeholder="pubKey"
          value={pubKey}
          onChange={handleInputChange}
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
