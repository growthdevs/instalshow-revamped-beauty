import { defineMcp } from "@lovable.dev/mcp-js";
import getEventInfo from "./tools/get-event-info";
import listExhibitors from "./tools/list-exhibitors";
import getContactInfo from "./tools/get-contact-info";

export default defineMcp({
  name: "instalshow-mcp",
  title: "Instal Show MCP",
  version: "0.1.0",
  instructions:
    "Public MCP server for Instal Show 2026, a Brazilian trade fair for electrical, hydraulic, HVAC and fire-protection installations. Use `get_event_info` for dates, location and audience stats; `list_exhibitors` for the confirmed companies; `get_contact_info` for phone, WhatsApp, email and address.",
  tools: [getEventInfo, listExhibitors, getContactInfo],
});
