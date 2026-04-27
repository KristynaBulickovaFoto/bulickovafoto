import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
  Button,
  Img,
  Preview,
} from "@react-email/components";

type ClientGalleryReadyProps = {
  clientName: string;
  galleryTitle: string;
  galleryDescription?: string | null;
  portalUrl: string;
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.kristynafoto.cz";

export default function ClientGalleryReady({
  clientName,
  galleryTitle,
  galleryDescription,
  portalUrl,
}: ClientGalleryReadyProps) {
  return (
    <Html lang="cs">
      <Head />
      <Preview>Vaše galerie {galleryTitle} je připravená</Preview>
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
            <Heading style={heading}>Vaše fotky jsou připravené!</Heading>

            <Text style={text}>Ahoj {clientName},</Text>

            <Text style={text}>
              Právě jsem pro vás připravila galerii{" "}
              <strong style={strong}>{galleryTitle}</strong>. Podívejte se na
              fotky v klientské zóně — přihlásíte se magickým odkazem na váš
              e-mail, žádné heslo není potřeba.
            </Text>

            {galleryDescription && (
              <Text style={description}>{galleryDescription}</Text>
            )}

            <Section style={buttonSection}>
              <Button href={portalUrl} style={ctaButton}>
                Otevřít galerii
              </Button>
            </Section>

            <Text style={fallback}>
              Nefunguje tlačítko? Zkopírujte tento odkaz:
            </Text>
            <Text style={fallbackUrl}>
              <Link href={portalUrl} style={link}>
                {portalUrl}
              </Link>
            </Text>

            <Text style={signature}>
              S pozdravem,
              <br />
              <strong style={strong}>Kristýna Foto</strong>
            </Text>
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
  margin: "0 0 16px",
  textAlign: "center" as const,
  lineHeight: "1.3",
};

const text = {
  fontSize: "14px",
  color: "#525252",
  lineHeight: "1.7",
  margin: "0 0 12px",
};

const description = {
  fontSize: "14px",
  color: "#737373",
  lineHeight: "1.6",
  fontStyle: "italic" as const,
  borderLeft: "3px solid #e8306d",
  paddingLeft: "12px",
  margin: "16px 0",
};

const buttonSection = {
  textAlign: "center" as const,
  margin: "28px 0 12px",
};

const ctaButton = {
  backgroundColor: "#e8306d",
  color: "#ffffff",
  padding: "14px 32px",
  borderRadius: "999px",
  fontSize: "14px",
  fontWeight: "600" as const,
  textDecoration: "none",
  display: "inline-block",
};

const fallback = {
  fontSize: "12px",
  color: "#a3a3a3",
  lineHeight: "1.5",
  textAlign: "center" as const,
  margin: "16px 0 4px",
};

const fallbackUrl = {
  fontSize: "11px",
  color: "#a3a3a3",
  textAlign: "center" as const,
  wordBreak: "break-all" as const,
  margin: "0 0 16px",
};

const signature = {
  fontSize: "14px",
  color: "#737373",
  lineHeight: "1.7",
  margin: "16px 0 8px",
};

const strong = {
  color: "#0a0a0a",
  fontWeight: "600" as const,
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
