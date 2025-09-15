import type {NextApiRequest, NextApiResponse} from 'next';

type Note = {
    id: number;
    text: string;
};

let notes: Note[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        res.status(200).json(notes);
    }

    if (req.method === 'POST') {
        const {text} = req.body;
        const newNote: Note = {
            id: Date.now(),
            text,
        };
        notes.push(newNote);
        return res.status(201).json(newNote);
    }

    
