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
  }, [pubKey]);

  return (
    <form className="form">
      <label htmlFor="pubKey" className="form__label">
        pubkey
      </label>

      <input
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
