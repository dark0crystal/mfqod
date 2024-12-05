'use client'

import { useState } from 'react';

export default function Home() {
  // State to manage the organization selection
  const [organization, setOrganization] = useState('');
  // State to manage the title input
  const [title, setTitle] = useState('');
  // State to manage the dynamic dropdown (depending on SQU or UTAS)
  const [squOption, setSquOption] = useState('');
  const [utasOption, setUtasOption] = useState('');

  // Handler for organization dropdown change
  const handleOrganizationChange = (e) => {
    setOrganization(e.target.value);
    // Reset dynamic dropdown values when organization changes
    setSquOption('');
    setUtasOption('');
  };

  // Handle the title input change
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // Handler for dynamic dropdown for SQU or UTAS
  const handleSquOptionChange = (e) => {
    setSquOption(e.target.value);
  };

  const handleUtasOptionChange = (e) => {
    setUtasOption(e.target.value);
  };

  // Submit handler (example, you can add more functionality here)
  const handleSubmit = (e) => {
    e.preventDefault();
    // You can now process the form data here, e.g., send to an API
    console.log({ title, organization, squOption, utasOption });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Dynamic Form Example</h2>

      <form onSubmit={handleSubmit}>
        {/* Title Input */}
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={handleTitleChange}
          required
        />
        <br /><br />

        {/* Organization Dropdown */}
        <label htmlFor="organization">Select Organization:</label>
        <select
          id="organization"
          name="organization"
          value={organization}
          onChange={handleOrganizationChange}
          required
        >
          <option value="" disabled selected>Select an option</option>
          <option value="SQU">SQU</option>
          <option value="UTAS">UTAS</option>
        </select>
        <br /><br />

        {/* Dynamic Dropdown for SQU */}
        {organization === 'SQU' && (
          <>
            <label htmlFor="squOptions">Select Option for SQU:</label>
            <select
              id="squOptions"
              name="squOptions"
              value={squOption}
              onChange={handleSquOptionChange}
              required
            >
              <option value="">Select an option</option>
              <option value="SQU Library">SQU Library</option>
              <option value="SQU Missing">SQU Missing</option>
            </select>
            <br /><br />
          </>
        )}

        {/* Dynamic Dropdown for UTAS */}
        {organization === 'UTAS' && (
          <>
            <label htmlFor="utasOptions">Select Option for UTAS:</label>
            <select
              id="utasOptions"
              name="utasOptions"
              value={utasOption}
              onChange={handleUtasOptionChange}
              required
            >
              <option value="">Select an option</option>
              <option value="UTAS Option 1">UTAS Option 1</option>
              <option value="UTAS Option 2">UTAS Option 2</option>
            </select>
            <br /><br />
          </>
        )}

        {/* Submit Button */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
