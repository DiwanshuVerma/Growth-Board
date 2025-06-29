// src/pages/TermsOfService.tsx
import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto my-20 px-4 py-12 text-neutral-800 dark:text-neutral-200">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="mb-4">
        Welcome to our app. These Terms of Service govern your use of the app. By using our app, you agree to comply with these terms.
      </p>
      <p className="mb-4">
        This app is currently under development and provided for testing purposes only. We reserve the right to modify or remove access at any time.
      </p>
      <p className="mb-4">
        If you have any questions, feel free to contact us.
      </p>
    </div>
  );
};

export default TermsOfService;
