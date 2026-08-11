import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./styles/Menu.module.css";
import { useSearchStore } from "../store/useSearchStore";

// Modificación para soportar submenús con un retraso al ocultarse
export const MenuOption = ({
  isSelected,
  onSelect,
  children,
  subMenu,
  customClass = {},
}) => {
  const [isSubMenuVisible, setIsSubMenuVisible] = useState(false);
  let timeoutId;

  const toggleSubMenu = (visible) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Usamos un pequeño retraso para permitir el clic
    if (visible) {
      setIsSubMenuVisible(true);
    } else {
      timeoutId = setTimeout(() => {
        setIsSubMenuVisible(false);
      }, 300); // 300ms de retraso antes de ocultar el submenú
    }
  };

  const menuOptionClass = `${styles.menuOption} ${isSelected
      ? `${styles.selected} ${customClass.selected || ""}`
      : ""
    } ${customClass.menuOption || ""}`;

  const subMenuOptionClass = `${styles.subMenuOption} ${customClass.subMenuOption || ""
    }`;

  return (
    <div
      className={`${styles.menuOptionWrapper} ${customClass.menuOptionWrapper || ""
        }`}
      onMouseEnter={() => toggleSubMenu(true)}
      onMouseLeave={() => toggleSubMenu(false)}
    >
      <div className={menuOptionClass} onClick={onSelect}>
        {children}
      </div>
      {/* Renderización del submenú si está visible */}
      {subMenu && isSubMenuVisible && (
        <div className={`${styles.subMenu} ${customClass.subMenu || ""}`}>
          {subMenu.map((subOption) => (
            <div
              key={subOption.label}
              className={subMenuOptionClass}
              onClick={subOption.onSelect}
            >
              {subOption.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Mantiene el menú sin alterar los estilos actuales
export const Menu = ({ menu }) => {
  return (
    <div
      className={`${styles.options} ${menu.isVertical ? styles.vertical : ""} ${menu.customClass.menu || ""
        }`}
    >
      {menu.elements}
    </div>
  );
};

// Hook actualizado para soportar submenús y clases personalizadas, incluyendo selected
export const useMenu = (
  options,
  {
    selectedValue: initialSelectedValue = options[0]?.label,

    isVertical = false,
    customClass = {},
  } = {}
) => {
  const clearFormData = useSearchStore(state => state.clearFormData);
  const [selectedValue, setSelectedValue] = useState(initialSelectedValue);
  const [selectedElement, setSelectedElement] = useState(
    options.find((option) => option.label === initialSelectedValue)?.element
  );
  const handleOptionClick = useCallback((value, element, onClick) => {
    clearFormData();
    setSelectedValue(value);
    if (onClick) {
      onClick(); // Ejecutar la función onClick si está definida
    }
    setSelectedElement(element);
  }, [clearFormData]);

  const resetToFirst = () => {
    if (options.length > 0) {
      const firstOption = options[0];
      setSelectedValue(firstOption.label);
      setSelectedElement(firstOption.element);
    }
  };

  const elements = useMemo(() => {
    return options.map((option) => {
      return (
        <MenuOption
          key={option.label}
          isSelected={option.label === selectedValue}
          onSelect={() =>
            handleOptionClick(option.label, option.element, option.onClick)
          }
          subMenu={
            option.children
              ? option.children.map((child) => ({
                  label: child.label,
                  onSelect: () =>
                    handleOptionClick(child.label, child.element, child.onClick),
                }))
              : null
          }
          customClass={customClass}
        >
          {option.label}
        </MenuOption>
      );
    });
  }, [options, selectedValue, customClass, handleOptionClick]);

  return {
    elements,
    element: selectedElement,
    isVertical,
    customClass,
    resetToFirst,
  };
};
