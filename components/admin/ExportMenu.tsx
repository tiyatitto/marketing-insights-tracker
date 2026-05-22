"use client";

import React, { useState } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { motion, AnimatePresence } from "framer-motion";

interface ExportMenuProps {
    data: any[];
    filters: any;
    filename?: string;
}

export function ExportMenu({ data, filters, filename = "Marketing_Reports" }: ExportMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    const formatDataForExport = () => {
        return data.map(r => ({
            "Report ID": r.id,
            "Staff": r.staff || r.creatorName,
            "Activity": r.activity,
            "Institution": r.institution || r.name,
            "Event Date": r.eventDate || r.date,
            "Created Date": r.date,
            "Cost": r.cost,
            "Observation": r.observation || r.remarks || ""
        }));
    };

    const handleExportExcel = () => {
        const formattedData = formatDataForExport();
        const ws = XLSX.utils.json_to_sheet(formattedData);
        
        // Add Filters metadata to sheet (optional advanced: multi-sheet or top header)
        // Here we just export the table as the primary sheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Reports");

        const filtersData = [
            ["Applied Filters"],
            ["Staff/Marketeer", filters.staff || "All"],
            ["From Date", filters.fromDate || "All"],
            ["To Date", filters.toDate || "All"],
            ["Activity", filters.activity || "All"]
        ];
        const wsFilters = XLSX.utils.aoa_to_sheet(filtersData);
        XLSX.utils.book_append_sheet(wb, wsFilters, "Filters & Metadata");

        XLSX.writeFile(wb, `${filename}.xlsx`);
        setIsOpen(false);
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text("Marketing Insights - Report Export", 14, 22);
        
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
        
        const formattedData = formatDataForExport();
        const tableColumn = Object.keys(formattedData[0] || {});
        const tableRows = formattedData.map(row => Object.values(row));

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [79, 70, 229] } // Indigo-600
        });

        doc.save(`${filename}.pdf`);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
            >
                <Download className="w-4 h-4" />
                Export Data
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden"
                        >
                            <div className="py-1">
                                <button 
                                    onClick={handleExportExcel}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors text-left"
                                >
                                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                                    Export as Excel
                                </button>
                                <button 
                                    onClick={handleExportPDF}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors text-left"
                                >
                                    <FileText className="w-4 h-4 text-rose-500" />
                                    Export as PDF
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
