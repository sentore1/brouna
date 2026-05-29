interface KPayPaymentRequest {
  msisdn: string
  email: string
  details: string
  refid: string
  amount: number
  currency: string
  cname: string
  cnumber: string
  pmethod: string
  retailerid: string
  returl: string
  redirecturl: string
  bankid: string
}

export class KPayService {
  private baseUrl = process.env.KPAY_BASE_URL || 'https://pay.esicia.com'
  private username = process.env.KPAY_USERNAME!
  private password = process.env.KPAY_PASSWORD!
  private retailerId = process.env.KPAY_RETAILER_ID!

  private getAuthHeader() {
    const credentials = Buffer.from(`${this.username}:${this.password}`).toString('base64')
    return `Basic ${credentials}`
  }

  async initiatePayment(paymentData: Omit<KPayPaymentRequest, 'retailerid'>) {
    const requestData = {
      ...paymentData,
      retailerid: this.retailerId,
      action: 'pay'
    }

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.getAuthHeader()
      },
      body: JSON.stringify(requestData)
    })

    return response.json()
  }

  async checkStatus(refid: string) {
    const requestData = {
      refid,
      action: 'checkstatus'
    }

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.getAuthHeader()
      },
      body: JSON.stringify(requestData)
    })

    return response.json()
  }
}