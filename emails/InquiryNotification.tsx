import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Img,
  Link,
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

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.kristynafoto.cz";

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
          <Section style={accentBar} />

          <Section style={logoSection}>
            <Img
              src={`${SITE_URL}/logo.png`}
              alt="Kristýna Foto"
              width={140}
              style={logoImg}
            />
          </Section>

          <Section style={contentSection}>
            <Heading style={heading}>Nová poptávka</Heading>
            <Text style={intro}>
              Přišla nová poptávka z webu kristynafoto.cz.
            </Text>

            <Section style={detailsSection}>
              <Text style={detailRow}>
                <strong style={strong}>Jméno:</strong> {name}
              </Text>
              <Text style={detailRow}>
                <strong style={strong}>E-mail:</strong>{" "}
                <Link href={`mailto:${email}`} style={link}>
                  {email}
                </Link>
              </Text>
              {phone && (
                <Text style={detailRow}>
                  <strong style={strong}>Telefon:</strong>{" "}
                  <Link href={`tel:${phone}`} style={link}>
                    {phone}
                  </Link>
                </Text>
              )}
              <Text style={detailRow}>
                <strong style={strong}>Typ focení:</strong>{" "}
                {shootTypeLabels[shootType] ?? shootType}
              </Text>
              {preferredDate && (
                <Text style={detailRow}>
                  <strong style={strong}>Datum:</strong> {preferredDate}
                </Text>
              )}
              {location && (
                <Text style={detailRow}>
                  <strong style={strong}>Místo:</strong> {location}
                </Text>
              )}
              {duration && (
                <Text style={detailRow}>
                  <strong style={strong}>Časový rozsah:</strong> {duration}
                </Text>
              )}
              <Text style={detailRow}>
                <strong style={strong}>Preferovaný kontakt:</strong>{" "}
                {contactLabels[preferredContact] ?? preferredContact}
              </Text>
            </Section>

            <Text style={messageLabel}>Zpráva:</Text>
            <Text style={messageStyle}>{message}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              &copy; Kristýna Foto
            </Text>
            <Text style={footerLink}>
              <Link href={SITE_URL} style={link}>
                kristynafoto.cz
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#fafafa",
  fontFamily:
    "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  margin: "0",
  padding: "40px 16px",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  borderRadius: "16px",
  maxWidth: "560px",
  overflow: "hidden" as const,
  boxShadow: "0 2px 20px -4px rgba(0,0,0,0.06)",
};

const accentBar = {
  height: "4px",
  background: "linear-gradient(90deg,#e8306d,#f06292)",
};

const logoSection = {
  padding: "36px 32px 0",
  textAlign: "center" as const,
};

const logoImg = {
  display: "block",
  margin: "0 auto",
  height: "auto",
};

const contentSection = {
  padding: "28px 32px 8px",
};

const heading = {
  fontSize: "22px",
  fontWeight: "700" as const,
  color: "#0a0a0a",
  margin: "0 0 12px",
  textAlign: "center" as const,
  lineHeight: "1.3",
};

const intro = {
  fontSize: "14px",
  color: "#737373",
  lineHeight: "1.6",
  textAlign: "center" as const,
  margin: "0 0 20px",
};

const detailsSection = {
  backgroundColor: "#fef1f5",
  padding: "18px 20px",
  borderRadius: "12px",
  margin: "0 0 20px",
};

const detailRow = {
  fontSize: "14px",
  color: "#0a0a0a",
  lineHeight: "1.6",
  margin: "4px 0",
};

const strong = {
  color: "#0a0a0a",
  fontWeight: "600" as const,
};

const messageLabel = {
  fontSize: "13px",
  fontWeight: "600" as const,
  color: "#0a0a0a",
  margin: "8px 0 6px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};

const messageStyle = {
  fontSize: "14px",
  color: "#525252",
  lineHeight: "1.6",
  whiteSpace: "pre-wrap" as const,
  borderLeft: "3px solid #e8306d",
  paddingLeft: "12px",
  margin: "0 0 16px",
};

const hr = {
  borderColor: "#f0f0f0",
  margin: "0 32px",
};

const footer = {
  padding: "20px 32px 28px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "11px",
  color: "#c0c0c0",
  margin: "0",
  lineHeight: "1.5",
};

const footerLink = {
  fontSize: "11px",
  color: "#c0c0c0",
  margin: "6px 0 0",
};

const link = {
  color: "#e8306d",
  textDecoration: "underline",
};
