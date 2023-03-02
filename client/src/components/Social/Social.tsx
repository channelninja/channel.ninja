import './social.css';

const Social = () => {
  return (
    <div className="social">
      <div className="social__item">
        <a
          className="social__link"
          href="https://twitter.com/channel_ninja21"
          target="_blank"
          rel="noreferrer"
        >
          <img
            className="social__image social__image--twitter"
            src="/twitter-logo-white.png"
            alt="twitter logo"
          />
        </a>
      </div>

      <div className="social__item">
        <a
          className="social__link"
          href="https://github.com/channelninja/channel.ninja"
          target="_blank"
          rel="noreferrer"
        >
          <img
            className="social__image"
            src="/github-mark-white.svg"
            alt="github logo"
          />
        </a>
      </div>
    </div>
  );
};

export default Social;
