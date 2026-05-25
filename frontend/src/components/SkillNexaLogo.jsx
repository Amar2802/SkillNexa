const LOGO_SRC = "/skillnexa-logo.png";

const SkillNexaLogo = ({
  className = "",
  imageClassName = "snx-brand-logo-image",
  showTagline = false,
  linkTo = ""
}) => {
  const content = (
    <div className={`snx-brand-lockup ${className}`.trim()}>
      <div className="snx-brand-logo-surface">
        <img src={LOGO_SRC} alt="SkillNexa - AI Interview Platform" className={imageClassName} />
      </div>
      {showTagline ? <span className="snx-brand-tagline">AI Interview Platform</span> : null}
    </div>
  );

  if (linkTo) {
    return (
      <a href={linkTo} className="snx-brand-link text-decoration-none">
        {content}
      </a>
    );
  }

  return content;
};

export const LOGO_PATH = LOGO_SRC;
export default SkillNexaLogo;
