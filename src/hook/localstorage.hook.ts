// import { useSetIsNavbarCollapsed } from '@/hook/localstorage.hook';
import { useEffect, useState } from 'react';
const useInitLocalStorage = (): void => {
  if (typeof localStorage === 'undefined') return;
  const isNavbarCollapsed = localStorage.getItem('isNavbarCollapsed');
  if (isNavbarCollapsed === null) {
    localStorage.setItem('isNavbarCollapsed', 'true');
  }
};

const useSetToggleCollapsed = (isCollapsed: boolean): void => {
  localStorage.setItem('isNavbarCollapsed', isCollapsed.toString());
};

const useGetIsCollapsed = (): string | null => {
  const isNavbarCollapsed = localStorage.getItem('isNavbarCollapsed');
  return isNavbarCollapsed;
};

const useSetIsNavbarCollapsed = (): [boolean, () => void] => {
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState<boolean>(() => {
    if (typeof localStorage === 'undefined') return true;
    const value = localStorage.getItem('isNavbarCollapsed');
    if (value === null) {
      localStorage.setItem('isNavbarCollapsed', 'true');
      return true;
    }
    return value === 'true';
  });

  useEffect(() => {
    if (typeof localStorage === 'undefined') return;
    const value = localStorage.getItem('isNavbarCollapsed');
    if (value === null) {
      localStorage.setItem('isNavbarCollapsed', 'true');
      setIsNavbarCollapsed(true);
    } else {
      setIsNavbarCollapsed(value === 'true');
    }
  }, []);

  // Toggle function for sidebar: close if open, open if closed
  const toggleIsCollapsed = () => {
    const newValue = !isNavbarCollapsed;
    localStorage.setItem('isNavbarCollapsed', newValue.toString());
    setIsNavbarCollapsed(newValue);
  };

  return [isNavbarCollapsed, toggleIsCollapsed];
};

export { 
  useInitLocalStorage, 
  useSetToggleCollapsed,
  useGetIsCollapsed,
  useSetIsNavbarCollapsed
};