import uuidv1 from "uuid/v1";

export const generateImagesId = () => {
  return `images_${uuidv1()}`;
};
