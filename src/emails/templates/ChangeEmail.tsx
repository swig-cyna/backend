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

interface ChangeEmail {
  username: string
  newEmail: string
  validationLink: string
}

const ChangeEmail: FC<ChangeEmail> = ({
  username,
  newEmail,
  validationLink,
}) => {
  return (
    <Html>
      <Head />
      <Preview>CYNA - Confirmation de changement d'adresse e-mail</Preview>
      <Tailwind>
        <Body className="bg-gray-900 font-sans">
          <Container className="mx-auto max-w-[600px] p-8">
            <Section className="bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <Img
                src="https://urlr.me/dSTRe"
                alt="CYNA Logo"
                width="150"
                height="auto"
                className="mx-auto mb-6"
              />
              <Heading className="text-2xl font-bold text-white mb-4">
                Confirmation de changement d'adresse e-mail
              </Heading>
              <Text className="text-gray-300 mb-6">Bonjour {username},</Text>
              <Text className="text-gray-300 mb-6">
                Une demande de changement d'adresse e-mail a été effectuée pour
                votre compte. La nouvelle adresse e-mail demandée est :{" "}
                {newEmail}
              </Text>
              <Text className="text-gray-300 mb-6">
                Si vous êtes à l'origine de cette demande, veuillez cliquer sur
                le bouton ci-dessous pour confirmer le changement :
              </Text>
              <Button
                className="bg-[#302082] text-white font-semibold py-3 px-6 rounded-md hover:bg-[#3f2ba6] transition-colors"
                href={validationLink}
              >
                Confirmer le changement d'adresse
              </Button>
              <Text className="text-gray-400 mt-6 text-sm">
                Si vous n'avez pas initié ce changement, veuillez ignorer cet
                e-mail ou contacter notre support.
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

export default ChangeEmail
