import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/ui/PageHeader";
import {
  SettingsNav,
  AccountSettingsSection,
  PreferencesSettingsSection,
  AppearanceSettingsSection,
  NotificationSettingsSection,
  SecuritySettingsSection,
  PrivacySettingsSection,
  ConnectedAccountsSection,
  DangerZoneSection
} from "../components/settings";

export const SettingsPage = ({ refreshProfile }) => {
  const { user, profile, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentUser = profile || user;
  const currentTab = searchParams.get("tab") || "account";

  const handleSelectTab = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  const activeSection = useMemo(() => {
    switch (currentTab) {
      case "preferences":
        return <PreferencesSettingsSection user={currentUser} refreshProfile={refreshProfile} />;
      case "appearance":
        return <AppearanceSettingsSection user={currentUser} refreshProfile={refreshProfile} />;
      case "notifications":
        return <NotificationSettingsSection user={currentUser} refreshProfile={refreshProfile} />;
      case "security":
        return <SecuritySettingsSection user={currentUser} logout={logout} />;
      case "privacy":
        return <PrivacySettingsSection user={currentUser} refreshProfile={refreshProfile} />;
      case "connected":
        return <ConnectedAccountsSection user={currentUser} />;
      case "danger":
        return <DangerZoneSection user={currentUser} logout={logout} />;
      case "account":
      default:
        return <AccountSettingsSection user={currentUser} refreshProfile={refreshProfile} />;
    }
  }, [currentTab, currentUser, refreshProfile, logout]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <PageHeader
        title="Settings & Account"
        subtitle="Manage your profile information, preparation goals, security credentials, and interface options."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Settings" }
        ]}
      />

      {/* Main Settings Split View */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left Navigation */}
        <SettingsNav activeTab={currentTab} onSelectTab={handleSelectTab} />

        {/* Right Content Panel */}
        <div className="flex-1 w-full min-w-0">
          <div className="min-h-[460px]">
            {activeSection}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
