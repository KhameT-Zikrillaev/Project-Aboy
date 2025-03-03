import React from 'react';
import { Outlet } from 'react-router-dom';

export default function Admin() {
  return (
    <div>
      <Outlet /> {/* Здесь будут отображаться вложенные страницы */}
    </div>
  );
}