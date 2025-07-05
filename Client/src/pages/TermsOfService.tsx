// src/pages/TermsOfService.tsx
import React, { useState } from 'react';
import { FaRegCopy } from 'react-icons/fa6';

const TermsOfService: React.FC = () => {

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('diwanshu63019@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // Hide after 1.5 sec
  };

  return (
    <div className="max-w-3xl mx-auto my-20 px-4 py-12 text-neutral-800 dark:text-neutral-200">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="mb-4">
        Welcome to our app. These Terms of Service govern your use of the app. By using our app, you agree to comply with these terms.
      </p>
      <p className="mb-4">
        This app is currently under development and provided for testing purposes only. We reserve the right to modify or remove access at any time.
      </p>
      <p className="mb-4 flex gap-1">
        If you have any questions, feel free to contact us. <a href='mailto:diwanshu63019@gmail.com' target='_blank' className='underline text-neutral-700 dark:text-neutral-300'>diwanshu63019@gmail.com</a>
        <button className='cursor-pointer relative group' onClick={handleCopy}>
          <FaRegCopy size={18} />
          <span className='group-hover:visible invisible bg-black text-white p-2 rounded-lg absolute -top-10 -right-5 text-sm'>Copy</span>
          {copied && (
            <span className='bg-black text-white p-2 rounded-lg absolute -top-10 -right-5 text-sm'>Copied</span>
          )}
        </button>
      </p>
    </div>
  );
};

export default TermsOfService;
