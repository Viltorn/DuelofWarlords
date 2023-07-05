import axios from 'axios';
import routes from '../routes.js';

const getAvatar = async (id, idinstance, api) => {
  const avatarRes = await axios
    .post(routes.getAvatarPath(idinstance, api), { chatId: id });
  const { urlAvatar } = avatarRes.data;
  console.log(urlAvatar);
  return urlAvatar;
};

export default getAvatar;
