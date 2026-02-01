import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportToImage = async (element: HTMLElement, format: 'png' | 'jpg' = 'png') => {
    if (!element) return;

    try {
        const canvas = await html2canvas(element, {
            scale: 2, // Higher resolution
            useCORS: true,
            backgroundColor: null, // Transparent if png, or paper color
        });

        const link = document.createElement('a');
        link.download = `typewriter-export.${format}`;
        link.href = canvas.toDataURL(`image/${format === 'jpg' ? 'jpeg' : 'png'}`);
        link.click();
    } catch (err) {
        console.error('Export failed', err);
    }
};

export const exportToPDF = async (element: HTMLElement) => {
    if (!element) return;

    try {
        const canvas = await html2canvas(element, {
            scale: 2,
        });

        const imgData = canvas.toDataURL('image/png');
        // A4 dimensions in mm
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('typewriter-export.pdf');
    } catch (err) {
        console.error('PDF Export failed', err);
    }
};
