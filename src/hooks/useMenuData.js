import axios from "axios";
import { useEffect, useState } from "react";
import { ERROR_MESSAGES_GENERICS_API } from "../utils/messagesFromAPI";

/**
 * @typedef {Object} MenuItem
 * @property {number} id - ID único del elemento del menú
 * @property {string} nombreCorto - Nombre corto que se mostrará en el menú
 * @property {number} orden - Orden de aparición del elemento
 * @property {MenuItem[]} [submenus] - Array de submenús (opcional)
 */

/**
 * @typedef {Object} TransformedMenuItem
 * @property {string} label - Etiqueta del elemento del menú
 * @property {React.ReactNode} [element] - Componente React a renderizar
 * @property {TransformedMenuItem[]} [children] - Submenús transformados
 */

/**
 * @typedef {Object} MenuConfig
 * @property {string} selectedValue - Valor seleccionado por defecto
 * @property {boolean} isVertical - Indica si el menú debe ser vertical
 */

/**
 * @typedef {Object} UseMenuDataParams
 * @property {string} apiUrl - URL del endpoint para obtener los datos del menú
 * @property {Object.<string, React.ReactNode>} componentMap - Mapa de componentes donde la clave es el nombreCorto y el valor es el componente React
 * @property {string} [defaultSelectedValue='Instrucciones'] - Valor seleccionado por defecto
 * @property {boolean} [isVertical=false] - Indica si el menú debe ser vertical
 */

/**
 * @typedef {Object} UseMenuDataResult
 * @property {TransformedMenuItem[]} menu - Datos del menú transformados y listos para usar
 * @property {MenuConfig} menuConfig - Configuración del menú
 * @property {boolean} isLoading - Estado de carga de los datos
 * @property {Error|null} error - Error si ocurrió alguno durante la carga
 * @property {MenuItem[]} rawMenuData - Datos crudos del menú sin transformar
 */

/**
 * Custom hook para manejar la carga y transformación de datos del menú.
 *
 * @param {UseMenuDataParams} params - Parámetros de configuración del hook
 * @returns {UseMenuDataResult} Objeto con los datos del menú y su estado
 *
 * @example
 * const { menu, menuConfig, isLoading, error } = useMenuData({
 *   apiUrl: 'https://api.example.com/menus',
 *   componentMap: {
 *     "Evaluación": <Evaluacion />,
 *     "Imprimir acta": <ReporteActa />
 *   },
 *   defaultSelectedValue: 'Evaluación',
 *   isVertical: true
 * });
 *
 * @throws {Error} Si la petición a la API falla
 */

const useMenuData = ({
  apiUrl,
  componentMap = {},
  defaultSelectedValue = "Instrucciones",
  isVertical = false,
}) => {
  const [menuResponse, setMenuResponse] = useState([]);
  const [error, setError] = useState({
    type: null,
    message: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError({
            type: "warning",
            message: "Por favor. Inicié sesión",
          });
          return;
        }

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log(response);

        const sortedMenus = (response.data.menus || [])
          .map((menu) => ({
            ...menu,
            submenus: Array.isArray(menu.submenus)
              ? menu.submenus
                  .map((submenu) => ({
                    ...submenu,
                  }))
                  .sort((a, b) =>
                    a.orden === b.orden ? a.id - b.id : a.orden - b.orden
                  )
              : [],
          }))
          .sort((a, b) =>
            a.orden === b.orden ? a.id - b.id : a.orden - b.orden
          );

        setMenuResponse(sortedMenus);
        setError(null);
      } catch (error) {
        console.error("Error fetching menu data:", error);
        if (error.response) {
          const message =
            ERROR_MESSAGES_GENERICS_API[error.response.status] ||
            ERROR_MESSAGES_GENERICS_API.default;
          setError({
            type: "error",
            message,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuData();
  }, [apiUrl]);

  const normalizedComponentMap = Object.fromEntries(
    Object.entries(componentMap).map(([key, value]) => [
      key.toLowerCase(),
      value,
    ])
  );

  const transformedMenu = menuResponse.map((menu) => ({
    label: menu.nombreCorto,
    ...(menu.submenus.length > 0
      ? {
          children: menu.submenus.map((submenu) => ({
            label: submenu.nombreCorto,
            element: normalizedComponentMap[
              submenu.nombreCorto.toLowerCase()
            ] || <p>{submenu.nombreCorto}</p>,
          })),
        }
      : {
          element: normalizedComponentMap[menu.nombreCorto.toLowerCase()] || (
            <p>{menu.nombreCorto}</p>
          ),
        }),
  }));

  const menuConfig = {
    selectedValue: defaultSelectedValue,
    isVertical,
  };

  return {
    menu: transformedMenu,
    menuConfig,
    isLoading,
    error,
    rawMenuData: menuResponse,
  };
};

export default useMenuData;
