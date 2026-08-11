import React, { useEffect, useMemo, useState } from 'react'
import { MenuOption } from '../reutilizable/Menu';
import { useEvaluationStore } from '../store/useEvaluationStore';

const useMenu = () => {

    const { selectedDataAcademico, } = useEvaluationStore();

    const useMenuItems = (
      options,
      {
        selectedValue: initialSelectedValue = options[0]?.label,
    
        isVertical = false,
        customClass = {},
      } = {}
    ) => {
      console.warn(initialSelectedValue); // Datos Participante
      console.warn(options); // []
    
      const [selectedValue, setSelectedValue] = useState(initialSelectedValue);
      const [selectedElement, setSelectedElement] = useState(
        options[0]?.element
      );
    
      console.log(selectedDataAcademico);
      useEffect(() => {
        if (options.length > 0) {
          // Solo restablecemos la selección si no hay un valor seleccionado
          setSelectedValue(options[0]?.label);
          setSelectedElement(options[0]?.element);
        }
        // eslint-disable-next-line
      }, [selectedDataAcademico]);
    
    
      const handleOptionClick = (value, element, onClick) => {
        setSelectedValue(value);
        console.log(value);
        if (onClick) {
          onClick(); // Ejecutar la función onClick si está definida
        }
        setSelectedElement(element);
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
      }, [options, selectedValue, customClass]);
    
      return {
        elements,
        element: selectedElement,
        isVertical,
        customClass,
      };
    };
  return {
        useMenuItems,
    };
  
}

export default useMenu
