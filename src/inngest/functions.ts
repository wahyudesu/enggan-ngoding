import { Sandbox } from "@e2b/code-interpreter";
import { openai, createAgent, createTool } from "@inngest/agent-kit"

import { inngest } from "./client";
import { getSandbox } from "./utils";
import z from "zod";

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        const sandboxId = await step.run("get-sandbox-id", async () => {
            const sandbox = await Sandbox.create("vibe-nextjs-test-2");
            return sandbox.sandboxId;
        });

        const codeAgent = createAgent({
            name: "code-agent",
            system: "You are an expert Next.js developer. You write readable, maintainable code. You write simple Next.js & React snippets.",
            model: openai({ model: "gpt-4o" }),
            tools: [
            createTool({
                name: "terminal",
                description: z.object({
                command: z.string(),
            }),
            handler: async (
                { command }: { command: string },
                { step }: { step: any }
            ) => {
                return await step.run("terminal", async () => {
                    const buffers = { stdout: "", stderr: "" };
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
                        `Command failed: ${e} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`
                    );
                    return `Command failed: ${e} \nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
                    }
                });
            },
        }),
            createTool({
                name: "createOrUpdateFiles",
                description: "Create or update files in the sandbox",
                parameters: z.object({
                    files: z.array(
                        z.object({
                            path: z.string(),
                            content: z.string(),
                        })
                    ),
                }),
                handler: async (
                    { files }: { files: { path: string; content: string }[] },
                    { step, network }: { step: any, network: any }
                ) => {
                    return await step?.run("createOrUpdateFiles", async () => {
                        try {
                            const updatedFiles = network.state.data.files || {};
                            const sandbox = await getSandbox(sandboxId);
                            for (const file of files) {
                                await sandbox.files.write(file.path, file.content);
                                updatedFiles[file.path] = file.content;
                            }
                            return Object.keys(updatedFiles);
                        } catch (e) {
                            console.error(e);
                            return [];
                        }
                    });
                },
            }),
            createTool({
                name: "readFiles",
                description: "Read files from the sandbox",
                parameters: z.object({
                    files: z.array(z.string()),
                }),
                handler: async ({ files }, { step }) => {
                    return await step?.run("readFiles", async () => {
                        try {
                            const sandbox = await getSandbox(sandboxId);
                            const contents = [];
                            for (const file of files) {
                                const content = await sandbox.files.read(file);
                                contents.push({ paht: file, content });
                            }
                            return JSON.stringify(contents);
                        } catch (e) {
                            return "Error" + e;
                        }
                    });
                },
            }),
            ],
        });

        const { output } = await codeAgent.run(
            `Write the following snippet: ${event.data.value}`,
        );

        const sandboxUrl = await step.run("get-sandbox-url", async () => {
            const sandbox = await getSandbox(sandboxId);
            const host = sandbox.getHost(3000);
            return `https://${host}`;
        });

        return { output, sandboxUrl};
    }
);