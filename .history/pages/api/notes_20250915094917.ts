import type {NextApiRequest, NextApiResponse} from 'next';

type Note = {
    id: number;
    text: string;
};

let notes: