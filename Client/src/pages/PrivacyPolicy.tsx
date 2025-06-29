import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto my-20 px-4 py-12 text-neutral-800 dark:text-neutral-200">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        We respect your privacy. This app is in development and does not store or share personal information beyond what's needed to test functionality.
      </p>
      <p className="mb-4">
        Twitter profile information (like username and avatar) may be temporarily used for login purposes.
      </p>
      <p className="mb-4">
        We do not share your data with third parties. This may change in production with updated policies.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
