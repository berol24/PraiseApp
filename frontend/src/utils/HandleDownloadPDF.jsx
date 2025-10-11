import { jsPDF } from "jspdf";  
  
  export const handleDownloadPDF = (mesChants,sortedStructure) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const margin = 20;
    let y = margin;

    // En-tête principale
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 120);
    doc.text(mesChants.titre, 105, y, { align: "center" });

    y += 12;
    doc.setDrawColor(40, 40, 120);
    doc.setLineWidth(0.5);
    doc.line(40, y, 170, y);
    y += 10;

    // Informations principales
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    doc.setFont("helvetica", "bold");
    doc.text("Auteur :", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(mesChants.auteur || "—", margin + 30, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Langue :", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(mesChants.langue || "—", margin + 30, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Rythme :", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(mesChants.rythme || "—", margin + 30, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Catégories :", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(mesChants.categories.join(", ") || "—", margin + 30, y);
    y += 15;

    //  Ligne de séparation avant les paroles
    doc.setDrawColor(180, 180, 180);
    doc.line(margin, y, 210 - margin, y);
    y += 10;

    //  Section des paroles
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 120);
    doc.text("Paroles du chant", 105, y, { align: "center" });
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    const lineHeight = 8;

    sortedStructure.forEach(({ type, numero, contenu }) => {
      if (y > 270) {
        doc.addPage();
        y = margin;
      }

      // Sous-titre du couplet/refrain
      doc.setFont("helvetica", "bold");
      doc.setTextColor(40, 40, 120);
      doc.text(`${type} ${numero}`, margin, y);
      y += 6;

      // Paroles
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      const lines = doc.splitTextToSize(contenu, 170);
      lines.forEach((line) => {
        if (y > 270) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });

      y += 4;
    });

    //  Pied de page
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text(`Page ${i} / ${pageCount}`, 200 - margin, 290);
    }

    doc.save(`${mesChants.titre.replace(/\s+/g, "_")}_Paroles.pdf`);
  };