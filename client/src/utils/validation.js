import * as Yup from 'yup';

export const userName = Yup.object().shape({
  username: Yup
    .string()
    .required('Required')
    .min(3, 'Min3Max10')
    .max(10, 'Min3Max10'),
});

export const passwordYup = Yup.object().shape({
  password: Yup
    .string()
    .optional()
    .min(3, 'Min3Max10')
    .max(10, 'Min3Max10'),
});

export const SignUpSchema = Yup.object().shape({
  username: Yup
    .string()
    .required('Required')
    .max(10, 'Min3Max10')
    .min(3, 'Min3Max10'),
  password: Yup
    .string()
    .required('Required')
    .min(6, 'Min6'),
  repeatpass: Yup
    .string()
    .required('Required')
    .oneOf([Yup.ref('password'), null], 'Identical'),
});

export const chatsSchema = (chatIds) => Yup.object({
  phone: Yup
    .number('OnlyNumber').integer('OnlyNumber')
    .required('Required')
    .notOneOf(chatIds, 'Unique'),
});
