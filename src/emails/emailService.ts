import { render } from "@react-email/components"
import { createElement } from "react"
import { Resend } from "resend"
import VerificationEmail from "./templates/VerificationEmail"
import env from "@/env"

const resend = new Resend(env.RESEND_API_KEY)

export const sendVerificationEmail = async (
  userEmail: string,
  username: string,
  verificationLink: string,
) => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
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
