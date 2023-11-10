import * as Yup from 'yup';

export const userName = Yup.object().shape({
  username: Yup
    .string()
    .required('Required')
    .min(3, 'Min3Max10')
    .max(10, 'Min3Max10'),
});

export const password = Yup.object().shape({
  password: Yup
    .string()
    .required('Required')
    .min(3, 'Min3Max10')
    .max(10, 'Min3Max10'),
});

export const chatsSchema = (chatIds) => Yup.object({
  phone: Yup
    .number('OnlyNumber').integer('OnlyNumber')
    .required('Required')
    .notOneOf(chatIds, 'Unique'),
});
