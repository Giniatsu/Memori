import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";

const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check for PWA installation status on component mount
    // This is a client-side addition for user experience

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setIsInstalled(outcome === "accepted");
      setDeferredPrompt(null);
    }
  };

return (
    <button
        disabled={isInstalled || !deferredPrompt}
        onClick={handleClick}
        className={`${styles['pwa-button']} mt-4`} // Add a custom class for styling
    >
        <span className="pwa-button-text">{"Install PWA"}</span>
    </button>
);
};

export default InstallPWAButton;