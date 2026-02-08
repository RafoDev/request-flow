import React from 'react'
import { renderToBuffer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

interface InvoiceData {
  invoiceNumber: string
  requestId: string
  workerName: string
  workerDNI: string
  plateNumber: string
  amount: number
  createdAt: Date
  approvedAt: Date
}

// Estilos para el PDF (movidos aquí)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '40%',
    fontWeight: 'bold',
  },
  value: {
    width: '60%',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderBottomStyle: 'solid',
    marginVertical: 15,
  },
  totalSection: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#000',
    borderTopStyle: 'solid',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#666',
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: '#000',
    borderTopStyle: 'solid',
    paddingTop: 10,
  },
  stamp: {
    marginTop: 30,
    padding: 10,
    backgroundColor: '#f0fdf4',
    borderWidth: 2,
    borderColor: '#22c55e',
    borderStyle: 'solid',
    borderRadius: 5,
  },
  stampText: {
    color: '#22c55e',
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  try {
    console.log('📄 Generating PDF for invoice:', data.invoiceNumber)

    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>FACTURA</Text>
            <Text style={styles.subtitle}>Solicitud de Combustible</Text>
          </View>

          {/* Información de la Factura */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información de la Factura</Text>
            <View style={styles.row}>
              <Text style={styles.label}>N° Factura:</Text>
              <Text style={styles.value}>{data.invoiceNumber}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Fecha de Emisión:</Text>
              <Text style={styles.value}>
                {data.approvedAt.toLocaleDateString('es-PE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>ID Solicitud:</Text>
              <Text style={styles.value}>{data.requestId.substring(0, 12)}...</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Información del Trabajador */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Datos del Trabajador</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Nombre:</Text>
              <Text style={styles.value}>{data.workerName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>DNI:</Text>
              <Text style={styles.value}>{data.workerDNI}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Placa del Vehículo:</Text>
              <Text style={styles.value}>{data.plateNumber}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Detalle */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalle</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Concepto:</Text>
              <Text style={styles.value}>Combustible para vehículo {data.plateNumber}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Fecha Solicitud:</Text>
              <Text style={styles.value}>
                {data.createdAt.toLocaleDateString('es-PE')}
              </Text>
            </View>
          </View>

          {/* Total */}
          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL:</Text>
              <Text style={styles.totalValue}>S/ {data.amount.toFixed(2)}</Text>
            </View>
          </View>

          {/* Sello de Aprobado */}
          <View style={styles.stamp}>
            <Text style={styles.stampText}>✓ APROBADO</Text>
            <Text style={[styles.stampText, { fontSize: 10, marginTop: 5 }]}>
              {data.approvedAt.toLocaleString('es-PE')}
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text>RequestFlow - Sistema de Gestión de Combustible</Text>
            <Text>Documento generado automáticamente</Text>
          </View>
        </Page>
      </Document>
    )
    
    const buffer = await renderToBuffer(doc)
    console.log('✅ PDF rendered, size:', buffer.length, 'bytes')

    return buffer
  } catch (error) {
    console.error('❌ Error generando PDF:', error)
    throw error
  }
}


export function generateInvoiceNumber(requestId: string): string {
  return `INV-${requestId.substring(0, 8).toUpperCase()}`
}