import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_contact_info",
  title: "Get contact info",
  description: "Return contact information for the Instal Show organization (phone, email, location, WhatsApp).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const contact = {
      phone: "+55 11 96383-0660",
      whatsapp: "https://wa.me/5511963830660",
      email: "atendimento@instalshow.com.br",
      location: "Arca - São Paulo, SP, Brasil",
      website: "https://instalshow.com.br",
    };
    return {
      content: [{ type: "text", text: JSON.stringify(contact, null, 2) }],
      structuredContent: contact,
    };
  },
});
