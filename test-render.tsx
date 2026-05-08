import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import { DayPage } from './src/pages/DayPage';
import { useAppStore } from './src/store/appStore';

try {
  useAppStore.setState({
    taskResponses: {},
    taskCompletions: {},
    dayCompletions: {},
  });

  const html = renderToString(
    React.createElement(MemoryRouter, { initialEntries: ['/day/10'] },
      React.createElement(Routes, null,
        React.createElement(Route, { path: "/day/:dayNumber", element: React.createElement(DayPage) })
      )
    )
  );

  console.log("RENDER SUCCESS!");
} catch (e) {
  console.error("RENDER ERROR:", e);
}
