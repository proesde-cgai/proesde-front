import ReactDOM from 'react-dom';
import styles from './styles/Modal.module.css';

/**
 * Modal component
 * 
 * @param {Object} props
 * @param {string} props.title - Título del modal
 * @param {boolean} props.isOpen - Propiedad para saber si el modal es visible
 * @param {function(): void} props.onClose - Función para abrir o cerrar el componente
 * @param {string} props.width - Propiedad del ancho para el modal
 * @param {boolean} props.withFooter - Propiedad para mostrar o no el footer por defecto se true
 * @param {boolean} props.showCloseButton - Propiedad para mostrar o no el botón de cerrar (x) por defecto es true
 * @param {boolean} props.hideBorders - Propiedad para ocultar los bordes del header y footer por defecto es false
 * @param {React.ReactNode} props.children - Elemento HTMl que sera el contenido del modal
 */
const Modal = ({
  title = '', isOpen, onClose, width = '700px', withFooter = true, showCloseButton = true, hideBorders = false, children,
}) => {

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const headerClassName = hideBorders ? `${styles.header} ${styles.headerNoBorder}` : styles.header;
  const footerClassName = hideBorders ? `${styles.footer} ${styles.footerNoBorder}` : styles.footer;

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal} style={{ width }}>
        {/* Header */}
        <div className={headerClassName}>
          <h2 className={styles.headerTitle}>{title}</h2>
          {showCloseButton && (
            <button onClick={onClose} className={styles.closeButton}>&times;</button>
          )}
        </div>

        {/* Content */}
        <div className={styles.content}>
          {children}
        </div>

        {/* Footer */}
        {withFooter && (
          <div className={footerClassName}>
            <button
              onClick={onClose}
              className={styles.cancelButton}
            >Cerrar</button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
