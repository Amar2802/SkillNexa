import { useState } from "react";
import { FiShare2, FiCopy, FiCheck, FiExternalLink, FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { useToast } from "../ui/ToastProvider";

export const ShareProfileModal = ({
  isOpen,
  onClose,
  profile
}) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const publicUrl = profile?._id
    ? `${window.location.origin}/p/${profile._id}`
    : window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    showToast("Public profile link copied to clipboard.", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      title={
        <div className="flex items-center gap-2">
          <FiShare2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-base font-bold text-slate-900 dark:text-white">
            Share Developer Profile
          </span>
        </div>
      }
      footer={
        <div className="flex items-center justify-end w-full">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          Anyone with this link can view your public accomplishments, verified skills, and problem counts. Your email, private mock mistakes, and account details remain strictly confidential.
        </p>

        {/* Public Link Box */}
        <div className="flex items-center gap-2 p-2 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800">
          <input
            type="text"
            readOnly
            value={publicUrl}
            className="flex-1 bg-transparent px-2 text-xs font-mono text-slate-700 dark:text-slate-300 outline-none truncate"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleCopyLink}
            className="!h-7 !px-3 shrink-0 inline-flex items-center gap-1"
          >
            {copied ? (
              <>
                <FiCheck className="h-3.5 w-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <FiCopy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </Button>
        </div>

        {/* Preview Link */}
        <div className="pt-2 text-center">
          <Link
            to={`/p/${profile?._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400 inline-flex items-center gap-1.5"
          >
            <FiEye className="h-3.5 w-3.5" />
            <span>Open Public Profile Preview</span>
            <FiExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default ShareProfileModal;
