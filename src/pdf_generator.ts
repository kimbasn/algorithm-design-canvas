import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

interface Idea {
    description: string;
    timeComplexity: string;
    spaceComplexity: string;
    ideaId: string;
}

interface CanvasData {
    code: string;
    constraints: string;
    ideas: Idea[];
    testCases: string;
    problemName: string;
}

export function generatePDFFromCanvas(canvasData: CanvasData): pdfMake.TCreatedPdf {
    const docDefinition: TDocumentDefinitions = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        content: [
            {
                columns: [
                    // Left Column (Sidebar)
                    {
                        width: '40%',
                        stack: [
                            // Constraints Section
                            {
                                stack: [
                                    {
                                        text: 'Constraints',
                                        style: 'sectionHeader',
                                        icon: 'list-check'
                                    },
                                    {
                                        text: canvasData.constraints || '',
                                        style: 'content'
                                    }
                                ]
                            },
                            // Ideas Section
                            {
                                stack: [
                                    {
                                        text: 'Ideas',
                                        style: 'sectionHeader',
                                        icon: 'lightbulb'
                                    },
                                    ...generateIdeasContent(canvasData.ideas)
                                ]
                            },
                            // Test Cases Section
                            {
                                stack: [
                                    {
                                        text: 'Test Cases',
                                        style: 'sectionHeader',
                                        icon: 'vial'
                                    },
                                    {
                                        text: canvasData.testCases || '',
                                        style: 'content'
                                    }
                                ]
                            }
                        ]
                    },
                    // Right Column (Code)
                    {
                        width: '60%',
                        stack: [
                            {
                                text: 'Code',
                                style: 'sectionHeader',
                                icon: 'code'
                            },
                            {
                                text: canvasData.code || '// No code available',
                                style: 'codeContent'
                            }
                        ]
                    }
                ]
            }
        ],
        styles: {
            sectionHeader: {
                fontSize: 14,
                bold: true,
                margin: [0, 0, 0, 10],
                color: '#000000'
            },
            content: {
                fontSize: 11,
                lineHeight: 1.5,
                margin: [0, 0, 0, 15],
                color: '#000000'
            },
            codeContent: {
                font: 'Courier',
                fontSize: 11,
                lineHeight: 1.5,
                margin: [0, 0, 0, 15],
                color: '#000000'
            },
            ideaDescription: {
                fontSize: 11,
                lineHeight: 1.5,
                margin: [0, 0, 0, 5],
                color: '#000000'
            },
            complexityItem: {
                fontSize: 10,
                lineHeight: 1.4,
                margin: [0, 0, 0, 5],
                color: '#000000'
            }
        },
        defaultStyle: {
            font: 'Helvetica'
        }
    };

    return pdfMake.createPdf(docDefinition);
}

function generateIdeasContent(ideas: Idea[]): TDocumentDefinitions['content'] {
    if (!ideas || !ideas.length) return [];

    return ideas.map(idea => ({
        columns: [
            {
                width: '70%',
                text: idea.description || '',
                style: 'ideaDescription'
            },
            {
                width: '30%',
                stack: [
                    {
                        text: idea.timeComplexity || 'Time Complexity',
                        style: 'complexityItem'
                    },
                    {
                        text: idea.spaceComplexity || 'Space Complexity',
                        style: 'complexityItem'
                    }
                ]
            }
        ]
    }));
} 