import { defineTool } from "@lovable.dev/mcp-js";

const exhibitors = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  name: `Expositor ${i + 1}`,
}));

export default defineTool({
  name: "list_exhibitors",
  title: "List exhibitors",
  description: "List the companies confirmed as exhibitors at Instal Show 2026.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(exhibitors, null, 2) }],
    structuredContent: { total: exhibitors.length, exhibitors },
  }),
});
