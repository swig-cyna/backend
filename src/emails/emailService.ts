import env from "@/env"
import { render } from "@react-email/components"
import { User } from "better-auth"
import { createElement } from "react"
import { Resend } from "resend"
import ChangeEmail from "./templates/ChangeEmail"
import PasswordResetEmail from "./templates/PasswordResetEmail"
import PaymentReceiptEmail from "./templates/PaymentReceiptEmail"
import SupportTicketEmail from "./templates/SupportNotificationEmail"
import VerificationEmail from "./templates/VerificationEmail"

const resend = new Resend(env.RESEND_API_KEY)

export const sendVerificationEmail = async (
  userEmail: string,
  username: string,
  verificationLink: string,
) => {
  try {
    await resend.emails.send({
      from: "test@ralex.app",
      to: userEmail,
      subject: "CYNA - Vérifiez votre adresse e-mail",
      html: await render(
        createElement(VerificationEmail, { username, verificationLink }),
      ),
    })
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail de vérification:", error)
  }
}

export const sendPasswordResetEmail = async (
  userEmail: string,
  username: string,
  resetLink: string,
) => {
  try {
    await resend.emails.send({
      from: "test@ralex.app",
      to: userEmail,
      subject: "CYNA - Réinitialisez votre mot de passe",
      html: await render(
        createElement(PasswordResetEmail, { username, resetLink }),
      ),
    })
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'e-mail de réinitialisation de mot de passe:",
      error,
    )
  }
}

export const sendChangeEmail = async (
  user: User,
  newEmail: string,
  validationLink: string,
) => {
  try {
    await resend.emails.send({
      from: "test@ralex.app",
      to: user.email,
      subject: "CYNA - Notification de changement d'adresse e-mail",
      html: await render(
        createElement(ChangeEmail, {
          username: user.name,
          newEmail,
          validationLink,
        }),
      ),
    })
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'e-mail de notification de changement d'adresse:",
      error,
    )
  }
}

export const sendSupportTicketEmail = async (
  userName: string,
  userEmail: string,
  ticket: {
    id: number
    title: string
    theme: string
    description: string
  },
) => {
  try {
    await resend.emails.send({
      from: "test@ralex.app",
      to: env.SUPPORT_EMAIL,
      subject: `#${ticket.id} [${ticket.theme}] - ${ticket.title}`,
      html: await render(
        createElement(SupportTicketEmail, {
          userName,
          userEmail,
          ticket,
        }),
      ),
    })
  } catch (error) {
    console.error("Erreur lors de l'envoi du ticket au support:", error)
  }
}

export const sendPaymentReceiptEmail = async (
  userEmail: string,
  username: string,
  orderDetails: {
    orderNumber: string
    items: Array<{
      name: string
      quantity: number
      price: number
    }>
    total: number
    date: string
  },
) => {
  try {
    await resend.emails.send({
      from: "test@ralex.app",
      to: userEmail,
      subject: `CYNA - Reçu de votre commande #${orderDetails.orderNumber}`,
      html: await render(
        createElement(PaymentReceiptEmail, {
          username,
          ...orderDetails,
        }),
      ),
    })
  } catch (error) {
    console.error("Erreur lors de l'envoi du reçu de paiement:", error)
  }
}
