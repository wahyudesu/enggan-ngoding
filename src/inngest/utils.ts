import Sandbox from '@e2b/code-interpreter';

export async function getSandbox(sandboxId: string) {
  const sandbox = await Sandbox.connect(sandboxId);
  return sandbox;
}

// Define AgentResult and TextMessage types if not already imported
type TextMessage = { role: string; content: string | { text: string }[] };
type AgentResult = { output: TextMessage[] };

export function lastAssistantTextMessageContent(result: AgentResult) {
  const lastAssistantTextMessageIndex = result.output.findLastIndex(
    (message: any) => message.role === 'assistant',
  );

  const message = result.output[lastAssistantTextMessageIndex] as
    | TextMessage
    | undefined;

  return message?.content
    ? typeof message.content === 'string'
      ? message.content
      : message.content.map((c) => c.text).join('')
    : undefined;
}
