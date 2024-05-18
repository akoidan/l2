import * as yup from 'yup';
import { InferType } from 'yup';


const urlsSchema = yup.object({
  sags: yup.array().of(yup.string()).required(),
  bish: yup.array().of(yup.string()).required(),
}).required();

const receiverSchema = yup.object({
  destination: yup.string().optional(),
  id: yup.string().optional(),
  run: yup.object().optional(),
  keySend: yup.string().optional(),
}).required();
const keySendSchema = yup.string();
const combinationSchema = yup.object({
  receivers: yup.array().of(receiverSchema),
  shortCut: yup.string().required(),
  circular: yup.boolean().required()
}).required();


export const rootSchema = yup.object({
  urls: urlsSchema,
  combinations: yup.array().of(combinationSchema).required()
});

export type KeySend = InferType<typeof keySendSchema>;

export type ConfigCombination = InferType<typeof combinationSchema>
export type ConfigUrl = InferType<typeof urlsSchema>
export type Receiver = InferType<typeof receiverSchema>
export type ConfigData = InferType<typeof rootSchema>;


