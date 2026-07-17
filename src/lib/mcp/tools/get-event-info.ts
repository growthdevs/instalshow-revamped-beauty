import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_event_info",
  title: "Get event info",
  description: "Return public information about the Instal Show 2026 event: dates, location, edition, and description.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const info = {
      name: "Instal Show 2026",
      edition: "2ª Edição",
      dates: "25 e 26 de Junho de 2026",
      location: "Arca - São Paulo, SP, Brasil",
      description:
        "A maior feira e congresso de instalações elétricas, hidráulicas, ar condicionado e proteção contra incêndios do Brasil.",
      website: "https://instalshow.com.br",
      audience: {
        professionals: "3.800+",
        companies: "300+",
        states: 25,
      },
    };
    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
      structuredContent: info,
    };
  },
});
