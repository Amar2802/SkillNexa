import SkillNexaLogo from "../SkillNexaLogo";
import SectionLoader from "./SectionLoader";

const LoadingScreen = ({ title = "Checking your session...", subtitle = "Preparing your protected workspace" }) => (
  <div className="app-shell app-shell-auth">
    <div className="snx-page-loader-wrap">
      <SkillNexaLogo imageClassName="snx-brand-logo-image snx-brand-logo-loader" />
      <SectionLoader title={title} subtitle={subtitle} />
    </div>
  </div>
);

export default LoadingScreen;
