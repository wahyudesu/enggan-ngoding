import Sandbox from '@e2b/code-interpreter';
import {
  openai,
  createAgent,
  createTool,
  createNetwork,
} from '@inngest/agent-kit';

import { inngest } from './client';
import z from 'zod';
import { getSandbox, lastAssistantTextMessageContent } from './utils';
import { PROMPT } from '../../prompt/better-prompt';

export const helloWorld = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'test/hello.world' },
  async ({ event, step }) => {
    const sandboxId = await step.run('get-sandbox-id', async () => {
      const sandbox = await Sandbox.create('vibe-nextjs-test-2');
      return sandbox.sandboxId;
    });

    const codeAgent = createAgent({
      name: 'code-agent',
      description: 'An expert coding agent',
      system: PROMPT,
      model: openai({
        model: 'gpt-4o',
        apiKey: process.env.OPENAI_API_KEY,
        baseUrl: "https://ai.sumopod.com/v1",
        defaultParameters: {
          temperature: 0.1,
        },
      }),
      tools: [
        createTool({
          name: 'terminal',
          description: 'Run a terminal command in the sandbox',
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run('terminal', async () => {
              const buffers = { stdout: '', stderr: '' };
              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data;
                  },
                });
                return result.stdout;
              } catch (e) {
                console.error(
                  `Command failed: ${e} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`,
                );
                return `Command failed: ${e} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
              }
            });
          },
        }),
        createTool({
          name: 'createOrUpdateFiles',
          description: 'Create or update files in the sandbox',
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              }),
            ),
          }),
          handler: async (
            { files },
            { step, network },
          ) => {
            return await step?.run('createOrUpdateFiles', async () => {
              try {
                const updatedFiles = network?.state.data.files || {};
                const sandbox = await getSandbox(sandboxId);
                for (const file of files) {
                  await sandbox.files.write(file.path, file.content);
                  updatedFiles[file.path] = file.content;
                }
                
                // Update network state
                if (network?.state?.data) {
                  network.state.data.files = updatedFiles;
                }
                
                console.log('Created/Updated files:', Object.keys(updatedFiles));
                return `Successfully created/updated ${Object.keys(updatedFiles).length} files: ${Object.keys(updatedFiles).join(', ')}`;
              } catch (e) {
                console.error('Error in createOrUpdateFiles:', e);
                return "Error: " + e;
              }
            });
          },
        }),
        createTool({
          name: 'readFiles',
          description: 'Read files from the sandbox',
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run('readFiles', async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }
                return JSON.stringify(contents);
              } catch (e) {
                return 'Error' + e;
              }
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText =
            lastAssistantTextMessageContent(result);

          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes('<task_summary>')) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }

          return result;
        }
      },
    });

    const network = createNetwork({
      name: 'coding-agent-network',
      agents: [codeAgent],
      maxIter: 15,
      router: async ({ network }) => {
        // Initialize state if not exists
        if (!network.state.data) {
          network.state.data = { files: {}, summary: null };
        }
        if (!network.state.data.files) {
          network.state.data.files = {};
        }

        const summary = network.state.data.summary;

        if (summary) {
          console.log('Network router: Summary found, stopping');
          return;
        }

        console.log('Network router: Returning codeAgent');
        return codeAgent;
      },
    });

    console.log('Running network with input:', event.data.value);
    const result = await network.run(event.data.value);
    console.log('Network result:', result);
    console.log('Network state files:', result.state.data.files);

    const sandboxUrl = await step.run('get-sandbox-url', async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    return {
      url: sandboxUrl,
      title: 'Fragment',
      files: result.state.data.files || {},
      summary: result.state.data.summary,
    };
  },
);
