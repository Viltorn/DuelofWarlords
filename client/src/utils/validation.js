import * as Yup from 'yup';

export const userName = Yup.object().shape({
  username: Yup.string().required('Required'),
});

export const chatsSchema = (chatIds) => Yup.object({
  phone: Yup
    .number('OnlyNumber').integer('OnlyNumber')
    .required('Required')
    .notOneOf(chatIds, 'Unique'),
});
