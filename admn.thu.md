GET /notifications/payments (Admin endpoint to get payment notifications)


// Request
// Headers:
{
  "Authorization": "Bearer <admin_token>"
}

// Query Parameters (optional):
{
  "page": "1",      // default: 1
  "limit": "10"     // default: 10
}

// Response (200 OK)
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "notification123",
        "orderId": "order123",
        "type": "NEW_PAYMENT",
        "status": "UNREAD",
        "details": {
          "orderNumber": "ORD-123456",
          "amount": 5000,
          "paymentReference": "PAY-123456",
          "consumerName": "John Doe"
        },
        "createdAt": "2024-03-20T10:30:00Z"
      }
      // ... more notifications
    ],
    "total": 5
  }
}

// Error Response (500 Internal Server Error)
{
  "success": false,
  "message": "Failed to get payment notifications"
}





PATCH /notifications/:notificationId/mark-read (Admin endpoint to mark notification as read)




// Request
// Headers:
{
  "Authorization": "Bearer <admin_token>"
}

// URL Parameters:
{
  "notificationId": "notification123"
}

// Response (200 OK)
{
  "success": true,
  "message": "Notification marked as read"
}

// Error Response (500 Internal Server Error)
{
  "success": false,
  "message": "Failed to mark notification as read"
}





