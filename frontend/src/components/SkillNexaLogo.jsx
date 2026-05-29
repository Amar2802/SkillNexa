import { Link } from "react-router-dom";

const LOGO_SRC = "/skillnexa-logo.png";

const LogoMark = ({ imageClassName = "h-9 w-9 rounded-2xl object-cover" }) => (
  <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 shadow-[0_18px_36px_rgba(15,23,42,0.12)] ring-1 ring-white/70">
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500/20 via-accent-500/10 to-slate-950/10" />
    <img src={LOGO_SRC} alt="SkillNexa logo" className={`${imageClassName} relative z-10`} />
  </div>
);

const LogoContent = ({ className = "", imageClassName, showTagline = false }) => (
  <div className={`flex items-center gap-3 ${className}`.trim()}>
    <LogoMark imageClassName={imageClassName} />
    <div className="min-w-0">
      <div className="truncate text-lg font-semibold tracking-tight text-slate-custom-900 dark:text-white">
        SkillNexa
      </div>
      {showTagline ? (
        <div className="truncate text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          AI Interview Platform
        </div>
      ) : null}
    </div>
  </div>
);

const SkillNexaLogo = ({ className = "", imageClassName, showTagline = false, linkTo = "" }) => {
  const content = <LogoContent className={className} showTagline={showTagline} imageClassName={imageClassName} />;

  if (linkTo) {
    return <Link to={linkTo}>{content}</Link>;
  }

  return content;
};

export const LOGO_PATH = LOGO_SRC;
export default SkillNexaLogo;
