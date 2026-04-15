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
  Preview,
} from "@react-email/components";

type InquiryConfirmationProps = {
  name: string;
};

export default function InquiryConfirmation({
  name,
}: InquiryConfirmationProps) {
  return (
    <Html lang="cs">
      <Head />
      <Preview>Děkuji za vaši poptávku!</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Děkuji za poptávku!</Heading>

          <Text style={text}>Ahoj {name},</Text>

          <Text style={text}>
            děkuji za vaši poptávku. Přijala jsem ji a ozvu se vám co nejdříve
            — většinou do 24 hodin.
          </Text>

          <Text style={text}>
            Mezitím se můžete podívat na mé portfolio nebo si přečíst, jak
            spolupráce se mnou probíhá:
          </Text>

          <Section style={linksSection}>
            <Link href="https://kristinafoto.cz/portfolio" style={link}>
              Portfolio
            </Link>
            {" · "}
            <Link href="https://kristinafoto.cz/sluzby-a-ceny" style={link}>
              Služby a ceny
            </Link>
            {" · "}
            <Link href="https://kristinafoto.cz/o-mne" style={link}>
              O mně
            </Link>
          </Section>

          <Hr style={hr} />

          <Text style={signature}>
            S pozdravem,
            <br />
            Kristýna Bulíčková
            <br />
            <Link href="https://kristinafoto.cz" style={link}>
              kristinafoto.cz
            </Link>
          </Text>
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
  lineHeight: "1.6",
};

const linksSection = {
  marginTop: "16px",
};

const link = {
  color: "#d6336c",
  textDecoration: "underline",
};

const hr = {
  borderColor: "#e5e5e5",
  margin: "24px 0",
};

const signature = {
  fontSize: "14px",
  color: "#737373",
  lineHeight: "1.6",
};
