type Day = {
    mood: number;
    date: string;
    note: string;
};

type Calendar = Day[];

type Mood = {
    id: number;
    name: string;
    url: string;
    quote: string;
};
