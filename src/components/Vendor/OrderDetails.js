import React from 'react'
import { Table, Button } from 'react-bootstrap'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const OrderDetails = ({ order }) => {
  if (!order) {
    return null // Don't render anything if no order is selected
  }

  // Function to handle PDF download
  const downloadPDF = () => {
    const doc = new jsPDF()

    // Title
    doc.text(`Order Details - Order ID: ${order.id}`, 14, 10)

    // Table content in the PDF
    doc.autoTable({
      startY: 20,
      head: [['No', 'Product', 'Quantity', 'Amount', 'Total Amount']],
      body: (order.products || []).map((product, index) => [
        index + 1,
        product.name,
        product.quantity,
        `Rs. ${product.amount}`,
        `Rs. ${product.total}`,
      ]),
    })

    // Add the totals at the bottom of the table
    const finalY = doc.lastAutoTable.finalY + 10
    doc.text(`Sub Total: Rs. ${order.subTotal}`, 14, finalY)
    doc.text(`Shipping: Rs. 255`, 14, finalY + 10)
    doc.text(`Total: Rs. ${order.total}`, 14, finalY + 20)

    // Save the generated PDF
    doc.save(`Order_${order.id}.pdf`)
  }

  return (
    <div>
      <h4 className="mt-3">Orders ID: {order.id}</h4>
      <p>
        Customer Name: <strong>{order.customer}</strong>
      </p>

      {/* Table with order details */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>No</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Amount</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {(order.products || []).map((product, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
              <td>{`Rs. ${product.amount}`}</td>
              <td>{`Rs. ${product.total}`}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Display Sub Total, Shipping, and Total */}
      <div className="mt-3">
        <h5>Sub Total: Rs. {order.subTotal}</h5>
        <h5>Shipping: Rs. 255</h5>
        <h5>Total: Rs. {order.total}</h5>
      </div>

      {/* Accept and Reject Buttons */}
      <Button variant="success" className="mr-2">
        Accept
      </Button>
      <Button variant="danger">Reject</Button>

      {/* PDF Download */}
      <Button
        variant="outline-secondary"
        className="mt-2"
        onClick={downloadPDF}
      >
        Download PDF
      </Button>
    </div>
  )
}

export default OrderDetails
