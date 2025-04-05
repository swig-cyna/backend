import { render } from "@react-email/components"
import { createElement } from "react"
import { Resend } from "resend"
import env from "@/env"
import VerificationEmail from "./templates/VerificationEmail"
import PasswordResetEmail from "./templates/PasswordResetEmail"
import ChangeEmail from "./templates/ChangeEmail"
import { User } from "better-auth"

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
