"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Award, CheckCircle } from "lucide-react"

interface CertificateProps {
  type: "blood-donation" | "volunteer"
  name: string
  date: string
  details?: string
}

export function CertificateGenerator({ type, name, date, details }: CertificateProps) {
  const certRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    try {
      const { jsPDF } = await import("jspdf")
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })

      const width = doc.internal.pageSize.getWidth()
      const height = doc.internal.pageSize.getHeight()

      // Background
      doc.setFillColor(255, 255, 255)
      doc.rect(0, 0, width, height, "F")

      // Border
      doc.setDrawColor(34, 139, 34)
      doc.setLineWidth(3)
      doc.rect(10, 10, width - 20, height - 20)
      doc.setDrawColor(200, 200, 200)
      doc.setLineWidth(0.5)
      doc.rect(15, 15, width - 30, height - 30)

      // Header
      doc.setFontSize(14)
      doc.setTextColor(100, 100, 100)
      doc.text("Community Health Platform", width / 2, 35, { align: "center" })

      // Title
      doc.setFontSize(32)
      doc.setTextColor(34, 139, 34)
      doc.text("Certificate of Appreciation", width / 2, 55, { align: "center" })

      // Subtext
      doc.setFontSize(14)
      doc.setTextColor(80, 80, 80)
      doc.text("This certificate is proudly presented to", width / 2, 75, { align: "center" })

      // Name
      doc.setFontSize(28)
      doc.setTextColor(20, 20, 20)
      doc.text(name, width / 2, 95, { align: "center" })

      // Line under name
      doc.setDrawColor(34, 139, 34)
      doc.setLineWidth(0.5)
      doc.line(width / 2 - 60, 100, width / 2 + 60, 100)

      // Description
      doc.setFontSize(12)
      doc.setTextColor(80, 80, 80)
      const descText =
        type === "blood-donation"
          ? "For the generous contribution of blood donation, helping save lives in our community."
          : "For outstanding volunteer service in community cleaning drives, making our environment healthier."

      doc.text(descText, width / 2, 115, { align: "center", maxWidth: 200 })

      if (details) {
        doc.setFontSize(10)
        doc.text(details, width / 2, 130, { align: "center" })
      }

      // Date
      doc.setFontSize(11)
      doc.setTextColor(100, 100, 100)
      doc.text(`Date: ${new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, width / 2, 150, { align: "center" })

      // Signature lines
      doc.setDrawColor(150, 150, 150)
      doc.setLineWidth(0.3)
      doc.line(60, 170, 130, 170)
      doc.line(width - 130, 170, width - 60, 170)

      doc.setFontSize(9)
      doc.text("Platform Director", 95, 177, { align: "center" })
      doc.text("Community Coordinator", width - 95, 177, { align: "center" })

      // Verification
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      const verifCode = `CERT-${Date.now().toString(36).toUpperCase()}`
      doc.text(`Verification Code: ${verifCode}`, width / 2, height - 20, { align: "center" })

      doc.save(`certificate-${type}-${name.replace(/\s+/g, "-").toLowerCase()}.pdf`)
    } catch (error) {
      // Fallback: Print-based approach
      if (certRef.current) {
        const printWindow = window.open("", "_blank")
        if (printWindow) {
          printWindow.document.write(`<html><head><title>Certificate</title></head><body>${certRef.current.innerHTML}</body></html>`)
          printWindow.document.close()
          printWindow.print()
        }
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-500" />
          {type === "blood-donation" ? "Blood Donation Certificate" : "Volunteer Certificate"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Certificate Preview */}
        <div
          ref={certRef}
          className="border-4 border-green-600 rounded-lg p-8 text-center bg-white dark:bg-gray-950 mb-4"
        >
          <p className="text-sm text-muted-foreground">Community Health Platform</p>
          <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mt-2">Certificate of Appreciation</h2>
          <p className="text-sm text-muted-foreground mt-4">This certificate is proudly presented to</p>
          <p className="text-3xl font-bold mt-2 border-b-2 border-green-600 inline-block pb-1 px-8">{name}</p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-500" />
            {type === "blood-donation"
              ? "For generous blood donation, helping save lives in our community."
              : "For outstanding volunteer service in community cleaning drives."}
          </div>
          {details && <p className="text-xs text-muted-foreground mt-2">{details}</p>}
          <p className="text-sm text-muted-foreground mt-4">
            Date: {new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <Button onClick={handleDownload} className="w-full">
          <Download className="h-4 w-4 mr-2" /> Download Certificate (PDF)
        </Button>
      </CardContent>
    </Card>
  )
}
