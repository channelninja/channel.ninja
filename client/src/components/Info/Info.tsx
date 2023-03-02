import './info.css';

const Info = ({
  onMouseEnter,
  onMouseLeave,
  onClick,
}: {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
}) => {
  return (
    <span
      className="info"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      i
    </span>
  );
};

export default Info;
