"use client";

/**
 * TermsView Component
 * Terms and conditions page
 */

import React from "react";
import { LegalLayout } from "../components/legal-layout";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";

export function TermsView(): React.JSX.Element {
  const { language } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);

  return (
    <LegalLayout 
      title={t("legal.termsTitle")} 
      lastUpdated={t("legal.termsDate")}
    >
      <div className="space-y-6">
        <section>
          <h2>{t("legal.terms.section1Title")}</h2>
          <p>{t("legal.terms.section1Text")}</p>
        </section>

        <section>
          <h2>{t("legal.terms.section2Title")}</h2>
          <p>{t("legal.terms.section2Intro")}</p>
          <ul>
            <li>{t("legal.terms.section2List.0")}</li>
            <li>{t("legal.terms.section2List.1")}</li>
            <li>{t("legal.terms.section2List.2")}</li>
            <li>{t("legal.terms.section2List.3")}</li>
            <li>{t("legal.terms.section2List.4")}</li>
          </ul>
        </section>

        <section>
          <h2>{t("legal.terms.section3Title")}</h2>
          <p>{t("legal.terms.section3Intro")}</p>
          <ul>
            <li>{t("legal.terms.section3List.0")}</li>
            <li>{t("legal.terms.section3List.1")}</li>
            <li>{t("legal.terms.section3List.2")}</li>
            <li>{t("legal.terms.section3List.3")}</li>
          </ul>
        </section>

        <section>
          <h2>{t("legal.terms.section4Title")}</h2>
          <p>{t("legal.terms.section4Intro")}</p>
          <ul>
            <li>{t("legal.terms.section4List.0")}</li>
            <li>{t("legal.terms.section4List.1")}</li>
            <li>{t("legal.terms.section4List.2")}</li>
            <li>{t("legal.terms.section4List.3")}</li>
            <li>{t("legal.terms.section4List.4")}</li>
            <li>{t("legal.terms.section4List.5")}</li>
          </ul>
        </section>

        <section>
          <h2>{t("legal.terms.section5Title")}</h2>
          <p>{t("legal.terms.section5Intro")}</p>
          <ul>
            <li>{t("legal.terms.section5List.0")}</li>
            <li>{t("legal.terms.section5List.1")}</li>
            <li>{t("legal.terms.section5List.2")}</li>
            <li>{t("legal.terms.section5List.3")}</li>
          </ul>
        </section>

        <section>
          <h2>{t("legal.terms.section6Title")}</h2>
          <p>{t("legal.terms.section6Text")}</p>
        </section>

        <section>
          <h2>{t("legal.terms.section7Title")}</h2>
          <p>{t("legal.terms.section7Intro")}</p>
          <ul>
            <li>{t("legal.terms.section7List.0")}</li>
            <li>{t("legal.terms.section7List.1")}</li>
            <li>{t("legal.terms.section7List.2")}</li>
            <li>{t("legal.terms.section7List.3")}</li>
            <li>{t("legal.terms.section7List.4")}</li>
          </ul>
        </section>

        <section>
          <h2>{t("legal.terms.section8Title")}</h2>
          <p>{t("legal.terms.section8Text")}</p>
        </section>

        <section>
          <h2>{t("legal.terms.section9Title")}</h2>
          <p>{t("legal.terms.section9Intro")}</p>
          <ul>
            <li>{t("legal.terms.section9List.0")}</li>
            <li>{t("legal.terms.section9List.1")}</li>
            <li>{t("legal.terms.section9List.2")}</li>
          </ul>
          <p>{t("legal.terms.section9Text")}</p>
        </section>

        <section>
          <h2>{t("legal.terms.section10Title")}</h2>
          <p>{t("legal.terms.section10Text")}</p>
        </section>

        <section>
          <h2>{t("legal.terms.section11Title")}</h2>
          <p>{t("legal.terms.section11Text")}</p>
        </section>

        <section>
          <h2>{t("legal.terms.section12Title")}</h2>
          <p>{t("legal.terms.section12Text")}</p>
          <p>
            <strong>{t("legal.contactEmail")}</strong> legal@wardia.app<br />
            <strong>{t("legal.contactAddress")}</strong> {t("legal.terms.contactInfo")}
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
