import React, { useState, useEffect, useRef } from "react";
import styles from "./styles.module.css";
import "@khmyznikov/pwa-install";
import PWAInstall from "@khmyznikov/pwa-install/dist/pwa-install.react.js";

const EnhancedPWAInstall = ({
  onInstallSuccess,
  onInstallFail,
  onUserChoiceResult,
  onInstallAvailable,
  onInstallHowTo,
  onInstallGallery,
  ...props
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const pwaInstallRef = useRef(null);

  // Filter out null or undefined props
  const nonNullProps = Object.fromEntries(
    Object.entries(props).filter(([_, value]) => value != null)
  );

  // Handle the standard 'beforeinstallprompt' event
  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  // Handle events from the 'PWAInstall' component
  useEffect(() => {
    const currentElement = pwaInstallRef.current;
    const handleInstallSuccess = (event) => onInstallSuccess?.(event);
    const handleInstallFail = (event) => onInstallFail?.(event);
    const handleUserChoiceResult = (event) => onUserChoiceResult?.(event);
    const handleInstallAvailable = (event) => onInstallAvailable?.(event);
    const handleInstallHowTo = (event) => onInstallHowTo?.(event);
    const handleInstallGallery = (event) => onInstallGallery?.(event);
    if (currentElement) {
      currentElement.addEventListener(
        "pwa-install-success-event",
        handleInstallSuccess
      );
      currentElement.addEventListener(
        "pwa-install-fail-event",
        handleInstallFail
      );
      currentElement.addEventListener(
        "pwa-user-choice-result-event",
        handleUserChoiceResult
      );
      currentElement.addEventListener(
        "pwa-install-available-event",
        handleInstallAvailable
      );
      currentElement.addEventListener(
        "pwa-install-how-to-event",
        handleInstallHowTo
      );
      currentElement.addEventListener(
        "pwa-install-gallery-event",
        handleInstallGallery
      );

      return () => {
        currentElement.removeEventListener(
          "pwa-install-success-event",
          handleInstallSuccess
        );
        currentElement.removeEventListener(
          "pwa-install-fail-event",
          handleInstallFail
        );
        currentElement.removeEventListener(
          "pwa-user-choice-result-event",
          handleUserChoiceResult
        );
        currentElement.removeEventListener(
          "pwa-install-available-event",
          handleInstallAvailable
        );
        currentElement.removeEventListener(
          "pwa-install-how-to-event",
          handleInstallHowTo
        );
        currentElement.removeEventListener(
          "pwa-install-gallery-event",
          handleInstallGallery
        );
      };
    }
  }, [
    onInstallAvailable,
    onInstallFail,
    onInstallGallery,
    onInstallHowTo,
    onInstallSuccess,
    onUserChoiceResult,
  ]);
  // Show custom button if deferredPrompt, else fallback to PWAInstall behavior
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setIsInstalled(outcome === "accepted");
      setDeferredPrompt(null);
    } else if (pwaInstallRef.current) {
      pwaInstallRef.current.showDialog(true);
    }
  };
  return (
    <>
      <PWAInstall ref={pwaInstallRef} {...nonNullProps} />
      <button
        disabled={isInstalled} // Only if deferredPrompt is null
        onClick={handleInstallClick}
        className={`${styles["pwa-button"]} mt-4`}
      >
        <span className="pwa-button-text">Install App</span>
      </button>
    </>
  );
};

export default EnhancedPWAInstall;
