import { useEffect, useState } from "react";
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
    <form className="form">
      <label htmlFor="pubKey" className="form__label">
        pubkey
      </label>

      <input
        disabled={process.env.REACT_APP_MAINTENANCE === "true"}
        className="form__input"
        id="pubKey"
        placeholder="pubKey"
        onChange={(e) => {
          setPubKey(e.target.value);
        }}
        type="text"
      />
    </form>
  );
};

export default Form;
