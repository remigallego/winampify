import uuidv1 from "uuid/v1";

export const generateExplorerId = () => {
  return `explorer_${uuidv1()}`;
};
