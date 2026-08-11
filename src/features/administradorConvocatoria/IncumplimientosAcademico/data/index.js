export const initialResponseState = {
  loading: false,
  error: false,
  message: null,
};

export const initialModalState = {
  isOpen: false,
  action: "",
};

export const initialContextState = {
  academic: null,
  serviceResponse: initialResponseState,
  modal: initialModalState,
  breaches: [],
  breachesToDelete: [],
  breachesToUpdate: [],
  conditions: [],
};
