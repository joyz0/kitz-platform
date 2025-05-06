'use client';

import { useRef } from 'react';
import './example1.css';

export default function Example() {
  return (
    <section className="example1">
      <h1>Boost your productivity with AI</h1>
      <p>
        <strong>Things to consider</strong>
      </p>
      <ul>
        <li>
          These features are experimental. They use generative AI and may
          provide inaccurate or offensive information that doesn’t represent
          Google’s views.
        </li>
        <li>
          These features send relevant data to Google. Google collects this data
          and feedback to improve its products and services with the help of
          human reviewers. Avoid sharing sensitive or personal information.
        </li>
        <li>
          Usage data will be retained for up to 18 months and stored in such a
          way that Google can’t tell who provided it.
        </li>
        <li>
          Depending on your Google account management and/or region, Google may
          refrain from data collection. Depending on your organization’s
          settings, features available to managed users may vary.
        </li>
        <li>
          Use of these features is subject to the{' '}
          <a href="https://policies.google.com/terms">
            Google Terms of Service
          </a>{' '}
          and{' '}
          <a href="https://policies.google.com/privacy">
            Google Privacy Policy
          </a>
          .
        </li>
      </ul>
    </section>
  );
}
