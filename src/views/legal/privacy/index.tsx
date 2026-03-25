"use client";

/**
 * PrivacyView Component
 * Privacy policy page
 */

import React from "react";
import { LegalLayout } from "../components/legal-layout";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";

export function PrivacyView(): React.JSX.Element {
  const { language } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);

  return (
    <LegalLayout 
      title={t("legal.privacyTitle")} 
      lastUpdated={t("legal.privacyDate")}
    >
      <div className="space-y-6">
        <section>
          <h2>{t("legal.privacy.section1Title")}</h2>
          <p>{t("legal.privacy.section1Intro")}</p>
          <p>{t("legal.privacy.section1Subtitle")}</p>
          <ul>
            <li><strong>{t("legal.privacy.section1List.0").split(": ")[0]}:</strong> {t("legal.privacy.section1List.0").split(": ")[1]}</li>
            <li><strong>{t("legal.privacy.section1List.1").split(": ")[0]}:</strong> {t("legal.privacy.section1List.1").split(": ")[1]}</li>
            <li><strong>{t("legal.privacy.section1List.2").split(": ")[0]}:</strong> {t("legal.privacy.section1List.2").split(": ")[1]}</li>
            <li><strong>{t("legal.privacy.section1List.3").split(": ")[0]}:</strong> {t("legal.privacy.section1List.3").split(": ")[1]}</li>
          </ul>
        </section>

        <section>
          <h2>{t("legal.privacy.section2Title")}</h2>
          <p>{t("legal.privacy.section2Intro")}</p>
          <ul>
            <li>{t("legal.privacy.section2List.0")}</li>
            <li>{t("legal.privacy.section2List.1")}</li>
            <li>{t("legal.privacy.section2List.2")}</li>
            <li>{t("legal.privacy.section2List.3")}</li>
            <li>{t("legal.privacy.section2List.4")}</li>
          </ul>
        </section>

        <section>
          <h2>{t("legal.privacy.section3Title")}</h2>
          <p>{t("legal.privacy.section3Intro")}</p>
          <ul>
            <li>{t("legal.privacy.section3List.0")}</li>
            <li>{t("legal.privacy.section3List.1")}</li>
            <li>{t("legal.privacy.section3List.2")}</li>
            <li>{t("legal.privacy.section3List.3")}</li>
            <li>{t("legal.privacy.section3List.4")}</li>
          </ul>
        </section>

        <section>
          <h2>{t("legal.privacy.section4Title")}</h2>
          <p>{t("legal.privacy.section4Intro")}</p>
          <ul>
            <li>{t("legal.privacy.section4List.0")}</li>
            <li>{t("legal.privacy.section4List.1")}</li>
            <li>{t("legal.privacy.section4List.2")}</li>
            <li>{t("legal.privacy.section4List.3")}</li>
          </ul>
        </section>

        <section>
          <h2>{t("legal.privacy.section5Title")}</h2>
          <p>{t("legal.privacy.section5Intro")}</p>
          <ul>
            <li>{t("legal.privacy.section5List.0")}</li>
            <li>{t("legal.privacy.section5List.1")}</li>
            <li>{t("legal.privacy.section5List.2")}</li>
            <li>{t("legal.privacy.section5List.3")}</li>
            <li>{t("legal.privacy.section5List.4")}</li>
            <li>{t("legal.privacy.section5List.5")}</li>
          </ul>
        </section>

        <section>
          <h2>{t("legal.privacy.section6Title")}</h2>
          <p>{t("legal.privacy.section6Text")}</p>
        </section>

        <section>
          <h2>{t("legal.privacy.section7Title")}</h2>
          <p>{t("legal.privacy.section7Text")}</p>
        </section>

        <section>
          <h2>{t("legal.privacy.section8Title")}</h2>
          <p>{t("legal.privacy.section8Text")}</p>
        </section>

        <section>
          <h2>{t("legal.privacy.section9Title")}</h2>
          <p>{t("legal.privacy.section9Text")}</p>
          <p>
            <strong>{t("legal.contactEmail")}</strong> privacy@wardia.app<br />
            <strong>{t("legal.contactAddress")}</strong> {t("legal.privacy.contactInfo")}
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
