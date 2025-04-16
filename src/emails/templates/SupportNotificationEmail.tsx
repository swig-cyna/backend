import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"
import { FC } from "react"

interface SupportTicketEmailProps {
  userName: string
  userEmail: string
  ticket: {
    id: number
    title: string
    theme: string
    description: string
  }
}

const SupportTicketEmail: FC<SupportTicketEmailProps> = ({
  userName,
  userEmail,
  ticket,
}) => {
  return (
    <Html>
      <Head />
      <Preview>
        Nouveau ticket #{ticket.id.toString()} - {ticket.theme} - {ticket.title}
      </Preview>
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
                Nouveau ticket de support (#{ticket.id})
              </Heading>
              <Text className="text-gray-300 mb-6">
                <strong>Client :</strong> {userName}
              </Text>
              <Text className="text-gray-300 mb-6">
                <strong>Email :</strong> {userEmail}
              </Text>
              <Text className="text-gray-300 mb-6">
                <strong>Sujet :</strong> {ticket.title}
              </Text>
              <Text className="text-gray-300 mb-6">
                <strong>Catégorie :</strong> {ticket.theme}
              </Text>

              <Section className="bg-gray-50/70 rounded-lg p-5 mb-8 mt-8">
                <Text className="font-semibold mb-2">Message du client :</Text>
                <Text className="text-gray-600 whitespace-pre-wrap">
                  {ticket.description}
                </Text>
              </Section>

              <Button
                href={`mailto:${userEmail}?subject=Réponse à votre ticket "${ticket.title}"&body=Bonjour ${userName},`}
                className="bg-[#302082] text-white font-semibold py-3 px-6 rounded-md"
              >
                Répondre au client
              </Button>
            </Section>

            <Section className="mt-8 text-center">
              <Text className="text-gray-400 text-sm">
                CYNA - Support Technique
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default SupportTicketEmail
