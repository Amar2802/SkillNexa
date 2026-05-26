import { Link, Outlet } from "react-router-dom";
import { FiArrowRight, FiCompass, FiCpu, FiLayers, FiSearch } from "react-icons/fi";
import SkillNexaLogo from "../components/SkillNexaLogo";

const navItems = [
  { label: "Home", href: "#hero", icon: FiCompass },
  { label: "Explore", href: "#features", icon: FiSearch },
  { label: "Mock Interviews", href: "#capabilities", icon: FiCpu },
  { label: "About", href: "#about", icon: FiLayers }
];

const AuthLayout = () => (
  <div className="snx-app-shell min-h-screen pb-10">
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/90 backdrop-blur-2xl shadow-sm">
      <div className="snx-container flex flex-wrap items-center justify-between gap-4 py-3">
        <SkillNexaLogo showTagline linkTo="/login" />
        <nav className="hidden items-center gap-5 lg:flex">
          {navItems.map(({ label, href, icon: Icon }) => (
            <a key={label} href={href} className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950">
              <Icon className="h-4 w-4 text-brand-500 transition group-hover:translate-x-0.5" />
              <span>{label}</span>
            </a>
          ))}
        </nav>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/login" className="snx-btn-secondary">
            Login
          </Link>
          <Link to="/signup" className="snx-btn-accent">
            Get Started
            <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>

    <main className="snx-container pt-8 md:pt-12">
      <Outlet />
    </main>
  </div>
);

export default AuthLayout;
