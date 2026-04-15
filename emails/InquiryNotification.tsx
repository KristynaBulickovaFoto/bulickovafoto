import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Preview,
} from "@react-email/components";

type InquiryNotificationProps = {
  name: string;
  email: string;
  phone?: string;
  shootType: string;
  preferredDate?: string;
  location?: string;
  duration?: string;
  message: string;
  preferredContact: string;
};

const shootTypeLabels: Record<string, string> = {
  wedding: "Svatba",
  concert: "Koncert / kapela",
  portrait: "Portrét",
  couple: "Párové focení",
  family: "Rodinné focení",
  other: "Jiné",
};

const contactLabels: Record<string, string> = {
  email: "E-mail",
  phone: "Telefon",
  whatsapp: "WhatsApp",
};

export default function InquiryNotification({
  name,
  email,
  phone,
  shootType,
  preferredDate,
  location,
  duration,
  message,
  preferredContact,
}: InquiryNotificationProps) {
  return (
    <Html lang="cs">
      <Head />
      <Preview>Nová poptávka od {name}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Nová poptávka</Heading>
          <Text style={text}>
            Přišla nová poptávka z webu kristinafoto.cz.
          </Text>

          <Section style={detailsSection}>
            <Text style={detailRow}>
              <strong>Jméno:</strong> {name}
            </Text>
            <Text style={detailRow}>
              <strong>E-mail:</strong> {email}
            </Text>
            {phone && (
              <Text style={detailRow}>
                <strong>Telefon:</strong> {phone}
              </Text>
            )}
            <Text style={detailRow}>
              <strong>Typ focení:</strong>{" "}
              {shootTypeLabels[shootType] ?? shootType}
            </Text>
            {preferredDate && (
              <Text style={detailRow}>
                <strong>Datum:</strong> {preferredDate}
              </Text>
            )}
            {location && (
              <Text style={detailRow}>
                <strong>Místo:</strong> {location}
              </Text>
            )}
            {duration && (
              <Text style={detailRow}>
                <strong>Časový rozsah:</strong> {duration}
              </Text>
            )}
            <Text style={detailRow}>
              <strong>Preferovaný kontakt:</strong>{" "}
              {contactLabels[preferredContact] ?? preferredContact}
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={label}>Zpráva:</Text>
          <Text style={messageStyle}>{message}</Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#fafafa",
  fontFamily: "Inter, -apple-system, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "40px auto",
  padding: "32px",
  borderRadius: "8px",
  maxWidth: "560px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "700" as const,
  color: "#0a0a0a",
  marginBottom: "16px",
};

const text = {
  fontSize: "14px",
  color: "#525252",
  lineHeight: "1.5",
};

const detailsSection = {
  backgroundColor: "#fafafa",
  padding: "16px",
  borderRadius: "6px",
  marginTop: "16px",
};

const detailRow = {
  fontSize: "14px",
  color: "#0a0a0a",
  lineHeight: "1.6",
  margin: "4px 0",
};

const hr = {
  borderColor: "#e5e5e5",
  margin: "24px 0",
};

const label = {
  fontSize: "14px",
  fontWeight: "600" as const,
  color: "#0a0a0a",
  marginBottom: "8px",
};

const messageStyle = {
  fontSize: "14px",
  color: "#525252",
  lineHeight: "1.6",
  whiteSpace: "pre-wrap" as const,
};
