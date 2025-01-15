export type Module = {
    id: string;
    title: string;
    description: string;
    pages: ModulePage[];
};

export type ContentSection = {
    type: 'paragraph' | 'list';
    content: string | string[];
};
  
export type ModulePage = {
    id: string;
    title: string;
    content: ContentSection[];
};