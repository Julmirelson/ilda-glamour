import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-2.5 px-3 text-center border-t border-dark-outline-variant/15 mt-2">
      <p className="text-[11px] text-dark-on-surface-variant/60 font-label">
        © {new Date().getFullYear()} Ilda Glamour · Reservado para{' '}
        <a
          href="https://wikisolutions.pro"
          target="_blank"
          rel="noreferrer"
          className="text-accent hover:underline font-medium"
        >
          wikisolutions.pro
        </a>
      </p>
    </footer>
  );
};
