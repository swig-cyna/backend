import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"
import { FC } from "react"

interface VerificationEmailProps {
  username: string
  verificationLink: string
}

const VerificationEmail: FC<Readonly<VerificationEmailProps>> = ({
  username,
  verificationLink,
}) => {
  return (
    <Html>
      <Head />
      <Preview>CYNA - Vérifiez votre adresse e-mail</Preview>
      <Tailwind>
        <Body className="bg-gray-900 font-sans">
          <Container className="mx-auto max-w-[600px] p-8">
            <Section className="bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <Img
                src="https://urlr.me/dSTRe"
                alt="CYNA Logo"
                width="150"
                height="50"
                className="mx-auto mb-6"
              />
              <Heading className="text-2xl font-bold text-white mb-4">
                Vérification de votre e-mail
              </Heading>
              <Text className="text-gray-300 mb-6">Bonjour {username},</Text>
              <Text className="text-gray-300 mb-6">
                Merci d'avoir créé un compte chez CYNA. Pour finaliser votre
                inscription et sécuriser votre compte, veuillez vérifier votre
                adresse e-mail.
              </Text>
              <Button
                href={verificationLink}
                className="bg-[#302082] text-white font-semibold py-3 px-6 rounded-md hover:bg-[#3f2ba6] transition-colors"
              >
                Vérifier mon e-mail
              </Button>
              <Text className="text-gray-400 mt-6 text-sm">
                Si vous n'avez pas créé de compte, veuillez ignorer cet e-mail.
              </Text>
            </Section>
            <Section className="mt-8 text-center">
              <Text className="text-gray-400 text-sm">
                CYNA - Votre partenaire en cybersécurité
              </Text>
              <Link
                href="#"
                className="text-[#302082] hover:underline text-sm mx-2"
              >
                Site web
              </Link>
              <Link
                href="#"
                className="text-[#302082] hover:underline text-sm mx-2"
              >
                Politique de confidentialité
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default VerificationEmail
