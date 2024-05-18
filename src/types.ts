import * as yup from 'yup';
import { InferType } from 'yup';


const urlsSchema = yup.object({
  sags: yup.array().of(yup.string()).required(),
  bish: yup.array().of(yup.string()).required(),
}).required();

const keySendSchema = yup.string();
const combinationSchema = yup.object({
  receiver: yup.string().required(),
  shortCut: yup.string().required(),
  keySend: yup.string().required(),
  circular: yup.boolean().required()
}).required();
export const rootSchema = yup.object({
  urls: urlsSchema,
  combinations: yup.array().of(combinationSchema).required()
});

export type KeySend = InferType<typeof keySendSchema>;

export type ConfigCombination = InferType<typeof combinationSchema>
export type ConfigUrl = InferType<typeof urlsSchema>
export type ConfigData = InferType<typeof rootSchema>;


