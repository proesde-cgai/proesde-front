import { MessageWarning } from "../../components/MessageWarning";

const TextSuggestion = ({ styles, dataAcademic }) => {
  if (dataAcademic) return null;

  return (
    <MessageWarning>
      Introduzca el código del académico y oprima el botón "Continuar".
    </MessageWarning>
  );
}

export default TextSuggestion;