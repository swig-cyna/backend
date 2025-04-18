import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Button,
  Img,
  Link,
  Tailwind,
} from "@react-email/components"
import { FC } from "react"

interface PaymentReceiptEmailProps {
  username: string
  orderNumber: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  date: string
}

const PaymentReceiptEmail: FC<Readonly<PaymentReceiptEmailProps>> = ({
  username,
  orderNumber,
  items,
  total,
  date,
}) => {
  return (
    <Html>
      <Head />
      <Preview>Reçu de votre commande sur CYNA #{orderNumber}</Preview>
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
                Merci pour votre commande, {username}!
              </Heading>
              <Text className="text-gray-300 mb-6">
                Voici le reçu de votre commande #{orderNumber} du {date}.
              </Text>

              <Section className="bg-gray-700 rounded-md p-4 mb-6">
                <Heading className="text-xl font-bold text-white mb-4 text-left">
                  Détails de la commande
                </Heading>

                <div className="bg-gray-600 rounded-t-md p-3 mb-1">
                  <Row>
                    <Column
                      className="text-left text-gray-300 font-semibold"
                      width="50%"
                    >
                      Produit
                    </Column>
                    <Column
                      className="text-center text-gray-300 font-semibold"
                      width="25%"
                    >
                      Quantité
                    </Column>
                    <Column
                      className="text-right text-gray-300 font-semibold"
                      width="25%"
                    >
                      Prix
                    </Column>
                  </Row>
                </div>

                {items.map((item, index) => (
                  <div
                    key={index}
                    className={`bg-gray-700 p-3 ${index !== items.length - 1 ? "border-b border-gray-600" : ""}`}
                  >
                    <Row>
                      <Column className="text-left text-gray-300" width="50%">
                        {item.name}
                      </Column>
                      <Column className="text-center text-gray-300" width="25%">
                        x{item.quantity}
                      </Column>
                      <Column className="text-right text-gray-300" width="25%">
                        {item.price.toFixed(2)} €
                      </Column>
                    </Row>
                  </div>
                ))}

                <div className="bg-gray-600 rounded-b-md p-3 mt-1">
                  <Row>
                    <Column
                      className="text-left text-white font-bold"
                      width="50%"
                    >
                      Total
                    </Column>
                    <Column width="25%"></Column>
                    <Column
                      className="text-right text-white font-bold"
                      width="25%"
                    >
                      {total.toFixed(2)} €
                    </Column>
                  </Row>
                </div>
              </Section>

              <Text className="text-gray-300 mb-6">
                Si vous avez des questions concernant votre commande, n'hésitez
                pas à nous contacter.
              </Text>

              <Text className="text-gray-400 mt-6 text-sm">
                Merci de votre confiance.
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

export default PaymentReceiptEmail
