import type { Message } from "@/types/api-models";

export const renderStyledMessages = (msgs: Message[]) => {
  return `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .message { margin-bottom: 16px; max-width: 600px; }
        .user { background: #2563eb; color: white; border-radius: 8px; padding: 12px; margin-left: auto; }
        .ai { background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; }
        .timestamp { font-size: 10px; color: #6b7280; margin-top: 4px; }
        .sources { font-size: 12px; margin-top: 8px; padding-top: 8px; border-top: 1px solid #ddd; }
        .source-item { margin-bottom: 4px; }
      </style>
    </head>
    <body>
      ${msgs
        .map(
          (m) => `
          <div class="message ${m.type}">
            <div>${m.content}</div>
            ${
              m.sources && m.sources.length
                ? `<div class="sources">
                    <strong>Sources:</strong>
                    ${m.sources
                      .map((s, i) => `<div class="source-item">[${i + 1}] ${s}</div>`)
                      .join("")}
                   </div>`
                : ""
            }
            <div class="timestamp">${new Date(m.timestamp).toLocaleString()}</div>
          </div>
        `
        )
        .join("")}
    </body>
    </html>
  `;
};
