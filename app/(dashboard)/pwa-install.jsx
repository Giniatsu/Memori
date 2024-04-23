"use client";
import * as Reactfrom from "react";
import { useRef, useEffect, useState } from "react";
import styles from "./styles.module.css";

/*  dependencies:
    "@khmyznikov/pwa-install": "*",
    "@lit": "*"
*/
import "@khmyznikov/pwa-install";
import PWAInstall from "@khmyznikov/pwa-install/dist/pwa-install.react.js";
import InstallPWAButton from "./InstallPWAButton";

/*
  manifestUrl = '/manifest.json',
  icon = '',
  name = 'React App',
  description = '',
  installDescription = '',
  disableDescription = false,
  disableScreenshots = false,
  manualApple = false,
  manualChrome = false,
  disableChrome = false,
*/

const PWAInstallComponent = ({
  onInstallSuccess,
  onInstallFail,
  onUserChoiceResult,
  onInstallAvailable,
  onInstallHowTo,
  onInstallGallery,
  ...props
}) => {
  const pwaInstallRef = useRef(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showCustomButton, setShowCustomButton] = useState(true);

  // Filter out null or undefined props
  const nonNullProps = Object.fromEntries(
    Object.entries(props).filter(([_, value]) => value != null)
  );

  useEffect(() => {
    const currentElement = pwaInstallRef.current;
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setShowCustomButton(false);
    };
    const handleInstallSuccess = (event) => {
      onInstallSuccess?.(event);
      setShowCustomButton(true);
    };
    const handleInstallFail = (event) => onInstallFail?.(event);
    const handleUserChoiceResult = (event) => onUserChoiceResult?.(event);
    const handleInstallAvailable = (event) => onInstallAvailable?.(event);
    const handleInstallHowTo = (event) => onInstallHowTo?.(event);
    const handleInstallGallery = (event) => onInstallGallery?.(event);

    if (currentElement) {
      currentElement.addEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
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
          "beforeinstallprompt",
          handleBeforeInstallPrompt
        );
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
    onInstallSuccess,
    onInstallFail,
    onUserChoiceResult,
    onInstallAvailable,
    onInstallHowTo,
    onInstallGallery,
  ]);

  return (
    <>
      <PWAInstall ref={pwaInstallRef} {...nonNullProps} />
      {/* Original button for triggering showDialog - Displayed first */}
      <button
        onClick={() => pwaInstallRef.current.showDialog(true)}
        className={`${styles["pwa-button"]} mt-4`}
      >
        <span className="pwa-button-text">{"Install App"}</span>
      </button>

      {showCustomButton && <InstallPWAButton />}
    </>
  );
};

export default PWAInstallComponent;
