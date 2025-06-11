import React from 'react';
import { useDarkMode } from './hooks/useDarkMode';
import useRevealAnimations from './hooks/useRevealAnimations';
import RouteTransition from './components/RouteTransition';
import './trainings.css';

/* ──────────────────────────────────────────────────────────
   DOWNLOADABLE DOCUMENTS  (in /public/docs or /src/docs)
────────────────────────────────────────────────────────── */
import doddPdf            from './docs/DODD-Homemaker-Personal-Care.pdf';
import nursingVisitPdf    from './docs/Nursing-Visit-Verification-Form.pdf';
import medicaidPdf        from './docs/Medicaid-Patient-Form.pdf';
import passportPdf        from './docs/Passport-Patient-Form.pdf';
import incidentReportPdf  from './docs/GAHA-Incident-Report.pdf';

/* ──────────────────────────────────────────────────────────
   MONTHLY TRAINING LINKS
   (RN / LPN / Nursing  •  Home-Health Aide)
────────────────────────────────────────────────────────── */
const nursingTrainings = [
  { month: 'January',   link: 'https://forms.office.com/r/BjGLau5FM9' },
  { month: 'February',  link: 'https://forms.office.com/r/MhH9cUjVQe' },
  { month: 'March',     link: 'https://forms.office.com/r/HT5gS5JRE0' },
  { month: 'April',     link: 'https://forms.office.com/r/11DUGNYzrf' },
  { month: 'May',       link: 'https://forms.office.com/r/53nRKshVL5' },
  { month: 'June',      link: 'https://forms.office.com/r/iaM6iSmfRG' },
  { month: 'July',      link: 'https://forms.office.com/r/4aNPpkUiiA' },
  { month: 'August',    link: 'https://forms.office.com/r/X1rRN7CMjB' },
  { month: 'September', link: 'https://forms.office.com/r/Fyianwjdij' },
  { month: 'October',   link: 'https://forms.office.com/r/Bqsj3VNypz' },
  { month: 'November',  link: 'https://forms.office.com/r/1GFs5AWsR0' },
  { month: 'December',  link: 'https://forms.office.com/r/XmL8EWB9Ku' },
];

const hhaTrainings = [
  { month: 'January',   link: 'https://forms.office.com/r/BjGLau5FM9' },
  { month: 'February',  link: 'https://forms.office.com/r/MhH9cUjVQe' },
  { month: 'March',     link: 'https://forms.office.com/r/HT5gS5JRE0' },
  { month: 'April',     link: 'https://forms.office.com/r/11DUGNYzrf' },
  { month: 'May',       link: 'https://forms.office.com/r/53nRKshVL5' },
  { month: 'June',      link: 'https://forms.office.com/r/iaM6iSmfRG' },
  { month: 'July',      link: 'https://forms.office.com/r/4aNPpkUiiA' },
  { month: 'August',    link: 'https://forms.office.com/r/qgaDXcK54B' },
  { month: 'September', link: 'https://forms.office.com/r/DZ6gUxbimt' },
  { month: 'October',   link: 'https://forms.office.com/r/jAnLPbTtzv' },
  { month: 'November',  link: 'https://forms.office.com/r/UprRYPdBu3' },
  { month: 'December',  link: 'https://forms.office.com/r/XmL8EWB9Ku' },
];

const documents = [
  { name: 'DODD Document',             link: doddPdf },
  { name: 'RN / LPN Visit Document',   link: nursingVisitPdf },
  { name: 'HHA Timesheet Document',    link: medicaidPdf },
  { name: 'Passport Document',         link: passportPdf },
  { name: 'Incident Report Document',  link: incidentReportPdf },
];

/* ────────────────────────────────────────────────────────── */

const Trainings = () => {
  const { darkMode } = useDarkMode();
  useRevealAnimations();

  const currentYear = new Date().getFullYear();

  const renderTrainingGrid = (data) => (
    <div className="training-grid">
      {data.map(({ month, link }) => (
        <div key={month} className="training-item">
          <a
            href={link}
            className="training-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {month}
          </a>
        </div>
      ))}
    </div>
  );

  return (
    <RouteTransition>
      <div className={`trainings ${darkMode ? 'dark-theme' : 'light-theme'}`}>
        {/* ── HERO ────────────────────────────────────────── */}
        <section className="hero">
          <div className="hero-image">
            {/* <img
              src={require('./docs/Images/n0.jpg')}
              alt="Healthcare training session"
              className="hero-bg-image"
            /> */}
          </div>
          <div className="hero-overlay" />
          <div className="hero-content reveal">
            <h1>Training Resources</h1>
            <p className="subtitle">
              Monthly modules and printable documents ({currentYear})
            </p>
          </div>
        </section>

        <div className="container">
          {/* ── NURSING TRAININGS ───────────────────────── */}
          <section className="section">
            <div className="card reveal">
              <h2 className="section-title">Nursing Trainings – {currentYear}</h2>
              <p>Click a month to complete the required RN / LPN module.</p>
              {renderTrainingGrid(nursingTrainings)}
            </div>
          </section>

          {/* ── HOME-HEALTH AIDE TRAININGS ─────────────── */}
          <section className="section surface-2">
            <div className="card reveal">
              <h2 className="section-title">Home-Health Aide Trainings – {currentYear}</h2>
              <p>Click a month to complete your HHA module.</p>
              {renderTrainingGrid(hhaTrainings)}
            </div>
          </section>

          {/* ── PRINTABLE DOCUMENTS ─────────────────────── */}
          <section className="section">
            <div className="card reveal">
              <h2 className="section-title">Printable Documents</h2>
              <div className="document-grid">
                {documents.map(({ name, link }) => (
                  <div key={name} className="document-item">
                    <div className="document-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <a
                      href={link}
                      className="document-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── FUTURE TRAININGS NOTICE ─────────────────── */}
          <section className="section surface-2">
            <div className="card reveal">
              <h2 className="section-title">Looking Ahead</h2>
              <p className="notice-text">
                New material is released in the future.  Check back often
                for fresh content and updated competency modules.
              </p>
            </div>
          </section>
        </div>
      </div>
    </RouteTransition>
  );
};

export default Trainings;

