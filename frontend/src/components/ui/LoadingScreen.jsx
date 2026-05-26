import SectionLoader from "./SectionLoader";

const LoadingScreen = ({ title = "Checking your session...", subtitle = "Preparing your protected workspace" }) => (
  <div className="snx-app-shell flex min-h-screen items-center justify-center px-4">
    <SectionLoader title={title} subtitle={subtitle} showLogo />
  </div>
);

export default LoadingScreen;
