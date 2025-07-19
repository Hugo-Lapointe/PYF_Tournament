import React from "react";

export default function Apply() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Apply for the Tournament</h1>
      <div className="aspect-[4/3]">
        <iframe
          src="https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true"
          width="100%"
          height="700"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          title="Tournament Application Form"
          className="w-full h-full"
          allowFullScreen
        >
          Loading…
        </iframe>
      </div>
    </div>
  );
}
