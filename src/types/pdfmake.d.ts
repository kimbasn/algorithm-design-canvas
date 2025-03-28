declare module 'pdfmake/build/pdfmake' {
    interface TCreatedPdf {
        download(filename?: string): void;
        open(): void;
        getBuffer(callback: (buffer: Buffer) => void): void;
    }

    interface PdfMakeStatic {
        createPdf(docDefinition: TDocumentDefinitions): TCreatedPdf;
        vfs: any;
    }

    const pdfMake: PdfMakeStatic;
    export default pdfMake;
}

declare module 'pdfmake/build/vfs_fonts' {
    const pdfFonts: {
        pdfMake: {
            vfs: any;
        };
    };
    export default pdfFonts;
}

declare module 'pdfmake/interfaces' {
    export interface TDocumentDefinitions {
        pageSize?: string;
        pageOrientation?: 'portrait' | 'landscape';
        content?: any[];
        styles?: Record<string, any>;
        defaultStyle?: Record<string, any>;
    }
} 